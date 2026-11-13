// v0.61 §6 — CANONICAL CONTENT STATUS MODELS.
//
// THE PROBLEM THESE EXIST TO PREVENT
//
// Pragati has repeatedly conflated three different things:
//
//   "a module row exists"        → "the curriculum is covered"
//   "an item bank exists"        → "there is a lesson"
//   "text was generated"         → "content was authored and reviewed"
//
// Each conflation is an honest-looking one-line derivation, and each is
// false. A module with 20 questions and no explanation is not a
// learning unit. A chapter title with no primary source behind it is
// not curriculum coverage.
//
// THE RULE
//
// These status axes are INDEPENDENT. No function in this file derives
// one from another, and `contentStatus.test.ts` asserts that no such
// derivation exists. If you want to know whether a unit has visuals,
// you must record the visual status; you may not infer it from the fact
// that a lesson was authored.
//
// Each axis is ORDERED — later stages presuppose earlier ones on the
// SAME axis, which is a different and legitimate claim.

// ---------------------------------------------------------------------------
// The axes
// ---------------------------------------------------------------------------

/** Where the OFFICIAL curriculum record stands. Says nothing about
 *  whether Pragati has any content for it. */
export const OFFICIAL_CURRICULUM_STATUSES = [
  'source_not_located',
  'source_located',
  'primary_inspected',
  'official_unit_recorded',
  'mapping_pending',
  'mapped',
  'mapping_reviewed',
] as const;
export type OfficialCurriculumStatus =
  (typeof OFFICIAL_CURRICULUM_STATUSES)[number];

export const LESSON_STATUSES = [
  'none',
  'generated_draft',
  'authored_draft',
  'math_reviewed',
  'curriculum_reviewed',
  'educator_reviewed',
  'published',
] as const;
export type LessonStatus = (typeof LESSON_STATUSES)[number];

export const WORKED_EXAMPLE_STATUSES = [
  'none',
  'draft',
  'reviewed',
  'published',
] as const;
export type WorkedExampleStatus = (typeof WORKED_EXAMPLE_STATUSES)[number];

export const VISUAL_STATUSES = [
  'none',
  'placeholder',
  'generic',
  'concept_specific',
  'mathematically_reviewed',
  'published',
] as const;
export type VisualStatus = (typeof VISUAL_STATUSES)[number];

export const PRACTICE_STATUSES = [
  'insufficient',
  'draft',
  'usable',
  'reviewed',
  'published',
] as const;
export type PracticeStatus = (typeof PRACTICE_STATUSES)[number];

export const TEACHER_RESOURCE_STATUSES = [
  'none',
  'draft',
  'reviewed',
  'published',
] as const;
export type TeacherResourceStatus =
  (typeof TEACHER_RESOURCE_STATUSES)[number];

export const UNIT_CHECK_STATUSES = [
  'unavailable',
  'blueprint_draft',
  'usable',
  'reviewed',
  'published',
] as const;
export type UnitCheckStatus = (typeof UNIT_CHECK_STATUSES)[number];

// ---------------------------------------------------------------------------
// The record
// ---------------------------------------------------------------------------

/**
 * The status of ONE instructional unit, on every axis.
 *
 * Every field is required. There is no default, and there is no
 * `Partial<>` constructor — an unrecorded axis must be written down as
 * its lowest value by a person who checked, not left absent and
 * silently treated as absent-or-fine.
 */
export type UnitContentStatus = {
  unitId: string;
  officialCurriculum: OfficialCurriculumStatus;
  lesson: LessonStatus;
  workedExamples: WorkedExampleStatus;
  visuals: VisualStatus;
  guidedPractice: PracticeStatus;
  independentPractice: PracticeStatus;
  mixedApplicationPractice: PracticeStatus;
  teacherResources: TeacherResourceStatus;
  unitCheck: UnitCheckStatus;
};

// ---------------------------------------------------------------------------
// Ordering — WITHIN one axis only
// ---------------------------------------------------------------------------

function rankIn<T extends string>(
  order: readonly T[],
  value: T
): number {
  return order.indexOf(value);
}

export function lessonAtLeast(a: LessonStatus, b: LessonStatus): boolean {
  return rankIn(LESSON_STATUSES, a) >= rankIn(LESSON_STATUSES, b);
}
export function practiceAtLeast(
  a: PracticeStatus,
  b: PracticeStatus
): boolean {
  return rankIn(PRACTICE_STATUSES, a) >= rankIn(PRACTICE_STATUSES, b);
}
export function visualAtLeast(a: VisualStatus, b: VisualStatus): boolean {
  return rankIn(VISUAL_STATUSES, a) >= rankIn(VISUAL_STATUSES, b);
}
export function officialAtLeast(
  a: OfficialCurriculumStatus,
  b: OfficialCurriculumStatus
): boolean {
  return (
    rankIn(OFFICIAL_CURRICULUM_STATUSES, a) >=
    rankIn(OFFICIAL_CURRICULUM_STATUSES, b)
  );
}

// ---------------------------------------------------------------------------
// The claims that are and are not permitted
// ---------------------------------------------------------------------------

/**
 * v0.61 §9 — TWO CONCEPTS, DELIBERATELY SEPARATED.
 *
 * THE DECISION AND WHY
 *
 * v0.61's first draft had one gate: every axis published, or nothing
 * ships. That is correct about what a COMPLETE UNIT means and wrong as
 * a shipping rule. It would withhold a mathematically reviewed,
 * educator-reviewed lesson with excellent visuals and practice from a
 * student because the teacher's printable notes were still in draft —
 * an artefact the student never sees.
 *
 * Blocking student learning on a teacher-facing artefact is not rigour,
 * it is a category error.
 *
 * So:
 *
 *   StudentLearningReady — everything the STUDENT needs, all of it
 *                          reviewed. May ship to students.
 *
 *   CompleteUnit         — StudentLearningReady PLUS the teacher-facing
 *                          and assessment artefacts. May be counted as
 *                          a finished curriculum unit.
 *
 * WHAT WAS NOT LOOSENED
 *
 * Every student-facing quality gate is unchanged. Lesson, worked
 * examples, visuals, guided practice and independent practice must all
 * reach `published`, which already requires mathematical, curriculum
 * and educator review on the lesson axis. Nothing reaches a student on
 * a draft.
 *
 * Mixed/application practice sits in CompleteUnit rather than
 * StudentLearningReady. That is a judgement call: application work is
 * genuinely valuable to students, but a unit that teaches its concept
 * well and lacks the application set is still worth learning from,
 * whereas one with no independent practice is not.
 *
 * Progress is reported against BOTH. A grade that is 100%
 * student-ready and 0% complete is a real and useful state, and the
 * report must be able to say so.
 */
export function isStudentLearningReady(s: UnitContentStatus): boolean {
  return (
    s.lesson === 'published' &&
    s.workedExamples === 'published' &&
    s.visuals === 'published' &&
    s.guidedPractice === 'published' &&
    s.independentPractice === 'published'
  );
}

/**
 * v0.66 §1 — READY FOR PUBLICATION is not the same as PUBLISHED.
 *
 * THE CIRCULARITY THIS BREAKS
 *
 * `mayPublishSection()` used `isStudentLearningReady()` as its
 * instructional-readiness precondition. But that function requires every
 * student-facing axis to already read `published` — so the gate was
 * asking "is this already published?" before permitting publication.
 * Nothing could ever pass it, and the only reason no one noticed is
 * that the review gates fail first.
 *
 * The distinction:
 *
 *   isReadyForStudentPublication  — the draft has been REVIEWED to the
 *                                   level required, so the transition
 *                                   MAY happen.
 *   isStudentLearningReady        — the transition HAS happened, so the
 *                                   content may be served.
 *
 * Pre-publication requires `educator_reviewed` on the lesson and
 * `reviewed` on the other student-facing axes — one step below
 * `published` on each. Publication is what moves them the last step,
 * and it is an explicit action, never a side effect of passing review.
 */
export function isReadyForStudentPublication(s: UnitContentStatus): boolean {
  return (
    lessonAtLeast(s.lesson, 'educator_reviewed') &&
    workedExampleAtLeast(s.workedExamples, 'reviewed') &&
    visualAtLeast(s.visuals, 'mathematically_reviewed') &&
    practiceAtLeast(s.guidedPractice, 'reviewed') &&
    practiceAtLeast(s.independentPractice, 'reviewed')
  );
}

/** What still blocks the publication TRANSITION, in reviewer words. */
export function blockingPublicationReadiness(s: UnitContentStatus): string[] {
  const out: string[] = [];
  if (!lessonAtLeast(s.lesson, 'educator_reviewed'))
    out.push(`lesson: ${s.lesson} (needs educator_reviewed)`);
  if (!workedExampleAtLeast(s.workedExamples, 'reviewed'))
    out.push(`worked examples: ${s.workedExamples} (needs reviewed)`);
  if (!visualAtLeast(s.visuals, 'mathematically_reviewed'))
    out.push(`visuals: ${s.visuals} (needs mathematically_reviewed)`);
  if (!practiceAtLeast(s.guidedPractice, 'reviewed'))
    out.push(`guided practice: ${s.guidedPractice} (needs reviewed)`);
  if (!practiceAtLeast(s.independentPractice, 'reviewed'))
    out.push(`independent practice: ${s.independentPractice} (needs reviewed)`);
  return out;
}

export function workedExampleAtLeast(
  a: WorkedExampleStatus,
  b: WorkedExampleStatus
): boolean {
  return (
    WORKED_EXAMPLE_STATUSES.indexOf(a) >= WORKED_EXAMPLE_STATUSES.indexOf(b)
  );
}

/**
 * v0.66 §11 — TEACHER-RESOURCE READINESS IS A SEPARATE CLAIM.
 *
 * T1-T4 (teacher notes) are excluded from STUDENT publication because
 * teacher notes are not student-facing. That exclusion is defensible —
 * but it must not let the unit be described as a fully reviewed
 * teacher-ready unit while the notes are unreviewed.
 *
 * So: a student lesson may publish with teacher resources in draft; the
 * UNIT may not be called teacher-ready until they are reviewed too.
 */
export function isTeacherResourceReady(s: UnitContentStatus): boolean {
  return (
    s.teacherResources === 'reviewed' || s.teacherResources === 'published'
  );
}

/** Axes a student never sees, and which therefore do not gate learning. */
export function isCompleteUnit(s: UnitContentStatus): boolean {
  return (
    isStudentLearningReady(s) &&
    s.mixedApplicationPractice === 'published' &&
    s.teacherResources === 'published' &&
    s.unitCheck === 'published'
  );
}

/** What is still missing before this could reach a student. */
export function blockingStudentRelease(s: UnitContentStatus): string[] {
  const out: string[] = [];
  if (s.lesson !== 'published') out.push(`lesson: ${s.lesson}`);
  if (s.workedExamples !== 'published')
    out.push(`worked examples: ${s.workedExamples}`);
  if (s.visuals !== 'published') out.push(`visuals: ${s.visuals}`);
  if (s.guidedPractice !== 'published')
    out.push(`guided practice: ${s.guidedPractice}`);
  if (s.independentPractice !== 'published')
    out.push(`independent practice: ${s.independentPractice}`);
  return out;
}

/**
 * @deprecated v0.61 §9 — use `isCompleteUnit` (whole unit finished) or
 * `isStudentLearningReady` (may ship to students). Retained so the
 * distinction is explicit at every call site rather than silently
 * changing meaning under existing callers.
 */
export function isPublishedForStudents(s: UnitContentStatus): boolean {
  return (
    s.lesson === 'published' &&
    s.workedExamples === 'published' &&
    s.visuals === 'published' &&
    s.guidedPractice === 'published' &&
    s.independentPractice === 'published' &&
    s.mixedApplicationPractice === 'published' &&
    s.teacherResources === 'published' &&
    s.unitCheck === 'published'
  );
}

/**
 * §21 — a generated draft is NEVER publishable, at any stage, on any
 * axis. Model output is a starting point for an author, not content.
 */
export function isGeneratedDraft(s: UnitContentStatus): boolean {
  return s.lesson === 'generated_draft';
}

/**
 * May this unit be COUNTED as official curriculum coverage?
 *
 * Only when the official record has been mapped from a primary source.
 * A Pragati module that happens to be about fractions does not become
 * coverage of an official Fractions chapter until someone has read the
 * chapter and recorded the mapping.
 */
export function countsAsOfficialCoverage(s: UnitContentStatus): boolean {
  return officialAtLeast(s.officialCurriculum, 'mapped');
}

/** Every axis still short of `published`, in reader-facing words. */
export function outstandingWork(s: UnitContentStatus): string[] {
  const out: string[] = [];
  if (s.lesson !== 'published') out.push(`lesson: ${s.lesson}`);
  if (s.workedExamples !== 'published')
    out.push(`worked examples: ${s.workedExamples}`);
  if (s.visuals !== 'published') out.push(`visuals: ${s.visuals}`);
  if (s.guidedPractice !== 'published')
    out.push(`guided practice: ${s.guidedPractice}`);
  if (s.independentPractice !== 'published')
    out.push(`independent practice: ${s.independentPractice}`);
  if (s.mixedApplicationPractice !== 'published')
    out.push(`mixed/application practice: ${s.mixedApplicationPractice}`);
  if (s.teacherResources !== 'published')
    out.push(`teacher resources: ${s.teacherResources}`);
  if (s.unitCheck !== 'published') out.push(`unit check: ${s.unitCheck}`);
  return out;
}

/** The lowest possible record. Used when a unit is first registered —
 *  explicitly, so that "nothing recorded" reads as "nothing done"
 *  rather than as an absent object. */
export function emptyUnitStatus(unitId: string): UnitContentStatus {
  return {
    unitId,
    officialCurriculum: 'source_not_located',
    lesson: 'none',
    workedExamples: 'none',
    visuals: 'none',
    guidedPractice: 'insufficient',
    independentPractice: 'insufficient',
    mixedApplicationPractice: 'insufficient',
    teacherResources: 'none',
    unitCheck: 'unavailable',
  };
}
