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
import { ITEMS } from '../../data/items';
import { specificationById } from './rationalNumberSpecifications';
import {
  buildGrowthPool,
  GROWTH_WINDOW_LABELS,
  ACCOMMODATION_LABELS,
  type Accommodation,
  type GrowthAssignment,
  type GrowthWindow,
} from './growthSession';

/** Pilot length from the assessment specification. Not the v0.50
 *  10-item prototype assumption — see
 *  docs/PRAGATI_GROWTH_ASSESSMENT_SPEC.md §4. */
export const PILOT_TEST_LENGTH = 35;

// ---------------------------------------------------------------------------
// TEACHER — Assess
// ---------------------------------------------------------------------------

export function GrowthAssignPanel({
  classrooms,
  selectedClassroomId,
  onSelectClassroom,
  onAssign,
  now = Date.now(),
}: {
  classrooms: Array<{ id: string; name: string }>;
  selectedClassroomId: string | null;
  onSelectClassroom: (id: string) => void;
  onAssign: (a: Omit<GrowthAssignment, 'id' | 'createdAt'>) => void;
  now?: number;
}) {
  const [window, setWindow] = useState<GrowthWindow>('mid_year');
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);

  // Can this assessment actually run? Checked BEFORE the teacher
  // assigns it, so they never send students to a test that cannot
  // start.
  const readiness = useMemo(
    () =>
      buildGrowthPool({
        items: ITEMS,
        lookup: specificationById,
        targetLength: PILOT_TEST_LENGTH,
      }),
    []
  );

  const toggle = (a: Accommodation) =>
    setAccommodations((prev) =>
      prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]
    );

  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="Assess"
        title="Pragati Growth — Mathematics"
        subtitle="A formal check across Mathematics domains. Separate from everyday practice."
      />

      {!readiness.ok && (
        <Card>
          <h2 className="text-sm font-semibold text-amber-900">
            This assessment cannot be assigned yet
          </h2>
          <p className="mt-1 text-sm text-slate-700">{readiness.reason}</p>
          {/* break-words: the detail lines cite file paths, which are
              unbreakable tokens and overflowed a 320px viewport. */}
          <ul className="mt-2 list-disc space-y-1 break-words pl-5 text-xs text-slate-600">
            {readiness.detail.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
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
          About {PILOT_TEST_LENGTH} questions, roughly 40 minutes. One sitting.
        </p>
      </Card>

      <Card>
        <h2 className="text-sm font-semibold text-slate-900">3. Accommodations</h2>
        <p className="mt-1 text-xs text-slate-500">
          Recorded with the results, because an accommodated sitting may not be
          directly comparable to a standard one.
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {(Object.keys(ACCOMMODATION_LABELS) as Accommodation[]).map((a) => (
            <button
              key={a}
              onClick={() => toggle(a)}
              aria-pressed={accommodations.includes(a)}
              className={`inline-flex min-h-[44px] items-center rounded-lg px-3 py-1.5 text-xs font-semibold ring-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
                accommodations.includes(a)
                  ? 'bg-brand-50 text-brand-700 ring-brand-200'
                  : 'bg-white text-slate-600 ring-slate-200 hover:bg-slate-50'
              }`}
            >
              {ACCOMMODATION_LABELS[a]}
            </button>
          ))}
        </div>
      </Card>

      <div className="flex flex-wrap gap-2">
        <PrimaryButton
          disabled={!readiness.ok || !selectedClassroomId}
          onClick={() => {
            if (!selectedClassroomId) return;
            onAssign({
              classroomId: selectedClassroomId,
              assessmentId: 'pragati_growth_mathematics',
              window,
              opensAt: now,
              closesAt: now + 14 * 24 * 60 * 60 * 1000,
              accommodationsByStudentId: {},
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
  assignment: GrowthAssignment | null;
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
