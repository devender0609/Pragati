// ===========================================================================
// v0.84.0 checkpoint 36 — CLASS 9 CHAPTER 14: SURFACE AREA AND VOLUME.
//
// The isolated representation pilot. The question was whether mensuration
// forces a 3-D model, and the answer the source gives is no: this chapter
// teaches surface area from NETS, the cylinder from an UNROLLED rectangle,
// the cone from a ROTATED TRIANGLE, and the sphere from a winding activity.
// Every one of those is a 2-D figure about a solid, and a flat net states
// the mathematics more honestly than a perspective drawing, which hides
// exactly the faces whose areas are being added.
//
// So no solid is drawn here. Not from a limitation — from the observation
// that a perspective picture of a cuboid teaches less about its surface
// area than the six rectangles it unfolds into.
//
// One split (§14.5 into spheres and hemispheres). No merges.
// ===========================================================================

import type { AuthoredSection } from './authoredSection';
import type { GeometryFigureSpec } from './visualSpecification';

export const MENSURATION_CHAPTER_ID = 'ncert_iemh2_ch14';

const BOOK = 'Ganita Manjari, Textbook of Mathematics for Grade 9 (Part II)';
const SRC = 'https://ncert.nic.in/textbook/pdf/iemh2dd.zip';
const INSPECTED = '2026-10-07';

const source = (
  sectionNumber: string,
  exactTitle: string,
  startPage: number,
  officialSectionId: string
) => ({
  officialChapterId: MENSURATION_CHAPTER_ID,
  officialSectionId,
  sectionNumber,
  exactTitle,
  startPage,
  textbook: BOOK,
  sourceReference: SRC,
  inspectionDate: INSPECTED,
});

const P = (id: string, x: number, y: number, label = id.toUpperCase()) => ({ id, x, y, label });

// The net of a cuboid: six rectangles in a cross, each face named and each
// edge length shown once. Opposite faces are equal, which the net shows by
// putting them side by side rather than by asserting it.
const F_CUBOID_NET: GeometryFigureSpec = {
  type: 'geometry_figure',
  purpose: 'show_construction',
  status: 'concept_specific',
  points: [
    P('a', 40, 20, 'A'), P('b', 100, 20, 'B'),
    P('c', 40, 50, 'C'), P('d', 100, 50, 'D'),
    P('e', 10, 50, 'E'), P('f', 130, 50, 'F'),
    P('g', 10, 110, 'G'), P('h', 130, 110, 'H'),
    P('i', 40, 110, 'I'), P('j', 100, 110, 'J'),
    P('k', 40, 140, 'K'), P('l', 100, 140, 'L'),
    P('m', 40, 170, 'M'), P('n', 100, 170, 'N'),
  ],
  segments: [
    { from: 'a', to: 'b', label: 'l' },
    { from: 'a', to: 'c', label: 'b' },
    { from: 'b', to: 'd' },
    { from: 'c', to: 'd' },
    { from: 'e', to: 'f' },
    { from: 'e', to: 'g', label: 'h' },
    { from: 'f', to: 'h' },
    { from: 'g', to: 'h' },
    { from: 'c', to: 'i' },
    { from: 'd', to: 'j' },
    { from: 'i', to: 'j' },
    { from: 'i', to: 'k' },
    { from: 'j', to: 'l' },
    { from: 'k', to: 'l' },
    { from: 'k', to: 'm' },
    { from: 'l', to: 'n' },
    { from: 'm', to: 'n' },
  ],
  shadedRegions: [
    { points: ['c', 'd', 'j', 'i'], label: 'front' },
    { points: ['k', 'l', 'n', 'm'], label: 'back' },
  ],
  caption: 'The six faces of a cuboid, unfolded flat. Each pair of opposite faces is equal.',
  altText:
    'A flat net of a cuboid arranged as a cross. The middle column holds four rectangles in a line: top, front, bottom and back. One rectangle sits to the left of the front face and one to the right, giving the two side faces. The top rectangle has edges labelled l and b, the left side rectangle has an edge labelled h, so the six faces are two of l by b, two of b by h and two of l by h.',
};

// The cylinder unrolled: the curved surface IS a rectangle whose width is
// the circumference of the base. That equality is the lesson.
const F_CYLINDER_NET: GeometryFigureSpec = {
  type: 'geometry_figure',
  purpose: 'show_construction',
  status: 'concept_specific',
  points: [
    P('tl', 60, 50, 'P'), P('tr', 200, 50, 'Q'),
    P('bl', 60, 120, 'S'), P('br', 200, 120, 'R'),
    P('o1', 30, 30, 'O'), P('r1', 48, 30, 'A'),
    P('o2', 30, 140, "O'"), P('r2', 48, 140, 'B'),
  ],
  circles: [
    { id: 'top', centre: 'o1', through: 'r1', label: 'base' },
    { id: 'bot', centre: 'o2', through: 'r2', label: 'base' },
  ],
  segments: [
    { from: 'tl', to: 'tr', label: '2πr — the circumference' },
    { from: 'tr', to: 'br', label: 'h' },
    { from: 'br', to: 'bl' },
    { from: 'bl', to: 'tl' },
    { from: 'o1', to: 'r1', label: 'r' },
    { from: 'o2', to: 'r2', label: 'r' },
  ],
  caption: 'Cut the curved surface down its side and it flattens into a rectangle.',
  altText:
    'A flat net of a right circular cylinder. A large rectangle PQRS stands in the middle: its horizontal edge is labelled 2 pi r, the circumference of the base, and its vertical edge is labelled h, the height. Two circles of radius r, centred at O and O-prime, sit beside it, one for each flat end. The rectangle is the curved surface, cut open and laid flat.',
};

// The cone generated: a right triangle swept about one leg. The arc shows
// the sweep; the triangle carries the relation among r, h and l.
const F_CONE_ROTATION: GeometryFigureSpec = {
  type: 'geometry_figure',
  purpose: 'show_construction',
  status: 'concept_specific',
  points: [
    P('apex', 110, 30, 'A'), P('o', 110, 140, 'O'),
    P('b', 180, 140, 'B'), P('bp', 40, 140, "B'"),
  ],
  circles: [{ id: 'base', centre: 'o', through: 'b' }],
  arcs: [{ circle: 'base', from: 'b', to: 'bp', label: 'the sweep' }],
  segments: [
    { from: 'apex', to: 'o', mark: 'dashed', label: 'h' },
    { from: 'o', to: 'b', label: 'r' },
    { from: 'b', to: 'apex', label: 'l' },
  ],
  angleMarks: [{ at: 'o', from: 'apex', to: 'b', right: true }],
  caption: 'Spin the right triangle about AO and B traces the circular edge of the cone.',
  altText:
    'A right triangle with its right angle at O. The vertical leg AO is dashed and labelled h, the horizontal leg OB is labelled r, and the hypotenuse BA is labelled l. A circle of radius r is drawn about O, and an arc from B round to B-prime marks the path B follows as the triangle is swept about AO. Because the angle at O is a right angle, l squared equals r squared plus h squared.',
};

// The sphere: a great circle with its radius, and the winding comparison.
const F_SPHERE: GeometryFigureSpec = {
  type: 'geometry_figure',
  purpose: 'show_definition',
  status: 'concept_specific',
  points: [
    P('o', 70, 80, 'O'), P('e', 120, 80, 'E'),
    P('c1', 190, 40, 'P'), P('d1', 220, 40, 'U'),
    P('c2', 190, 110, 'Q'), P('d2', 220, 110, 'V'),
  ],
  circles: [
    { id: 'great', centre: 'o', through: 'e' },
    { id: 'f1', centre: 'c1', through: 'd1' },
    { id: 'f2', centre: 'c2', through: 'd2' },
  ],
  segments: [
    { from: 'o', to: 'e', label: 'r' },
    { from: 'c1', to: 'd1', label: 'r' },
    { from: 'c2', to: 'd2', label: 'r' },
  ],
  caption: 'The thread covering the sphere fills four circles of the same radius.',
  altText:
    'On the left, a large circle of centre O with a segment from O to its edge labelled r — the view of a sphere through its centre. On the right, smaller circles P and Q, each also of radius r, standing for the flat circles the winding thread fills. Four such circles are filled in all, which is why the surface area of the sphere is four times pi r squared.',
};

// The hemisphere: the curved part and the flat circular face are different
// surfaces, which is where the chapter's errors concentrate.
const F_HEMISPHERE: GeometryFigureSpec = {
  type: 'geometry_figure',
  purpose: 'compare_cases',
  status: 'concept_specific',
  points: [
    P('o', 100, 110, 'O'), P('l', 40, 110, 'L'), P('r', 160, 110, 'R'), P('t', 100, 50, 'T'),
  ],
  circles: [{ id: 'c', centre: 'o', through: 'r' }],
  arcs: [{ circle: 'c', from: 'r', to: 'l', label: 'curved surface' }],
  segments: [
    { from: 'l', to: 'r', label: 'the flat face, a circle of radius r' },
    { from: 'o', to: 't', mark: 'dashed', label: 'r' },
  ],
  caption: 'A hemisphere has two different surfaces: the curved dome and the flat circle beneath it.',
  altText:
    'A circle of centre O cut by the horizontal diameter LR. The upper arc from R round to L is marked as the curved surface, which is half the sphere. The diameter itself is labelled as the flat circular face of radius r. A dashed segment from O upward is labelled r. Curved surface area counts only the arc; total surface area adds the flat circle.',
};

export const SECTION_14_1: AuthoredSection = {
  contentArtifactId: 'ncert_iemh2_s14_1_lesson',
  contentArtifactVersion: 1,
  source: source('14.1', 'Cuboids and Cubes', 1, 'ncert_iemh2_s14_1'),
  competencyCandidates: [],
  competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: [],
    mayAssume: ['Area of a rectangle', 'Class 8 work with cuboids', 'Cube numbers'],
    mustNotIntroduce: [{ concept: 'Curved surface of a cylinder', belongsToSection: 'ncert_iemh2_s14_2' }, { concept: 'Cones', belongsToSection: 'ncert_iemh2_s14_3' }],
  },
  learningGoal:
    'You will find the surface area of a cuboid from its net and its volume from its three dimensions, and explain what happens to the surface-to-volume ratio when a cube is cut up.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: ['Find the area of a rectangle from its two sides.', 'Multiply three numbers.', 'Say what a cube number is.'],
    ifNotReady: 'Revisit the area of a rectangle; the whole of surface area is rectangles added up.',
  },
  vocabulary: [
    { term: 'net', meaning: 'The flat figure a solid unfolds into, showing every face.' },
    { term: 'surface area', meaning: 'The total area of all the faces — what it would take to cover the solid.' },
    { term: 'volume', meaning: 'The space inside the solid, measured in cubic units.' },
  ],
  explanation: [
    'A cuboid has six flat faces, and the honest way to see them all at once is to unfold it. Cut along some edges and lay it flat and you get a net: six rectangles, none hidden behind another.',
    'The net also shows why the faces pair up. With dimensions l, b and h, two faces are l by b, two are b by h and two are l by h. Adding them gives the surface area 2(lb + bh + hl) — and that formula is not a rule to memorise, it is the sum of six rectangles you can point at.',
    'Volume is a different quantity measured in different units. Fill the cuboid with unit cubes: l of them along, b across and h up, so the count is l times b times h. Surface area is measured in square units because it is area; volume in cubic units because it is a count of cubes. The units are not decoration — they say what kind of quantity you have.',
    'A cube is the case where all three dimensions are equal. Its surface area is 6a squared, six identical faces, and its volume is a cubed — which is where the phrase "cube number" comes from.',
    'Now the interesting part. Take a cube of side 2 and cut it into eight cubes of side 1. The volume is unchanged: 8 cubes of volume 1 against one cube of volume 8. But the surface area has gone from 24 to 48, because cutting exposes faces that were inside. Dividing a solid leaves the volume alone and increases the surface, which is why a chopped onion dries out faster than a whole one.',
  ],
  representations: ['A cuboid net with each face named and the three dimensions marked once each', 'The net reassembled in the mind: six rectangles, three pairs'],
  visuals: [F_CUBOID_NET],
  visualsById: { F_CUBOID_NET },
  workedExamples: [
    {
      id: 's141.we1',
      prompt: 'A cuboid measures 8 cm by 5 cm by 3 cm. Find its surface area and volume.',
      steps: [
        { text: 'From the net, the faces pair up: two of 8 by 5, two of 5 by 3, two of 8 by 3.', reasoning: 'Each pair of opposite faces is identical, which is what the net makes visible.' },
        { text: 'Their areas are 40, 15 and 24, so one of each totals 79.', reasoning: 'Adding one face from each pair before doubling keeps the arithmetic short.' },
        { text: 'Surface area is 2 times 79 = 158 square centimetres.', reasoning: 'Doubling accounts for the opposite face in each pair; the unit is square because this is an area.' },
        { text: 'Volume is 8 times 5 times 3 = 120 cubic centimetres.', reasoning: 'Volume counts unit cubes in three directions, so the unit is cubic.' },
      ],
      answer: 'Surface area 158 square cm; volume 120 cubic cm.',
      visualRef: 'F_CUBOID_NET',
    },
    {
      id: 's141.we2',
      prompt: 'A cube has volume 125 cubic cm. Find its surface area.',
      steps: [
        { text: 'The volume of a cube is its side cubed, so the side is the cube root of 125.', reasoning: 'Working backwards from volume to a dimension is the reverse of the usual direction.' },
        { text: 'The cube root of 125 is 5, so the side is 5 cm.', reasoning: 'Five cubed is 125, which identifies the side.' },
        { text: 'Surface area is 6 times 5 squared = 150 square cm.', reasoning: 'Six identical faces, each of area side squared.' },
      ],
      answer: '150 square centimetres.',
    },
    {
      id: 's141.we3',
      prompt: 'A cube of side 2 cm is cut into eight cubes of side 1 cm. Compare the total volume and total surface area before and after.',
      steps: [
        { text: 'Before: volume 8 cubic cm, surface area 6 times 4 = 24 square cm.', reasoning: 'The original cube has side 2, so each face is 2 by 2.' },
        { text: 'After: eight cubes each of volume 1, so the total volume is still 8.', reasoning: 'Cutting moves material around but creates none and destroys none.' },
        { text: 'Each small cube has surface area 6, so the total is 48 square cm.', reasoning: 'Six faces of area 1 each, times eight cubes.' },
        { text: 'The new surface comes from faces that were inside the original cube.', reasoning: 'Cutting exposes interior area, which was never part of the surface before.' },
      ],
      answer: 'Volume unchanged at 8; surface area doubled from 24 to 48.',
    },
  ],
  misconceptionIds: [],
  guidedPractice: [
    {
      id: 's141.g1',
      prompt: 'A cuboid is 6 by 4 by 2. How many faces measure 6 by 4?',
      hint: 'How do faces pair up in a net?',
      answer: 'Two.',
      rationale: 'Opposite faces are identical, so each pair of dimensions gives two faces.',
    },
    {
      id: 's141.g2',
      prompt: 'Why is surface area in square units and volume in cubic units?',
      hint: 'How many dimensions does each quantity use?',
      answer: 'Because area uses two dimensions and volume three.',
      rationale: 'Multiplying two lengths gives square units; multiplying three gives cubic units.',
    },
    {
      id: 's141.g3',
      prompt: 'A cube has side 4 cm. Find its surface area.',
      hint: 'Six identical faces, each side squared.',
      answer: '96 square cm.',
      rationale: 'Four squared is 16, times six faces.',
    },
  ],
  independentPractice: [
    {
      id: 's141.i1',
      prompt: 'Find the surface area and volume of a cuboid 10 cm by 7 cm by 4 cm.',
      answer: 'Surface area 276 square cm; volume 280 cubic cm.',
      rationale: 'Pairs of 70, 28 and 40 give 138, doubled; volume is the product of the three.',
    },
    {
      id: 's141.i2',
      prompt: 'A cube has surface area 54 square cm. Find its volume.',
      answer: '27 cubic cm.',
      rationale: 'Each face is 9, so the side is 3 and the volume is 3 cubed.',
    },
    {
      id: 's141.i3',
      prompt: 'Explain why cutting a solid into pieces increases total surface area but not total volume.',
      answer: 'Because cutting exposes interior faces while moving no material.',
      rationale: 'Volume is conserved; surface is created at each new cut.',
    },
  ],
  reasoningApplication: [
    {
      id: 's141.r1',
      prompt: 'A cube of side 3 is cut into 27 unit cubes. Work out the total surface area before and after, and explain the pattern you would expect for a cube of side n cut into unit cubes.',
      expectedReasoning:
        'Before 54, after 162 — three times as much. In general a cube of side n has surface 6n squared and its n cubed unit pieces have total surface 6n cubed, so the surface is multiplied by n. A strong answer derives the factor rather than reporting the two numbers, and connects it to why small particles have so much more surface for their volume.',
    },
  ],
  interactivePractice: [],
  summary:
    'A cuboid unfolds into six rectangles, so its surface area is 2(lb + bh + hl) and its volume l times b times h. Area is measured in square units and volume in cubic units, and cutting a solid up leaves volume unchanged while increasing surface area.',
  nextStep:
    'Next you will unroll a curved surface instead of unfolding flat faces.',
  teacher: {
    objective: 'Students compute surface area from a net and volume from dimensions, and reason about subdivision.',
    prerequisiteKnowledge: ['Area of a rectangle', 'Multiplication in three factors'],
    modelLanguage: ['Which faces pair up?', 'Square units or cubic units here?'],
    teachingNotes: [
      'Build or unfold a real box before any formula. The net is the argument; the formula is its summary.',
      'Unit errors dominate this chapter. Ask for the unit with every answer from the first lesson.',
      'The cutting result is counter-intuitive and worth doing physically with linking cubes.',
    ],
    quickChecks: ['How many faces of that size?', 'What unit does this answer take?'],
    supportForStrugglingLearners: [
      'Unfold a cereal box and label its six rectangles.',
      'Build a 2 by 2 by 2 cube from linking cubes and take it apart.',
    ],
    extension: ['Ask how the surface-to-volume ratio of a cube changes as the side grows.'],
    materialsNeeded: ['An empty box to unfold', 'Linking cubes', 'Ruler'],
  },
  reviewStatus: 'authored_draft',
};

export const SECTION_14_2: AuthoredSection = {
  contentArtifactId: 'ncert_iemh2_s14_2_lesson',
  contentArtifactVersion: 1,
  source: source('14.2', 'Right Circular Cylinder', 5, 'ncert_iemh2_s14_2'),
  competencyCandidates: [],
  competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_iemh2_s14_1'],
    mayAssume: ['Surface area from a net', 'Circumference and area of a circle', 'Volume as space occupied'],
    mustNotIntroduce: [{ concept: 'Cones', belongsToSection: 'ncert_iemh2_s14_3' }, { concept: 'Spheres', belongsToSection: 'ncert_iemh2_s14_5' }],
  },
  learningGoal:
    'You will derive the curved and total surface area of a right circular cylinder from its unrolled net, and its volume as base area times height.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: ['Find the circumference and the area of a circle.', 'Find the area of a rectangle.', 'Explain what a net shows.'],
    ifNotReady: 'Make sure the two circle formulas are distinct in your mind: circumference is a length, area is an area.',
  },
  vocabulary: [
    { term: 'right circular cylinder', meaning: 'A cylinder whose axis is perpendicular to its circular base.' },
    { term: 'curved surface area', meaning: 'The area of the curved part alone, without the two flat ends.' },
    { term: 'total surface area', meaning: 'The curved surface plus both circular ends.' },
  ],
  explanation: [
    'A cylinder is called right when its axis stands perpendicular to the base, so the two circular ends sit directly above one another. A tilted, or oblique, cylinder leans, and the results here are for the right case.',
    'Now cut the curved surface straight down its side and roll it out flat. What you get is a rectangle — and that is the whole derivation. Its height is the height of the cylinder. Its width is the distance once round the base, which is the circumference, 2 pi r.',
    'So the curved surface area is 2 pi r times h. Nothing was approximated and nothing was assumed: the curved surface and the rectangle are the same piece of material, so they have the same area.',
    'Total surface area adds the two ends, each a circle of area pi r squared. That gives 2 pi r h + 2 pi r squared. Which of the two you want depends on the object: a tin needs both ends, a pipe needs neither, and a tin without a lid needs one.',
    'Volume is simpler. Think of the cylinder as a stack of thin discs, each of area pi r squared. Stacking them to height h gives pi r squared h — base area times height, the same pattern as a cuboid, where the base area was l times b.',
  ],
  representations: ['The curved surface cut open and laid flat as a rectangle beside the two circular ends', 'The rectangle width labelled as the circumference, not as a new quantity'],
  visuals: [F_CYLINDER_NET],
  visualsById: { F_CYLINDER_NET },
  workedExamples: [
    {
      id: 's142.we1',
      prompt: 'A cylinder has radius 7 cm and height 10 cm. Find its curved surface area, taking pi as 22/7.',
      steps: [
        { text: 'The curved surface unrolls into a rectangle of height 10 and width equal to the circumference.', reasoning: 'The unrolling is what turns a curved area into a rectangle area.' },
        { text: 'The circumference is 2 times 22/7 times 7 = 44 cm.', reasoning: 'The 7 cancels against the denominator, which is why this radius is chosen for mental work.' },
        { text: 'So the area is 44 times 10 = 440 square cm.', reasoning: 'Rectangle area is width times height, and the width is the circumference.' },
      ],
      answer: '440 square centimetres.',
      visualRef: 'F_CYLINDER_NET',
    },
    {
      id: 's142.we2',
      prompt: 'The same cylinder is a closed tin. Find its total surface area.',
      steps: [
        { text: 'Total surface adds the two circular ends to the curved surface.', reasoning: 'A closed tin has both ends, so both circles count.' },
        { text: 'Each end has area 22/7 times 49 = 154 square cm.', reasoning: 'Area of a circle is pi r squared, with r = 7.' },
        { text: 'Total is 440 + 2 times 154 = 748 square cm.', reasoning: 'The curved surface plus both ends.' },
      ],
      answer: '748 square centimetres.',
    },
    {
      id: 's142.we3',
      prompt: 'A pipe open at both ends has radius 3 cm and length 50 cm. Which surface area applies, and what is it?',
      steps: [
        { text: 'A pipe has no ends, so neither circle is part of its surface.', reasoning: 'Choosing between curved and total is a decision about the object, not about the formula.' },
        { text: 'Only the curved surface applies: 2 pi r h.', reasoning: 'The pipe is the rolled rectangle alone.' },
        { text: 'That is 2 times 3.14 times 3 times 50, about 942 square cm.', reasoning: 'Substituting the given values.' },
      ],
      answer: 'Curved surface only, about 942 square centimetres.',
    },
  ],
  misconceptionIds: [],
  guidedPractice: [
    {
      id: 's142.g1',
      prompt: 'What does the width of the unrolled rectangle equal?',
      hint: 'What distance does it take to go once round the base?',
      answer: 'The circumference, 2 pi r.',
      rationale: 'The cut edge wraps exactly once around the base.',
    },
    {
      id: 's142.g2',
      prompt: 'A cylinder of radius 5 and height 8. Find its volume, taking pi as 3.14.',
      hint: 'Base area times height.',
      answer: '628 cubic cm.',
      rationale: 'Base area is 78.5, times height 8.',
    },
    {
      id: 's142.g3',
      prompt: 'A tin has no lid. How many circles does its surface include?',
      hint: 'What is missing from the top?',
      answer: 'One.',
      rationale: 'Only the base circle is present, so the surface is the curved part plus one circle.',
    },
  ],
  independentPractice: [
    {
      id: 's142.i1',
      prompt: 'A cylinder has radius 14 cm and height 20 cm. Find its curved surface area with pi as 22/7.',
      answer: '1760 square cm.',
      rationale: 'Circumference 88, times height 20.',
    },
    {
      id: 's142.i2',
      prompt: 'Find the volume of a cylinder of radius 10 cm and height 7 cm, taking pi as 3.14.',
      answer: '2198 cubic cm.',
      rationale: 'Base area 314, times height 7.',
    },
    {
      id: 's142.i3',
      prompt: 'Explain why the curved surface area of a cylinder is a rectangle area.',
      answer: 'Because cutting the curved surface down its side and flattening it gives a rectangle of the same area.',
      rationale: 'The material is unchanged by being laid flat.',
    },
  ],
  reasoningApplication: [
    {
      id: 's142.r1',
      prompt: 'Two cylinders have the same volume, but one is short and wide and the other tall and narrow. Must they have the same surface area? Reason about it rather than computing many cases.',
      expectedReasoning:
        'No. Volume fixes pi r squared h, but surface area depends on r and h separately, so trading radius against height changes it. A strong answer tests one pair — such as r=1,h=36 against r=6,h=1 — and notes this is why packaging shape matters when material cost is the concern.',
    },
  ],
  interactivePractice: [],
  summary:
    'Cutting a cylinder’s curved surface open flattens it into a rectangle of width 2 pi r and height h, so the curved surface area is 2 pi r h. Adding the ends when the object has them gives the total, and the volume is base area times height.',
  nextStep:
    'Next you will generate a cone by spinning a right triangle, and relate its three lengths.',
  teacher: {
    objective: 'Students derive cylinder surface areas from the unrolled net and compute volumes.',
    prerequisiteKnowledge: ['Circle circumference and area', 'Rectangle area', 'Nets'],
    modelLanguage: ['What is the width of the rectangle?', 'Does this object have ends?'],
    teachingNotes: [
      'Unroll a label from a tin before any formula. Students who have seen the rectangle do not confuse circumference with area.',
      'Curved versus total is a decision about the object. Ask students to say what the object is before choosing.',
    ],
    quickChecks: ['Curved or total here?', 'Where did 2 pi r come from?'],
    supportForStrugglingLearners: [
      'Wrap paper round a tin and cut it open flat.',
      'Write circumference and area side by side with their units to keep them apart.',
    ],
    extension: ['Ask for the dimensions of the cheapest closed tin of a given volume, informally.'],
    materialsNeeded: ['An empty tin with a label', 'Paper', 'Scissors'],
  },
  reviewStatus: 'authored_draft',
};

export const SECTION_14_3: AuthoredSection = {
  contentArtifactId: 'ncert_iemh2_s14_3_lesson',
  contentArtifactVersion: 1,
  source: source('14.3', 'Cones', 8, 'ncert_iemh2_s14_3'),
  competencyCandidates: [],
  competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_iemh2_s14_2'],
    mayAssume: ['Cylinder surface area and volume', 'The Baudhayana-Pythagoras relation', 'Area of a circle'],
    mustNotIntroduce: [{ concept: 'Pyramidal shapes', belongsToSection: 'ncert_iemh2_s14_4' }, { concept: 'Spheres', belongsToSection: 'ncert_iemh2_s14_5' }],
  },
  learningGoal:
    'You will generate a cone by rotating a right triangle, relate its slant height to its radius and height, and give its curved surface area and volume.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: ['State the relation between the legs and hypotenuse of a right triangle.', 'Find the area of a circle.', 'Compute the volume of a cylinder.'],
    ifNotReady: 'Make sure the right-triangle relation is secure; the three lengths of a cone are related by it.',
  },
  vocabulary: [
    { term: 'slant height', meaning: 'The distance from the apex to a point on the circular edge, written l.' },
    { term: 'height', meaning: 'The perpendicular distance from the apex to the centre of the base, written h.' },
    { term: 'axis of rotation', meaning: 'The line the triangle is spun about.' },
  ],
  explanation: [
    'Take a right triangle and spin it about one of its legs. The leg stays put as the axis, and the other leg sweeps out a circle — the base. The hypotenuse sweeps out the curved surface. What you have made is a cone.',
    'That construction names its three lengths at once. The fixed leg is the height h, the sweeping leg is the radius r, and the hypotenuse is the slant height l. Because the triangle is right-angled, l squared = r squared + h squared, so any two of the three give the third.',
    'Keeping those apart matters. The height goes straight down the middle; the slant height runs along the surface. They are different distances, and using one where the other belongs is the most common error in this lesson. The slant height is always the longer of the two.',
    'The curved surface area of the cone is pi r l — radius times slant height, times pi. Notice it uses the slant height, not the height: the curved surface lies along the slope, so the slope length is what measures it. Adding the circular base gives the total surface area, pi r l + pi r squared.',
    'The volume is a third of the cylinder on the same base with the same height: one third pi r squared h. Three cones of a given base and height fill one cylinder of that base and height exactly, which is the comparison worth holding on to rather than the fraction alone.',
  ],
  representations: ['A right triangle with the axis marked and an arc showing the sweep', 'The three lengths r, h and l on the triangle, with the right angle marked'],
  visuals: [F_CONE_ROTATION],
  visualsById: { F_CONE_ROTATION },
  workedExamples: [
    {
      id: 's143.we1',
      prompt: 'A cone has radius 3 cm and height 4 cm. Find its slant height and curved surface area.',
      steps: [
        { text: 'The three lengths form a right triangle, so l squared = 9 + 16 = 25.', reasoning: 'The rotation construction is what makes the triangle right-angled, so the relation applies.' },
        { text: 'So l = 5 cm.', reasoning: 'Taking the positive square root, since a length is positive.' },
        { text: 'Curved surface area is pi r l = pi times 3 times 5 = 15 pi.', reasoning: 'The curved surface uses the slant height because it lies along the slope.' },
        { text: 'With pi as 3.14 that is about 47.1 square cm.', reasoning: 'Substituting a numerical value only at the end keeps the exact form available.' },
      ],
      answer: 'Slant height 5 cm; curved surface about 47.1 square cm.',
      visualRef: 'F_CONE_ROTATION',
    },
    {
      id: 's143.we2',
      prompt: 'A cone has radius 6 cm and slant height 10 cm. Find its volume.',
      steps: [
        { text: 'Volume needs the height, not the slant height, so find h first.', reasoning: 'Using l in the volume formula is the error this step exists to prevent.' },
        { text: 'h squared = 100 − 36 = 64, so h = 8 cm.', reasoning: 'Rearranging the right-triangle relation to get the leg from the hypotenuse.' },
        { text: 'Volume is one third pi r squared h = one third times pi times 36 times 8.', reasoning: 'Base area times height, divided by three.' },
        { text: 'That is 96 pi, about 301.4 cubic cm.', reasoning: 'Cubic units, because this is a volume.' },
      ],
      answer: 'About 301.4 cubic centimetres.',
    },
    {
      id: 's143.we3',
      prompt: 'Why does the curved surface area use l while the volume uses h?',
      steps: [
        { text: 'The curved surface lies along the slope of the cone.', reasoning: 'Measuring a surface requires the distance along that surface, which is the slant height.' },
        { text: 'The volume is the space enclosed, measured between base and apex.', reasoning: 'That distance is the perpendicular height, the same quantity used for a cylinder.' },
        { text: 'Swapping them measures the wrong thing, and since l is longer than h it also gives a bigger answer than the truth.', reasoning: 'The error is detectable: an answer that uses l where h belongs is always too large.' },
      ],
      answer: 'Surface follows the slope, so it uses l; volume spans the height, so it uses h.',
    },
  ],
  misconceptionIds: [],
  guidedPractice: [
    {
      id: 's143.g1',
      prompt: 'A cone has r = 5 and h = 12. Find l.',
      hint: 'Use the right-triangle relation.',
      answer: '13',
      rationale: 'Twenty-five plus 144 is 169.',
    },
    {
      id: 's143.g2',
      prompt: 'Which is longer, the height or the slant height?',
      hint: 'Which is the hypotenuse of the triangle?',
      answer: 'The slant height.',
      rationale: 'It is the hypotenuse, so it exceeds either leg.',
    },
    {
      id: 's143.g3',
      prompt: 'How many cones fill a cylinder of the same base and height?',
      hint: 'What fraction is the cone volume?',
      answer: 'Three.',
      rationale: 'The cone is one third of that cylinder.',
    },
  ],
  independentPractice: [
    {
      id: 's143.i1',
      prompt: 'A cone has radius 7 cm and slant height 25 cm. Find its height and volume, with pi as 22/7.',
      answer: 'Height 24 cm; volume 1232 cubic cm.',
      rationale: '625 minus 49 is 576, so h is 24; then one third times 22/7 times 49 times 24.',
    },
    {
      id: 's143.i2',
      prompt: 'Find the total surface area of a cone with r = 4 and l = 9, with pi as 3.14.',
      answer: 'About 163.3 square cm.',
      rationale: 'Curved 36 pi plus base 16 pi, giving 52 pi.',
    },
    {
      id: 's143.i3',
      prompt: 'Explain how spinning a right triangle produces a cone, naming what each side becomes.',
      answer: 'The fixed leg is the height, the sweeping leg is the radius, the hypotenuse is the slant height.',
      rationale: 'The construction names all three lengths and makes them a right triangle.',
    },
  ],
  reasoningApplication: [
    {
      id: 's143.r1',
      prompt: 'A student computes a cone’s volume using the slant height instead of the height. Without redoing the arithmetic, say whether the answer is too big or too small, and explain how you know.',
      expectedReasoning:
        'Too big, because the slant height is the hypotenuse and so always exceeds the height, and volume increases with that factor. A strong answer reaches the conclusion from the triangle rather than from a worked example, and notes that this gives a quick check on any cone answer.',
    },
  ],
  interactivePractice: [],
  summary:
    'Spinning a right triangle about a leg generates a cone and names its three lengths, related by l squared = r squared + h squared. The curved surface area pi r l uses the slant height because the surface follows the slope; the volume one third pi r squared h uses the height, and is a third of the matching cylinder.',
  nextStep:
    'Next you will meet shapes with flat sloping faces rather than a curved one.',
  teacher: {
    objective: 'Students generate a cone by rotation and distinguish slant height from height.',
    prerequisiteKnowledge: ['Right-triangle relation', 'Circle area', 'Cylinder volume'],
    modelLanguage: ['Is that the height or the slant height?', 'Which one does this formula need?'],
    teachingNotes: [
      'Spin a paper triangle on a pencil before any formula. The rotation makes the three lengths obvious and the right angle visible.',
      'The h-versus-l confusion is the dominant error. Make students label both on every diagram, even when only one is needed.',
    ],
    quickChecks: ['Which length does this formula use?', 'Is your answer plausible given l exceeds h?'],
    supportForStrugglingLearners: [
      'Cut a right triangle and tape its leg to a pencil to spin it.',
      'Mark h and l in different colours and with written labels on every figure.',
    ],
    extension: ['Ask what happens to the cone as the triangle becomes very tall and thin.'],
    materialsNeeded: ['Paper triangles', 'A pencil to spin them on', 'Ruler'],
  },
  reviewStatus: 'authored_draft',
};

export const SECTION_14_4: AuthoredSection = {
  contentArtifactId: 'ncert_iemh2_s14_4_lesson',
  contentArtifactVersion: 1,
  source: source('14.4', 'Pyramidal Shapes', 12, 'ncert_iemh2_s14_4'),
  competencyCandidates: [],
  competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_iemh2_s14_3'],
    mayAssume: ['Cone surface area and volume', 'Area of a triangle', 'Area of a square'],
    mustNotIntroduce: [{ concept: 'Spheres', belongsToSection: 'ncert_iemh2_s14_5' }, { concept: 'Estimation with solids', belongsToSection: 'ncert_iemh2_s14_6' }],
  },
  learningGoal:
    'You will find the surface area of a pyramid from its net of flat faces, and relate a pyramid to the cone as a limiting case.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: ['Find the area of a triangle.', 'Find the area of a square.', 'Compute the volume of a cone.'],
    ifNotReady: 'Make sure the triangle area formula is fluent; a pyramid’s sloping faces are triangles.',
  },
  vocabulary: [
    { term: 'pyramid', meaning: 'A solid with a polygon base and triangular faces meeting at an apex.' },
    { term: 'slant height of a pyramid', meaning: 'The height of one of its triangular faces, measured from the base edge to the apex.' },
    { term: 'lateral surface', meaning: 'The sloping faces, without the base.' },
  ],
  explanation: [
    'A pyramid has a flat polygon for a base and triangles rising from each of its edges to a single apex. The Egyptian pyramids have square bases and four triangular faces; a triangular base gives four faces in all, three sloping and one beneath.',
    'Because every face is flat, the net is straightforward: the base in the middle with one triangle folded out from each edge. Surface area is then just addition — the base plus the triangles — with no new idea beyond the areas you already know.',
    'The slant height of a pyramid needs care, exactly as with the cone. It is the height of a triangular face, measured from the middle of a base edge up to the apex, and it is not the vertical height of the pyramid. The vertical height runs up the inside to the apex, and the two are different lengths.',
    'The volume follows the same pattern as the cone: one third of the base area times the height. A pyramid and a prism on the same base with the same height stand in the same one-to-three relationship as a cone and its cylinder.',
    'That is the connection worth seeing. Give a pyramid more and more base edges and the base approaches a circle while the sloping faces merge into a curved surface — the cone is what a pyramid becomes in the limit. The shared factor of one third is not a coincidence between two separate formulas.',
  ],
  representations: ['A square-based pyramid net: the base square with four triangles folded out', 'The slant height marked on one triangular face, distinct from the vertical height'],
  visuals: [F_CONE_ROTATION],
  visualsById: { F_CONE_ROTATION },
  workedExamples: [
    {
      id: 's144.we1',
      prompt: 'A square-based pyramid has base edge 10 cm and slant height 13 cm. Find its total surface area.',
      steps: [
        { text: 'The base is a square of area 10 times 10 = 100 square cm.', reasoning: 'The base is one flat face and contributes its own area.' },
        { text: 'Each triangular face has base 10 and height 13, so area is half times 10 times 13 = 65.', reasoning: 'The slant height is the height of the triangular face, which is exactly what the triangle area formula needs.' },
        { text: 'There are four such faces, giving 260 square cm.', reasoning: 'A square base has four edges, so four triangles rise from it.' },
        { text: 'Total is 100 + 260 = 360 square cm.', reasoning: 'Base plus lateral surface, in square units.' },
      ],
      answer: '360 square centimetres.',
    },
    {
      id: 's144.we2',
      prompt: 'The same pyramid has vertical height 12 cm. Find its volume.',
      steps: [
        { text: 'Volume is one third of base area times vertical height.', reasoning: 'The vertical height is required here, not the slant height.' },
        { text: 'Base area is 100 and the height is 12.', reasoning: 'Both values are given, so no conversion is needed.' },
        { text: 'Volume is one third times 100 times 12 = 400 cubic cm.', reasoning: 'Dividing by three, as for the cone.' },
      ],
      answer: '400 cubic centimetres.',
    },
    {
      id: 's144.we3',
      prompt: 'Why do the slant height 13 and the vertical height 12 both appear for one pyramid?',
      steps: [
        { text: 'The vertical height runs from the apex straight down to the centre of the base.', reasoning: 'It measures how tall the solid is.' },
        { text: 'The slant height runs from the apex down to the middle of a base edge, along a face.', reasoning: 'It measures across a sloping face, not down the middle.' },
        { text: 'Those two, with half the base edge of 5, form a right triangle: 25 + 144 = 169.', reasoning: 'The two heights and the half-edge are related exactly as a cone’s r, h and l are.' },
      ],
      answer: 'They are two different distances in the same solid, related by a right triangle.',
    },
  ],
  misconceptionIds: [],
  guidedPractice: [
    {
      id: 's144.g1',
      prompt: 'How many triangular faces does a square-based pyramid have?',
      hint: 'One per base edge.',
      answer: 'Four.',
      rationale: 'Each edge of the base carries one triangle up to the apex.',
    },
    {
      id: 's144.g2',
      prompt: 'Which height does a pyramid’s volume use?',
      hint: 'Does volume measure up the inside or across a face?',
      answer: 'The vertical height.',
      rationale: 'Volume spans from base to apex, exactly as for a cone.',
    },
    {
      id: 's144.g3',
      prompt: 'What does a pyramid become as its base gains more and more edges?',
      hint: 'What does the base approach?',
      answer: 'A cone.',
      rationale: 'The base approaches a circle and the flat faces merge into a curved surface.',
    },
  ],
  independentPractice: [
    {
      id: 's144.i1',
      prompt: 'A square-based pyramid has base edge 6 cm and slant height 5 cm. Find its lateral surface area.',
      answer: '60 square cm.',
      rationale: 'Four triangles, each of area 15.',
    },
    {
      id: 's144.i2',
      prompt: 'A pyramid has base area 48 square cm and height 9 cm. Find its volume.',
      answer: '144 cubic cm.',
      rationale: 'One third of 48 times 9.',
    },
    {
      id: 's144.i3',
      prompt: 'Explain why a pyramid and a cone share the factor of one third.',
      answer: 'Because a cone is the limiting case of a pyramid as the base gains edges.',
      rationale: 'The same relationship to the prism or cylinder on the same base carries over.',
    },
  ],
  reasoningApplication: [
    {
      id: 's144.r1',
      prompt: 'A pyramid and a cone with the same base area and height have the same volume. Explain why that is unsurprising given how the two shapes are related.',
      expectedReasoning:
        'The cone is what a pyramid approaches as its base gains edges, and the one third of base times height holds throughout that process, so the limit shares it. A strong answer frames the cone formula as one case of a single rule rather than as a separate result that happens to match.',
    },
  ],
  interactivePractice: [],
  summary:
    'A pyramid’s faces are all flat, so its surface area is the base plus its triangles, computed with the slant height of a face. Its volume is one third of base area times vertical height — the same rule as the cone, which is the pyramid’s limiting case.',
  nextStep:
    'Next you will meet the one solid with no net at all.',
  teacher: {
    objective: 'Students compute pyramid surface area and volume and relate pyramids to cones.',
    prerequisiteKnowledge: ['Triangle area', 'Cone volume'],
    modelLanguage: ['Slant height or vertical height?', 'How many triangles rise from this base?'],
    teachingNotes: [
      'The two heights are the whole difficulty. Draw the internal right triangle linking them and the half-edge once, explicitly.',
      'The limiting-case connection to the cone is worth stating; it turns two formulas into one idea.',
    ],
    quickChecks: ['Which height does this need?', 'What is the base, and what rises from it?'],
    supportForStrugglingLearners: [
      'Fold a paper net of a square-based pyramid and mark both heights on it.',
      'List the faces before computing anything.',
    ],
    extension: ['Ask for the surface area of a triangular-based pyramid with all edges equal.'],
    materialsNeeded: ['Paper nets', 'Scissors', 'Ruler'],
  },
  reviewStatus: 'authored_draft',
};

export const SECTION_14_5_SPHERE: AuthoredSection = {
  contentArtifactId: 'ncert_iemh2_s14_5_sphere_lesson',
  contentArtifactVersion: 1,
  source: source('14.5', 'Spheres and Hemispheres', 13, 'ncert_iemh2_s14_5'),
  competencyCandidates: [],
  competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_iemh2_s14_3'],
    mayAssume: ['Area of a circle', 'Cone and cylinder volumes', 'Radius and diameter'],
    mustNotIntroduce: [{ concept: 'Hemispheres', belongsToSection: 'ncert_iemh2_s14_5' }, { concept: 'Estimation with solids', belongsToSection: 'ncert_iemh2_s14_6' }],
  },
  learningGoal:
    'You will give the surface area and volume of a sphere, and explain how a winding activity makes the surface-area result visible.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: ['Find the area of a circle.', 'Say what the radius of a sphere means.', 'Compute a volume in cubic units.'],
    ifNotReady: 'Revisit the area of a circle; both sphere results are expressed in terms of it.',
  },
  vocabulary: [
    { term: 'sphere', meaning: 'All the points at one fixed distance from a centre, in space.' },
    { term: 'great circle', meaning: 'The circle you get by cutting a sphere through its centre, of the same radius.' },
    { term: 'curvature', meaning: 'The property that makes a sphere impossible to flatten without distortion.' },
  ],
  explanation: [
    'A sphere is the three-dimensional version of a circle: all the points at one fixed distance from a centre. Cut it straight through the centre and the cut face is a circle of the same radius — a great circle — which is why a sphere can be reasoned about through circles.',
    'Every other solid in this chapter unfolds. A sphere does not. There is no net, no way to cut it and lay it flat without stretching or tearing, and that is not a gap in the mathematics but a property of the surface. It is the same property that makes every flat map of the earth distort something.',
    'So the surface area is found a different way. Wind a thread evenly over half the sphere until it is covered, then unwind that thread and coil it flat on circles of the same radius. The thread from the hemisphere fills two such circles, so the whole sphere takes four: the surface area is 4 pi r squared — exactly four times the area of its great circle.',
    'That is an activity rather than a proof, and it is worth saying so. It makes the result visible and believable at this stage; a derivation belongs to later mathematics.',
    'The volume is 4/3 pi r cubed. The relationship with the cone is worth noticing: a sphere of radius r has the same volume as four cones of radius r and height r, which is the kind of comparison that makes a formula memorable for a reason rather than by repetition.',
  ],
  representations: ['A great circle with its radius, beside the circles the unwound thread fills', 'The count of circles filled, which is where the 4 comes from'],
  visuals: [F_SPHERE],
  visualsById: { F_SPHERE },
  workedExamples: [
    {
      id: 's145a.we1',
      prompt: 'Find the surface area of a sphere of radius 7 cm, taking pi as 22/7.',
      steps: [
        { text: 'Surface area is 4 pi r squared, four times the great circle.', reasoning: 'The 4 comes from the winding activity: the thread fills four circles of radius r.' },
        { text: 'r squared is 49, and 22/7 times 49 is 154.', reasoning: 'That is the area of the great circle.' },
        { text: 'Four times 154 is 616 square cm.', reasoning: 'Square units, because this is an area.' },
      ],
      answer: '616 square centimetres.',
      visualRef: 'F_SPHERE',
    },
    {
      id: 's145a.we2',
      prompt: 'Find the volume of a sphere of radius 3 cm, taking pi as 3.14.',
      steps: [
        { text: 'Volume is 4/3 pi r cubed.', reasoning: 'Volume depends on the cube of the radius, not its square.' },
        { text: 'r cubed is 27, so 4/3 times 27 is 36.', reasoning: 'Dividing 27 by 3 then multiplying by 4 avoids fractions.' },
        { text: '36 times 3.14 is about 113 cubic cm.', reasoning: 'Cubic units, because this is a volume.' },
      ],
      answer: 'About 113 cubic centimetres.',
    },
    {
      id: 's145a.we3',
      prompt: 'A sphere has surface area 100 pi square cm. Find its radius and then its volume.',
      steps: [
        { text: 'Set 4 pi r squared = 100 pi, so r squared = 25 and r = 5 cm.', reasoning: 'Working backwards from the surface area to the radius; the pi cancels on both sides.' },
        { text: 'Volume is 4/3 pi times 125.', reasoning: 'Cubing the radius just found.' },
        { text: 'That is 500/3 pi, about 523.6 cubic cm.', reasoning: 'Leaving pi exact until the final step keeps the answer precise.' },
      ],
      answer: 'Radius 5 cm; volume about 523.6 cubic cm.',
    },
  ],
  misconceptionIds: [],
  guidedPractice: [
    {
      id: 's145a.g1',
      prompt: 'How many great circles does a sphere’s surface area equal?',
      hint: 'What did the winding show?',
      answer: 'Four.',
      rationale: 'The thread from the whole sphere fills four circles of radius r.',
    },
    {
      id: 's145a.g2',
      prompt: 'Why has a sphere no net?',
      hint: 'Can a curved surface be flattened without stretching?',
      answer: 'Because its surface cannot be flattened without distortion.',
      rationale: 'That is the same reason every flat map of the earth distorts something.',
    },
    {
      id: 's145a.g3',
      prompt: 'A sphere has radius 2. Which is larger, 4 pi r squared or 4/3 pi r cubed?',
      hint: 'Compute both and compare, watching the units.',
      answer: 'They are different quantities and cannot be compared.',
      rationale: 'One is an area in square units and the other a volume in cubic units.',
    },
  ],
  independentPractice: [
    {
      id: 's145a.i1',
      prompt: 'Find the surface area of a sphere of radius 14 cm, with pi as 22/7.',
      answer: '2464 square cm.',
      rationale: 'Great circle 616, times four.',
    },
    {
      id: 's145a.i2',
      prompt: 'Find the volume of a sphere of radius 6 cm, with pi as 3.14.',
      answer: 'About 904.3 cubic cm.',
      rationale: '4/3 times 216 is 288, times pi.',
    },
    {
      id: 's145a.i3',
      prompt: 'Explain why the winding activity is called an activity rather than a proof.',
      answer: 'Because it makes the result visible and believable without deriving it.',
      rationale: 'A derivation of the sphere’s surface area belongs to later mathematics.',
    },
  ],
  reasoningApplication: [
    {
      id: 's145a.r1',
      prompt: 'A sphere’s radius is doubled. Explain what happens to its surface area and to its volume, and why the two answers differ.',
      expectedReasoning:
        'Surface area multiplies by four and volume by eight, because one depends on r squared and the other on r cubed. A strong answer argues from the powers rather than computing two examples, and connects this to why large objects have proportionally less surface than small ones.',
    },
  ],
  interactivePractice: [],
  summary:
    'A sphere is the set of points at a fixed distance from a centre, and it has no net because its surface cannot be flattened. A winding activity shows its surface area to be four times its great circle, 4 pi r squared, and its volume is 4/3 pi r cubed.',
  nextStep:
    'Next you will cut the sphere in half, where the curved surface and the flat face must be counted separately.',
  teacher: {
    objective: 'Students apply the sphere results and explain the winding activity.',
    prerequisiteKnowledge: ['Circle area', 'Cubes of numbers'],
    modelLanguage: ['Which power of r does this use?', 'Square units or cubic?'],
    teachingNotes: [
      'Do the winding with thread on a ball if at all possible. The count of circles is the whole justification students have at this stage.',
      'Say plainly that it is an activity, not a proof. Students who think they have proved it are misled.',
    ],
    quickChecks: ['How many great circles?', 'Why is there no net?'],
    supportForStrugglingLearners: [
      'Wind thread round half a ball and coil it onto drawn circles of the same radius.',
      'Keep the area and volume formulas apart by writing their units beside them.',
    ],
    extension: ['Ask why no flat world map can get every distance right.'],
    materialsNeeded: ['A ball', 'Thread', 'Paper circles of the same radius'],
  },
  reviewStatus: 'authored_draft',
};

export const SECTION_14_5_HEMI: AuthoredSection = {
  contentArtifactId: 'ncert_iemh2_s14_5_hemisphere_lesson',
  contentArtifactVersion: 1,
  source: source('14.5', 'Spheres and Hemispheres', 13, 'ncert_iemh2_s14_5'),
  competencyCandidates: [],
  competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_iemh2_s14_5'],
    mayAssume: ['Sphere surface area and volume', 'Area of a circle', 'Curved versus total surface for a cylinder'],
    mustNotIntroduce: [{ concept: 'Estimation with solids', belongsToSection: 'ncert_iemh2_s14_6' }],
  },
  learningGoal:
    'You will distinguish the curved surface area of a hemisphere from its total surface area, and compute its volume.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: ['Give the surface area of a sphere.', 'Find the area of a circle.', 'Explain what total surface area included for a cylinder.'],
    ifNotReady: 'Make sure the sphere results are secure; a hemisphere is half of one, with a flat face added.',
  },
  vocabulary: [
    { term: 'hemisphere', meaning: 'Half a sphere, cut through the centre.' },
    { term: 'curved surface area', meaning: 'The dome alone, without the flat circular face.' },
    { term: 'total surface area', meaning: 'The dome plus the flat circle.' },
  ],
  explanation: [
    'Cut a sphere through its centre and you get two hemispheres. Each has two surfaces of quite different kinds: the curved dome, and the flat circular face where the cut was made.',
    'The dome is half the sphere’s surface, so its area is half of 4 pi r squared, which is 2 pi r squared. That is the curved surface area, and it is all you need for something open like a bowl seen from outside.',
    'The flat face is a circle of radius r, with area pi r squared. Add it and the total surface area is 3 pi r squared. The three is not a new fact to memorise: it is two from the dome plus one from the circle.',
    'Which to use depends on the object, exactly as with a cylinder. A solid wooden hemisphere to be painted all over needs the total. A bowl needs the curved part. Reading the question to see whether the flat face is exposed is part of the mathematics.',
    'Volume has no such subtlety. Half a sphere holds half the volume: 2/3 pi r cubed. The curved-versus-total question is about surface only, which is worth saying because students who have just met it tend to look for a matching split in the volume.',
  ],
  representations: ['A great circle cut by its diameter, with the arc and the flat face labelled separately', 'The two areas named so the three in 3 pi r squared can be traced'],
  visuals: [F_HEMISPHERE],
  visualsById: { F_HEMISPHERE },
  workedExamples: [
    {
      id: 's145b.we1',
      prompt: 'Find the curved surface area of a hemisphere of radius 7 cm, with pi as 22/7.',
      steps: [
        { text: 'Curved surface is half the sphere’s, so 2 pi r squared.', reasoning: 'Cutting the sphere in half halves the curved surface and adds nothing to it.' },
        { text: 'r squared is 49, so 2 times 22/7 times 49.', reasoning: 'Substituting the radius into the halved sphere formula.' },
        { text: 'That is 308 square cm.', reasoning: 'The flat face is not included, because the question asked for the curved surface.' },
      ],
      answer: '308 square centimetres.',
      visualRef: 'F_HEMISPHERE',
    },
    {
      id: 's145b.we2',
      prompt: 'Find the total surface area of the same hemisphere.',
      steps: [
        { text: 'Total adds the flat circular face to the curved surface.', reasoning: 'The cut creates a new surface that was not part of the sphere.' },
        { text: 'The circle has area 22/7 times 49 = 154 square cm.', reasoning: 'A circle of the same radius as the hemisphere.' },
        { text: 'Total is 308 + 154 = 462 square cm, which is 3 pi r squared.', reasoning: 'Two parts from the dome plus one from the circle gives the factor of three.' },
      ],
      answer: '462 square centimetres.',
    },
    {
      id: 's145b.we3',
      prompt: 'A solid hemisphere of radius 5 cm is to be painted all over. Which area applies, and what is it with pi as 3.14?',
      steps: [
        { text: 'Painted all over means every exposed surface, including the flat face.', reasoning: 'Deciding which surfaces are exposed is the first step, before any formula.' },
        { text: 'So the total applies: 3 pi r squared.', reasoning: 'The dome and the flat circle are both painted.' },
        { text: 'That is 3 times 3.14 times 25, about 235.5 square cm.', reasoning: 'Substituting r = 5 into the total surface area expression.' },
      ],
      answer: 'The total surface area, about 235.5 square centimetres.',
    },
  ],
  misconceptionIds: [],
  guidedPractice: [
    {
      id: 's145b.g1',
      prompt: 'What is the curved surface area of a hemisphere of radius 3, in terms of pi?',
      hint: 'Half the sphere’s surface.',
      answer: '18 pi.',
      rationale: 'Two pi times 9.',
    },
    {
      id: 's145b.g2',
      prompt: 'Where does the 3 in 3 pi r squared come from?',
      hint: 'What are the two parts of the surface?',
      answer: 'Two from the dome and one from the flat circle.',
      rationale: 'The factor is a sum, not a separate fact.',
    },
    {
      id: 's145b.g3',
      prompt: 'A bowl is a hemisphere open at the top. Which surface area describes its outside?',
      hint: 'Is the flat face a surface of the bowl?',
      answer: 'The curved surface only.',
      rationale: 'There is no flat face on an open bowl; the rim encloses nothing.',
    },
  ],
  independentPractice: [
    {
      id: 's145b.i1',
      prompt: 'Find the total surface area of a hemisphere of radius 10 cm, with pi as 3.14.',
      answer: '942 square cm.',
      rationale: 'Three times 3.14 times 100.',
    },
    {
      id: 's145b.i2',
      prompt: 'Find the volume of a hemisphere of radius 6 cm, with pi as 3.14.',
      answer: 'About 452.2 cubic cm.',
      rationale: 'Two thirds of pi times 216.',
    },
    {
      id: 's145b.i3',
      prompt: 'Explain why the curved-versus-total question arises for surface area but not for volume.',
      answer: 'Because cutting creates a new surface but simply halves the space inside.',
      rationale: 'Volume has no analogous split.',
    },
  ],
  reasoningApplication: [
    {
      id: 's145b.r1',
      prompt: 'A hemisphere and a cone have the same radius and the same height as that radius. Compare their volumes, and say what the comparison tells you about the two shapes.',
      expectedReasoning:
        'The hemisphere is 2/3 pi r cubed and the cone is 1/3 pi r cubed, so the hemisphere holds exactly twice as much. A strong answer notices both shapes have the same circular base and the same height, so the difference is entirely in how each fills the space between base and top.',
    },
  ],
  interactivePractice: [],
  summary:
    'A hemisphere has a curved dome of area 2 pi r squared and a flat circular face of pi r squared, so its total surface area is 3 pi r squared. Which one a question wants depends on whether the flat face is exposed, and the volume is simply half the sphere’s.',
  nextStep:
    'Next you will use every result in this chapter on problems where the measurements are not given to you.',
  teacher: {
    objective: 'Students distinguish curved from total surface area for a hemisphere.',
    prerequisiteKnowledge: ['Sphere surface area', 'Circle area'],
    modelLanguage: ['Is the flat face exposed here?', 'Curved or total?'],
    teachingNotes: [
      'This split is the chapter’s most error-prone point, which is why it has its own lesson. Make students state which surfaces are exposed before any formula.',
      'Head off the matching-split expectation for volume explicitly; students look for one.',
    ],
    quickChecks: ['Which surfaces does this object actually have?', 'Where does the 3 come from?'],
    supportForStrugglingLearners: [
      'Hold a halved ball and point at the two surfaces separately.',
      'List the exposed surfaces in words before choosing a formula.',
    ],
    extension: ['Ask for the surface area of a solid made of a hemisphere on a cylinder, and which faces vanish.'],
    materialsNeeded: ['A halved ball or bowl', 'Paper circles'],
  },
  reviewStatus: 'authored_draft',
};

export const SECTION_14_6: AuthoredSection = {
  contentArtifactId: 'ncert_iemh2_s14_6_lesson',
  contentArtifactVersion: 1,
  source: source('14.6', 'Areas and Volumes Around Us', 19, 'ncert_iemh2_s14_6'),
  competencyCandidates: [],
  competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_iemh2_s14_5'],
    mayAssume: ['All the surface area and volume results of this chapter', 'Rounding and approximation', 'Unit conversion'],
    mustNotIntroduce: [],
  },
  learningGoal:
    'You will estimate areas and volumes of real objects where exact measurements are unavailable, and defend an estimate by the assumptions it rests on.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: ['Compute the volume of a cuboid, cylinder and sphere.', 'Convert between centimetres and metres.', 'Round sensibly.'],
    ifNotReady: 'Make sure the formulas are fluent; this lesson is about choosing and assuming, not about recalling.',
  },
  vocabulary: [
    { term: 'guesstimate', meaning: 'A reasoned estimate built from assumptions you can state.' },
    { term: 'order of magnitude', meaning: 'Roughly what power of ten an answer is.' },
    { term: 'assumption', meaning: 'A value you choose because it is not given, and which your answer depends on.' },
  ],
  explanation: [
    'Real questions rarely come with measurements. How much air is in this classroom? How many Earths would fit inside Jupiter? These have answers, but no one hands you the numbers.',
    'The method is to model, assume and compute. Treat the classroom as a cuboid — it is not exactly one, and that is fine — estimate its dimensions by pacing, and multiply. State the assumptions as you go, because they are what someone else would need to disagree with.',
    'Two people doing this honestly will get different answers, and that is expected rather than a failure. One paces 8 metres and another 9; one rounds early and one late. What makes an estimate defensible is not matching someone else, it is that every step follows from a stated assumption and the arithmetic is right.',
    'Units need care at this scale. A classroom in metres gives cubic metres; converting to litres or to cubic centimetres needs a factor that is easy to get wrong, since a cubic metre is a million cubic centimetres, not a hundred. Checking the order of magnitude catches most slips: an answer should be in the right power of ten even if the leading digit is arguable.',
    'Choosing the model is the real skill. A water tank is a cylinder, a planet is a sphere, a room is a cuboid — none exactly, all usefully. A model that is close enough to answer the question is doing its job, and saying which model you chose is part of the answer.',
  ],
  representations: ['A real object reduced to the solid that approximates it, with estimated dimensions marked', 'The assumptions listed beside the computation'],
  visuals: [F_CUBOID_NET],
  visualsById: { F_CUBOID_NET },
  workedExamples: [
    {
      id: 's146.we1',
      prompt: 'Estimate the volume of air in a classroom.',
      steps: [
        { text: 'Model the room as a cuboid — close enough for this purpose.', reasoning: 'Choosing the model is the first decision and should be stated, not assumed silently.' },
        { text: 'Estimate by pacing: about 9 m long, 7 m wide, 3 m high.', reasoning: 'Pacing gives dimensions good to perhaps 10 per cent, which is enough for an estimate.' },
        { text: 'Volume is 9 times 7 times 3 = 189 cubic metres.', reasoning: 'Multiplying the three estimated dimensions.' },
        { text: 'Round to about 190 cubic metres, and state that it assumes an empty rectangular room.', reasoning: 'Carrying three significant figures would claim precision the pacing cannot support.' },
      ],
      answer: 'About 190 cubic metres, assuming a 9 by 7 by 3 metre empty room.',
      visualRef: 'F_CUBOID_NET',
    },
    {
      id: 's146.we2',
      prompt: 'Jupiter’s radius is about 11 times Earth’s. Roughly how many Earths would fit inside?',
      steps: [
        { text: 'Both are modelled as spheres, so volume goes with the cube of the radius.', reasoning: 'Treating planets as spheres is the model; the cube comes from the volume formula.' },
        { text: 'The ratio of volumes is 11 cubed.', reasoning: 'Only the ratio is needed, so neither radius has to be known.' },
        { text: '11 cubed is 1331, so roughly 1300 Earths.', reasoning: 'Rounding to two figures, since the radius ratio was itself approximate.' },
        { text: 'This assumes perfect spheres and no wasted space in packing.', reasoning: 'Stating the assumption marks the answer as an estimate of volume, not of how many balls actually fit.' },
      ],
      answer: 'Roughly 1300, by volume.',
    },
    {
      id: 's146.we3',
      prompt: 'Two students estimate the classroom at 190 and 240 cubic metres. Is one of them wrong?',
      steps: [
        { text: 'Compare the assumptions rather than the answers.', reasoning: 'The answers differ because the inputs differ, so the inputs are where the disagreement lives.' },
        { text: 'One paced 9 by 7 and the other 10 by 8, both plausible for the same room.', reasoning: 'Pacing is not precise, and both measurements are defensible.' },
        { text: 'Both answers are the same order of magnitude — hundreds of cubic metres.', reasoning: 'That agreement is what an estimate is for; the leading digit is not the point.' },
      ],
      answer: 'Neither is wrong. Both are defensible estimates, and they agree on the order of magnitude.',
    },
  ],
  misconceptionIds: [],
  guidedPractice: [
    {
      id: 's146.g1',
      prompt: 'What solid best models a cylindrical water tank?',
      hint: 'What shape is its cross-section?',
      answer: 'A cylinder.',
      rationale: 'A circular cross-section with a constant height is exactly a cylinder.',
    },
    {
      id: 's146.g2',
      prompt: 'How many cubic centimetres are in a cubic metre?',
      hint: 'How many centimetres in a metre, and how many directions?',
      answer: 'A million.',
      rationale: 'A hundred in each of three directions gives 100 cubed.',
    },
    {
      id: 's146.g3',
      prompt: 'Why state your assumptions in an estimate?',
      hint: 'What would someone need to disagree with your answer?',
      answer: 'Because the answer depends on them.',
      rationale: 'Without the assumptions, a reader cannot judge or reproduce the estimate.',
    },
  ],
  independentPractice: [
    {
      id: 's146.i1',
      prompt: 'Estimate the volume of water in a cylindrical tank of radius 1 m filled to 2 m, with pi as 3.14.',
      answer: 'About 6.3 cubic metres, or 6300 litres.',
      rationale: 'Base area 3.14 times height 2.',
    },
    {
      id: 's146.i2',
      prompt: 'A spherical ball has radius 7 cm. Estimate its volume with pi as 22/7.',
      answer: 'About 1437 cubic cm.',
      rationale: 'Four thirds times 22/7 times 343.',
    },
    {
      id: 's146.i3',
      prompt: 'Explain why two careful people can produce different guesstimates for the same object.',
      answer: 'Because they make different but defensible assumptions about the measurements.',
      rationale: 'An estimate inherits the uncertainty of its inputs.',
    },
  ],
  reasoningApplication: [
    {
      id: 's146.r1',
      prompt: 'An estimate is defensible when its assumptions are stated and its arithmetic is right, even if another person’s answer differs. Explain how you would decide that an estimate is actually wrong rather than merely different.',
      expectedReasoning:
        'It is wrong if an assumption is implausible, the model misrepresents the object, the arithmetic fails, or the units are mishandled — typically showing up as an answer in the wrong order of magnitude. A strong answer separates disagreement within a reasonable range from an error that puts the answer in the wrong power of ten.',
    },
  ],
  interactivePractice: [],
  summary:
    'A guesstimate models a real object as a solid, estimates its dimensions, states the assumptions and computes. Different careful people reach different answers, and an estimate is judged by its assumptions, its units and its order of magnitude rather than by matching someone else.',
  nextStep:
    'That completes the chapter: every solid, its surfaces, its volume, and what to do when no one gives you the measurements.',
  teacher: {
    objective: 'Students model real objects as solids and defend estimates by their assumptions.',
    prerequisiteKnowledge: ['All chapter formulas', 'Unit conversion', 'Rounding'],
    modelLanguage: ['What shape are you treating this as?', 'What did you assume?'],
    teachingNotes: [
      'Collect several answers to the classroom question and compare the assumptions rather than ranking the answers. That discussion is the lesson.',
      'Cubic unit conversion is the reliable trap; do the million explicitly rather than letting students guess.',
      'Reward a stated assumption as much as a correct multiplication.',
    ],
    quickChecks: ['Which solid models this?', 'Is your answer the right order of magnitude?'],
    supportForStrugglingLearners: [
      'Pace the actual classroom and record the dimensions before computing.',
      'Write assumptions in a list beside the working.',
    ],
    extension: ['Ask how thick a layer of water would cover a region, given a rainfall figure.'],
    materialsNeeded: ['Measuring tape', 'Calculator'],
  },
  reviewStatus: 'authored_draft',
};

/** Chapter 14, in the book's order. Seven lessons from six sections, with
 *  §14.5 split into the sphere and the hemisphere. No merges. */
export function mensurationChapterSections(): AuthoredSection[] {
  return [
    SECTION_14_1,
    SECTION_14_2,
    SECTION_14_3,
    SECTION_14_4,
    SECTION_14_5_SPHERE,
    SECTION_14_5_HEMI,
    SECTION_14_6,
  ];
}
