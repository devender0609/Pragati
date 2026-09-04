// v0.63 §1/§2/§12/§14 — THE ONE ELIGIBILITY POLICY.
//
// THE DEFECT THIS REPLACES
//
// v0.62 shipped two contradictory answers to "how much of Fractions can
// a student practise?".
//
//   Student landing:  5  (from `pragatiSkillIds.length > 0`)
//   Item alignment:   4  (from explicit per-skill section alignment)
//
// The cause is §7.1. Its section record lists `pragatiSkillIds:
// ['FR.02']` — a note that FR.02 is *related* to the section — while
// `itemAlignment` records FR.02 as exactly aligned to §7.2, with §7.1
// served only partially. So the student was offered "§7.1 Practice"
// backed by items authored for a different section.
//
// The fix is NOT to change 5 to 4. It is to stop two surfaces deciding
// the same question by different rules. Every surface below now calls
// this module:
//
//   Class 6 Learn · Fractions landing · Progress ·
//   Teacher coverage · Teacher Resources · Teacher assignment
//
// There are no stored eligibility booleans. Everything is derived, so
// the answers cannot drift apart again.

import { sectionsForChapter, officialSectionById } from './officialSections';
import { alignmentForSkill } from './itemAlignment';
import { isClass6Core } from './legacyDisposition';
import { STATIC_MAPPING } from './contentMapping';
import { SKILLS_BY_MODULE, type ModuleId, type SkillId } from '../types';
import { LESSONS } from '../data/lessons';
import { ITEMS } from '../data/items';
import { SECTION_7_4_ARTIFACT_VERSION } from './contentArtifact';
import { demonstrationSectionStatus } from './demonstrationSection';
import { isStudentLearningReady } from './contentStatus';
import { reviewRecordFor, mayAdvanceBeyondDraft } from './educatorReview';
import { mayPublishSection } from './publicationGate';

// ---------------------------------------------------------------------------
// The grandfathering rule — stated, not assumed
// ---------------------------------------------------------------------------

/**
 * v0.63 §2 — WHY LEGACY LESSONS ARE STILL SHOWN TO STUDENTS.
 *
 * Pragati's pre-v0.61 lessons were authored against the current
 * textbook's topics (fractions, geometry, prime time) but were never put
 * through the v0.61 complete-unit standard or educator review.
 *
 * Two options were available:
 *   (a) hide everything unreviewed — leaving Class 6 with nothing at
 *       all, since zero content has passed review;
 *   (b) grandfather the existing lessons for modules that remain part
 *       of the verified Class 6 curriculum, and hold NEW content to the
 *       full standard.
 *
 * (b) is chosen. The rule is deliberately narrow:
 *
 *   A legacy lesson is student-usable ONLY IF its module is
 *   `core_verified` for Class 6 — i.e. the current textbook still
 *   teaches that topic at this grade.
 *
 * This is why `decimals`, `ratio_proportion` and `algebra` are hidden
 * while `fractions` and `geometry` are not: the difference is not
 * review status (both are unreviewed) but whether the CURRICULUM
 * places them at Class 6 at all.
 *
 * Grandfathering never applies to content authored after v0.61. §7.4 is
 * `authored_draft` and stays invisible to students despite being the
 * highest-quality section in the product.
 */
export const LEGACY_LESSON_GRANDFATHERING = {
  applies: true,
  rule: 'Legacy lessons are student-usable only for modules whose topic the current textbook still places at this grade.',
  doesNotApplyTo:
    'Content authored under the v0.61 complete-unit standard, which requires educator review before students see it.',
} as const;

// ---------------------------------------------------------------------------
// Section-level
// ---------------------------------------------------------------------------

export type SectionAvailability =
  | 'learn_available'
  | 'practice_available'
  | 'not_available_yet';

export type SectionEligibility = {
  officialSectionId: string;
  /** Has anyone mapped Pragati content to this section at all? */
  hasMapping: boolean;
  /** Skills EXACTLY aligned to this section. Not "related to". */
  alignedSkillIds: string[];
  /** Skills that touch this section among others — never counted as
   *  practice for it. */
  ambiguousSkillIds: string[];
  hasEligibleLearn: boolean;
  hasEligiblePractice: boolean;
  isEducatorReviewed: boolean;
  availability: SectionAvailability;
  /** Why it is not offered, for Admin and the report. Never shown to
   *  students. */
  withheldReason: string | null;
};

/** Every skill Pragati has, from every module. */
function allSkillIds(): string[] {
  return Object.values(SKILLS_BY_MODULE).flat() as string[];
}

/** The module a skill belongs to, or null. */
function moduleForSkill(skillId: string): ModuleId | null {
  for (const [mod, skills] of Object.entries(SKILLS_BY_MODULE)) {
    if ((skills as string[]).includes(skillId)) return mod as ModuleId;
  }
  return null;
}

/**
 * THE AUTHORITATIVE ANSWER. May this section be advertised to a student
 * as section-specific Practice?
 *
 * Requires ALL of:
 *   1. at least one skill EXACTLY aligned to this section;
 *   2. that skill's module still part of the Class 6 core;
 *   3. actual items behind the skill;
 *   4. no reliance on a multi-section candidate.
 *
 * `pragatiSkillIds.length > 0` is deliberately NOT sufficient — that
 * field records relatedness, which is how §7.1 came to be advertised
 * with §7.2's items.
 */
export function mayOfferSectionPractice(officialSectionId: string): boolean {
  return sectionEligibility(officialSectionId).hasEligiblePractice;
}

export function sectionEligibility(
  officialSectionId: string
): SectionEligibility {
  // v0.65 §7 — generic lookup; no Fractions assumption.
  const record = officialSectionById(officialSectionId);

  const aligned: string[] = [];
  const ambiguous: string[] = [];

  for (const skillId of allSkillIds()) {
    const a = alignmentForSkill(skillId);
    if (a.alignmentStatus === 'exact_section_candidate') {
      if (a.officialSectionId === officialSectionId) aligned.push(skillId);
    } else if (a.alignmentStatus === 'multi_section_candidate') {
      if (a.candidateSectionIds.includes(officialSectionId)) {
        ambiguous.push(skillId);
      }
    }
  }

  // A skill only counts if its module is still Class 6 core.
  const usable = aligned.filter((s) => {
    const mod = moduleForSkill(s);
    return mod !== null && isClass6Core(mod);
  });

  const hasEligiblePractice = usable.length > 0;

  // Learn: authored-standard content requires review; legacy lessons
  // are grandfathered per the rule above.
  const demoIsThisSection = officialSectionId === 'ncert_gp_c6_s7_4';
  const demoReady =
    demoIsThisSection &&
    isStudentLearningReady(demonstrationSectionStatus()) &&
    mayAdvanceBeyondDraft(reviewRecordFor('B_demonstration')).allowed;

  const legacyLesson = usable.some((s) =>
    Boolean((LESSONS as Record<string, unknown>)[s])
  );
  const hasEligibleLearn = demoReady || legacyLesson;

  const isEducatorReviewed =
    record?.mappingReviewStatus === 'educator_reviewed';

  let availability: SectionAvailability = 'not_available_yet';
  if (hasEligibleLearn) availability = 'learn_available';
  else if (hasEligiblePractice) availability = 'practice_available';

  let withheldReason: string | null = null;
  if (availability === 'not_available_yet') {
    if (ambiguous.length > 0) {
      withheldReason = `only multi-section content available (${ambiguous.join(', ')})`;
    } else if (record && record.pragatiSkillIds.length > 0) {
      // The §7.1 case, named explicitly.
      withheldReason = `related content exists (${record.pragatiSkillIds.join(', ')}) but is aligned to another section`;
    } else if (demoIsThisSection) {
      withheldReason = 'authored draft awaiting educator review';
    } else {
      withheldReason = 'no content';
    }
  }

  return {
    officialSectionId,
    hasMapping: (record?.pragatiSkillIds.length ?? 0) > 0,
    alignedSkillIds: usable,
    ambiguousSkillIds: ambiguous,
    hasEligibleLearn,
    hasEligiblePractice,
    isEducatorReviewed,
    availability,
    withheldReason,
  };
}

export function getStudentSectionAvailability(
  officialSectionId: string
): SectionAvailability {
  return sectionEligibility(officialSectionId).availability;
}

// ---------------------------------------------------------------------------
// Chapter-level
// ---------------------------------------------------------------------------

export type ChapterAvailability = 'available' | 'not_available_yet';

export type ChapterEligibility = {
  officialChapterId: string;
  moduleIds: ModuleId[];
  /** v0.63 §2 — "Ready to learn" now requires actual Learn content,
   *  not merely a mapped module. */
  hasEligibleLearn: boolean;
  hasEligiblePractice: boolean;
  availability: ChapterAvailability;
};

export function getStudentChapterAvailability(
  officialChapterId: string
): ChapterEligibility {
  const mapping = STATIC_MAPPING.find(
    (m) => m.officialChapterId === officialChapterId
  );
  const moduleIds = (mapping?.legacyModuleIds ?? []).filter(isClass6Core);

  const skills = moduleIds.flatMap(
    (m) => (SKILLS_BY_MODULE[m] ?? []) as SkillId[]
  );

  // v0.70 §27 — CHAPTER LEARN NOW ROLLS UP FROM SECTIONS.
  //
  // This asked only "does any mapped skill have a lesson?", which is a
  // question about Pragati's legacy module inventory, not about the
  // chapter a student taps. The result was that Lines and Angles,
  // Prime Time, Perimeter and Area, and Symmetry all advertised
  // "Ready to learn" while every one of their sections was unavailable
  // — a student tapped the card and landed on a chapter whose eleven
  // parts all read "Coming soon".
  //
  // Four of five chapters were lying. The fix is the same one v0.64
  // applied to Practice for the same reason: where the official
  // section map exists, chapter status rolls UP from section
  // eligibility, so there is ONE decision-maker. A chapter is
  // learnable when at least one of its sections is.
  const sectionsForLearn = sectionsForChapter(officialChapterId);
  const hasEligibleLearn =
    sectionsForLearn.length > 0
      ? sectionsForLearn.some(
          (s) => sectionEligibility(s.officialSectionId).hasEligibleLearn
        )
      : skills.some((s) => Boolean((LESSONS as Record<string, unknown>)[s]));
  // v0.64 §8 — a REGISTERED SKILL IS NOT PROOF OF USABLE PRACTICE.
  //
  // This read `skills.length > 0`, so a module could advertise Practice
  // with zero questions behind it. Where the official section map
  // exists, chapter status rolls UP from section eligibility rather
  // than being decided again here — one decision-maker, per §14.
  const sections = sectionsForChapter(officialChapterId);
  const hasEligiblePractice =
    sections.length > 0
      ? sections.some((s) => sectionEligibility(s.officialSectionId).hasEligiblePractice)
      : skills.some((sk) => ITEMS.some((i) => i.skillId === sk));

  return {
    officialChapterId,
    moduleIds: [...moduleIds],
    hasEligibleLearn,
    hasEligiblePractice,
    availability:
      hasEligibleLearn || hasEligiblePractice ? 'available' : 'not_available_yet',
  };
}

// ---------------------------------------------------------------------------
// Assignment (§6)
// ---------------------------------------------------------------------------

export type AssignmentActivity = 'learn' | 'practice';

/**
 * v0.64 §10 — an assignment identifies a concrete instructional
 * ARTIFACT, not merely a set of skill IDs.
 *
 * "Assign FR.03, FR.05" does not say what the student will receive: a
 * lesson? a practice run? which item set? Skill IDs stay as metadata,
 * but the identity of the assigned thing is the activity.
 */
export type InstructionalActivity = {
  activityId: string;
  activityType: AssignmentActivity;
  officialChapterId: string;
  officialSectionId: string;
  /** Where the content comes from — legacy module or authored section. */
  provenance: 'legacy_module' | 'authored_section';
  /** Metadata, not identity. */
  skillIds: string[];
  itemCount: number;
  /** v0.65 §6 — which REVISION of the artifact was assigned. Without
   *  it, `s7_4:learn` names a slot rather than a thing, and an
   *  assignment made before a revision would silently point at content
   *  the teacher never saw. */
  activityVersion: number;
};

export type AssignEligibility =
  | { allowed: true; activity: InstructionalActivity }
  | { allowed: false; reason: string };

/**
 * May a teacher assign this section as instructional work?
 *
 * Stricter than student visibility. A student may practise
 * grandfathered legacy content they stumble upon; a teacher setting it
 * as official §7.x work is making a curriculum claim, and that requires
 * the alignment to be educator-reviewed.
 *
 * Consequence: NOTHING is assignable today. That is the honest state,
 * and the UI shows it rather than a fabricated example.
 */
export function mayAssignSectionActivity(
  officialSectionId: string,
  activity: AssignmentActivity
): AssignEligibility {
  const e = sectionEligibility(officialSectionId);

  if (activity === 'learn' && !e.hasEligibleLearn) {
    return { allowed: false, reason: 'No lesson is available for this section.' };
  }
  if (activity === 'practice' && !e.hasEligiblePractice) {
    return {
      allowed: false,
      reason:
        e.withheldReason === null
          ? 'No practice is available for this section.'
          : `No practice is available: ${e.withheldReason}.`,
    };
  }
  if (!e.isEducatorReviewed) {
    return {
      allowed: false,
      reason:
        'A teacher has not yet checked that this content matches the official section.',
    };
  }
  if (!isSectionStudentReady(officialSectionId)) {
    return {
      allowed: false,
      reason: 'This content is not ready to give to students yet.',
    };
  }

  // v0.65 §7 — the section's own chapter, not an assumed one.
  const record = officialSectionById(officialSectionId);
  const chapterId = record?.officialChapterId ?? '';

  const itemCount = e.alignedSkillIds.reduce(
    (n, skill) => n + ITEMS.filter((i) => i.skillId === skill).length,
    0
  );

  return {
    allowed: true,
    activity: {
      // Identity includes the artifact version for authored content.
      activityId:
        officialSectionId === 'ncert_gp_c6_s7_4'
          ? `ncert_gp_c6_s7_4_lesson:${activity}:v${SECTION_7_4_ARTIFACT_VERSION}`
          : `${officialSectionId}:${activity}:legacy`,
      activityVersion:
        officialSectionId === 'ncert_gp_c6_s7_4'
          ? SECTION_7_4_ARTIFACT_VERSION
          : 1,
      activityType: activity,
      officialChapterId: chapterId,
      officialSectionId,
      provenance:
        officialSectionId === 'ncert_gp_c6_s7_4'
          ? 'authored_section'
          : 'legacy_module',
      skillIds: e.alignedSkillIds,
      itemCount,
    },
  };
}

// ---------------------------------------------------------------------------
// Teacher coverage (§12)
// ---------------------------------------------------------------------------

export type TeacherCoverage = {
  officialChapterId: string;
  officialSections: number;
  /** Some historical mapping exists. The loosest claim. */
  mapped: number;
  /** Defensible section-specific practice. */
  practiceAvailable: number;
  learnAvailable: number;
  reviewed: number;
  studentReady: number;
};

/**
 * Deliberately five separate counts, not one "covered" number.
 *
 * For Fractions this yields mapped=5 and practiceAvailable=4 — and both
 * are true. The teacher UI explains the difference in practical
 * language rather than hiding it behind a single figure.
 */
export function getTeacherCoverageStatus(
  officialChapterId: string
): TeacherCoverage {
  const sections = sectionsForChapter(officialChapterId);
  let mapped = 0;
  let practice = 0;
  let learn = 0;
  let reviewed = 0;

  for (const s of sections) {
    if (s.pragatiSkillIds.length > 0) mapped += 1;
    const e = sectionEligibility(s.officialSectionId);
    if (e.hasEligiblePractice) practice += 1;
    if (e.hasEligibleLearn) learn += 1;
    if (e.isEducatorReviewed) reviewed += 1;
  }

  return {
    officialChapterId,
    officialSections: sections.length,
    mapped,
    practiceAvailable: practice,
    learnAvailable: learn,
    reviewed,
    studentReady: sections.filter((s) =>
      isSectionStudentReady(s.officialSectionId)
    ).length,
  };
}

/**
 * v0.64 §9 — STUDENT-READY IS A CONJUNCTION, NOT AN ALIAS FOR REVIEWED.
 *
 * v0.63 set `studentReady = reviewed`. Both were zero, so nothing broke
 * — but the identity was wrong and would have become a live defect the
 * moment a reviewer approved an alignment. An educator confirming that
 * items match §7.2 says nothing about whether a lesson exists, whether
 * the content passes the completeness standard, or whether the review
 * as a whole permits release.
 *
 * All four gates, derived each time. No stored boolean.
 */
export function isSectionStudentReady(officialSectionId: string): boolean {
  // v0.65 §1 — delegates to the REAL gate, which checks the required
  // Package A and Package B item subsets against the review record.
  //
  // v0.64 approximated this with
  // `mayAdvanceBeyondDraft(reviewRecordFor('B_demonstration'))` plus a
  // hand-maintained `mappingReviewStatus`. That was Package B only, and
  // it consulted a second truth that nothing kept in sync with the
  // review record. See publicationGate.ts.
  return mayPublishSection(officialSectionId).mayPublish;
}

/** Sections of a chapter a teacher could assign right now. */
export function assignableSections(
  officialChapterId: string,
  activity: AssignmentActivity
): string[] {
  return sectionsForChapter(officialChapterId)
    .filter((s) => mayAssignSectionActivity(s.officialSectionId, activity).allowed)
    .map((s) => s.officialSectionId);
}
