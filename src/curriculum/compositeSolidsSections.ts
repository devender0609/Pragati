// ===========================================================================
// v0.84.0-c10.2 checkpoint 56 — CLASS 10 SECOND AUTHORING PILOT:
// COMBINATIONS OF SOLIDS.
//
// The trigonometry pilot asked whether a side's role could be modelled
// relative to an angle. This one asks a harder question: can the model know
// which surfaces stop being on the outside?
//
// Every figure here is a CompositeSolidSpec, so the exposed-surface list in
// the prose is read from the same object the figure draws. The lesson cannot
// claim a face is counted while the model has it internal.
//
// Source: NCERT Mathematics, Textbook for Class X (Reprint 2026-27), §12.2
// (p162) and §12.3 (p168). CBSE 041/241 2026-27 limits this to combinations
// of ANY TWO standard solids; the validator enforces that, and no frustum
// appears because the current source contains none.
// ===========================================================================

import type { AuthoredSection } from './authoredSection';
import type { CompositeSolidSpec } from './compositeSolidSpecification';

export const COMPOSITE_SOLIDS_CHAPTER_ID = 'ncert_jemh1_ch12';

const BOOK = 'Mathematics, Textbook for Class X (Reprint 2026-27)';
const SRC = 'https://ncert.nic.in/textbook/pdf/jemh1dd.zip';
const INSPECTED = '2026-10-16';

const source = (
  sectionNumber: string,
  exactTitle: string,
  startPage: number,
  officialSectionId: string
) => ({
  officialChapterId: COMPOSITE_SOLIDS_CHAPTER_ID,
  officialSectionId,
  sectionNumber,
  exactTitle,
  startPage,
  textbook: BOOK,
  sourceReference: SRC,
  inspectionDate: INSPECTED,
});

// --- figures ---------------------------------------------------------------
// Dimensions are chosen so that the joined faces match exactly. The validator
// rejects a join whose two circles differ, so a figure cannot assert an
// impossible object.

/** Hemisphere on a cylinder — the canonical lost-circle case. */
const F_CYL_HEMI: CompositeSolidSpec = {
  type: 'composite_solid',
  purpose: 'show_definition',
  status: 'concept_specific',
  crossSection: 'vertical',
  components: [
    { id: 'cyl', kind: 'cylinder', label: 'cylinder', dimensions: { radius: 7, height: 10 } },
    { id: 'hem', kind: 'hemisphere', label: 'hemisphere', dimensions: { radius: 7 } },
  ],
  joins: [
    {
      a: { component: 'cyl', surface: 'base_upper' },
      b: { component: 'hem', surface: 'base' },
      note: 'The hemisphere sits exactly on the open top of the cylinder.',
    },
  ],
  caption: 'A hemisphere resting on a cylinder of the same radius.',
  altText:
    'A vertical cross-section of a cylinder of radius 7 units and height 10 units with a hemisphere of radius 7 units sitting on its upper end. Where they meet, the cylinder\u2019s upper circular face and the hemisphere\u2019s flat circular face touch each other, so both are inside the finished solid and neither is on the outside. The surfaces remaining on the outside are the cylinder\u2019s curved surface, the cylinder\u2019s lower circular face and the hemisphere\u2019s curved surface.',
};

/** Cone on a cylinder — a second join type, and the slant-height trap. */
const F_CYL_CONE: CompositeSolidSpec = {
  type: 'composite_solid',
  purpose: 'support_reasoning',
  status: 'concept_specific',
  crossSection: 'vertical',
  components: [
    { id: 'cyl', kind: 'cylinder', label: 'cylinder', dimensions: { radius: 3, height: 8 } },
    { id: 'con', kind: 'cone', label: 'cone', dimensions: { radius: 3, height: 4, slantHeight: 5 } },
  ],
  joins: [
    {
      a: { component: 'cyl', surface: 'base_upper' },
      b: { component: 'con', surface: 'base' },
      note: 'The cone stands on the cylinder, base to base.',
    },
  ],
  caption: 'A cone standing on a cylinder of the same radius.',
  altText:
    'A vertical cross-section of a cylinder of radius 3 units and height 8 units with a cone of radius 3 units and height 4 units standing on its upper end. The cone\u2019s slant height is 5 units, which follows from its radius and height. The cylinder\u2019s upper circular face and the cone\u2019s circular base meet, so both are internal. On the outside are the cylinder\u2019s curved surface, the cylinder\u2019s lower circular face and the cone\u2019s curved surface.',
};

/** Hemispherical scoop on a cone — for volume, where surfaces do not matter. */
const F_CONE_HEMI: CompositeSolidSpec = {
  type: 'composite_solid',
  purpose: 'show_construction',
  status: 'concept_specific',
  crossSection: 'vertical',
  components: [
    { id: 'con', kind: 'cone', label: 'cone', dimensions: { radius: 6, height: 8, slantHeight: 10 } },
    { id: 'hem', kind: 'hemisphere', label: 'hemisphere', dimensions: { radius: 6 } },
  ],
  joins: [
    {
      a: { component: 'con', surface: 'base' },
      b: { component: 'hem', surface: 'base' },
      note: 'The hemisphere closes the open base of the cone.',
    },
  ],
  caption: 'A cone closed by a hemisphere of the same radius.',
  altText:
    'A vertical cross-section of a cone of radius 6 units and height 8 units, with slant height 10 units, joined to a hemisphere of radius 6 units at its base. The cone\u2019s circular base and the hemisphere\u2019s flat face meet and are both internal. On the outside are the cone\u2019s curved surface and the hemisphere\u2019s curved surface. For volume the two parts simply add, because neither occupies any of the other\u2019s space.',
};

export const C10_SECTION_12_2A: AuthoredSection = {
  contentArtifactId: 'ncert_jemh1_s12_2_exposed_lesson',
  contentArtifactVersion: 1,
  source: source('12.2', 'Surface Area of a Combination of Solids', 162, 'ncert_jemh1_s12_2'),
  competencyCandidates: [],
  competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: [],
    mayAssume: ['Surface areas of the cuboid, cylinder, cone, sphere and hemisphere', 'Which surfaces each of those solids has'],
    mustNotIntroduce: [{ concept: 'Volume of a combination', belongsToSection: 'ncert_jemh1_s12_3' }],
  },
  learningGoal:
    'You will decide, for two solids joined at a face, which surfaces stay on the outside of the finished object and which become internal.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: [
      'List the surfaces a cylinder has.',
      'State the curved surface area of a hemisphere.',
      'Say which face of a cone is flat.',
    ],
    ifNotReady: 'Revise the surfaces of the standard solids from Class IX. This lesson is about which of them survive a join.',
  },
  vocabulary: [
    { term: 'component solid', meaning: 'One of the standard solids an object is built from.' },
    { term: 'join', meaning: 'The place where two component solids meet, face to face.' },
    { term: 'internal surface', meaning: 'A surface that still exists in the geometry but is no longer on the outside, because another solid is pressed against it.' },
    { term: 'exposed surface', meaning: 'A surface that is on the outside of the finished object and therefore counts towards its surface area.' },
    { term: 'curved surface', meaning: 'The non-flat surface of a cylinder, cone, hemisphere or sphere.' },
  ],
  explanation: [
    'Many everyday objects are two standard solids stuck together: a capsule is a cylinder with a hemisphere at each end, a circus tent is a cylinder with a cone on top, an ice-cream cone with a scoop is a cone with a hemisphere. Before calculating anything about such an object, there is a question of shape to settle.',
    'Take a hemisphere set on top of a cylinder of the same radius. Ask what you would have to paint. The cylinder\u2019s curved surface, certainly. Its bottom circle, if it is standing free. The hemisphere\u2019s curved dome, certainly.',
    'But what about the cylinder\u2019s top circle? It is still there as geometry \u2014 the cylinder has not lost a face by being touched. It is simply pressed against the flat face of the hemisphere, so no paint can reach it. The same is true of the hemisphere\u2019s own flat face.',
    'So two circles have gone internal. They exist, and they do not count. That is the whole idea of this lesson, and it is the one thing a picture will not tell you, because an internal surface is by definition the surface you cannot see.',
    'This is why adding the two total surface areas is wrong. The cylinder\u2019s total includes its top circle; the hemisphere\u2019s total includes its flat face. Adding the totals counts both of the circles that no longer face outwards. The answer is too large by exactly two circles, which for radius r is 2\u03c0r\u00b2.',
    'The reliable procedure is not a formula but a sequence of questions. What solids is this made of? Where are they joined? Which surfaces does that join hide? Which surfaces are left on the outside? Only then: what is the area of each of those?',
    'One more condition is easy to miss. A join only works if the two faces fit: a circular face of radius 3 cannot meet one of radius 4, because the object would have a step rather than a join. When a problem says a hemisphere sits on a cylinder, it is telling you the radii are equal, and that fact is usually needed later.',
  ],
  representations: ['A cross-section of two joined solids with every surface named as exposed or internal'],
  visuals: [F_CYL_HEMI, F_CYL_CONE],
  visualsById: { F_CYL_HEMI, F_CYL_CONE },
  workedExamples: [
    {
      id: 's122a.we1',
      prompt: 'A hemisphere sits on top of a cylinder of the same radius. List every surface of the finished object and say which ones are on the outside.',
      steps: [
        { text: 'The cylinder has three surfaces: its curved surface, its lower circular face and its upper circular face.', reasoning: 'Listing the components surface by surface is what makes the next step a decision rather than a guess.' },
        { text: 'The hemisphere has two: its curved surface and its flat circular face.', reasoning: 'A hemisphere is half a sphere plus the flat disc that closes it, so it has exactly these two.' },
        { text: 'The join presses the cylinder\u2019s upper face against the hemisphere\u2019s flat face, so both are internal.', reasoning: 'Two surfaces meet at any join, one from each solid, and both stop being on the outside.' },
        { text: 'Exposed: the cylinder\u2019s curved surface, the cylinder\u2019s lower face and the hemisphere\u2019s curved surface.', reasoning: 'Five surfaces in total, two internal, so three remain \u2014 and the count is what a later area calculation will be built from.' },
      ],
      answer: 'Five surfaces in all; three are exposed and two are internal.',
      visualRef: 'F_CYL_HEMI',
    },
    {
      id: 's122a.we2',
      prompt: 'A cone stands on a cylinder of the same radius. Which surfaces are internal, and does the cone\u2019s slant height matter for deciding that?',
      steps: [
        { text: 'The cone has a curved surface and a circular base; the cylinder has a curved surface and two circular faces.', reasoning: 'The inventory comes first again, because the decision about which faces vanish can only be made once every face has been named.' },
        { text: 'The cone\u2019s base meets the cylinder\u2019s upper face, so those two are internal.', reasoning: 'The cone stands base-down on the cylinder, so those are the two faces in contact.' },
        { text: 'Exposed: the cone\u2019s curved surface, the cylinder\u2019s curved surface and the cylinder\u2019s lower face.', reasoning: 'Everything not hidden by the join is on the outside.' },
        { text: 'The slant height does not affect which surfaces are internal.', reasoning: 'Which surfaces touch is a question about the join; the slant height is a measurement needed later to find the area of the cone\u2019s curved surface, not to decide whether it is exposed.' },
      ],
      answer: 'The cone\u2019s base and the cylinder\u2019s upper face are internal; the slant height matters for area, not for exposure.',
      visualRef: 'F_CYL_CONE',
    },
    {
      id: 's122a.we3',
      prompt: 'A solid is described as a hemisphere of radius 4 cm joined to a cylinder of radius 5 cm. What is wrong with the description?',
      steps: [
        { text: 'A join needs the two faces to coincide.', reasoning: 'If one face is larger than the other, part of it remains exposed and the object is not the smooth join described.' },
        { text: 'A circle of radius 4 cm cannot coincide with a circle of radius 5 cm.', reasoning: 'Their areas and their boundaries differ, so one cannot be pressed flat against the other.' },
        { text: 'The object would have a visible rim of the larger circle around the smaller solid.', reasoning: 'Naming what you would actually see is the quickest way to show the description is not of a simple join.' },
      ],
      answer: 'The radii must be equal for this to be a join; as described, a ring of the cylinder\u2019s face would remain exposed.',
    },
  ],
  guidedPractice: [
    {
      id: 's122a.g1',
      prompt: 'A sphere is placed loosely inside an open box, touching the bottom. Is the sphere\u2019s surface internal where it touches?',
      hint: 'How much of the sphere is actually pressed against the box?',
      answer: 'No \u2014 the contact is a single point, not a surface, so nothing is hidden.',
      rationale: 'A join hides a surface only when two faces coincide over an area. Touching at a point removes no area from the exterior.',
    },
    {
      id: 's122a.g2',
      prompt: 'Two students add the total surface area of a cylinder and the total surface area of a hemisphere joined to it. By how much is their answer wrong, in terms of the shared radius r?',
      hint: 'How many circles did they count that are not on the outside?',
      answer: 'Too large by 2\u03c0r\u00b2.',
      rationale: 'Each total includes one of the two joined circles, each of area \u03c0r\u00b2. Both are internal, so the sum over-counts by 2\u03c0r\u00b2.',
    },
    {
      id: 's122a.g3',
      prompt: 'A cone is joined to a hemisphere at its base, and the whole object rests on the dome. Which surfaces are exposed?',
      hint: 'List all four surfaces first, then remove the pair at the join.',
      answer: 'The cone\u2019s curved surface and the hemisphere\u2019s curved surface.',
      rationale: 'The cone\u2019s base and the hemisphere\u2019s flat face are the joined pair and are internal. Resting on the dome does not hide any surface, since the contact is a point.',
    },
  ],
  independentPractice: [
    {
      id: 's122a.i1',
      prompt: 'A cylinder has a hemisphere hollowed out of neither end but simply has a hemisphere attached at each end, all of the same radius. How many surfaces are internal?',
      answer: 'Four.',
      rationale: 'Each join hides two surfaces \u2014 one circle from the cylinder and the flat face of that hemisphere \u2014 and there are two joins, giving four internal surfaces.',
    },
    {
      id: 's122a.i2',
      prompt: 'Explain why the exposed surface area of two joined solids is always less than the sum of their total surface areas.',
      answer: 'Because a join always hides two faces that both totals include.',
      rationale: 'The two totals each count the face that solid contributes to the join, and neither face is on the outside. The deficit is twice the area of the joining face.',
    },
    {
      id: 's122a.i3',
      prompt: 'A toy is a cone on a cylinder. Which single measurement would you need that you would not need for the cylinder alone, in order to find the exposed area?',
      answer: 'The slant height of the cone.',
      rationale: 'The cone\u2019s curved surface is exposed and its area is \u03c0rl, which needs the slant height. The vertical height of the cone would not give that area directly.',
    },
    {
      id: 's122a.i4',
      prompt: 'An object is described as a hemisphere joined to a cube. What must be true for this to be a simple face-to-face join, and why is it awkward?',
      answer: 'A flat circular face cannot coincide with a square face, so there is no face-to-face join of the kind described.',
      rationale: 'A join needs the two faces to have the same shape and size. A circle and a square never do, so part of the square would remain exposed around the circle.',
    },
  ],
  misconceptionIds: [],
  interactivePractice: [],
  reasoningApplication: [
    {
      id: 's122a.td1',
      prompt: 'Why can we not simply add the total surface areas of the two solids? Answer by saying exactly which surfaces the sum counts that it should not.',
      expectedReasoning:
        'Each solid\u2019s total surface area includes the face it brings to the join. The cylinder\u2019s total includes its upper circle and the hemisphere\u2019s total includes its flat face, but after joining neither is on the outside. The sum therefore counts two circles too many, and exceeds the true exposed area by 2\u03c0r\u00b2. The error is not in any formula; it is in applying the formulas before deciding which surfaces are exposed.',
    },
    {
      id: 's122a.td2',
      prompt: 'Two students compute the exposed area of the same cylinder-and-hemisphere toy and their answers differ by exactly \u03c0r\u00b2. What did one of them most likely do?',
      expectedReasoning:
        'A difference of one circle, rather than two, suggests one student removed only one of the joined faces \u2014 subtracting the cylinder\u2019s top circle, say, while still counting the hemisphere\u2019s flat face, or the reverse. A join always hides a pair of surfaces, one from each solid, so removing a single one is a half-done correction rather than a different reading of the object.',
    },
  ],
  summary:
    'When two solids are joined face to face, the pair of surfaces in contact stays in the geometry but leaves the exterior. Work by inventory: list every surface of both solids, strike out the two at the join, and the rest are exposed. Adding the two total surface areas is wrong because it counts both struck-out faces, exceeding the true area by twice the joining face.',
  nextStep: 'Next you will put numbers to that exposed list and find the surface area of a combination.',
  teacher: {
    objective: 'Students decide which surfaces of two joined solids are exposed and which are internal, before any area is computed.',
    prerequisiteKnowledge: ['Surfaces of the standard solids', 'Curved surface area formulas from Class IX'],
    modelLanguage: [
      'What would you have to paint?',
      'The face is still there \u2014 it is just not on the outside.',
      'A join hides two surfaces, one from each solid.',
    ],
    teachingNotes: [
      'Keep every number out of this lesson. The moment a formula appears, students compute instead of deciding, and the decision is the thing being taught.',
      'The painting question does more work than any diagram: a surface you cannot reach with a brush is exactly a surface that does not count.',
      'Watch for one-sided corrections \u2014 removing the cylinder\u2019s top circle but keeping the hemisphere\u2019s flat face. The pair is the point.',
    ],
    quickChecks: [
      'Ask how many surfaces a join hides, and why it is two rather than one.',
      'Ask whether a sphere resting on a table hides any surface.',
    ],
    supportForStrugglingLearners: [
      'Hold two objects together and ask what has become unreachable; the physical answer is the mathematical one.',
    ],
    extension: ['Ask what happens to the exposed area if the two radii at a join are made unequal.'],
    materialsNeeded: ['Any cylinder and ball that can be held together'],
  },
  reviewStatus: 'authored_draft',
};

export const C10_SECTION_12_2B: AuthoredSection = {
  contentArtifactId: 'ncert_jemh1_s12_2_area_lesson',
  contentArtifactVersion: 1,
  source: source('12.2', 'Surface Area of a Combination of Solids', 162, 'ncert_jemh1_s12_2'),
  competencyCandidates: [],
  competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_jemh1_s12_2'],
    mayAssume: ['Which surfaces of a join are exposed', 'Curved surface area formulas', 'That the slant height of a cone satisfies l squared = r squared + h squared'],
    mustNotIntroduce: [{ concept: 'Volume of a combination', belongsToSection: 'ncert_jemh1_s12_3' }],
  },
  learningGoal:
    'You will compute the surface area of a solid formed by joining any two standard solids, counting only the surfaces that remain exposed.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: [
      'Decide which surfaces of a join are internal.',
      'State the curved surface area of a cylinder, a cone and a hemisphere.',
      'Find a slant height from a radius and a height.',
    ],
    ifNotReady: 'Go back to the previous lesson. Computing before deciding which surfaces count is the error this lesson is built to avoid.',
  },
  vocabulary: [
    { term: 'exposed surface area', meaning: 'The total area of the surfaces on the outside of a combined solid.' },
    { term: 'slant height', meaning: 'The distance from the apex of a cone to a point on the edge of its base, written l. It is longer than the vertical height.' },
    { term: 'curved surface area', meaning: 'The area of the non-flat surface of a cylinder, cone, hemisphere or sphere.' },
  ],
  explanation: [
    'With the decision made, the arithmetic is ordinary. The exposed surface area is the sum of the areas of the exposed surfaces \u2014 no new formula, and no composite formula to memorise.',
    'Take the cylinder with a hemisphere on top, both of radius r, the cylinder of height h. The exposed list from the last lesson was: the cylinder\u2019s curved surface, the cylinder\u2019s lower circle, and the hemisphere\u2019s dome. So the exposed area is 2\u03c0rh + \u03c0r\u00b2 + 2\u03c0r\u00b2, which tidies to 2\u03c0rh + 3\u03c0r\u00b2.',
    'Notice what that is not. It is not the cylinder\u2019s total surface area plus the hemisphere\u2019s total surface area, which would be (2\u03c0rh + 2\u03c0r\u00b2) + 3\u03c0r\u00b2 = 2\u03c0rh + 5\u03c0r\u00b2. The difference of 2\u03c0r\u00b2 is the two circles at the join, exactly as expected.',
    'For a cone on a cylinder the list is the cone\u2019s curved surface, the cylinder\u2019s curved surface and the cylinder\u2019s lower circle, giving \u03c0rl + 2\u03c0rh + \u03c0r\u00b2. Here the slant height l appears, and it is not the cone\u2019s height. If the cone has radius r and height h\u2081, then l is the square root of r\u00b2 + h\u2081\u00b2, by the Pythagoras relation in the triangle formed by the axis, the radius and the slant.',
    'Using h where l belongs is a different error from the join error, and it survives all the care about exposure. Both have to be avoided, and they are avoided in different places: exposure when listing, slant height when substituting.',
    'About \u03c0: when a problem gives dimensions that are multiples of 7 it usually intends \u03c0 as 22/7, and the answer comes out exact. Otherwise leave \u03c0 in the answer rather than replacing it with 3.14, so nothing is lost to rounding before the end.',
  ],
  representations: ['A cross-section with each exposed surface and its formula listed'],
  visuals: [F_CYL_HEMI, F_CYL_CONE],
  visualsById: { F_CYL_HEMI, F_CYL_CONE },
  workedExamples: [
    {
      id: 's122b.we1',
      prompt: 'A cylinder of radius 7 cm and height 10 cm has a hemisphere of the same radius on its upper end. Find the exposed surface area, taking \u03c0 as 22/7.',
      steps: [
        { text: 'Exposed: the cylinder\u2019s curved surface, the cylinder\u2019s lower circle, and the hemisphere\u2019s dome.', reasoning: 'The join hides the cylinder\u2019s upper circle and the hemisphere\u2019s flat face, so neither is counted.' },
        { text: 'Cylinder curved surface = 2\u03c0rh = 2 \u00d7 22/7 \u00d7 7 \u00d7 10 = 440 cm\u00b2.', reasoning: 'The 7 cancels against the denominator, which is why this choice of \u03c0 gives an exact answer.' },
        { text: 'Cylinder lower circle = \u03c0r\u00b2 = 22/7 \u00d7 49 = 154 cm\u00b2.', reasoning: 'One circle only, because the cylinder\u2019s upper face is pressed against the hemisphere and no longer faces outwards.' },
        { text: 'Hemisphere dome = 2\u03c0r\u00b2 = 2 \u00d7 154 = 308 cm\u00b2.', reasoning: 'The curved surface of a hemisphere is twice the area of its own flat face.' },
        { text: 'Total = 440 + 154 + 308 = 902 cm\u00b2.', reasoning: 'Adding only the exposed contributions, which is the whole method.' },
      ],
      answer: '902 cm\u00b2.',
      visualRef: 'F_CYL_HEMI',
    },
    {
      id: 's122b.we2',
      prompt: 'For the same object, what would adding the two total surface areas have given, and why is it wrong?',
      steps: [
        { text: 'Cylinder total = 2\u03c0rh + 2\u03c0r\u00b2 = 440 + 308 = 748 cm\u00b2.', reasoning: 'A free-standing cylinder has both circles on the outside.' },
        { text: 'Hemisphere total = 3\u03c0r\u00b2 = 462 cm\u00b2.', reasoning: 'Dome 308 plus flat face 154, which is what a hemisphere lying alone would present.' },
        { text: 'Sum = 748 + 462 = 1210 cm\u00b2, which exceeds 902 by 308 cm\u00b2.', reasoning: 'Comparing the two answers makes the size of the error concrete rather than abstract.' },
        { text: '308 = 2\u03c0r\u00b2, the two circles at the join.', reasoning: 'The excess is exactly the pair of faces that stopped being on the outside, confirming where the error comes from.' },
      ],
      answer: '1210 cm\u00b2, too large by 308 cm\u00b2 \u2014 the two joined circles.',
      visualRef: 'F_CYL_HEMI',
    },
    {
      id: 's122b.we3',
      prompt: 'A cone of radius 3 cm and height 4 cm stands on a cylinder of radius 3 cm and height 8 cm. Find the exposed surface area in terms of \u03c0.',
      steps: [
        { text: 'Find the slant height: l = \u221a(3\u00b2 + 4\u00b2) = \u221a25 = 5 cm.', reasoning: 'The curved surface of a cone needs l, not its height, and l comes from the Pythagoras relation on the radius and height.' },
        { text: 'Exposed: the cone\u2019s curved surface, the cylinder\u2019s curved surface and the cylinder\u2019s lower circle.', reasoning: 'The cone\u2019s base and the cylinder\u2019s upper circle are the joined pair.' },
        { text: 'Cone curved surface = \u03c0rl = \u03c0 \u00d7 3 \u00d7 5 = 15\u03c0 cm\u00b2.', reasoning: 'Using the slant height of 5 just computed, not the cone\u2019s height of 4, which would give the wrong curved surface.' },
        { text: 'Cylinder curved surface = 2\u03c0rh = 2\u03c0 \u00d7 3 \u00d7 8 = 48\u03c0 cm\u00b2, and the lower circle = \u03c0r\u00b2 = 9\u03c0 cm\u00b2.', reasoning: 'Only one circle of the cylinder survives the join.' },
        { text: 'Total = 15\u03c0 + 48\u03c0 + 9\u03c0 = 72\u03c0 cm\u00b2.', reasoning: 'Leaving \u03c0 in place keeps the answer exact, since these dimensions are not multiples of 7.' },
      ],
      answer: '72\u03c0 cm\u00b2.',
      visualRef: 'F_CYL_CONE',
    },
  ],
  guidedPractice: [
    {
      id: 's122b.g1',
      prompt: 'A hemisphere of radius 5 cm closes the open end of a cylinder of radius 5 cm and height 12 cm. Write the exposed area in terms of \u03c0.',
      hint: 'List the three exposed surfaces before substituting anything.',
      answer: '195\u03c0 cm\u00b2.',
      rationale: '2\u03c0rh = 120\u03c0, the remaining circle = 25\u03c0, the dome = 50\u03c0, and 120\u03c0 + 25\u03c0 + 50\u03c0 = 195\u03c0.',
    },
    {
      id: 's122b.g2',
      prompt: 'A cone of radius 6 cm and height 8 cm sits on a cylinder of the same radius and height 10 cm. Find the cone\u2019s curved surface area in terms of \u03c0.',
      hint: 'You need the slant height first.',
      answer: '60\u03c0 cm\u00b2.',
      rationale: 'l = \u221a(36 + 64) = 10, so \u03c0rl = \u03c0 \u00d7 6 \u00d7 10 = 60\u03c0. Using the height 8 instead would have given 48\u03c0, which is the classic slant-height error.',
    },
    {
      id: 's122b.g3',
      prompt: 'Two solids of shared radius r are joined. Their total surface areas add to S. What is the exposed area?',
      hint: 'How much does a join always remove?',
      answer: 'S \u2212 2\u03c0r\u00b2.',
      rationale: 'A join hides one circular face from each solid, each of area \u03c0r\u00b2, so the exposed area is always the sum of the totals less 2\u03c0r\u00b2.',
    },
  ],
  independentPractice: [
    {
      id: 's122b.i1',
      prompt: 'A cylinder of radius 7 cm and height 20 cm has a hemisphere of the same radius on top. Find the exposed area with \u03c0 = 22/7.',
      answer: '1342 cm\u00b2.',
      rationale: '2\u03c0rh = 880, remaining circle = 154, dome = 308, and 880 + 154 + 308 = 1342.',
    },
    {
      id: 's122b.i2',
      prompt: 'A cone of radius 9 cm and height 12 cm is joined to a hemisphere of radius 9 cm at its base. Find the exposed area in terms of \u03c0.',
      answer: '297\u03c0 cm\u00b2.',
      rationale: 'l = \u221a(81 + 144) = 15, so the cone\u2019s curved surface is \u03c0 \u00d7 9 \u00d7 15 = 135\u03c0 and the dome is 2\u03c0 \u00d7 81 = 162\u03c0. The two flat faces are internal, so the total is 297\u03c0.',
    },
    {
      id: 's122b.i3',
      prompt: 'A student answers 2\u03c0rh + 5\u03c0r\u00b2 for a cylinder with a hemisphere on one end. What did they do, and what is the correct expression?',
      answer: 'They added the two total surface areas; the correct expression is 2\u03c0rh + 3\u03c0r\u00b2.',
      rationale: 'Their answer exceeds the correct one by 2\u03c0r\u00b2, which is the pair of circles at the join.',
    },
    {
      id: 's122b.i4',
      prompt: 'For a cone on a cylinder, which exposed surface would change if the cone\u2019s height alone were increased, the radius staying the same?',
      answer: 'Only the cone\u2019s curved surface.',
      rationale: 'A greater height gives a greater slant height, so \u03c0rl grows. The cylinder\u2019s surfaces and the joining circle are unaffected because the shared radius has not changed.',
    },
  ],
  misconceptionIds: [],
  interactivePractice: [],
  reasoningApplication: [
    {
      id: 's122b.td1',
      prompt: 'Two students compute the exposed area of the same cone-on-cylinder toy. Their answers differ by 2\u03c0r\u00b2 and also by a further amount involving the cone. Describe two independent errors that could produce this.',
      expectedReasoning:
        'The 2\u03c0r\u00b2 points to the join: one student added the two total surface areas instead of removing the pair of faces in contact. The further discrepancy involving the cone points to the slant height: using the vertical height h in \u03c0rl instead of l = \u221a(r\u00b2 + h\u00b2) makes the cone\u2019s curved surface too small. The two errors are independent \u2014 one happens when listing surfaces, the other when substituting \u2014 so a student can make either, or both.',
    },
    {
      id: 's122b.td2',
      prompt: 'Which measurement of a cylinder-and-hemisphere toy could you change so that the exposed area changes but the area of the hidden joining circle does not?',
      expectedReasoning:
        'The height of the cylinder. The joining circle has area \u03c0r\u00b2 and depends only on the shared radius, so altering the cylinder\u2019s height leaves it untouched while changing 2\u03c0rh and therefore the exposed total. Changing the radius would alter both, since every term in the expression involves r.',
    },
  ],
  summary:
    'The exposed surface area of a combination is the sum of the areas of the exposed surfaces \u2014 nothing more. For a cylinder with a hemisphere on one end this is 2\u03c0rh + 3\u03c0r\u00b2, which is 2\u03c0r\u00b2 less than adding the two totals. Where a cone is exposed, its curved surface needs the slant height l = \u221a(r\u00b2 + h\u00b2), not the height.',
  nextStep: 'Next you will find the volume of a combination, where the join behaves very differently.',
  teacher: {
    objective: 'Students compute the exposed surface area of a two-solid combination, using the exposure decision made in the previous lesson.',
    prerequisiteKnowledge: ['Exposure decision for a join', 'Curved surface area formulas', 'Pythagoras for the slant height'],
    modelLanguage: [
      'List the exposed surfaces before you substitute anything.',
      'Which length does \u03c0rl want \u2014 the height or the slant?',
      'Keep \u03c0 unless the numbers invite 22/7.',
    ],
    teachingNotes: [
      'The second worked example deliberately computes the wrong answer alongside the right one. Seeing 1210 against 902, with the gap landing exactly on 2\u03c0r\u00b2, settles the point more firmly than a warning does.',
      'Separate the two error sites explicitly: exposure is decided when listing, slant height when substituting. Students who treat them as one piece of advice keep making whichever one they did not check.',
      'Watch for diameter being used as radius; it silently quadruples every \u03c0r\u00b2 term.',
    ],
    quickChecks: [
      'Ask what the answer would be if the two totals were added, and where the difference comes from.',
      'Ask which cone measurement \u03c0rl needs.',
    ],
    supportForStrugglingLearners: [
      'Have the student write the exposed list as three lines, then one formula per line, before adding anything.',
    ],
    extension: ['Ask for the exposed area of a cylinder with a hemisphere at BOTH ends, and what the join deficit becomes.'],
    materialsNeeded: [],
  },
  reviewStatus: 'authored_draft',
};

export const C10_SECTION_12_3A: AuthoredSection = {
  contentArtifactId: 'ncert_jemh1_s12_3_volume_lesson',
  contentArtifactVersion: 1,
  source: source('12.3', 'Volume of a Combination of Solids', 168, 'ncert_jemh1_s12_3'),
  competencyCandidates: [],
  competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_jemh1_s12_2'],
    mayAssume: ['Volumes of the cylinder, cone, sphere and hemisphere', 'That a join hides two surfaces'],
    mustNotIntroduce: [{ concept: 'Frustum of a cone', belongsToSection: 'not_in_this_edition' }],
  },
  learningGoal:
    'You will compute the volume of a solid formed by joining two standard solids, and explain why volumes add where surface areas do not.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: [
      'State the volume of a cylinder, a cone and a hemisphere.',
      'Explain which surfaces a join hides.',
      'Find a slant height from a radius and a height.',
    ],
    ifNotReady: 'Revise the volume formulas from Class IX. The joining idea from the last two lessons carries over, but it behaves differently here.',
  },
  vocabulary: [
    { term: 'volume', meaning: 'The amount of space a solid occupies.' },
    { term: 'combined volume', meaning: 'The volume of an object formed by joining two solids, found by adding their separate volumes.' },
    { term: 'capacity', meaning: 'The volume a hollow object can hold.' },
  ],
  explanation: [
    'Surface area needed care at the join, because two faces left the exterior. Volume needs none, and the reason is worth stating rather than assuming.',
    'A surface is a boundary. When two solids meet, the boundary between them stops being a boundary of the whole object, so it drops out of the surface area. A volume is not a boundary \u2014 it is the space inside \u2014 and the space inside the cylinder and the space inside the hemisphere are different regions that do not overlap.',
    'So the combined volume is simply the sum of the two volumes. Nothing is lost at the join, because the join has no thickness and so occupies no space. For the cylinder with a hemisphere on top, both of radius r, the volume is \u03c0r\u00b2h + (2/3)\u03c0r\u00b3.',
    'This is the whole of the method, and it is the one place in this chapter where adding the two separate quantities is right. It is worth noticing that the same student who must subtract at the join for area must not subtract at the join for volume, and that the difference is not a convention but a consequence of what the two quantities measure.',
    'One caution about wording. These problems are additive: two solids placed together. A problem that scoops a hemisphere out of a cylinder, or sinks a cone into one, is describing removal rather than joining, and there the volumes subtract. Read what the object is before deciding whether to add.',
    'Capacity is volume seen from inside. If a vessel is a cylinder with a hemispherical bottom, how much liquid it holds is the sum of the two volumes, exactly as before \u2014 the word changes, the calculation does not.',
  ],
  representations: ['A cross-section of a joined solid with each component volume named'],
  visuals: [F_CONE_HEMI, F_CYL_HEMI],
  visualsById: { F_CONE_HEMI, F_CYL_HEMI },
  workedExamples: [
    {
      id: 's123a.we1',
      prompt: 'A cylinder of radius 7 cm and height 10 cm has a hemisphere of the same radius on its upper end. Find the volume, taking \u03c0 as 22/7.',
      steps: [
        { text: 'The two regions do not overlap, so the volumes add.', reasoning: 'Each solid occupies its own space, and the join is a surface with no thickness.' },
        { text: 'Cylinder volume = \u03c0r\u00b2h = 22/7 \u00d7 49 \u00d7 10 = 1540 cm\u00b3.', reasoning: 'The 7 in the denominator cancels against 49, leaving an exact figure.' },
        { text: 'Hemisphere volume = (2/3)\u03c0r\u00b3 = (2/3) \u00d7 22/7 \u00d7 343 = 2156/3 cm\u00b3, about 718.67 cm\u00b3.', reasoning: 'Half the volume of a sphere of the same radius.' },
        { text: 'Total = 1540 + 2156/3 = 6776/3 cm\u00b3, about 2258.67 cm\u00b3.', reasoning: 'Keeping the fraction until the end avoids rounding twice.' },
      ],
      answer: '6776/3 cm\u00b3, about 2258.67 cm\u00b3.',
      visualRef: 'F_CYL_HEMI',
    },
    {
      id: 's123a.we2',
      prompt: 'A cone of radius 6 cm and height 8 cm is closed at its base by a hemisphere of radius 6 cm. Find the volume in terms of \u03c0.',
      steps: [
        { text: 'The cone\u2019s base and the hemisphere\u2019s flat face meet, so the two regions sit on opposite sides of that circle and do not overlap.', reasoning: 'Checking non-overlap is what licenses adding; it is not automatic from the word "joined".' },
        { text: 'Cone volume = (1/3)\u03c0r\u00b2h = (1/3)\u03c0 \u00d7 36 \u00d7 8 = 96\u03c0 cm\u00b3.', reasoning: 'A cone is a third of the cylinder on the same base and height.' },
        { text: 'Hemisphere volume = (2/3)\u03c0r\u00b3 = (2/3)\u03c0 \u00d7 216 = 144\u03c0 cm\u00b3.', reasoning: 'A hemisphere is half a sphere, so its volume is half of (4/3)\u03c0r\u00b3, which is (2/3)\u03c0r\u00b3.' },
        { text: 'Total = 96\u03c0 + 144\u03c0 = 240\u03c0 cm\u00b3.', reasoning: 'Adding the two component volumes, with \u03c0 kept exact because these dimensions are not multiples of 7.' },
      ],
      answer: '240\u03c0 cm\u00b3.',
      visualRef: 'F_CONE_HEMI',
    },
    {
      id: 's123a.we3',
      prompt: 'For the cone-and-hemisphere object above, the slant height is 10 cm. Find the exposed surface area as well, and say why the join is treated differently in the two calculations.',
      steps: [
        { text: 'Exposed surfaces: the cone\u2019s curved surface and the hemisphere\u2019s dome.', reasoning: 'The cone\u2019s base and the hemisphere\u2019s flat face are the joined pair and are internal.' },
        { text: 'Cone curved surface = \u03c0rl = \u03c0 \u00d7 6 \u00d7 10 = 60\u03c0 cm\u00b2; dome = 2\u03c0r\u00b2 = 72\u03c0 cm\u00b2.', reasoning: 'Using the slant height for the cone, not its height of 8.' },
        { text: 'Exposed area = 132\u03c0 cm\u00b2, while the volume was 240\u03c0 cm\u00b3.', reasoning: 'Both are computed from the same object and the same join.' },
        { text: 'The join removed two surfaces from the area and nothing from the volume.', reasoning: 'A surface stops bounding the object when something is pressed against it; a region of space is not removed by being next to another region.' },
      ],
      answer: 'Exposed area 132\u03c0 cm\u00b2 and volume 240\u03c0 cm\u00b3; the join subtracts from one and not the other.',
      visualRef: 'F_CONE_HEMI',
    },
  ],
  guidedPractice: [
    {
      id: 's123a.g1',
      prompt: 'A cylinder of radius 3 cm and height 10 cm has a hemisphere of radius 3 cm on one end. Find the volume in terms of \u03c0.',
      hint: 'Add the two volumes; nothing is removed at the join.',
      answer: '108\u03c0 cm\u00b3.',
      rationale: '\u03c0 \u00d7 9 \u00d7 10 = 90\u03c0 for the cylinder and (2/3)\u03c0 \u00d7 27 = 18\u03c0 for the hemisphere, giving 108\u03c0.',
    },
    {
      id: 's123a.g2',
      prompt: 'Explain in one sentence why the joining circle reduces the surface area but not the volume.',
      hint: 'What does each quantity measure?',
      answer: 'Because surface area measures the boundary, which the join removes, while volume measures the space inside, which the join does not touch.',
      rationale: 'The circle stops being part of the outside of the object, but the regions on either side of it still occupy all the space they did before.',
    },
    {
      id: 's123a.g3',
      prompt: 'A hemispherical bowl of radius 6 cm is fitted to a cylindrical tube of radius 6 cm and height 15 cm to make a vessel. What is its capacity in terms of \u03c0?',
      hint: 'Capacity is the volume it can hold.',
      answer: '684\u03c0 cm\u00b3.',
      rationale: 'Cylinder \u03c0 \u00d7 36 \u00d7 15 = 540\u03c0 and hemisphere (2/3)\u03c0 \u00d7 216 = 144\u03c0, giving 684\u03c0.',
    },
  ],
  independentPractice: [
    {
      id: 's123a.i1',
      prompt: 'A cone of radius 5 cm and height 12 cm is joined at its base to a hemisphere of radius 5 cm. Find the volume in terms of \u03c0.',
      answer: '(550/3)\u03c0 cm\u00b3.',
      rationale: 'Cone (1/3)\u03c0 \u00d7 25 \u00d7 12 = 100\u03c0, which is (300/3)\u03c0, and hemisphere (2/3)\u03c0 \u00d7 125 = (250/3)\u03c0. Adding gives (550/3)\u03c0 cm\u00b3.',
    },
    {
      id: 's123a.i2',
      prompt: 'A cylinder of radius 7 cm and height 6 cm has a hemisphere of the same radius on each end. Find the volume with \u03c0 = 22/7.',
      answer: '7084/3 cm\u00b3, about 2361.33 cm\u00b3.',
      rationale: 'Cylinder 22/7 \u00d7 49 \u00d7 6 = 924 = 2772/3, and each hemisphere (2/3) \u00d7 22/7 \u00d7 343 = 2156/3, so the two give 4312/3. The total is 2772/3 + 4312/3 = 7084/3 cm\u00b3.',
    },
    {
      id: 's123a.i3',
      prompt: 'Two solids of the same radius are joined. One student subtracts the joining circle from the volume. What is wrong with that?',
      answer: 'A circle has no volume, so there is nothing to subtract.',
      rationale: 'The joining face is a two-dimensional region with zero thickness. Removing it from a volume is a category error, not an arithmetic one.',
    },
    {
      id: 's123a.i4',
      prompt: 'An object is made by scooping a hemisphere out of the top of a cylinder of the same radius. Does this lesson\u2019s rule apply?',
      answer: 'No \u2014 this is removal, so the hemisphere\u2019s volume is subtracted, not added.',
      rationale: 'Adding applies to two solids placed together occupying separate space. Here the hemisphere occupies space that was part of the cylinder, so the volumes subtract.',
    },
  ],
  misconceptionIds: [],
  interactivePractice: [],
  reasoningApplication: [
    {
      id: 's123a.td1',
      prompt: 'Does joining two solids change their total volume? Answer by saying what volume measures and what a join does to it.',
      expectedReasoning:
        'It does not. Volume measures the space a solid occupies, and the two solids occupy separate regions that meet only along a surface. A surface has no thickness and therefore no volume, so nothing is gained or lost by pressing the two together. This is unlike surface area, where the join removes two faces from the boundary of the object \u2014 a boundary can stop being a boundary, but a region of space cannot stop being space.',
    },
    {
      id: 's123a.td2',
      prompt: 'For a cylinder with a hemisphere on top, which single measurement could you change so that the volume changes but the exposed surface area changes by the smallest possible amount?',
      expectedReasoning:
        'The cylinder\u2019s height. Increasing it by an amount d adds \u03c0r\u00b2d to the volume and 2\u03c0rd to the exposed area, so when the radius is small compared with the change the volume grows by relatively more. Changing the radius instead alters every term of both quantities at once, since each contains r. The precise comparison depends on the dimensions, but height is the measurement that leaves the hemisphere entirely untouched.',
    },
  ],
  summary:
    'Volumes of joined solids add, because the two solids occupy separate regions and the join is a surface with no thickness. This is exactly where surface area differs: the join removes two faces from the boundary but no space from the interior. Where a problem describes removal rather than joining, the volumes subtract instead.',
  nextStep: 'The remaining lessons of this chapter apply these two ideas to a wider range of objects.',
  teacher: {
    objective: 'Students compute the volume of a two-solid combination and explain why the join affects area but not volume.',
    prerequisiteKnowledge: ['Volume formulas for the standard solids', 'The exposure decision from §12.2'],
    modelLanguage: [
      'A surface can stop being a boundary; space cannot stop being space.',
      'The join has no thickness, so it holds nothing.',
      'Is this object two solids together, or one with a piece removed?',
    ],
    teachingNotes: [
      'The third worked example computes area and volume for one object on purpose. Students who meet the two rules in separate lessons often merge them into a single half-remembered instruction to "subtract at the join".',
      'The add-versus-subtract distinction turns on the word in the problem, not the shape. Scooped, hollowed and sunk describe removal; placed, surmounted and fitted describe joining.',
      'Watch for the joining circle being subtracted from a volume, which is a category error worth naming as such.',
    ],
    quickChecks: [
      'Ask whether the joining circle has a volume.',
      'Ask what changes if the problem says the hemisphere is scooped out rather than placed on top.',
    ],
    supportForStrugglingLearners: [
      'Have the student say aloud what each quantity measures before choosing to add or subtract.',
    ],
    extension: ['Ask for the ratio of volume to exposed area for a cylinder-and-hemisphere toy, and what happens to it as the height grows.'],
    materialsNeeded: [],
  },
  reviewStatus: 'authored_draft',
};

export const CLASS10_COMPOSITE_SOLIDS_SECTIONS: AuthoredSection[] = [
  C10_SECTION_12_2A,
  C10_SECTION_12_2B,
  C10_SECTION_12_3A,
];
