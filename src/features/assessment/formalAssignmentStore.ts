// v0.58 §7 + §8 + §12 — Formal assignment record and store.
//
// WHY THE v0.57 RECORD WAS TOO THIN
//
// `GrowthAssignment` carried classroom, window, dates. That is enough
// for a practice assignment and nowhere near enough for formal
// assessment: a form assigned today must remain interpretable after the
// item bank, blueprint, framework, or scoring code has changed.
//
// FROZEN FORM STRATEGY (§12)
//
// Option A — a frozen form — is chosen for the pilot. The assignment
// stores the exact item IDs and their order, so every student in the
// window sits the same form and a bank edit tomorrow cannot alter an
// assignment made today.
//
// Option B (deterministic reassembly from a seed) was rejected for the
// pilot: it reassembles per launch, so a bank change between two
// students in the same window could hand them different forms while
// both records claim the same blueprint. Reproducing a form months
// later would also require replaying the exact bank state. A frozen
// list is larger but unambiguous, and at pilot scale size is not a
// constraint.

import type { Grade } from '../../types';
import type { GrowthContext } from './growthEligibility';
import type { GrowthWindow } from './growthSession';
import type { AssessmentConfigurationSnapshot } from './assessmentGovernance';

export type FormalAssignmentStatus =
  | 'scheduled'
  | 'active'
  | 'expired'
  | 'cancelled';

/** The frozen form. Item IDs only — never item CONTENT, which would
 *  put secure stems into UI-visible assignment metadata. */
export type FrozenForm = {
  formId: string;
  itemIdsInOrder: string[];
  assemblyVersion: string;
  assembledAt: number;
  /** Blueprint coverage achieved at assembly time. */
  coverageSummary: Array<{ domainId: string; items: number }>;
};

export type StudentSupportConfiguration = {
  studentId: string;
  supportIds: string[];
};

export type FormalGrowthAssignment = {
  assignmentId: string;
  classroomId: string;
  targetGrade: Grade;
  /** Field test, never operational, for the foreseeable pilot. */
  context: GrowthContext;
  purpose: 'pilot_field_test';

  frameworkId: string;
  frameworkVersion: string;
  administrationSpecificationId: string;
  administrationSpecificationVersion: string;
  blueprintId: string;
  blueprintVersion: string;
  itemBankVersion: string;
  language: string;

  opensAt: number;
  closesAt: number;
  /** v0.60 — the testing window this sitting belongs to. Needed for
   *  management display and for any future window comparison. */
  window: GrowthWindow;

  supportPolicyVersion: string;
  supportsByStudent: StudentSupportConfiguration[];

  /**
   * v0.60 §9 — the roster FROZEN at assignment time.
   *
   * Eligibility must not follow live classroom membership: a student
   * added to the class mid-window would otherwise silently acquire a
   * form assembled for a cohort they were not part of, and a student
   * removed would lose access to a sitting already in progress.
   */
  assignedStudentIds: string[];
  rosterFrozenAt: number;

  routerId: string;
  routerVersion: string;
  reportingVersion: string;

  form: FrozenForm;
  configurationSnapshot: AssessmentConfigurationSnapshot;
  configurationCreatedAt: number;
  status: FormalAssignmentStatus;
};

/**
 * v0.61 §3 — what the STUDENT side of the formal flow is allowed to see.
 *
 * Deliberately derived from `FormalGrowthAssignment` with `Pick`, not
 * redeclared. If the formal record is renamed or restructured, this
 * breaks at compile time rather than drifting into a parallel shape —
 * which is precisely how the legacy `GrowthAssignment` came to sit in
 * active formal UI for four iterations.
 *
 * It carries NO item IDs, no blueprint, no roster, and no coverage:
 * a student card needs to know that an assignment exists, not what is
 * in it.
 */
export type FormalAssignmentStudentView = Pick<
  FormalGrowthAssignment,
  'assignmentId'
>;

export function assignmentStatusAt(
  a: FormalGrowthAssignment,
  now: number
): FormalAssignmentStatus {
  if (a.status === 'cancelled') return 'cancelled';
  if (now < a.opensAt) return 'scheduled';
  if (now > a.closesAt) return 'expired';
  return 'active';
}

export function isAssignmentLive(
  a: FormalGrowthAssignment,
  now: number
): boolean {
  return assignmentStatusAt(a, now) === 'active';
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export type FormalAssignmentStore = {
  create(a: FormalGrowthAssignment): void;
  byClassroom(classroomId: string): FormalGrowthAssignment[];
  activeForClassroom(classroomId: string, now: number): FormalGrowthAssignment | null;
  cancel(assignmentId: string): void;
  all(): FormalGrowthAssignment[];
};

const STORAGE_KEY = 'pragati.formal_assignments.v1';

function read(): FormalGrowthAssignment[] {
  try {
    if (typeof localStorage === 'undefined') return [];
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as FormalGrowthAssignment[]) : [];
  } catch {
    return [];
  }
}

function write(rows: FormalGrowthAssignment[]): void {
  try {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rows));
  } catch {
    /* storage unavailable */
  }
}

/**
 * The real store. Kept separate from ordinary practice assignments:
 * reusing those semantics would lose the version snapshot and the
 * frozen form, which are the whole point.
 */
export const localFormalAssignmentStore: FormalAssignmentStore = {
  create(a) {
    write([...read().filter((x) => x.assignmentId !== a.assignmentId), a]);
  },
  byClassroom(classroomId) {
    return read().filter((a) => a.classroomId === classroomId);
  },
  activeForClassroom(classroomId, now) {
    return (
      read().find(
        (a) => a.classroomId === classroomId && isAssignmentLive(a, now)
      ) ?? null
    );
  },
  cancel(assignmentId) {
    write(
      read().map((a) =>
        a.assignmentId === assignmentId ? { ...a, status: 'cancelled' as const } : a
      )
    );
  },
  all: read,
};

/** In-memory store for tests and fixtures. */
export function createInMemoryStore(): FormalAssignmentStore {
  let rows: FormalGrowthAssignment[] = [];
  return {
    create(a) {
      rows = [...rows.filter((x) => x.assignmentId !== a.assignmentId), a];
    },
    byClassroom: (id) => rows.filter((a) => a.classroomId === id),
    activeForClassroom: (id, now) =>
      rows.find((a) => a.classroomId === id && isAssignmentLive(a, now)) ?? null,
    cancel(id) {
      rows = rows.map((a) =>
        a.assignmentId === id ? { ...a, status: 'cancelled' as const } : a
      );
    },
    all: () => rows,
  };
}

/**
 * The live assignment a student may sit.
 *
 * v0.60 §9/§10 — keyed on the FROZEN roster, not on live classroom
 * membership. `classroomId` is still accepted so callers need not
 * change, but it only narrows the search; the roster decides.
 */
export function activeAssignmentForStudent(
  store: FormalAssignmentStore,
  classroomId: string | null,
  now: number,
  studentId?: string
): FormalGrowthAssignment | null {
  const candidate = classroomId
    ? store.activeForClassroom(classroomId, now)
    : null;
  if (!candidate) return null;
  if (!studentId) return candidate;
  return (candidate.assignedStudentIds ?? []).includes(studentId)
    ? candidate
    : null;
}

// ---------------------------------------------------------------------------
// Creation — gated
// ---------------------------------------------------------------------------

export type CreateAssignmentResult =
  | { ok: true; assignment: FormalGrowthAssignment }
  | { ok: false; reasons: string[] };

/**
 * Create a formal assignment from a SUCCESSFUL preparation.
 *
 * Requires `ready: true` and an authorized framework, so production
 * cannot create one today. Tests supply an authorized preparation via
 * injection rather than by writing fake evidence into production data.
 */
export function createFormalAssignment(args: {
  preparation: {
    ready: boolean;
    form: Array<{ itemId: string; domainId: string }> | null;
    configuration: AssessmentConfigurationSnapshot;
    authorization: { authorized: boolean; frameworkVersion: string | null };
    context: GrowthContext;
  };
  classroomId: string;
  targetGrade: Grade;
  opensAt: number;
  closesAt: number;
  window?: GrowthWindow;
  supportsByStudent?: StudentSupportConfiguration[];
  /** §9 — roster snapshot. Required: an assignment with no roster
   *  cannot decide who may sit it. */
  assignedStudentIds: string[];
  newId: () => string;
  now: number;
}): CreateAssignmentResult {
  const {
    preparation, classroomId, targetGrade, opensAt, closesAt,
    supportsByStudent = [], assignedStudentIds, newId, now,
    window = 'mid_year',
  } = args;

  const reasons: string[] = [];
  if (!preparation.authorization.authorized) {
    reasons.push('The pilot framework is not approved.');
  }
  if (!preparation.ready || !preparation.form) {
    reasons.push('No field-test form could be assembled.');
  }
  if (closesAt <= opensAt) reasons.push('The testing window is empty.');
  if (assignedStudentIds.length === 0) {
    reasons.push('No students are on the roster for this class.');
  }
  if (reasons.length > 0) return { ok: false, reasons };

  const form = preparation.form!;
  const coverage = new Map<string, number>();
  for (const i of form) coverage.set(i.domainId, (coverage.get(i.domainId) ?? 0) + 1);

  const cfg = preparation.configuration;

  return {
    ok: true,
    assignment: {
      assignmentId: newId(),
      classroomId,
      targetGrade,
      context: preparation.context,
      purpose: 'pilot_field_test',
      frameworkId: 'pragati.math.framework',
      frameworkVersion: preparation.authorization.frameworkVersion ?? 'unknown',
      administrationSpecificationId: cfg.assessmentSpecificationId,
      administrationSpecificationVersion: cfg.assessmentSpecificationVersion,
      blueprintId: cfg.assessmentSpecificationId,
      blueprintVersion: cfg.blueprintVersion,
      itemBankVersion: cfg.itemBankVersion,
      language: cfg.language,
      opensAt,
      closesAt,
      window,
      supportPolicyVersion: 'supports-v1',
      supportsByStudent,
      assignedStudentIds: [...assignedStudentIds],
      rosterFrozenAt: now,
      routerId: cfg.routerId,
      routerVersion: cfg.routerVersion,
      reportingVersion: cfg.reportingVersion,
      form: {
        formId: newId(),
        // §12 — frozen. A bank edit tomorrow cannot change this.
        itemIdsInOrder: form.map((i) => i.itemId),
        assemblyVersion: cfg.blueprintVersion,
        assembledAt: now,
        coverageSummary: [...coverage].map(([domainId, items]) => ({ domainId, items })),
      },
      configurationSnapshot: cfg,
      configurationCreatedAt: now,
      status: 'scheduled',
    },
  };
}
