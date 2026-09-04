// v0.74 §24/§25 — IN WHAT ORDER SHOULD CLASS 6 BE AUTHORED, AND WHY.
//
// WHY ONLY CLASS 6
//
// Class 6 is the only grade verified deeply enough to author against.
// Its ten Ganita Prakash chapters and 65 sections come from the printed
// contents page; Classes 9-12 are verified at syllabus-unit depth,
// which is too coarse to plan a lesson against (see `curriculumGrain.ts`).
// So this roadmap covers Class 6 and says nothing about the rest.
//
// §25 — THE ASSUMPTION THIS FILE REFUSES
//
// Chapter 7 is a fractions chapter. Its shape — a number line, a
// semantic visual, an interactive item, a documented misconception —
// came from what fractions actually need. Nine of the ten remaining
// chapters are not fractions.
//
//   "Playing with Constructions" is a chapter about doing things with a
//   compass and straightedge. Its practice is a construction, not a
//   multiple-choice question, and Pragati has no construction surface.
//
//   "Data Handling and Presentation" needs tables, charts and data
//   representations. Pragati renders none of those today.
//
//   "Symmetry" is almost entirely visual. A text explanation with a
//   worked example is close to the wrong medium for it.
//
//   "Patterns in Mathematics" and "Prime Time" are reasoning and
//   number-theory chapters where the mathematics IS the argument.
//
// Forcing one interactive item and one documented misconception into
// each of those would reproduce, at chapter scale, exactly the failure
// the completeness model was built to prevent at section scale.
//
// So each chapter carries its own production considerations, and the
// ordering is driven partly by whether Pragati can currently RENDER
// what the chapter needs. Ranking a construction chapter first would
// mean discovering mid-authoring that the platform cannot show a
// compass arc.
//
// NOTHING HERE IS CONTENT. This is a sequence and a set of constraints.

import { sectionsForChapter } from './officialSections';
import { officialCurriculumForGrade } from './officialCurriculum';
import { authoredSectionById } from './fractionsChapter';

/** The dominant mathematical character of a chapter. */
export type MathDomain =
  | 'number_and_operations'
  | 'number_theory_and_reasoning'
  | 'pattern_and_generalisation'
  | 'geometry_measurement'
  | 'geometry_construction'
  | 'geometry_transformation'
  | 'data_and_representation';

/** Can Pragati currently render what this chapter needs? */
export type VisualSystemReadiness =
  /** Existing components cover it. */
  | 'ready'
  /** Needs components Pragati has not built. */
  | 'requires_new_components'
  /** Needs an interaction model that does not exist at all. */
  | 'requires_new_interaction_model';

export type ChapterRoadmapEntry = {
  rank: number | null;
  officialChapterId: string;
  chapterNumber: number;
  title: string;
  sections: number;
  sectionsAuthored: number;
  sectionsRemaining: number;
  domain: MathDomain;
  visualSystem: VisualSystemReadiness;
  /** Legacy Pragati material that is genuinely about this content. */
  alignedLegacyMaterial: string | null;
  /** Chapters whose concepts this one leans on. */
  dependsOn: string[];
  /** §25 — what this chapter needs that Fractions did not. */
  productionConsiderations: string[];
  /** What must be true before authoring starts. Empty when nothing. */
  blockers: string[];
  rationale: string;
};

/**
 * Domain and readiness judgements, per chapter.
 *
 * These are engineering and pedagogical assessments of the CHAPTER
 * TITLES AND SECTION LISTS Pragati has verified — not claims about the
 * textbook's contents beyond what the contents page states.
 */
const CHAPTERS: Record<
  string,
  Omit<
    ChapterRoadmapEntry,
    'rank' | 'officialChapterId' | 'chapterNumber' | 'title' | 'sections' | 'sectionsAuthored' | 'sectionsRemaining'
  >
> = {
  ncert_gp_c6_ch07_fractions: {
    domain: 'number_and_operations',
    visualSystem: 'ready',
    alignedLegacyMaterial: 'fractions (legacy module, skill-mapped)',
    dependsOn: [],
    productionConsiderations: [
      'The reference chapter. Its shape is the observed Middle Stage standard.',
    ],
    blockers: ['§7.4 educator review outstanding; §7.9 has three authoring gaps'],
    rationale: 'Already authored. Included so the roadmap covers all ten chapters.',
  },

  ncert_gp_c6_ch03_number_play: {
    domain: 'number_and_operations',
    visualSystem: 'ready',
    alignedLegacyMaterial: 'factors_multiples (partial overlap)',
    dependsOn: [],
    productionConsiderations: [
      'Closest in character to Fractions: number work with a natural number-line and grouping representation.',
      'The existing semantic visual components cover most of what it needs.',
      'Twelve sections — the largest chapter, so it produces the most reusable authoring evidence per unit of setup.',
    ],
    blockers: [],
    rationale:
      'The safest second chapter. It exercises the audited standard on content of the same kind, at a different chapter, which is exactly the evidence needed before claiming the standard generalises.',
  },

  ncert_gp_c6_ch05_prime_time: {
    domain: 'number_theory_and_reasoning',
    visualSystem: 'ready',
    alignedLegacyMaterial: 'factors_multiples (direct)',
    dependsOn: ['ncert_gp_c6_ch03_number_play'],
    productionConsiderations: [
      'Number theory: the reasoning IS the content, so reasoning tasks carry more weight than worked examples.',
      'Misconceptions here are strong and well documented (1 as prime; "prime" confused with "odd").',
      'Visuals are optional — factor trees and arrays help, but a written argument is not a poorer medium here.',
    ],
    blockers: [],
    rationale:
      'Strong legacy alignment and the clearest misconception evidence outside Fractions. Tests whether the standard bends correctly toward reasoning-led content.',
  },

  ncert_gp_c6_ch01_patterns: {
    domain: 'pattern_and_generalisation',
    visualSystem: 'requires_new_components',
    alignedLegacyMaterial: null,
    dependsOn: [],
    productionConsiderations: [
      'Sequences and figurate numbers need a growing-pattern representation Pragati does not have.',
      'The instructional goal is generalisation, so a worked example that simply computes the next term teaches the wrong thing.',
      'Interactive practice is genuinely valuable here — extending a pattern — and genuinely absent from the platform.',
    ],
    blockers: ['No growing-pattern visual component'],
    rationale:
      'Chapter 1 and pedagogically important, but it needs a representation that does not exist. Authoring it before that component would either produce weak content or a rushed component.',
  },

  ncert_gp_c6_ch10_other_side_of_zero: {
    domain: 'number_and_operations',
    visualSystem: 'ready',
    alignedLegacyMaterial: null,
    dependsOn: ['ncert_gp_c6_ch03_number_play'],
    productionConsiderations: [
      'Integers extend the number line, and the number-line component built for §7.4 is directly reusable — the single largest component reuse available in the chapter set.',
      'Documented misconceptions are strong (−5 judged larger than −2).',
    ],
    blockers: [],
    rationale:
      'Highest component reuse of any unauthored chapter. Depends on number sense established earlier, so it is ranked after Number Play rather than before it.',
  },

  ncert_gp_c6_ch06_perimeter_area: {
    domain: 'geometry_measurement',
    visualSystem: 'requires_new_components',
    alignedLegacyMaterial: 'geometry (weak overlap)',
    dependsOn: [],
    productionConsiderations: [
      'Needs labelled shape diagrams with dimensions — a real component, but a tractable one.',
      'Only three sections, so it is the cheapest way to prove the standard survives a move into geometry.',
      'Area and perimeter carry a classic conflation misconception worth documenting.',
    ],
    blockers: ['No dimensioned-shape visual component'],
    rationale:
      'The smallest geometry chapter. A deliberate low-cost probe of whether the Middle Stage standard holds outside number work.',
  },

  ncert_gp_c6_ch02_lines_angles: {
    domain: 'geometry_measurement',
    visualSystem: 'requires_new_components',
    alignedLegacyMaterial: 'geometry (weak overlap)',
    dependsOn: ['ncert_gp_c6_ch06_perimeter_area'],
    productionConsiderations: [
      'Eleven sections needing accurate angle diagrams, and angle measurement wants an interactive protractor to teach well.',
      'Static images would make this a reading chapter about a doing skill.',
    ],
    blockers: ['No angle-diagram component', 'No measurement interaction'],
    rationale:
      'Large and component-hungry. Ranked after the small geometry probe so the diagram component is proven on three sections before eleven depend on it.',
  },

  ncert_gp_c6_ch09_symmetry: {
    domain: 'geometry_transformation',
    visualSystem: 'requires_new_components',
    alignedLegacyMaterial: null,
    dependsOn: ['ncert_gp_c6_ch02_lines_angles'],
    productionConsiderations: [
      'Almost entirely visual. Text explanation is close to the wrong medium, which inverts the usual balance of the standard.',
      'Reflection and rotation want manipulation, not description.',
      'Only two sections, but the two with the highest visual dependency in the chapter set.',
    ],
    blockers: ['No reflection/rotation visual', 'No manipulation interaction'],
    rationale:
      'Small but the least suited to the current content shape. Authoring it early would produce prose about pictures.',
  },

  ncert_gp_c6_ch04_data_handling: {
    domain: 'data_and_representation',
    visualSystem: 'requires_new_components',
    alignedLegacyMaterial: 'c7_data_handling (Class 7 legacy, wrong grade)',
    dependsOn: [],
    productionConsiderations: [
      'Needs tables, pictographs and bar graphs as first-class content types. Pragati renders none of them.',
      'Practice means reading and constructing a representation, which the current item model does not express.',
      'Accessibility is unusually demanding: a chart with alt text alone is not an accessible chart.',
    ],
    blockers: ['No chart/table content type', 'Item model cannot express "construct a representation"'],
    rationale:
      'Blocked on content-type work, not authoring effort. The item model is the constraint, and it is a design question before it is an engineering one.',
  },

  ncert_gp_c6_ch08_constructions: {
    domain: 'geometry_construction',
    visualSystem: 'requires_new_interaction_model',
    alignedLegacyMaterial: null,
    dependsOn: ['ncert_gp_c6_ch02_lines_angles'],
    productionConsiderations: [
      'The chapter is about performing constructions with compass and straightedge. Correct practice is a construction, which Pragati cannot present, capture or mark.',
      'A multiple-choice question about a construction assesses recall of a procedure the student never performed — the §7.9 failure mode, at chapter scale.',
      'Step-by-step construction sequences are the minimum viable representation, and even those are new.',
    ],
    blockers: [
      'No construction interaction model',
      'No way to capture or mark a student construction',
      'Open pedagogical question: what does honest practice look like without a compass?',
    ],
    rationale:
      'Ranked last deliberately. Not because it is unimportant — it is a whole chapter of the official book — but because authoring it against the current item model would produce content that misrepresents the subject.',
  },
};

/**
 * The recommended order, and why.
 *
 * Ordering weighs: component reuse against what exists, concept
 * dependency, chapter size as evidence-per-setup, strength of aligned
 * legacy material, and — decisively — whether Pragati can currently
 * render what the chapter needs.
 */
const RECOMMENDED_ORDER = [
  'ncert_gp_c6_ch03_number_play',
  'ncert_gp_c6_ch10_other_side_of_zero',
  'ncert_gp_c6_ch05_prime_time',
  'ncert_gp_c6_ch06_perimeter_area',
  'ncert_gp_c6_ch01_patterns',
  'ncert_gp_c6_ch02_lines_angles',
  'ncert_gp_c6_ch09_symmetry',
  'ncert_gp_c6_ch04_data_handling',
  'ncert_gp_c6_ch08_constructions',
];

export function class6Roadmap(): ChapterRoadmapEntry[] {
  const c = officialCurriculumForGrade('class6');
  if (!c) return [];

  return c.units.map((unit) => {
    const meta = CHAPTERS[unit.officialUnitId];
    const sections = sectionsForChapter(unit.officialUnitId);
    const authored = sections.filter((s) =>
      authoredSectionById(s.officialSectionId)
    ).length;
    const idx = RECOMMENDED_ORDER.indexOf(unit.officialUnitId);

    return {
      rank: idx === -1 ? null : idx + 1,
      officialChapterId: unit.officialUnitId,
      chapterNumber: unit.number,
      title: unit.title,
      sections: sections.length,
      sectionsAuthored: authored,
      sectionsRemaining: sections.length - authored,
      ...meta,
    };
  });
}

/** The roadmap in recommended authoring order, excluding Chapter 7. */
export function class6AuthoringOrder(): ChapterRoadmapEntry[] {
  return class6Roadmap()
    .filter((r) => r.rank !== null)
    .sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0));
}

export type RoadmapSummary = {
  chapters: number;
  sectionsTotal: number;
  sectionsAuthored: number;
  sectionsRemaining: number;
  chaptersReadyToAuthor: number;
  chaptersBlockedOnComponents: number;
  nextChapter: string;
  headline: string;
};

export function class6RoadmapSummary(): RoadmapSummary {
  const all = class6Roadmap();
  const order = class6AuthoringOrder();
  const ready = order.filter((r) => r.blockers.length === 0);

  return {
    chapters: all.length,
    sectionsTotal: all.reduce((n, r) => n + r.sections, 0),
    sectionsAuthored: all.reduce((n, r) => n + r.sectionsAuthored, 0),
    sectionsRemaining: all.reduce((n, r) => n + r.sectionsRemaining, 0),
    chaptersReadyToAuthor: ready.length,
    chaptersBlockedOnComponents: order.length - ready.length,
    nextChapter: order[0]?.title ?? '—',
    headline:
      `${all.reduce((n, r) => n + r.sectionsRemaining, 0)} of ${all.reduce((n, r) => n + r.sections, 0)} ` +
      `Class 6 sections remain un-authored across ${order.length} chapters. ` +
      `${ready.length} chapters can be authored against the current visual system; ` +
      `${order.length - ready.length} need components or an interaction model Pragati does not have.`,
  };
}

/**
 * §25 — the guard.
 *
 * Every unauthored chapter must carry production considerations of its
 * own. A chapter that inherited Fractions' shape without comment would
 * pass silently; this returns it.
 */
export function assertChapterSpecificPedagogy(): string[] {
  const violations: string[] = [];
  for (const r of class6AuthoringOrder()) {
    if (r.productionConsiderations.length === 0) {
      violations.push(`${r.title}: no chapter-specific production considerations`);
    }
    if (!r.rationale || r.rationale.length < 40) {
      violations.push(`${r.title}: no ranking rationale`);
    }
  }
  return violations;
}
