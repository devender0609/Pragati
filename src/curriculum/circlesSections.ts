// ===========================================================================
// v0.84.0 checkpoint 33 — CLASS 9 SECOND AUTHORING PILOT: CIRCLES.
//
// Chapter 12 proved the standard on proof, converse and application. It
// never exercised a MERGED unit and needed only one new visual type. This
// chapter has both: §5.1 and §5.2 become one lesson, §5.7 becomes two, and
// every figure is a circle with chords, arcs and right angles.
//
// If the standard needed a Chapter-5-shaped workaround, this is where it
// would show. It did not: the geometry figure gained circles and arcs as
// general primitives, and nothing here is addressed by lesson id.
// ===========================================================================

import type { AuthoredSection } from './authoredSection';
import type { GeometryFigureSpec } from './visualSpecification';

export const CIRCLES_CHAPTER_ID = 'ncert_iemh1_ch05';

const BOOK = 'Ganita Manjari, Textbook of Mathematics for Grade 9 (Part I)';
const SRC = 'https://ncert.nic.in/textbook/pdf/iemh1dd.zip';
const INSPECTED = '2026-10-07';

const source = (
  sectionNumber: string,
  exactTitle: string,
  startPage: number,
  officialSectionId: string
) => ({
  officialChapterId: CIRCLES_CHAPTER_ID,
  officialSectionId,
  sectionNumber,
  exactTitle,
  startPage,
  textbook: BOOK,
  sourceReference: SRC,
  inspectionDate: INSPECTED,
});

// --- figures ---------------------------------------------------------------
// Every point said to be on a circle is placed at the true radius from the
// centre; the validator rejects a figure where that is not so.

const F_DEFINE: GeometryFigureSpec = {
  type: 'geometry_figure',
  purpose: 'show_definition',
  status: 'concept_specific',
  points: [
    { id: 'o', x: 100, y: 100, label: 'O' },
    { id: 'a', x: 170, y: 100, label: 'A' },
    { id: 'b', x: 30, y: 100, label: 'B' },
    { id: 'p', x: 150.5, y: 50.5, label: 'P' },
    { id: 'q', x: 100, y: 170, label: 'Q' },
  ],
  circles: [{ id: 'k', centre: 'o', through: 'a' }],
  segments: [
    { from: 'o', to: 'a', mark: 'single_tick', label: 'radius' },
    { from: 'o', to: 'q', mark: 'single_tick' },
    { from: 'b', to: 'a', label: 'diameter' },
    { from: 'p', to: 'q', label: 'chord' },
  ],
  caption: 'Radius, diameter and a chord — all consequences of one defining property.',
  altText:
    'A circle with centre O. OA and OQ are radii, marked equal. BA passes through O, so it is a diameter. PQ joins two points of the circle without passing through O, so it is a chord and is visibly shorter than BA.',
};

const F_SYMMETRY: GeometryFigureSpec = {
  type: 'geometry_figure',
  purpose: 'show_definition',
  status: 'concept_specific',
  points: [
    { id: 'o', x: 100, y: 100, label: 'O' },
    { id: 'a', x: 170, y: 100, label: 'A' },
    { id: 'b', x: 30, y: 100, label: 'B' },
    { id: 'p', x: 150.5, y: 50.5, label: 'P' },
    { id: 'pp', x: 150.5, y: 149.5, label: "P'" },
  ],
  circles: [{ id: 'k', centre: 'o', through: 'a' }],
  segments: [
    { from: 'b', to: 'a', mark: 'dashed' },
    { from: 'p', to: 'pp', mark: 'dashed' },
    { from: 'o', to: 'p', mark: 'single_tick' },
    { from: 'o', to: 'pp', mark: 'single_tick' },
  ],
  caption: 'Reflection in the diameter BA sends P to P\u2032, and both are on the circle.',
  altText:
    'A circle with centre O and diameter BA drawn as a dashed line. Point P above BA reflects to P-prime below it, the two joined by a dashed segment perpendicular to BA. OP and OP-prime are marked equal, so the reflected point is still at radius distance and lies on the circle.',
};

const F_THREEPOINTS: GeometryFigureSpec = {
  type: 'geometry_figure',
  purpose: 'show_construction',
  status: 'concept_specific',
  points: [
    { id: 'a', x: 40, y: 150, label: 'A' },
    { id: 'b', x: 160, y: 150, label: 'B' },
    { id: 'c', x: 120, y: 45, label: 'C' },
    { id: 'o', x: 100, y: 120, label: 'O' },
    { id: 'm', x: 100, y: 150, label: 'M' },
  ],
  circles: [{ id: 'k', centre: 'o', through: 'a' }],
  segments: [
    { from: 'a', to: 'b' },
    { from: 'b', to: 'c' },
    { from: 'c', to: 'a' },
    { from: 'o', to: 'm', mark: 'dashed' },
    { from: 'o', to: 'a', mark: 'single_tick' },
    { from: 'o', to: 'b', mark: 'single_tick' },
    { from: 'o', to: 'c', mark: 'single_tick' },
  ],
  angleMarks: [{ at: 'm', from: 'a', to: 'o', right: true }],
  caption: 'The one point equidistant from all three vertices is the centre of the only circle through them.',
  altText:
    'Triangle ABC with a point O inside it. OA, OB and OC are marked equal, and the circle through A, B and C is drawn with centre O. A dashed segment runs from O to M, the midpoint of AB, meeting it at a marked right angle, showing O lies on the perpendicular bisector of AB.',
};

const F_CHORDANGLE: GeometryFigureSpec = {
  type: 'geometry_figure',
  purpose: 'support_proof',
  status: 'concept_specific',
  points: [
    { id: 'o', x: 100, y: 100, label: 'O' },
    { id: 'a', x: 170, y: 100, label: 'A' },
    { id: 'b', x: 135, y: 39.4, label: 'B' },
    { id: 'c', x: 30, y: 100, label: 'C' },
    { id: 'd', x: 65, y: 160.6, label: 'D' },
  ],
  circles: [{ id: 'k', centre: 'o', through: 'a' }],
  segments: [
    { from: 'a', to: 'b', mark: 'single_tick' },
    { from: 'c', to: 'd', mark: 'single_tick' },
    { from: 'o', to: 'a', mark: 'double_tick' },
    { from: 'o', to: 'b', mark: 'double_tick' },
    { from: 'o', to: 'c', mark: 'double_tick' },
    { from: 'o', to: 'd', mark: 'double_tick' },
  ],
  angleMarks: [
    { at: 'o', from: 'a', to: 'b', equalTag: 'theta' },
    { at: 'o', from: 'c', to: 'd', equalTag: 'theta' },
  ],
  caption: 'Two equal chords, and the angles they make at the centre.',
  altText:
    'A circle with centre O. Chords AB and CD are marked equal with single ticks. The four radii OA, OB, OC and OD are marked equal with double ticks. The angles AOB and COD at the centre carry the same tag, asserting they are equal.',
};

const F_PERPENDICULAR: GeometryFigureSpec = {
  type: 'geometry_figure',
  purpose: 'support_proof',
  status: 'concept_specific',
  points: [
    { id: 'o', x: 100, y: 60, label: 'O' },
    { id: 'a', x: 30, y: 60, label: 'A' },
    { id: 'p', x: 44.7, y: 120, label: 'P' },
    { id: 'q', x: 155.3, y: 120, label: 'Q' },
    { id: 'm', x: 100, y: 120, label: 'M' },
  ],
  circles: [{ id: 'k', centre: 'o', through: 'a' }],
  segments: [
    { from: 'p', to: 'q' },
    { from: 'o', to: 'p', mark: 'double_tick' },
    { from: 'o', to: 'q', mark: 'double_tick' },
    { from: 'o', to: 'm', mark: 'dashed' },
    { from: 'p', to: 'm', mark: 'single_tick' },
    { from: 'm', to: 'q', mark: 'single_tick' },
  ],
  angleMarks: [{ at: 'm', from: 'o', to: 'q', right: true }],
  caption: 'M is the midpoint of chord PQ, and OM meets the chord at a right angle.',
  altText:
    'A circle with centre O and a chord PQ that does not pass through O. M lies on PQ with PM and MQ marked equal. The dashed segment OM is drawn, and the angle at M between OM and MQ is marked as a right angle. Radii OP and OQ are marked equal.',
};

const F_TWOCHORDS: GeometryFigureSpec = {
  type: 'geometry_figure',
  purpose: 'compare_cases',
  status: 'concept_specific',
  points: [
    { id: 'o', x: 100, y: 100, label: 'O' },
    { id: 'a', x: 30, y: 100, label: 'A' },
    { id: 'p', x: 35.4, y: 70, label: 'P' },
    { id: 'q', x: 164.6, y: 70, label: 'Q' },
    { id: 'r', x: 60, y: 160, label: 'R' },
    { id: 's', x: 160.6, y: 135, label: 'S' },
    { id: 'm', x: 100, y: 70, label: 'M' },
    { id: 'n', x: 110.3, y: 147.5, label: 'N' },
  ],
  circles: [{ id: 'k', centre: 'o', through: 'a' }],
  segments: [
    { from: 'p', to: 'q', label: 'longer' },
    { from: 'r', to: 's', label: 'shorter' },
    { from: 'o', to: 'm', mark: 'dashed' },
    { from: 'o', to: 'n', mark: 'dashed' },
  ],
  angleMarks: [
    { at: 'm', from: 'o', to: 'q', right: true },
    { at: 'n', from: 'o', to: 's', right: true },
  ],
  caption: 'The longer chord sits closer to the centre.',
  altText:
    'A circle with centre O carrying two unequal chords. The longer chord PQ has its foot of perpendicular M close to O; the shorter chord RS has its foot N further from O. Both perpendiculars from the centre are dashed and marked with right angles at M and N.',
};

const F_CENTREDOUBLE: GeometryFigureSpec = {
  type: 'geometry_figure',
  purpose: 'support_proof',
  status: 'concept_specific',
  points: [
    { id: 'o', x: 100, y: 100, label: 'O' },
    { id: 'a', x: 35.4, y: 130, label: 'A' },
    { id: 'b', x: 164.6, y: 130, label: 'B' },
    { id: 'p', x: 100, y: 29, label: 'P' },
    { id: 'd', x: 100, y: 171, label: 'D' },
  ],
  circles: [{ id: 'k', centre: 'o', through: 'p' }],
  arcs: [{ circle: 'k', from: 'b', to: 'a', label: 'arc AB' }],
  segments: [
    { from: 'o', to: 'a', mark: 'single_tick' },
    { from: 'o', to: 'b', mark: 'single_tick' },
    { from: 'o', to: 'p', mark: 'single_tick' },
    { from: 'p', to: 'a' },
    { from: 'p', to: 'b' },
    { from: 'p', to: 'd', mark: 'dashed' },
  ],
  angleMarks: [
    { at: 'o', from: 'a', to: 'b', label: 'centre' },
    { at: 'p', from: 'a', to: 'b', label: 'circle' },
  ],
  caption: 'Arc AB seen from the centre, and from a point P on the rest of the circle.',
  altText:
    'A circle with centre O. A and B are points on the circle and the minor arc AB is highlighted. P is a point on the circle on the far side from that arc. Radii OA, OB and OP are marked equal. The angle AOB at the centre and the angle APB at P are both marked; the figure asserts the first is twice the second. A dashed line from P through O to D supplies the two isosceles triangles the proof uses.',
};

const F_SAMESEGMENT: GeometryFigureSpec = {
  type: 'geometry_figure',
  purpose: 'compare_cases',
  status: 'concept_specific',
  points: [
    { id: 'o', x: 100, y: 100, label: 'O' },
    { id: 'a', x: 35.4, y: 130, label: 'A' },
    { id: 'b', x: 164.6, y: 130, label: 'B' },
    { id: 'p', x: 100, y: 29, label: 'P' },
    { id: 'q', x: 38.8, y: 65, label: 'Q' },
  ],
  circles: [{ id: 'k', centre: 'o', through: 'p' }],
  arcs: [{ circle: 'k', from: 'b', to: 'a' }],
  segments: [
    { from: 'p', to: 'a' },
    { from: 'p', to: 'b' },
    { from: 'q', to: 'a' },
    { from: 'q', to: 'b' },
  ],
  angleMarks: [
    { at: 'p', from: 'a', to: 'b', equalTag: 'same' },
    { at: 'q', from: 'a', to: 'b', equalTag: 'same' },
  ],
  caption: 'P and Q lie on the same side of AB, and the angles they see it at are equal.',
  altText:
    'A circle with centre O, chord AB, and two points P and Q on the major arc above AB. Segments join each of P and Q to both A and B. The angles APB and AQB carry the same tag, asserting they are equal because both stand on the same arc AB.',
};

const F_CYCLIC: GeometryFigureSpec = {
  type: 'geometry_figure',
  purpose: 'support_proof',
  status: 'concept_specific',
  points: [
    { id: 'o', x: 100, y: 100, label: 'O' },
    { id: 'a', x: 35.4, y: 130, label: 'A' },
    { id: 'b', x: 164.6, y: 130, label: 'B' },
    { id: 'c', x: 161.2, y: 65, label: 'C' },
    { id: 'd', x: 38.8, y: 65, label: 'D' },
  ],
  circles: [{ id: 'k', centre: 'o', through: 'a' }],
  segments: [
    { from: 'a', to: 'b' },
    { from: 'b', to: 'c' },
    { from: 'c', to: 'd' },
    { from: 'd', to: 'a' },
    { from: 'o', to: 'a', mark: 'single_tick' },
    { from: 'o', to: 'c', mark: 'single_tick' },
  ],
  angleMarks: [
    { at: 'a', from: 'd', to: 'b', label: 'A' },
    { at: 'c', from: 'b', to: 'd', label: 'C' },
  ],
  caption: 'All four vertices on one circle: the opposite angles are forced to add to 180 degrees.',
  altText:
    'Quadrilateral ABCD with all four vertices on a circle of centre O. Radii OA and OC are marked equal. The opposite angles at A and C are marked; the figure asserts their sum is 180 degrees.',
};

export const SECTION_5_1_2: AuthoredSection = {
  contentArtifactId: 'ncert_iemh1_s5_1_2_lesson',
  contentArtifactVersion: 1,
  source: {
    ...source('5.1', 'Definitions', 2, 'ncert_iemh1_s5_1'),
    // The merged lesson covers §5.2 Symmetries of a Circle as well; both
    // official sections must stay visible in provenance.
    additionalOfficialSectionIds: ['ncert_iemh1_s5_2'],
  },
  competencyCandidates: [],
  competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: [],
    mayAssume: [
      'Distance between two points',
      'Reflection and rotation as transformations',
      'Class 7 work with circles as round shapes with a centre',
    ],
    mustNotIntroduce: [
      { concept: 'How many circles pass through given points', belongsToSection: 'ncert_iemh1_s5_3' },
      { concept: 'Chords and the angles they subtend', belongsToSection: 'ncert_iemh1_s5_4' },
      { concept: 'The angle at the centre theorem', belongsToSection: 'ncert_iemh1_s5_7' },
    ],
  },
  learningGoal:
    'You will define a circle by one property — equal distance from a centre — and show that its symmetries follow from that property rather than from how it looks.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: [
      'Measure the distance between two points.',
      'Describe what a reflection in a line does to a point.',
      'Say what stays the same when a shape is rotated.',
    ],
    ifNotReady: 'Revisit reflection first. The symmetry argument here is a reflection argument.',
  },
  vocabulary: [
    { term: 'circle', meaning: 'All the points at one fixed distance from a fixed point.' },
    { term: 'centre', meaning: 'The fixed point the distance is measured from.' },
    { term: 'radius', meaning: 'That fixed distance, and also any segment from the centre to the circle.' },
    { term: 'chord', meaning: 'A segment joining two points of the circle.' },
    { term: 'diameter', meaning: 'A chord that passes through the centre.' },
  ],
  explanation: [
    'A circle is not defined as a round shape. It is defined by a property: fix a point O and a distance r, and the circle is every point whose distance from O is exactly r. Nothing about roundness is assumed; roundness is what that property produces.',
    'Three words follow immediately. A radius is a segment from the centre to a point of the circle, and by the definition every radius has the same length. A chord joins two points of the circle. A diameter is a chord through the centre — so a diameter is two radii in a line, and is therefore twice the radius.',
    'Now the symmetry, and this is where the definition earns its keep. Rotate the whole plane about O through any angle at all. Every point keeps its distance from O, because rotation about O does not change distance from O. So every point of the circle lands on a point of the circle: the circle comes back to itself, through every angle.',
    'Reflection works the same way. Reflect in any line through O. A point P at distance r goes to a point P-prime, and the reflection has not changed its distance from O, so P-prime is also at distance r and lies on the circle. Every diameter is therefore a line of symmetry, and there are infinitely many of them.',
    'Both arguments used exactly one fact — that the transformation preserves distance from O — and the definition is the only place that fact came from. This is the pattern the whole chapter follows: a property is proved from the definition, not read off a drawing.',
  ],
  representations: [
    'A circle with a radius, a chord and a diameter distinguished',
    'A reflection in a diameter carrying a point of the circle to another point of the circle',
  ],
  visuals: [F_DEFINE, F_SYMMETRY],
  visualsById: { F_DEFINE, F_SYMMETRY },
  workedExamples: [
    {
      id: 's512.we1',
      prompt: 'A circle has centre O and radius 6 cm. P is a point with OP = 6 cm and Q is a point with OQ = 7 cm. Which lies on the circle?',
      steps: [
        { text: 'The circle is every point exactly 6 cm from O.', reasoning: 'The definition fixes membership by distance alone, so this is the only test to apply.' },
        { text: 'OP is 6 cm, so P satisfies the condition.', reasoning: 'P is at exactly the radius distance, which is what membership of the circle means.' },
        { text: 'OQ is 7 cm, which is not 6 cm, so Q fails it.', reasoning: 'Being near the circle is not being on it; the definition admits no tolerance.' },
      ],
      answer: 'P lies on the circle; Q lies outside it.',
      visualRef: 'F_DEFINE',
    },
    {
      id: 's512.we2',
      prompt: 'Explain why a diameter is always exactly twice a radius.',
      steps: [
        { text: 'A diameter is a chord through the centre, so it meets the circle at two points with O between them.', reasoning: 'That is what passing through the centre means for a chord joining two points of the circle.' },
        { text: 'Each of the two pieces is a segment from O to a point of the circle, so each is a radius.', reasoning: 'A radius is defined as exactly such a segment, and by the definition all radii are equal.' },
        { text: 'The diameter is the two pieces together.', reasoning: 'O lies between the endpoints, so the lengths add rather than overlap.' },
      ],
      answer: 'A diameter is twice the radius, and it is the longest chord for the same reason.',
    },
    {
      id: 's512.we3',
      prompt: 'A classmate says a circle has exactly four lines of symmetry, like a square. What is wrong?',
      steps: [
        { text: 'Take any line through O and reflect the circle in it.', reasoning: 'Choosing an arbitrary line, rather than four chosen ones, is what tests the claim properly.' },
        { text: 'Reflection in a line through O keeps every distance from O unchanged, so each point of the circle maps to a point of the circle.', reasoning: 'The symmetry argument uses only distance preservation, and it does not care which line through O was picked.' },
        { text: 'There are infinitely many lines through O.', reasoning: 'Every one of them is therefore a line of symmetry, so no finite count can be right.' },
      ],
      answer: 'A circle has infinitely many lines of symmetry — every diameter is one.',
      visualRef: 'F_SYMMETRY',
    },
  ],
  misconceptionIds: [],
  guidedPractice: [
    {
      id: 's512.g1',
      prompt: 'A chord of a circle has length equal to the diameter. Where must it lie?',
      hint: 'Which chord is the longest, and why can no other chord match it?',
      answer: 'It must pass through the centre — it is a diameter.',
      rationale: 'Any chord not through the centre is shorter, because the path from one point to the other through O is the longest route across the circle.',
    },
    {
      id: 's512.g2',
      prompt: 'Why is every radius of one circle the same length?',
      hint: 'Look at the definition rather than at the drawing.',
      answer: 'Because the circle is defined as the points at one fixed distance from the centre.',
      rationale: 'Equal radii are not an extra property to prove; they are what the definition says.',
    },
    {
      id: 's512.g3',
      prompt: 'A circle is rotated 37 degrees about its centre. What does the picture look like afterwards?',
      hint: 'Does rotation about O change any point\u2019s distance from O?',
      answer: 'Exactly the same.',
      rationale: 'Rotation about O preserves distance from O, so every point of the circle lands on the circle. The angle makes no difference.',
    },
  ],
  independentPractice: [
    {
      id: 's512.i1',
      prompt: 'A circle has radius 5 cm. List the possible lengths of a chord, and say which length occurs only once in any given direction.',
      answer: 'Any length from just above 0 up to 10 cm; 10 cm is the diameter.',
      rationale: 'The diameter is the maximum, and for each direction there is exactly one chord through the centre.',
    },
    {
      id: 's512.i2',
      prompt: 'Prove that reflecting a circle in a line through its centre leaves it unchanged.',
      answer: 'Reflection in a line through O preserves distance from O, so each point at distance r maps to a point at distance r.',
      rationale: 'The whole argument is distance preservation; nothing about the shape is used.',
    },
    {
      id: 's512.i3',
      prompt: 'Is a segment joining two points of a circle always a chord? Is it always a diameter?',
      answer: 'Always a chord; a diameter only when it passes through the centre.',
      rationale: 'Chord is the general term; diameter is the special case, and assuming the special case is a common source of error in later proofs.',
    },
  ],
  reasoningApplication: [
    {
      id: 's512.r1',
      prompt: 'Both symmetry results came from one fact about the transformations used. Name that fact, and decide whether a transformation that doubles every distance from O would leave the circle unchanged.',
      expectedReasoning:
        'The fact is that rotation and reflection preserve distance from O. Doubling distances sends every point at distance r to distance 2r, so the image is a different circle — same centre, twice the radius. A strong answer notices that the original circle is not mapped to itself even though the shape is still a circle.',
    },
  ],
  interactivePractice: [],
  summary:
    'A circle is the set of points at one fixed distance from a centre. Radius, chord and diameter are named from that, and both the rotational and the reflective symmetry follow from the single fact that those transformations preserve distance from the centre.',
  nextStep:
    'Next you will ask how much information pins a circle down: one point, two points, or three.',
  teacher: {
    objective: 'Students state the circle definition and derive its symmetries from distance preservation.',
    prerequisiteKnowledge: ['Distance between points', 'Reflection and rotation'],
    modelLanguage: ['Which part of the definition are you using?', 'What does this transformation keep the same?'],
    teachingNotes: [
      'This lesson merges the definition with the symmetry work deliberately: the symmetry argument is one step from the definition, and separating them leaves a lesson that only names words.',
      'Press on "why" for the symmetry. Students will say it looks the same; the answer wanted is that distance from O is unchanged.',
      'Keep chord and diameter apart from the first mention. Treating a general chord as a diameter breaks several later proofs.',
    ],
    quickChecks: ['What makes a point belong to the circle?', 'How many lines of symmetry, and why?'],
    supportForStrugglingLearners: [
      'Use a pin and string to generate the circle, so the fixed distance is physically obvious.',
      'Fold a paper circle along several diameters to see the reflective symmetry before arguing it.',
    ],
    extension: ['Ask what the set of points at a fixed distance from a fixed point looks like in three dimensions.'],
    materialsNeeded: ['String and pin', 'Paper circles', 'Ruler'],
  },
  reviewStatus: 'authored_draft',
};

export const SECTION_5_3: AuthoredSection = {
  contentArtifactId: 'ncert_iemh1_s5_3_lesson',
  contentArtifactVersion: 1,
  source: source('5.3', 'How Many Circles?', 3, 'ncert_iemh1_s5_3'),
  competencyCandidates: [],
  competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_iemh1_s5_1'],
    mayAssume: ['The circle definition', 'Perpendicular bisector as the set of points equidistant from two points', 'Construction with compasses'],
    mustNotIntroduce: [
      { concept: 'Chords and the angles they subtend', belongsToSection: 'ncert_iemh1_s5_4' },
      { concept: 'Angles subtended by an arc', belongsToSection: 'ncert_iemh1_s5_7' },
    ],
  },
  learningGoal:
    'You will determine how much information fixes a circle, and construct the unique circle through three points that are not in a line.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: [
      'Construct the perpendicular bisector of a segment.',
      'Say what every point on a perpendicular bisector has in common.',
      'State the definition of a circle.',
    ],
    ifNotReady: 'Practise the perpendicular bisector construction. The whole lesson rests on what it means.',
  },
  vocabulary: [
    { term: 'perpendicular bisector', meaning: 'The line through the midpoint of a segment at right angles to it — exactly the points equidistant from the two ends.' },
    { term: 'circumcircle', meaning: 'The circle passing through all three vertices of a triangle.' },
    { term: 'circumcentre', meaning: 'Its centre.' },
  ],
  explanation: [
    'How much does it take to pin down a circle? Through one point A, you can draw a circle of any radius with its centre anywhere at that distance, so there are infinitely many. Two points narrow it, but not enough: the centre must be equidistant from A and B, which puts it anywhere on the perpendicular bisector of AB — still infinitely many circles.',
    'Three points is where it changes, and the perpendicular bisector is the reason. A centre equidistant from A and B lies on the perpendicular bisector of AB. A centre equidistant from B and C lies on the perpendicular bisector of BC. A centre of a circle through all three must do both, so it must be where those two lines meet.',
    'If A, B and C are not in a line, those two bisectors are not parallel, so they meet in exactly one point. One possible centre, and the radius is then forced as the distance to A. One circle, and no more.',
    'If the three points are in a line, the two bisectors are parallel and never meet. No point is equidistant from all three, so no circle passes through them. The condition "not in a line" is doing real work and is not a technicality.',
    'For a triangle, this circle has a name: the circumcircle, and its centre the circumcentre. Where the circumcentre sits depends on the triangle — inside for an acute one, on the hypotenuse for a right-angled one, outside for an obtuse one — but it exists and is unique in every case.',
  ],
  representations: [
    'A triangle with the perpendicular bisectors meeting at the circumcentre',
    'Equal radii from that centre to all three vertices',
  ],
  visuals: [F_THREEPOINTS],
  visualsById: { F_THREEPOINTS },
  workedExamples: [
    {
      id: 's53.we1',
      prompt: 'Construct the circle through three given points A, B and C that are not in a line.',
      steps: [
        { text: 'Construct the perpendicular bisector of AB.', reasoning: 'Every point on it is equidistant from A and B, which is exactly the condition a centre must satisfy for those two.' },
        { text: 'Construct the perpendicular bisector of BC.', reasoning: 'This gives the matching condition for B and C; a centre must sit on this line too.' },
        { text: 'Mark O where the two lines cross.', reasoning: 'O is the only point satisfying both conditions at once, so it is the only candidate centre.' },
        { text: 'Set the compasses to OA and draw the circle.', reasoning: 'Since OA, OB and OC are all equal, that single radius reaches all three points.' },
      ],
      answer: 'The circle with centre O and radius OA passes through all three, and it is the only one that does.',
      visualRef: 'F_THREEPOINTS',
    },
    {
      id: 's53.we2',
      prompt: 'Why can no circle pass through three points that lie on one straight line?',
      steps: [
        { text: 'A centre would have to be equidistant from all three.', reasoning: 'That is what a circle through them requires, by the definition.' },
        { text: 'The perpendicular bisectors of the first pair and the second pair are both perpendicular to the same line.', reasoning: 'All three points lie on one line, so both bisectors are perpendicular to that same line.' },
        { text: 'Two distinct lines perpendicular to the same line are parallel, so they never meet.', reasoning: 'With no intersection, no point satisfies both conditions.' },
      ],
      answer: 'No such centre exists, so no circle passes through three collinear points.',
    },
    {
      id: 's53.we3',
      prompt: 'A triangle is right-angled at B. Where is its circumcentre?',
      steps: [
        { text: 'The circumcentre is equidistant from A, B and C.', reasoning: 'That is the defining property, whatever the shape of the triangle.' },
        { text: 'Construct the perpendicular bisectors of the two legs; they meet at the midpoint of AC.', reasoning: 'Working the construction rather than guessing is what settles the position.' },
        { text: 'Check: that midpoint is equidistant from A and C by construction, and the distance to B turns out equal as well.', reasoning: 'All three distances agreeing is what makes it the circumcentre.' },
      ],
      answer: 'At the midpoint of the hypotenuse — so the hypotenuse is a diameter of the circumcircle.',
    },
  ],
  misconceptionIds: [],
  guidedPractice: [
    {
      id: 's53.g1',
      prompt: 'How many circles pass through two given points?',
      hint: 'Where can the centre be? What does equidistant from both mean?',
      answer: 'Infinitely many.',
      rationale: 'The centre may be anywhere on the perpendicular bisector of the two points, and each position gives a different circle.',
    },
    {
      id: 's53.g2',
      prompt: 'Why is the circumcentre found with two perpendicular bisectors rather than all three?',
      hint: 'If a point is equidistant from A and B, and from B and C, what follows about A and C?',
      answer: 'Two are enough; the third passes through the same point automatically.',
      rationale: 'Equidistant from A and B, and from B and C, forces equidistant from A and C, so the third bisector adds no new condition.',
    },
    {
      id: 's53.g3',
      prompt: 'A student draws one circle through three points and says it is the only one. What has to be true of the points for that claim to hold?',
      hint: 'Which case has no circle at all?',
      answer: 'They must not be collinear.',
      rationale: 'With three points in a line there is no circle at all, so the uniqueness claim needs the non-collinear condition stated.',
    },
  ],
  independentPractice: [
    {
      id: 's53.i1',
      prompt: 'Describe how to find the centre of a circle drawn on paper, using only two chords.',
      answer: 'Draw two chords and construct their perpendicular bisectors; they meet at the centre.',
      rationale: 'The centre is equidistant from the ends of each chord, so it lies on both perpendicular bisectors.',
    },
    {
      id: 's53.i2',
      prompt: 'For an obtuse triangle, is the circumcentre inside or outside? Justify from the construction.',
      answer: 'Outside, opposite the obtuse angle.',
      rationale: 'The perpendicular bisectors meet beyond the longest side, which is what the construction produces when one angle exceeds 90 degrees.',
    },
    {
      id: 's53.i3',
      prompt: 'Explain why one point determines infinitely many circles but three non-collinear points determine exactly one.',
      answer: 'One point constrains neither centre nor radius; three points force the centre to one intersection and the radius follows.',
      rationale: 'Each extra point adds one equidistance condition, and two such conditions intersect in a single point.',
    },
  ],
  reasoningApplication: [
    {
      id: 's53.r1',
      prompt: 'Four points are given, no three in a line. Must a circle pass through all four? Explain what the construction tells you.',
      expectedReasoning:
        'No. Three of them already fix the circle uniquely, so the fourth either happens to lie on it or does not. A good answer sees that the fourth point is a condition with nothing left to adjust, and connects this to concyclicity being special rather than automatic.',
    },
  ],
  interactivePractice: [],
  summary:
    'One or two points leave infinitely many circles; three points not in a line fix exactly one, because the two perpendicular bisectors meet in a single centre. Three points in a line give none at all.',
  nextStep: 'Next you will look at chords themselves, and what equal chords force at the centre.',
  teacher: {
    objective: 'Students construct the unique circle through three non-collinear points and justify both existence and uniqueness.',
    prerequisiteKnowledge: ['Perpendicular bisector construction', 'Circle definition'],
    modelLanguage: ['Where must the centre be, and why?', 'What happens if the points are in a line?'],
    teachingNotes: [
      'Build the count up: one point, two points, three. The jump from infinitely many to exactly one is the lesson.',
      'The collinear case is not a footnote. It is where students see that the hypothesis of a theorem earns its place.',
      'Have students construct all three bisectors once, so the redundancy of the third is observed rather than asserted.',
    ],
    quickChecks: ['Why two bisectors and not three?', 'Where is the circumcentre of a right-angled triangle?'],
    supportForStrugglingLearners: [
      'Give the perpendicular bisector of one segment pre-drawn and ask where the centre could be before adding the second.',
      'Use tracing paper to test that the constructed circle really passes through all three points.',
    ],
    extension: ['Ask where the circumcentre of a right-angled triangle must be, and why that makes the hypotenuse a diameter.'],
    materialsNeeded: ['Compasses', 'Ruler', 'Tracing paper'],
  },
  reviewStatus: 'authored_draft',
};

export const SECTION_5_4: AuthoredSection = {
  contentArtifactId: 'ncert_iemh1_s5_4_lesson',
  contentArtifactVersion: 1,
  source: source('5.4', 'Chords and the Angles They Subtend', 7, 'ncert_iemh1_s5_4'),
  competencyCandidates: [],
  competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_iemh1_s5_1'],
    mayAssume: ['Circle symmetry', 'SSS and SAS congruence from Class 8', 'Chords and radii'],
    mustNotIntroduce: [
      { concept: 'Perpendicular from the centre to a chord', belongsToSection: 'ncert_iemh1_s5_5' },
      { concept: 'Angles subtended at a point on the circle', belongsToSection: 'ncert_iemh1_s5_7' },
    ],
  },
  learningGoal:
    'You will prove that equal chords subtend equal angles at the centre, prove the converse, and see why each direction needs its own argument.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: [
      'State the SSS and SAS congruence conditions.',
      'Explain why all radii of one circle are equal.',
      'Write the converse of a given statement.',
    ],
    ifNotReady: 'Revisit congruence. Both proofs here are congruence proofs with the radii supplying the equal sides.',
  },
  vocabulary: [
    { term: 'subtend', meaning: 'A chord subtends an angle at a point when its two ends are joined to that point.' },
    { term: 'central angle', meaning: 'The angle a chord subtends at the centre.' },
  ],
  explanation: [
    'Join the ends of a chord to the centre and you get an angle there. The question is whether that angle is determined by the chord, or whether a chord of a given length can make different angles in the same circle.',
    'Take two equal chords AB and CD of one circle. Compare triangles AOB and COD. The radii give OA = OC and OB = OD, and the chords themselves give AB = CD. Three pairs of sides, so SSS makes the triangles congruent, and the angles at O match. Equal chords subtend equal angles at the centre.',
    'Now reverse it. Suppose the two central angles are equal; are the chords? This is a different claim and needs a different proof. Here the two radii pairs are still equal, and now the included angle at O is equal too, so SAS gives the congruence, and the chords follow as corresponding sides.',
    'Notice what changed between the two proofs: the same figure, the same triangles, but SSS in one direction and SAS in the other, because what you are given is different. A proof runs from what you have to what you want, and swapping those swaps the tool.',
    'Both statements are true here, which can make them feel like one fact. They are not. Each was proved separately, and that is the only reason both can be used.',
  ],
  representations: [
    'Two equal chords in one circle with the four radii drawn',
    'The two central angles tagged as equal',
  ],
  visuals: [F_CHORDANGLE],
  visualsById: { F_CHORDANGLE },
  workedExamples: [
    {
      id: 's54.we1',
      prompt: 'In a circle with centre O, chords PQ and RS are equal. Prove that angle POQ equals angle ROS.',
      steps: [
        { text: 'Compare triangles POQ and ROS.', reasoning: 'These are the triangles the two chords make with the centre, so they carry both the given and the wanted.' },
        { text: 'OP = OR and OQ = OS, since all are radii of the same circle.', reasoning: 'Equal radii come straight from the circle definition and supply two pairs of sides.' },
        { text: 'PQ = RS is given, giving the third pair.', reasoning: 'With three pairs of sides, SSS applies; no angle is needed as input.' },
        { text: 'So the triangles are congruent, and the angles at O correspond.', reasoning: 'Corresponding parts of congruent triangles are equal, which delivers exactly the claim.' },
      ],
      answer: 'Angle POQ = angle ROS.',
      visualRef: 'F_CHORDANGLE',
    },
    {
      id: 's54.we2',
      prompt: 'In a circle of centre O, angle AOB = angle COD = 70 degrees. Show AB = CD.',
      steps: [
        { text: 'This is the converse direction: the angles are given and the chords are wanted.', reasoning: 'Identifying the direction first is what decides which congruence condition is available.' },
        { text: 'OA = OC and OB = OD as radii, and the included angles at O are equal.', reasoning: 'Two sides and the angle between them is the SAS pattern.' },
        { text: 'SAS gives congruent triangles, so AB = CD as corresponding sides.', reasoning: 'The chords are the sides opposite the equal angles.' },
      ],
      answer: 'AB = CD.',
    },
    {
      id: 's54.we3',
      prompt: 'Two chords of equal length are drawn in two different circles, of radius 5 cm and 8 cm. Do they subtend equal angles at their centres?',
      steps: [
        { text: 'Check whether the proof applies: it compared two triangles sharing the same radii.', reasoning: 'The congruence used OA = OC, which holds only inside one circle or between circles of equal radius.' },
        { text: 'Here the radii differ, so the triangles are not congruent.', reasoning: 'Without the equal radii the SSS argument has only one pair of equal sides.' },
        { text: 'In fact the smaller circle gives the larger angle for the same chord.', reasoning: 'The same chord spans more of a smaller circle, so it opens a wider angle at that centre.' },
      ],
      answer: 'No. The theorem is about chords of the same circle, or circles of equal radius.',
    },
  ],
  misconceptionIds: [],
  guidedPractice: [
    {
      id: 's54.g1',
      prompt: 'Which congruence condition proves that equal chords give equal central angles?',
      hint: 'What are you given — three sides, or two sides and an angle?',
      answer: 'SSS.',
      rationale: 'Two pairs of radii and the pair of equal chords give three pairs of sides, with no angle given.',
    },
    {
      id: 's54.g2',
      prompt: 'Write the converse of "equal chords subtend equal angles at the centre", and say whether it is true.',
      hint: 'Swap what is given with what is concluded.',
      answer: 'Equal angles at the centre give equal chords. True, by SAS.',
      rationale: 'It is true, but only because it was proved separately — the forward proof does not establish it.',
    },
    {
      id: 's54.g3',
      prompt: 'In a circle, chord AB subtends 90 degrees at the centre and chord CD subtends 90 degrees. What can you conclude, and what can you not?',
      hint: 'Which direction applies, and does it say anything about where the chords are?',
      answer: 'AB = CD, but nothing about their positions.',
      rationale: 'The converse gives equal lengths; the chords may sit anywhere in the circle.',
    },
  ],
  independentPractice: [
    {
      id: 's54.i1',
      prompt: 'A chord of a circle equals its radius. What angle does it subtend at the centre?',
      answer: '60 degrees.',
      rationale: 'The triangle formed with two radii has all three sides equal, so it is equilateral.',
    },
    {
      id: 's54.i2',
      prompt: 'Write out the proof of the converse, naming the congruence condition and what supplies each part.',
      answer: 'Radii give two pairs of sides, the given equal angles are included between them, SAS gives congruence, and the chords are corresponding sides.',
      rationale: 'The included angle is what makes SAS available; a non-included angle would not do.',
    },
    {
      id: 's54.i3',
      prompt: 'Two chords in one circle subtend 80 and 100 degrees. Which is longer, and why?',
      answer: 'The one subtending 100 degrees.',
      rationale: 'With the two radii fixed, opening the angle between them separates the endpoints further.',
    },
  ],
  reasoningApplication: [
    {
      id: 's54.r1',
      prompt: 'The two proofs used the same figure but different congruence conditions. Explain what determined which condition was available in each direction, and what that shows about proving a converse.',
      expectedReasoning:
        'What is given determines the tool: three sides given means SSS, two sides and the included angle means SAS. A strong answer draws the general point — a converse starts from different information and so needs its own argument, and the two proofs being this close does not make them one proof.',
    },
  ],
  interactivePractice: [],
  summary:
    'Equal chords of a circle subtend equal angles at the centre, proved by SSS; equal central angles give equal chords, proved separately by SAS. Both hold within one circle, or between circles of equal radius.',
  nextStep: 'Next you will drop a perpendicular from the centre to a chord and see what it does to the chord.',
  teacher: {
    objective: 'Students prove the chord/central-angle relationship in both directions and distinguish the two arguments.',
    prerequisiteKnowledge: ['SSS and SAS congruence', 'Equal radii', 'Converse'],
    modelLanguage: ['What are you given here?', 'Which condition does that information make available?'],
    teachingNotes: [
      'Run both proofs on the same drawn figure so the difference is clearly in the given, not in the picture.',
      'The different-circles example matters: it shows the theorem has a hypothesis, and students who skip it apply the result across circles.',
    ],
    quickChecks: ['SSS or SAS here, and why?', 'Does this hold in two circles of different size?'],
    supportForStrugglingLearners: [
      'Cut out the two triangles and lay one on the other before writing the congruence.',
      'List what is given and what is wanted in two columns before choosing a condition.',
    ],
    extension: ['Ask what happens to the central angle as a chord grows towards the diameter.'],
    materialsNeeded: ['Compasses', 'Ruler', 'Protractor'],
  },
  reviewStatus: 'authored_draft',
};

export const SECTION_5_5: AuthoredSection = {
  contentArtifactId: 'ncert_iemh1_s5_5_lesson',
  contentArtifactVersion: 1,
  source: source('5.5', 'Midpoints and Perpendicular Bisectors of Chords', 9, 'ncert_iemh1_s5_5'),
  competencyCandidates: [],
  competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_iemh1_s5_4'],
    mayAssume: ['Equal radii', 'Congruence conditions', 'Chords and central angles'],
    mustNotIntroduce: [
      { concept: 'Distance of chords from the centre', belongsToSection: 'ncert_iemh1_s5_6' },
      { concept: 'Angles subtended by an arc', belongsToSection: 'ncert_iemh1_s5_7' },
    ],
  },
  learningGoal:
    'You will prove that the line from the centre to the midpoint of a chord is perpendicular to it, prove the converse, and use either to locate a chord precisely.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: [
      'State the SSS and RHS congruence conditions.',
      'Say what an isosceles triangle gives you about its base angles.',
      'Explain what a perpendicular bisector is.',
    ],
    ifNotReady: 'Review isosceles triangles. The two radii to a chord always make one.',
  },
  vocabulary: [
    { term: 'foot of the perpendicular', meaning: 'The point where a perpendicular from a point meets a line.' },
    { term: 'bisect', meaning: 'To cut into two equal parts.' },
  ],
  explanation: [
    'Draw a chord PQ in a circle of centre O and join OP and OQ. Those are radii, so triangle OPQ is isosceles. Everything in this lesson follows from that one observation.',
    'First direction. Let M be the midpoint of PQ and join OM. Triangles OPM and OQM have OP = OQ as radii, PM = MQ since M is the midpoint, and OM shared. SSS gives congruence, so the two angles at M are equal. They also sit on a straight line and so add to 180 degrees, which makes each one 90 degrees. OM is perpendicular to PQ.',
    'Second direction. Suppose instead that OM is perpendicular to PQ, with M on the chord, and ask whether M is the midpoint. Triangles OPM and OQM now have equal radii as hypotenuses, the shared side OM, and right angles at M. That is RHS, which gives congruence and hence PM = MQ. The perpendicular from the centre bisects the chord.',
    'Each direction is a proposition and its converse, and each needed its own congruence condition — SSS one way, RHS the other. Pair them and you get something stronger than either: the line through the centre and the midpoint of a chord is the perpendicular bisector of that chord.',
    'That is why the centre-finding construction from the last lesson works. The perpendicular bisector of any chord passes through the centre, so two chords locate it.',
  ],
  representations: [
    'A chord with the perpendicular from the centre and the two congruent triangles it creates',
    'Right-angle and equal-length marks showing which facts the proof asserts',
  ],
  visuals: [F_PERPENDICULAR],
  visualsById: { F_PERPENDICULAR },
  workedExamples: [
    {
      id: 's55.we1',
      prompt: 'A chord of length 16 cm lies in a circle of radius 10 cm. How far is it from the centre?',
      steps: [
        { text: 'Drop the perpendicular from O to the chord, meeting it at M.', reasoning: 'The perpendicular from the centre bisects the chord, which is what turns an unknown position into a right triangle with known sides.' },
        { text: 'So PM is half of 16, which is 8 cm.', reasoning: 'The bisection result from this lesson supplies the half-length.' },
        { text: 'Triangle OMP is right-angled at M, with hypotenuse OP = 10.', reasoning: 'OP is a radius, and the right angle is what the first direction of the theorem established.' },
        { text: 'OM squared is 100 minus 64, so OM = 6 cm.', reasoning: 'Applying the Baudhayana-Pythagoras relation in the right triangle.' },
      ],
      answer: 'The chord is 6 cm from the centre.',
      visualRef: 'F_PERPENDICULAR',
    },
    {
      id: 's55.we2',
      prompt: 'A chord is 5 cm from the centre of a circle of radius 13 cm. Find its length.',
      steps: [
        { text: 'The distance from the centre is measured along the perpendicular, so the right triangle has legs 5 and half the chord.', reasoning: 'Distance from a point to a line always means the perpendicular distance, which is why this theorem is the one that applies.' },
        { text: 'Half the chord squared is 169 minus 25, which is 144, so half the chord is 12.', reasoning: 'The right triangle has hypotenuse 13 and one leg 5.' },
        { text: 'The chord is twice that.', reasoning: 'The perpendicular bisects it, so the full chord is double the half.' },
      ],
      answer: '24 cm.',
    },
    {
      id: 's55.we3',
      prompt: 'Explain why the first proof needs SSS but the second needs RHS.',
      steps: [
        { text: 'In the first, you are given two radii, the two chord halves and the shared OM — three pairs of sides.', reasoning: 'With three sides and no angle given, SSS is the condition that fits.' },
        { text: 'In the second, you are given the right angles instead of the equal halves.', reasoning: 'The equal halves are now what you want to prove, so they cannot be used as input.' },
        { text: 'Two radii as hypotenuses, the shared leg and the right angles match the RHS pattern.', reasoning: 'RHS is the condition designed for exactly this configuration.' },
      ],
      answer: 'The available information differs, so the condition differs — the same figure, two different proofs.',
    },
  ],
  misconceptionIds: [],
  guidedPractice: [
    {
      id: 's55.g1',
      prompt: 'A line from the centre meets a chord at its midpoint. What angle does it make with the chord?',
      hint: 'Which direction of the theorem starts from the midpoint?',
      answer: '90 degrees.',
      rationale: 'The first direction: centre to midpoint forces the perpendicular, proved by SSS.',
    },
    {
      id: 's55.g2',
      prompt: 'A chord of length 12 cm is 8 cm from the centre. Find the radius.',
      hint: 'Half the chord and the distance are the legs of a right triangle. What is the hypotenuse?',
      answer: '10 cm.',
      rationale: 'Half the chord is 6, the distance is 8, and the radius is the hypotenuse of the 6-8-10 right triangle.',
    },
    {
      id: 's55.g3',
      prompt: 'Why does the perpendicular bisector of any chord pass through the centre?',
      hint: 'The centre is equidistant from the two ends of the chord. Which points have that property?',
      answer: 'Because the centre is equidistant from the chord\u2019s endpoints.',
      rationale: 'The perpendicular bisector is exactly the set of points equidistant from the two ends, and the centre qualifies since both are radii.',
    },
  ],
  independentPractice: [
    {
      id: 's55.i1',
      prompt: 'In a circle of radius 17 cm, how long is a chord 15 cm from the centre?',
      answer: '16 cm.',
      rationale: 'Half the chord is the square root of 289 minus 225, which is 8.',
    },
    {
      id: 's55.i2',
      prompt: 'Two chords of a circle have the same midpoint. What must be true?',
      answer: 'They are the same chord.',
      rationale: 'Each would have the perpendicular from the centre to that point, and only one line through a point is perpendicular to a given direction through it.',
    },
    {
      id: 's55.i3',
      prompt: 'State both directions of this lesson\u2019s theorem and name the congruence condition each uses.',
      answer: 'Centre to midpoint is perpendicular (SSS); perpendicular from centre bisects (RHS).',
      rationale: 'Which condition applies is decided by what is given, not by the figure.',
    },
  ],
  reasoningApplication: [
    {
      id: 's55.r1',
      prompt: 'As a chord moves closer to the centre, what happens to its length and to the right triangle used here? Explain using the relationship, not by drawing several cases.',
      expectedReasoning:
        'The distance leg shrinks while the radius stays fixed, so the half-chord leg must grow, and the chord lengthens. A strong answer reaches the limiting case: distance zero gives a chord through the centre, the diameter, which is the longest possible — and recognises this anticipates the next lesson.',
    },
  ],
  interactivePractice: [],
  summary:
    'The line from the centre to a chord\u2019s midpoint is perpendicular to it (SSS), and the perpendicular from the centre bisects the chord (RHS). Together they make that line the chord\u2019s perpendicular bisector, which is why it passes through the centre.',
  nextStep: 'Next you will compare two chords of different lengths and their distances from the centre.',
  teacher: {
    objective: 'Students prove both directions of the chord-perpendicular relationship and apply them to compute lengths and distances.',
    prerequisiteKnowledge: ['SSS and RHS congruence', 'Isosceles triangles', 'Baudhayana-Pythagoras relation'],
    modelLanguage: ['Which is given here, the midpoint or the right angle?', 'What makes this an isosceles triangle?'],
    teachingNotes: [
      'Start every problem by drawing the perpendicular. Students who skip it have no right triangle and no route to a length.',
      'Naming the two directions explicitly pays off in the computation problems, where one direction supplies the half-chord and the other the right angle.',
    ],
    quickChecks: ['What is given, and which condition does that make available?', 'Where is the right angle in your figure?'],
    supportForStrugglingLearners: [
      'Fold a paper circle so a chord lies along the crease and see the centre fall on the fold.',
      'Label the right triangle\u2019s three parts before computing anything.',
    ],
    extension: ['Ask for the distance from the centre to a chord equal in length to the radius.'],
    materialsNeeded: ['Compasses', 'Ruler', 'Paper circles'],
  },
  reviewStatus: 'authored_draft',
};

export const SECTION_5_6: AuthoredSection = {
  contentArtifactId: 'ncert_iemh1_s5_6_lesson',
  contentArtifactVersion: 1,
  source: source('5.6', 'Distance of Chords from the Centre', 11, 'ncert_iemh1_s5_6'),
  competencyCandidates: [],
  competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_iemh1_s5_5'],
    mayAssume: ['The perpendicular from the centre bisects a chord', 'Baudhayana-Pythagoras relation', 'Equal radii'],
    mustNotIntroduce: [
      { concept: 'Angles subtended by an arc', belongsToSection: 'ncert_iemh1_s5_7' },
      { concept: 'Concyclic points', belongsToSection: 'ncert_iemh1_s5_8' },
    ],
  },
  learningGoal:
    'You will establish that the longer of two chords lies closer to the centre, and that chords equidistant from the centre are equal.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: [
      'Find the distance from the centre to a chord given the radius and chord length.',
      'Say why that distance is measured along the perpendicular.',
      'Use the relationship between the legs and hypotenuse of a right triangle.',
    ],
    ifNotReady: 'Go back to the previous lesson and practise the right-triangle calculation first.',
  },
  vocabulary: [
    { term: 'distance from the centre', meaning: 'The perpendicular distance from the centre to the chord — the shortest route.' },
  ],
  explanation: [
    'Fold a paper circle so a chord lies along the crease, and you can see that a long chord passes near the middle while a short one hugs the edge. That is an observation. Here is why it must be so.',
    'For any chord, the radius, half the chord and the distance from the centre form a right triangle, with the radius as the hypotenuse. The radius is the same for every chord in the circle, so the square of the half-chord and the square of the distance always add to the same total.',
    'That one sentence settles everything. If one chord is longer, its half-chord is longer, so the square of its distance must be smaller, which makes its distance smaller. Longer chords are closer to the centre.',
    'The converse falls out the same way. If two chords are equidistant from the centre, their distance squares are equal, so their half-chord squares are equal, so the chords are equal. The two statements are different claims, but here they come from the same fixed sum, read in opposite directions.',
    'Two limiting cases check the result. A chord through the centre has distance zero and is the diameter, the longest chord. A chord at distance equal to the radius has zero length and has shrunk to a point.',
  ],
  representations: [
    'Two unequal chords in one circle with their perpendicular distances marked',
    'The right triangle each chord makes with the radius and its own half',
  ],
  visuals: [F_TWOCHORDS],
  visualsById: { F_TWOCHORDS },
  workedExamples: [
    {
      id: 's56.we1',
      prompt: 'In a circle of radius 13 cm, one chord is 24 cm and another is 10 cm. Which is nearer the centre, and by how much?',
      steps: [
        { text: 'For the 24 cm chord, half is 12, so the distance squared is 169 minus 144 = 25, giving 5 cm.', reasoning: 'The right triangle has the radius as hypotenuse and the half-chord as one leg.' },
        { text: 'For the 10 cm chord, half is 5, so the distance squared is 169 minus 25 = 144, giving 12 cm.', reasoning: 'Same relationship, different half-chord.' },
        { text: 'Compare 5 and 12.', reasoning: 'The longer chord has the smaller distance, exactly as the general argument predicts.' },
      ],
      answer: 'The 24 cm chord is nearer, by 7 cm.',
      visualRef: 'F_TWOCHORDS',
    },
    {
      id: 's56.we2',
      prompt: 'Two chords of a circle are each 8 cm from the centre. What can you conclude about their lengths?',
      steps: [
        { text: 'Equal distances mean equal distance squares.', reasoning: 'Squaring preserves equality for positive lengths.' },
        { text: 'The half-chord square is the radius square minus the distance square, which is now the same for both.', reasoning: 'The radius is shared, so the subtraction gives the same result in each case.' },
        { text: 'So the half-chords are equal, and the chords are equal.', reasoning: 'Doubling equal halves gives equal wholes.' },
      ],
      answer: 'They are equal in length — the converse direction.',
    },
    {
      id: 's56.we3',
      prompt: 'Why must a chord at distance 0 from the centre be the longest in the circle?',
      steps: [
        { text: 'The half-chord square equals the radius square minus the distance square.', reasoning: 'This is the relation that governs every chord in the circle.' },
        { text: 'Subtracting zero leaves the largest possible value, so the half-chord equals the radius.', reasoning: 'Any positive distance would subtract something and leave a smaller half-chord.' },
        { text: 'The chord is then twice the radius.', reasoning: 'That is the diameter, and no chord can exceed it.' },
      ],
      answer: 'A chord through the centre is the diameter, and it is the longest chord.',
    },
  ],
  misconceptionIds: [],
  guidedPractice: [
    {
      id: 's56.g1',
      prompt: 'Two chords in one circle are 6 cm and 9 cm long. Which is further from the centre?',
      hint: 'Which quantity gets smaller as the chord gets longer?',
      answer: 'The 6 cm chord.',
      rationale: 'The shorter chord has the smaller half-chord, so the larger distance square and the larger distance.',
    },
    {
      id: 's56.g2',
      prompt: 'Does the result compare chords in two different circles?',
      hint: 'Which quantity did the argument hold fixed?',
      answer: 'No — only within one circle, or circles of equal radius.',
      rationale: 'The argument depends on the radius being the same for both chords; a different radius changes the fixed total.',
    },
    {
      id: 's56.g3',
      prompt: 'A chord is at distance equal to the radius. How long is it?',
      hint: 'What does the half-chord square become?',
      answer: 'Zero — it is not really a chord any more.',
      rationale: 'Subtracting the full radius square leaves zero, so the two endpoints coincide.',
    },
  ],
  independentPractice: [
    {
      id: 's56.i1',
      prompt: 'In a circle of radius 25 cm, find the distance from the centre to a chord of length 14 cm.',
      answer: '24 cm.',
      rationale: 'Half the chord is 7, and 625 minus 49 is 576.',
    },
    {
      id: 's56.i2',
      prompt: 'Explain why two equal chords of one circle must be equidistant from the centre.',
      answer: 'Equal chords give equal half-chords, so equal distance squares and equal distances.',
      rationale: 'The fixed radius means the two quantities move together in one direction only.',
    },
    {
      id: 's56.i3',
      prompt: 'A chord is moved steadily towards the centre without leaving the circle. Describe how its length changes.',
      answer: 'It grows continuously, reaching the diameter at distance zero.',
      rationale: 'As the distance falls, the half-chord square rises by the same amount.',
    },
  ],
  reasoningApplication: [
    {
      id: 's56.r1',
      prompt: 'Both results came from one relationship read in opposite directions. Does that make the statement and its converse the same claim? Explain carefully.',
      expectedReasoning:
        'No. They are different claims that happen to follow from the same relation, and each had to be derived. A strong answer notes that sharing a source is not the same as being one statement, and connects this to the chord/angle pair in the previous lesson where the two directions needed different congruence conditions.',
    },
  ],
  interactivePractice: [],
  summary:
    'For every chord of one circle, the half-chord square plus the distance square equals the radius square. Longer chords are therefore nearer the centre, and chords equidistant from the centre are equal.',
  nextStep: 'Next you leave chord lengths behind and look at the angles an arc makes at different points.',
  teacher: {
    objective: 'Students relate chord length to distance from the centre and justify both directions from one relationship.',
    prerequisiteKnowledge: ['Perpendicular from the centre bisects a chord', 'Right-triangle relationship'],
    modelLanguage: ['What stays fixed for every chord here?', 'If this grows, what must shrink?'],
    teachingNotes: [
      'The fixed sum is the whole lesson. Write it once and refer back to it rather than re-deriving each case.',
      'The fold activity is worth doing first, but name it as an observation; the argument is what makes it certain.',
    ],
    quickChecks: ['Longer chord — nearer or further?', 'Why does this fail across two different circles?'],
    supportForStrugglingLearners: [
      'Tabulate chord length against distance for one radius so the trade-off is visible before it is argued.',
      'Draw the right triangle separately from the circle.',
    ],
    extension: ['Ask for the chord length at half the radius distance, and whether the answer scales.'],
    materialsNeeded: ['Compasses', 'Ruler', 'Paper circles'],
  },
  reviewStatus: 'authored_draft',
};

// §5.7 is SPLIT into two lessons. The theorem and its corollaries are one
// demand; deducing the same-segment result from it is another, and the book
// marks the boundary with subsection 5.7.1.

export const SECTION_5_7_CENTRE: AuthoredSection = {
  contentArtifactId: 'ncert_iemh1_s5_7_centre_lesson',
  contentArtifactVersion: 1,
  source: source('5.7', 'Angles Subtended by an Arc', 15, 'ncert_iemh1_s5_7'),
  competencyCandidates: [],
  competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_iemh1_s5_4'],
    mayAssume: ['Isosceles triangles and their base angles', 'Exterior angle of a triangle', 'Equal radii'],
    mustNotIntroduce: [
      { concept: 'Angles in the same segment', belongsToSection: 'ncert_iemh1_s5_7' },
      { concept: 'Concyclic points', belongsToSection: 'ncert_iemh1_s5_8' },
    ],
  },
  learningGoal:
    'You will prove that an arc subtends twice the angle at the centre that it subtends at a point on the rest of the circle, and deduce that a diameter subtends a right angle.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: [
      'State what the base angles of an isosceles triangle have in common.',
      'Use the exterior-angle result for a triangle.',
      'Explain why OA, OB and OP are equal in a circle of centre O.',
    ],
    ifNotReady: 'Review the exterior-angle result. The proof uses it twice and nothing else.',
  },
  vocabulary: [
    { term: 'arc', meaning: 'Part of a circle between two points on it.' },
    { term: 'subtended at a point', meaning: 'The angle formed when the two ends of an arc are joined to that point.' },
    { term: 'corollary', meaning: 'A result that follows immediately from a theorem already proved.' },
  ],
  explanation: [
    'An arc AB can be looked at from the centre, giving angle AOB, or from a point P elsewhere on the circle, giving angle APB. Measure both and the first is twice the second — every time, wherever P sits on the remaining arc. That is worth proving, because "every time" is a claim no amount of measuring can establish.',
    'The construction is a single line: join P to O and continue it to meet the circle again at D. The reason for drawing it is specific — it splits both angles into pieces that sit inside isosceles triangles, where the radii do the work.',
    'Look at triangle OAP. OA and OP are radii, so it is isosceles and the angles at A and P are equal. The angle AOD is exterior to this triangle at O, so it equals the sum of those two equal angles — twice the angle at P. The same argument on triangle OBP gives angle BOD as twice the angle OPB.',
    'Add the two. Angle AOB is AOD plus BOD, which is twice angle APO plus twice angle OPB, which is twice angle APB. The theorem is proved, and the construction was what made the exterior-angle result applicable.',
    'The corollary costs nothing. Let AB be a diameter. Then angle AOB is a straight angle, 180 degrees, so the angle at P is half of it: 90 degrees. Any point on a circle sees a diameter at a right angle — a result used constantly, and already proved the moment the theorem was.',
  ],
  representations: [
    'An arc with its angle at the centre and its angle at a point on the circle',
    'The line through P and O that creates the two isosceles triangles',
  ],
  visuals: [F_CENTREDOUBLE],
  visualsById: { F_CENTREDOUBLE },
  workedExamples: [
    {
      id: 's57a.we1',
      prompt: 'Arc AB subtends 110 degrees at the centre. What angle does it subtend at a point P on the remaining arc?',
      steps: [
        { text: 'The centre angle is twice the angle at P.', reasoning: 'That is the theorem, and it applies for any position of P on the remaining arc.' },
        { text: 'So the angle at P is half of 110.', reasoning: 'Halving the central angle is the direct reading of the relationship.' },
      ],
      answer: '55 degrees.',
      visualRef: 'F_CENTREDOUBLE',
    },
    {
      id: 's57a.we2',
      prompt: 'AB is a diameter of a circle and P is any other point on it. Find angle APB, and say what it depends on.',
      steps: [
        { text: 'AB is a diameter, so A, O and B are in a line and angle AOB is 180 degrees.', reasoning: 'A diameter passes through the centre, which makes the central angle straight.' },
        { text: 'The angle at P is half the central angle.', reasoning: 'Applying the theorem with the central angle now known exactly.' },
        { text: 'So angle APB is 90 degrees, whatever P is.', reasoning: 'Nothing in the calculation used the position of P, so the answer cannot depend on it.' },
      ],
      answer: '90 degrees, for every position of P on the circle.',
    },
    {
      id: 's57a.we3',
      prompt: 'Why is the line from P through O drawn at all? What would go wrong without it?',
      steps: [
        { text: 'Without it, angle APB is one angle in a triangle with no equal sides to exploit.', reasoning: 'Nothing in the undrawn figure is isosceles, so no base-angle fact is available.' },
        { text: 'The line splits angle APB into two parts, each inside a triangle with two radii.', reasoning: 'Two radii make each piece isosceles, which is exactly the configuration the base-angle result needs.' },
        { text: 'It also creates the exterior angles at O that the proof adds together.', reasoning: 'The exterior-angle result is what converts the doubled base angles into the central angle.' },
      ],
      answer: 'It manufactures the two isosceles triangles the proof depends on; without it there is no route from radii to the angle at P.',
    },
  ],
  misconceptionIds: [],
  guidedPractice: [
    {
      id: 's57a.g1',
      prompt: 'An arc subtends 48 degrees at a point on the circle. What does it subtend at the centre?',
      hint: 'Which of the two is the larger, and by what factor?',
      answer: '96 degrees.',
      rationale: 'The central angle is twice the angle at the circle, so the relationship is read in the doubling direction here.',
    },
    {
      id: 's57a.g2',
      prompt: 'P and Q are two different points on the major arc. Does angle APB equal angle AQB?',
      hint: 'Both are half of the same fixed quantity.',
      answer: 'Yes.',
      rationale: 'Each is half the same central angle, so they must be equal — which is the result the next lesson develops.',
    },
    {
      id: 's57a.g3',
      prompt: 'A triangle is inscribed in a circle with one side a diameter. What kind of triangle is it?',
      hint: 'What angle does the diameter subtend at the third vertex?',
      answer: 'Right-angled, at the vertex opposite the diameter.',
      rationale: 'The semicircle corollary gives 90 degrees at that vertex regardless of where it sits.',
    },
  ],
  independentPractice: [
    {
      id: 's57a.i1',
      prompt: 'An arc subtends 2x degrees at the centre and x + 20 degrees at a point on the circle. Find x.',
      answer: 'x = 20.',
      rationale: 'The centre angle is twice the other, so 2x = 2(x + 20) has no solution unless read correctly: x + 20 is half of 2x, giving x = x + 20 minus 20, so x = 20.',
    },
    {
      id: 's57a.i2',
      prompt: 'Write out the proof of the theorem, naming the construction and the two facts it makes available.',
      answer: 'Join P to O and extend to D; two isosceles triangles give equal base angles, and the exterior-angle result converts them into the central angle.',
      rationale: 'The construction is the step that must be stated; the rest follows from radii and exterior angles.',
    },
    {
      id: 's57a.i3',
      prompt: 'Is the semicircle result a separate theorem or a consequence? Justify your answer.',
      answer: 'A consequence — a corollary of the doubling theorem with the central angle at 180 degrees.',
      rationale: 'No new argument is needed; only the special value of the central angle.',
    },
  ],
  reasoningApplication: [
    {
      id: 's57a.r1',
      prompt: 'The theorem says the angle at P does not depend on where P sits on the remaining arc. Explain what in the proof guarantees that, and what would change if P were taken on the arc AB itself.',
      expectedReasoning:
        'The proof computes the angle at P purely from the central angle, so the position of P never enters. Moving P onto arc AB changes which arc is being subtended, and the angle becomes the supplement rather than the half. A strong answer sees that the hypothesis "on the remaining arc" is load-bearing.',
    },
  ],
  interactivePractice: [],
  summary:
    'An arc subtends twice the angle at the centre that it subtends at any point on the remaining arc. The proof joins that point through the centre to create two isosceles triangles and uses the exterior-angle result twice. A diameter therefore subtends a right angle anywhere on the circle.',
  nextStep: 'The theorem has an immediate consequence about two different viewing points, which the next lesson develops.',
  teacher: {
    objective: 'Students prove the central-angle theorem and derive the semicircle corollary.',
    prerequisiteKnowledge: ['Isosceles base angles', 'Exterior angle of a triangle', 'Equal radii'],
    modelLanguage: ['Why is this triangle isosceles?', 'What does the construction make available?'],
    teachingNotes: [
      'Do not present the construction as given. Ask what the figure lacks first, so the line answers a need rather than appearing by magic.',
      'The corollary is free and students often treat it as a separate theorem to memorise. Derive it in front of them in one line.',
    ],
    quickChecks: ['Which angle is doubled, the one at the centre or the one at the circle?', 'Where does the right angle in a semicircle come from?'],
    supportForStrugglingLearners: [
      'Measure both angles for three positions of P before proving anything, so the claim is believed before it is justified.',
      'Shade the two isosceles triangles in different colours.',
    ],
    extension: ['Ask what happens to the angle at P when P is taken on the minor arc instead.'],
    materialsNeeded: ['Compasses', 'Protractor', 'Ruler'],
  },
  reviewStatus: 'authored_draft',
};

export const SECTION_5_7_SEGMENT: AuthoredSection = {
  contentArtifactId: 'ncert_iemh1_s5_7_segment_lesson',
  contentArtifactVersion: 1,
  source: source('5.7', 'Angles Subtended by an Arc', 15, 'ncert_iemh1_s5_7'),
  competencyCandidates: [],
  competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_iemh1_s5_7'],
    mayAssume: ['The central-angle theorem and its semicircle corollary'],
    mustNotIntroduce: [{ concept: 'Concyclic points and cyclic quadrilaterals', belongsToSection: 'ncert_iemh1_s5_8' }],
  },
  learningGoal:
    'You will deduce that angles subtended by one arc at different points of the remaining circle are equal, and use that to find unknown angles.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: [
      'State the relationship between an arc\u2019s angle at the centre and at a point on the circle.',
      'Identify which arc a given angle stands on.',
      'Recall that a diameter subtends a right angle.',
    ],
    ifNotReady: 'Return to the previous lesson. Everything here is deduced from that one theorem.',
  },
  vocabulary: [
    { term: 'segment', meaning: 'The region between a chord and one of the two arcs it cuts off.' },
    { term: 'same segment', meaning: 'Points on the same side of a chord, on the same arc.' },
  ],
  explanation: [
    'The previous lesson proved something about one point P. This lesson notices what it says about two.',
    'Take an arc AB and two points P and Q, both on the remaining arc. Angle APB is half the central angle AOB. Angle AQB is half the same central angle. Two things equal to half the same quantity are equal to each other, so angle APB equals angle AQB.',
    'There is no new construction and no new theorem. The entire argument is that the central angle is one fixed quantity and both angles are half of it — which is why a result that looks quite different from the last one takes two lines to establish.',
    'Say it in the chapter\u2019s language: angles in the same segment are equal. "Same segment" matters. P and Q must be on the same side of AB. A point on the other arc sees AB differently, and the previous lesson\u2019s hypothesis — on the remaining arc — is where that restriction comes from.',
    'This makes unknown angles findable. If a figure gives one angle standing on an arc, every other angle standing on that same arc from the same side is known at once, with no calculation at all.',
  ],
  representations: [
    'One chord with two viewing points on the same arc, their angles tagged equal',
    'The shared central angle both are half of',
  ],
  visuals: [F_SAMESEGMENT],
  visualsById: { F_SAMESEGMENT },
  workedExamples: [
    {
      id: 's57b.we1',
      prompt: 'In a circle, angle APB = 35 degrees where P is on the major arc. Q is another point on the major arc. Find angle AQB.',
      steps: [
        { text: 'P and Q are both on the major arc, so both angles stand on the same arc AB from the same side.', reasoning: 'Checking the same-segment condition first is what licenses the result.' },
        { text: 'Both are half the central angle AOB.', reasoning: 'Each is given by the previous lesson\u2019s theorem applied to the same arc.' },
      ],
      answer: '35 degrees — no calculation needed.',
      visualRef: 'F_SAMESEGMENT',
    },
    {
      id: 's57b.we2',
      prompt: 'Two chords AC and BD of a circle cross at X. Show that triangles AXB and DXC have the same angles.',
      steps: [
        { text: 'Angles BAC and BDC both stand on arc BC from the same side, so they are equal.', reasoning: 'The same-segment result, applied to arc BC.' },
        { text: 'Angles ABD and ACD both stand on arc AD, so they are equal too.', reasoning: 'The same result applied to a different arc in the same figure.' },
        { text: 'The angles at X are vertically opposite and so equal.', reasoning: 'This needs no circle property, only intersecting lines.' },
      ],
      answer: 'All three pairs of angles match.',
    },
    {
      id: 's57b.we3',
      prompt: 'P is on the major arc AB and R is on the minor arc. Is angle APB equal to angle ARB?',
      steps: [
        { text: 'Check the condition: P and R are on opposite sides of AB.', reasoning: 'The same-segment result requires the same side, so it does not apply here.' },
        { text: 'R sees the other arc, so its angle is half the reflex angle at the centre, not half angle AOB.', reasoning: 'The central angle standing on R\u2019s arc is the reflex one, which is 360 degrees minus AOB.' },
        { text: 'The two angles add to 180 degrees instead of being equal.', reasoning: 'Half of AOB plus half of its reflex is half of 360.' },
      ],
      answer: 'No — they are supplementary, not equal. This is the cyclic-quadrilateral result the next lesson proves.',
    },
  ],
  misconceptionIds: [],
  guidedPractice: [
    {
      id: 's57b.g1',
      prompt: 'Angle at P standing on arc AB is 48 degrees. Q is on the same arc as P. What is angle AQB?',
      hint: 'Do you need the central angle at all?',
      answer: '48 degrees.',
      rationale: 'Both are half the same central angle, so they are equal without computing it.',
    },
    {
      id: 's57b.g2',
      prompt: 'Why must P and Q be on the same side of the chord?',
      hint: 'What does a point on the other arc actually stand on?',
      answer: 'A point on the other arc subtends the other arc, giving the supplement instead.',
      rationale: 'The theorem it comes from assumed the point was on the remaining arc, and that hypothesis carries through.',
    },
    {
      id: 's57b.g3',
      prompt: 'Is "angles in the same segment are equal" a new theorem or a consequence?',
      hint: 'How many steps did the argument take, and what did it use?',
      answer: 'A consequence of the central-angle theorem.',
      rationale: 'Both angles are half the same fixed central angle; no new construction or fact was needed.',
    },
  ],
  independentPractice: [
    {
      id: 's57b.i1',
      prompt: 'In a circle, angles ADB and ACB both stand on chord AB with C and D on the same arc. ADB is 62 degrees. Find ACB and the central angle.',
      answer: 'ACB = 62 degrees; the central angle is 124 degrees.',
      rationale: 'Same segment gives the first; doubling gives the second.',
    },
    {
      id: 's57b.i2',
      prompt: 'Explain in two sentences why angles in the same segment are equal.',
      answer: 'Each is half the central angle on the same arc, and two halves of one quantity are equal.',
      rationale: 'The brevity is the point: this is a deduction, not a new proof.',
    },
    {
      id: 's57b.i3',
      prompt: 'A student uses the same-segment result for two points on opposite arcs. What error has been made, and what is true instead?',
      answer: 'The same-side condition was ignored; the two angles are supplementary.',
      rationale: 'A theorem\u2019s hypothesis is part of the theorem, and dropping it changes the conclusion.',
    },
  ],
  reasoningApplication: [
    {
      id: 's57b.r1',
      prompt: 'This lesson added no construction and no new theorem, yet reached a result that looks different from the last one. What does that suggest about how a proved theorem is used, and what would you now expect of a point on the opposite arc?',
      expectedReasoning:
        'A theorem is a tool: once proved, its consequences are often two lines. For the opposite arc, the same reasoning with the reflex central angle gives supplementary angles rather than equal ones. A strong answer predicts the cyclic-quadrilateral result before meeting it.',
    },
  ],
  interactivePractice: [],
  summary:
    'Two points on the same arc see a chord at the same angle, because each angle is half the one central angle. The condition "same segment" comes directly from the hypothesis of the theorem it is deduced from.',
  nextStep: 'Next you will run the idea backwards: given equal angles, when must four points lie on one circle?',
  teacher: {
    objective: 'Students deduce the same-segment result from the central-angle theorem and apply it to find angles.',
    prerequisiteKnowledge: ['Central-angle theorem'],
    modelLanguage: ['Which arc does this angle stand on?', 'Are these two points on the same side?'],
    teachingNotes: [
      'Keep this lesson short and deductive. Its value is showing how cheap a consequence can be once a theorem exists.',
      'The opposite-arc case is the bridge to the next lesson. Let students predict the supplementary result rather than being told it.',
    ],
    quickChecks: ['Same side or opposite?', 'Did we need the central angle\u2019s value?'],
    supportForStrugglingLearners: [
      'Mark the arc each angle stands on with a highlighter before deciding anything.',
      'Use a fixed chord and move a pencil point along the arc, measuring at three positions.',
    ],
    extension: ['Ask for the locus of points from which a given segment subtends a fixed angle.'],
    materialsNeeded: ['Compasses', 'Protractor', 'Highlighter'],
  },
  reviewStatus: 'authored_draft',
};

export const SECTION_5_8: AuthoredSection = {
  contentArtifactId: 'ncert_iemh1_s5_8_lesson',
  contentArtifactVersion: 1,
  source: source('5.8', 'Concyclicity of Points', 20, 'ncert_iemh1_s5_8'),
  competencyCandidates: [],
  competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_iemh1_s5_7'],
    mayAssume: ['Angles in the same segment', 'The central-angle theorem', 'Three non-collinear points fix one circle'],
    mustNotIntroduce: [],
  },
  learningGoal:
    'You will decide when four points lie on one circle, and prove that opposite angles of a cyclic quadrilateral add to 180 degrees.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: [
      'State the same-segment result and its condition.',
      'Explain why three non-collinear points determine exactly one circle.',
      'Write the converse of a statement.',
    ],
    ifNotReady: 'Revisit the same-segment lesson; this one is largely its converse at work.',
  },
  vocabulary: [
    { term: 'concyclic', meaning: 'Lying on one common circle.' },
    { term: 'cyclic quadrilateral', meaning: 'A quadrilateral whose four vertices are concyclic.' },
  ],
  explanation: [
    'Three points that are not in a line always lie on a circle. A fourth is a genuine question: the circle is already fixed, so the fourth point either happens to be on it or does not. Concyclicity is a condition to be checked, not something four points enjoy by default.',
    'The same-segment result gives the test, read backwards. If P and Q are on the same side of AB and angle APB equals angle AQB, then the four points A, B, P and Q are concyclic. Like every converse this needs its own argument: draw the circle through A, B and P, and suppose Q were not on it. Then Q is inside or outside, and in either case the angle it makes with AB is larger or smaller than the one a point on the circle would make. Equal angles leave no room for either, so Q is on the circle.',
    'Now the quadrilateral. Take ABCD with all four vertices on a circle. Angle A stands on arc BCD and angle C stands on arc BAD, and those two arcs together make the whole circle. The central angles therefore add to 360 degrees, and each vertex angle is half its central angle, so the two vertex angles add to 180.',
    'Opposite angles of a cyclic quadrilateral are supplementary. The other pair follows the same way, or from the four angles of a quadrilateral summing to 360.',
    'The converse is true as well — a quadrilateral whose opposite angles are supplementary is cyclic — and it is a separate statement needing a separate proof, argued the same way as the concyclicity test above.',
  ],
  representations: [
    'Four points on one circle with the two opposite angles marked',
    'The two arcs those angles stand on, which together make the whole circle',
  ],
  visuals: [F_CYCLIC],
  visualsById: { F_CYCLIC },
  workedExamples: [
    {
      id: 's58.we1',
      prompt: 'In cyclic quadrilateral ABCD, angle A = 85 degrees. Find angle C.',
      steps: [
        { text: 'A and C are opposite vertices of a cyclic quadrilateral.', reasoning: 'The supplementary result applies to opposite angles only, so identifying the pair comes first.' },
        { text: 'They are supplementary, so angle C is 180 minus 85.', reasoning: 'Their arcs together make the whole circle, so their central angles sum to 360 and the halves to 180.' },
      ],
      answer: '95 degrees.',
      visualRef: 'F_CYCLIC',
    },
    {
      id: 's58.we2',
      prompt: 'P and Q are on the same side of AB, with angle APB = angle AQB = 40 degrees. Are A, B, P, Q concyclic?',
      steps: [
        { text: 'Check the same-side condition: it holds.', reasoning: 'The test requires it, exactly as the same-segment result did.' },
        { text: 'Draw the circle through A, B and P — it exists and is unique.', reasoning: 'A, B, P are not collinear, so the earlier uniqueness result applies.' },
        { text: 'A point off that circle would see AB at a different angle, so equality forces Q onto it.', reasoning: 'Inside gives a larger angle and outside a smaller one, leaving equality only on the circle.' },
      ],
      answer: 'Yes, the four points are concyclic.',
    },
    {
      id: 's58.we3',
      prompt: 'A quadrilateral has angles 70, 110, 110 and 70 degrees in order. Can it be cyclic?',
      steps: [
        { text: 'Identify the opposite pairs: 70 with 110, and 110 with 70.', reasoning: 'Opposite means across the quadrilateral, not adjacent — taking the wrong pairing is the common slip here.' },
        { text: 'Each pair sums to 180.', reasoning: 'That is the condition the converse requires.' },
        { text: 'So by the converse it is cyclic.', reasoning: 'The converse is a separate proved statement, which is what licenses concluding the circle exists.' },
      ],
      answer: 'Yes — both pairs of opposite angles are supplementary.',
    },
  ],
  misconceptionIds: [],
  guidedPractice: [
    {
      id: 's58.g1',
      prompt: 'In a cyclic quadrilateral, one angle is 90 degrees. What is the opposite angle?',
      hint: 'Which pair is forced to be supplementary?',
      answer: '90 degrees.',
      rationale: 'Opposite angles sum to 180, so the opposite of a right angle is another right angle.',
    },
    {
      id: 's58.g2',
      prompt: 'Four points are given with no three in a line. Must they be concyclic?',
      hint: 'How many of them already fix the circle?',
      answer: 'No.',
      rationale: 'Three of them fix the circle completely, leaving the fourth either on it or not; concyclicity is a condition, not a guarantee.',
    },
    {
      id: 's58.g3',
      prompt: 'Why does the concyclicity test require P and Q on the same side of AB?',
      hint: 'What does a point on the other side see?',
      answer: 'Because a point on the other arc sees AB at the supplementary angle, not the equal one.',
      rationale: 'The test is the converse of the same-segment result and carries its hypothesis with it.',
    },
  ],
  independentPractice: [
    {
      id: 's58.i1',
      prompt: 'In cyclic quadrilateral PQRS, angle P = 115 degrees and angle Q = 78 degrees. Find angles R and S.',
      answer: 'R = 65 degrees, S = 102 degrees.',
      rationale: 'Each is the supplement of its opposite angle.',
    },
    {
      id: 's58.i2',
      prompt: 'Explain why a rectangle is always cyclic but a general parallelogram is not.',
      answer: 'A rectangle\u2019s opposite angles are both 90 and sum to 180; a general parallelogram\u2019s opposite angles are equal but not supplementary unless they are right angles.',
      rationale: 'Equal is not supplementary except in the right-angled case, so the converse condition fails in general.',
    },
    {
      id: 's58.i3',
      prompt: 'State the concyclicity test and the result about opposite angles, and say which is a converse of what.',
      answer: 'Equal angles on the same side imply concyclic (converse of same-segment); cyclic implies supplementary opposite angles, whose own converse is also true.',
      rationale: 'Keeping track of which direction is proved is what makes these usable rather than a cluster of similar facts.',
    },
  ],
  reasoningApplication: [
    {
      id: 's58.r1',
      prompt: 'Both results in this lesson are converses of earlier ones. Explain why the chapter could not have proved the concyclicity test before proving the same-segment result, and what that says about the order of a chapter.',
      expectedReasoning:
        'The test is the same-segment statement run backwards, and its proof uses the forward result to compare a point off the circle with one on it. A strong answer sees the order is mathematical rather than editorial: each converse needs its forward statement already established.',
    },
  ],
  interactivePractice: [],
  summary:
    'Equal angles subtended on the same side of a segment put four points on one circle, and the opposite angles of a cyclic quadrilateral are supplementary. Both are converses of earlier results and both were proved in their own right.',
  nextStep:
    'You have built the chapter from one definition: equal distance from a centre, through symmetry, chords, arcs and now four points at once.',
  teacher: {
    objective: 'Students apply the concyclicity test and prove the cyclic-quadrilateral angle result.',
    prerequisiteKnowledge: ['Same-segment result', 'Central-angle theorem', 'Uniqueness of the circle through three points'],
    modelLanguage: ['Which three points fix the circle here?', 'Which arcs do these two angles stand on?'],
    teachingNotes: [
      'Stress that the fourth point is a real condition. Students who assume four points are always concyclic lose the whole content of the lesson.',
      'The two arcs making the whole circle is the step worth drawing. Without it the supplementary result looks like a fact to memorise.',
      'Track the converses explicitly; by this point the chapter has four statement-converse pairs and they blur if left unnamed.',
    ],
    quickChecks: ['Opposite or adjacent angles?', 'Which earlier result is this the converse of?'],
    supportForStrugglingLearners: [
      'Draw the circle through three points first, then test the fourth by eye before arguing.',
      'Colour the two arcs that the opposite angles stand on.',
    ],
    extension: ['Ask which familiar quadrilaterals are always cyclic and which never are.'],
    materialsNeeded: ['Compasses', 'Protractor', 'Coloured pencils'],
  },
  reviewStatus: 'authored_draft',
};

/** The second pilot chapter, in the book's order. Eight lessons from eight
 *  sections: one merged, one split, six one-to-one. */
export function circlesChapterSections(): AuthoredSection[] {
  return [
    SECTION_5_1_2,
    SECTION_5_3,
    SECTION_5_4,
    SECTION_5_5,
    SECTION_5_6,
    SECTION_5_7_CENTRE,
    SECTION_5_7_SEGMENT,
    SECTION_5_8,
  ];
}
