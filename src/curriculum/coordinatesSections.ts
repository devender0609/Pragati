// ===========================================================================
// v0.84.0 checkpoint 35 — CLASS 9 CHAPTER 1: COORDINATES.
//
// An ordinary production chapter, not a pilot. Chapter 13 already showed
// that a coordinate grid can be drawn with the existing geometry figure —
// axes are segments, plotted points are points — so this chapter tests
// whether coordinate INSTRUCTION needs anything the architecture lacks.
//
// Every plotted point below sits at its true position on the grid: 10 svg
// units to the coordinate unit, measured from the origin. A figure that
// places (3, 2) where (2, 3) belongs would teach the error the lesson is
// trying to prevent.
//
// One merge (§1.1 + §1.2) and two splits (§1.3 and §1.4, each into two).
// ===========================================================================

import type { AuthoredSection } from './authoredSection';
import type { GeometryFigureSpec } from './visualSpecification';

export const COORDINATES_CHAPTER_ID = 'ncert_iemh1_ch01';

const BOOK = 'Ganita Manjari, Textbook of Mathematics for Grade 9 (Part I)';
const SRC = 'https://ncert.nic.in/textbook/pdf/iemh1dd.zip';
const INSPECTED = '2026-10-07';

const source = (
  sectionNumber: string,
  exactTitle: string,
  startPage: number,
  officialSectionId: string
) => ({
  officialChapterId: COORDINATES_CHAPTER_ID,
  officialSectionId,
  sectionNumber,
  exactTitle,
  startPage,
  textbook: BOOK,
  sourceReference: SRC,
  inspectionDate: INSPECTED,
});

// 10 svg units per coordinate unit, origin at (110, 110); y inverted because
// svg counts downward. pt(3, 2) -> x 140, y 90.
const pt = (id: string, x: number, y: number, label: string) => ({
  id,
  x: 110 + x * 10,
  y: 110 - y * 10,
  label,
});

const AXES = [
  pt('xl', -9, 0, 'x'),
  pt('xr', 9, 0, "x'"),
  pt('yt', 0, 9, 'y'),
  pt('yb', 0, -9, "y'"),
];
const AXIS_SEGMENTS = [
  { from: 'xl', to: 'xr' },
  { from: 'yt', to: 'yb' },
];

const F_PLOT: GeometryFigureSpec = {
  type: 'geometry_figure',
  purpose: 'show_definition',
  status: 'concept_specific',
  points: [
    ...AXES,
    pt('o', 0, 0, 'O'),
    pt('a', 3, 2, 'A (3, 2)'),
    pt('b', 2, 3, 'B (2, 3)'),
    pt('fx', 3, 0, '(3, 0)'),
  ],
  segments: [
    ...AXIS_SEGMENTS,
    { from: 'fx', to: 'a', mark: 'dashed' },
    { from: 'o', to: 'fx', mark: 'dashed' },
  ],
  caption: 'A (3, 2) and B (2, 3) are different points — the order of the pair decides which.',
  altText:
    'A coordinate grid with the origin O where the two axes cross. Point A is 3 units right of the origin and 2 units up, labelled (3, 2). Point B is 2 units right and 3 units up, labelled (2, 3). A and B are in different places. Dashed segments trace the route to A: 3 along the x-axis, then 2 upward.',
};

const F_QUADRANTS: GeometryFigureSpec = {
  type: 'geometry_figure',
  purpose: 'compare_cases',
  status: 'concept_specific',
  points: [
    ...AXES,
    pt('o', 0, 0, 'O'),
    pt('p', 4, 3, 'P (4, 3)'),
    pt('q', -4, 3, 'Q (−4, 3)'),
    pt('r', -4, -3, 'R (−4, −3)'),
    pt('s', 4, -3, 'S (4, −3)'),
    pt('t', 5, 0, 'T (5, 0)'),
  ],
  segments: [...AXIS_SEGMENTS],
  caption: 'The signs of the two coordinates say which region a point is in.',
  altText:
    'A coordinate grid with four plotted points, one in each region the axes make. P at (4, 3) sits 4 units right of the origin and 3 above it, with both coordinates positive. Q at (minus 4, 3) sits 4 units left and 3 above. R at (minus 4, minus 3) sits 4 left and 3 below. S at (4, minus 3) sits 4 right and 3 below. Point T at (5, 0) sits 5 units right, on the x-axis itself, where the second coordinate is zero.',
};

const F_DISTANCE: GeometryFigureSpec = {
  type: 'geometry_figure',
  purpose: 'support_proof',
  status: 'concept_specific',
  points: [
    ...AXES,
    pt('o', 0, 0, 'O'),
    pt('a', 1, 2, 'A (1, 2)'),
    pt('b', 5, 5, 'B (5, 5)'),
    pt('c', 5, 2, 'C (5, 2)'),
  ],
  segments: [
    ...AXIS_SEGMENTS,
    { from: 'a', to: 'b' },
    { from: 'a', to: 'c', mark: 'dashed', label: '4' },
    { from: 'c', to: 'b', mark: 'dashed', label: '3' },
  ],
  angleMarks: [{ at: 'c', from: 'a', to: 'b', right: true }],
  caption: 'Dropping a perpendicular turns the gap between A and B into a right triangle.',
  altText:
    'A coordinate grid, with its two axes crossing at the origin, carrying A at (1, 2) and B at (5, 5) joined by a straight segment. A dashed horizontal segment runs from A to C at (5, 2), of length 4, and a dashed vertical segment runs from C up to B, of length 3. The angle at C is marked as a right angle, so AB is the hypotenuse of a 3-4 right triangle.',
};

const F_MIDPOINT: GeometryFigureSpec = {
  type: 'geometry_figure',
  purpose: 'show_construction',
  status: 'concept_specific',
  points: [
    ...AXES,
    pt('o', 0, 0, 'O'),
    pt('p', -3, -2, 'P (−3, −2)'),
    pt('q', 5, 4, 'Q (5, 4)'),
    pt('m', 1, 1, 'M (1, 1)'),
  ],
  segments: [
    ...AXIS_SEGMENTS,
    { from: 'p', to: 'm', mark: 'single_tick' },
    { from: 'm', to: 'q', mark: 'single_tick' },
  ],
  caption: 'M is the same distance from P as from Q, and lies on the segment joining them.',
  altText:
    'A coordinate grid whose axes cross at the origin, with P at (minus 3, minus 2) below and left of it and Q at (5, 4) above and right of it, joined by a straight segment. M at (1, 1) lies on that segment, and the two halves PM and MQ carry single ticks showing they are equal, so M is the midpoint.',
};

export const SECTION_1_1_2: AuthoredSection = {
  contentArtifactId: 'ncert_iemh1_s1_1_2_lesson',
  contentArtifactVersion: 1,
  source: {
    ...source('1.1', 'Introduction', 1, 'ncert_iemh1_s1_1'),
    // The merged lesson covers §1.2 Settling In as well.
    additionalOfficialSectionIds: ['ncert_iemh1_s1_2'],
  },
  competencyCandidates: [],
  competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: [],
    mayAssume: ['Class 8 work with grids and maps', 'Measuring distance along a line', 'Positive and negative numbers'],
    mustNotIntroduce: [{ concept: 'Plotting points against two axes', belongsToSection: 'ncert_iemh1_s1_3' }, { concept: 'Distance between two points', belongsToSection: 'ncert_iemh1_s1_4' }],
  },
  learningGoal:
    'You will explain why describing a location needs an agreed framework, and recognise that the system used today was built up over centuries rather than given.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: ['Describe where something is using two measurements.', 'Read a position from a simple grid.', 'Say what a reference point is.'],
    ifNotReady: 'No special preparation is needed; bring a map or a seating plan if you have one.',
  },
  vocabulary: [
    { term: 'coordinate system', meaning: 'An agreed framework that uses numbers to describe an exact location.' },
    { term: 'reference point', meaning: 'The fixed point everything else is measured from.' },
    { term: 'framework', meaning: 'The choices — where to measure from, in which directions, in what units — that make a description readable by someone else.' },
  ],
  explanation: [
    'Describing where something is turns out to need agreement. Saying a seat is "three along and two back" means nothing until someone says three along from where, and in which direction. Change the starting corner and the same seat gets a different description.',
    'So a coordinate system is not the numbers. It is the set of choices that make the numbers mean something: a point to measure from, directions to measure in, and units to measure with. Fix those and two people reading the same pair of numbers reach the same place.',
    'This is also why the same location can have many correct descriptions. A seat is "three along, two back" in one scheme and something else in another, and neither is wrong — they answer the same question against different frameworks.',
    'The idea has a long history and did not arrive complete. Indian mathematicians, Brahmagupta among them, developed methods for locating places on the earth, and that work passed into Arabic geography, where a reference meridian was chosen so that positions could be stated as numbers from an agreed origin. Al-Biruni used Indian methods in his own measurements of position.',
    'What that history shows is that the convenience you are about to use was constructed. Choosing where zero sits, which directions count as positive, and what the units measure are decisions, made over a long time, that the rest of this chapter will simply assume.',
  ],
  representations: ['A location described from two different starting corners, giving two different pairs', 'The same place reached by both descriptions'],
  visuals: [],
  visualsById: {  },
  workedExamples: [
    {
      id: 's112.we1',
      prompt: 'A classroom has 6 columns and 5 rows. A seat is described as "column 3, row 2" counted from the front-left corner. Describe the same seat counted from the front-right corner.',
      steps: [
        { text: 'Counting columns from the right reverses their order: column 3 from the left is column 4 from the right.', reasoning: 'With 6 columns, the column numbered k from one end is numbered 7 minus k from the other.' },
        { text: 'The row count is unchanged, since only the left-right reference moved.', reasoning: 'Changing one reference direction affects only the measurement along that direction.' },
        { text: 'So the seat is "column 4, row 2" in the new scheme.', reasoning: 'Both descriptions name the same seat; they differ because the framework differs.' },
      ],
      answer: 'Column 4, row 2 — the same seat, described against a different corner.',
    },
    {
      id: 's112.we2',
      prompt: 'Two people describe a point as (2, 5) and (5, 2) and both insist they are right. Can they both be?',
      steps: [
        { text: 'Check whether they are using the same framework.', reasoning: 'The numbers alone cannot settle it; the framework is what gives them meaning.' },
        { text: 'If both measure along first and up second from the same corner, the pairs name different points and only one can be right.', reasoning: 'Within one agreed system the order of the pair is part of the description.' },
        { text: 'If one measures up first and along second, both can describe the same point.', reasoning: 'Swapping which direction is counted first changes the pair without moving the point.' },
      ],
      answer: 'Only if their frameworks differ. Within one agreed system, (2, 5) and (5, 2) are different points.',
    },
    {
      id: 's112.we3',
      prompt: 'Why is a single number not enough to describe a position in a room?',
      steps: [
        { text: 'A single number fixes how far along one direction you are.', reasoning: 'It answers one question and leaves the other open.' },
        { text: 'Every position across the room that is that far along still fits.', reasoning: 'A whole line of positions satisfies one measurement, so the description does not pick out a point.' },
        { text: 'A second measurement in a different direction cuts that line down to one place.', reasoning: 'Two independent measurements are what reduce the possibilities to a single location.' },
      ],
      answer: 'Because one number leaves a whole line of possibilities; two independent measurements are needed.',
    },
  ],
  misconceptionIds: [],
  guidedPractice: [
    {
      id: 's112.g1',
      prompt: 'Why must a coordinate system fix a reference point?',
      hint: 'What would "three along" mean without one?',
      answer: 'Because distances have to be measured from somewhere.',
      rationale: 'Without an agreed starting point the same numbers describe different places.',
    },
    {
      id: 's112.g2',
      prompt: 'Can one location have two different correct coordinate descriptions?',
      hint: 'Could two people measure from different corners?',
      answer: 'Yes, against different frameworks.',
      rationale: 'The location does not change; the description depends on the system used to state it.',
    },
    {
      id: 's112.g3',
      prompt: 'What does the history of this idea suggest about the system you are about to use?',
      hint: 'Was it discovered all at once, or built?',
      answer: 'That its conventions were chosen, not inevitable.',
      rationale: 'Where zero sits and which directions count as positive are decisions made over time.',
    },
  ],
  independentPractice: [
    {
      id: 's112.i1',
      prompt: 'Describe your own desk position in a classroom in two different frameworks, and state each framework explicitly.',
      answer: 'Any two schemes, each with its reference point and directions named.',
      rationale: 'A description is only readable when the framework it assumes is stated.',
    },
    {
      id: 's112.i2',
      prompt: 'Explain why two measurements, rather than one, are needed to fix a point in a flat surface.',
      answer: 'Because one measurement leaves a line of possibilities.',
      rationale: 'Each independent measurement removes one degree of freedom.',
    },
    {
      id: 's112.i3',
      prompt: 'A map gives a place as a pair of numbers. What must the map also tell you for those numbers to be usable?',
      answer: 'Where the numbers are measured from, in which directions, and in what units.',
      rationale: 'Those three choices are the framework.',
    },
  ],
  reasoningApplication: [
    {
      id: 's112.r1',
      prompt: 'A coordinate system fixes a reference point, directions and units. Decide which of those three a reader could work out for themselves if it were left unstated, and which they could not.',
      expectedReasoning:
        'None can be reliably recovered: a pair of numbers is consistent with many frameworks. A strong answer tests this by showing one pair placed differently under two frameworks, and notices that units are sometimes guessable from context while the reference point and directions are not.',
    },
  ],
  interactivePractice: [],
  summary:
    'A coordinate system is a framework — a reference point, directions and units — that makes numbers describe an exact location. The system in use today was developed over centuries, and its conventions were chosen rather than given.',
  nextStep:
    'Next you will meet the particular framework this chapter uses: two perpendicular axes and an ordered pair.',
  teacher: {
    objective: 'Students explain why location needs an agreed framework and recognise the system as constructed.',
    prerequisiteKnowledge: ['Grids and maps', 'Measuring along a direction'],
    modelLanguage: ['Measured from where?', 'Would that description work for someone else?'],
    teachingNotes: [
      'This lesson merges the chapter opening with the historical section because §1.2 is the history of the same idea §1.1 introduces; apart, neither sustains a lesson.',
      'Do the two-corner seating activity before any mathematics. The point lands when two correct answers disagree.',
      'The history is context, not decoration: it answers why the conventions are conventions.',
    ],
    quickChecks: ['Measured from where?', 'Could the same place have another description?'],
    supportForStrugglingLearners: [
      'Use the actual classroom and two different corners as reference points.',
      'Write the framework as three statements — from where, which directions, what units — before any numbers.',
    ],
    extension: ['Ask what a third measurement would be needed for.'],
    materialsNeeded: ['Classroom seating plan', 'Squared paper'],
  },
  reviewStatus: 'authored_draft',
};

export const SECTION_1_3_PLOT: AuthoredSection = {
  contentArtifactId: 'ncert_iemh1_s1_3_plot_lesson',
  contentArtifactVersion: 1,
  source: source('1.3', 'The 2-d Cartesian Coordinate System', 3, 'ncert_iemh1_s1_3'),
  competencyCandidates: [],
  competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_iemh1_s1_1'],
    mayAssume: ['A coordinate system as a framework', 'Measuring along a direction', 'Reading a scale'],
    mustNotIntroduce: [{ concept: 'Signs, axes and the four quadrants', belongsToSection: 'ncert_iemh1_s1_3' }, { concept: 'Distance between two points', belongsToSection: 'ncert_iemh1_s1_4' }],
  },
  learningGoal:
    'You will locate a point in the plane by an ordered pair measured against two perpendicular axes, and read the pair of a point already plotted.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: ['Measure a length along a line.', 'Say what an ordered pair is.', 'Explain why a reference point is needed.'],
    ifNotReady: 'Revisit the previous lesson if the need for a fixed reference point is not yet clear.',
  },
  vocabulary: [
    { term: 'axes', meaning: 'The two perpendicular lines the measurements are made against.' },
    { term: 'origin', meaning: 'The point where the axes cross, where both measurements are zero.' },
    { term: 'coordinates', meaning: 'The two numbers of the pair: the first measured along the x-axis, the second along the y-axis.' },
    { term: 'ordered pair', meaning: 'Two numbers in a fixed order, written (x, y).' },
  ],
  explanation: [
    'The framework this chapter uses is two perpendicular lines. One runs across and is called the x-axis; one runs up and down and is called the y-axis. They cross at a point called the origin, which is where both measurements are zero.',
    'A point is then described by two numbers. The first says how far along the x-axis to go, and the second how far up. Written as a pair, A is at (3, 2): three across, two up. The point and the pair name each other — give me the pair and I can find the point, give me the point and I can read the pair.',
    'The order is part of the description, not a formatting habit. (3, 2) is three across and two up; (2, 3) is two across and three up. They are different points, and swapping the numbers is the error that costs most marks in this chapter.',
    'Reading a plotted point reverses the procedure. Drop straight down to the x-axis to read the first number, then across to the y-axis to read the second. Both readings are measured from the origin, never from the edge of the paper or from another point.',
    'The scale is part of the framework too. If each square is one unit, the point three squares across is at x = 3; if each square is five units, that same square is at x = 15. Check the scale before reading anything, exactly as with any measuring instrument.',
  ],
  representations: ['A grid with A at (3, 2) and B at (2, 3), showing that the order changes the place', 'The route to a point traced along the x-axis and then upward'],
  visuals: [F_PLOT],
  visualsById: { F_PLOT },
  workedExamples: [
    {
      id: 's13a.we1',
      prompt: 'Plot the point C (4, 1) and describe how you found it.',
      steps: [
        { text: 'Start at the origin, where both measurements are zero.', reasoning: 'Every coordinate is measured from the origin, so that is where any plot begins.' },
        { text: 'Move 4 units along the x-axis, because the first number is measured along x.', reasoning: 'The first coordinate always refers to the horizontal direction in this framework.' },
        { text: 'From there move 1 unit up, because the second number is measured along y.', reasoning: 'The second coordinate is measured parallel to the y-axis, starting from where the first movement ended.' },
        { text: 'Mark the point reached and label it C (4, 1).', reasoning: 'Labelling the point with its pair keeps the plot readable by someone else.' },
      ],
      answer: 'C sits 4 units right of the origin and 1 unit above the x-axis.',
      visualRef: 'F_PLOT',
    },
    {
      id: 's13a.we2',
      prompt: 'A point is plotted 2 units right of the origin and 3 units above it. Write its coordinates, and say why they are not (3, 2).',
      steps: [
        { text: 'The horizontal measurement is 2, so the first coordinate is 2.', reasoning: 'The first number of the pair is always the horizontal one.' },
        { text: 'The vertical measurement is 3, so the second coordinate is 3.', reasoning: 'The second number is the vertical one, read from the x-axis upward.' },
        { text: 'The pair is (2, 3). Writing (3, 2) would describe a point 3 right and 2 up.', reasoning: 'Reversing the pair names a different location, so the order carries meaning.' },
      ],
      answer: '(2, 3). The pair (3, 2) is a different point on the same grid.',
      visualRef: 'F_PLOT',
    },
    {
      id: 's13a.we3',
      prompt: 'On a grid where each square is 5 units, a point sits 3 squares right and 2 squares up from the origin. Write its coordinates.',
      steps: [
        { text: 'Check the scale before converting anything: one square is 5 units here.', reasoning: 'A square is not automatically one unit, and reading the scale is part of reading the grid.' },
        { text: 'Three squares right is 3 times 5 = 15 units.', reasoning: 'Squares are counted, then converted by the scale into units.' },
        { text: 'Two squares up is 2 times 5 = 10 units.', reasoning: 'The same conversion applies to the vertical direction.' },
      ],
      answer: '(15, 10) — not (3, 2), which is what counting squares alone would give.',
    },
  ],
  misconceptionIds: [],
  guidedPractice: [
    {
      id: 's13a.g1',
      prompt: 'Where is the point (0, 0)?',
      hint: 'What are both measurements there?',
      answer: 'At the origin.',
      rationale: 'Both coordinates are zero exactly where the axes cross.',
    },
    {
      id: 's13a.g2',
      prompt: 'Are (5, 1) and (1, 5) the same point?',
      hint: 'Which number is measured along x in each?',
      answer: 'No.',
      rationale: 'The first is 5 across and 1 up; the second is 1 across and 5 up.',
    },
    {
      id: 's13a.g3',
      prompt: 'A point sits 6 units right and 0 units up. Write its pair.',
      hint: 'What is the vertical measurement here?',
      answer: '(6, 0)',
      rationale: 'A zero second coordinate means the point has not left the x-axis.',
    },
  ],
  independentPractice: [
    {
      id: 's13a.i1',
      prompt: 'Plot D (2, 5), E (5, 2) and F (0, 4) on one grid and describe where each sits.',
      answer: 'D is 2 right and 5 up; E is 5 right and 2 up; F is on the y-axis, 4 up.',
      rationale: 'Each pair is read first number horizontal, second vertical.',
    },
    {
      id: 's13a.i2',
      prompt: 'A point is 7 units right of the origin and 4 units above. Write its coordinates and then those of the point with the numbers swapped.',
      answer: '(7, 4); swapped gives (4, 7).',
      rationale: 'The swapped pair describes a different location.',
    },
    {
      id: 's13a.i3',
      prompt: 'Explain how to read the coordinates of a point someone else has plotted.',
      answer: 'Drop straight to the x-axis for the first, then across to the y-axis for the second, both measured from the origin.',
      rationale: 'Reading reverses the plotting procedure.',
    },
  ],
  reasoningApplication: [
    {
      id: 's13a.r1',
      prompt: 'A classmate plots (3, 5) and (5, 3) and says the two points are "the same distance from the origin, so they are basically the same point". Decide what is right and what is wrong in that claim.',
      expectedReasoning:
        'The distance claim is right and the conclusion is wrong: both are the same distance from the origin but in different directions, so they are different points. A strong answer separates the two claims and notes that many points share a distance from the origin, so distance alone cannot identify a point.',
    },
  ],
  interactivePractice: [],
  summary:
    'Two perpendicular axes meeting at the origin give every point of the plane an ordered pair: first number measured along the x-axis, second measured upward. The order is part of the description, and the scale must be read before the grid.',
  nextStep:
    'Next you will look at what happens when the measurements run the other way, and the signs that record it.',
  teacher: {
    objective: 'Students plot and read points against two perpendicular axes.',
    prerequisiteKnowledge: ['Measuring along a direction', 'Ordered pairs'],
    modelLanguage: ['Which number is the horizontal one?', 'Measured from where?'],
    teachingNotes: [
      'Swapped coordinates are the dominant error. Make the order a spoken habit: across first, then up.',
      'Use a grid with a non-unit scale early, so students read the scale rather than counting squares by reflex.',
    ],
    quickChecks: ['Which is x here?', 'Is this measured from the origin?'],
    supportForStrugglingLearners: [
      'Trace the route with a finger — along, then up — before marking anything.',
      'Label each plotted point with its pair immediately.',
    ],
    extension: ['Ask for all points whose two coordinates are equal, and what they look like together.'],
    materialsNeeded: ['Squared paper', 'Ruler'],
  },
  reviewStatus: 'authored_draft',
};

export const SECTION_1_3_SIGNS: AuthoredSection = {
  contentArtifactId: 'ncert_iemh1_s1_3_signs_lesson',
  contentArtifactVersion: 1,
  source: source('1.3', 'The 2-d Cartesian Coordinate System', 3, 'ncert_iemh1_s1_3'),
  competencyCandidates: [],
  competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_iemh1_s1_3'],
    mayAssume: ['Plotting and reading points', 'Positive and negative numbers', 'The origin and the two axes'],
    mustNotIntroduce: [{ concept: 'Distance between two points', belongsToSection: 'ncert_iemh1_s1_4' }],
  },
  learningGoal:
    'You will classify a point by the signs of its coordinates, and recognise the forms (x, 0) and (0, y) as the points lying on an axis.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: ['Plot a point from an ordered pair.', 'Place a negative number on a number line.', 'Say where the origin is.'],
    ifNotReady: 'Make sure plotting positive pairs is secure before adding directions that run the other way.',
  },
  vocabulary: [
    { term: 'sign', meaning: 'Whether a coordinate is positive or negative, which records direction rather than size.' },
    { term: 'quadrant', meaning: 'One of the four regions the two axes cut the plane into.' },
    { term: 'on an axis', meaning: 'A point with one coordinate zero, which therefore lies on an axis rather than in a quadrant.' },
  ],
  explanation: [
    'So far every measurement has run right and up. The axes continue the other way as well, and a negative coordinate records that direction: a first coordinate of −4 means four units to the left of the origin, and a second coordinate of −3 means three units below it.',
    'The sign is about direction, not size. The point (−4, 3) is exactly as far from the y-axis as (4, 3); it is on the other side. Reading a negative sign as "smaller" rather than "the other way" is what sends points to the wrong region.',
    'Because each coordinate can be positive or negative, there are four combinations, and the axes cut the plane into four matching regions. Both positive is the upper right; first negative and second positive is the upper left; both negative is the lower left; first positive and second negative is the lower right. The signs tell you the region before you plot anything.',
    'Two cases fall outside all four regions. A point with second coordinate zero has not left the x-axis, so it has the form (x, 0). A point with first coordinate zero has not left the y-axis, so it has the form (0, y). These are on the axes, not inside a region, and the origin (0, 0) is on both.',
    'That gives a quick check on any plotted point: read the two signs, say which region it should be in, and see whether the mark agrees. A disagreement means a sign was dropped, which is the most common slip once negatives appear.',
  ],
  representations: ['Four points, one in each region, with their signs shown', 'A point on each axis, where one coordinate is zero'],
  visuals: [F_QUADRANTS],
  visualsById: { F_QUADRANTS },
  workedExamples: [
    {
      id: 's13b.we1',
      prompt: 'Plot Q (−4, 3) and say which region it lies in.',
      steps: [
        { text: 'The first coordinate is −4, so move 4 units left of the origin rather than right.', reasoning: 'A negative first coordinate reverses the horizontal direction.' },
        { text: 'The second is 3, so move 3 units up from there.', reasoning: 'A positive second coordinate keeps the vertical movement upward.' },
        { text: 'Left and up puts the point in the upper-left region.', reasoning: 'The pair of signs — negative then positive — identifies the region before the mark is made.' },
      ],
      answer: 'Q sits 4 left and 3 up, in the upper-left region.',
      visualRef: 'F_QUADRANTS',
    },
    {
      id: 's13b.we2',
      prompt: 'Where does the point (0, −5) lie?',
      steps: [
        { text: 'The first coordinate is 0, so there is no horizontal movement at all.', reasoning: 'With no movement away from the y-axis, the point stays on it.' },
        { text: 'The second is −5, so move 5 units down the y-axis.', reasoning: 'A negative second coordinate runs downward.' },
        { text: 'The point is on the y-axis, below the origin, not in any region.', reasoning: 'A point with a zero coordinate lies on an axis rather than inside one of the four regions.' },
      ],
      answer: 'On the y-axis, 5 units below the origin.',
      visualRef: 'F_QUADRANTS',
    },
    {
      id: 's13b.we3',
      prompt: 'A student plots (3, −2) in the upper-right region. Find the error without re-plotting.',
      steps: [
        { text: 'Read the signs: the first is positive and the second is negative.', reasoning: 'The pair of signs determines the region, so it can be checked before any plotting.' },
        { text: 'Positive then negative means right of the y-axis and below the x-axis.', reasoning: 'That is the lower-right region.' },
        { text: 'The upper-right region requires both coordinates positive.', reasoning: 'The student has treated the minus sign as decoration rather than as a direction.' },
      ],
      answer: 'The minus sign was ignored; (3, −2) belongs in the lower-right region.',
    },
  ],
  misconceptionIds: [],
  guidedPractice: [
    {
      id: 's13b.g1',
      prompt: 'In which region is (−2, −7)?',
      hint: 'What do two negative signs mean?',
      answer: 'Lower left.',
      rationale: 'Negative first means left of the origin and negative second means below it.',
    },
    {
      id: 's13b.g2',
      prompt: 'A point has the form (x, 0). Where must it be?',
      hint: 'What does a zero second coordinate mean?',
      answer: 'On the x-axis.',
      rationale: 'No vertical movement means the point never leaves the x-axis.',
    },
    {
      id: 's13b.g3',
      prompt: 'Are (5, 2) and (−5, 2) the same distance from the y-axis?',
      hint: 'Does the sign change the size of the number?',
      answer: 'Yes, both are 5 units from it.',
      rationale: 'The sign records which side, not how far.',
    },
  ],
  independentPractice: [
    {
      id: 's13b.i1',
      prompt: 'State the region or axis for each: (6, 1), (−3, 8), (−1, −1), (4, −9), (0, 7).',
      answer: 'Upper right; upper left; lower left; lower right; on the y-axis.',
      rationale: 'The two signs give the region, and a zero puts the point on an axis.',
    },
    {
      id: 's13b.i2',
      prompt: 'Write the coordinates of a point 5 units left of the origin on the x-axis.',
      answer: '(−5, 0).',
      rationale: 'Left is a negative first coordinate; staying on the x-axis makes the second zero.',
    },
    {
      id: 's13b.i3',
      prompt: 'Explain why the origin lies on both axes.',
      answer: 'Because both of its coordinates are zero.',
      rationale: 'It has made no movement away from either axis.',
    },
  ],
  reasoningApplication: [
    {
      id: 's13b.r1',
      prompt: 'Points with a zero coordinate lie on an axis rather than in a region. Describe all the points whose first coordinate is zero, and say what they form.',
      expectedReasoning:
        'They are the points with no horizontal movement, so they all lie on the y-axis and together form that whole line, origin included. A strong answer sees that one fixed coordinate leaves a whole line of points, which is a step towards an equation describing a line.',
    },
  ],
  interactivePractice: [],
  summary:
    'A negative coordinate records direction, not a smaller size. The two signs identify which of the four regions a point lies in, and a zero coordinate puts the point on an axis instead, with the origin on both.',
  nextStep:
    'Next you will measure the distance between two plotted points rather than only locating them.',
  teacher: {
    objective: 'Students classify points by the signs of their coordinates and recognise points on an axis.',
    prerequisiteKnowledge: ['Negative numbers', 'Plotting points'],
    modelLanguage: ['What do the two signs say?', 'Did you move left or right?'],
    teachingNotes: [
      'Treat the sign as direction, never as size. "Negative means the other way" is the phrase worth repeating.',
      'Check the region from the signs before plotting; it turns the plot into a verification rather than a guess.',
    ],
    quickChecks: ['Which region, and how do you know?', 'On an axis or in a region?'],
    supportForStrugglingLearners: [
      'Draw the four regions and label each with its pair of signs before plotting anything.',
      'Use colour and a written sign pair together, never colour alone.',
    ],
    extension: ['Ask for the points where both coordinates are equal and negative, and where they lie.'],
    materialsNeeded: ['Squared paper', 'Coloured pencils'],
  },
  reviewStatus: 'authored_draft',
};

export const SECTION_1_4_DISTANCE: AuthoredSection = {
  contentArtifactId: 'ncert_iemh1_s1_4_distance_lesson',
  contentArtifactVersion: 1,
  source: source('1.4', 'Distance Between Two Points in the 2-D Plane', 8, 'ncert_iemh1_s1_4'),
  competencyCandidates: [],
  competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_iemh1_s1_3'],
    mayAssume: ['Plotting points and reading coordinates', 'Signs as direction', 'The Baudhayana-Pythagoras relation from Class 8'],
    mustNotIntroduce: [{ concept: 'Using distance: midpoints and collinearity', belongsToSection: 'ncert_iemh1_s1_4' }],
  },
  learningGoal:
    'You will derive the distance between two points by completing a right triangle, and apply it to points in any region.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: ['Plot two points and read their coordinates.', 'State the relation between the legs and hypotenuse of a right triangle.', 'Subtract negative numbers.'],
    ifNotReady: 'Revisit the right-triangle relation from Class 8; the derivation uses it and does not reprove it.',
  },
  vocabulary: [
    { term: 'horizontal difference', meaning: 'How far apart two points are in the x direction.' },
    { term: 'vertical difference', meaning: 'How far apart they are in the y direction.' },
    { term: 'distance', meaning: 'The straight-line length between two points.' },
  ],
  explanation: [
    'Two points plotted on a grid have a gap between them, and counting squares only works when they share a row or a column. For A (1, 2) and B (5, 5) the straight line between them crosses squares diagonally, so counting gives nothing.',
    'The construction that works is a single extra point. Take C at (5, 2) — the x of B with the y of A. Then AC is horizontal and CB is vertical, so the angle at C is a right angle, and AB is the hypotenuse of a right triangle. That is why the perpendicular is dropped: it turns an awkward diagonal into a shape with a known relation.',
    'The two legs are differences of coordinates. AC is the horizontal difference, 5 − 1 = 4, and CB is the vertical difference, 5 − 2 = 3. The Class 8 relation then gives AB squared = 16 + 9 = 25, so AB = 5.',
    'In general, for points (x₁, y₁) and (x₂, y₂), the legs are x₂ − x₁ and y₂ − y₁, and the distance is the square root of their squares added. Nothing new has been proved about right triangles; the work was turning two coordinate pairs into one.',
    'Signs take care of themselves. A difference may come out negative — if B is left of A, say — but it is squared, and squaring removes the sign. That is why the formula needs no case for which point comes first, and why subtracting in either order gives the same distance.',
  ],
  representations: ['Two points joined, with the perpendicular dropped to complete a right triangle', 'The two legs labelled as coordinate differences'],
  visuals: [F_DISTANCE],
  visualsById: { F_DISTANCE },
  workedExamples: [
    {
      id: 's14a.we1',
      prompt: 'Find the distance between A (1, 2) and B (5, 5).',
      steps: [
        { text: 'Mark C at (5, 2), taking the x of B and the y of A.', reasoning: 'This places C so that AC is horizontal and CB vertical, which is what makes the angle at C a right angle.' },
        { text: 'The horizontal leg is 5 − 1 = 4.', reasoning: 'Subtracting the x values gives how far apart the points are in that direction.' },
        { text: 'The vertical leg is 5 − 2 = 3.', reasoning: 'Subtracting the y values gives the other leg.' },
        { text: 'AB squared is 16 + 9 = 25, so AB = 5.', reasoning: 'The Class 8 right-triangle relation applies because the construction produced a right angle.' },
      ],
      answer: 'The distance is 5 units.',
      visualRef: 'F_DISTANCE',
    },
    {
      id: 's14a.we2',
      prompt: 'Find the distance between P (−3, 1) and Q (2, −4).',
      steps: [
        { text: 'Horizontal difference: 2 − (−3) = 5.', reasoning: 'Subtracting a negative adds; the points are on opposite sides of the y-axis, so the gap is the sum of the two distances.' },
        { text: 'Vertical difference: −4 − 1 = −5.', reasoning: 'A negative difference simply records that Q is below P.' },
        { text: 'Square both: 25 and 25, so the sum is 50.', reasoning: 'Squaring removes the sign, which is why the negative difference causes no trouble.' },
        { text: 'The distance is the square root of 50, which is 5 root 2.', reasoning: 'Leaving a surd exact is preferable to rounding at this stage.' },
      ],
      answer: '5 root 2 units, about 7.07.',
    },
    {
      id: 's14a.we3',
      prompt: 'Show that subtracting in the other order gives the same distance for A (1, 2) and B (5, 5).',
      steps: [
        { text: 'Taking A from B gave legs 4 and 3.', reasoning: 'That was the original calculation.' },
        { text: 'Taking B from A gives −4 and −3.', reasoning: 'Reversing the subtraction reverses both signs.' },
        { text: 'Squaring gives 16 and 9 either way.', reasoning: 'Squaring a negative gives the same result as squaring its positive, so the sum is unchanged.' },
      ],
      answer: 'The same distance, 5, because the differences are squared.',
    },
  ],
  misconceptionIds: [],
  guidedPractice: [
    {
      id: 's14a.g1',
      prompt: 'Find the distance between (0, 0) and (3, 4).',
      hint: 'The legs are the two coordinates themselves.',
      answer: '5',
      rationale: 'Three squared plus four squared is twenty-five.',
    },
    {
      id: 's14a.g2',
      prompt: 'Two points share the same y value. What is the vertical leg?',
      hint: 'What is the difference of two equal numbers?',
      answer: 'Zero.',
      rationale: 'The points sit on the same horizontal line, so the distance is just the horizontal difference.',
    },
    {
      id: 's14a.g3',
      prompt: 'Why does a negative coordinate difference not cause trouble?',
      hint: 'What happens to it in the calculation?',
      answer: 'Because it is squared.',
      rationale: 'Squaring removes the sign, so only the size of the gap matters.',
    },
  ],
  independentPractice: [
    {
      id: 's14a.i1',
      prompt: 'Find the distance between (2, 3) and (7, 15).',
      answer: '13 units.',
      rationale: 'Legs of 5 and 12 give 169.',
    },
    {
      id: 's14a.i2',
      prompt: 'Find the distance between (−1, −2) and (3, 1).',
      answer: '5 units.',
      rationale: 'Legs of 4 and 3, with the negative coordinates handled by subtraction.',
    },
    {
      id: 's14a.i3',
      prompt: 'Explain why the perpendicular is dropped at all.',
      answer: 'To complete a right triangle, so the Class 8 relation can be applied.',
      rationale: 'Without the right angle there is no relation connecting the diagonal to the two differences.',
    },
  ],
  reasoningApplication: [
    {
      id: 's14a.r1',
      prompt: 'The derivation uses a result proved in Class 8. Explain exactly what Class 9 adds here, and what it does not.',
      expectedReasoning:
        'Class 9 adds the translation: turning two coordinate pairs into the legs of a right triangle so the existing relation applies. It does not reprove the right-triangle relation, which is assumed. A strong answer identifies the construction as the new content and resists describing the whole thing as a new theorem.',
    },
  ],
  interactivePractice: [],
  summary:
    'Dropping a perpendicular turns the gap between two points into a right triangle whose legs are the coordinate differences, so the Class 8 relation gives the distance. Squaring the differences means the order of subtraction and the signs make no difference.',
  nextStep:
    'Next you will use the distance result rather than derive it, to test collinearity and find midpoints.',
  teacher: {
    objective: 'Students derive the distance between two points and apply it across all regions.',
    prerequisiteKnowledge: ['Plotting points', 'Right-triangle relation', 'Subtracting negatives'],
    modelLanguage: ['Where will you put the third point?', 'What are the two legs here?'],
    teachingNotes: [
      'Name the construction as the new content. Students who think the right-triangle relation is being proved here lose the point of the lesson.',
      'The negative-difference case needs doing explicitly; students often take absolute values first out of anxiety, which is unnecessary.',
    ],
    quickChecks: ['Which two differences?', 'Does the order of subtraction matter?'],
    supportForStrugglingLearners: [
      'Draw the right triangle on the grid and label both legs before computing.',
      'Work one example with both subtraction orders to see the answers agree.',
    ],
    extension: ['Ask for a point at distance 5 from the origin other than (3, 4), and how many there are.'],
    materialsNeeded: ['Squared paper', 'Ruler'],
  },
  reviewStatus: 'authored_draft',
};

export const SECTION_1_4_MIDPOINT: AuthoredSection = {
  contentArtifactId: 'ncert_iemh1_s1_4_apply_lesson',
  contentArtifactVersion: 1,
  source: source('1.4', 'Distance Between Two Points in the 2-D Plane', 8, 'ncert_iemh1_s1_4'),
  competencyCandidates: [],
  competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_iemh1_s1_4'],
    mayAssume: ['The distance between two points', 'Right-triangle relation', 'Reading coordinates'],
    mustNotIntroduce: [],
  },
  learningGoal:
    'You will use the distance result to test whether three points are collinear and to locate the midpoint of a segment.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: ['Compute the distance between two points.', 'Add and compare surds or decimals.', 'Plot points in all four regions.'],
    ifNotReady: 'Make sure the distance calculation is fluent; this lesson uses it repeatedly rather than deriving anything new.',
  },
  vocabulary: [
    { term: 'collinear', meaning: 'Lying on one straight line.' },
    { term: 'midpoint', meaning: 'The point of a segment equidistant from both ends, lying on the segment.' },
  ],
  explanation: [
    'A proved result becomes a tool. This lesson does not derive anything; it asks what the distance calculation lets you decide.',
    'First, collinearity. If three points lie on one line, the distance from the first to the last equals the sum of the two shorter distances — the direct route and the route through the middle point are the same journey. If the two shorter distances add to more than the direct one, the middle point is off the line, and the three form a triangle.',
    'That test is worth stating carefully. The sum being equal is what collinearity means here; being close is not the same thing, and a calculation that gives 7.07 and 7.08 has not shown anything without exact values. Work with surds rather than rounded decimals where you can.',
    'Second, the midpoint. The point midway between (x₁, y₁) and (x₂, y₂) is at the average of the two x values and the average of the two y values. Halfway across and halfway up is halfway along, because moving from one point to the other changes x steadily and y steadily.',
    'Checking is cheap and worth doing: compute the distance from each end to the proposed midpoint and see that they agree. Equal distances alone would not be enough — many points are equidistant from two others — but combined with lying on the segment it settles it.',
  ],
  representations: ['Two points with their midpoint marked, the two halves ticked equal', 'The three distances compared when testing collinearity'],
  visuals: [F_MIDPOINT],
  visualsById: { F_MIDPOINT },
  workedExamples: [
    {
      id: 's14b.we1',
      prompt: 'Find the midpoint of P (−3, −2) and Q (5, 4).',
      steps: [
        { text: 'Average the x values: (−3 + 5) divided by 2 is 1.', reasoning: 'Halfway across is the average of the two horizontal positions.' },
        { text: 'Average the y values: (−2 + 4) divided by 2 is 1.', reasoning: 'The same reasoning applies in the vertical direction.' },
        { text: 'So the midpoint is M (1, 1).', reasoning: 'Halfway across and halfway up together give halfway along the segment.' },
        { text: 'Check: PM and MQ both work out as the square root of 32.', reasoning: 'Equal distances from the two ends confirms the point is midway.' },
      ],
      answer: 'M (1, 1), with PM = MQ.',
      visualRef: 'F_MIDPOINT',
    },
    {
      id: 's14b.we2',
      prompt: 'Are A (1, 1), B (3, 5) and C (5, 9) collinear?',
      steps: [
        { text: 'AB squared is 4 + 16 = 20, so AB is the square root of 20.', reasoning: 'Computing each distance exactly avoids a rounding decision later.' },
        { text: 'BC squared is 4 + 16 = 20, so BC is also root 20.', reasoning: 'The two shorter distances are equal here, which is a feature of these particular points.' },
        { text: 'AC squared is 16 + 64 = 80, so AC is root 80, which is 2 root 20.', reasoning: 'Expressing it in terms of root 20 makes the comparison exact.' },
        { text: 'AB + BC = 2 root 20, which equals AC.', reasoning: 'The direct route equals the route through B, so B lies on the segment AC.' },
      ],
      answer: 'Yes, the three points are collinear.',
    },
    {
      id: 's14b.we3',
      prompt: 'Are P (0, 0), Q (2, 3) and R (4, 5) collinear?',
      steps: [
        { text: 'PQ is root 13 and QR is root 8.', reasoning: 'Each is computed from its own pair of coordinate differences.' },
        { text: 'PR is the square root of 16 + 25 = root 41, about 6.40.', reasoning: 'The direct distance from the first point to the last.' },
        { text: 'PQ + QR is about 3.61 + 2.83 = 6.44, which is more than 6.40.', reasoning: 'Going via Q is longer than going direct, so Q is not on the segment.' },
      ],
      answer: 'No. The detour through Q is longer, so the three points form a triangle.',
    },
  ],
  misconceptionIds: [],
  guidedPractice: [
    {
      id: 's14b.g1',
      prompt: 'Find the midpoint of (2, 6) and (8, 2).',
      hint: 'Average each coordinate separately.',
      answer: '(5, 4)',
      rationale: 'Five is halfway between 2 and 8; four is halfway between 6 and 2.',
    },
    {
      id: 's14b.g2',
      prompt: 'Three distances are 5, 7 and 12. Could the points be collinear?',
      hint: 'Do the two shorter ones add to the longest?',
      answer: 'Yes.',
      rationale: 'Five plus seven equals twelve, so the direct route equals the route through the middle point.',
    },
    {
      id: 's14b.g3',
      prompt: 'Why is "about equal" not good enough for a collinearity test?',
      hint: 'What does a small difference actually mean?',
      answer: 'Because a point slightly off the line gives distances that are only slightly larger.',
      rationale: 'Rounded decimals can hide the difference, so exact values are needed.',
    },
  ],
  independentPractice: [
    {
      id: 's14b.i1',
      prompt: 'Find the midpoint of (−4, 7) and (6, −1).',
      answer: '(1, 3).',
      rationale: 'Average the x values and the y values separately.',
    },
    {
      id: 's14b.i2',
      prompt: 'Test whether (1, 2), (4, 6) and (7, 10) are collinear.',
      answer: 'Yes: 5 + 5 = 10.',
      rationale: 'Each shorter distance is 5 and the direct distance is 10.',
    },
    {
      id: 's14b.i3',
      prompt: 'One end of a segment is (2, 3) and its midpoint is (5, 7). Find the other end.',
      answer: '(8, 11).',
      rationale: 'The midpoint is the average, so the second end is as far beyond the midpoint as the first is before it.',
    },
  ],
  reasoningApplication: [
    {
      id: 's14b.r1',
      prompt: 'The midpoint is found by averaging each coordinate, and collinearity by comparing distances. Explain why averaging works, without computing any distance.',
      expectedReasoning:
        'Moving from one end to the other changes x steadily and y steadily, so being halfway along the segment means being halfway through each change — which is the average of the two values. A strong answer argues from the steady change rather than from a verified example, and notes this is why the same reasoning would give a third of the way along.',
    },
  ],
  interactivePractice: [],
  summary:
    'The distance result becomes a tool: three points are collinear when the two shorter distances add to the longest, and the midpoint of a segment is the average of the two x values with the average of the two y values.',
  nextStep:
    'That completes the chapter: a framework, a way to name any point in it, and a way to measure between points.',
  teacher: {
    objective: 'Students apply the distance result to collinearity and midpoints.',
    prerequisiteKnowledge: ['Distance between two points', 'Averages'],
    modelLanguage: ['Which is the longest distance here?', 'Do the other two add to it?'],
    teachingNotes: [
      'Insist on exact values for the collinearity test. A rounded comparison is the failure this lesson should prevent.',
      'The midpoint rule invites memorisation. Ask for the steady-change argument at least once.',
    ],
    quickChecks: ['Collinear or a triangle?', 'Did you check the midpoint from both ends?'],
    supportForStrugglingLearners: [
      'Plot the three points before computing anything; the picture suggests the answer the calculation then settles.',
      'Tabulate the three distances before comparing them.',
    ],
    extension: ['Ask for the point one third of the way from one end to the other, and how the reasoning changes.'],
    materialsNeeded: ['Squared paper', 'Ruler'],
  },
  reviewStatus: 'authored_draft',
};

/** Chapter 1, in the book's order. Five lessons from four sections:
 *  one merged (§1.1 + §1.2) and two split (§1.3 and §1.4). */
export function coordinatesChapterSections(): AuthoredSection[] {
  return [
    SECTION_1_1_2,
    SECTION_1_3_PLOT,
    SECTION_1_3_SIGNS,
    SECTION_1_4_DISTANCE,
    SECTION_1_4_MIDPOINT,
  ];
}
