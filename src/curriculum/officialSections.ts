// v0.61 §6 — OFFICIAL SECTION RECORDS.
//
// WHY SECTIONS, NOT JUST CHAPTERS
//
// Chapter-level mapping recorded Pragati's `fractions` module as
// `exact` against Ganita Prakash Chapter 7. Section-level mapping
// showed it covers 5 of the chapter's 9 sections. The coarser grain did
// not merely lose detail — it produced a false statement about the
// best-resourced unit in the product, and that statement survived four
// iterations because nothing in the codebase could contradict it.
//
// FOUR INDEPENDENT STATUSES (v0.61 §4)
//
// A. official verification  — is this section really in the textbook?
// B. Pragati content mapping — does Pragati have content for it?
// C. competency mapping      — which NCF-SE competency does it serve?
// D. mapping review          — has an educator confirmed B and C?
//
// These do not imply one another. A section can be primary-verified
// (A) with no Pragati content (B), no competency decided (C), and no
// review (D). That is the honest state of most of Class 6.
//
// ONLY CLASS 6 IS POPULATED. No other grade has a primary source.

import type { StagedCompetencyId } from './ncfStages';

export type SectionVerificationStatus =
  | 'unverified'
  | 'secondary_corroborated'
  | 'primary_source_verified';

export type SectionMappingType =
  | 'exact'
  | 'partial'
  | 'combined'
  | 'split'
  | 'unmapped';

/**
 * v0.61 §4 — competency mapping is its OWN axis and defaults to pending.
 *
 * The chapter structure is primary-verified. Which NCF-SE competency a
 * section serves is an interpretive judgement that a maintainer reading
 * a PDF is not qualified to make. Recording a plausible CG number
 * because it "obviously" fits is precisely how the Secondary Stage
 * numbers propagated through v0.52.
 */
export type CompetencyMappingStatus =
  | 'competency_mapping_pending'
  | 'competency_proposed'
  | 'competency_educator_reviewed';

export type MappingReviewStatus =
  | 'not_reviewed'
  | 'maintainer_proposed'
  | 'educator_reviewed';

export type OfficialSectionRecord = {
  officialSectionId: string;
  officialChapterId: string;
  sectionNumber: string;
  exactTitle: string;
  /** Page on which the section begins, or the chapter's start page
   *  where the section locator was not separately recorded. */
  startPage: number;
  verificationStatus: SectionVerificationStatus;
  sourceReference: string;
  /** C — independent of A and B. */
  competencyMappingStatus: CompetencyMappingStatus;
  mappedCompetencyIds: StagedCompetencyId[];
  /** B — Pragati skill IDs, empty when nothing exists. */
  pragatiSkillIds: string[];
  mappingType: SectionMappingType;
  /** D — never set by a maintainer to 'educator_reviewed'. */
  mappingReviewStatus: MappingReviewStatus;
  notes?: string;
};

const SRC = 'https://ncert.nic.in/textbook/pdf/fegp1dd.zip';

/** Shorthand for the common case: verified section, no Pragati content,
 *  no competency decided, no review. */
function unmapped(
  chapter: string,
  num: string,
  title: string,
  page: number,
  notes?: string
): OfficialSectionRecord {
  return {
    officialSectionId: `ncert_gp_c6_s${num.replace('.', '_')}`,
    officialChapterId: chapter,
    sectionNumber: num,
    exactTitle: title,
    startPage: page,
    verificationStatus: 'primary_source_verified',
    sourceReference: SRC,
    competencyMappingStatus: 'competency_mapping_pending',
    mappedCompetencyIds: [],
    pragatiSkillIds: [],
    mappingType: 'unmapped',
    mappingReviewStatus: 'not_reviewed',
    ...(notes ? { notes } : {}),
  };
}

/**
 * Section headings extracted from the chapter PDFs of Ganita Prakash
 * Grade 6 (Reprint 2026-27), retrieved 2026-08-24.
 *
 * Titles are as printed. Where a Pragati skill is recorded, the mapping
 * is a MAINTAINER's proposal and is marked as such.
 *
 * v0.83.1 §C — START PAGES CORRECTED.
 *
 * All 65 start pages were re-read from the same Reprint 2026-27 chapter
 * PDFs on 2026-09-22 and compared with what was recorded here. 43 were
 * wrong — §7.4, for instance, was recorded as p. 160 and is printed on
 * p. 159, which the page folio and the typesetting file name both
 * confirm. Every one now carries the printed page.
 *
 * Titles, numbering, section ids and chapter membership were unchanged
 * by this correction, and no lesson content was touched. The full
 * 65-row comparison is in CLASS6_PAGE_CORRECTION_AUDIT.md.
 */
export const CLASS6_OFFICIAL_SECTIONS: OfficialSectionRecord[] = [
  // --- Chapter 1: Patterns in Mathematics (p. 1) ---------------------
  unmapped('ncert_gp_c6_ch01_patterns', '1.1', 'What is Mathematics?', 1),
  unmapped('ncert_gp_c6_ch01_patterns', '1.2', 'Patterns in Numbers', 2),
  unmapped('ncert_gp_c6_ch01_patterns', '1.3', 'Visualising Number Sequences', 3),
  unmapped('ncert_gp_c6_ch01_patterns', '1.4', 'Relations among Number Sequences', 6),
  unmapped('ncert_gp_c6_ch01_patterns', '1.5', 'Patterns in Shapes', 9),
  unmapped('ncert_gp_c6_ch01_patterns', '1.6', 'Relation to Number Sequences', 11),

  // --- Chapter 2: Lines and Angles (p. 13) ---------------------------
  {
    officialSectionId: 'ncert_gp_c6_s2_1',
    officialChapterId: 'ncert_gp_c6_ch02_lines_angles',
    sectionNumber: '2.1',
    exactTitle: 'Point',
    startPage: 13,
    verificationStatus: 'primary_source_verified',
    sourceReference: SRC,
    competencyMappingStatus: 'competency_mapping_pending',
    mappedCompetencyIds: [],
    pragatiSkillIds: ['GB.01'],
    mappingType: 'partial',
    mappingReviewStatus: 'maintainer_proposed',
  },
  {
    officialSectionId: 'ncert_gp_c6_s2_2',
    officialChapterId: 'ncert_gp_c6_ch02_lines_angles',
    sectionNumber: '2.2',
    exactTitle: 'Line Segment',
    startPage: 14,
    verificationStatus: 'primary_source_verified',
    sourceReference: SRC,
    competencyMappingStatus: 'competency_mapping_pending',
    mappedCompetencyIds: [],
    pragatiSkillIds: ['GB.01'],
    mappingType: 'partial',
    mappingReviewStatus: 'maintainer_proposed',
  },
  {
    officialSectionId: 'ncert_gp_c6_s2_3',
    officialChapterId: 'ncert_gp_c6_ch02_lines_angles',
    sectionNumber: '2.3',
    exactTitle: 'Line',
    startPage: 14,
    verificationStatus: 'primary_source_verified',
    sourceReference: SRC,
    competencyMappingStatus: 'competency_mapping_pending',
    mappedCompetencyIds: [],
    pragatiSkillIds: ['GB.01', 'GB.02'],
    mappingType: 'partial',
    mappingReviewStatus: 'maintainer_proposed',
  },
  {
    officialSectionId: 'ncert_gp_c6_s2_4',
    officialChapterId: 'ncert_gp_c6_ch02_lines_angles',
    sectionNumber: '2.4',
    exactTitle: 'Ray',
    startPage: 15,
    verificationStatus: 'primary_source_verified',
    sourceReference: SRC,
    competencyMappingStatus: 'competency_mapping_pending',
    mappedCompetencyIds: [],
    pragatiSkillIds: ['GB.01'],
    mappingType: 'partial',
    mappingReviewStatus: 'maintainer_proposed',
  },
  {
    officialSectionId: 'ncert_gp_c6_s2_5',
    officialChapterId: 'ncert_gp_c6_ch02_lines_angles',
    sectionNumber: '2.5',
    exactTitle: 'Angle',
    startPage: 17,
    verificationStatus: 'primary_source_verified',
    sourceReference: SRC,
    competencyMappingStatus: 'competency_mapping_pending',
    mappedCompetencyIds: [],
    pragatiSkillIds: ['GB.03'],
    mappingType: 'partial',
    mappingReviewStatus: 'maintainer_proposed',
  },
  unmapped('ncert_gp_c6_ch02_lines_angles', '2.6', 'Comparing Angles', 21),
  unmapped(
    'ncert_gp_c6_ch02_lines_angles',
    '2.7',
    'Making Rotating Arms',
    25,
    'Angle as ROTATION, built hands-on. Pragati treats angle statically throughout.'
  ),
  unmapped('ncert_gp_c6_ch02_lines_angles', '2.8', 'Special Types of Angles', 27),
  {
    officialSectionId: 'ncert_gp_c6_s2_9',
    officialChapterId: 'ncert_gp_c6_ch02_lines_angles',
    sectionNumber: '2.9',
    exactTitle: 'Measuring Angles',
    startPage: 32,
    verificationStatus: 'primary_source_verified',
    sourceReference: SRC,
    competencyMappingStatus: 'competency_mapping_pending',
    mappedCompetencyIds: [],
    pragatiSkillIds: ['GB.04'],
    mappingType: 'partial',
    mappingReviewStatus: 'maintainer_proposed',
  },
  {
    officialSectionId: 'ncert_gp_c6_s2_10',
    officialChapterId: 'ncert_gp_c6_ch02_lines_angles',
    sectionNumber: '2.10',
    exactTitle: 'Drawing Angles',
    startPage: 46,
    verificationStatus: 'primary_source_verified',
    sourceReference: SRC,
    competencyMappingStatus: 'competency_mapping_pending',
    mappedCompetencyIds: [],
    pragatiSkillIds: ['GB.04'],
    mappingType: 'partial',
    mappingReviewStatus: 'maintainer_proposed',
  },
  {
    officialSectionId: 'ncert_gp_c6_s2_11',
    officialChapterId: 'ncert_gp_c6_ch02_lines_angles',
    sectionNumber: '2.11',
    exactTitle: 'Types of Angles and their Measures',
    startPage: 50,
    verificationStatus: 'primary_source_verified',
    sourceReference: SRC,
    competencyMappingStatus: 'competency_mapping_pending',
    mappedCompetencyIds: [],
    pragatiSkillIds: ['GB.03'],
    mappingType: 'partial',
    mappingReviewStatus: 'maintainer_proposed',
  },

  // --- Chapter 3: Number Play (p. 55) --------------------------------
  unmapped('ncert_gp_c6_ch03_number_play', '3.1', 'Numbers can Tell us Things', 55),
  unmapped('ncert_gp_c6_ch03_number_play', '3.2', 'Supercells', 57),
  unmapped('ncert_gp_c6_ch03_number_play', '3.3', 'Patterns of Numbers on the Number Line', 59),
  unmapped('ncert_gp_c6_ch03_number_play', '3.4', 'Playing with Digits', 60),
  unmapped('ncert_gp_c6_ch03_number_play', '3.5', 'Pretty Palindromic Patterns', 61),
  unmapped('ncert_gp_c6_ch03_number_play', '3.6', 'The Magic Number of Kaprekar', 62),
  unmapped('ncert_gp_c6_ch03_number_play', '3.7', 'Clock and Calendar Numbers', 64),
  unmapped('ncert_gp_c6_ch03_number_play', '3.8', 'Mental Math', 65),
  unmapped('ncert_gp_c6_ch03_number_play', '3.9', 'Playing with Number Patterns', 67),
  unmapped('ncert_gp_c6_ch03_number_play', '3.10', 'An Unsolved Mystery — the Collatz Conjecture!', 68),
  unmapped('ncert_gp_c6_ch03_number_play', '3.11', 'Simple Estimation', 69),
  unmapped('ncert_gp_c6_ch03_number_play', '3.12', 'Games and Winning Strategies', 71),

  // --- Chapter 4: Data Handling and Presentation (p. 74) -------------
  unmapped('ncert_gp_c6_ch04_data_handling', '4.1', 'Collecting and Organising Data', 74),
  unmapped('ncert_gp_c6_ch04_data_handling', '4.2', 'Pictographs', 79),
  unmapped('ncert_gp_c6_ch04_data_handling', '4.3', 'Bar Graphs', 85),
  unmapped('ncert_gp_c6_ch04_data_handling', '4.4', 'Drawing a Bar Graph', 89),
  unmapped('ncert_gp_c6_ch04_data_handling', '4.5', 'Artistic and Aesthetic Considerations', 101),

  // --- Chapter 5: Prime Time (p. 107) --------------------------------
  {
    officialSectionId: 'ncert_gp_c6_s5_1',
    officialChapterId: 'ncert_gp_c6_ch05_prime_time',
    sectionNumber: '5.1',
    exactTitle: 'Common Multiples and Common Factors',
    startPage: 107,
    verificationStatus: 'primary_source_verified',
    sourceReference: SRC,
    competencyMappingStatus: 'competency_mapping_pending',
    mappedCompetencyIds: [],
    pragatiSkillIds: ['FM.06', 'FM.07'],
    mappingType: 'partial',
    mappingReviewStatus: 'maintainer_proposed',
    notes:
      "Pragati's HCF/LCM framing comes from the OLD 'Playing with Numbers' chapter. Prime Time approaches the same ground through common multiples and factors first — the order differs.",
  },
  {
    officialSectionId: 'ncert_gp_c6_s5_2',
    officialChapterId: 'ncert_gp_c6_ch05_prime_time',
    sectionNumber: '5.2',
    exactTitle: 'Prime Numbers',
    startPage: 112,
    verificationStatus: 'primary_source_verified',
    sourceReference: SRC,
    competencyMappingStatus: 'competency_mapping_pending',
    mappedCompetencyIds: [],
    pragatiSkillIds: ['FM.03'],
    mappingType: 'partial',
    mappingReviewStatus: 'maintainer_proposed',
  },
  unmapped('ncert_gp_c6_ch05_prime_time', '5.3', 'Co-prime numbers for safekeeping treasures', 115),
  unmapped('ncert_gp_c6_ch05_prime_time', '5.4', 'Prime Factorisation', 117),
  {
    officialSectionId: 'ncert_gp_c6_s5_5',
    officialChapterId: 'ncert_gp_c6_ch05_prime_time',
    sectionNumber: '5.5',
    exactTitle: 'Divisibility Tests',
    startPage: 122,
    verificationStatus: 'primary_source_verified',
    sourceReference: SRC,
    competencyMappingStatus: 'competency_mapping_pending',
    mappedCompetencyIds: [],
    pragatiSkillIds: ['FM.04'],
    mappingType: 'partial',
    mappingReviewStatus: 'maintainer_proposed',
  },
  unmapped('ncert_gp_c6_ch05_prime_time', '5.6', 'Fun with numbers', 126),

  // --- Chapter 6: Perimeter and Area (p. 129) ------------------------
  unmapped('ncert_gp_c6_ch06_perimeter_area', '6.1', 'Perimeter', 129),
  unmapped('ncert_gp_c6_ch06_perimeter_area', '6.2', 'Area', 137),
  unmapped('ncert_gp_c6_ch06_perimeter_area', '6.3', 'Area of a Triangle', 142),

  // --- Chapter 7: Fractions (p. 151) — the pilot chapter -------------
  {
    officialSectionId: 'ncert_gp_c6_s7_1',
    officialChapterId: 'ncert_gp_c6_ch07_fractions',
    sectionNumber: '7.1',
    exactTitle: 'Fractional Units and Equal Shares',
    startPage: 152,
    verificationStatus: 'primary_source_verified',
    sourceReference: SRC,
    competencyMappingStatus: 'competency_mapping_pending',
    mappedCompetencyIds: [],
    pragatiSkillIds: ['FR.02'],
    mappingType: 'partial',
    mappingReviewStatus: 'maintainer_proposed',
    notes: 'FR.02 covers representation but not the equal-shares derivation.',
  },
  {
    officialSectionId: 'ncert_gp_c6_s7_2',
    officialChapterId: 'ncert_gp_c6_ch07_fractions',
    sectionNumber: '7.2',
    exactTitle: 'Fractional Units as Parts of a Whole',
    startPage: 154,
    verificationStatus: 'primary_source_verified',
    sourceReference: SRC,
    competencyMappingStatus: 'competency_mapping_pending',
    mappedCompetencyIds: [],
    pragatiSkillIds: ['FR.02'],
    mappingType: 'exact',
    mappingReviewStatus: 'maintainer_proposed',
  },
  unmapped(
    'ncert_gp_c6_ch07_fractions',
    '7.3',
    'Measuring Using Fractional Units',
    156,
    'No Pragati coverage. Measurement context for fractions is absent from the product.'
  ),
  {
    officialSectionId: 'ncert_gp_c6_s7_4',
    officialChapterId: 'ncert_gp_c6_ch07_fractions',
    sectionNumber: '7.4',
    exactTitle: 'Marking Fraction Lengths on the Number Line',
    startPage: 159,
    verificationStatus: 'primary_source_verified',
    sourceReference: SRC,
    // v0.61 §12 — the DEMONSTRATION SECTION. Competency is proposed
    // rather than pending because the source text is unusually direct:
    // Middle C-1.4 names visualising number sets on the number line.
    // Still requires educator confirmation.
    competencyMappingStatus: 'competency_proposed',
    mappedCompetencyIds: ['MIDDLE:C-1.4', 'MIDDLE:C-1.6'],
    pragatiSkillIds: [],
    mappingType: 'unmapped',
    mappingReviewStatus: 'maintainer_proposed',
    notes:
      'v0.61 demonstration section. Uncovered by Pragati despite realising a NAMED Middle Stage competency (C-1.4, visualising number sets on the number line).',
  },
  {
    officialSectionId: 'ncert_gp_c6_s7_5',
    officialChapterId: 'ncert_gp_c6_ch07_fractions',
    sectionNumber: '7.5',
    exactTitle: 'Mixed Fractions',
    startPage: 161,
    verificationStatus: 'primary_source_verified',
    sourceReference: SRC,
    competencyMappingStatus: 'competency_mapping_pending',
    mappedCompetencyIds: [],
    pragatiSkillIds: ['FR.04'],
    mappingType: 'exact',
    mappingReviewStatus: 'maintainer_proposed',
  },
  {
    officialSectionId: 'ncert_gp_c6_s7_6',
    officialChapterId: 'ncert_gp_c6_ch07_fractions',
    sectionNumber: '7.6',
    exactTitle: 'Equivalent Fractions',
    startPage: 163,
    verificationStatus: 'primary_source_verified',
    sourceReference: SRC,
    competencyMappingStatus: 'competency_mapping_pending',
    mappedCompetencyIds: [],
    pragatiSkillIds: ['FR.03'],
    mappingType: 'exact',
    mappingReviewStatus: 'maintainer_proposed',
  },
  unmapped(
    'ncert_gp_c6_ch07_fractions',
    '7.7',
    'Comparing Fractions',
    173,
    'No Pragati skill. Comparison is assumed rather than taught.'
  ),
  {
    officialSectionId: 'ncert_gp_c6_s7_8',
    officialChapterId: 'ncert_gp_c6_ch07_fractions',
    sectionNumber: '7.8',
    exactTitle: 'Addition and Subtraction of Fractions',
    startPage: 175,
    verificationStatus: 'primary_source_verified',
    sourceReference: SRC,
    competencyMappingStatus: 'competency_mapping_pending',
    mappedCompetencyIds: [],
    pragatiSkillIds: ['FR.05', 'FR.06', 'FR.07', 'FR.08'],
    mappingType: 'exact',
    mappingReviewStatus: 'maintainer_proposed',
  },
  unmapped(
    'ncert_gp_c6_ch07_fractions',
    '7.9',
    'A Pinch of History',
    182,
    'Realises Middle CG-9 (history of mathematics), a first-class curricular goal. Pragati has no history content anywhere.'
  ),

  // --- Chapter 8: Playing with Constructions (p. 187) ----------------
  unmapped('ncert_gp_c6_ch08_constructions', '8.1', 'Artwork', 187),
  unmapped('ncert_gp_c6_ch08_constructions', '8.2', 'Squares and Rectangles', 192),
  unmapped('ncert_gp_c6_ch08_constructions', '8.3', 'Constructing Squares and Rectangles', 195),
  unmapped('ncert_gp_c6_ch08_constructions', '8.4', 'An Exploration in Rectangles', 197),
  unmapped('ncert_gp_c6_ch08_constructions', '8.5', 'Exploring Diagonals of Rectangles and Squares', 203),
  unmapped('ncert_gp_c6_ch08_constructions', '8.6', 'Points Equidistant from Two Given Points', 211),

  // --- Chapter 9: Symmetry (p. 217) ----------------------------------
  {
    officialSectionId: 'ncert_gp_c6_s9_1',
    officialChapterId: 'ncert_gp_c6_ch09_symmetry',
    sectionNumber: '9.1',
    exactTitle: 'Line of Symmetry',
    startPage: 219,
    verificationStatus: 'primary_source_verified',
    sourceReference: SRC,
    competencyMappingStatus: 'competency_mapping_pending',
    mappedCompetencyIds: [],
    pragatiSkillIds: ['GB.08'],
    mappingType: 'partial',
    mappingReviewStatus: 'maintainer_proposed',
  },
  unmapped(
    'ncert_gp_c6_ch09_symmetry',
    '9.2',
    'Rotational Symmetry',
    230,
    'Absent from Pragati entirely.'
  ),

  // --- Chapter 10: The Other Side of Zero (p. 242) -------------------
  unmapped('ncert_gp_c6_ch10_other_side_of_zero', '10.1', "Bela's Building of Fun", 243),
  unmapped('ncert_gp_c6_ch10_other_side_of_zero', '10.2', 'The Token Model', 256),
  unmapped('ncert_gp_c6_ch10_other_side_of_zero', '10.3', 'Integers in Other Places', 259),
  unmapped('ncert_gp_c6_ch10_other_side_of_zero', '10.4', 'Explorations with Integers', 263),
  unmapped('ncert_gp_c6_ch10_other_side_of_zero', '10.5', 'A Pinch of History', 266),
];

// ---------------------------------------------------------------------------
// Section-aware reporting (v0.61 §7)
// ---------------------------------------------------------------------------

export type ChapterSectionCoverage = {
  officialChapterId: string;
  officialSections: number;
  mappedSections: number;
  partiallyMappedSections: number;
  unmappedSections: number;
  educatorReviewedMappings: number;
  competencyMappingsPending: number;
};

/**
 * v0.65 §7 — canonical lookup by section ID, across the whole verified
 * registry.
 *
 * `sectionEligibility()` previously found records via
 * `sectionsForChapter('ncert_gp_c6_ch07_fractions')` — a hard-coded
 * Fractions assumption that would have silently returned "no record"
 * for any other chapter's section, and therefore an honest-looking but
 * meaningless answer. Fractions is still the only instructional pilot;
 * this simply removes the hidden coupling.
 */
export function officialSectionById(
  officialSectionId: string
): OfficialSectionRecord | null {
  return (
    CLASS6_OFFICIAL_SECTIONS.find(
      (s) => s.officialSectionId === officialSectionId
    ) ?? null
  );
}

export function sectionsForChapter(
  officialChapterId: string
): OfficialSectionRecord[] {
  return CLASS6_OFFICIAL_SECTIONS.filter(
    (s) => s.officialChapterId === officialChapterId
  );
}

/**
 * Deliberately returns COUNTS, not a percentage.
 *
 * "5 of 9 sections mapped" is a true statement about mapping.
 * "56% curriculum complete" would be a false statement about content:
 * a mapped section may still have no lesson, no visuals, and no
 * reviewed practice. Mapping coverage, instructional completeness, and
 * review completeness are three different questions and this function
 * answers only the first.
 */
export function sectionCoverageForChapter(
  officialChapterId: string
): ChapterSectionCoverage {
  const rows = sectionsForChapter(officialChapterId);
  return {
    officialChapterId,
    officialSections: rows.length,
    mappedSections: rows.filter((s) => s.mappingType === 'exact').length,
    partiallyMappedSections: rows.filter(
      (s) =>
        s.mappingType === 'partial' ||
        s.mappingType === 'combined' ||
        s.mappingType === 'split'
    ).length,
    unmappedSections: rows.filter((s) => s.mappingType === 'unmapped').length,
    educatorReviewedMappings: rows.filter(
      (s) => s.mappingReviewStatus === 'educator_reviewed'
    ).length,
    competencyMappingsPending: rows.filter(
      (s) => s.competencyMappingStatus === 'competency_mapping_pending'
    ).length,
  };
}

export function allClass6SectionCoverage(): ChapterSectionCoverage[] {
  const ids = [...new Set(CLASS6_OFFICIAL_SECTIONS.map((s) => s.officialChapterId))];
  return ids.map(sectionCoverageForChapter);
}

/**
 * v0.83.1 §C — the one place a Class 6 section's printed start page
 * lives.
 *
 * Authored sections used to repeat the page in their own source blocks,
 * so a correction here left them behind. They call this instead.
 */
export function officialStartPage(officialSectionId: string): number {
  const s = CLASS6_OFFICIAL_SECTIONS.find(
    (x) => x.officialSectionId === officialSectionId
  );
  if (!s) {
    throw new Error(
      `no official Class 6 section '${officialSectionId}' — a lesson may not ` +
        'cite a page for a record that does not exist'
    );
  }
  return s.startPage;
}
