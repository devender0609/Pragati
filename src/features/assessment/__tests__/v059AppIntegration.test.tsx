// v0.59 §17 + §18 + §26 — application-level formal workflow.
//
// These render the REAL components and drive the REAL services with
// fixture-approved evidence. Production governance data is never
// mutated: authorization is injected.

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { GrowthAssignPanel, GrowthInstructions, GrowthComplete } from '../GrowthAdministration';
import { FormalSittingView } from '../FormalSittingView';
import { StudentShell } from '../../student/StudentShell';
import { prepareGrowthAdministration, type GrowthItemMetadata } from '../prepareGrowthAdministration';
import { PILOT_ADMINISTRATION_V1 } from '../assessmentAssembler';
import { NO_CALIBRATION, type GrowthItemRecord } from '../growthEligibility';
import { RATIONAL_NUMBER_SPECIFICATIONS, specificationById } from '../rationalNumberSpecifications';
import { createFormalAssignment, createInMemoryStore, type FormalGrowthAssignment } from '../formalAssignmentStore';
import { createInMemorySessionStore, containsSecureContent } from '../formalSessionStore';
import {
  startFormalSession, recordFormalResponse, resumeFormalSession,
  abandonFormalSession, fieldTestOutcome, currentItemId,
} from '../formalSessionRunner';
import { growthItemRecords, growthItemContent } from '../growthItemBank';
import type { PilotFrameworkAuthorization } from '../pilotFrameworkAuthorization';

const noop = () => {};

const readySpec = {
  ...RATIONAL_NUMBER_SPECIFICATIONS[0],
  specificationId: 'SPEC.FIXTURE',
  reviewStatus: 'expert_reviewed' as const,
  reviewedBy: ['A', 'B'],
  fieldTestEligible: true,
};
const lookup = (id: string) => (id === readySpec.specificationId ? readySpec : specificationById(id));
const AUTHORIZED: PilotFrameworkAuthorization = {
  authorized: true, frameworkStatus: 'approved_for_pilot',
  humanReviewStatus: 'approved', evidenceStatus: 'sufficient_for_pilot_freeze',
  teacherMessage: '', adminBlockers: [], frameworkVersion: 'v-fixture',
};
const APPROVED_SPEC = { ...PILOT_ADMINISTRATION_V1, status: 'approved_for_field_test' as const };

function fixtureBank() {
  const records: GrowthItemRecord[] = [];
  const metadata: Record<string, GrowthItemMetadata> = {};
  const content: Record<string, { stem: string; choices: string[] }> = {};
  for (const w of APPROVED_SPEC.domainWeights) {
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
      content[id] = { stem: `Question ${id}`, choices: ['A', 'B', 'C', 'D'] };
    }
  }
  return { records, metadata, content };
}

const bank = fixtureBank();

function makeAssignment(now = 1000): FormalGrowthAssignment {
  const prep = prepareGrowthAdministration({
    context: 'growth_field_test', records: bank.records, metadata: bank.metadata,
    lookup, grade: 'class6', spec: APPROVED_SPEC, authorization: AUTHORIZED, now,
  });
  let n = 0;
  const created = createFormalAssignment({
    preparation: prep, classroomId: 'room-a', targetGrade: 'class6',
    opensAt: now, closesAt: now + 10_000_000,
    assignedStudentIds: ['s1'], newId: () => `fx-${n++}`, now,
  });
  if (!created.ok) throw new Error('fixture assignment failed');
  return created.assignment;
}

// ===========================================================================
// Teacher
// ===========================================================================

describe('§18 production Teacher Assess cannot assign', () => {
  it('the real (empty) bank cannot produce a form', () => {
    const prep = prepareGrowthAdministration({
      context: 'growth_field_test', records: growthItemRecords, metadata: {},
      lookup: specificationById, grade: 'class6',
    });
    expect(prep.ready).toBe(false);
    expect(growthItemRecords).toEqual([]);
    expect(Object.keys(growthItemContent)).toEqual([]);
  });

  it('the panel disables Assign in production', () => {
    render(
      <GrowthAssignPanel
        classrooms={[{ id: 'room-a', name: 'Class 6 Blue', grade: 'class6' }]}
        selectedClassroomId="room-a" onSelectClassroom={noop} onAssign={noop}
      />
    );
    expect(screen.getByRole('button', { name: /assign to class/i })).toBeDisabled();
  });

  it('refuses a classroom with no recognised grade', () => {
    render(
      <GrowthAssignPanel
        classrooms={[{ id: 'room-x', name: 'Odd class', grade: 'KG' }]}
        selectedClassroomId="room-x" onSelectClassroom={noop} onAssign={noop}
      />
    );
    expect(screen.getByText(/needs its year group set/i)).toBeTruthy();
    expect(screen.getByRole('button', { name: /assign to class/i })).toBeDisabled();
  });
});

describe('§17 fixture-approved assignment persists a full snapshot', () => {
  it('creates and stores an assignment', () => {
    const store = createInMemoryStore();
    const a = makeAssignment();
    store.create(a);
    expect(store.activeForClassroom('room-a', 2000)?.assignmentId).toBe(a.assignmentId);
    expect(a.form.itemIdsInOrder.length).toBeGreaterThan(0);
    expect(a.frameworkVersion).toBe('v-fixture');
  });

  it('shows classroom, status and window for management (§19)', () => {
    const a = makeAssignment();
    expect(a.classroomId).toBe('room-a');
    expect(a.status).toBe('scheduled');
    expect(a.closesAt).toBeGreaterThan(a.opensAt);
  });
});

// ===========================================================================
// Student discovery
// ===========================================================================

describe('§17 the right student sees the Growth Check', () => {
  const shell = (over: Record<string, unknown>) =>
    render(
      <StudentShell
        activeTab="home" onSwitchTab={noop} openChapterId={null}
        onOpenChapter={noop} studentGrade="class6" studentName="Ada"
        studentId="s1" onLaunchLesson={noop} onLaunchConceptPractice={noop}
        onLaunchMixedChapterPractice={noop} onLaunchChapterCheck={noop}
        {...over}
      />
    );

  it('appears for a student whose classroom has a live assignment', () => {
    shell({ growthAssignment: { assignmentId: 'a1' } });
    expect(screen.getByText(/Your Math Growth Check is ready/i)).toBeTruthy();
  });

  it('does NOT appear for an unrelated classroom (no assignment passed)', () => {
    const { container } = shell({ growthAssignment: null });
    expect(container.textContent ?? '').not.toMatch(/Growth Check/i);
  });

  it('offers Continue rather than Start when a sitting is unfinished', () => {
    shell({ growthAssignment: { assignmentId: 'a1' }, growthInProgress: true });
    expect(screen.getByText(/Continue your Growth Check/i)).toBeTruthy();
    expect(screen.getByRole('button', { name: /^continue$/i })).toBeTruthy();
  });
});

// ===========================================================================
// Sitting
// ===========================================================================

describe('§17 the formal sitting runs end to end', () => {
  let assignment: FormalGrowthAssignment;
  let sessionStore: ReturnType<typeof createInMemorySessionStore>;

  beforeEach(() => {
    assignment = makeAssignment();
    sessionStore = createInMemorySessionStore();
  });

  const start = () => {
    const r = startFormalSession({
      assignment, studentId: 's1', newId: () => 'sess-1', now: 2000,
    });
    if (!r.ok) throw new Error(r.reason);
    sessionStore.save(r.state);
    return r.state;
  };

  it('instructions warn there are no hints', () => {
    render(
      <GrowthInstructions studentName="Ada" itemCount={35} onBegin={noop} onBack={noop} />
    );
    expect(screen.getByText(/no hints this time/i)).toBeTruthy();
  });

  it('renders only the frozen form item, with no instructional affordance', () => {
    const state = start();
    const { container } = render(
      <FormalSittingView
        state={state} studentName="Ada"
        content={(id) => bank.content[id] ?? null}
        onSubmit={noop} onPause={noop} onAbandon={noop}
      />
    );
    expect(screen.getByText(`Question ${currentItemId(state)}`)).toBeTruthy();
    const text = container.textContent ?? '';
    for (const banned of ['hint', 'worked example', 'try again', 'correct', 'explanation', 'Learn', 'Practice']) {
      expect(text.toLowerCase()).not.toContain(banned.toLowerCase());
    }
  });

  it('refuses an item outside the frozen form', () => {
    const state = start();
    render(
      <FormalSittingView
        state={state} studentName="Ada"
        content={() => null}
        onSubmit={noop} onPause={noop} onAbandon={noop}
      />
    );
    // Refuses rather than substituting or skipping.
    expect(screen.getByText(/could not be opened/i)).toBeTruthy();
  });

  it('submitting records the response, exposure and position', () => {
    const state = start();
    const onSubmit = vi.fn();
    render(
      <FormalSittingView
        state={state} studentName="Ada"
        content={(id) => bank.content[id] ?? null}
        onSubmit={onSubmit} onPause={noop} onAbandon={noop}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: 'B' }));
    fireEvent.click(screen.getByRole('button', { name: /next question/i }));
    expect(onSubmit).toHaveBeenCalledTimes(1);

    const { itemId, value, omitted } = onSubmit.mock.calls[0][0];
    const r = recordFormalResponse({
      state, exposure: {}, itemId, responseValue: value, omitted,
      responseTimeMs: 1000, now: 2100,
    });
    expect(r.state.currentIndex).toBe(1);
    // §9 — field-test exposure, distinct from operational.
    expect(r.exposure[itemId].fieldTestAdministrations).toBe(1);
    expect(r.exposure[itemId].operationalAdministrations ?? 0).toBe(0);
    expect(r.exposure[itemId].instructionalAdministrations).toBe(0);
  });

  it('pause preserves state and resume returns the identical form', () => {
    let state = start();
    const first = currentItemId(state)!;
    state = recordFormalResponse({
      state, exposure: {}, itemId: first, responseValue: 1,
      omitted: false, responseTimeMs: 900, now: 2100,
    }).state;
    sessionStore.save(state);

    // Simulate reload: read back from the store.
    const reloaded = sessionStore.get('sess-1')!;
    expect(reloaded.responses).toHaveLength(1);

    const resumed = resumeFormalSession({ state: reloaded, assignment, now: 3000 });
    expect(resumed.ok).toBe(true);
    if (!resumed.ok) return;
    expect(resumed.state.formItemIdsInOrder).toEqual(assignment.form.itemIdsInOrder);
    expect(resumed.state.currentIndex).toBe(1);
    expect(resumed.state.resumeEventCount).toBe(1);
  });

  it('abandon is distinct from completion and keeps partial evidence', () => {
    const state = start();
    const abandoned = abandonFormalSession(state, 4000);
    expect(abandoned.status).toBe('abandoned');
    expect(abandoned.status).not.toBe('completed');
  });

  it('the stored session never contains secure item content', () => {
    const state = start();
    expect(containsSecureContent(state)).toBe(false);
    expect(JSON.stringify(state)).not.toContain('Question ');
  });

  it('completing the frozen form yields a score-free completion screen', () => {
    let state = start();
    let exposure = {};
    for (const itemId of assignment.form.itemIdsInOrder) {
      const r = recordFormalResponse({
        state, exposure, itemId, responseValue: 0, omitted: false,
        responseTimeMs: 1000, now: 5000,
      });
      state = r.state; exposure = r.exposure;
    }
    expect(state.status).toBe('completed');

    const outcome = fieldTestOutcome(state);
    const { container } = render(
      <GrowthComplete
        studentName="Ada" itemsAnswered={outcome.itemsAdministered} onDone={noop}
      />
    );
    const text = (container.textContent ?? '').toLowerCase();
    for (const claim of ['percent', 'score', 'mastery', 'percentile', 'level', 'correct']) {
      expect(text).not.toContain(claim);
    }
  });

  it('an expired window blocks start and resume', () => {
    const late = startFormalSession({
      assignment, studentId: 's1', newId: () => 'x', now: 99_000_000,
    });
    expect(late.ok).toBe(false);
    const state = start();
    expect(resumeFormalSession({ state, assignment, now: 99_000_000 }).ok).toBe(false);
  });
});
