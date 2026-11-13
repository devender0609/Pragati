// v0.61 §10 — REVIEWER PREVIEW for the demonstration section.
//
// The draft banner lives HERE, in the Admin/reviewer wrapper, not in
// `LearnSectionView`. That separation is deliberate: the renderer is
// the one that will eventually serve students, and it must carry no
// governance vocabulary at all. If the banner lived inside it, the
// first published section would ship with authoring status visible to
// children — the exact failure §21 tests against.

import { LearnSectionView } from '../learn/LearnSectionView';
import { PracticeItemView } from '../learn/PracticeItemView';
import { SECTION_7_4_PRACTICE } from '../../curriculum/fractionsPracticeItems';
import {
  DEMO_SECTION_SOURCE,
  DEMO_SECTION_STUDENT,
  DEMO_SECTION_TEACHER,
  DEMO_SECTION_VISUALS,
  V1_UNIT_INTERVAL_FOURTHS,
  V2_EQUIVALENCE,
  V3_BEYOND_ONE,
  V4_STRIPS,
  demonstrationSectionStatus,
} from '../../curriculum/demonstrationSection';

const VISUALS_BY_ID = {
  V1_UNIT_INTERVAL_FOURTHS,
  V2_EQUIVALENCE,
  V3_BEYOND_ONE,
  V4_STRIPS,
};

export function DemonstrationSectionPreview({
  onBack,
}: {
  onBack: () => void;
}) {
  const status = demonstrationSectionStatus();

  return (
    <div className="pb-16">
      {/* Reviewer-only chrome. Never rendered in the student product. */}
      <div className="border-b border-amber-300 bg-amber-50 px-4 py-3">
        <div className="mx-auto max-w-3xl">
          <button
            type="button"
            onClick={onBack}
            className="min-h-11 text-sm font-medium text-slate-700"
          >
            ← Back to Curriculum &amp; Readiness
          </button>
          <p className="mt-2 text-sm font-semibold text-amber-900">
            Reviewer preview — status: {status.lesson}
          </p>
          <p className="mt-1 text-sm text-amber-800">
            Not published and not visible to students. No educator has
            reviewed this content. Competency mapping is{' '}
            {DEMO_SECTION_TEACHER.competencyMappingStatus.replace(/_/g, ' ')}.
          </p>
          <p className="mt-2 text-xs text-amber-700">
            Source: {DEMO_SECTION_SOURCE.textbook} · Chapter{' '}
            {DEMO_SECTION_SOURCE.chapterNumber}{' '}
            {DEMO_SECTION_SOURCE.chapterTitle} · Section{' '}
            {DEMO_SECTION_SOURCE.sectionNumber} (p.{' '}
            {DEMO_SECTION_SOURCE.startPage}) · inspected{' '}
            {DEMO_SECTION_SOURCE.inspectionDate}
          </p>
        </div>
      </div>

      <div className="pt-6">
        <LearnSectionView
          content={{
            officialReference: `Chapter ${DEMO_SECTION_SOURCE.chapterNumber} · ${DEMO_SECTION_SOURCE.exactTitle}`,
            learningGoal: DEMO_SECTION_STUDENT.learningGoal,
            prerequisiteCheck: DEMO_SECTION_STUDENT.prerequisiteCheck,
            explanation: DEMO_SECTION_STUDENT.explanation,
            visuals: DEMO_SECTION_VISUALS,
            workedExamples: DEMO_SECTION_STUDENT.workedExamples,
            misconceptions: DEMO_SECTION_STUDENT.misconceptions,
            guidedPractice: DEMO_SECTION_STUDENT.guidedPractice,
            independentPractice: DEMO_SECTION_STUDENT.independentPractice,
            reasoningApplication: DEMO_SECTION_STUDENT.reasoningApplication,
            summary: DEMO_SECTION_STUDENT.summary,
            nextStep: DEMO_SECTION_STUDENT.nextStep,
          }}
          visualsById={VISUALS_BY_ID}
        />
      </div>

      {/* v0.62 §9 — the interactive practice set.
          It lives HERE and not in the student path, and that is not an
          oversight: §7.4 is authored_draft, so a student must not reach
          it. But a reviewer cannot judge a number-line interaction from
          a description, so the working interaction is placed where the
          review actually happens. It becomes student-reachable when the
          section passes review, not before. */}
      <div className="mx-auto mt-8 max-w-3xl px-4">
        <h2 className="text-lg font-semibold text-slate-900">
          Practice (for review) — try the interactions
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          These are the real interactions a student would use. Tap the
          number line, type a fraction, choose a strip.
        </p>
        <div className="mt-3 space-y-4">
          {SECTION_7_4_PRACTICE.map((item) => (
            <PracticeItemView key={item.itemId} item={item} />
          ))}
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-3xl px-4">
        <h2 className="text-lg font-semibold text-slate-900">
          Teacher notes (for review)
        </h2>
        <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-slate-700">
          {DEMO_SECTION_TEACHER.teachingNotes.map((n, i) => (
            <li key={i}>{n}</li>
          ))}
        </ul>

        <h3 className="mt-6 text-sm font-semibold text-slate-900">
          Proposed competency mapping
        </h3>
        <ul className="mt-2 space-y-2 text-sm text-slate-700">
          {DEMO_SECTION_TEACHER.competencyMapping.map((c) => (
            <li key={c.id} className="rounded border border-slate-200 p-3">
              <p className="font-medium">{c.id}</p>
              <p className="mt-1">{c.text}</p>
              <p className="mt-1 text-slate-500">{c.justification}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
