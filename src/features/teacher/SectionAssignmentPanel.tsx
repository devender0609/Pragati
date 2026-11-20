// v0.63 §6 — SECTION-AWARE ASSIGNMENT.
//
// A teacher assigns "Fractions → §7.4 Marking Fraction Lengths on the
// Number Line → Practice", not "mixed_fractions / FR.02 / generic Class
// 6 Math check".
//
// EVERY GATE IS THE SHARED POLICY. This screen invents no eligibility
// logic of its own — `mayAssignSectionActivity` is the same function
// the student surfaces and teacher coverage use.
//
// THE HONEST CONSEQUENCE: nothing is assignable today, because
// assignment requires the alignment to be educator-reviewed and no
// review has been received. The screen says exactly that and shows
// ZERO assignable examples. No fake reviewed data was inserted to
// populate a screenshot.

import { sectionsForChapter } from '../../curriculum/officialSections';
import {
  mayAssignSectionActivity,
  assignableSections,
  type AssignmentActivity,
} from '../../curriculum/eligibilityPolicy';

/** What a section assignment records. Identifiers, not display titles —
 *  titles change in presentation, IDs must stay stable (§13). */
export type SectionAssignmentDraft = {
  officialChapterId: string;
  officialSectionId: string;
  activityType: AssignmentActivity;
  /** v0.64 §10 — the concrete artifact assigned. Skill IDs are
   *  metadata on the activity, not the identity of the assignment. */
  activityId: string;
  skillIds: string[];
};

export function SectionAssignmentPanel({
  officialChapterId = 'ncert_gp_c6_ch07_fractions',
  onAssign,
}: {
  officialChapterId?: string;
  onAssign?: (draft: SectionAssignmentDraft) => void;
}) {
  const sections = sectionsForChapter(officialChapterId);
  const assignablePractice = assignableSections(officialChapterId, 'practice');
  const assignableLearn = assignableSections(officialChapterId, 'learn');
  const totalAssignable = assignablePractice.length + assignableLearn.length;

  return (
    <section className="space-y-4">
      <header>
        <h2 className="text-base font-semibold text-slate-900">
          Assign by chapter part
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Fractions · {sections.length} parts
        </p>
      </header>

      {totalAssignable === 0 && (
        <div className="rounded-lg border border-amber-300 bg-amber-50 p-4">
          <p className="text-sm font-semibold text-amber-900">
            Nothing can be assigned by chapter part yet
          </p>
          <p className="mt-1 text-sm text-amber-800">
            Before Pragati offers a part of the chapter as set work, a
            teacher needs to confirm that the questions really match that
            part of the book. That check has not happened yet, so no part
            is available to assign.
          </p>
          <p className="mt-2 text-sm text-amber-800">
            You can still assign practice the existing way, which is not
            tied to a specific part of the chapter.
          </p>
        </div>
      )}

      <ul className="space-y-2">
        {sections.map((s) => {
          const practice = mayAssignSectionActivity(
            s.officialSectionId,
            'practice'
          );
          const learn = mayAssignSectionActivity(s.officialSectionId, 'learn');
          const anyAllowed = practice.allowed || learn.allowed;

          return (
            <li
              key={s.officialSectionId}
              className="rounded-lg border border-slate-200 p-3"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="text-sm font-medium text-slate-900">
                  <span className="text-slate-500">{s.sectionNumber}</span>{' '}
                  {s.exactTitle}
                </span>
                {anyAllowed ? (
                  <span className="flex gap-2">
                    {learn.allowed && (
                      <button
                        type="button"
                        onClick={() =>
                          learn.allowed &&
                          onAssign?.({
                            officialChapterId: learn.activity.officialChapterId,
                            officialSectionId: learn.activity.officialSectionId,
                            activityType: learn.activity.activityType,
                            activityId: learn.activity.activityId,
                            skillIds: learn.activity.skillIds,
                          })
                        }
                        className="min-h-11 rounded-lg bg-slate-900 px-3 text-sm text-white"
                      >
                        Assign lesson
                      </button>
                    )}
                    {practice.allowed && (
                      <button
                        type="button"
                        onClick={() =>
                          practice.allowed &&
                          onAssign?.({
                            officialChapterId: practice.activity.officialChapterId,
                            officialSectionId: practice.activity.officialSectionId,
                            activityType: practice.activity.activityType,
                            activityId: practice.activity.activityId,
                            skillIds: practice.activity.skillIds,
                          })
                        }
                        className="min-h-11 rounded-lg bg-slate-900 px-3 text-sm text-white"
                      >
                        Assign practice
                      </button>
                    )}
                  </span>
                ) : (
                  <span className="text-xs text-slate-500">
                    Not available
                  </span>
                )}
              </div>
              {!anyAllowed && !practice.allowed && (
                <p className="mt-1 text-xs text-slate-500">
                  {practice.reason}
                </p>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
