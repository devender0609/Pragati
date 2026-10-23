// ===========================================================================
// v0.81 §A — ONE REGISTRY, EVERY CHAPTER.
//
// THE DEFECT THIS FIXES
//
// The review-package system reached `fractionsChapterSections()` and
// `authoredSectionById()` directly from `fractionsChapter.ts`. Both
// names say "fractions" and both were the only way in, so the entire
// apparatus — package generation, fingerprinting, the reviewer
// questions, the readiness assessment — could only see one chapter.
//
// That was invisible while Fractions was the only authored chapter. The
// moment Number Play §3.1 and §3.2 were written, they became content
// with no route to a reviewer: complete drafts that the packaging
// system did not know existed, and therefore would never report as
// waiting. A backlog you cannot see is worse than a long one.
//
// WHAT THIS DOES NOT DO
//
// It does not merge the chapters into one pile. Review is chapter-scoped
// in practice — a reviewer reads a chapter, not a product — so every
// function here takes or reports a chapter, and the callers that were
// legitimately Fractions-scoped stay Fractions-scoped. What changes is
// that the scope is now a parameter instead of a hard-coded import.
// ===========================================================================

import type { AuthoredSection } from './authoredSection';
import {
  CLASS10_IDENTITY_SECTIONS,
} from './identitySections';
import {
  CLASS10_COORDINATE_SECTIONS,
  COORDINATE_CHAPTER_ID,
} from './coordinateClass10Sections';
import {
  CLASS10_TANGENT_SECTIONS,
  TANGENT_CHAPTER_ID,
} from './tangentSections';
import {
  CIRCLE_AREA_CHAPTER_ID,
  CLASS10_CIRCLE_AREA_SECTIONS,
} from './circleAreaSections';
import {
  CLASS10_PROBABILITY_SECTIONS,
  PROBABILITY_C10_CHAPTER_ID,
} from './probabilityClass10Sections';
import {
  AP_CHAPTER_ID,
  CLASS10_AP_SECTIONS,
} from './apSections';
import {
  CLASS10_POLYNOMIAL_SECTIONS,
  POLYNOMIALS_CHAPTER_ID,
} from './polynomialSections';
import {
  CLASS10_REAL_NUMBERS_SECTIONS,
  REAL_NUMBERS_CHAPTER_ID,
} from './realNumbersSections';
import {
  CLASS10_HEIGHTS_DISTANCES_SECTIONS,
  HEIGHTS_CHAPTER_ID,
} from './heightsDistancesSections';
import {
  CLASS10_LINEAR_SYSTEM_SECTIONS,
  LINEAR_SYSTEMS_CHAPTER_ID,
} from './linearSystemSections';
import {
  CLASS10_STATISTICS_SECTIONS,
  STATISTICS_CHAPTER_ID,
} from './statisticsSections';
import {
  CLASS10_QUADRATIC_SECTIONS,
  QUADRATIC_CHAPTER_ID,
} from './quadraticSections';
import {
  CLASS10_SIMILARITY_SECTIONS,
  SIMILARITY_CHAPTER_ID,
} from './similaritySections';
import {
  CLASS10_COMPOSITE_SOLIDS_SECTIONS,
  COMPOSITE_SOLIDS_CHAPTER_ID,
} from './compositeSolidsSections';
import {
  CLASS10_TRIGONOMETRY_SECTIONS,
  TRIGONOMETRY_CHAPTER_ID,
} from './trigonometrySections';
import { fractionsChapterSections } from './fractionsChapter';
import { numberPlayChapterSections } from './numberPlaySections';
import { quadrilateralsChapterSections, QUADRILATERALS_CHAPTER_ID } from './quadrilateralsSections';
import { circlesChapterSections, CIRCLES_CHAPTER_ID } from './circlesSections';
import { linearPolynomialsChapterSections, LINEAR_POLYNOMIALS_CHAPTER_ID } from './linearPolynomialsSections';
import { identitiesChapterSections, IDENTITIES_CHAPTER_ID } from './identitiesSections';
import { twoVariablesChapterSections, TWO_VARIABLES_CHAPTER_ID } from './twoVariablesSections';
import { coordinatesChapterSections, COORDINATES_CHAPTER_ID } from './coordinatesSections';
import { mensurationChapterSections, MENSURATION_CHAPTER_ID } from './mensurationSections';
import { dataChapterSections, DATA_CHAPTER_ID } from './dataSections';
import { perimeterAreaChapterSections, PERIMETER_AREA_CHAPTER_ID } from './perimeterAreaSections';
import { sequencesChapterSections, SEQUENCES_CHAPTER_ID } from './sequencesSections';
import { probabilityChapterSections, PROBABILITY_CHAPTER_ID } from './probabilitySections';
import { algorithmsChapterSections, ALGORITHMS_CHAPTER_ID } from './algorithmsSections';
import { conversesChapterSections, CONVERSES_CHAPTER_ID } from './conversesSections';
import { numbersChapterSections, NUMBERS_CHAPTER_ID } from './numbersSections';

export const FRACTIONS_CHAPTER_ID = 'ncert_gp_c6_ch07_fractions';
export const NUMBER_PLAY_CHAPTER_ID = 'ncert_gp_c6_ch03_number_play';

/**
 * Every chapter that has authored content, with its sections.
 *
 * Adding a chapter means adding one line here. If that line is
 * forgotten, `v081ReviewCoverage.test.ts` fails: it walks the authored
 * files and asserts each chapter with authored sections appears in this
 * registry, so a chapter cannot be authored into invisibility again.
 */
export const AUTHORED_CHAPTERS: Array<{
  officialChapterId: string;
  title: string;
  sections: () => AuthoredSection[];
}> = [
  {
    officialChapterId: NUMBER_PLAY_CHAPTER_ID,
    title: 'Number Play',
    sections: numberPlayChapterSections,
  },
  {
    officialChapterId: FRACTIONS_CHAPTER_ID,
    title: 'Fractions',
    sections: fractionsChapterSections,
  },
  // v0.84.0 checkpoint 32 — the first Secondary Stage chapter. Registered
  // here so the review-packaging system can see it; a chapter authored
  // into invisibility is the defect this registry exists to prevent.
  {
    officialChapterId: QUADRILATERALS_CHAPTER_ID,
    title: 'Quadrilaterals',
    sections: quadrilateralsChapterSections,
  },
  // v0.84.0 checkpoint 33 — the second Secondary Stage pilot, chosen to test
  // what Quadrilaterals did not: a merged unit and construction geometry.
  {
    officialChapterId: CIRCLES_CHAPTER_ID,
    title: 'Circles',
    sections: circlesChapterSections,
  },
  // v0.84.0 checkpoint 34 — Wave 1, the first multi-chapter production run.
  // Algebra rather than geometry, to test whether the standard travels.
  // v0.84.0 checkpoint 35 — Chapter 1, an ordinary production chapter.
  {
    officialChapterId: COORDINATES_CHAPTER_ID,
    title: 'Coordinates',
    sections: coordinatesChapterSections,
  },
  {
    officialChapterId: LINEAR_POLYNOMIALS_CHAPTER_ID,
    title: 'Linear Polynomials',
    sections: linearPolynomialsChapterSections,
  },
  {
    officialChapterId: IDENTITIES_CHAPTER_ID,
    title: 'Identities',
    sections: identitiesChapterSections,
  },
  {
    officialChapterId: TWO_VARIABLES_CHAPTER_ID,
    title: 'Linear Equations in Two Variables',
    sections: twoVariablesChapterSections,
  },
  // v0.84.0 checkpoint 36 — the isolated representation pilot: mensuration
  // taught through nets, unrollings and generation diagrams, with no solid
  // drawn and no 3-D schema added.
  // v0.84.0 checkpoint 38 — Wave 2, ordinary production on stable architecture.
  {
    officialChapterId: PERIMETER_AREA_CHAPTER_ID,
    title: 'Measuring Space: Perimeter and Area',
    sections: perimeterAreaChapterSections,
  },
  // v0.84.0 checkpoint 42 — the last ordinary authoring wave. Eight of the
  // nine Chapter 3 units; §3.1 stays blocked on a human policy decision.
  {
    officialChapterId: NUMBERS_CHAPTER_ID,
    title: 'The World of Numbers',
    sections: numbersChapterSections,
  },
  // v0.84.0 checkpoint 41 — the first segment-backed chapter.
  {
    officialChapterId: CONVERSES_CHAPTER_ID,
    title: 'Propositions and their Converses',
    sections: conversesChapterSections,
  },
  // v0.84.0 checkpoint 40 — algorithmic fidelity.
  {
    officialChapterId: ALGORITHMS_CHAPTER_ID,
    title: 'The World of Algorithms',
    sections: algorithmsChapterSections,
  },
  // v0.84.0 checkpoint 39 — the mathematical-fidelity pilot.
  {
    officialChapterId: PROBABILITY_CHAPTER_ID,
    title: 'Introduction to Probability',
    sections: probabilityChapterSections,
  },
  {
    officialChapterId: SEQUENCES_CHAPTER_ID,
    title: 'Exploring Sequences',
    sections: sequencesChapterSections,
  },
  // v0.84.0 checkpoint 37 — the data pilot.
  {
    officialChapterId: DATA_CHAPTER_ID,
    title: 'Data',
    sections: dataChapterSections,
  },
  {
    officialChapterId: MENSURATION_CHAPTER_ID,
    title: 'Surface Area and Volume',
    sections: mensurationChapterSections,
  },
  // v0.84.0-c10.1 checkpoint 55 — the first Class 10 chapter. Nothing in this
  // registry is grade-specific, so Class 10 joins it exactly as Class 9 did;
  // the student catalogue reads the grade from the official chapter record.
  {
    officialChapterId: TRIGONOMETRY_CHAPTER_ID,
    title: 'Introduction to Trigonometry',
    sections: () => [...CLASS10_TRIGONOMETRY_SECTIONS, ...CLASS10_IDENTITY_SECTIONS],
  },
  {
    officialChapterId: COMPOSITE_SOLIDS_CHAPTER_ID,
    title: 'Surface Areas and Volumes',
    sections: () => CLASS10_COMPOSITE_SOLIDS_SECTIONS,
  },
  {
    officialChapterId: SIMILARITY_CHAPTER_ID,
    title: 'Triangles',
    sections: () => CLASS10_SIMILARITY_SECTIONS,
  },
  {
    officialChapterId: QUADRATIC_CHAPTER_ID,
    title: 'Quadratic Equations',
    sections: () => CLASS10_QUADRATIC_SECTIONS,
  },
  {
    officialChapterId: STATISTICS_CHAPTER_ID,
    title: 'Statistics',
    sections: () => CLASS10_STATISTICS_SECTIONS,
  },
  {
    officialChapterId: LINEAR_SYSTEMS_CHAPTER_ID,
    title: 'Pair of Linear Equations in Two Variables',
    sections: () => CLASS10_LINEAR_SYSTEM_SECTIONS,
  },
  {
    officialChapterId: HEIGHTS_CHAPTER_ID,
    title: 'Some Applications of Trigonometry',
    sections: () => CLASS10_HEIGHTS_DISTANCES_SECTIONS,
  },
  {
    officialChapterId: REAL_NUMBERS_CHAPTER_ID,
    title: 'Real Numbers',
    sections: () => CLASS10_REAL_NUMBERS_SECTIONS,
  },
  {
    officialChapterId: POLYNOMIALS_CHAPTER_ID,
    title: 'Polynomials',
    sections: () => CLASS10_POLYNOMIAL_SECTIONS,
  },
  {
    officialChapterId: AP_CHAPTER_ID,
    title: 'Arithmetic Progressions',
    sections: () => CLASS10_AP_SECTIONS,
  },
  {
    officialChapterId: PROBABILITY_C10_CHAPTER_ID,
    title: 'Probability',
    sections: () => CLASS10_PROBABILITY_SECTIONS,
  },
  {
    officialChapterId: CIRCLE_AREA_CHAPTER_ID,
    title: 'Areas Related to Circles',
    sections: () => CLASS10_CIRCLE_AREA_SECTIONS,
  },
  {
    officialChapterId: TANGENT_CHAPTER_ID,
    title: 'Circles',
    sections: () => CLASS10_TANGENT_SECTIONS,
  },
  {
    officialChapterId: COORDINATE_CHAPTER_ID,
    title: 'Coordinate Geometry',
    sections: () => CLASS10_COORDINATE_SECTIONS,
  },
];

/** Every authored section in the product, across chapters. */
export function allAuthoredSections(): AuthoredSection[] {
  return AUTHORED_CHAPTERS.flatMap((c) => c.sections());
}

export function authoredSectionsForChapter(
  officialChapterId: string
): AuthoredSection[] {
  return (
    AUTHORED_CHAPTERS.find((c) => c.officialChapterId === officialChapterId)
      ?.sections() ?? []
  );
}

/**
 * Look a section up by id, anywhere.
 *
 * This is the function the packaging system needed and did not have.
 * The Fractions-scoped one of the same name still exists in
 * `fractionsChapter.ts` and is still correct for its own callers; this
 * one is the cross-chapter reading.
 */
export function anyAuthoredSectionById(
  officialSectionId: string
): AuthoredSection | null {
  return (
    allAuthoredSections().find(
      (s) => s.source.officialSectionId === officialSectionId
    ) ?? null
  );
}

export function chapterIdForSection(officialSectionId: string): string | null {
  return (
    anyAuthoredSectionById(officialSectionId)?.source.officialChapterId ?? null
  );
}
