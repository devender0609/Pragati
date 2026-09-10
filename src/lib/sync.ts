// v0.19: two-way sync layer for Pragati.
//
// Behaviour upgrade vs v0.17/v0.18:
//   - PUSH local rows missing or older than cloud version (preserves local
//     records — never deletes silently).
//   - PULL cloud rows missing locally, writing them to localStorage.
//   - MERGE by id; when both sides exist, use `updatedAt` (where the type
//     carries one) to decide which wins. If only one side has updatedAt, the
//     row that does is treated as canonical. If neither side has updatedAt,
//     we DO NOT overwrite local — local edits are preserved (recorded as
//     "skipped" with a "conflict_no_timestamp" reason).
//   - Returns a structured summary the UI can render: pushed / pulled /
//     skipped / conflicts per collection.
//
// Status messages exposed to the UI:
//   "Cloud connected"     — Firebase enabled + signed in + no last error
//   "Local demo mode"     — Firebase not configured
//   "Unsynced changes"    — local rows missing in cloud OR pending background tick
//   "Last synced …"       — wall-clock of the most recent successful syncAll
//   "Sync failed"         — most recent syncAll surfaced errors

import {
  currentTeacher,
  firebaseStatusReason,
  isFirebaseEnabled,
} from './firebase';
import {
  loadAssignments,
  loadItemReviews,
  loadPilots,
  loadSessionFeedback,
  loadSessions,
  loadStudents,
  saveAssignment,
  saveItemReview,
  savePilot,
  saveSession,
  saveSessionFeedback,
  saveStudent,
} from './storage';
import {
  loadClassrooms,
  loadLastSyncedAt,
  saveClassroom,
  saveLastSyncedAt,
} from './classroomStore';
import {
  listAllAssignments,
  listAllClassrooms,
  listAllFeedback,
  listAllItemReviews,
  listAllPilots,
  listAllSessions,
  listAllStudents,
  upsertAssignment,
  upsertClassroom,
  upsertFeedback,
  upsertItemReview,
  upsertPilot,
  upsertSession,
  upsertStudent,
} from './cloudStore';
import type {
  AssessmentAssignment,
  ItemReview,
  PilotMetadata,
  Session,
  SessionFeedback,
  Student,
} from '../types';
import type { Classroom } from './cloudStore';
import { importStudentSubmissions, type ImportSummary } from './accessCodes';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type SyncCollection =
  | 'students'
  | 'sessions'
  | 'assignments'
  | 'pilots'
  | 'itemReviews'
  | 'studentFeedback'
  | 'classrooms';

export type SyncCounts = {
  pushed: number;
  pulled: number;
  skipped: number;
  conflicts: number;
};

export type SyncError = {
  collection: SyncCollection;
  rowId: string;
  message: string;
};

export type SyncResult =
  | {
      kind: 'ok';
      perCollection: Record<SyncCollection, SyncCounts>;
      totals: SyncCounts;
      errors: SyncError[];
      finishedAt: number;
      // v0.20: per-code submission-import summary (null when the import
      // step itself failed or was skipped).
      submissionImport: ImportSummary | null;
    }
  | {
      kind: 'skipped';
      reason: string;
      errors: SyncError[];
      finishedAt: number;
    }
  | {
      kind: 'error';
      reason: string;
      errors: SyncError[];
      finishedAt: number;
    };

export function allSyncCollections(): SyncCollection[] {
  return [
    'students',
    'sessions',
    'assignments',
    'pilots',
    'itemReviews',
    'studentFeedback',
    'classrooms',
  ];
}

function emptyCounts(): SyncCounts {
  return { pushed: 0, pulled: 0, skipped: 0, conflicts: 0 };
}

function emptyPerCollection(): Record<SyncCollection, SyncCounts> {
  return {
    students: emptyCounts(),
    sessions: emptyCounts(),
    assignments: emptyCounts(),
    pilots: emptyCounts(),
    itemReviews: emptyCounts(),
    studentFeedback: emptyCounts(),
    classrooms: emptyCounts(),
  };
}

function addCounts(a: SyncCounts, b: SyncCounts): SyncCounts {
  return {
    pushed: a.pushed + b.pushed,
    pulled: a.pulled + b.pulled,
    skipped: a.skipped + b.skipped,
    conflicts: a.conflicts + b.conflicts,
  };
}

// ---------------------------------------------------------------------------
// Merge helper
// ---------------------------------------------------------------------------
//
// Decide what to do with a row that exists in both local and cloud.
//
//   - both have updatedAt → newer wins (returns 'push' if local newer,
//     'pull' if cloud newer, 'skipped' if equal).
//   - only local has updatedAt → push (treat local as canonical).
//   - only cloud has updatedAt → pull.
//   - neither has updatedAt → mark as 'conflict' and leave local
//     untouched. The teacher can resolve manually by editing the row.

type MergeDecision = 'push' | 'pull' | 'skipped' | 'conflict';

function decideMerge(localTs: number | null, cloudTs: number | null): MergeDecision {
  if (localTs === null && cloudTs === null) return 'conflict';
  if (localTs === null && cloudTs !== null) return 'pull';
  if (localTs !== null && cloudTs === null) return 'push';
  if (localTs === cloudTs) return 'skipped';
  return (localTs as number) > (cloudTs as number) ? 'push' : 'pull';
}

// ---------------------------------------------------------------------------
// Per-collection sync
// ---------------------------------------------------------------------------

async function syncCollection<T>(
  collection: SyncCollection,
  config: {
    loadLocal: () => T[];
    writeLocal: (row: T) => void;
    listCloud: () => Promise<T[]>;
    upsertCloud: (row: T) => Promise<void>;
    rowId: (row: T) => string;
    rowUpdatedAt: (row: T) => number | null;
  },
  errors: SyncError[]
): Promise<SyncCounts> {
  const counts = emptyCounts();
  const localRows = config.loadLocal();
  let cloudRows: T[] = [];
  try {
    cloudRows = await config.listCloud();
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    errors.push({ collection, rowId: '*list*', message: msg });
    // Fall back to push-only behaviour for this collection.
    for (const row of localRows) {
      try {
        await config.upsertCloud(row);
        counts.pushed += 1;
      } catch (err) {
        const m = err instanceof Error ? err.message : String(err);
        errors.push({ collection, rowId: config.rowId(row), message: m });
      }
    }
    return counts;
  }

  const localById = new Map<string, T>();
  for (const row of localRows) localById.set(config.rowId(row), row);
  const cloudById = new Map<string, T>();
  for (const row of cloudRows) cloudById.set(config.rowId(row), row);

  // Walk the union of ids.
  const allIds = new Set<string>([...localById.keys(), ...cloudById.keys()]);

  for (const id of allIds) {
    const local = localById.get(id);
    const cloud = cloudById.get(id);
    try {
      if (local && !cloud) {
        // Local-only → push.
        await config.upsertCloud(local);
        counts.pushed += 1;
      } else if (!local && cloud) {
        // Cloud-only → pull.
        config.writeLocal(cloud);
        counts.pulled += 1;
      } else if (local && cloud) {
        const localTs = config.rowUpdatedAt(local);
        const cloudTs = config.rowUpdatedAt(cloud);
        const decision = decideMerge(localTs, cloudTs);
        if (decision === 'push') {
          await config.upsertCloud(local);
          counts.pushed += 1;
        } else if (decision === 'pull') {
          config.writeLocal(cloud);
          counts.pulled += 1;
        } else if (decision === 'skipped') {
          counts.skipped += 1;
        } else {
          counts.conflicts += 1;
        }
      }
    } catch (err) {
      const m = err instanceof Error ? err.message : String(err);
      errors.push({ collection, rowId: id, message: m });
    }
  }

  return counts;
}

// ---------------------------------------------------------------------------
// updatedAt accessors per type
// ---------------------------------------------------------------------------
// We never INVENT a timestamp — if the type doesn't carry one, we return null
// and the merge step records a conflict (preserves local).

const studentUpdatedAt = (s: Student): number | null =>
  // Students don't carry updatedAt; createdAt is a stable proxy.
  typeof s.createdAt === 'number' ? s.createdAt : null;

const sessionUpdatedAt = (s: Session): number | null =>
  // Completed sessions don't change; use completedAt or startedAt as canonical.
  typeof s.completedAt === 'number'
    ? s.completedAt
    : typeof s.startedAt === 'number'
      ? s.startedAt
      : null;

const assignmentUpdatedAt = (a: AssessmentAssignment): number | null =>
  typeof a.createdAt === 'number' ? a.createdAt : null;

const pilotUpdatedAt = (p: PilotMetadata): number | null =>
  typeof p.createdAt === 'number' ? p.createdAt : null;

const itemReviewUpdatedAt = (r: ItemReview): number | null =>
  typeof r.reviewedAt === 'number' ? r.reviewedAt : null;

const feedbackUpdatedAt = (f: SessionFeedback): number | null =>
  typeof f.submittedAt === 'number' ? f.submittedAt : null;

const classroomUpdatedAt = (c: Classroom): number | null =>
  typeof c.updatedAt === 'number'
    ? c.updatedAt
    : typeof c.createdAt === 'number'
      ? c.createdAt
      : null;

// ---------------------------------------------------------------------------
// syncAll
// ---------------------------------------------------------------------------

export async function syncAll(): Promise<SyncResult> {
  const now = () => Date.now();

  if (!isFirebaseEnabled()) {
    return {
      kind: 'skipped',
      reason:
        firebaseStatusReason() ??
        'Firebase is not configured. Running in local-only mode.',
      errors: [],
      finishedAt: now(),
    };
  }
  if (!currentTeacher()) {
    return {
      kind: 'skipped',
      reason: 'No teacher signed in.',
      errors: [],
      finishedAt: now(),
    };
  }

  const errors: SyncError[] = [];
  const perCollection = emptyPerCollection();

  // Students
  perCollection.students = await syncCollection<Student>(
    'students',
    {
      loadLocal: loadStudents,
      writeLocal: saveStudent,
      listCloud: listAllStudents,
      upsertCloud: upsertStudent,
      rowId: (r) => r.id,
      rowUpdatedAt: studentUpdatedAt,
    },
    errors
  );

  // Pilots
  perCollection.pilots = await syncCollection<PilotMetadata>(
    'pilots',
    {
      loadLocal: loadPilots,
      writeLocal: savePilot,
      listCloud: listAllPilots,
      upsertCloud: upsertPilot,
      rowId: (r) => r.id,
      rowUpdatedAt: pilotUpdatedAt,
    },
    errors
  );

  // Assignments
  perCollection.assignments = await syncCollection<AssessmentAssignment>(
    'assignments',
    {
      loadLocal: loadAssignments,
      writeLocal: saveAssignment,
      listCloud: listAllAssignments,
      upsertCloud: upsertAssignment,
      rowId: (r) => r.id,
      rowUpdatedAt: assignmentUpdatedAt,
    },
    errors
  );

  // Sessions
  perCollection.sessions = await syncCollection<Session>(
    'sessions',
    {
      loadLocal: loadSessions,
      writeLocal: saveSession,
      listCloud: listAllSessions,
      upsertCloud: upsertSession,
      rowId: (r) => r.id,
      rowUpdatedAt: sessionUpdatedAt,
    },
    errors
  );

  // Item reviews (keyed by itemId)
  perCollection.itemReviews = await syncCollection<ItemReview>(
    'itemReviews',
    {
      loadLocal: loadItemReviews,
      writeLocal: saveItemReview,
      listCloud: listAllItemReviews,
      upsertCloud: upsertItemReview,
      rowId: (r) => r.itemId,
      rowUpdatedAt: itemReviewUpdatedAt,
    },
    errors
  );

  // Session feedback (keyed by sessionId)
  perCollection.studentFeedback = await syncCollection<SessionFeedback>(
    'studentFeedback',
    {
      loadLocal: loadSessionFeedback,
      writeLocal: saveSessionFeedback,
      listCloud: listAllFeedback,
      upsertCloud: upsertFeedback,
      rowId: (r) => r.sessionId,
      rowUpdatedAt: feedbackUpdatedAt,
    },
    errors
  );

  // Classrooms (already two-way in v0.17; now goes through the same merge)
  perCollection.classrooms = await syncCollection<Classroom>(
    'classrooms',
    {
      loadLocal: loadClassrooms,
      writeLocal: saveClassroom,
      listCloud: listAllClassrooms,
      upsertCloud: upsertClassroom,
      rowId: (r) => r.id,
      rowUpdatedAt: classroomUpdatedAt,
    },
    errors
  );

  // Tally totals.
  const totals = (Object.values(perCollection) as SyncCounts[]).reduce(
    addCounts,
    emptyCounts()
  );

  // v0.20: also import student submissions from `accessCodes/{code}/submissions`
  // for every classroom this teacher owns that has a code. Imported sessions
  // count toward the `pulled` total so the sync summary surfaces them.
  let submissionImport: ImportSummary | null = null;
  try {
    submissionImport = await importStudentSubmissions();
    totals.pulled += submissionImport.imported;
    totals.skipped += submissionImport.skippedDuplicates;
    totals.conflicts += submissionImport.conflicts;
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    errors.push({ collection: 'sessions', rowId: '*import*', message: msg });
  }

  const finishedAt = now();
  if (errors.length === 0) {
    saveLastSyncedAt(finishedAt);
  }

  return {
    kind: 'ok',
    perCollection,
    totals,
    errors,
    finishedAt,
    submissionImport,
  };
}

// ---------------------------------------------------------------------------
// Backward-compatible thin shim: classrooms-only pull, kept for old callers
// ---------------------------------------------------------------------------

export async function pullClassrooms(): Promise<{
  pulled: number;
  kind: 'ok' | 'skipped' | 'error';
  message?: string;
}> {
  if (!isFirebaseEnabled()) {
    return {
      pulled: 0,
      kind: 'skipped',
      message: 'Firebase is not configured. Running in local-only mode.',
    };
  }
  if (!currentTeacher()) {
    return { pulled: 0, kind: 'skipped', message: 'No teacher signed in.' };
  }
  try {
    const remote = await listAllClassrooms();
    for (const c of remote) saveClassroom(c);
    return { pulled: remote.length, kind: 'ok' };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { pulled: 0, kind: 'error', message: msg };
  }
}

// ---------------------------------------------------------------------------
// "Are there unsynced local rows?" — used by the AccountMenu pill so the UI
// can show "Unsynced changes" instead of "Synced 5m ago" when something has
// changed since the last successful sync.
// ---------------------------------------------------------------------------

export function hasUnsyncedChanges(): boolean {
  const lastTs = loadLastSyncedAt();
  if (lastTs === null) {
    // Never synced — anything local is unsynced.
    return (
      loadStudents().length +
        loadSessions().length +
        loadAssignments().length +
        loadItemReviews().length +
        loadSessionFeedback().length +
        loadPilots().length +
        loadClassrooms().length >
      0
    );
  }
  // Use the strongest signal we have per type: any row with a timestamp
  // greater than lastTs is "new" relative to the last sync.
  const newer = (ts: number | null) => ts !== null && ts > lastTs;
  return (
    loadStudents().some((s) => newer(studentUpdatedAt(s))) ||
    loadSessions().some((s) => newer(sessionUpdatedAt(s))) ||
    loadAssignments().some((a) => newer(assignmentUpdatedAt(a))) ||
    loadItemReviews().some((r) => newer(itemReviewUpdatedAt(r))) ||
    loadSessionFeedback().some((f) => newer(feedbackUpdatedAt(f))) ||
    loadPilots().some((p) => newer(pilotUpdatedAt(p))) ||
    loadClassrooms().some((c) => newer(classroomUpdatedAt(c)))
  );
}

// ---------------------------------------------------------------------------
// Re-export the last-sync helper for UI callers.
// ---------------------------------------------------------------------------

export function lastSyncedAt(): number | null {
  return loadLastSyncedAt();
}

// ---------------------------------------------------------------------------
// v0.18+ background auto-sync (unchanged behaviour, two-way under the hood)
// ---------------------------------------------------------------------------

const DEFAULT_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

let autoSyncHandle: ReturnType<typeof setInterval> | null = null;

export function startAutoSync(intervalMs: number = DEFAULT_INTERVAL_MS): void {
  if (typeof window === 'undefined') return;
  if (autoSyncHandle !== null) return;
  if (!isFirebaseEnabled()) return;

  const tick = async () => {
    if (typeof document !== 'undefined' && document.visibilityState !== 'visible') {
      return;
    }
    if (!currentTeacher()) return;
    try {
      await syncAll();
    } catch {
      // Errors are surfaced via the UI on manual sync; don't crash.
    }
  };

  autoSyncHandle = setInterval(tick, intervalMs);
}

export function stopAutoSync(): void {
  if (autoSyncHandle !== null) {
    clearInterval(autoSyncHandle);
    autoSyncHandle = null;
  }
}
