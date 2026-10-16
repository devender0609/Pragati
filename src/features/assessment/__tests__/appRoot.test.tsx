// v0.61 §4 — THE ONE TRUE ROOT-APP INTEGRATION TEST.
//
// WHAT WAS MISSING
//
// v0.59 and v0.60 built an integration suite that drove the real
// services and rendered the real components — but never mounted
// `<App />`. So the one layer with no coverage at all was the wiring
// BETWEEN them: which store App reads, which grade it passes down,
// which view it switches to, whether the student card is fed the
// assignment the teacher just created.
//
// Every bug found in §3 and §5 of v0.60 lived in exactly that layer.
//
// THIS IS A SMOKE GUARD, NOT A TESTING PROJECT.
//
// One happy path end to end, plus the assertion that matters more than
// the happy path: production, with nothing injected, still cannot
// create a formal assignment.

import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../../../App';
import type { AppDependencies } from '../../../App';
import { createInMemoryStore } from '../formalAssignmentStore';
import { createInMemorySessionStore } from '../formalSessionStore';
import { PILOT_ADMINISTRATION_V1 } from '../assessmentAssembler';
import { NO_CALIBRATION, type GrowthItemRecord } from '../growthEligibility';
import { RATIONAL_NUMBER_SPECIFICATIONS, specificationById } from '../rationalNumberSpecifications';
import type { GrowthItemMetadata } from '../prepareGrowthAdministration';
import type { PilotFrameworkAuthorization } from '../pilotFrameworkAuthorization';
import { saveClassrooms } from '../../../lib/classroomStore';
import { saveStudent, saveAppMode } from '../../../lib/storage';

// ---------------------------------------------------------------------------
// Fixture authorization. Production governance data is never mutated —
// this is injected, exactly as v0.59 §26 established.
// ---------------------------------------------------------------------------

const readySpec = {
  ...RATIONAL_NUMBER_SPECIFICATIONS[0],
  specificationId: 'SPEC.APPROOT.FIXTURE',
  reviewStatus: 'expert_reviewed' as const,
  reviewedBy: ['Reviewer A', 'Reviewer B'],
  fieldTestEligible: true,
};

const lookup = (id: string) =>
  id === readySpec.specificationId ? readySpec : specificationById(id);

const AUTHORIZED: PilotFrameworkAuthorization = {
  authorized: true,
  frameworkStatus: 'approved_for_pilot',
  humanReviewStatus: 'approved',
  evidenceStatus: 'sufficient_for_pilot_freeze',
  teacherMessage: '',
  adminBlockers: [],
  frameworkVersion: 'v-approot-fixture',
};

const APPROVED_SPEC = {
  ...PILOT_ADMINISTRATION_V1,
  status: 'approved_for_field_test' as const,
};

function fixtureBank() {
  const records: GrowthItemRecord[] = [];
  const metadata: Record<string, GrowthItemMetadata> = {};
  const content: Record<string, { stem: string; choices: string[]; correctIndex: number }> = {};
  for (const w of APPROVED_SPEC.domainWeights) {
    for (let i = 0; i < 12; i++) {
      const id = `${w.domainId}-approot-${i}`;
      records.push({
        itemId: id,
        use: 'growth_field_test',
        specificationId: readySpec.specificationId,
        lifecycleStatus: 'approved_for_field_test',
        completedReviews: [
          'mathematical_content',
          'curriculum_alignment',
          'accessibility',
        ],
        calibration: NO_CALIBRATION,
        securityFlags: [],
        operationalApprovalBy: null,
      });
      metadata[id] = {
        itemId: id,
        domainId: w.domainId,
        competencyId: `${w.domainId}.1`,
        format: 'single_select',
        cognitiveDemand: 'procedural_fluency',
        difficulty: 1 + (i % 10),
        gradeRange: { from: 'class5', to: 'class8' },
        language: 'en',
        enemyItemIds: [],
      };
      content[id] = {
        stem: `Fixture question ${id}`,
        choices: ['A', 'B', 'C', 'D'],
        correctIndex: i % 4,
      };
    }
  }
  return { records, metadata, content };
}

const CLASSROOM_ID = 'approot-room';
const STUDENT_ID = 'approot-student';

function seedRoster() {
  saveClassrooms([
    {
      id: CLASSROOM_ID,
      teacherUid: 'local',
      name: 'Class 6 Blue',
      notes: '',
      studentIds: [STUDENT_ID],
      archived: false,
      createdAt: 1,
      updatedAt: 1,
      gradeId: 'class6',
    } as never,
  ]);
  saveStudent({
    id: STUDENT_ID,
    name: 'Asha',
    grade: 'Class 6',
    gradeId: 'class6',
    primaryClassroomId: CLASSROOM_ID,
    createdAt: 1,
  });
}

function deps(): AppDependencies {
  const bank = fixtureBank();
  return {
    formalAssignments: createInMemoryStore(),
    formalSessions: createInMemorySessionStore(),
    growthBank: bank,
    specLookup: lookup,
    administrationSpec: APPROVED_SPEC,
    frameworkAuthorization: AUTHORIZED,
  };
}

beforeEach(() => {
  localStorage.clear();
});

/** The first-run tour is a product feature, not part of this flow. */
function skipTourIfPresent() {
  const skip = screen.queryByRole('button', { name: /^Skip$/ });
  if (skip) fireEvent.click(skip);
}

// ---------------------------------------------------------------------------
// The guard that matters most.
// ---------------------------------------------------------------------------

describe('§4 production remains locked at the App root', () => {
  it('cannot assign a formal Growth check with nothing injected', () => {
    seedRoster();
    saveAppMode('teacher');
    render(<App />);

    skipTourIfPresent();
    fireEvent.click(screen.getAllByRole('tab', { name: /Assess/i })[0]);

    // The real, un-injected pipeline: empty item bank, unapproved
    // framework. The teacher is told, and the action is unavailable.
    expect(screen.getByText(/isn't ready to assign yet/i)).toBeTruthy();
    expect(
      screen.getByRole('button', { name: /assign to class/i })
    ).toBeDisabled();
  });
});

// ---------------------------------------------------------------------------
// One end-to-end pass, under fixture authorization only.
// ---------------------------------------------------------------------------

describe('§4 App root: teacher assigns, student sits, session completes', () => {
  it('runs the whole formal flow through the real App component', () => {
    seedRoster();
    saveAppMode('teacher');
    const d = deps();
    render(<App deps={d} />);

    // --- Teacher → Assess -------------------------------------------
    skipTourIfPresent();
    fireEvent.click(screen.getAllByRole('tab', { name: /Assess/i })[0]);

    // The class carries a recognised year group, so readiness IS
    // evaluated — and with a fixture bank it is ready.
    expect(screen.queryByText(/needs its year group set/i)).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: /Class 6 Blue/ }));

    const assign = screen.getByRole('button', { name: /assign to class/i });
    expect(assign).not.toBeDisabled();
    fireEvent.click(assign);

    // The assignment reached the store, with a frozen form and roster.
    const created = d.formalAssignments!.all();
    expect(created).toHaveLength(1);
    expect(created[0].targetGrade).toBe('class6');
    expect(created[0].assignedStudentIds).toEqual([STUDENT_ID]);
    expect(created[0].form.itemIdsInOrder.length).toBeGreaterThan(0);

    // --- Student → Home ---------------------------------------------
    // The mode toggle lands directly on the student shell's Home tab.
    fireEvent.click(screen.getByRole('button', { name: /Teacher mode/i }));
    skipTourIfPresent();

    // The card the teacher's action produced.
    expect(screen.getByText(/Your Math Growth Check is ready/i)).toBeTruthy();

    // --- Instructions ------------------------------------------------
    fireEvent.click(screen.getByRole('button', { name: /^Start$/i }));
    expect(screen.getByText(/Ready, Asha\?/i)).toBeTruthy();

    // --- The sitting --------------------------------------------------
    fireEvent.click(screen.getByRole('button', { name: /^Begin$/i }));

    const total = created[0].form.itemIdsInOrder.length;
    for (let i = 0; i < total; i++) {
      // Answer whatever is on screen, then advance.
      const choice = screen.getAllByRole('radio')[0];
      fireEvent.click(choice);
      const next = screen.getByRole('button', { name: /next|finish|submit/i });
      fireEvent.click(next);
    }

    // --- Completion ---------------------------------------------------
    expect(screen.getByText(/Thanks, Asha/i)).toBeTruthy();

    const session = d.formalSessions!.all()[0];
    expect(session.status).toBe('completed');
    expect(session.assignmentId).toBe(created[0].assignmentId);

    // No score anywhere. A field test has none.
    const page = document.body.textContent ?? '';
    expect(page).not.toMatch(/percentile|RIT|scaled score|grade equivalent/i);
  });
});

describe('§4 the student card is fed by the same store the teacher wrote to', () => {
  it('shows no Growth card when the teacher has assigned nothing', () => {
    seedRoster();
    saveAppMode('student');
    render(<App deps={deps()} />);
    skipTourIfPresent();
    expect(screen.queryByText(/Your Math Growth Check is ready/i)).toBeNull();
  });
});
