// v0.51 §7/§18 — Growth administration prototype.
//
// TWO SCREENS, DELIBERATELY MINIMAL.
//
// Teacher: pick class → review window → review accommodations → assign.
// Student: a card on Home that appears ONLY when an assignment is live.
//
// No scheduling engine, no school administration, no proctor codes.
// Those are real requirements but they are not what needs proving
// right now; what needs proving is that the workflow is separate from
// practice and that it refuses to start when the item bank cannot
// support it.
//
// The refusal is the important part. Pragati has no authored Growth
// items, so `buildGrowthPool` fails — and this prototype shows the
// teacher exactly why rather than presenting an empty test.

import { useMemo, useState } from 'react';
import { Card } from '../../design/primitives/Card';
import { PageHeader } from '../../design/primitives/PageHeader';
import { PrimaryButton } from '../../design/primitives/PrimaryButton';
import { SecondaryButton } from '../../design/primitives/SecondaryButton';
import { specificationById } from './rationalNumberSpecifications';
import {
  GROWTH_WINDOW_LABELS,
  SUPPORTS_EXPLANATION,
  type GrowthWindow,
} from './growthSession';
import { ACCESSIBILITY_SUPPORTS } from './assessmentGovernance';
import {
  prepareGrowthAdministration,
  type GrowthItemMetadata,
  type GrowthPreparationResult,
} from './prepareGrowthAdministration';
import type { GrowthItemRecord } from './growthEligibility';
import type { SpecLookup } from './itemSpecification';
import type { PilotAdministrationSpecification } from './assessmentAssembler';
import type { PilotFrameworkAuthorization } from './pilotFrameworkAuthorization';
import type { FormalAssignmentStudentView } from './formalAssignmentStore';
import { normalizeGrade } from '../../lib/gradeNormalization';

/** Pilot length from the assessment specification. Not the v0.50
 *  10-item prototype assumption — see
 *  docs/PRAGATI_GROWTH_ASSESSMENT_SPEC.md §4. */
export const PILOT_TEST_LENGTH = 35;

// ---------------------------------------------------------------------------
// TEACHER — Assess
// ---------------------------------------------------------------------------

export type GrowthAssignmentDraft = {
  classroomId: string;
  assessmentId: 'pragati_growth_mathematics';
  window: GrowthWindow;
  opensAt: number;
  closesAt: number;
  /** Class-wide supports, applied to every student on the roster.
   *  Per-student overrides are a later iteration; the model already
   *  supports them. */
  classWideSupportIds: string[];
  supportsByStudent: Array<{ studentId: string; supportIds: string[] }>;
};

/**
 * v0.61 §2 — the readiness of the Assess panel, as an explicit union.
 *
 * WHY THIS IS A UNION AND NOT A BOOLEAN
 *
 * v0.60 called `prepareGrowthAdministration({ grade: selectedGrade ?? 'class6' })`.
 * The UI disabled the assign button when the grade was invalid, so no
 * wrong form could be assigned — but the *readiness evaluation itself*
 * was still being answered for Class 6. Every message the teacher read
 * ("not ready", the blocker list, the coverage summary) described a
 * Class 6 administration regardless of which class was selected. For a
 * Class 9 classroom with a typo in its year group, the panel would have
 * reported Class 6's readiness as if it were Class 9's.
 *
 * A formal readiness answer is only meaningful for a known grade. When
 * there is no known grade there is no answer, and the type now says so.
 */
export type AssignReadiness =
  | { kind: 'no_class_selected' }
  | { kind: 'invalid_grade'; message: string }
  | { kind: 'prepared'; result: GrowthPreparationResult };

/** Injectable preparation inputs. Production passes nothing and gets
 *  the real (empty, unauthorized) bank; the App-root harness passes a
 *  fixture bank without touching production governance data. */
export type GrowthPreparationInputs = {
  records?: GrowthItemRecord[];
  metadata?: Record<string, GrowthItemMetadata>;
  lookup?: SpecLookup;
  spec?: PilotAdministrationSpecification;
  authorization?: PilotFrameworkAuthorization;
};

/**
 * Pure readiness computation. Exported so a regression test can prove
 * that `prepare` is NEVER invoked without a valid grade — asserting on
 * rendered text could not distinguish "refused" from "evaluated Class 6
 * and then hid the result".
 */
export function computeAssignReadiness(args: {
  selectedClassroomId: string | null;
  rawGrade?: string;
  preparation?: GrowthPreparationInputs;
  prepare?: typeof prepareGrowthAdministration;
}): AssignReadiness {
  const {
    selectedClassroomId,
    rawGrade,
    preparation = {},
    prepare = prepareGrowthAdministration,
  } = args;

  if (!selectedClassroomId) return { kind: 'no_class_selected' };

  const grade = normalizeGrade(rawGrade);
  if (!grade) {
    return {
      kind: 'invalid_grade',
      message: `This class has no recognised year group${
        rawGrade ? ` (recorded as "${rawGrade}")` : ''
      }. Correct it under Classes before assigning.`,
    };
  }

  return {
    kind: 'prepared',
    result: prepare({
      context: 'growth_field_test',
      records: preparation.records ?? [],
      metadata: preparation.metadata ?? {},
      lookup: preparation.lookup ?? specificationById,
      grade,
      ...(preparation.spec ? { spec: preparation.spec } : {}),
      ...(preparation.authorization
        ? { authorization: preparation.authorization }
        : {}),
    }),
  };
}

export function GrowthAssignPanel({
  classrooms,
  selectedClassroomId,
  onSelectClassroom,
  onAssign,
  preparation,
  now = Date.now(),
}: {
  // v0.58 §5 — grade is required. v0.57 hardcoded 'class6' regardless
  // of which classroom was selected.
  classrooms: Array<{ id: string; name: string; grade?: string }>;
  selectedClassroomId: string | null;
  onSelectClassroom: (id: string) => void;
  /** v0.60 §5 — the draft now carries the teacher's support
   *  selections. v0.59 collected them into local state and emitted
   *  `accommodationsByStudentId: {}`, so every choice was silently
   *  discarded at the moment of assignment. */
  onAssign: (a: GrowthAssignmentDraft) => void;
  /** v0.61 §4 — injected by the App-root test harness only. */
  preparation?: GrowthPreparationInputs;
  now?: number;
}) {
  const [window, setWindow] = useState<GrowthWindow>('mid_year');
  const [supports, setSupports] = useState<string[]>([]);

  // §5 — the selected classroom's actual grade.
  //
  // v0.61 §2 — NO FALLBACK. When the grade is missing or unrecognised
  // the preparation call does not happen at all. v0.60 evaluated Class
  // 6 and hid the result behind a disabled button; the readiness text
  // the teacher read was still Class 6's.
  const selectedClassroom = classrooms.find((c) => c.id === selectedClassroomId);
  const rawGrade = selectedClassroom?.grade;

  // v0.57 §2 — the AUTHORITATIVE pipeline. v0.56 called
  // `buildGrowthPool()` here, which checked far less than the tested
  // architecture did, so every safeguard the suite proved applied to a
  // path no teacher could reach.
  //
  // Field test, never operational: operational is disabled at product
  // level and cannot be launched.
  const readiness = useMemo(
    () =>
      computeAssignReadiness({ selectedClassroomId, rawGrade, preparation }),
    [selectedClassroomId, rawGrade, preparation]
  );

  const prepared = readiness.kind === 'prepared' ? readiness.result : null;
  const canAssign = prepared?.ready === true;

  const toggle = (id: string) =>
    setSupports((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="Assess"
        title="Pragati Growth — Mathematics"
        subtitle="A formal check across Mathematics domains. Separate from everyday practice."
      />

      {readiness.kind === 'invalid_grade' && (
        <Card>
          <h2 className="text-sm font-semibold text-amber-900">
            This class needs its year group set
          </h2>
          <p className="mt-1 text-sm text-slate-700">{readiness.message}</p>
          {/* v0.61 §2 — say plainly that readiness was NOT evaluated.
              Silence here would read as "ready", and a Class 6 answer
              would be worse still. */}
          <p className="mt-2 text-sm text-slate-600">
            Growth readiness has not been checked for this class. It cannot
            be checked without a year group.
          </p>
        </Card>
      )}

      {prepared && !prepared.ready && (
        <Card>
          <h2 className="text-sm font-semibold text-slate-900">
            Growth assessment isn&apos;t ready to assign yet
          </h2>
          <p className="mt-1 text-sm text-slate-700">
            Learn and Practice are unaffected — your class can keep using
            them as normal.
          </p>

          {/* v0.53 §12 — what is done and what is left, in teacher
              language. The file paths and item-bank diagnostics that
              v0.52 printed here belong in Admin &amp; Research. */}
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <div className="rounded-xl bg-emerald-50 p-3 ring-1 ring-emerald-200">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-emerald-800">
                Done
              </div>
              <ul className="mt-1 space-y-0.5 text-xs text-emerald-900">
                <li>Assessment architecture drafted</li>
                <li>Question specifications and security rules defined</li>
                {/* §9 — v0.55 claimed the framework had been "reviewed
                    against official sources". Two of the three sources
                    that matter have never been opened. */}
                <li>Some official curriculum sources reviewed</li>
              </ul>
            </div>
            <div className="rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-600">
                Still to come
              </div>
              <ul className="mt-1 space-y-0.5 text-xs text-slate-700">
                <li>National assessment framework review</li>
                <li>Direct review of the national curriculum framework</li>
                <li>Review by Mathematics educators</li>
                <li>Writing and reviewing the questions</li>
                <li>Trialling them with students, then calibration</li>
              </ul>
            </div>
          </div>

          <details className="mt-3">
            <summary className="flex min-h-[44px] cursor-pointer items-center text-sm font-medium text-slate-700">
              Why isn&apos;t Growth ready?
            </summary>
            <p className="mt-2 text-sm text-slate-600">
              A Growth Check is meant to tell you where a student is across
              Mathematics. For that to mean anything, the questions have to
              be written to an agreed framework, reviewed by subject
              experts, and trialled with real students so we know how they
              behave. None of that has happened yet, so showing you a score
              now would be inventing one.
            </p>
            <p className="mt-2 text-sm text-slate-600">
              Technical detail is available under Admin &amp; Research.
            </p>
          </details>
        </Card>
      )}

      <Card>
        <h2 className="text-sm font-semibold text-slate-900">1. Class</h2>
        <div className="mt-2 flex flex-wrap gap-2">
          {classrooms.length === 0 && (
            <p className="text-sm text-slate-600">
              No classes yet. Create one under Classes first.
            </p>
          )}
          {classrooms.map((c) => (
            <button
              key={c.id}
              onClick={() => onSelectClassroom(c.id)}
              aria-pressed={selectedClassroomId === c.id}
              className={`inline-flex min-h-[44px] items-center rounded-lg px-3 py-1.5 text-xs font-semibold ring-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
                selectedClassroomId === c.id
                  ? 'bg-brand-50 text-brand-700 ring-brand-200'
                  : 'bg-white text-slate-600 ring-slate-200 hover:bg-slate-50'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="text-sm font-semibold text-slate-900">2. Testing window</h2>
        <div className="mt-2 flex flex-wrap gap-2">
          {(Object.keys(GROWTH_WINDOW_LABELS) as GrowthWindow[]).map((w) => (
            <button
              key={w}
              onClick={() => setWindow(w)}
              aria-pressed={window === w}
              className={`inline-flex min-h-[44px] items-center rounded-lg px-3 py-1.5 text-xs font-semibold ring-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
                window === w
                  ? 'bg-brand-50 text-brand-700 ring-brand-200'
                  : 'bg-white text-slate-600 ring-slate-200 hover:bg-slate-50'
              }`}
            >
              {GROWTH_WINDOW_LABELS[w]}
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-slate-500">
          {/* §10 — a hypothesis, not a product characteristic. */}
          Current pilot design hypothesis: about {PILOT_TEST_LENGTH} questions,
          roughly 40 minutes, one sitting. Length is not settled and may differ
          by class once trial data exists.
        </p>
      </Card>

      <Card>
        <h2 className="text-sm font-semibold text-slate-900">
          3. Access and support
        </h2>
        {/* v0.57 §8 — the canonical categorised model. v0.56 told
            teachers any accommodated sitting "may not be directly
            comparable", which is wrong for magnification and too weak
            for a calculator on a computation item. */}
        <p className="mt-1 text-xs text-slate-500">{SUPPORTS_EXPLANATION}</p>
        <div className="mt-2 space-y-2">
          {ACCESSIBILITY_SUPPORTS.map((sup) => (
            <label
              key={sup.id}
              className="flex min-h-[44px] cursor-pointer items-start gap-2 rounded-xl bg-slate-50 p-2 ring-1 ring-slate-200"
            >
              <input
                type="checkbox"
                checked={supports.includes(sup.id)}
                onChange={() => toggle(sup.id)}
                className="mt-1 h-5 w-5 shrink-0"
              />
              <span className="min-w-0">
                <span className="text-sm font-medium text-slate-900">
                  {sup.label}
                </span>
                <span className="mt-0.5 block text-xs text-slate-500">
                  {sup.category === 'universal_feature'
                    ? 'Available to everyone'
                    : sup.category === 'modification'
                      ? 'May change what is measured — reported separately'
                      : sup.comparability === 'expected_comparable'
                        ? 'Expected not to change what is measured'
                        : 'Recorded; may need separate interpretation'}
                </span>
              </span>
            </label>
          ))}
        </div>
      </Card>

      <div className="flex flex-wrap gap-2">
        <PrimaryButton
          disabled={!canAssign || !selectedClassroomId}
          onClick={() => {
            if (!selectedClassroomId) return;
            onAssign({
              classroomId: selectedClassroomId,
              assessmentId: 'pragati_growth_mathematics',
              window,
              opensAt: now,
              closesAt: now + 14 * 24 * 60 * 60 * 1000,
              classWideSupportIds: supports,
              // Expanded to per-student rows by the caller, which knows
              // the roster.
              supportsByStudent: [],
            });
          }}
        >
          Assign to class
        </PrimaryButton>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// STUDENT — the Home card, and the pre-test instructions
// ---------------------------------------------------------------------------

/**
 * Shown on Home ONLY when an assignment is live.
 *
 * §2 of the spec: Growth must not become a permanent fifth tab. When
 * nothing is assigned this renders nothing at all, so the student's
 * navigation is unchanged.
 */
export function GrowthCheckCard({
  assignment,
  onBegin,
}: {
  /** v0.61 §3 — the formal student view, derived from
   *  `FormalGrowthAssignment`. The legacy `GrowthAssignment` type is no
   *  longer reachable from active formal UI. */
  assignment: FormalAssignmentStudentView | null;
  onBegin: () => void;
}) {
  if (!assignment) return null;
  return (
    <Card>
      <div className="flex flex-wrap items-center gap-4">
        <div className="min-w-0 flex-1">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-brand-700">
            From your teacher
          </div>
          <div className="mt-0.5 text-base font-semibold text-slate-900">
            Your Growth Check is ready
          </div>
          <p className="mt-1 text-sm text-slate-600">
            A set of maths questions to see what you can do. It is not a test
            you can fail.
          </p>
        </div>
        <PrimaryButton onClick={onBegin}>Start</PrimaryButton>
      </div>
    </Card>
  );
}

/** Instructions screen. Sets expectations before the lock takes effect. */
export function GrowthInstructions({
  studentName,
  itemCount,
  onBegin,
  onBack,
}: {
  studentName: string;
  itemCount: number;
  onBegin: () => void;
  onBack: () => void;
}) {
  return (
    <div className="space-y-4">
      <PageHeader eyebrow="Growth Check" title={`Ready, ${studentName}?`} />
      <Card>
        <ul className="space-y-2 text-sm text-slate-700">
          <li>There are about {itemCount} questions.</li>
          <li>Some will feel easy and some will feel hard. That is normal.</li>
          <li>You will not see the answers, and there are no hints this time.</li>
          <li>Do your best on each one, then move on.</li>
          <li>Finish in one sitting if you can.</li>
        </ul>
      </Card>
      <div className="flex flex-wrap gap-2">
        <PrimaryButton onClick={onBegin}>Begin</PrimaryButton>
        <SecondaryButton onClick={onBack}>Not now</SecondaryButton>
      </div>
    </div>
  );
}

/** Completion screen. No score, because there is no defensible score. */
export function GrowthComplete({
  studentName,
  itemsAnswered,
  onDone,
}: {
  studentName: string;
  itemsAnswered: number;
  onDone: () => void;
}) {
  return (
    <div className="space-y-4">
      <PageHeader eyebrow="All done" title={`Thanks, ${studentName}`} />
      <Card>
        <p className="text-sm text-slate-700">
          You answered {itemsAnswered} question
          {itemsAnswered === 1 ? '' : 's'}. Your teacher will see how it went.
        </p>
        <p className="mt-2 text-sm text-slate-600">
          Back to learning whenever you are ready.
        </p>
      </Card>
      <PrimaryButton onClick={onDone}>Back to Home</PrimaryButton>
    </div>
  );
}
