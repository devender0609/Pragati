// v0.51 §8 — Readiness, as four independent dimensions.
//
// THE PROBLEM WITH ONE STATUS
//
// v0.50 had a single `DerivedStatus` that tried to mean four different
// things at once, so it inevitably implied things that were not true.
// "prototype_ready_review" said something about instruction, but the
// Learn tab, the Practice launcher, and the coverage dashboard all read
// it as if it also described their concerns.
//
// These are genuinely independent. A chapter can be curriculum-mapped,
// have prototype lessons, have a usable practice bank, and be nowhere
// near Growth-assessment eligible — which is the actual state of Class
// 6 Fractions today. One label cannot carry that.
//
// So: four axes, no inference between them. `growthStatus` in
// particular is NEVER derived from item counts, because having
// questions is not the same as having calibrated instruments.

export type CurriculumStatus =
  | 'unverified'
  | 'secondary_corroborated'
  | 'primary_source_verified'
  | 'mapped'
  | 'mapping_reviewed';

export type InstructionStatus =
  | 'none'
  | 'draft'
  | 'prototype'
  | 'reviewed'
  | 'published';

export type PracticeStatus =
  | 'insufficient_bank'
  | 'usable'
  | 'reviewed'
  | 'published';

export type GrowthStatus =
  | 'not_eligible'
  | 'specifications_ready'
  | 'items_authored'
  | 'expert_reviewed'
  | 'field_test_ready'
  | 'field_tested'
  | 'calibrated'
  | 'operational'
  | 'retired';

export type ReadinessProfile = {
  curriculum: CurriculumStatus;
  instruction: InstructionStatus;
  practice: PracticeStatus;
  growth: GrowthStatus;
};

// --- Teacher / Admin labels. Precise, technical, honest. ---

export const CURRICULUM_STATUS_LABEL: Record<CurriculumStatus, string> = {
  unverified: 'Not verified',
  secondary_corroborated: 'Secondary sources only',
  primary_source_verified: 'Verified against official source',
  mapped: 'Mapped to Pragati content',
  mapping_reviewed: 'Mapping reviewed by a teacher',
};

export const INSTRUCTION_STATUS_LABEL: Record<InstructionStatus, string> = {
  none: 'No lessons',
  draft: 'Draft lessons',
  prototype: 'Prototype lessons',
  reviewed: 'Teacher-reviewed lessons',
  published: 'Published lessons',
};

export const PRACTICE_STATUS_LABEL: Record<PracticeStatus, string> = {
  insufficient_bank: 'Not enough questions',
  usable: 'Usable question bank',
  reviewed: 'Reviewed question bank',
  published: 'Published question bank',
};

export const GROWTH_STATUS_LABEL: Record<GrowthStatus, string> = {
  not_eligible: 'Not eligible for Growth',
  specifications_ready: 'Item specifications ready',
  items_authored: 'Items authored',
  expert_reviewed: 'Expert reviewed',
  field_test_ready: 'Ready for field test',
  field_tested: 'Field tested',
  calibrated: 'Calibrated',
  operational: 'Operational',
  retired: 'Retired',
};

// --- Student labels. Only two axes are ever student-visible, and only
// --- in plain language. Curriculum and Growth status are governance
// --- concerns and never reach a child.

/**
 * What a student is told, derived from what they can actually DO.
 *
 * Deliberately NOT a status translation: it answers "is there something
 * here for me?" That is the only question a student is asking, and it
 * keeps every governance term off their screen.
 */
export function studentAvailabilityLabel(
  p: ReadinessProfile
): 'Ready to learn' | 'Practice available' | 'Lessons available' | 'Coming soon' {
  const hasLessons = p.instruction !== 'none' && p.instruction !== 'draft';
  const hasPractice = p.practice !== 'insufficient_bank';
  if (hasLessons && hasPractice) return 'Ready to learn';
  if (hasPractice) return 'Practice available';
  if (hasLessons) return 'Lessons available';
  return 'Coming soon';
}

/** Terms that must never appear on a student screen. Exported so the
 *  jargon test can assert against one list. */
export const GOVERNANCE_TERMS = [
  'prototype',
  'starter',
  'pilot',
  'review required',
  'ready for review',
  'blueprint',
  'calibrat',
  'secondary corroborated',
  'source verified',
  'unverified',
  'field test',
  'item status',
  'specification',
  'psychometric',
  'competency code',
] as const;

/**
 * Independence guard.
 *
 * Growth readiness must never be inferred from instruction or practice
 * readiness. This function exists so the rule is testable: it returns
 * the errors in a profile that claims Growth readiness without the
 * evidence that would justify it.
 */
export function validateReadiness(p: ReadinessProfile): string[] {
  const e: string[] = [];

  // The only cross-axis rules that are legitimate are ones that
  // prevent overclaiming — never ones that upgrade a status.
  if (p.growth === 'calibrated' || p.growth === 'operational') {
    e.push(
      `growth status '${p.growth}' cannot be set: Pragati has no calibration data. See docs/PSYCHOMETRIC_VALIDATION_PLAN.md`
    );
  }
  if (
    p.curriculum === 'primary_source_verified' ||
    p.curriculum === 'mapping_reviewed'
  ) {
    // Allowed as a value, but the record must carry its evidence —
    // enforced by validateOfficialChapter, not here. Noted so the two
    // checks are not confused.
  }
  return e;
}

/** The honest default for content that has not been assessed for
 *  Growth. Everything starts here and moves only on evidence. */
export const DEFAULT_READINESS: ReadinessProfile = {
  curriculum: 'unverified',
  instruction: 'none',
  practice: 'insufficient_bank',
  growth: 'not_eligible',
};
