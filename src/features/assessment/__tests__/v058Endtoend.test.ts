// v0.58 §21 — framework gate, lifecycle, grade, assignment, session.

import { describe, it, expect } from 'vitest';
import {
  authorizePilotFramework, mayAdministerSpecification,
  researchBlueprint, isExecutableBlueprint,
  type PilotFrameworkAuthorization,
} from '../pilotFrameworkAuthorization';
import { prepareGrowthAdministration } from '../prepareGrowthAdministration';
import { PILOT_ADMINISTRATION_V1 } from '../assessmentAssembler';
import { NO_CALIBRATION, type GrowthItemRecord } from '../growthEligibility';
import { RATIONAL_NUMBER_SPECIFICATIONS, specificationById } from '../rationalNumberSpecifications';
import {
  createFormalAssignment, createInMemoryStore,
  activeAssignmentForStudent, assignmentStatusAt,
} from '../formalAssignmentStore';
import {
  startFormalSession, recordFormalResponse, resumeFormalSession,
  currentItemId, mayAdministerItem, fieldTestOutcome, FORMAL_RULES,
} from '../formalSessionRunner';
import type { GrowthItemMetadata } from '../prepareGrowthAdministration';
import type { Grade } from '../../../types';
import { CURRENT_REVIEWS, CURRENT_ADJUDICATIONS } from '../../teacher/reviewAdjudication';

const readySpec = {
  ...RATIONAL_NUMBER_SPECIFICATIONS[0],
  specificationId: 'SPEC.TEST.READY',
  reviewStatus: 'expert_reviewed' as const,
  reviewedBy: ['A', 'B'],
  fieldTestEligible: true,
};
const lookup = (id: string) => (id === readySpec.specificationId ? readySpec : specificationById(id));

const AUTHORIZED: PilotFrameworkAuthorization = {
  authorized: true, frameworkStatus: 'approved_for_pilot',
  humanReviewStatus: 'approved', evidenceStatus: 'sufficient_for_pilot_freeze',
  teacherMessage: '', adminBlockers: [], frameworkVersion: 'v-test',
};
const APPROVED_SPEC = { ...PILOT_ADMINISTRATION_V1, status: 'approved_for_field_test' as const };

const rec = (id: string): GrowthItemRecord => ({
  itemId: id, use: 'growth_field_test', specificationId: readySpec.specificationId,
  lifecycleStatus: 'approved_for_field_test',
  completedReviews: ['mathematical_content', 'curriculum_alignment', 'accessibility'],
  calibration: NO_CALIBRATION, securityFlags: [], operationalApprovalBy: null,
});
const met = (id: string, d: GrowthItemMetadata['domainId'], i = 5): GrowthItemMetadata => ({
  itemId: id, domainId: d, competencyId: `${d}.1`, format: 'single_select',
  cognitiveDemand: 'procedural_fluency', difficulty: i,
  gradeRange: { from: 'class5', to: 'class8' }, language: 'en', enemyItemIds: [],
});

/** A bank that satisfies every domain minimum. */
function fullBank() {
  const records: GrowthItemRecord[] = [];
  const metadata: Record<string, GrowthItemMetadata> = {};
  for (const w of PILOT_ADMINISTRATION_V1.domainWeights) {
    for (let i = 0; i < 10; i++) {
      const id = `${w.domainId}-${i}`;
      records.push(rec(id));
      metadata[id] = met(id, w.domainId, 1 + (i % 10));
    }
  }
  return { records, metadata };
}

// ===========================================================================
// §2 — framework gate
// ===========================================================================

describe('§2 framework approval gates the whole pipeline', () => {
  const { records, metadata } = fullBank();

  it('a PERFECT bank produces no form without framework approval', () => {
    const r = prepareGrowthAdministration({
      context: 'growth_field_test', records, metadata, lookup,
      grade: 'class6', spec: APPROVED_SPEC,
      // Real production authorization: not approved.
      authorization: authorizePilotFramework({
        reviews: CURRENT_REVIEWS, adjudications: CURRENT_ADJUDICATIONS,
        frameworkVersion: 'v1',
      }),
    });
    expect(r.ready).toBe(false);
    expect(r.form).toBeNull();
    expect(r.teacherMessage).toMatch(/framework has not been finalised/i);
  });

  it('production today is unauthorized, and says why', () => {
    const a = authorizePilotFramework({
      reviews: CURRENT_REVIEWS, adjudications: CURRENT_ADJUDICATIONS,
      frameworkVersion: 'v1',
    });
    expect(a.authorized).toBe(false);
    expect(a.frameworkStatus).toBe('blocked_by_evidence');
    expect(a.adminBlockers.length).toBeGreaterThan(0);
  });

  it('the framework gate fires BEFORE item checks', () => {
    const r = prepareGrowthAdministration({
      context: 'growth_field_test',
      records: [{ ...rec('bad'), completedReviews: [] }],
      metadata: { bad: met('bad', 'RAT') }, lookup, grade: 'class6',
      spec: APPROVED_SPEC,
      authorization: { ...AUTHORIZED, authorized: false, frameworkStatus: 'awaiting_human_review' },
    });
    // No item rejections reported: we never got that far.
    expect(r.rejected).toEqual([]);
    expect(r.adminBlockers.join(' ')).toMatch(/awaiting_human_review/);
  });

  it('with approval AND a full bank, a form is produced', () => {
    const r = prepareGrowthAdministration({
      context: 'growth_field_test', records, metadata, lookup,
      grade: 'class6', spec: APPROVED_SPEC, authorization: AUTHORIZED,
    });
    expect(r.ready).toBe(true);
    expect(r.form!.length).toBeGreaterThan(0);
  });
});

// ===========================================================================
// §3 — specification lifecycle
// ===========================================================================

describe('§3 a draft specification cannot be administered', () => {
  it('the real pilot spec is draft and is refused', () => {
    expect(PILOT_ADMINISTRATION_V1.status).toBe('draft');
    const g = mayAdministerSpecification(PILOT_ADMINISTRATION_V1);
    expect(g.allowed).toBe(false);
    expect(g.reason).toMatch(/approved_for_field_test/);
  });

  it('a draft spec blocks the pipeline even with approval and a full bank', () => {
    const { records, metadata } = fullBank();
    const r = prepareGrowthAdministration({
      context: 'growth_field_test', records, metadata, lookup,
      grade: 'class6', spec: PILOT_ADMINISTRATION_V1, authorization: AUTHORIZED,
    });
    expect(r.ready).toBe(false);
    expect(r.adminBlockers.join(' ')).toMatch(/status 'draft'/);
  });

  it('draft specs remain usable for simulation and planning', () => {
    for (const use of ['simulation', 'bank_planning', 'research_diagnostics'] as const) {
      expect(mayAdministerSpecification(PILOT_ADMINISTRATION_V1, use).allowed).toBe(true);
    }
  });
});

// ===========================================================================
// §4 — unresolved constructs
// ===========================================================================

describe('§4 unresolved constructs cannot become executable', () => {
  it('a research hypothesis is not executable', () => {
    const b = researchBlueprint(PILOT_ADMINISTRATION_V1, [
      'Fractions & Rational Number Reasoning', 'Computational Thinking',
    ]);
    expect(isExecutableBlueprint(b)).toBe(false);
    expect(b.unresolvedConstructs.length).toBe(2);
  });

  it('an approved blueprint records the framework it came from', () => {
    const b = {
      kind: 'approved_field_test' as const, specification: APPROVED_SPEC,
      frameworkVersion: 'v-test', approvedBy: 'Reviewer', approvedAt: '2026-08-20',
    };
    expect(isExecutableBlueprint(b)).toBe(true);
    expect(b.frameworkVersion).toBeTruthy();
  });
});

// ===========================================================================
// §5 / §6 — grade
// ===========================================================================

describe('§5/§6 the real classroom grade is used and enforced', () => {
  const { records, metadata } = fullBank();
  const run = (grade: Grade) =>
    prepareGrowthAdministration({
      context: 'growth_field_test', records, metadata, lookup,
      grade, spec: APPROVED_SPEC, authorization: AUTHORIZED,
    });

  for (const g of ['class5', 'class6', 'class7', 'class8'] as Grade[]) {
    it(`${g} is in intendedGrades and assembles`, () => {
      expect(APPROVED_SPEC.intendedGrades).toContain(g);
      expect(run(g).ready).toBe(true);
    });
  }

  it('an out-of-scope grade is refused with a clear reason', () => {
    const r = run('class12');
    expect(r.ready).toBe(false);
    expect(r.adminBlockers.join(' ')).toMatch(/intendedGrades/);
    expect(r.teacherMessage).toMatch(/not been designed for Class 12/i);
  });

  it('there is no Class 6 fallback — class12 does not silently become class6', () => {
    expect(run('class12').ready).toBe(false);
    expect(run('class6').ready).toBe(true);
  });

  it('specification grade AND item grade must BOTH permit', () => {
    // Spec permits class5; items are class5-8. Narrow items to 7-8.
    const narrow = Object.fromEntries(
      Object.entries(metadata).map(([k, v]) => [
        k, { ...v, gradeRange: { from: 'class7' as Grade, to: 'class8' as Grade } },
      ])
    );
    const r = prepareGrowthAdministration({
      context: 'growth_field_test', records, metadata: narrow, lookup,
      grade: 'class5', spec: APPROVED_SPEC, authorization: AUTHORIZED,
    });
    expect(r.ready).toBe(false);
  });
});

// ===========================================================================
// §7 / §8 / §12 — assignment
// ===========================================================================

describe('§7/§8 formal assignments are versioned and frozen', () => {
  const { records, metadata } = fullBank();
  const prep = () =>
    prepareGrowthAdministration({
      context: 'growth_field_test', records, metadata, lookup,
      grade: 'class6', spec: APPROVED_SPEC, authorization: AUTHORIZED, now: 1000,
    });

  const make = (now = 1000) =>
    createFormalAssignment({
      preparation: prep(), classroomId: 'room-a', targetGrade: 'class6',
      opensAt: now, closesAt: now + 1000000,
      assignedStudentIds: ['s1'],
      newId: (() => { let n = 0; return () => `id-${n++}`; })(),
      now,
    });

  it('production cannot create an assignment today', () => {
    const productionPrep = prepareGrowthAdministration({
      context: 'growth_field_test', records, metadata, lookup, grade: 'class6',
    });
    const r = createFormalAssignment({
      preparation: productionPrep, classroomId: 'room-a', targetGrade: 'class6',
      opensAt: 0, closesAt: 100, assignedStudentIds: ['s1'], newId: () => 'x', now: 0,
    });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.reasons.join(' ')).toMatch(/framework is not approved/i);
  });

  it('a fixture-approved preparation creates a full snapshot', () => {
    const r = make();
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    const a = r.assignment;
    for (const f of [
      a.frameworkVersion, a.administrationSpecificationId, a.blueprintVersion,
      a.itemBankVersion, a.language, a.routerId, a.reportingVersion,
      a.supportPolicyVersion,
    ]) expect(f).toBeTruthy();
    expect(a.purpose).toBe('pilot_field_test');
    expect(a.context).toBe('growth_field_test');
  });

  it('the form is FROZEN — item ids and order are stored', () => {
    const r = make();
    if (!r.ok) throw new Error('expected assignment');
    expect(r.assignment.form.itemIdsInOrder.length).toBeGreaterThan(0);
    expect(r.assignment.form.assembledAt).toBe(1000);
  });

  it('a later bank change cannot alter an existing assignment', () => {
    const r = make();
    if (!r.ok) throw new Error('expected assignment');
    const before = [...r.assignment.form.itemIdsInOrder];
    // Simulate the bank growing.
    records.push(rec('NEW-1'));
    metadata['NEW-1'] = met('NEW-1', 'RAT');
    expect(r.assignment.form.itemIdsInOrder).toEqual(before);
  });

  it('never stores secure item content, only ids', () => {
    const r = make();
    if (!r.ok) throw new Error('expected assignment');
    const json = JSON.stringify(r.assignment);
    expect(json).not.toMatch(/stem|prompt|choices|correctIndex/i);
  });

  it('store operations work and windows are respected', () => {
    const store = createInMemoryStore();
    const r = make(1000);
    if (!r.ok) throw new Error('expected assignment');
    store.create(r.assignment);
    expect(store.byClassroom('room-a').length).toBe(1);
    expect(activeAssignmentForStudent(store, 'room-a', 2000)?.assignmentId)
      .toBe(r.assignment.assignmentId);
    // Wrong classroom, and out-of-window.
    expect(activeAssignmentForStudent(store, 'room-b', 2000)).toBeNull();
    expect(activeAssignmentForStudent(store, 'room-a', 999)).toBeNull();
    expect(activeAssignmentForStudent(store, 'room-a', 9999999)).toBeNull();
    store.cancel(r.assignment.assignmentId);
    expect(activeAssignmentForStudent(store, 'room-a', 2000)).toBeNull();
  });

  it('reports scheduled / active / expired correctly', () => {
    const r = make(1000);
    if (!r.ok) throw new Error('expected assignment');
    expect(assignmentStatusAt(r.assignment, 500)).toBe('scheduled');
    expect(assignmentStatusAt(r.assignment, 2000)).toBe('active');
    expect(assignmentStatusAt(r.assignment, 9999999)).toBe('expired');
  });
});

// ===========================================================================
// §10 / §11 — session runner
// ===========================================================================

describe('§10/§11 the formal session is secure and resumable', () => {
  const { records, metadata } = fullBank();
  const prep = prepareGrowthAdministration({
    context: 'growth_field_test', records, metadata, lookup,
    grade: 'class6', spec: APPROVED_SPEC, authorization: AUTHORIZED, now: 1000,
  });
  const created = createFormalAssignment({
    preparation: prep, classroomId: 'room-a', targetGrade: 'class6',
    opensAt: 1000, closesAt: 9_000_000,
    assignedStudentIds: ['s1'],
    newId: (() => { let n = 0; return () => `a-${n++}`; })(), now: 1000,
  });
  if (!created.ok) throw new Error('fixture failed');
  const assignment = created.assignment;

  const start = (now = 2000) =>
    startFormalSession({ assignment, studentId: 's1', newId: () => 'sess-1', now });

  it('enforces formal rules: no hints, no feedback, exposure recorded', () => {
    expect(FORMAL_RULES.allowHints).toBe(false);
    expect(FORMAL_RULES.allowWorkedExamples).toBe(false);
    expect(FORMAL_RULES.allowImmediateCorrectnessFeedback).toBe(false);
    expect(FORMAL_RULES.allowInstructionalNavigation).toBe(false);
    expect(FORMAL_RULES.recordExposure).toBe(true);
  });

  it('administers only items from the authorized form, in order', () => {
    const s = start();
    if (!s.ok) throw new Error('start failed');
    expect(currentItemId(s.state)).toBe(assignment.form.itemIdsInOrder[0]);
    expect(mayAdministerItem(s.state, 'NOT-IN-FORM')).toBe(false);
  });

  it('refuses a response to an item that is not next', () => {
    const s = start();
    if (!s.ok) throw new Error('start failed');
    const r = recordFormalResponse({
      state: s.state, exposure: {}, itemId: 'NOT-IN-FORM',
      responseValue: 1, omitted: false, responseTimeMs: 100, now: 2100,
    });
    expect(r.rejected).toMatch(/not the next item/i);
  });

  it('records exposure for every administered item', () => {
    const s = start();
    if (!s.ok) throw new Error('start failed');
    const first = currentItemId(s.state)!;
    const r = recordFormalResponse({
      state: s.state, exposure: {}, itemId: first,
      responseValue: 2, omitted: false, responseTimeMs: 4000, now: 2100,
    });
    expect(r.exposure[first].growthAdministrations).toBe(1);
    expect(r.exposure[first].instructionalAdministrations).toBe(0);
  });

  it('resume returns the IDENTICAL form and prior responses', () => {
    const s = start();
    if (!s.ok) throw new Error('start failed');
    const first = currentItemId(s.state)!;
    const after = recordFormalResponse({
      state: s.state, exposure: {}, itemId: first,
      responseValue: 1, omitted: false, responseTimeMs: 3000, now: 2100,
    }).state;

    const resumed = resumeFormalSession({
      state: after, assignment, now: 2100 + 20 * 60 * 1000,
    });
    expect(resumed.ok).toBe(true);
    if (!resumed.ok) return;
    // Same form, same position, same responses — no reassembly.
    expect(resumed.state.formItemIdsInOrder).toEqual(after.formItemIdsInOrder);
    expect(resumed.state.currentIndex).toBe(after.currentIndex);
    expect(resumed.state.responses).toHaveLength(1);
    expect(resumed.state.resumeEventCount).toBe(1);
    // A 20-minute gap is recorded as an interruption, not punished.
    expect(resumed.state.interruptionCount).toBe(1);
  });

  it('cannot start or resume once the window has closed', () => {
    const late = startFormalSession({
      assignment, studentId: 's1', newId: () => 'x', now: 99_000_000,
    });
    expect(late.ok).toBe(false);
    if (!late.ok) expect(late.reason).toMatch(/closed/i);

    const s = start();
    if (!s.ok) throw new Error('start failed');
    const r = resumeFormalSession({ state: s.state, assignment, now: 99_000_000 });
    expect(r.ok).toBe(false);
  });

  it('completion yields field-test evidence with NO score', () => {
    const started = start();
    if (!started.ok) throw new Error('start failed');
    let state = started.state;
    let exposure = {};
    for (const itemId of assignment.form.itemIdsInOrder) {
      const r = recordFormalResponse({
        state, exposure, itemId, responseValue: 1, omitted: false,
        responseTimeMs: 5000, now: 3000,
      });
      state = r.state; exposure = r.exposure;
    }
    expect(state.status).toBe('completed');
    const outcome = fieldTestOutcome(state);
    expect(outcome.evidenceType).toBe('field_test_response_data');
    // The note NAMES what is not produced — that is the disclaimer.
    // What must not exist is a FIELD carrying such a value.
    const keys = Object.keys(outcome).map((k) => k.toLowerCase());
    for (const claim of ['percentile', 'mastery', 'ability', 'score', 'growth', 'norm']) {
      expect(keys.some((k) => k.includes(claim))).toBe(false);
    }
    expect(outcome.note).toMatch(/produce no achievement, mastery, or growth result/i);
  });
});

// ===========================================================================
// §15 — constraint honesty
// ===========================================================================

describe('§15 the assembler declares what it actually enforces', () => {
  it('domain minimums are hard, and behave that way', async () => {
    const { BLUEPRINT_CONSTRAINT_ENFORCEMENT, hardConstraints } =
      await import('../assessmentAssembler');
    expect(BLUEPRINT_CONSTRAINT_ENFORCEMENT['domainWeights.minItems'].enforcement)
      .toBe('hard');
    expect(hardConstraints()).toContain('intendedGrades');

    // Behaviour matches the declaration: one domain short => failure.
    const { records, metadata } = fullBank();
    const missingGeo = records.filter((r) => !r.itemId.startsWith('GEO'));
    const r = prepareGrowthAdministration({
      context: 'growth_field_test', records: missingGeo, metadata, lookup,
      grade: 'class6', spec: APPROVED_SPEC, authorization: AUTHORIZED,
    });
    expect(r.ready).toBe(false);
    expect(r.unmetConstraints.join(' ')).toMatch(/Domain GEO/);
  });

  it('cognitive-demand targets are declared ADVISORY, and do not fail assembly', async () => {
    const { BLUEPRINT_CONSTRAINT_ENFORCEMENT, advisoryConstraints } =
      await import('../assessmentAssembler');
    const cd = BLUEPRINT_CONSTRAINT_ENFORCEMENT.cognitiveDemandTargets;
    expect(cd.enforcement).toBe('advisory');
    expect(cd.note).toMatch(/NOT enforced in v0\.58/);
    expect(advisoryConstraints()).toContain('cognitiveDemandTargets');

    // Every item is procedural_fluency, violating the target mix — and
    // assembly still succeeds, exactly as declared.
    const { records, metadata } = fullBank();
    const r = prepareGrowthAdministration({
      context: 'growth_field_test', records, metadata, lookup,
      grade: 'class6', spec: APPROVED_SPEC, authorization: AUTHORIZED,
    });
    expect(r.ready).toBe(true);
  });

  it('author difficulty stays advisory — no false psychometric precision', async () => {
    const { BLUEPRINT_CONSTRAINT_ENFORCEMENT } = await import('../assessmentAssembler');
    expect(BLUEPRINT_CONSTRAINT_ENFORCEMENT.difficultyTarget.enforcement)
      .toBe('advisory');
    expect(BLUEPRINT_CONSTRAINT_ENFORCEMENT.difficultyTarget.note)
      .toMatch(/not calibrated/i);
  });
});
