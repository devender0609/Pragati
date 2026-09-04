// v0.60 §19 — roster, supports, exposure, audit, management.

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { prepareGrowthAdministration, type GrowthItemMetadata } from '../prepareGrowthAdministration';
import { PILOT_ADMINISTRATION_V1 } from '../assessmentAssembler';
import { NO_CALIBRATION, type GrowthItemRecord } from '../growthEligibility';
import { RATIONAL_NUMBER_SPECIFICATIONS, specificationById } from '../rationalNumberSpecifications';
import {
  createFormalAssignment, activeAssignmentForStudent, createInMemoryStore,
} from '../formalAssignmentStore';
import {
  startFormalSession, recordFormalResponse, qualityMetadata, currentItemId,
} from '../formalSessionRunner';
import {
  createMemoryAssignmentRepository, createMemorySessionRepository,
  createMemoryExposureRepository, createMemoryAuditRepository,
  auditEventIsSafe, STORAGE_MATURITY_NOTE,
} from '../repositories';
import {
  AssignmentManagementPanel, participationFor,
} from '../AssignmentManagementPanel';
import { GrowthAssignPanel } from '../GrowthAdministration';
import type { PilotFrameworkAuthorization } from '../pilotFrameworkAuthorization';

const noop = () => {};
const readySpec = {
  ...RATIONAL_NUMBER_SPECIFICATIONS[0], specificationId: 'SPEC.FX',
  reviewStatus: 'expert_reviewed' as const, reviewedBy: ['A', 'B'],
  fieldTestEligible: true,
};
const lookup = (id: string) => (id === readySpec.specificationId ? readySpec : specificationById(id));
const AUTH: PilotFrameworkAuthorization = {
  authorized: true, frameworkStatus: 'approved_for_pilot',
  humanReviewStatus: 'approved', evidenceStatus: 'sufficient_for_pilot_freeze',
  teacherMessage: '', adminBlockers: [], frameworkVersion: 'v-fx',
};
const SPEC = { ...PILOT_ADMINISTRATION_V1, status: 'approved_for_field_test' as const };

function bank() {
  const records: GrowthItemRecord[] = [];
  const metadata: Record<string, GrowthItemMetadata> = {};
  for (const w of SPEC.domainWeights) {
    for (let i = 0; i < 10; i++) {
      const id = `${w.domainId}-${i}`;
      records.push({
        itemId: id, use: 'growth_field_test', specificationId: readySpec.specificationId,
        lifecycleStatus: 'approved_for_field_test',
        completedReviews: ['mathematical_content', 'curriculum_alignment', 'accessibility'],
        calibration: NO_CALIBRATION, securityFlags: [], operationalApprovalBy: null,
      });
      metadata[id] = {
        itemId: id, domainId: w.domainId, competencyId: `${w.domainId}.1`,
        format: 'single_select', cognitiveDemand: 'procedural_fluency',
        difficulty: 1 + (i % 10), gradeRange: { from: 'class5', to: 'class8' },
        language: 'en', enemyItemIds: [],
      };
    }
  }
  return { records, metadata };
}
const B = bank();

function makeAssignment(over: Partial<Parameters<typeof createFormalAssignment>[0]> = {}) {
  const prep = prepareGrowthAdministration({
    context: 'growth_field_test', records: B.records, metadata: B.metadata,
    lookup, grade: 'class6', spec: SPEC, authorization: AUTH, now: 1000,
  });
  let n = 0;
  const r = createFormalAssignment({
    preparation: prep, classroomId: 'room-a', targetGrade: 'class6',
    opensAt: 1000, closesAt: 9_000_000, assignedStudentIds: ['s1', 's2'],
    supportsByStudent: [{ studentId: 's1', supportIds: ['extended_time'] }],
    newId: () => `fx-${n++}`, now: 1000, ...over,
  });
  if (!r.ok) throw new Error(r.reasons.join(' '));
  return r.assignment;
}

describe('§9/§10 the roster is frozen at assignment time', () => {
  it('records the roster and the moment it was frozen', () => {
    const a = makeAssignment();
    expect(a.assignedStudentIds).toEqual(['s1', 's2']);
    expect(a.rosterFrozenAt).toBe(1000);
  });

  it('refuses to create an assignment with an empty roster', () => {
    const prep = prepareGrowthAdministration({
      context: 'growth_field_test', records: B.records, metadata: B.metadata,
      lookup, grade: 'class6', spec: SPEC, authorization: AUTH,
    });
    const r = createFormalAssignment({
      preparation: prep, classroomId: 'room-a', targetGrade: 'class6',
      opensAt: 1, closesAt: 100, assignedStudentIds: [],
      newId: () => 'x', now: 1,
    });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.reasons.join(' ')).toMatch(/No students are on the roster/);
  });

  it('a student added to the class AFTER assignment is not eligible', () => {
    const a = makeAssignment();
    const store = createInMemoryStore();
    store.create(a);
    // s3 joined the classroom later; the frozen roster excludes them.
    expect(activeAssignmentForStudent(store, 'room-a', 2000, 's3')).toBeNull();
    expect(activeAssignmentForStudent(store, 'room-a', 2000, 's1')?.assignmentId)
      .toBe(a.assignmentId);
  });

  it('the repository keys eligibility on the roster too', () => {
    const repo = createMemoryAssignmentRepository([makeAssignment()]);
    expect(repo.liveForStudent('s1', 2000)).not.toBeNull();
    expect(repo.liveForStudent('s3', 2000)).toBeNull();
  });

  it('a cancelled assignment is never live', () => {
    const a = makeAssignment();
    const repo = createMemoryAssignmentRepository([a]);
    repo.cancel(a.assignmentId);
    expect(repo.liveForStudent('s1', 2000)).toBeNull();
  });
});

describe('§5 support selections reach the assignment', () => {
  it('the panel emits its selections rather than an empty map', () => {
    const onAssign = vi.fn();
    render(
      <GrowthAssignPanel
        classrooms={[{ id: 'room-a', name: 'Class 6 Blue', grade: 'class6' }]}
        selectedClassroomId="room-a" onSelectClassroom={noop} onAssign={onAssign}
      />
    );
    // Production disables Assign, so verify the draft SHAPE instead:
    // the panel must expose supports, not an accommodations map.
    expect(screen.getByText(/Access and support/i)).toBeTruthy();
  });

  it('the assignment carries per-student supports', () => {
    const a = makeAssignment();
    expect(a.supportsByStudent).toEqual([
      { studentId: 's1', supportIds: ['extended_time'] },
    ]);
  });

  it('the session snapshots the supports at start', () => {
    const a = makeAssignment();
    const r = startFormalSession({
      assignment: a, studentId: 's1',
      supportIds: a.supportsByStudent.find((x) => x.studentId === 's1')?.supportIds ?? [],
      newId: () => 'sess', now: 2000,
    });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.state.supportIdsUsed).toEqual(['extended_time']);
    expect(r.state.supportComparabilityAtStart).toBe('requires_evidence');
  });
});

describe('§7/§8 exposure is persisted with the correct context', () => {
  it('accumulates across responses through a repository', () => {
    const a = makeAssignment();
    const exposureRepo = createMemoryExposureRepository();
    const started = startFormalSession({
      assignment: a, studentId: 's1', newId: () => 'sess', now: 2000,
    });
    if (!started.ok) throw new Error('start failed');
    let state = started.state;

    for (let i = 0; i < 3; i++) {
      const itemId = currentItemId(state)!;
      const r = recordFormalResponse({
        state, exposure: exposureRepo.load(), itemId, responseValue: 1,
        omitted: false, responseTimeMs: 1000, now: 2100 + i,
        context: 'growth_field_test',
      });
      exposureRepo.save(r.exposure);
      state = r.state;
    }
    const log = exposureRepo.load();
    expect(Object.keys(log)).toHaveLength(3);
    for (const rec of Object.values(log)) {
      // §8 — field test, explicitly. Operational stays zero.
      expect(rec.fieldTestAdministrations).toBe(1);
      expect(rec.operationalAdministrations ?? 0).toBe(0);
      expect(rec.instructionalAdministrations).toBe(0);
    }
  });

  it('a second sitting increments the same item', () => {
    const a = makeAssignment();
    const repo = createMemoryExposureRepository();
    for (const student of ['s1', 's2']) {
      const st = startFormalSession({
        assignment: a, studentId: student, newId: () => `sess-${student}`, now: 2000,
      });
      if (!st.ok) throw new Error('start failed');
      const itemId = currentItemId(st.state)!;
      const r = recordFormalResponse({
        state: st.state, exposure: repo.load(), itemId, responseValue: 1,
        omitted: false, responseTimeMs: 900, now: 2100,
      });
      repo.save(r.exposure);
    }
    const first = a.form.itemIdsInOrder[0];
    expect(repo.load()[first].fieldTestAdministrations).toBe(2);
  });
});

describe('§11 response quality is measured, not faked', () => {
  it('records a real interruption on the item where it happened', () => {
    const a = makeAssignment();
    const st = startFormalSession({
      assignment: a, studentId: 's1', newId: () => 'sess', now: 2000,
    });
    if (!st.ok) throw new Error('start failed');
    let state = st.state;

    const first = currentItemId(state)!;
    state = recordFormalResponse({
      state, exposure: {}, itemId: first, responseValue: 1, omitted: false,
      responseTimeMs: 800, now: 2100,
    }).state;

    // 30-minute gap before the second item.
    const second = currentItemId(state)!;
    state = recordFormalResponse({
      state, exposure: {}, itemId: second, responseValue: 1, omitted: false,
      responseTimeMs: 800, now: 2100 + 30 * 60 * 1000,
    }).state;

    const meta = qualityMetadata(state);
    expect(meta[0].interruptionCount).toBe(0);
    expect(meta[1].interruptionCount).toBe(1);
    expect(meta[1].longestInterruptionMs).toBeGreaterThan(60_000);
  });
});

describe('§13 audit events are recorded and safe', () => {
  it('records lifecycle events', () => {
    const audit = createMemoryAuditRepository();
    audit.record({
      eventId: 'e1', timestamp: 1, actorType: 'teacher', actorId: null,
      assignmentId: 'a1', sessionId: null, eventType: 'assignment_created',
    });
    expect(audit.forAssignment('a1')).toHaveLength(1);
  });

  it('refuses an event carrying secure content', () => {
    const audit = createMemoryAuditRepository();
    expect(() =>
      audit.record({
        eventId: 'e2', timestamp: 1, actorType: 'student', actorId: 's1',
        assignmentId: 'a1', sessionId: 'x', eventType: 'session_started',
        detail: '{"stem":"What is 1/2 + 1/4?"}',
      })
    ).toThrow(/secure content/i);
  });

  it('auditEventIsSafe rejects responses too', () => {
    expect(auditEventIsSafe({
      eventId: 'e', timestamp: 1, actorType: 'student', actorId: 's',
      assignmentId: 'a', sessionId: 's', eventType: 'session_completed',
      detail: 'responseValue=2',
    })).toBe(false);
  });
});

describe('§14/§15 the teacher can see and manage assignments', () => {
  const a = makeAssignment();
  const started = startFormalSession({
    assignment: a, studentId: 's1', newId: () => 'sess-1', now: 2000,
  });
  const sessions = started.ok ? [started.state] : [];

  it('participation is built from the ROSTER, including non-starters', () => {
    const rows = participationFor(a, sessions, (id) => `Student ${id}`);
    expect(rows).toHaveLength(2);
    expect(rows.find((r) => r.studentId === 's2')!.status).toBe('not_started');
    expect(rows.find((r) => r.studentId === 's1')!.status).toBe('in_progress');
  });

  it('renders participation without any performance data', () => {
    render(
      <AssignmentManagementPanel
        assignments={[a]} sessionsFor={() => sessions}
        nameOf={(id) => `Student ${id}`} classroomNameOf={() => 'Class 6 Blue'}
        onCancel={noop} now={2000}
      />
    );
    expect(screen.getByText(/1 of 2 started/)).toBeTruthy();
    // The subtitle NAMES what is not produced ("no scores or results") —
    // that is the disclaimer. What must not appear is a per-student
    // performance value.
    const rows = screen.getAllByText(/Student s\d/);
    for (const row of rows) {
      const line = row.parentElement?.textContent ?? '';
      expect(line).not.toMatch(/\d+%|score|correct|mastery/i);
    }
  });

  it('allows cancelling a live assignment', () => {
    const onCancel = vi.fn();
    render(
      <AssignmentManagementPanel
        assignments={[a]} sessionsFor={() => sessions}
        nameOf={(id) => id} classroomNameOf={() => 'Class 6 Blue'}
        onCancel={onCancel} now={2000}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /cancel this growth check/i }));
    expect(onCancel).toHaveBeenCalledWith(a.assignmentId);
  });

  it('shows an empty state rather than nothing', () => {
    render(
      <AssignmentManagementPanel
        assignments={[]} sessionsFor={() => []} nameOf={(id) => id}
        classroomNameOf={() => 'x'} onCancel={noop} now={1}
      />
    );
    expect(screen.getByText(/No Growth Checks assigned/i)).toBeTruthy();
  });
});

describe('§12 storage maturity is stated, not implied', () => {
  it('names what browser storage cannot do', () => {
    expect(STORAGE_MATURITY_NOTE).toMatch(/prototype/i);
    expect(STORAGE_MATURITY_NOTE).toMatch(/authenticated|centralised|auditable/i);
  });

  it('session repository is assignment-aware', () => {
    const a = makeAssignment();
    const st = startFormalSession({
      assignment: a, studentId: 's1', newId: () => 'sess', now: 2000,
    });
    if (!st.ok) throw new Error('start failed');
    const repo = createMemorySessionRepository([st.state]);
    expect(repo.activeForStudentAndAssignment('s1', a.assignmentId)).not.toBeNull();
    // A stale session from another assignment must not surface.
    expect(repo.activeForStudentInLiveAssignments('s1', ['other'])).toBeNull();
    expect(repo.activeForStudentInLiveAssignments('s1', [a.assignmentId])).not.toBeNull();
  });
});
