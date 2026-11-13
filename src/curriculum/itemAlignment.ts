// v0.62 §6 — ITEM ↔ OFFICIAL SECTION ALIGNMENT.
//
// THE INFERENCE THIS FILE EXISTS TO FORBID
//
//   "this item is in the `fractions` module"
//   → "this item is aligned to Ganita Prakash §7.4"
//
// It is false. The `fractions` module covers five of the chapter's nine
// sections; §7.4 is one of the four it does NOT cover. Mass-tagging by
// module name would have produced 104 items claiming alignment to a
// section none of them teaches — and the claim would have looked
// authoritative because it was systematic.
//
// So alignment is recorded per item, with evidence, and defaults to
// `unmapped`. There is no bulk-tag helper, deliberately.
//
// Chapter-level and section-level alignment are also separate: knowing
// an item belongs to Chapter 7 says nothing about which of nine
// sections it serves.

import type { StagedCompetencyId } from './ncfStages';

export type AlignmentStatus =
  /** Nobody has assessed this item against the official structure. */
  | 'unmapped'
  /** A maintainer judges it to fit one section. */
  | 'exact_section_candidate'
  /** It spans sections — common for older items written against a
   *  different chapter structure. Not a defect, but not a section
   *  alignment either. */
  | 'multi_section_candidate'
  /** Assessed and found genuinely ambiguous or out of scope. */
  | 'requires_review';

export type AlignmentReviewStatus =
  | 'not_reviewed'
  | 'maintainer_proposed'
  | 'educator_reviewed';

export type ItemAlignment = {
  itemId: string;
  /** Chapter-level. May be known when section is not. */
  officialChapterId: string | null;
  /** Section-level. Null unless a specific section was identified —
   *  NEVER populated from the chapter or the module. */
  officialSectionId: string | null;
  /** Populated only for multi_section_candidate. */
  candidateSectionIds: string[];
  alignmentStatus: AlignmentStatus;
  /** Why. Free text, required for anything past `unmapped`. */
  alignmentEvidence: string | null;
  alignmentReviewStatus: AlignmentReviewStatus;
  /** Stage-qualified, and only when the section's own competency
   *  mapping supports it. */
  competencyIds: StagedCompetencyId[];
};

export function emptyAlignment(itemId: string): ItemAlignment {
  return {
    itemId,
    officialChapterId: null,
    officialSectionId: null,
    candidateSectionIds: [],
    alignmentStatus: 'unmapped',
    alignmentEvidence: null,
    alignmentReviewStatus: 'not_reviewed',
    competencyIds: [],
  };
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

export function validateAlignment(a: ItemAlignment): string[] {
  const errors: string[] = [];

  if (a.alignmentStatus !== 'unmapped' && !a.alignmentEvidence) {
    errors.push(
      `${a.itemId}: alignmentStatus '${a.alignmentStatus}' requires alignmentEvidence`
    );
  }
  if (a.alignmentStatus === 'exact_section_candidate' && !a.officialSectionId) {
    errors.push(`${a.itemId}: exact_section_candidate requires officialSectionId`);
  }
  if (a.alignmentStatus === 'multi_section_candidate') {
    if (a.officialSectionId) {
      errors.push(
        `${a.itemId}: multi_section_candidate must not claim a single officialSectionId`
      );
    }
    if (a.candidateSectionIds.length < 2) {
      errors.push(
        `${a.itemId}: multi_section_candidate needs at least two candidate sections`
      );
    }
  }
  if (a.alignmentStatus === 'unmapped' && a.officialSectionId) {
    errors.push(`${a.itemId}: unmapped item must not carry a section`);
  }
  return errors;
}

/**
 * May this item be presented as assessing the given official section?
 *
 * Requires an exact candidate AND a matching section. A
 * `multi_section_candidate` is deliberately refused: an item that
 * touches four sections cannot be offered as practice for one of them
 * without misrepresenting what the student is being asked.
 */
export function alignsToSection(
  a: ItemAlignment,
  officialSectionId: string
): boolean {
  return (
    a.alignmentStatus === 'exact_section_candidate' &&
    a.officialSectionId === officialSectionId
  );
}

/** Is the alignment confirmed by an educator, rather than proposed? */
export function alignmentIsReviewed(a: ItemAlignment): boolean {
  return a.alignmentReviewStatus === 'educator_reviewed';
}

// ---------------------------------------------------------------------------
// Class 6 Fractions — the only module assessed, item by item
// ---------------------------------------------------------------------------

const CH7 = 'ncert_gp_c6_ch07_fractions';

/**
 * v0.62 §6 — alignments for the Fractions pilot, by SKILL.
 *
 * Recorded at skill level rather than per individual item because the
 * skill is what determines the mathematics; every item under FR.03
 * teaches equivalent fractions regardless of its numbers. This is a
 * stated judgement, not a shortcut: it is still an explicit assessment
 * of each skill against the verified section list, and it still refuses
 * to map anything it cannot justify.
 *
 * Note what is NOT here: no skill maps to §7.3, §7.4, §7.7 or §7.9.
 * Those four sections have no Pragati items at all, which is exactly
 * what the v0.61 section mapping found. Mass-tagging by module would
 * have hidden it.
 */
export const CLASS6_FRACTIONS_SKILL_ALIGNMENT: Record<
  string,
  Omit<ItemAlignment, 'itemId'>
> = {
  'FR.02': {
    officialChapterId: CH7,
    officialSectionId: 'ncert_gp_c6_s7_2',
    candidateSectionIds: [],
    alignmentStatus: 'exact_section_candidate',
    alignmentEvidence:
      'FR.02 (represent fractions visually) matches §7.2 "Fractional Units as Parts of a Whole". Partially serves §7.1 as well; recorded against 7.2 as the closer fit.',
    alignmentReviewStatus: 'maintainer_proposed',
    competencyIds: [],
  },
  'FR.03': {
    officialChapterId: CH7,
    officialSectionId: 'ncert_gp_c6_s7_6',
    candidateSectionIds: [],
    alignmentStatus: 'exact_section_candidate',
    alignmentEvidence:
      'FR.03 (equivalent fractions) matches §7.6 "Equivalent Fractions" directly.',
    alignmentReviewStatus: 'maintainer_proposed',
    competencyIds: [],
  },
  'FR.04': {
    officialChapterId: CH7,
    officialSectionId: 'ncert_gp_c6_s7_5',
    candidateSectionIds: [],
    alignmentStatus: 'exact_section_candidate',
    alignmentEvidence:
      'FR.04 (mixed numbers and improper fractions) matches §7.5 "Mixed Fractions".',
    alignmentReviewStatus: 'maintainer_proposed',
    competencyIds: [],
  },
  'FR.05': {
    officialChapterId: CH7,
    officialSectionId: 'ncert_gp_c6_s7_8',
    candidateSectionIds: [],
    alignmentStatus: 'exact_section_candidate',
    alignmentEvidence:
      'FR.05 (add/subtract like denominators) sits inside §7.8 "Addition and Subtraction of Fractions".',
    alignmentReviewStatus: 'maintainer_proposed',
    competencyIds: [],
  },
  'FR.06': {
    officialChapterId: CH7,
    officialSectionId: 'ncert_gp_c6_s7_8',
    candidateSectionIds: [],
    alignmentStatus: 'exact_section_candidate',
    alignmentEvidence:
      'FR.06 (add/subtract unlike denominators) sits inside §7.8.',
    alignmentReviewStatus: 'maintainer_proposed',
    competencyIds: [],
  },
  'FR.07': {
    officialChapterId: CH7,
    officialSectionId: 'ncert_gp_c6_s7_8',
    candidateSectionIds: [],
    alignmentStatus: 'exact_section_candidate',
    alignmentEvidence:
      'FR.07 (word problems with fraction addition/subtraction) applies §7.8.',
    alignmentReviewStatus: 'maintainer_proposed',
    competencyIds: [],
  },
  'FR.08': {
    officialChapterId: CH7,
    // Deliberately NOT a single section. FR.08 is mixed review and
    // draws on simplification, comparison and operations, which the
    // book distributes across several sections. Claiming one would be
    // convenient and wrong.
    officialSectionId: null,
    candidateSectionIds: [
      'ncert_gp_c6_s7_6',
      'ncert_gp_c6_s7_7',
      'ncert_gp_c6_s7_8',
    ],
    alignmentStatus: 'multi_section_candidate',
    alignmentEvidence:
      'FR.08 (simplify and mixed review) spans equivalence (§7.6), comparison (§7.7) and operations (§7.8). No single section is defensible.',
    alignmentReviewStatus: 'maintainer_proposed',
    competencyIds: [],
  },
};

export function alignmentForSkill(skillId: string): ItemAlignment {
  const found = CLASS6_FRACTIONS_SKILL_ALIGNMENT[skillId];
  return found
    ? { itemId: skillId, ...found }
    : emptyAlignment(skillId);
}

export type AlignmentCoverage = {
  sectionsWithAlignedSkills: number;
  sectionsWithoutAlignedSkills: number;
  skillsExactlyAligned: number;
  skillsMultiSection: number;
  skillsUnmapped: number;
  educatorReviewedAlignments: number;
};

export function fractionsAlignmentCoverage(
  allChapterSectionIds: string[]
): AlignmentCoverage {
  const values = Object.values(CLASS6_FRACTIONS_SKILL_ALIGNMENT);
  const covered = new Set(
    values
      .map((v) => v.officialSectionId)
      .filter((x): x is string => x !== null)
  );
  return {
    sectionsWithAlignedSkills: covered.size,
    sectionsWithoutAlignedSkills: allChapterSectionIds.filter(
      (id) => !covered.has(id)
    ).length,
    skillsExactlyAligned: values.filter(
      (v) => v.alignmentStatus === 'exact_section_candidate'
    ).length,
    skillsMultiSection: values.filter(
      (v) => v.alignmentStatus === 'multi_section_candidate'
    ).length,
    skillsUnmapped: values.filter((v) => v.alignmentStatus === 'unmapped')
      .length,
    educatorReviewedAlignments: values.filter(
      (v) => v.alignmentReviewStatus === 'educator_reviewed'
    ).length,
  };
}
