// ===========================================================================
// v0.84.0-c10.3 checkpoint 57 — CLASS 10 SIMILARITY WAVE.
//
// The risk here is not drawing triangles. It is following the textbook one
// step too far.
//
// NCERT proves the AAA, SSS and SAS similarity criteria. The CBSE 2026-27
// curriculum asks only that they be stated. An author working from the book
// drifts into proving them, because the proof is sitting there and it is
// good mathematics. Units 6.4a and 6.4b therefore state the criteria, teach
// what evidence satisfies them, and do not prove them — while 6.3a, which
// genuinely carries a PROVE obligation, proves the Basic Proportionality
// Theorem in full.
//
// `auditProofScope` enforces that boundary in both directions.
//
// Source: NCERT Mathematics, Textbook for Class X (Reprint 2026-27), §6.2
// (folios 74-78), §6.3 (79-84) and §6.4 (85-96).
// ===========================================================================

import type { AuthoredSection } from './authoredSection';
import type { GeometryFigureSpec } from './visualSpecification';

export const SIMILARITY_CHAPTER_ID = 'ncert_jemh1_ch06';

const BOOK = 'Mathematics, Textbook for Class X (Reprint 2026-27)';
const SRC = 'https://ncert.nic.in/textbook/pdf/jemh1dd.zip';
const INSPECTED = '2026-10-16';

const source = (
  sectionNumber: string,
  exactTitle: string,
  startPage: number,
  officialSectionId: string
) => ({
  officialChapterId: SIMILARITY_CHAPTER_ID,
  officialSectionId,
  sectionNumber,
  exactTitle,
  startPage,
  textbook: BOOK,
  sourceReference: SRC,
  inspectionDate: INSPECTED,
});

// --- figures ---------------------------------------------------------------

/** Equal angles, sides not proportional: a square and a non-square rectangle. */
const F_ANGLES_ONLY: GeometryFigureSpec = {
  type: 'geometry_figure',
  purpose: 'show_counterexample',
  status: 'concept_specific',
  exactGeometry: true,
  points: [
    { id: 'p', x: 0, y: 0, label: 'P' }, { id: 'q', x: 3, y: 0, label: 'Q' },
    { id: 'r', x: 3, y: 3, label: 'R' }, { id: 's', x: 0, y: 3, label: 'S' },
    { id: 'w', x: 6, y: 0, label: 'W' }, { id: 'x', x: 12, y: 0, label: 'X' },
    { id: 'y', x: 12, y: 3, label: 'Y' }, { id: 'z', x: 6, y: 3, label: 'Z' },
  ],
  segments: [
    { from: 'p', to: 'q', label: '3' }, { from: 'q', to: 'r', label: '3' },
    { from: 'r', to: 's' }, { from: 's', to: 'p' },
    { from: 'w', to: 'x', label: '6' }, { from: 'x', to: 'y', label: '3' },
    { from: 'y', to: 'z' }, { from: 'z', to: 'w' },
  ],
  angleMarks: [
    { at: 'p', from: 'q', to: 's', right: true },
    { at: 'w', from: 'x', to: 'z', right: true },
  ],
  caption: 'A square and a rectangle: every angle matches, the sides do not.',
  altText:
    'A square PQRS with all sides 3 units beside a rectangle WXYZ measuring 6 units by 3 units. Every angle in both figures is a right angle, so all four pairs of corresponding angles are equal. But one pair of corresponding sides is in the ratio 3 to 6 while another is in the ratio 3 to 3, so the sides are not proportional and the figures are not similar.',
};

/** Sides proportional, angles not equal: a square and a rhombus. */
const F_SIDES_ONLY: GeometryFigureSpec = {
  type: 'geometry_figure',
  purpose: 'show_counterexample',
  status: 'concept_specific',
  exactGeometry: true,
  points: [
    { id: 'a', x: 0, y: 0, label: 'A' }, { id: 'b', x: 3, y: 0, label: 'B' },
    { id: 'c', x: 3, y: 3, label: 'C' }, { id: 'd', x: 0, y: 3, label: 'D' },
    { id: 'e', x: 6, y: 0, label: 'E' }, { id: 'f', x: 9, y: 0, label: 'F' },
    { id: 'g', x: 10.8, y: 2.4, label: 'G' }, { id: 'h', x: 7.8, y: 2.4, label: 'H' },
  ],
  segments: [
    { from: 'a', to: 'b', mark: 'single_tick' }, { from: 'b', to: 'c', mark: 'single_tick' },
    { from: 'c', to: 'd', mark: 'single_tick' }, { from: 'd', to: 'a', mark: 'single_tick' },
    { from: 'e', to: 'f', mark: 'double_tick' }, { from: 'f', to: 'g', mark: 'double_tick' },
    { from: 'g', to: 'h', mark: 'double_tick' }, { from: 'h', to: 'e', mark: 'double_tick' },
  ],
  angleMarks: [{ at: 'a', from: 'b', to: 'd', right: true }],
  caption: 'A square and a rhombus: all four sides in the same ratio, angles different.',
  altText:
    'A square ABCD of side 3 units beside a rhombus EFGH whose four sides are also all equal to 3 units. Every pair of corresponding sides is therefore in the ratio 1 to 1, so the sides are proportional. The square has four right angles while the rhombus is slanted, so its angles are not right angles and the corresponding angles are not equal. The figures are not similar.',
};

/** The Basic Proportionality Theorem, with the area construction. */
const F_BPT: GeometryFigureSpec = {
  type: 'geometry_figure',
  purpose: 'support_proof',
  status: 'concept_specific',
  exactGeometry: true,
  points: [
    { id: 'a', x: 2, y: 4, label: 'A' },
    { id: 'b', x: 0, y: 0, label: 'B' },
    { id: 'c', x: 6, y: 0, label: 'C' },
    { id: 'd', x: 1, y: 2, label: 'D' },
    { id: 'e', x: 4, y: 2, label: 'E' },
  ],
  segments: [
    { from: 'a', to: 'b' }, { from: 'a', to: 'c' }, { from: 'b', to: 'c' },
    { from: 'd', to: 'e', mark: 'arrow' },
    // The two joins the area argument needs.
    { from: 'b', to: 'e', mark: 'dashed' },
    { from: 'c', to: 'd', mark: 'dashed' },
  ],
  parallelGroups: [{ segments: [{ from: 'd', to: 'e' }, { from: 'b', to: 'c' }], label: 'DE \u2225 BC' }],
  caption: 'DE drawn parallel to BC, with BE and CD joined for the area argument.',
  altText:
    'Triangle ABC with vertex A at the top. D lies on AB and E lies on AC, and the segment DE is drawn parallel to BC, marked with arrows on both segments. Two further segments, BE and CD, are drawn as dashed lines inside the triangle. These create triangles BDE and CDE, which share the base DE and lie between the same two parallel lines DE and BC.',
};

/** Two triangles agreeing in two angles. */
const F_AA: GeometryFigureSpec = {
  type: 'geometry_figure',
  purpose: 'show_definition',
  status: 'concept_specific',
  exactGeometry: true,
  points: [
    { id: 'a', x: 0, y: 0, label: 'A' }, { id: 'b', x: 4, y: 0, label: 'B' }, { id: 'c', x: 1, y: 2.5, label: 'C' },
    { id: 'p', x: 7, y: 0, label: 'P' }, { id: 'q', x: 13, y: 0, label: 'Q' }, { id: 'r', x: 8.5, y: 3.75, label: 'R' },
  ],
  segments: [
    { from: 'a', to: 'b' }, { from: 'b', to: 'c' }, { from: 'c', to: 'a' },
    { from: 'p', to: 'q' }, { from: 'q', to: 'r' }, { from: 'r', to: 'p' },
  ],
  angleMarks: [
    { at: 'a', from: 'b', to: 'c', equalTag: 'alpha' },
    { at: 'p', from: 'q', to: 'r', equalTag: 'alpha' },
    { at: 'b', from: 'a', to: 'c', equalTag: 'beta' },
    { at: 'q', from: 'p', to: 'r', equalTag: 'beta' },
  ],
  caption: 'Two triangles agreeing in two angles, with the correspondence marked.',
  altText:
    'Triangle ABC beside a larger triangle PQR. The angle at A carries the same mark as the angle at P, and the angle at B carries the same mark as the angle at Q, so those two pairs of corresponding angles are equal. PQR is one and a half times the size of ABC in every length, which is what similarity without congruence looks like.',
};

/** The SAS trap: two sides proportional but the equal angle is not included. */
const F_SAS_TRAP: GeometryFigureSpec = {
  type: 'geometry_figure',
  purpose: 'show_counterexample',
  status: 'concept_specific',
  exactGeometry: true,
  points: [
    { id: 'a', x: 0, y: 0, label: 'A' }, { id: 'b', x: 4, y: 0, label: 'B' }, { id: 'c', x: 1, y: 3, label: 'C' },
    { id: 'p', x: 7, y: 0, label: 'P' }, { id: 'q', x: 15, y: 0, label: 'Q' }, { id: 'r', x: 9, y: 6, label: 'R' },
  ],
  segments: [
    { from: 'a', to: 'b', label: 'AB = 4' }, { from: 'b', to: 'c' }, { from: 'c', to: 'a', label: 'AC' },
    { from: 'p', to: 'q', label: 'PQ = 8' }, { from: 'q', to: 'r' }, { from: 'r', to: 'p', label: 'PR' },
  ],
  angleMarks: [
    { at: 'b', from: 'a', to: 'c', equalTag: 'gamma' },
    { at: 'q', from: 'p', to: 'r', equalTag: 'gamma' },
  ],
  caption: 'Two sides in proportion, but the equal angle sits elsewhere.',
  altText:
    'Triangle ABC and triangle PQR. The sides AB and PQ are in the ratio 4 to 8, and AC and PR are given in the same ratio. The angles carrying the equal marks are at B and at Q, which are not the angles enclosed by those two pairs of sides. The equal angle is therefore not the included angle, so this evidence does not satisfy the SAS criterion.',
};

export const C10_SECTION_6_2A: AuthoredSection = {
  contentArtifactId: 'ncert_jemh1_s6_2_similar_figures_lesson',
  contentArtifactVersion: 1,
  source: source('6.2', 'Similar Figures', 74, 'ncert_jemh1_s6_2'),
  competencyCandidates: [],
  competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: [],
    mayAssume: ['Congruence of triangles from Class IX', 'Ratio and proportion', 'Angle properties of squares and rectangles'],
    mustNotIntroduce: [
      { concept: 'Criteria for similarity of triangles', belongsToSection: 'ncert_jemh1_s6_4' },
      { concept: 'The Basic Proportionality Theorem', belongsToSection: 'ncert_jemh1_s6_3' },
    ],
  },
  learningGoal:
    'You will explain why two figures are similar only when their corresponding angles are equal AND their corresponding sides are proportional, using cases where just one of the two holds.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: [
      'Say what it means for two triangles to be congruent.',
      'Write the ratio of two lengths and simplify it.',
      'Identify corresponding vertices when two figures are matched up.',
    ],
    ifNotReady: 'Revise congruence from Class IX. Similarity keeps one half of it and relaxes the other.',
  },
  vocabulary: [
    { term: 'similar figures', meaning: 'Figures with the same shape: corresponding angles equal and corresponding sides proportional.' },
    { term: 'corresponding angles', meaning: 'Angles that occupy matching positions under a stated matching of vertices.' },
    { term: 'corresponding sides', meaning: 'Sides joining matching pairs of vertices under that same matching.' },
    { term: 'proportional', meaning: 'In a constant ratio: every pair of corresponding sides gives the same quotient.' },
    { term: 'scale factor', meaning: 'That constant ratio, the number every length is multiplied by to pass from one figure to the other.' },
  ],
  explanation: [
    'Congruent figures are the same shape and the same size. Similar figures keep the shape and let go of the size \u2014 a photograph and its enlargement, a map and the land it represents.',
    'Letting go of size needs care, because "same shape" has to be made precise. Two conditions are involved, and the lesson rests on seeing that neither one alone is enough.',
    'Take a square of side 3 and a rectangle 6 by 3. Every angle in both is a right angle, so all four pairs of corresponding angles are equal. But one pair of corresponding sides is in the ratio 3 : 6 and another is in the ratio 3 : 3. Those ratios differ, so the sides are not proportional \u2014 and nobody would call a long rectangle the same shape as a square.',
    'Now the other way round. A square of side 3 and a rhombus of side 3 have every pair of corresponding sides in the ratio 1 : 1, so the sides are proportional. But the rhombus leans: its angles are not right angles, so corresponding angles are not equal. Again the shapes differ.',
    'So similarity requires both: corresponding angles equal and corresponding sides proportional. When both hold, the constant ratio of the sides is the scale factor. A scale factor of 1 gives congruence, which is why congruence is the special case of similarity where no resizing happens.',
    'One more thing the notation carries. Writing that two figures are similar is also a claim about which vertex matches which, and the order of the letters states it. Change the order and you change the claim, which is why a correct answer can be marked wrong for being written in the wrong order.',
    'Triangles will turn out to be special. For most polygons both conditions have to be checked separately, but for triangles a smaller amount of evidence is enough \u2014 that is what §6.4 is about, and it is not assumed here.',
  ],
  representations: ['Two pairs of figures, each satisfying only one of the two conditions'],
  visuals: [F_ANGLES_ONLY, F_SIDES_ONLY],
  visualsById: { F_ANGLES_ONLY, F_SIDES_ONLY },
  workedExamples: [
    {
      id: 's62a.we1',
      prompt: 'Are a square of side 3 cm and a rectangle 6 cm by 3 cm similar? Give the reason in terms of both conditions.',
      steps: [
        { text: 'Check the angles: all eight are right angles, so corresponding angles are equal.', reasoning: 'Both figures are rectangles in the wider sense, so the angle condition is satisfied and cannot be what fails.' },
        { text: 'Check the sides: one pair is in the ratio 3 : 6 = 1 : 2, another is in the ratio 3 : 3 = 1 : 1.', reasoning: 'Proportionality means ONE ratio throughout, so two different ratios settle the question.' },
        { text: 'Since 1 : 2 and 1 : 1 are different, the sides are not proportional.', reasoning: 'There is no single scale factor that turns the square into the rectangle.' },
        { text: 'They are not similar, because only the angle condition holds.', reasoning: 'Similarity needs both conditions; satisfying one is not partial similarity but simply not similarity.' },
      ],
      answer: 'Not similar \u2014 angles equal but sides not proportional.',
      visualRef: 'F_ANGLES_ONLY',
    },
    {
      id: 's62a.we2',
      prompt: 'Are a square of side 3 cm and a rhombus of side 3 cm similar?',
      steps: [
        { text: 'Check the sides: every side of each figure is 3 cm, so each pair is in the ratio 1 : 1.', reasoning: 'One constant ratio throughout, so the side condition is satisfied.' },
        { text: 'Check the angles: the square has four right angles, the rhombus does not.', reasoning: 'A rhombus has equal sides but its angles are free to lean, which is precisely what distinguishes it from a square.' },
        { text: 'Corresponding angles are therefore not equal, and the figures are not similar.', reasoning: 'This is the mirror image of the previous example, and together the two show that neither condition implies the other.' },
      ],
      answer: 'Not similar \u2014 sides proportional but angles unequal.',
      visualRef: 'F_SIDES_ONLY',
    },
    {
      id: 's62a.we3',
      prompt: 'Two quadrilaterals have corresponding angles equal and corresponding sides in the ratio 2 : 5 throughout. Are they similar, and what is the scale factor?',
      steps: [
        { text: 'The angle condition is given as satisfied.', reasoning: 'The problem states corresponding angles are equal, so that half is settled.' },
        { text: 'Every pair of corresponding sides gives the same ratio 2 : 5, so the sides are proportional.', reasoning: 'The word "throughout" is what matters: a single ratio for every pair is the definition of proportional.' },
        { text: 'Both conditions hold, so the figures are similar with scale factor 5/2 from the first to the second.', reasoning: 'The scale factor is the constant ratio, read in the direction stated; from the second to the first it is 2/5.' },
      ],
      answer: 'Similar, with scale factor 5/2 from the smaller to the larger.',
    },
  ],
  guidedPractice: [
    {
      id: 's62a.g1',
      prompt: 'Are all circles similar? Are all squares similar? Are all rectangles similar?',
      hint: 'Check both conditions for each family.',
      answer: 'All circles are similar, all squares are similar, but rectangles are not all similar.',
      rationale: 'Circles have one shape determined by nothing but radius, and squares have all right angles with all sides equal, so both conditions hold within each family. Rectangles share the angles but their side ratios vary, so a 2 by 1 and a 3 by 1 are not similar.',
    },
    {
      id: 's62a.g2',
      prompt: 'Two figures are similar with scale factor 1. What else can you say about them?',
      hint: 'What does a scale factor of 1 do to each length?',
      answer: 'They are congruent.',
      rationale: 'A scale factor of 1 leaves every length unchanged, and the angles were already equal, so the figures match in both shape and size.',
    },
    {
      id: 's62a.g3',
      prompt: 'A student says two figures must be similar because they look alike. What is wrong with that as a reason?',
      hint: 'What exactly has been checked?',
      answer: 'Looking alike is not either of the two conditions; neither the angles nor the side ratios have been checked.',
      rationale: 'A square and a rhombus with a small lean look very alike, and are not similar. Appearance is a reason to suspect similarity, never a reason to assert it.',
    },
  ],
  independentPractice: [
    {
      id: 's62a.i1',
      prompt: 'Two rectangles measure 4 by 6 and 10 by 15. Are they similar? Show the ratios.',
      answer: 'Yes \u2014 4 : 10 and 6 : 15 both simplify to 2 : 5, and all angles are right angles.',
      rationale: 'Both conditions hold, with scale factor 5/2 from the smaller to the larger.',
    },
    {
      id: 's62a.i2',
      prompt: 'Give an example of two figures with all sides proportional that are not similar, other than the square and rhombus.',
      answer: 'A rectangle and a parallelogram with the same side lengths.',
      rationale: 'The side ratios are all 1 : 1 but the parallelogram leans, so corresponding angles differ. Any pair of equal-sided figures with different angles will do.',
    },
    {
      id: 's62a.i3',
      prompt: 'Two similar figures have scale factor 3. If a side of the smaller is 7 cm, how long is the corresponding side of the larger, and what happens to the perimeter?',
      answer: '21 cm, and the perimeter is also three times as long.',
      rationale: 'Every length multiplies by the scale factor, and a perimeter is a sum of lengths, so it multiplies by 3 as well.',
    },
    {
      id: 's62a.i4',
      prompt: 'Explain why congruence is a special case of similarity rather than a different idea.',
      answer: 'Because congruence is similarity with scale factor 1.',
      rationale: 'Congruent figures satisfy both similarity conditions, with the side ratio equal to 1. Every congruent pair is similar; not every similar pair is congruent.',
    },
  ],
  misconceptionIds: [],
  interactivePractice: [],
  reasoningApplication: [
    {
      id: 's62a.td1',
      prompt: 'Can two figures be similar without being congruent? Can they be congruent without being similar? Answer both, with a reason.',
      expectedReasoning:
        'Yes to the first: any enlargement, such as a 3 by 4 rectangle and a 6 by 8 one, is similar with scale factor 2 and not congruent. No to the second: congruence gives equal corresponding angles and corresponding sides in the ratio 1 : 1, which is exactly the similarity conditions with scale factor 1. So congruence is contained in similarity rather than being separate from it.',
    },
    {
      id: 's62a.td2',
      prompt: 'Why is it not enough to check only the angles when comparing two four-sided figures? Would your answer change if the figures were triangles?',
      expectedReasoning:
        'For quadrilaterals the square-and-rectangle case settles it: equal angles throughout, yet plainly different shapes, because the side ratios differ. For triangles the situation turns out to be different, and §6.4 takes that up. Nothing in this lesson establishes it, so the honest answer here is that triangles are worth asking about separately rather than that the rule changes.',
    },
  ],
  summary:
    'Two figures are similar when corresponding angles are equal and corresponding sides are proportional. Neither condition implies the other: a square and a rectangle satisfy the first and fail the second, a square and a rhombus the reverse. The constant side ratio is the scale factor, and a scale factor of 1 is congruence.',
  nextStep: 'Next you will prove a theorem about a line drawn parallel to one side of a triangle.',
  teacher: {
    objective: 'Students justify that similarity needs both conditions, using cases where exactly one holds.',
    prerequisiteKnowledge: ['Congruence from Class IX', 'Ratio and proportion'],
    modelLanguage: [
      'Which of the two conditions have you actually checked?',
      'Proportional means ONE ratio, the same for every pair.',
      'Looking alike is a suspicion, not a reason.',
    ],
    teachingNotes: [
      'The two counterexamples should be met as a pair. Students who see only the square-and-rectangle case conclude that sides are what matter and angles are automatic, which the rhombus case immediately contradicts.',
      'Keep the triangle criteria out of this lesson entirely. Students who learn AA here stop checking anything and start pattern-matching.',
      'Watch for "proportional" being read as "equal"; the ratio 1 : 1 is a special case, not the meaning.',
    ],
    quickChecks: [
      'Ask whether all rectangles are similar, and why circles are.',
      'Ask what a scale factor of 1 means.',
    ],
    supportForStrugglingLearners: [
      'Have the student write the two conditions as a checklist and tick them separately for each pair of figures.',
    ],
    extension: ['Ask what happens to the perimeter and whether the same multiplier applies to area \u2014 and leave the area question open.'],
    materialsNeeded: ['Squared paper'],
  },
  reviewStatus: 'authored_draft',
};

export const C10_SECTION_6_3A: AuthoredSection = {
  contentArtifactId: 'ncert_jemh1_s6_3_bpt_proof_lesson',
  contentArtifactVersion: 1,
  source: source('6.3', 'Similarity of Triangles', 79, 'ncert_jemh1_s6_3'),
  competencyCandidates: [],
  competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_jemh1_s6_2'],
    mayAssume: ['Area of a triangle as half base times height', 'Triangles on the same base between the same parallels have equal areas', 'Ratio and proportion'],
    mustNotIntroduce: [{ concept: 'Criteria for similarity of triangles', belongsToSection: 'ncert_jemh1_s6_4' }],
  },
  learningGoal:
    'You will prove the Basic Proportionality Theorem: a line drawn parallel to one side of a triangle divides the other two sides in the same ratio.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: [
      'Write the area of a triangle as half the base times the height.',
      'State why two triangles on the same base and between the same parallels have equal areas.',
      'Simplify a ratio of two areas.',
    ],
    ifNotReady: 'Revise areas of triangles from Class IX. The proof is built almost entirely from the equal-areas result.',
  },
  vocabulary: [
    { term: 'Basic Proportionality Theorem', meaning: 'The result that a line parallel to one side of a triangle divides the other two sides in the same ratio.' },
    { term: 'between the same parallels', meaning: 'Lying in the strip bounded by two parallel lines, so that any triangles on a common base in that strip have the same height.' },
    { term: 'divides in the same ratio', meaning: 'The two pieces of one side stand in the same ratio as the two pieces of the other.' },
  ],
  explanation: [
    'Draw any triangle ABC and a line across it parallel to BC, meeting AB at D and AC at E. The claim to be proved is that AD/DB = AE/EC \u2014 the parallel line cuts both sides in the same ratio, whatever triangle you started from and wherever the line sits.',
    'This cannot be settled by drawing and measuring. A measurement of one case leaves every other case open, and measurement carries error, so agreement to one decimal place is no evidence of exact equality. A proof is needed.',
    'The idea is to turn a statement about lengths into a statement about areas, where there is already a result to lean on: triangles on the same base and between the same parallels have equal areas.',
    'Join BE and CD, so that two new triangles BDE and CDE appear inside the figure. Drop EN perpendicular to AB and DM perpendicular to AC. These are the heights the area formula needs.',
    'Triangles ADE and BDE sit on the bases AD and DB of the same line AB, and both have the same height EN from E. So the ratio of their areas is the ratio of those bases: ar(ADE)/ar(BDE) = AD/DB. The heights cancel because they are identical.',
    'The same argument on the other side, using DM as the common height, gives ar(ADE)/ar(DEC) = AE/EC.',
    'Now the parallel does its work. Triangles BDE and CDE stand on the same base DE, and their third vertices B and C both lie on BC, which is parallel to DE. They are between the same parallels, so they have equal areas: ar(BDE) = ar(DEC).',
    'The two ratios therefore have equal denominators as well as a common numerator, so AD/DB = AE/EC. The theorem is proved, for every triangle and every parallel line, not for the one that was drawn.',
    'Notice where the hypothesis entered. Only the last step used the fact that DE is parallel to BC. Without it, B and C would not be the same distance from the line DE, the two areas would differ, and the conclusion would fail.',
  ],
  representations: ['Triangle ABC with DE parallel to BC and the two joins the area argument needs'],
  visuals: [F_BPT],
  visualsById: { F_BPT },
  workedExamples: [
    {
      id: 's63a.we1',
      prompt: 'Prove that a line parallel to one side of a triangle divides the other two sides in the same ratio.',
      steps: [
        { text: 'In triangle ABC let DE be parallel to BC, with D on AB and E on AC. Join BE and CD, and draw EN perpendicular to AB and DM perpendicular to AC.', reasoning: 'The joins create the triangles whose areas will be compared, and the perpendiculars are the heights the area formula requires.' },
        { text: 'ar(ADE) = \u00bd \u00d7 AD \u00d7 EN and ar(BDE) = \u00bd \u00d7 DB \u00d7 EN.', reasoning: 'Both triangles have their bases on the line AB and share the vertex E, so the perpendicular EN is the height of each.' },
        { text: 'Dividing, ar(ADE)/ar(BDE) = AD/DB.', reasoning: 'The factor of a half and the common height EN cancel, leaving only the ratio of the bases.' },
        { text: 'Similarly ar(ADE) = \u00bd \u00d7 AE \u00d7 DM and ar(DEC) = \u00bd \u00d7 EC \u00d7 DM, so ar(ADE)/ar(DEC) = AE/EC.', reasoning: 'The same argument on side AC, with DM as the shared height.' },
        { text: 'Triangles BDE and DEC stand on the same base DE and lie between the parallels DE and BC, so ar(BDE) = ar(DEC).', reasoning: 'This is the one step that uses the hypothesis: being between the same parallels makes their heights from DE equal.' },
        { text: 'Hence AD/DB and AE/EC are two fractions with the same numerator ar(ADE) and equal denominators, so AD/DB = AE/EC.', reasoning: 'Equal denominators and a common numerator force the two quotients to agree, which is the statement to be proved.' },
      ],
      answer: 'AD/DB = AE/EC, for every such triangle and every such parallel line.',
      visualRef: 'F_BPT',
    },
    {
      id: 's63a.we2',
      prompt: 'In triangle ABC, DE is parallel to BC with AD = 3 cm, DB = 4.5 cm and AE = 4 cm. Find EC.',
      steps: [
        { text: 'By the theorem, AD/DB = AE/EC.', reasoning: 'The hypothesis DE parallel to BC is given, so the theorem applies directly.' },
        { text: 'Substituting, 3/4.5 = 4/EC.', reasoning: 'Putting the three known lengths into the proportion leaves one unknown.' },
        { text: 'Cross-multiplying, 3 \u00d7 EC = 4 \u00d7 4.5 = 18, so EC = 6 cm.', reasoning: 'A single multiplication and division; the ratio 3 : 4.5 is 2 : 3, and 4 : 6 is also 2 : 3, which confirms the answer.' },
      ],
      answer: 'EC = 6 cm.',
    },
    {
      id: 's63a.we3',
      prompt: 'Why does the proof fail if DE is not parallel to BC? Identify the exact step.',
      steps: [
        { text: 'The first two ratio results do not use the parallel at all.', reasoning: 'They follow from the area formula and shared heights, which hold wherever D and E are placed on the two sides.' },
        { text: 'The step ar(BDE) = ar(DEC) is the one that uses it.', reasoning: 'That equality comes from the two triangles lying between the same parallels, which is exactly the hypothesis.' },
        { text: 'Without the parallel, B and C are at different distances from the line DE, so the two areas differ.', reasoning: 'Different heights on the same base DE give different areas.' },
        { text: 'The two fractions then have unequal denominators and the conclusion does not follow.', reasoning: 'This shows the hypothesis is not decoration: remove it and the argument genuinely breaks at a nameable point.' },
      ],
      answer: 'It fails at ar(BDE) = ar(DEC), the only step that uses the parallel.',
      visualRef: 'F_BPT',
    },
  ],
  guidedPractice: [
    {
      id: 's63a.g1',
      prompt: 'In triangle PQR, ST is parallel to QR with PS = 2 cm, SQ = 5 cm and PT = 3 cm. Find TR.',
      hint: 'Write the proportion before substituting anything.',
      answer: 'TR = 7.5 cm.',
      rationale: 'PS/SQ = PT/TR gives 2/5 = 3/TR, so 2 \u00d7 TR = 15 and TR = 7.5 cm.',
    },
    {
      id: 's63a.g2',
      prompt: 'Which earlier result does the proof depend on most heavily, and at which step?',
      hint: 'Which step would you be unable to take without it?',
      answer: 'That triangles on the same base between the same parallels have equal areas, used to get ar(BDE) = ar(DEC).',
      rationale: 'The other steps need only the area formula. That one result is what converts the parallel hypothesis into an equality of areas.',
    },
    {
      id: 's63a.g3',
      prompt: 'A student measures one triangle carefully and finds AD/DB and AE/EC agree to two decimal places. Have they proved the theorem?',
      hint: 'How many triangles does the theorem speak about?',
      answer: 'No \u2014 one measured case is not a proof, and measurement cannot establish exact equality.',
      rationale: 'The theorem asserts something about every triangle and every parallel line. A single case leaves the rest open, and measurement error means close agreement is not exact agreement.',
    },
  ],
  independentPractice: [
    {
      id: 's63a.i1',
      prompt: 'In triangle ABC, DE is parallel to BC with AD = 4 cm, AE = 6 cm and EC = 9 cm. Find DB.',
      answer: 'DB = 6 cm.',
      rationale: 'AD/DB = AE/EC gives 4/DB = 6/9 = 2/3, so 2 \u00d7 DB = 12 and DB = 6 cm.',
    },
    {
      id: 's63a.i2',
      prompt: 'In triangle ABC, D is the midpoint of AB and DE is parallel to BC with E on AC. What can you say about E?',
      answer: 'E is the midpoint of AC.',
      rationale: 'AD/DB = 1 because D is the midpoint, so AE/EC = 1 as well, which makes AE = EC.',
    },
    {
      id: 's63a.i3',
      prompt: 'State the two heights used in the proof and say which triangles each one serves.',
      answer: 'EN serves triangles ADE and BDE; DM serves triangles ADE and DEC.',
      rationale: 'Each perpendicular is the common height for the pair of triangles whose bases lie on the same side of the triangle.',
    },
    {
      id: 's63a.i4',
      prompt: 'In triangle ABC, DE is parallel to BC with AD = 2x, DB = x + 3, AE = 2x + 1 and EC = x + 4. Form the equation and solve for x.',
      answer: 'x = 3.',
      rationale: '2x/(x + 3) = (2x + 1)/(x + 4) gives 2x(x + 4) = (2x + 1)(x + 3), so 2x\u00b2 + 8x = 2x\u00b2 + 7x + 3, hence x = 3.',
    },
  ],
  misconceptionIds: [],
  interactivePractice: [],
  reasoningApplication: [
    {
      id: 's63a.td1',
      prompt: 'The proof converts a statement about lengths into one about areas. Why is that a useful move, given that the conclusion is about lengths again?',
      expectedReasoning:
        'Lengths along two different sides of a triangle have no direct relationship to compare. Areas do: two triangles sharing a height have areas in the ratio of their bases, which converts each side\u2019s division into an area ratio, and the equal-areas result then links the two sides through the parallel. Areas act as the common currency. The conclusion returns to lengths because the heights cancel, leaving nothing but the ratios we started from.',
    },
    {
      id: 's63a.td2',
      prompt: 'Could the theorem be proved by drawing many triangles and checking the ratios each time? Say what such a procedure could and could not establish.',
      expectedReasoning:
        'It could build confidence that the statement is worth proving, and it could refute it outright if a single clear case failed. It could not establish it, for two reasons: infinitely many triangles exist and any finite collection leaves the rest untested, and measured lengths carry error so apparent agreement is never exact agreement. The proof settles every case at once, exactly, which is what the theorem claims.',
    },
  ],
  summary:
    'If a line is drawn parallel to one side of a triangle, it divides the other two sides in the same ratio. The proof compares areas: triangles sharing a height have areas in the ratio of their bases, giving ar(ADE)/ar(BDE) = AD/DB and ar(ADE)/ar(DEC) = AE/EC, while the parallel makes ar(BDE) = ar(DEC). Equal denominators force AD/DB = AE/EC.',
  nextStep: 'Next you will use this theorem and its converse to find unknown lengths and to test whether two lines are parallel.',
  teacher: {
    objective: 'Students reproduce the area-based proof of the Basic Proportionality Theorem and identify where the hypothesis is used.',
    prerequisiteKnowledge: ['Area of a triangle', 'Equal areas between the same parallels'],
    modelLanguage: [
      'Which step uses the fact that DE is parallel?',
      'The heights cancel \u2014 that is why the ratio is just the bases.',
      'One measured triangle is not a proof.',
    ],
    teachingNotes: [
      'The third worked example, asking where the proof fails without the parallel, is worth as much as the proof itself. A hypothesis a student cannot locate in the argument is a hypothesis they will drop when applying it.',
      'The move from lengths to areas and back is the mathematical idea here. Students who copy the steps without it cannot reconstruct the proof a week later.',
      'Watch for the two perpendiculars being treated as the same height; they serve different pairs.',
    ],
    quickChecks: [
      'Ask which single step uses the parallel.',
      'Ask what EN and DM are each for.',
    ],
    supportForStrugglingLearners: [
      'Build the figure in stages \u2014 triangle, then DE, then the two joins, then the perpendiculars \u2014 naming what each addition is for.',
    ],
    extension: ['Ask what the theorem gives when D is the midpoint of AB, and which Class IX result that recovers.'],
    materialsNeeded: ['Ruler', 'Set square'],
  },
  reviewStatus: 'authored_draft',
};

export const C10_SECTION_6_3B: AuthoredSection = {
  contentArtifactId: 'ncert_jemh1_s6_3_bpt_apply_lesson',
  contentArtifactVersion: 1,
  source: source('6.3', 'Similarity of Triangles', 79, 'ncert_jemh1_s6_3'),
  competencyCandidates: [],
  competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_jemh1_s6_3'],
    mayAssume: ['The Basic Proportionality Theorem', 'Ratio and proportion', 'Solving a linear equation'],
    mustNotIntroduce: [{ concept: 'Criteria for similarity of triangles', belongsToSection: 'ncert_jemh1_s6_4' }],
  },
  learningGoal:
    'You will apply the Basic Proportionality Theorem and its converse to find unknown lengths and to decide whether two lines in a figure are parallel.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: ['State the Basic Proportionality Theorem.', 'Solve a proportion for an unknown.', 'Say which ratio belongs to which side.'],
    ifNotReady: 'Go back to the proof lesson. Applying the theorem means knowing exactly what it assumes and what it gives.',
  },
  vocabulary: [
    { term: 'converse', meaning: 'The statement obtained by exchanging the hypothesis and the conclusion. Here: if the two sides are divided in the same ratio, the line is parallel to the third side.' },
    { term: 'hypothesis', meaning: 'The condition a theorem assumes before it concludes anything.' },
  ],
  explanation: [
    'The theorem says that IF a line is parallel to one side of a triangle, THEN it divides the other two sides in the same ratio. Read in that direction it computes lengths: given the parallel, a missing length follows from a proportion.',
    'Reading it the other way round is a different statement. The converse says that IF a line divides two sides of a triangle in the same ratio, THEN it is parallel to the third side. That is what lets a ratio calculation settle a question about direction, which no amount of looking at a figure can do.',
    'A converse is not automatically true, and the two have to be kept apart. Using the theorem when the parallel is not given, or asserting parallelism from the theorem rather than from its converse, are the two ways this goes wrong.',
    'In practice the direction of use is decided by what the problem gives you. If it states a line is parallel, use the theorem and compute. If it gives you four lengths and asks whether the line is parallel, compute both ratios and use the converse.',
    'One point of care when substituting: AD/DB compares the two PIECES of one side, not a piece with the whole side. Writing AD/AB instead is the most common slip, and it produces an answer that looks reasonable.',
    'Both readings need the two points to lie on the two sides of the triangle. A line crossing an extension of a side is outside what this theorem speaks about.',
  ],
  representations: ['A triangle with a line across two sides and the four pieces labelled'],
  visuals: [F_BPT],
  visualsById: { F_BPT },
  workedExamples: [
    {
      id: 's63b.we1',
      prompt: 'In triangle ABC, DE is parallel to BC with AD = 6 cm, DB = 9 cm and AE = 8 cm. Find AC.',
      steps: [
        { text: 'The theorem gives AD/DB = AE/EC.', reasoning: 'The parallel is stated, so the theorem applies in its computing direction.' },
        { text: '6/9 = 8/EC, so 6 \u00d7 EC = 72 and EC = 12 cm.', reasoning: 'Cross-multiplying leaves a single unknown; 6 : 9 simplifies to 2 : 3, and 8 : 12 is also 2 : 3.' },
        { text: 'AC = AE + EC = 8 + 12 = 20 cm.', reasoning: 'The question asked for the whole side, not the piece, so the two pieces must be added at the end.' },
      ],
      answer: 'AC = 20 cm.',
      visualRef: 'F_BPT',
    },    {
      id: 's63b.we2',
      prompt: 'In triangle PQR, S lies on PQ and T on PR with PS = 4 cm, SQ = 6 cm, PT = 6 cm and TR = 9 cm. Is ST parallel to QR?',
      steps: [
        { text: 'Nothing says ST is parallel, so the theorem cannot be used; the converse is the relevant statement.', reasoning: 'The question asks about direction, which is the converse\'s conclusion rather than its hypothesis.' },
        { text: 'PS/SQ = 4/6 = 2/3.', reasoning: 'The first ratio, taken between the two pieces of PQ.' },
        { text: 'PT/TR = 6/9 = 2/3.', reasoning: 'The second ratio, between the two pieces of PR.' },
        { text: 'The two ratios are equal, so by the converse ST is parallel to QR.', reasoning: 'The converse turns the equality of ratios into a statement about direction, which is exactly what was asked.' },
      ],
      answer: 'Yes \u2014 the ratios are both 2 : 3, so by the converse ST is parallel to QR.',
      visualRef: 'F_BPT',
    },    {
      id: 's63b.we3',
      prompt: 'A student is given AD = 3, AB = 12 and AE = 5, with DE parallel to BC, and writes 3/12 = 5/EC. What is wrong?',
      steps: [
        { text: 'AB = 12 is the whole side, not the piece DB.', reasoning: 'The theorem compares the two pieces of each side, so a whole side cannot appear in the ratio.' },
        { text: 'DB = AB \u2212 AD = 12 \u2212 3 = 9.', reasoning: 'Subtracting recovers the piece the proportion actually needs.' },
        { text: 'The correct proportion is 3/9 = 5/EC, giving EC = 15.', reasoning: 'The student\'s version would have given EC = 20, an answer that looks perfectly reasonable and is wrong.' },
      ],
      answer: 'DB is 9, not 12; the correct proportion gives EC = 15.',
      visualRef: 'F_BPT',
    },
  ],
  guidedPractice: [
    { id: 's63b.g1', prompt: 'In triangle ABC, DE is parallel to BC with AD = 2 cm, DB = 3 cm and EC = 4.5 cm. Find AE.', hint: 'Set up the proportion with the pieces, not the whole sides.', answer: 'AE = 3 cm.', rationale: 'AD/DB = AE/EC gives 2/3 = AE/4.5, so 3 \u00d7 AE = 9 and AE = 3 cm.' },
    { id: 's63b.g2', prompt: 'Which statement do you use to show a line is parallel, and which to find a missing length?', hint: 'One assumes the parallel; the other concludes it.', answer: 'The converse shows parallelism; the theorem finds lengths.', rationale: 'The theorem takes the parallel as its hypothesis, so it cannot establish it. The converse takes equal ratios as its hypothesis and concludes the parallel.' },
    { id: 's63b.g3', prompt: 'In triangle ABC, D on AB and E on AC have AD = 2, DB = 3, AE = 3 and EC = 4. Is DE parallel to BC?', hint: 'Compare the two ratios exactly, not approximately.', answer: 'No.', rationale: '2/3 is about 0.667 and 3/4 is 0.75. The ratios differ, so the converse does not apply and DE is not parallel to BC.' },
  ],
  independentPractice: [
    { id: 's63b.i1', prompt: 'In triangle ABC, DE is parallel to BC with AD = 5, DB = 7.5 and AE = 6. Find EC.', answer: 'EC = 9.', rationale: '5/7.5 = 6/EC gives 5 \u00d7 EC = 45, so EC = 9. Both ratios are 2 : 3.' },
    { id: 's63b.i2', prompt: 'In triangle ABC, D and E lie on AB and AC with AD = 4, AB = 10, AE = 6 and AC = 15. Is DE parallel to BC?', answer: 'Yes.', rationale: 'DB = 10 \u2212 4 = 6 and EC = 15 \u2212 6 = 9. Then AD/DB = 4/6 = 2/3 and AE/EC = 6/9 = 2/3, so the converse applies.' },
    { id: 's63b.i3', prompt: 'Why can the theorem not be used to prove that a line is parallel?', answer: 'Because the parallel is its hypothesis, not its conclusion.', rationale: 'A theorem concludes what follows from its assumption. Using it to establish its own assumption would be circular; the converse is the statement that runs the other way.' },
    { id: 's63b.i4', prompt: 'In triangle ABC, DE is parallel to BC with AD = x, DB = x + 2, AE = x + 1 and EC = x + 4. Find x.', answer: 'x = 2.', rationale: 'x/(x + 2) = (x + 1)/(x + 4) gives x(x + 4) = (x + 1)(x + 2), so x\u00b2 + 4x = x\u00b2 + 3x + 2 and x = 2.' },
  ],
  misconceptionIds: [],
  interactivePractice: [],
  reasoningApplication: [
    { id: 's63b.td1', prompt: 'Why is the converse of a theorem a separate statement needing its own justification, rather than something that follows automatically?', expectedReasoning: 'Exchanging hypothesis and conclusion produces a genuinely different claim, and many true statements have false converses. Every square is a rectangle, but not every rectangle is a square. So the fact that a parallel line divides the sides in equal ratios does not by itself tell us that equal ratios force a parallel line; that direction has to be established on its own. Here both directions happen to hold, which is why a ratio calculation can settle a question about parallelism.' },
    { id: 's63b.td2', prompt: 'A figure is drawn so that DE looks parallel to BC, and the measured ratios agree to one decimal place. Is that enough to conclude the line is parallel?', expectedReasoning: 'No. The appearance of the drawing establishes nothing, since a line a degree off parallel looks parallel. Measurement to one decimal place is consistent with ratios that genuinely differ, so it does not give the exact equality the converse requires. The converse needs the ratios to be equal, which means working from exact given lengths rather than from a drawing.' },
  ],
  summary:
    'The theorem computes: given a parallel line, the two sides are divided in the same ratio. The converse concludes: given equal ratios, the line is parallel. Keep them apart, and compare the two PIECES of each side rather than a piece with the whole side.',
  nextStep: 'Next you will meet the criteria that decide when two triangles are similar.',
  teacher: {
    objective: 'Students apply the Basic Proportionality Theorem and its converse in the right direction.',
    prerequisiteKnowledge: ['The Basic Proportionality Theorem', 'Solving proportions'],
    modelLanguage: ['Which are you given \u2014 the parallel, or the ratios?', 'Pieces, not whole sides.', 'The theorem assumes the parallel; it cannot prove it.'],
    teachingNotes: ['The third worked example is the one worth dwelling on. Using AB where DB belongs gives a plausible wrong answer, which is the kind of error that survives a quick check.', 'Insist on the direction being named aloud before any substitution. Students who do not name it tend to use whichever statement the last example used.', 'Watch for ratios being compared as decimals and rounded into agreement.'],
    quickChecks: ['Ask which statement proves parallelism.', 'Ask what DB is when only AD and AB are given.'],
    supportForStrugglingLearners: ['Have the student mark the four pieces on the figure and label them before writing any ratio.'],
    extension: ['Ask what the theorem gives when the line passes through the midpoint of one side.'],
    materialsNeeded: ['Ruler'],
  },
  reviewStatus: 'authored_draft',
};

// ===========================================================================
// §6.4 — THE SIMILARITY CRITERIA.
//
// The NCERT book proves AAA, SSS and SAS. The CBSE 2026-27 curriculum lists
// them as stated WITHOUT proof, and the frozen crosswalk records these two
// units as STATE_WITHOUT_PROOF.
//
// So these lessons say what each criterion asserts, what evidence satisfies
// it, what evidence does not, and how to choose between them — and they do
// not prove any criterion. They say so openly rather than leaving the
// omission to be noticed. `auditProofScope` fails the build if a proof of a
// criterion appears here.
//
// Stating without proof is not the same as stating without understanding,
// and these lessons are not a table to memorise.
// ===========================================================================

export const C10_SECTION_6_4A: AuthoredSection = {
  contentArtifactId: 'ncert_jemh1_s6_4_aaa_lesson',
  contentArtifactVersion: 1,
  source: source('6.4', 'Criteria for Similarity of Triangles', 85, 'ncert_jemh1_s6_4'),
  competencyCandidates: [],
  competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_jemh1_s6_2'],
    mayAssume: ['The two conditions for similarity', 'Angle sum of a triangle', 'Correspondence of vertices'],
    mustNotIntroduce: [{ concept: 'A proof of the similarity criteria', belongsToSection: 'outside_current_cbse_scope' }],
  },
  learningGoal:
    'You will use the AAA criterion, which this course takes as given without proving it, to decide when two triangles are similar from their angles alone.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: [
      'State the two conditions a pair of similar figures must satisfy.',
      'Use the angle sum of a triangle.',
      'Read a correspondence from a similarity statement.',
    ],
    ifNotReady: 'Revise §6.2. This lesson is about when a shortcut to those two conditions is available.',
  },
  vocabulary: [
    { term: 'similarity criterion', meaning: 'A shorter list of conditions which, once checked, is enough to conclude two triangles are similar.' },
    { term: 'AAA criterion', meaning: 'If the three angles of one triangle equal the three angles of another, in correspondence, the triangles are similar.' },
    { term: 'correspondence', meaning: 'The matching of vertices that the order of the letters in a similarity statement records.' },
  ],
  explanation: [
    'For a general polygon both conditions have to be checked: equal angles and proportional sides. For triangles that turns out to be more work than necessary, and §6.4 is about the shortcuts.',
    'The first is the AAA criterion. If the three angles of one triangle are equal to the three angles of another, taken in correspondence, then the triangles are similar \u2014 and the proportionality of the sides comes along without being checked.',
    'This course takes that criterion as given. The textbook does prove it, and the proof is worth reading, but it lies outside what the current curriculum asks of you, so it is not part of this lesson. What you are expected to do is use the criterion correctly and know exactly what it demands.',
    'In practice there is less to check than the name suggests. If two pairs of angles are equal, the third pair must be equal too, because the angles of every triangle sum to 180 degrees. So two equal pairs are enough to invoke AAA, which is why the criterion is often used in that two-angle form.',
    'The demanding part is the correspondence. Writing that triangle ABC is similar to triangle PQR says A matches P, B matches Q and C matches R, and the sides follow that order: AB with PQ, BC with QR, CA with RP. Writing the same similarity in a different vertex order states a different claim, and usually a false one.',
    'Equal angles do not mean equal sides. The triangles may be any size relative to each other; similarity constrains shape, not scale. Two triangles with the same three angles and wildly different sizes are still similar.',
    'And the evidence has to be about angles that genuinely correspond. Knowing that one angle of the first equals one angle of the second tells you nothing on its own: a single equal angle is consistent with triangles of completely different shapes.',
  ],
  representations: ['Two triangles of different sizes with two pairs of equal angles marked'],
  visuals: [F_AA],
  visualsById: { F_AA },
  workedExamples: [
    {
      id: 's64a.we1',
      prompt: 'In triangles ABC and PQR, angle A = angle P and angle B = angle Q. Show that the triangles are similar and write the similarity in the correct order.',
      steps: [
        { text: 'Two pairs of angles are equal, so the third pair must be equal as well.', reasoning: 'The angles of each triangle sum to 180 degrees, so once two pairs agree the remaining angles are forced to agree.' },
        { text: 'All three pairs of angles are therefore equal in correspondence.', reasoning: 'This is exactly the condition the AAA criterion requires, which the course takes as given.' },
        { text: 'By AAA, triangle ABC is similar to triangle PQR.', reasoning: 'The criterion then supplies the proportionality of the sides without it being checked separately.' },
        { text: 'The order records the matching: A with P, B with Q, C with R.', reasoning: 'Writing it as ABC similar to QPR would claim A matches Q, which the given angle equalities do not support.' },
      ],
      answer: 'Triangle ABC is similar to triangle PQR, by AAA.',
      visualRef: 'F_AA',
    },
    {
      id: 's64a.we2',
      prompt: 'Triangle ABC has angles 50, 60 and 70 degrees. Triangle DEF has angles 60, 70 and 50 degrees. Are they similar, and what is the correct correspondence?',
      steps: [
        { text: 'The two triangles have the same three angle sizes.', reasoning: 'Comparing the sets of angles tells us a correspondence exists; it does not yet tell us which one.' },
        { text: 'Match by equal size: A at 50 matches F at 50, B at 60 matches D at 60, C at 70 matches E at 70.', reasoning: 'The correspondence is forced by the angles themselves, not by the order the triangles happen to be named in.' },
        { text: 'So triangle ABC is similar to triangle FDE.', reasoning: 'Writing ABC similar to DEF would claim the 50 degree angle matches the 60 degree one, which is false.' },
      ],
      answer: 'Similar, but as triangle ABC similar to triangle FDE \u2014 not DEF.',
    },
    {
      id: 's64a.we3',
      prompt: 'Two triangles share one equal angle of 40 degrees. Is that enough to conclude similarity?',
      steps: [
        { text: 'AAA requires the angles to agree in correspondence, which one equality does not give.', reasoning: 'One pair leaves the other two pairs completely unconstrained.' },
        { text: 'A triangle with angles 40, 60, 80 and one with angles 40, 100, 40 both contain a 40 degree angle.', reasoning: 'Producing two triangles that satisfy the given evidence and are clearly not similar settles the question.' },
        { text: 'These are not similar, so one equal angle is not sufficient evidence.', reasoning: 'A single counterexample is enough to show evidence is insufficient, which is a different task from proving a general claim.' },
      ],
      answer: 'No \u2014 one equal angle is not enough; a counterexample settles it.',
    },
  ],
  guidedPractice: [
    {
      id: 's64a.g1',
      prompt: 'In triangles ABC and PQR, angle A = angle Q and angle B = angle R. Write the similarity in the correct order.',
      hint: 'Match each vertex to the one with the equal angle.',
      answer: 'Triangle ABC is similar to triangle QRP.',
      rationale: 'A matches Q and B matches R, so C must match P. Writing ABC similar to PQR would state a different and unsupported matching.',
    },
    {
      id: 's64a.g2',
      prompt: 'Why is checking two pairs of angles enough to use AAA?',
      hint: 'What do the three angles of a triangle add to?',
      answer: 'Because the angle sum forces the third pair to be equal once two pairs are.',
      rationale: 'Each third angle is 180 degrees minus the sum of the other two, and those sums are equal, so the third angles are equal as well.',
    },
    {
      id: 's64a.g3',
      prompt: 'Two triangles have equal corresponding angles. One has sides 3, 4, 5 and the other 9, 12, 15. Are they congruent? Are they similar?',
      hint: 'Which of the two words allows a change of size?',
      answer: 'Similar but not congruent.',
      rationale: 'The angles are equal and the sides are in the constant ratio 1 : 3, so they are similar with scale factor 3. Congruence would need the ratio to be 1.',
    },
  ],
  independentPractice: [
    {
      id: 's64a.i1',
      prompt: 'In triangles LMN and XYZ, angle L = angle X = 90 degrees and angle M = angle Y = 35 degrees. Are they similar? Write the statement.',
      answer: 'Yes \u2014 triangle LMN is similar to triangle XYZ.',
      rationale: 'Two pairs of equal angles invoke AAA, and the correspondence L with X, M with Y fixes N with Z.',
    },
    {
      id: 's64a.i2',
      prompt: 'A student writes that triangle ABC is similar to triangle PQR because angle A = angle Q and angle C = angle R. What is wrong?',
      answer: 'The order is wrong; the evidence supports triangle ABC similar to triangle QPR... with A matching Q and C matching R, the statement should pair B with P.',
      rationale: 'The given equalities match A with Q and C with R, so B must match P, and the correct statement is triangle ABC similar to triangle QPR.',
    },
    {
      id: 's64a.i3',
      prompt: 'Can two triangles with the same three angles have completely different side lengths?',
      answer: 'Yes, provided all the sides scale by the same factor.',
      rationale: 'Similarity constrains shape, not size. The sides must stay in a constant ratio, but that ratio may be any positive number.',
    },
    {
      id: 's64a.i4',
      prompt: 'A triangle has angles 30, 60, 90 and another has angles 30, 60, 90. A student concludes the sides are equal. What is the error?',
      answer: 'Equal angles give similarity, not congruence, so the sides are proportional rather than equal.',
      rationale: 'Only a scale factor of 1 would make corresponding sides equal, and nothing in the angle evidence fixes the scale factor.',
    },
  ],
  misconceptionIds: [],
  interactivePractice: [],
  reasoningApplication: [
    {
      id: 's64a.td1',
      prompt: 'Why does the order of the letters in a similarity statement matter? Give a case where the same two triangles make one statement true and another false.',
      expectedReasoning:
        'The order records which vertex matches which, and every side ratio is read from it. Take a triangle ABC with angles 50 at A, 60 at B, 70 at C, and a triangle DEF with 60 at D, 70 at E, 50 at F. Writing ABC similar to FDE is true, because 50 matches 50, 60 matches 60 and 70 matches 70. Writing ABC similar to DEF is false, because it claims the 50 degree angle equals the 60 degree one. The triangles have not changed; only the claim has.',
    },
    {
      id: 's64a.td2',
      prompt: 'Two triangles are drawn and look alike. What would you need to know before claiming they are similar, and why is the drawing not enough?',
      expectedReasoning:
        'You would need either equal corresponding angles, which invokes AAA, or evidence satisfying one of the side-based criteria. A drawing shows neither: two triangles differing by a few degrees look alike at a glance, and a figure is not drawn to a guaranteed scale. Appearance can suggest which criterion to try, but the conclusion has to rest on stated measurements or marked equalities.',
    },
  ],
  summary:
    'If the angles of two triangles are equal in correspondence, the triangles are similar \u2014 the AAA criterion, which this course uses without proving it. Two equal pairs suffice, since the angle sum forces the third. The order of the letters records the correspondence and must match the evidence, and equal angles give proportional sides, not equal ones.',
  nextStep: 'Next you will meet two criteria that work from the sides instead of the angles.',
  teacher: {
    objective: 'Students use the AAA criterion correctly, with attention to correspondence, without being taught its proof.',
    prerequisiteKnowledge: ['The two similarity conditions', 'Angle sum of a triangle'],
    modelLanguage: [
      'Which vertex matches which? Say it before you write it.',
      'Two pairs is enough \u2014 the third is forced.',
      'Equal angles, proportional sides. Not equal sides.',
    ],
    teachingNotes: [
      'The proof of this criterion is in the textbook and is not part of the current curriculum. Saying so plainly is better than silence: students who notice the gap otherwise assume the lesson is incomplete.',
      'Correspondence is where marks are lost. Requiring the matching to be stated aloud before the similarity is written catches most of it.',
      'Watch for equal angles being read as equal sides, and for a single equal angle being treated as sufficient.',
    ],
    quickChecks: [
      'Ask why two pairs of equal angles are enough.',
      'Ask what changes if the letters are written in a different order.',
    ],
    supportForStrugglingLearners: [
      'Have the student write the three vertex pairs in a column before attempting the similarity statement.',
    ],
    extension: ['Ask whether two equal angles could ever fail to force the third, and why not.'],
    materialsNeeded: ['Protractor'],
  },
  reviewStatus: 'authored_draft',
};

export const C10_SECTION_6_4B: AuthoredSection = {
  contentArtifactId: 'ncert_jemh1_s6_4_sss_sas_lesson',
  contentArtifactVersion: 1,
  source: source('6.4', 'Criteria for Similarity of Triangles', 85, 'ncert_jemh1_s6_4'),
  competencyCandidates: [],
  competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_jemh1_s6_4'],
    mayAssume: ['The AAA criterion', 'Ratio and proportion', 'Correspondence of vertices'],
    mustNotIntroduce: [{ concept: 'A proof of the similarity criteria', belongsToSection: 'outside_current_cbse_scope' }],
  },
  learningGoal:
    'You will use the SSS and SAS similarity criteria, which this course takes as given without proving them, and decide which evidence satisfies each.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: [
      'Use the AAA criterion with the correct correspondence.',
      'Compare three ratios and say whether they agree.',
      'Identify the angle enclosed by two named sides.',
    ],
    ifNotReady: 'Revise the previous lesson. These criteria work from sides where that one worked from angles.',
  },
  vocabulary: [
    { term: 'SSS criterion', meaning: 'If the three pairs of corresponding sides of two triangles are in the same ratio, the triangles are similar.' },
    { term: 'SAS criterion', meaning: 'If two pairs of corresponding sides are in the same ratio and the angles INCLUDED between them are equal, the triangles are similar.' },
    { term: 'included angle', meaning: 'The angle enclosed by two named sides \u2014 the one at the vertex where they meet.' },
  ],
  explanation: [
    'The AAA criterion worked from angles. Two more criteria work from the sides, and like AAA this course takes both as given; the textbook proves them, and those proofs are outside what the current curriculum asks of you.',
    'The SSS criterion: if all three pairs of corresponding sides are in the same ratio, the triangles are similar. The word is proportional, not equal. Sides 3, 4, 5 and sides 6, 8, 10 satisfy it, because each ratio is 1 : 2. Sides that are literally equal are the special case where the ratio is 1, which is congruence.',
    'The ratios must be taken in correspondence and must all agree. Three ratios of 1 : 2, 1 : 2 and 1 : 3 fail the criterion, and so does a set of three ratios that agree only because the sides were paired in the wrong order.',
    'The SAS criterion: if two pairs of corresponding sides are in the same ratio and the angles included between those sides are equal, the triangles are similar. Here the word that carries the weight is included.',
    'An included angle is the angle at the vertex where the two named sides meet. If the sides are AB and AC, the included angle is at A. An equal angle somewhere else in the triangle does not satisfy SAS, however convincing the figure looks.',
    'That is the most tempting wrong move in this chapter. Given two sides in proportion and some equal angle, it is easy to write "by SAS" without checking where the angle sits. If the angle is not the included one, the evidence genuinely does not determine the triangles, and the conclusion is unsupported.',
    'Choosing between the three criteria is a matter of what you have been given. Angles only, use AAA. Three sides, use SSS. Two sides and the angle between them, use SAS. Two sides and an angle elsewhere satisfies none of them, and the honest answer is that the evidence is insufficient.',
  ],
  representations: ['Two triangles with proportional sides and an equal angle that is not the included one'],
  visuals: [F_SAS_TRAP],
  visualsById: { F_SAS_TRAP },
  workedExamples: [
    {
      id: 's64b.we1',
      prompt: 'Triangle ABC has sides 4, 6, 8 and triangle PQR has sides 6, 9, 12, matched in that order. Are they similar?',
      steps: [
        { text: 'Form the three ratios in correspondence: 4/6, 6/9 and 8/12.', reasoning: 'SSS asks about corresponding sides, so the pairing has to follow the stated matching rather than the sizes alone.' },
        { text: 'Each simplifies to 2 : 3.', reasoning: '4/6 = 2/3, 6/9 = 2/3 and 8/12 = 2/3, so there is one common ratio throughout.' },
        { text: 'By SSS, triangle ABC is similar to triangle PQR, with scale factor 3/2.', reasoning: 'All three ratios agree, which is exactly what the criterion requires, and the course takes the criterion as given.' },
      ],
      answer: 'Similar by SSS, with scale factor 3/2.',
    },
    {
      id: 's64b.we2',
      prompt: 'In triangles ABC and PQR, AB/PQ = AC/PR = 1/2 and angle A = angle P. Are they similar? Which criterion applies?',
      steps: [
        { text: 'The two proportional pairs are AB with PQ and AC with PR.', reasoning: 'Identifying which sides are in proportion is the first half of the SAS condition.' },
        { text: 'AB and AC meet at A, so the angle included between them is angle A; likewise PQ and PR meet at P.', reasoning: 'The included angle is determined by the two sides named, not chosen for convenience.' },
        { text: 'The given equal angles are exactly those included angles.', reasoning: 'This is the condition SAS demands, and it is satisfied here rather than nearly satisfied.' },
        { text: 'By SAS, triangle ABC is similar to triangle PQR.', reasoning: 'Two proportional pairs plus the included angle is sufficient under the criterion this course takes as given.' },
      ],
      answer: 'Similar by SAS.',
    },
    {
      id: 's64b.we3',
      prompt: 'In triangles ABC and PQR, AB/PQ = AC/PR = 1/2 and angle B = angle Q. Does SAS apply?',
      steps: [
        { text: 'The proportional sides are again AB with PQ and AC with PR.', reasoning: 'The side evidence is identical to the previous example.' },
        { text: 'Those two sides meet at A, so the included angle is at A, not at B.', reasoning: 'AB and AC share the vertex A; B lies at the far end of only one of them.' },
        { text: 'The equal angles given are at B and Q, which are not the included angles.', reasoning: 'An equal angle elsewhere in the triangle does not fill the role the criterion specifies.' },
        { text: 'SAS does not apply, and this evidence is insufficient for similarity.', reasoning: 'Naming the criterion that fails is more useful than guessing: the correct response is that more is needed, such as a second angle, which would bring AAA into play.' },
      ],
      answer: 'No \u2014 the equal angle is not the included angle, so SAS does not apply.',
      visualRef: 'F_SAS_TRAP',
    },
  ],
  guidedPractice: [
    {
      id: 's64b.g1',
      prompt: 'Triangle ABC has sides 5, 7, 9 and triangle DEF has sides 10, 14, 20, matched in order. Are they similar?',
      hint: 'Check all three ratios, not two.',
      answer: 'No.',
      rationale: '5/10 and 7/14 are both 1 : 2, but 9/20 is not. One disagreeing ratio is enough to fail SSS.',
    },
    {
      id: 's64b.g2',
      prompt: 'Sides PQ and PR are in proportion with sides XY and XZ. Which angle must be equal for SAS?',
      hint: 'Where do the two named sides meet?',
      answer: 'The angle at P must equal the angle at X.',
      rationale: 'PQ and PR meet at P, and XY and XZ meet at X, so those are the included angles the criterion requires.',
    },
    {
      id: 's64b.g3',
      prompt: 'Two triangles have sides 3, 4, 5 and 3, 4, 5. Are they similar, congruent, or both?',
      hint: 'What is the ratio in this case?',
      answer: 'Both.',
      rationale: 'All three ratios are 1 : 1, which satisfies SSS and makes them similar with scale factor 1 \u2014 and a scale factor of 1 is congruence.',
    },
  ],
  independentPractice: [
    {
      id: 's64b.i1',
      prompt: 'Triangle ABC has sides 6, 8, 10 and triangle LMN has sides 9, 12, 15, matched in order. Are they similar, and what is the scale factor?',
      answer: 'Yes, by SSS, with scale factor 3/2.',
      rationale: '6/9, 8/12 and 10/15 all simplify to 2 : 3, so a single ratio holds throughout.',
    },
    {
      id: 's64b.i2',
      prompt: 'In triangles ABC and DEF, AB/DE = BC/EF = 2/3 and angle A = angle D. Does SAS apply?',
      answer: 'No.',
      rationale: 'AB and BC meet at B, so the included angle is at B, not at A. The equal angle given is in the wrong place for this pair of sides.',
    },
    {
      id: 's64b.i3',
      prompt: 'What evidence would you need to add to the previous question to reach a conclusion?',
      answer: 'Either the equality of angle B and angle E, or a second pair of equal angles.',
      rationale: 'Angle B equal to angle E would complete SAS for the sides already given. Alternatively a second equal angle pair would allow AAA, which does not use the sides at all.',
    },
    {
      id: 's64b.i4',
      prompt: 'A student says triangles with sides 2, 3, 4 and 4, 6, 8 are congruent because all the ratios match. What is the error?',
      answer: 'Matching ratios give similarity; congruence would need the ratio to be 1.',
      rationale: 'The common ratio here is 1 : 2, so the second triangle is twice the size. Equal ratios mean the same shape, not the same size.',
    },
  ],
  misconceptionIds: [],
  interactivePractice: [],
  reasoningApplication: [
    {
      id: 's64b.td1',
      prompt: 'Why does SAS insist on the INCLUDED angle? Describe what goes wrong when the equal angle sits elsewhere.',
      expectedReasoning:
        'Two sides and the angle between them fix the triangle completely: the two sides can be drawn from the shared vertex at the stated angle, and the third side is then determined. Move the equal angle elsewhere and that no longer holds \u2014 the given data can be completed into more than one shape, so the two triangles are not forced to have the same shape at all. The evidence underdetermines the triangles, which is why naming it SAS would be asserting more than has been given.',
    },
    {
      id: 's64b.td2',
      prompt: 'You are given two sides in proportion and one equal angle not between them. What is the honest conclusion, and what single extra fact would resolve it either way?',
      expectedReasoning:
        'The honest conclusion is that the evidence is insufficient: no criterion is satisfied, which is not the same as the triangles being dissimilar. One extra fact resolves it. Knowing the angle included between the two proportional sides is equal would complete SAS. Alternatively, a second pair of equal angles would give AAA directly, and the side information would not be needed at all.',
    },
  ],
  summary:
    'SSS: three pairs of corresponding sides in the same ratio. SAS: two pairs in the same ratio with the INCLUDED angles equal. Both are taken as given in this course. Proportional is not equal \u2014 a ratio of 1 is the congruent case \u2014 and an equal angle that is not the included one satisfies neither criterion.',
  nextStep: 'Next you will use these criteria to find unknown lengths and to write a justification someone else could check.',
  teacher: {
    objective: 'Students apply the SSS and SAS criteria and recognise evidence that satisfies neither, without being taught the proofs.',
    prerequisiteKnowledge: ['The AAA criterion', 'Ratio comparison', 'Identifying an included angle'],
    modelLanguage: [
      'Where do those two sides meet? That is the included angle.',
      'Proportional, not equal.',
      'Insufficient evidence is a real answer.',
    ],
    teachingNotes: [
      'The third worked example and its figure are the centre of the lesson. The side evidence is identical to the previous example and only the position of the angle changes, which isolates the one thing being taught.',
      'The proofs of these criteria are in the textbook and outside the current curriculum. Say so, rather than leaving students to wonder why the criteria arrive unargued.',
      'Watch for "insufficient" being read as "not similar". The triangles may well be similar; the given evidence simply does not establish it.',
    ],
    quickChecks: [
      'Ask which angle is included between two named sides.',
      'Ask whether equal ratios mean equal sides.',
    ],
    supportForStrugglingLearners: [
      'Have the student mark the shared vertex of the two proportional sides before looking at any angle.',
    ],
    extension: ['Ask what extra fact would turn an insufficient SAS attempt into a valid argument, and name two different ways.'],
    materialsNeeded: ['Ruler', 'Protractor'],
  },
  reviewStatus: 'authored_draft',
};

export const C10_SECTION_6_4C: AuthoredSection = {
  contentArtifactId: 'ncert_jemh1_s6_4_apply_lesson',
  contentArtifactVersion: 1,
  source: source('6.4', 'Criteria for Similarity of Triangles', 85, 'ncert_jemh1_s6_4'),
  competencyCandidates: [],
  competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_jemh1_s6_4'],
    mayAssume: ['The AAA, SSS and SAS criteria', 'Solving a proportion', 'Correspondence of vertices'],
    mustNotIntroduce: [{ concept: 'Ratio of areas of similar triangles', belongsToSection: 'outside_these_units' }],
  },
  learningGoal:
    'You will choose a similarity criterion, use it to find unknown lengths in a figure, and write a justification another person could check.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: [
      'State what each of AAA, SSS and SAS requires.',
      'Write a similarity statement in the correct vertex order.',
      'Solve a proportion for an unknown length.',
    ],
    ifNotReady: 'Revise the two previous lessons. This one assumes you can select the right criterion before using it.',
  },
  vocabulary: [
    { term: 'justification', meaning: 'A written account naming the triangles, the correspondence, the criterion and the evidence that satisfies it.' },
    { term: 'unknown length', meaning: 'A side found from a proportion once similarity has been established.' },
  ],
  explanation: [
    'Once two triangles are known to be similar, every pair of corresponding sides is in the same ratio, and an unknown length follows from a proportion. The work is in getting to that point honestly.',
    'A complete argument answers six questions in order. Which two triangles are being compared? What is the correspondence? Which criterion applies? What exact evidence satisfies it? What proportional relationship follows? What value results?',
    'Skipping the middle questions is what produces answers that are right by luck. "By SAS" with no statement of which sides were in proportion and where the angle sat is not a justification, because nobody reading it can tell whether the criterion was satisfied or merely invoked.',
    'The correspondence governs the proportion. If triangle ABC is similar to triangle PQR, then AB/PQ = BC/QR = CA/RP. Pairing AB with QR instead, because the figure made them look alike, produces an equation with no basis.',
    'Figures in these problems are not drawn to scale, and a length that looks longer may not be. The evidence is what is marked or stated, never what the drawing suggests.',
    'When the evidence satisfies no criterion, the right answer is that it is insufficient. That is a mathematical finding, not a failure to solve the problem, and it is different from concluding the triangles are not similar.',
  ],
  representations: ['Two triangles with the correspondence and the satisfied criterion marked'],
  visuals: [F_AA],
  visualsById: { F_AA },
  workedExamples: [
    {
      id: 's64c.we1',
      prompt: 'In triangles ABC and PQR, angle A = angle P and angle B = angle Q. AB = 4 cm, BC = 5 cm and PQ = 6 cm. Find QR.',
      steps: [
        { text: 'The triangles compared are ABC and PQR, with A matching P, B matching Q and C matching R.', reasoning: 'The correspondence comes from the equal angles given, and everything afterwards depends on it.' },
        { text: 'Two pairs of angles are equal, so by AAA the triangles are similar.', reasoning: 'The angle sum forces the third pair, and the criterion is one this course takes as given.' },
        { text: 'Corresponding sides give AB/PQ = BC/QR.', reasoning: 'AB corresponds to PQ and BC to QR under the matching just established, not because of how the figure is drawn.' },
        { text: '4/6 = 5/QR, so 4 \u00d7 QR = 30 and QR = 7.5 cm.', reasoning: 'A single cross-multiplication; the scale factor 6/4 = 1.5 also checks the answer, since 5 \u00d7 1.5 = 7.5.' },
      ],
      answer: 'QR = 7.5 cm.',
      visualRef: 'F_AA',
    },
    {
      id: 's64c.we2',
      prompt: 'In triangles ABC and DEF, AB/DE = AC/DF = 3/5 and angle A = angle D. AB = 6 cm and BC = 7 cm. Find EF.',
      steps: [
        { text: 'AB and AC meet at A, so angle A is the included angle, and the equal angles given are the included ones.', reasoning: 'Checking the position of the angle before naming the criterion is what distinguishes SAS from an unsupported claim.' },
        { text: 'By SAS, triangle ABC is similar to triangle DEF.', reasoning: 'Two proportional pairs with equal included angles is exactly the criterion, taken as given in this course.' },
        { text: 'Similarity gives BC/EF = AB/DE = 3/5.', reasoning: 'Once similar, every pair of corresponding sides shares the one ratio, including the pair not used as evidence.' },
        { text: '7/EF = 3/5, so 3 \u00d7 EF = 35 and EF = 35/3, about 11.67 cm.', reasoning: 'Leaving the exact fraction alongside the decimal keeps the answer precise.' },
      ],
      answer: 'EF = 35/3 cm, about 11.67 cm.',
    },
    {
      id: 's64c.we3',
      prompt: 'In triangles ABC and PQR, AB/PQ = BC/QR = 2/3 and angle A = angle P. Can you find CA?',
      steps: [
        { text: 'AB and BC meet at B, so the included angle for those two sides is at B.', reasoning: 'The included angle is fixed by the two sides named, regardless of which angle happens to be given.' },
        { text: 'The equal angles given are at A and P, which are not included between those sides.', reasoning: 'This is the same configuration as the trap in the previous lesson.' },
        { text: 'No criterion is satisfied: AAA needs two angle pairs, SSS needs three side pairs, SAS needs the included angle.', reasoning: 'Checking all three explicitly is what turns a hunch into a finding.' },
        { text: 'So CA cannot be found from this evidence, and the honest answer says why.', reasoning: 'The triangles might still be similar; the given data simply does not establish it, and no proportion may be written.' },
      ],
      answer: 'No \u2014 the evidence satisfies no criterion, so no proportion may be used.',
      visualRef: 'F_SAS_TRAP',
    },
  ],
  guidedPractice: [
    {
      id: 's64c.g1',
      prompt: 'Triangle ABC is similar to triangle PQR with AB = 8, PQ = 12 and BC = 10. Find QR.',
      hint: 'Use the correspondence the statement gives you.',
      answer: 'QR = 15.',
      rationale: 'AB/PQ = BC/QR gives 8/12 = 10/QR, so 8 \u00d7 QR = 120 and QR = 15. The scale factor is 1.5 throughout.',
    },
    {
      id: 's64c.g2',
      prompt: 'Write the four things a justification must name.',
      hint: 'Think about what a reader would need to check your claim.',
      answer: 'The two triangles, the correspondence, the criterion, and the evidence satisfying it.',
      rationale: 'Without all four a reader cannot tell whether the criterion was genuinely met, which is what a justification exists to show.',
    },
    {
      id: 's64c.g3',
      prompt: 'Triangle ABC is similar to triangle QRP. Which side corresponds to AB?',
      hint: 'Read the letters in order.',
      answer: 'QR.',
      rationale: 'A matches Q and B matches R, so AB corresponds to QR. Reading the statement as if it said PQR would give the wrong pairing.',
    },
  ],
  independentPractice: [
    {
      id: 's64c.i1',
      prompt: 'Triangle LMN is similar to triangle XYZ with LM = 9, XY = 6 and MN = 12. Find YZ.',
      answer: 'YZ = 8.',
      rationale: 'LM/XY = MN/YZ gives 9/6 = 12/YZ, so 9 \u00d7 YZ = 72 and YZ = 8. The scale factor from LMN to XYZ is 2/3.',
    },
    {
      id: 's64c.i2',
      prompt: 'In triangles ABC and DEF, all three side ratios equal 4/7 and AC = 14. Find DF.',
      answer: 'DF = 24.5.',
      rationale: 'AC corresponds to DF, so AC/DF = 4/7 gives 4 \u00d7 DF = 98 and DF = 24.5. SSS established the similarity.',
    },
    {
      id: 's64c.i3',
      prompt: 'Write a full justification that two triangles with angles 40 and 75 in each are similar.',
      answer: 'Name the triangles, match the 40 degree vertices and the 75 degree vertices, cite AAA, and give the two equal angle pairs as the evidence.',
      rationale: 'The third angles are both 65 degrees by the angle sum, so all three pairs agree in correspondence, which is what AAA requires.',
    },
    {
      id: 's64c.i4',
      prompt: 'A figure shows two triangles that look similar, with only one pair of equal angles marked. What should you conclude?',
      answer: 'That the evidence is insufficient \u2014 not that the triangles are dissimilar.',
      rationale: 'One equal angle satisfies no criterion, and the drawing is not evidence. The triangles may be similar; nothing given establishes it.',
    },
  ],
  misconceptionIds: [],
  interactivePractice: [],
  reasoningApplication: [
    {
      id: 's64c.td1',
      prompt: 'Why is "by SAS" an inadequate justification on its own, even when the conclusion happens to be correct?',
      expectedReasoning:
        'A justification exists so that a reader can check the reasoning, not merely the answer. "By SAS" names a criterion without showing which two pairs of sides were in proportion or where the equal angle sat, and those are precisely the conditions that decide whether the criterion applies. A student who writes it after checking carefully and one who writes it after guessing produce identical work, which means the writing has failed at its job.',
    },
    {
      id: 's64c.td2',
      prompt: 'A problem gives evidence satisfying no criterion. Explain the difference between saying the triangles are not similar and saying the evidence is insufficient.',
      expectedReasoning:
        'Saying they are not similar asserts something about the triangles, and would need a counterexample or contradicting measurements. Saying the evidence is insufficient asserts something about the given data: it does not determine the answer either way. The triangles may well be similar, and an extra marked angle might establish it. Conflating the two turns an honest gap in the data into a false claim about geometry.',
    },
  ],
  summary:
    'Establish similarity before writing any proportion: name the triangles, state the correspondence, cite the criterion and give the evidence. Corresponding sides then share one ratio, from which an unknown length follows. Where the evidence satisfies no criterion, the finding is that it is insufficient, which is not the same as the triangles being dissimilar.',
  nextStep: 'The rest of the chapter applies these criteria to longer chains of reasoning.',
  teacher: {
    objective: 'Students select a criterion, justify it in writing, and compute unknown lengths from the correspondence.',
    prerequisiteKnowledge: ['The three criteria', 'Solving proportions'],
    modelLanguage: [
      'Which triangles, which correspondence, which criterion, what evidence?',
      'The figure is not the evidence.',
      '"Insufficient" is a finding, not a surrender.',
    ],
    teachingNotes: [
      'Requiring the four-part justification in writing is the main instructional move here. It is also the only reliable way to tell a student who selected the criterion from one who recognised the picture.',
      'The third worked example deliberately has no answer. Students expect every problem to resolve, and meeting one that does not is worth more than another successful computation.',
      'Watch for proportions written from the figure rather than the correspondence.',
    ],
    quickChecks: [
      'Ask which side corresponds to AB when ABC is similar to QRP.',
      'Ask what to conclude when no criterion is satisfied.',
    ],
    supportForStrugglingLearners: [
      'Have the student write the correspondence as three vertex pairs before any proportion is attempted.',
    ],
    extension: ['Ask for two different sets of extra evidence that would each resolve an insufficient case.'],
    materialsNeeded: ['Ruler'],
  },
  reviewStatus: 'authored_draft',
};

export const CLASS10_SIMILARITY_SECTIONS: AuthoredSection[] = [
  C10_SECTION_6_2A,
  C10_SECTION_6_3A,
  C10_SECTION_6_3B,
  C10_SECTION_6_4A,
  C10_SECTION_6_4B,
  C10_SECTION_6_4C,
];
