// ===========================================================================
// v0.84.0-rc.3 checkpoint 46 — WHO MAY OPEN AN UNREVIEWED LESSON.
//
// Checkpoint 45 wrote the boundary into a comment and a function nothing
// called. `isAuthoredLearnPreviewable()` existed, was never invoked, and the
// runtime condition was simply "does this grade have authored content" — so
// a normal public build would have served all 92 unreviewed Class 9 lessons
// to any student. The claim that publication eligibility was untouched was
// true of the policy and false of the code.
//
// So the decision lives here, in one place, and the route asks it.
//
// Six separate questions, which this module keeps separate:
//
//   1. does authored content exist?        — the catalogue answers
//   2. may an internal tester preview it?  — THIS MODULE answers
//   3. is it eligible for ordinary delivery? — publication eligibility, elsewhere
//   4. reviewed?  5. adjudicated?  6. published?  — the lifecycle, elsewhere
//
// This is not the future publication system and must not become it. When
// Class 9 is reviewed and published, ordinary eligibility governs it and
// this flag becomes irrelevant to it.
// ===========================================================================

import type { AuthoredSection } from './authoredSection';

/**
 * The one build-time switch. A static Vite app has no server to ask, so the
 * decision is baked at build time and cannot be flipped by a URL parameter,
 * a stored setting or a key sequence.
 *
 * WHAT THIS GUARANTEES, PRECISELY.
 *
 * Inaccessibility, not absence. With the flag off, authored-draft lessons
 * cannot be delivered: the catalogue excludes them and a direct lesson
 * lookup denies them. It is NOT dead-code elimination — inspection of a
 * built public bundle finds preview code, the flag name and the lesson
 * prose still present in the JavaScript, because the artifacts are imported
 * by modules the app uses for other purposes.
 *
 * So this is a delivery gate, not a confidentiality measure. Anyone reading
 * the shipped assets can find the lesson text. If unreviewed content must
 * also be unreadable in the bundle, that needs a build-time exclusion, which
 * this is not and does not claim to be.
 *
 * ABSENT MEANS OFF. Enable it only for an internal RC preview deployment,
 * and only while the content it exposes is unreviewed.
 */
export const AUTHORED_LEARN_PREVIEW_FLAG = 'VITE_ENABLE_AUTHORED_LEARN_PREVIEW';

/** Overridable in tests only; production reads the build-time environment. */
let testOverride: boolean | null = null;

/** Test seam. Never called by application code. */
export function __setAuthoredLearnPreviewForTests(value: boolean | null): void {
  testOverride = value;
}

/**
 * Only the exact string 'true' opens the gate. An empty value, '1', 'yes',
 * 'TRUE', a typo or an absent variable all leave it shut — the safe reading
 * of an ambiguous value is the one that exposes nothing. Exported so the
 * rule can be tested as a rule, rather than through environment mutation.
 */
export function previewFlagValueEnables(value: unknown): boolean {
  return value === 'true';
}

export function authoredLearnPreviewEnabled(): boolean {
  if (testOverride !== null) return testOverride;
  const env = (import.meta as unknown as { env?: Record<string, unknown> }).env ?? {};
  return previewFlagValueEnables(env[AUTHORED_LEARN_PREVIEW_FLAG]);
}

/**
 * May this artifact be delivered to a student right now?
 *
 * An `authored_draft` lesson is reachable ONLY in preview mode. Nothing here
 * grants ordinary delivery: that is publication eligibility's job, and for
 * all 92 Class 9 artifacts it is still false.
 */
export function mayDeliverAuthoredLesson(section: AuthoredSection): boolean {
  if (section.reviewStatus === 'published') return true;
  return authoredLearnPreviewEnabled();
}

/** Whether a grade's authored catalogue may be shown at all. */
export function mayShowAuthoredCatalogue(sections: AuthoredSection[]): boolean {
  return sections.some((s) => mayDeliverAuthoredLesson(s));
}
