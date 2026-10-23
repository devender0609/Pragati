// ===========================================================================
// v0.84.0 checkpoint 38 — CLASS 9 CHAPTER 6: PERIMETER AND AREA.
//
// Wave 2, ordinary production. No new representation: every figure here is
// a polygon, a circle or a dissection drawn with primitives that have been
// in the spec since checkpoint 33.
//
// One merge (§6.6 + §6.7) and two splits (§6.8, §6.10). The chapter is 2-D
// throughout: it shares the word "area" with Chapter 14 and none of its
// mathematics, and the units stay square rather than cubic.
// ===========================================================================

import type { AuthoredSection } from './authoredSection';
import type { GeometryFigureSpec } from './visualSpecification';

export const PERIMETER_AREA_CHAPTER_ID = 'ncert_iemh1_ch06';

const BOOK = 'Ganita Manjari, Textbook of Mathematics for Grade 9 (Part I)';
const SRC = 'https://ncert.nic.in/textbook/pdf/iemh1dd.zip';
const INSPECTED = '2026-10-07';

const source = (
  sectionNumber: string,
  exactTitle: string,
  startPage: number,
  officialSectionId: string
) => ({
  officialChapterId: PERIMETER_AREA_CHAPTER_ID,
  officialSectionId,
  sectionNumber,
  exactTitle,
  startPage,
  textbook: BOOK,
  sourceReference: SRC,
  inspectionDate: INSPECTED,
});

const P = (id: string, x: number, y: number, label: string) => ({ id, x, y, label });

// A parallelogram with the perpendicular height marked AND the slant side
// labelled separately, because confusing the two is the chapter's main error.
const F_PARALLELOGRAM: GeometryFigureSpec = {
  type: 'geometry_figure',
  purpose: 'support_proof',
  status: 'concept_specific',
  points: [
    P('a', 30, 140, 'A'), P('b', 170, 140, 'B'),
    P('c', 215, 50, 'C'), P('d', 75, 50, 'D'),
    P('f', 75, 140, 'F'), P('g', 215, 140, 'G'),
  ],
  segments: [
    { from: 'a', to: 'b', label: 'base b' },
    { from: 'b', to: 'c', label: 'slant side — not the height' },
    { from: 'c', to: 'd' },
    { from: 'd', to: 'a' },
    { from: 'd', to: 'f', mark: 'dashed', label: 'height h' },
    { from: 'c', to: 'g', mark: 'dashed' },
  ],
  angleMarks: [{ at: 'f', from: 'd', to: 'b', right: true }],
  shadedRegions: [{ points: ['a', 'f', 'd'], label: 'cut' }],
  caption: 'Cut the shaded right triangle from one end and slide it to the other: a rectangle.',
  altText:
    'Parallelogram ABCD with AB as the base. A dashed perpendicular from D meets the base line at F, marked with a right angle, and is labelled the height. The side BC is labelled as the slant side and is clearly longer than the height. The right triangle AFD at the left end is shaded, showing the piece that is cut away and reattached at the right to make a rectangle of the same base and height.',
};

const F_TRIANGLE: GeometryFigureSpec = {
  type: 'geometry_figure',
  purpose: 'support_proof',
  status: 'concept_specific',
  points: [
    P('a', 40, 150, 'A'), P('b', 180, 150, 'B'), P('c', 110, 60, 'C'),
    P('d', 250, 60, 'D'), P('f', 110, 150, 'F'),
  ],
  segments: [
    { from: 'a', to: 'b', label: 'base b' },
    { from: 'b', to: 'c' },
    { from: 'c', to: 'a' },
    { from: 'c', to: 'd', mark: 'dashed' },
    { from: 'b', to: 'd', mark: 'dashed' },
    { from: 'c', to: 'f', mark: 'dashed', label: 'height h' },
  ],
  angleMarks: [{ at: 'f', from: 'c', to: 'b', right: true }],
  shadedRegions: [{ points: ['a', 'b', 'c'], label: 'the triangle' }],
  caption: 'A second copy of the triangle, turned around, completes a parallelogram.',
  altText:
    'Triangle ABC with base AB and a dashed perpendicular from C meeting the base at F, marked as a right angle and labelled the height. A second copy of the triangle is shown in dashed outline, rotated a half turn and joined along BC to form a parallelogram on the same base AB with the same height. The original triangle is shaded, showing it is half of that parallelogram.',
};

const F_SECTORS: GeometryFigureSpec = {
  type: 'geometry_figure',
  purpose: 'show_construction',
  status: 'concept_specific',
  points: [
    P('o', 70, 90, 'O'), P('e', 120, 90, 'E'),
    P('p', 160, 130, 'P'), P('q', 260, 130, 'Q'),
    P('r', 260, 80, 'R'), P('s', 160, 80, 'S'),
  ],
  circles: [{ id: 'k', centre: 'o', through: 'e' }],
  segments: [
    { from: 'o', to: 'e', label: 'r' },
    { from: 'p', to: 'q', label: 'half the circumference' },
    { from: 'q', to: 'r' },
    { from: 'r', to: 's' },
    { from: 's', to: 'p', label: 'r' },
  ],
  caption: 'Cut the disc into thin sectors and interleave them: the shape approaches a rectangle.',
  altText:
    'On the left a circle of centre O with a radius labelled r. On the right the rearranged figure: a near-rectangle PQRS whose long side is labelled half the circumference and whose short side is labelled r, formed by interleaving the thin sectors cut from the disc. As the sectors get thinner the figure gets closer to a true rectangle.',
};

export const SECTION_6_1: AuthoredSection = {
  contentArtifactId: 'ncert_iemh1_s6_1_lesson',
  contentArtifactVersion: 1,
  source: source('6.1', 'Perimeter of a Shape', 2, 'ncert_iemh1_s6_1'),
  competencyCandidates: [],
  competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: [],
    mayAssume: ['Measuring length', 'Adding lengths', 'Class 8 work with polygons'],
    mustNotIntroduce: [{ concept: 'The circumference of a circle', belongsToSection: 'ncert_iemh1_s6_2' }, { concept: 'Area of a rectangle', belongsToSection: 'ncert_iemh1_s6_6' }],
  },
  learningGoal:
    'You will define perimeter as the distance round a border and compute it for polygons, including where some lengths are not given directly.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: ['Add a list of lengths.', 'Identify the sides of a polygon.', 'Use the same unit throughout a calculation.'],
    ifNotReady: 'No special preparation; bring a ruler.',
  },
  vocabulary: [
    { term: 'perimeter', meaning: 'The total distance around the border of a shape.' },
    { term: 'border', meaning: 'The closed path that encloses the shape.' },
  ],
  explanation: [
    'Imagine an insect walking round the edge of a leaf and never turning back until it reaches where it started. The distance it covers is the perimeter — the length of the border, nothing more.',
    'For a polygon this is pure addition: every side is a straight length, so add them. A rectangle 8 cm by 5 cm has perimeter 8 + 5 + 8 + 5 = 26 cm, and because opposite sides are equal this is 2(8 + 5), which is a shortcut rather than a different idea.',
    'Perimeter is a length, so it is measured in centimetres or metres — never square units. That distinction matters from the start, because the next part of the chapter measures something entirely different with the same shapes.',
    'Not every length is always given. An L-shaped room may show four measurements and leave two to be worked out from the others, and the way to find them is to see which lengths must add to which. The border is still the border; the arithmetic just has an extra step.',
    'One warning the chapter returns to: a bigger-looking shape need not have a longer border. Perimeter measures the edge, not the space inside, and the two can behave independently.',
  ],
  representations: ['A closed border traced once, with every side labelled', 'An L-shape where two side lengths are deduced from the others'],
  visuals: [],
  visualsById: {  },
  workedExamples: [
    {
      id: 's61.we1',
      prompt: 'A triangle has sides 7 cm, 9 cm and 12 cm. Find its perimeter.',
      steps: [
        { text: 'Perimeter is the total distance round the border.', reasoning: 'For a polygon the border is made of its sides, so adding them gives the whole journey.' },
        { text: 'Add: 7 + 9 + 12.', reasoning: 'All three are in the same unit, so they add directly.' },
        { text: 'That is 28 cm — a length, so centimetres and not square centimetres.', reasoning: 'Perimeter measures distance, which keeps the original linear unit.' },
      ],
      answer: '28 cm.',
    },
    {
      id: 's61.we2',
      prompt: 'An L-shaped plot has outer sides 10 m and 8 m, with a 4 m by 3 m corner removed. Find its perimeter.',
      steps: [
        { text: 'Sketch the border and mark the four given lengths.', reasoning: 'Seeing which lengths are given is what shows which are missing.' },
        { text: 'The two unknown edges are 10 − 4 = 6 m and 8 − 3 = 5 m.', reasoning: 'Each missing length is what remains of a full side after the cut-out.' },
        { text: 'Add all six: 10 + 8 + 4 + 3 + 6 + 5.', reasoning: 'Every segment of the border is counted once, which is what perimeter means.' },
        { text: 'The total is 36 m.', reasoning: 'Interestingly this equals the perimeter of the full 10 by 8 rectangle, because the cut-out edges replace exactly the lengths they removed.' },
      ],
      answer: '36 m.',
    },
    {
      id: 's61.we3',
      prompt: 'A square has perimeter 36 cm. Find its side.',
      steps: [
        { text: 'A square has four equal sides, so the perimeter is four times the side.', reasoning: 'Equal sides make the addition a multiplication.' },
        { text: 'So the side is 36 divided by 4.', reasoning: 'Dividing reverses the multiplication.' },
        { text: 'That is 9 cm.', reasoning: 'A length again, so the unit does not change.' },
      ],
      answer: '9 cm.',
    },
  ],
  misconceptionIds: [],
  guidedPractice: [
    {
      id: 's61.g1',
      prompt: 'Find the perimeter of a rectangle 12 m by 7 m.',
      hint: 'Opposite sides are equal.',
      answer: '38 m',
      rationale: 'Twice the sum of the two different sides.',
    },
    {
      id: 's61.g2',
      prompt: 'What unit does perimeter take?',
      hint: 'Is it a distance or a region?',
      answer: 'A linear unit, such as cm or m.',
      rationale: 'Perimeter measures distance round the border.',
    },
    {
      id: 's61.g3',
      prompt: 'A regular hexagon has side 5 cm. Find its perimeter.',
      hint: 'How many equal sides?',
      answer: '30 cm',
      rationale: 'Six sides of 5 cm each.',
    },
  ],
  independentPractice: [
    {
      id: 's61.i1',
      prompt: 'A rectangle has perimeter 50 cm and one side 15 cm. Find the other side.',
      answer: '10 cm.',
      rationale: 'Half the perimeter is 25, less the given side.',
    },
    {
      id: 's61.i2',
      prompt: 'Find the perimeter of a shape made of five sides measuring 3, 4, 6, 4 and 3 metres.',
      answer: '20 m.',
      rationale: 'Every side is counted once.',
    },
    {
      id: 's61.i3',
      prompt: 'Explain why perimeter is never measured in square units.',
      answer: 'Because it is a distance, not a region.',
      rationale: 'Only two lengths multiplied give square units.',
    },
  ],
  reasoningApplication: [
    {
      id: 's61.r1',
      prompt: 'Two rectangles both have perimeter 24 cm. Must they be the same shape? Describe all the rectangles that are possible.',
      expectedReasoning:
        'No: any pair of sides adding to 12 works, from a long thin 1 by 11 to a 6 by 6 square. A strong answer sees that perimeter does not determine a rectangle, and notices that the space inside varies enormously across that family — which the area part of the chapter will quantify.',
    },
  ],
  interactivePractice: [],
  summary:
    'Perimeter is the distance once round the border, found by adding the sides of a polygon and measured in linear units. Missing side lengths are deduced from the ones given.',
  nextStep:
    'Next you will measure round a shape with no sides at all.',
  teacher: {
    objective: 'Students define and compute perimeter, including with deduced lengths.',
    prerequisiteKnowledge: ['Adding lengths', 'Polygons'],
    modelLanguage: ['Have you gone once round and no more?', 'What unit is this?'],
    teachingNotes: [
      'Trace the border with a finger before computing. Students who skip that miss sides on composite shapes.',
      'Insist on the linear unit from the first lesson; it is the defence against the area confusion to come.',
    ],
    quickChecks: ['Which sides are still missing?', 'Linear or square units?'],
    supportForStrugglingLearners: [
      'Mark each side with a tick as it is added.',
      'Deduce missing lengths by writing the two lengths that must add to a given one.',
    ],
    extension: ['Ask for the L-shape result in general: when does cutting a corner leave the perimeter unchanged?'],
    materialsNeeded: ['Ruler', 'Squared paper'],
  },
  reviewStatus: 'authored_draft',
};

export const SECTION_6_2: AuthoredSection = {
  contentArtifactId: 'ncert_iemh1_s6_2_lesson',
  contentArtifactVersion: 1,
  source: source('6.2', 'Perimeter of a Circle — The C/D Ratio', 3, 'ncert_iemh1_s6_2'),
  competencyCandidates: [],
  competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_iemh1_s6_1'],
    mayAssume: ['Perimeter of a polygon', 'Measuring with a flexible tape', 'Dividing one measurement by another'],
    mustNotIntroduce: [{ concept: 'Why pi is irrational', belongsToSection: 'ncert_iemh1_s6_3' }, { concept: 'Arc length', belongsToSection: 'ncert_iemh1_s6_4' }],
  },
  learningGoal:
    'You will establish that circumference divided by diameter is the same constant for every circle, and use it to compute circumference from radius or diameter.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: ['Measure a length with a tape or string.', 'Divide one measurement by another.', 'Say what a diameter is.'],
    ifNotReady: 'Make sure you can measure a curved length with string; the whole investigation depends on it.',
  },
  vocabulary: [
    { term: 'circumference', meaning: 'The perimeter of a circle.' },
    { term: 'diameter', meaning: 'A chord through the centre, twice the radius.' },
    { term: 'pi', meaning: 'The constant value of circumference divided by diameter.' },
  ],
  explanation: [
    'A circle has no sides to add, so its perimeter — called the circumference — has to be measured another way. Wrap a string round a circular object, straighten it, and read its length.',
    'Do that for several circles of different sizes and divide each circumference by its diameter. The answers come out close to 3.14 every time, whether the object is a bangle or a bucket. That constancy is the discovery, not the number.',
    'It is worth seeing that constancy is not unique to circles. For every equilateral triangle, the perimeter divided by the side is exactly 3; for every square it is 4. Shapes of the same family share a ratio, because scaling a shape scales every length in it equally. The circle is one more such family, and its ratio is given the name pi.',
    'So the circumference is pi times the diameter, and since the diameter is twice the radius, that is 2 pi r. Nothing is being approximated in the relationship — only in the value of pi we use to compute with.',
    'Measuring will never give pi exactly. String stretches, the eye misreads, the object is not perfectly circular. The ratio is exact; our measurement of it is not, and knowing which is which is part of using it.',
  ],
  representations: ['Several circles of different sizes with the measured ratio beside each', 'The analogous fixed ratio for equilateral triangles and squares'],
  visuals: [],
  visualsById: {  },
  workedExamples: [
    {
      id: 's62.we1',
      prompt: 'A circular table has diameter 1.4 m. Find its circumference, taking pi as 22/7.',
      steps: [
        { text: 'Circumference is pi times the diameter.', reasoning: 'That is what the constant ratio asserts, rearranged.' },
        { text: 'So it is 22/7 times 1.4.', reasoning: 'The 1.4 contains a factor of 7 tenths, which cancels the denominator neatly.' },
        { text: 'That is 4.4 m.', reasoning: 'A length, so it keeps the linear unit.' },
      ],
      answer: '4.4 m.',
    },
    {
      id: 's62.we2',
      prompt: 'A wheel of radius 35 cm makes one full turn. How far does it roll?',
      steps: [
        { text: 'One full turn covers exactly the circumference.', reasoning: 'Rolling without slipping lays the border out along the ground once.' },
        { text: 'Circumference is 2 pi r = 2 times 22/7 times 35.', reasoning: 'Using the radius form, since the radius is what is given.' },
        { text: 'That is 220 cm, or 2.2 m.', reasoning: 'Converting to metres makes the answer easier to picture.' },
      ],
      answer: '2.2 m per turn.',
    },
    {
      id: 's62.we3',
      prompt: 'A student measures three circles and gets ratios 3.1, 3.2 and 3.15, then says the ratio is not constant. What is the better conclusion?',
      steps: [
        { text: 'The three results are close to each other and to 3.14.', reasoning: 'Scattered results that cluster point to one value with measurement error, not to a varying quantity.' },
        { text: 'String measurement of a curve cannot be precise.', reasoning: 'Stretch, thickness and reading error all push the result either way.' },
        { text: 'A genuinely varying ratio would show a trend with size, not scatter about one value.', reasoning: 'Distinguishing scatter from trend is what the conclusion turns on.' },
      ],
      answer: 'The ratio is constant; the measurements carry error. The scatter has no pattern with size.',
    },
  ],
  misconceptionIds: [],
  guidedPractice: [
    {
      id: 's62.g1',
      prompt: 'A circle has radius 7 cm. Find its circumference with pi as 22/7.',
      hint: 'Use 2 pi r.',
      answer: '44 cm',
      rationale: 'Two times 22/7 times 7.',
    },
    {
      id: 's62.g2',
      prompt: 'What is the perimeter-to-side ratio of every square?',
      hint: 'Four equal sides.',
      answer: '4',
      rationale: 'Every square shares it, just as every circle shares pi.',
    },
    {
      id: 's62.g3',
      prompt: 'A circle has circumference 31.4 cm. Find its diameter with pi as 3.14.',
      hint: 'Divide by pi.',
      answer: '10 cm',
      rationale: 'Circumference divided by pi is the diameter.',
    },
  ],
  independentPractice: [
    {
      id: 's62.i1',
      prompt: 'Find the circumference of a circle of diameter 21 cm, with pi as 22/7.',
      answer: '66 cm.',
      rationale: 'Pi times the diameter.',
    },
    {
      id: 's62.i2',
      prompt: 'A wheel of circumference 2 m covers 100 m. How many turns?',
      answer: '50.',
      rationale: 'Each turn covers one circumference.',
    },
    {
      id: 's62.i3',
      prompt: 'Explain why pi is the same for a bangle and for a stadium.',
      answer: 'Because scaling a circle scales circumference and diameter equally.',
      rationale: 'Their ratio is unaffected by size.',
    },
  ],
  reasoningApplication: [
    {
      id: 's62.r1',
      prompt: 'Every equilateral triangle has perimeter-to-side ratio 3 and every square has 4. Explain what these have in common with pi, and why the ratio belongs to the family of shapes rather than to any one member.',
      expectedReasoning:
        'In each family all members are scaled copies of one another, and scaling multiplies every length by the same factor, so a ratio of two lengths is unchanged. A strong answer concludes that pi is not mysterious in kind — only in value, since unlike 3 and 4 it is not a whole number.',
    },
  ],
  interactivePractice: [],
  summary:
    'Circumference divided by diameter is the same constant for every circle, called pi, so the circumference is pi times the diameter or 2 pi r. The ratio is exact; any measurement of it carries error.',
  nextStep:
    'Next you will look at what kind of number that constant is.',
  teacher: {
    objective: 'Students establish the constant C/D ratio and compute circumferences.',
    prerequisiteKnowledge: ['Measuring curves', 'Division'],
    modelLanguage: ['What did you divide by what?', 'Is the scatter random or a trend?'],
    teachingNotes: [
      'Do the string measurement with several objects and tabulate the ratios before naming pi. The constancy should be observed.',
      'The triangle and square ratios defuse the mystique: constancy within a family is ordinary.',
    ],
    quickChecks: ['Which ratio is constant here?', 'Exact or measured?'],
    supportForStrugglingLearners: [
      'Use a flexible tape rather than string where possible.',
      'Tabulate circumference, diameter and ratio in three columns.',
    ],
    extension: ['Ask what the ratio would be for a regular hexagon, measured round its vertices.'],
    materialsNeeded: ['String or tape', 'Circular objects', 'Ruler'],
  },
  reviewStatus: 'authored_draft',
};

export const SECTION_6_3: AuthoredSection = {
  contentArtifactId: 'ncert_iemh1_s6_3_lesson',
  contentArtifactVersion: 1,
  source: source('6.3', 'π Is Irrational', 6, 'ncert_iemh1_s6_3'),
  competencyCandidates: [],
  competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_iemh1_s6_2'],
    mayAssume: ['Pi as the constant C/D ratio', 'Rational and irrational numbers from chapter 3', 'Decimal approximation'],
    mustNotIntroduce: [{ concept: 'Arc length', belongsToSection: 'ncert_iemh1_s6_4' }],
  },
  learningGoal:
    'You will state what the irrationality of pi means for its fractional approximations, and choose an approximation suited to a calculation.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: ['Say what makes a number irrational.', 'Compare two decimals.', 'Convert a fraction to a decimal.'],
    ifNotReady: 'Revisit irrational numbers from the number chapter; this lesson draws a consequence rather than proving anything.',
  },
  vocabulary: [
    { term: 'irrational', meaning: 'Not expressible as a ratio of two whole numbers.' },
    { term: 'approximation', meaning: 'A value used in place of an exact one, with a known limit to its accuracy.' },
  ],
  explanation: [
    'Pi is irrational: no fraction of whole numbers equals it exactly. The proof is well beyond this stage and is not attempted here, but the consequence is immediate and useful.',
    'The consequence is that there is no best fraction for pi. Whatever fraction you choose, a better one exists. 22/7 is right to two decimal places; 355/113 is right to six. Neither is pi, and neither is the closest possible.',
    'That is a different situation from approximating a rational number. One third is exactly 1/3 — the decimal 0.333 is an approximation, but a perfect fraction exists. For pi no such fraction exists at all, so approximation is not a convenience but the only option.',
    'Which approximation to use is a practical choice. 22/7 is chosen when the radius is a multiple of 7, because the sevens cancel and the arithmetic stays whole. 3.14 suits decimal work. Leaving the answer with the symbol pi in it is exact and often best.',
    'Indian mathematicians worked on this for centuries: Madhava of Sangamagrama found an infinite series whose terms, added indefinitely, approach pi — one more sign that pi is reached by a never-ending process rather than written down as a fraction.',
  ],
  representations: ['Successive approximations with their accuracy shown', 'An exact answer carrying the symbol pi beside its decimal version'],
  visuals: [],
  visualsById: {  },
  workedExamples: [
    {
      id: 's63.we1',
      prompt: 'Which is closer to pi: 22/7 or 355/113?',
      steps: [
        { text: 'As decimals, 22/7 is about 3.142857 and 355/113 about 3.1415929.', reasoning: 'Converting both to decimals puts them on a comparable footing.' },
        { text: 'Pi is 3.1415926...', reasoning: 'Comparing digit by digit shows where each one departs.' },
        { text: '22/7 differs in the third decimal place; 355/113 agrees to six.', reasoning: 'The second is far closer, though still not exact.' },
      ],
      answer: '355/113, by a wide margin — and neither is pi.',
    },
    {
      id: 's63.we2',
      prompt: 'Find the circumference of a circle of radius 14 cm, and give both an exact and an approximate answer.',
      steps: [
        { text: 'Exactly, the circumference is 2 pi times 14 = 28 pi cm.', reasoning: 'Leaving pi in the expression is exact and loses nothing.' },
        { text: 'With pi as 22/7 the radius supplies the factor of 7 that cancels.', reasoning: 'Choosing the approximation to suit the numbers keeps the arithmetic whole.' },
        { text: 'That gives 88 cm.', reasoning: 'An approximation, correct to the nearest centimetre here.' },
      ],
      answer: 'Exactly 28 pi cm, which is about 88 cm.',
    },
    {
      id: 's63.we3',
      prompt: 'Why can there be no best fraction for pi?',
      steps: [
        { text: 'A best fraction would be the closest of all fractions to pi.', reasoning: 'That is what "best" would have to mean.' },
        { text: 'Between any fraction and pi there is room for another fraction.', reasoning: 'The fractions are dense, so one can always be found closer.' },
        { text: 'So no fraction is closest, and none equals pi since it is irrational.', reasoning: 'Both halves matter: not exact, and not even closest.' },
      ],
      answer: 'Because a closer fraction always exists, and none is ever exact.',
    },
  ],
  misconceptionIds: [],
  guidedPractice: [
    {
      id: 's63.g1',
      prompt: 'Is 22/7 equal to pi?',
      hint: 'Is pi a fraction at all?',
      answer: 'No.',
      rationale: 'It is an approximation correct to two decimal places.',
    },
    {
      id: 's63.g2',
      prompt: 'When is 22/7 a convenient choice?',
      hint: 'What cancels?',
      answer: 'When the radius or diameter is a multiple of 7.',
      rationale: 'The seven cancels and the arithmetic stays whole.',
    },
    {
      id: 's63.g3',
      prompt: 'Is the answer 12 pi cm exact?',
      hint: 'Has pi been replaced by anything?',
      answer: 'Yes.',
      rationale: 'Keeping the symbol pi means nothing has been approximated.',
    },
  ],
  independentPractice: [
    {
      id: 's63.i1',
      prompt: 'Write the circumference of a circle of radius 9 cm exactly.',
      answer: '18 pi cm.',
      rationale: 'Two pi r with the symbol kept.',
    },
    {
      id: 's63.i2',
      prompt: 'Which approximation suits a circle of diameter 3.5 m, and why?',
      answer: '22/7, since 3.5 is 7 halves.',
      rationale: 'The sevens cancel.',
    },
    {
      id: 's63.i3',
      prompt: 'Explain the difference between approximating pi and approximating one third.',
      answer: 'One third has an exact fraction; pi has none.',
      rationale: 'Approximation is optional in one case and unavoidable in the other.',
    },
  ],
  reasoningApplication: [
    {
      id: 's63.r1',
      prompt: 'A student says 355/113 "is" pi because a calculator shows the same digits. Explain what the calculator is actually showing and what the student has concluded wrongly.',
      expectedReasoning:
        'The calculator displays a limited number of digits, and the two agree only within that window; they differ further along. A strong answer separates agreeing to the shown precision from being equal, and connects it to irrationality meaning no fraction can ever be exact.',
    },
  ],
  interactivePractice: [],
  summary:
    'Pi is irrational, so no fraction equals it and none is closest — every approximation can be improved. Which approximation to use is a practical choice, and keeping the symbol pi gives an exact answer.',
  nextStep:
    'Next you will measure part of a circle’s border rather than all of it.',
  teacher: {
    objective: 'Students interpret the irrationality of pi for approximation choices.',
    prerequisiteKnowledge: ['Irrational numbers', 'Decimal comparison'],
    modelLanguage: ['Exact or approximate?', 'Which approximation suits these numbers?'],
    teachingNotes: [
      'The proof is out of scope and should be said so plainly; students should not think it was shown.',
      'Reward exact answers carrying pi. Students convert to decimals reflexively and lose precision for nothing.',
    ],
    quickChecks: ['Is this exact?', 'Why that approximation?'],
    supportForStrugglingLearners: [
      'Compare decimal expansions side by side, aligned by place.',
      'Keep a worked example with the pi symbol retained throughout.',
    ],
    extension: ['Ask how many decimal places of pi a calculation of the earth’s circumference would really need.'],
    materialsNeeded: ['Calculator'],
  },
  reviewStatus: 'authored_draft',
};

export const SECTION_6_4: AuthoredSection = {
  contentArtifactId: 'ncert_iemh1_s6_4_lesson',
  contentArtifactVersion: 1,
  source: source('6.4', 'Length of an Arc of a Circle', 8, 'ncert_iemh1_s6_4'),
  competencyCandidates: [],
  competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_iemh1_s6_2'],
    mayAssume: ['Circumference as 2 pi r', 'Fractions of a whole', 'Angles at a centre'],
    mustNotIntroduce: [{ concept: 'Perimeter problems and paradoxes', belongsToSection: 'ncert_iemh1_s6_5' }, { concept: 'Area of a sector', belongsToSection: 'ncert_iemh1_s6_10' }],
  },
  learningGoal:
    'You will find the length of an arc as the fraction of the circumference determined by its angle at the centre.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: ['Compute a circumference from a radius.', 'Write an angle as a fraction of 360 degrees.', 'Multiply a quantity by a fraction.'],
    ifNotReady: 'Make sure circumference is fluent; an arc is a share of it.',
  },
  vocabulary: [
    { term: 'arc', meaning: 'Part of the circle between two points on it.' },
    { term: 'angle at the centre', meaning: 'The angle the arc subtends at the centre, which fixes its share.' },
  ],
  explanation: [
    'A full turn round a circle covers the whole circumference. Half a turn covers half of it, and a quarter turn a quarter. An arc is just part of that journey, and the angle at the centre says what part.',
    'So the rule writes itself. An arc whose angle at the centre is theta degrees takes theta out of 360 of the full turn, so its length is 2 pi r times theta over 360. Nothing new is being derived — it is the circumference scaled by a fraction.',
    'Check it on the cases you already know. At 180 degrees the fraction is one half, giving pi r, which is the semicircle. At 90 degrees it is a quarter, giving half pi r. Both agree with what counting quarters would give.',
    'Keep the arc separate from the sector it bounds. The arc is a curved length, measured in centimetres. The region between the arc and the two radii is a sector, which has an area and comes later in this chapter. The same angle governs both, but they are different quantities in different units.',
    'And the angle alone never gives a length. Two arcs of 60 degrees in circles of different radius have different lengths, because the fraction is the same but the circumference it is a fraction of is not.',
  ],
  representations: ['An arc with its angle at the centre marked, and the full circle for comparison', 'A semicircle and a quadrant as the fractions one half and one quarter'],
  visuals: [],
  visualsById: {  },
  workedExamples: [
    {
      id: 's64.we1',
      prompt: 'Find the length of a 90-degree arc in a circle of radius 14 cm, with pi as 22/7.',
      steps: [
        { text: 'The full circumference is 2 times 22/7 times 14 = 88 cm.', reasoning: 'The arc is a share of this, so it is computed first.' },
        { text: 'The angle is 90 of 360 degrees, which is one quarter.', reasoning: 'The angle at the centre fixes the share of the full turn.' },
        { text: 'A quarter of 88 is 22 cm.', reasoning: 'Multiplying the circumference by the fraction gives the arc.' },
      ],
      answer: '22 cm.',
    },
    {
      id: 's64.we2',
      prompt: 'An arc of 60 degrees has length 11 cm. Find the radius, with pi as 22/7.',
      steps: [
        { text: 'Sixty degrees is one sixth of a full turn.', reasoning: 'Dividing 60 by 360 gives the fraction.' },
        { text: 'So the whole circumference is six times 11 = 66 cm.', reasoning: 'Reversing the fraction recovers the whole.' },
        { text: 'Then 2 times 22/7 times r = 66, giving r = 10.5 cm.', reasoning: 'Solving for the radius from the circumference.' },
      ],
      answer: '10.5 cm.',
    },
    {
      id: 's64.we3',
      prompt: 'Two arcs each subtend 60 degrees, in circles of radius 7 cm and 21 cm. Compare their lengths.',
      steps: [
        { text: 'Both take the same fraction, one sixth, of their own circumference.', reasoning: 'Equal angles mean equal shares, but of different wholes.' },
        { text: 'The circumferences are 44 cm and 132 cm.', reasoning: 'The larger radius gives a proportionally larger circumference.' },
        { text: 'The arcs are 22/3 cm and 22 cm — the second is three times the first.', reasoning: 'The ratio of the arcs matches the ratio of the radii.' },
      ],
      answer: 'The larger circle’s arc is three times as long, matching the ratio of the radii.',
    },
  ],
  misconceptionIds: [],
  guidedPractice: [
    {
      id: 's64.g1',
      prompt: 'What fraction of the circumference is a 45-degree arc?',
      hint: '45 out of 360.',
      answer: 'One eighth.',
      rationale: 'The angle is one eighth of a full turn.',
    },
    {
      id: 's64.g2',
      prompt: 'A semicircular arc in a circle of radius 10 cm. Find its length with pi as 3.14.',
      hint: 'Half the circumference.',
      answer: '31.4 cm',
      rationale: 'Half of 62.8.',
    },
    {
      id: 's64.g3',
      prompt: 'Is an arc length measured in square units?',
      hint: 'Is an arc part of the border, or part of the inside?',
      answer: 'No, in linear units.',
      rationale: 'An arc is part of the border, so it is a length.',
    },
  ],
  independentPractice: [
    {
      id: 's64.i1',
      prompt: 'Find the length of a 120-degree arc in a circle of radius 21 cm, with pi as 22/7.',
      answer: '44 cm.',
      rationale: 'One third of the 132 cm circumference.',
    },
    {
      id: 's64.i2',
      prompt: 'An arc of 36 degrees has length 6.28 cm. Find the radius with pi as 3.14.',
      answer: '10 cm.',
      rationale: 'One tenth of a turn, so the circumference is 62.8.',
    },
    {
      id: 's64.i3',
      prompt: 'Explain why the angle alone does not determine an arc length.',
      answer: 'Because the arc is a fraction of a circumference that depends on the radius.',
      rationale: 'Same share, different whole.',
    },
  ],
  reasoningApplication: [
    {
      id: 's64.r1',
      prompt: 'An arc subtends 30 degrees. Describe how its length changes as the radius doubles, and explain why without recomputing.',
      expectedReasoning:
        'It doubles, because the fraction stays one twelfth while the circumference it is a fraction of doubles with the radius. A strong answer argues from the proportionality rather than computing two cases, and notes this is why arc length is proportional to radius for a fixed angle.',
    },
  ],
  interactivePractice: [],
  summary:
    'An arc takes the same share of the circumference as its angle takes of a full turn, so its length is 2 pi r times theta over 360. The arc is a length; the sector it bounds is a region, and the two must not be confused.',
  nextStep:
    'Next you will put perimeter reasoning to work on shapes made of straight and curved parts.',
  teacher: {
    objective: 'Students compute arc length as a fraction of circumference.',
    prerequisiteKnowledge: ['Circumference', 'Fractions of 360'],
    modelLanguage: ['What fraction of a full turn?', 'Length or area?'],
    teachingNotes: [
      'Check every answer against the semicircle and quadrant cases; they are the sanity check students can do without a formula.',
      'Separate arc from sector explicitly now, before the sector arrives in §6.10.',
    ],
    quickChecks: ['Which fraction, and of what?', 'What unit?'],
    supportForStrugglingLearners: [
      'Write the fraction as a simplified fraction before multiplying.',
      'Mark the angle on the figure before computing.',
    ],
    extension: ['Ask what angle gives an arc equal in length to the radius.'],
    materialsNeeded: ['Compasses', 'Protractor'],
  },
  reviewStatus: 'authored_draft',
};

export const SECTION_6_5: AuthoredSection = {
  contentArtifactId: 'ncert_iemh1_s6_5_lesson',
  contentArtifactVersion: 1,
  source: source('6.5', 'Problems, Puzzles, and Paradoxes on Perimeter', 10, 'ncert_iemh1_s6_5'),
  competencyCandidates: [],
  competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_iemh1_s6_4'],
    mayAssume: ['Perimeter of polygons', 'Circumference and arc length', 'Composite shapes'],
    mustNotIntroduce: [{ concept: 'Area of a rectangle', belongsToSection: 'ncert_iemh1_s6_6' }],
  },
  learningGoal:
    'You will compute perimeters of composite figures made of straight and curved parts, and test intuitions about perimeter that turn out to be wrong.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: ['Find an arc length from its angle.', 'Add lengths of different kinds.', 'Identify which edges form a border.'],
    ifNotReady: 'Make sure arc length is secure; composite borders mix straight and curved pieces.',
  },
  vocabulary: [
    { term: 'composite figure', meaning: 'A shape whose border is made of several pieces of different kinds.' },
    { term: 'paradox', meaning: 'A result that contradicts intuition while being correct.' },
  ],
  explanation: [
    'A 400 metre athletics track is two straight sections joined by two semicircular ends. Its border is a composite: add the two straights and the two semicircles, which together make one full circle. The perimeter is then 2 times the straight plus 2 pi r, with the radius that of the bend.',
    'The general method is always the same. Trace the border once, list every piece, decide whether each is straight or curved, compute each, and add. Pieces that are not on the border — an internal line, a radius drawn to help — are not part of the perimeter, which is where composite figures usually go wrong.',
    'Now a result that most people get wrong. Take a semicircle on a diameter of 12 cm, and replace it with two semicircles on diameters of 6 cm each sitting on the same line. The curved length is unchanged: pi times 6 for the big one, and pi times 3 twice for the small ones, both giving 6 pi.',
    'Do it again with four semicircles of 3 cm, or a hundred of tiny diameter, and the curved length stays 6 pi every time, even as the bumpy path hugs the straight line ever more closely. The path looks as if it is becoming the diameter, which is 12 cm, but its length stays at about 18.8 cm and never approaches 12.',
    'That is the paradox, and the lesson in it is precise: a sequence of curves can approach a straight line in position while their lengths do not approach its length. Looking closer is not measuring, and this is exactly why perimeter is computed rather than judged by eye.',
  ],
  representations: ['A track as two straights and two semicircles forming one circle', 'One semicircle replaced by two, then four, with the curved length unchanged'],
  visuals: [],
  visualsById: {  },
  workedExamples: [
    {
      id: 's65.we1',
      prompt: 'A track has two straights of 100 m and two semicircular ends of radius 35 m. Find its perimeter, with pi as 22/7.',
      steps: [
        { text: 'List the border pieces: two straights and two semicircles.', reasoning: 'Tracing the border once is what guarantees nothing is missed or double counted.' },
        { text: 'The two semicircles together make one full circle of radius 35.', reasoning: 'Two halves of equal circles join into one whole, which simplifies the arithmetic.' },
        { text: 'That circle has circumference 2 times 22/7 times 35 = 220 m.', reasoning: 'Computing the curved part as a single circle.' },
        { text: 'Total is 200 + 220 = 420 m.', reasoning: 'Adding the straight and curved parts of the border.' },
      ],
      answer: '420 m.',
    },
    {
      id: 's65.we2',
      prompt: 'A semicircle on a 12 cm diameter is replaced by two semicircles on 6 cm diameters. Compare the curved lengths.',
      steps: [
        { text: 'The original curved length is half of pi times 12, which is 6 pi.', reasoning: 'A semicircle is half its circle’s circumference.' },
        { text: 'Each small one is half of pi times 6, which is 3 pi.', reasoning: 'Halving the diameter halves the semicircular arc.' },
        { text: 'Two of them give 6 pi again.', reasoning: 'Twice as many pieces, each half as long, leaves the total unchanged.' },
      ],
      answer: 'Identical, both 6 pi — about 18.8 cm.',
    },
    {
      id: 's65.we3',
      prompt: 'With a hundred such semicircles the path looks almost straight. Is its length near 12 cm?',
      steps: [
        { text: 'Each semicircle has diameter 0.12 cm and arc 0.06 pi.', reasoning: 'Dividing the 12 cm into a hundred equal diameters.' },
        { text: 'A hundred of them total 6 pi again.', reasoning: 'The same cancellation as before, however many pieces are used.' },
        { text: 'So the length stays about 18.8 cm, never approaching 12.', reasoning: 'Position and length are different things; getting visually close to the line does not shorten the path.' },
      ],
      answer: 'No. It stays 6 pi, about 18.8 cm, however straight it looks.',
    },
  ],
  misconceptionIds: [],
  guidedPractice: [
    {
      id: 's65.g1',
      prompt: 'Two semicircular ends of equal radius. What do they make together?',
      hint: 'Two halves of the same size.',
      answer: 'One full circle.',
      rationale: 'So their total curved length is one circumference.',
    },
    {
      id: 's65.g2',
      prompt: 'Is a radius drawn inside a figure part of its perimeter?',
      hint: 'Is it on the border?',
      answer: 'No.',
      rationale: 'Only the border counts; internal lines help the calculation but are not perimeter.',
    },
    {
      id: 's65.g3',
      prompt: 'Why does the bumpy path not approach 12 cm?',
      hint: 'What stays constant as the bumps shrink?',
      answer: 'Because its length stays 6 pi whatever the number of bumps.',
      rationale: 'Approaching the line in position does not mean approaching it in length.',
    },
  ],
  independentPractice: [
    {
      id: 's65.i1',
      prompt: 'A figure is a 10 cm by 6 cm rectangle with a semicircle of diameter 6 cm on one short side. Find its perimeter with pi as 3.14.',
      answer: '35.42 cm.',
      rationale: 'Three straight sides, 10 + 6 + 10, plus the semicircular arc of 9.42.',
    },
    {
      id: 's65.i2',
      prompt: 'A track has straights of 80 m and semicircular ends of radius 28 m. Find its perimeter with pi as 22/7.',
      answer: '336 m.',
      rationale: '160 straight plus a full circle of 176.',
    },
    {
      id: 's65.i3',
      prompt: 'Explain why perimeter should be computed rather than estimated by eye on a composite shape.',
      answer: 'Because a path can look close to another and have a very different length.',
      rationale: 'The semicircle paradox is the standing counterexample.',
    },
  ],
  reasoningApplication: [
    {
      id: 's65.r1',
      prompt: 'The bumpy path keeps its length while approaching the straight line. Does the region enclosed between them also stay the same? Reason about it.',
      expectedReasoning:
        'No: the enclosed region shrinks towards nothing as the bumps get smaller, since each bump encloses less area while the arc length is preserved. A strong answer sees that area and perimeter behave quite differently under this process, which is the chapter’s wider point about the two measures being independent.',
    },
  ],
  interactivePractice: [],
  summary:
    'A composite perimeter is found by tracing the border, computing each straight and curved piece, and adding. Replacing one semicircle by many smaller ones leaves the curved length unchanged, so a path can approach a line in position without approaching it in length.',
  nextStep:
    'Next you will turn from the border to the space inside it.',
  teacher: {
    objective: 'Students compute composite perimeters and interpret the semicircle paradox.',
    prerequisiteKnowledge: ['Arc length', 'Composite shapes'],
    modelLanguage: ['Which pieces are on the border?', 'Did the length actually change?'],
    teachingNotes: [
      'Draw the two-then-four semicircle sequence on the board and compute each stage. The constancy has to be seen to be believed.',
      'Press the distinction between position and length; it is the mathematical content, not a curiosity.',
    ],
    quickChecks: ['Straight or curved, piece by piece?', 'Why does this not approach 12?'],
    supportForStrugglingLearners: [
      'Trace the border with a finger, listing pieces aloud before computing.',
      'Keep straight and curved pieces in two separate columns.',
    ],
    extension: ['Ask what happens to the area between the bumpy path and the line as the bumps shrink.'],
    materialsNeeded: ['Compasses', 'Ruler'],
  },
  reviewStatus: 'authored_draft',
};

export const SECTION_6_6_7: AuthoredSection = {
  contentArtifactId: 'ncert_iemh1_s6_6_7_lesson',
  contentArtifactVersion: 1,
  source: {
    ...source('6.6', 'Area of a Rectangle', 13, 'ncert_iemh1_s6_6'),
    // The merged lesson covers §6.7 Area of a Parallelogram as well.
    additionalOfficialSectionIds: ['ncert_iemh1_s6_7'],
  },
  competencyCandidates: [],
  competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_iemh1_s6_1'],
    mayAssume: ['Area as a count of unit squares', 'Perimeter as a border length', 'Congruent triangles'],
    mustNotIntroduce: [{ concept: 'Area of a triangle', belongsToSection: 'ncert_iemh1_s6_8' }, { concept: 'Area of a circle', belongsToSection: 'ncert_iemh1_s6_10' }],
  },
  learningGoal:
    'You will take the rectangle area as the chapter’s starting point and derive the area of a parallelogram from it by cutting and reattaching a right triangle.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: ['Find the area of a rectangle from its sides.', 'Say what makes two triangles congruent.', 'Identify a perpendicular.'],
    ifNotReady: 'Make sure area and perimeter are clearly separate in your mind before starting.',
  },
  vocabulary: [
    { term: 'area', meaning: 'The amount of surface a shape covers, measured in square units.' },
    { term: 'base', meaning: 'The side chosen to measure from.' },
    { term: 'height', meaning: 'The perpendicular distance from the base to the opposite side.' },
  ],
  explanation: [
    'Area counts how much surface a shape covers. For a rectangle of length l and breadth b, unit squares fill it in l columns of b, so the area is l times b — and the unit is square centimetres, because two lengths were multiplied.',
    'That single result carries the rest of the chapter. Every other figure here is derived from the rectangle by cutting and rearranging, never by a new assumption.',
    'Take a parallelogram. Drop a perpendicular from one top corner to the base, cut off the right triangle it forms, and slide that triangle to the other end. It fits exactly, because the two ends of a parallelogram match. What is left is a rectangle with the same base and the same height.',
    'Cutting and sliding a piece does not change how much surface there is, so the parallelogram has the same area as that rectangle: base times height. The derivation is the content; the formula is its summary.',
    'The height must be the perpendicular distance, not the slant side. The slant side is longer, and using it gives an answer that is too large. A parallelogram with base 8 and height 5 has area 40 whatever its slant side is — and as it leans further, the slant side grows while the area falls, which is worth watching once.',
  ],
  representations: ['A parallelogram with the perpendicular height marked and the slant side labelled separately', 'The cut triangle slid across to make the rectangle'],
  visuals: [F_PARALLELOGRAM],
  visualsById: { F_PARALLELOGRAM },
  workedExamples: [
    {
      id: 's667.we1',
      prompt: 'Find the area of a rectangle 9 cm by 4 cm, and its perimeter.',
      steps: [
        { text: 'Area is length times breadth: 9 times 4 = 36.', reasoning: 'Two lengths multiplied give a region, so the unit becomes square centimetres.' },
        { text: 'The unit is square centimetres.', reasoning: 'Keeping the unit type right is what separates this from perimeter.' },
        { text: 'Perimeter is 2 times (9 + 4) = 26 cm.', reasoning: 'A length, so the unit stays linear.' },
      ],
      answer: 'Area 36 square cm; perimeter 26 cm — two different quantities in different units.',
    },
    {
      id: 's667.we2',
      prompt: 'A parallelogram has base 8 cm and height 5 cm. Find its area.',
      steps: [
        { text: 'Cutting the right triangle from one end and sliding it to the other gives a rectangle of base 8 and height 5.', reasoning: 'Rearranging pieces does not change the surface covered, which is why the areas are equal.' },
        { text: 'That rectangle has area 8 times 5.', reasoning: 'The rectangle result, already established, does the work.' },
        { text: 'So the parallelogram has area 40 square cm.', reasoning: 'Base times perpendicular height.' },
      ],
      answer: '40 square cm.',
      visualRef: 'F_PARALLELOGRAM',
    },
    {
      id: 's667.we3',
      prompt: 'A parallelogram has base 8 cm, slant side 6 cm and height 5 cm. A student computes 8 times 6. What is wrong?',
      steps: [
        { text: 'The student has used the slant side where the height belongs.', reasoning: 'The derivation required the perpendicular distance, since that is the rectangle’s height.' },
        { text: 'The slant side is longer than the height whenever the figure leans.', reasoning: 'It is the hypotenuse of the right triangle that was cut off.' },
        { text: 'So 48 overstates the true area of 40.', reasoning: 'Using a longer length than the derivation allows always gives too large an answer.' },
      ],
      answer: 'The slant side is not the height; the area is 40 square cm, not 48.',
    },
  ],
  misconceptionIds: [],
  guidedPractice: [
    {
      id: 's667.g1',
      prompt: 'A rectangle is 12 m by 5 m. Find its area.',
      hint: 'Length times breadth.',
      answer: '60 square m',
      rationale: 'Two lengths multiplied give square units.',
    },
    {
      id: 's667.g2',
      prompt: 'Which length does a parallelogram’s area use?',
      hint: 'What was the rectangle’s height after the cut?',
      answer: 'The perpendicular height.',
      rationale: 'The slant side would overstate it.',
    },
    {
      id: 's667.g3',
      prompt: 'Why does cutting and sliding not change the area?',
      hint: 'Is any surface added or removed?',
      answer: 'Because the same pieces cover the same surface.',
      rationale: 'Rearrangement preserves area.',
    },
  ],
  independentPractice: [
    {
      id: 's667.i1',
      prompt: 'Find the area of a parallelogram with base 15 cm and height 6 cm.',
      answer: '90 square cm.',
      rationale: 'Base times perpendicular height.',
    },
    {
      id: 's667.i2',
      prompt: 'A parallelogram has area 72 square cm and base 12 cm. Find its height.',
      answer: '6 cm.',
      rationale: 'Dividing the area by the base reverses the multiplication.',
    },
    {
      id: 's667.i3',
      prompt: 'Explain why the rectangle result is derived first in this chapter.',
      answer: 'Because every later area is obtained from it by rearrangement.',
      rationale: 'It is the starting point the others rest on.',
    },
  ],
  reasoningApplication: [
    {
      id: 's667.r1',
      prompt: 'As a parallelogram leans further over with its base and slant side unchanged, describe what happens to its perimeter and to its area, and explain the difference.',
      expectedReasoning:
        'The perimeter is unchanged, since the four side lengths are the same, while the area falls because the perpendicular height shrinks. A strong answer concludes that perimeter and area are independent measures, and sees the limiting case where the figure flattens to nothing with its perimeter intact.',
    },
  ],
  interactivePractice: [],
  summary:
    'A rectangle’s area is length times breadth in square units, and cutting a right triangle from a parallelogram and reattaching it makes a rectangle of the same base and height — so the parallelogram’s area is base times perpendicular height. The slant side is not the height.',
  nextStep:
    'Next you will build a triangle out of two copies of itself.',
  teacher: {
    objective: 'Students derive the parallelogram area from the rectangle and distinguish height from slant side.',
    prerequisiteKnowledge: ['Area of a rectangle', 'Congruence'],
    modelLanguage: ['Is that the perpendicular height?', 'Square units or linear?'],
    teachingNotes: [
      'This lesson merges §6.6 with §6.7 because §6.6 is one page supplying the rectangle result §6.7 immediately uses; alone it is a sentence.',
      'Cut a paper parallelogram and slide the triangle physically. The equality of areas is then observed before it is argued.',
      'The height-versus-slant error is the chapter’s main one and should be named every lesson from here.',
    ],
    quickChecks: ['Which length is the height?', 'What unit does area take?'],
    supportForStrugglingLearners: [
      'Cut and reassemble a paper parallelogram before computing anything.',
      'Mark the height with a right angle on every figure.',
    ],
    extension: ['Ask for two parallelograms with equal perimeter and very different areas.'],
    materialsNeeded: ['Paper parallelograms', 'Scissors', 'Ruler'],
  },
  reviewStatus: 'authored_draft',
};

export const SECTION_6_8_BASE: AuthoredSection = {
  contentArtifactId: 'ncert_iemh1_s6_8_base_lesson',
  contentArtifactVersion: 1,
  source: source('6.8', 'Area of a Triangle', 15, 'ncert_iemh1_s6_8'),
  competencyCandidates: [],
  competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_iemh1_s6_6'],
    mayAssume: ['Area of a parallelogram', 'Congruent triangles', 'Perpendicular height'],
    mustNotIntroduce: [{ concept: 'Heron\'s and Brahmagupta\'s formulas', belongsToSection: 'ncert_iemh1_s6_8' }, { concept: 'Squaring a rectangle', belongsToSection: 'ncert_iemh1_s6_9' }],
  },
  learningGoal:
    'You will derive the area of a triangle as half a parallelogram built from two congruent copies, and identify the height matching a chosen base.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: ['Find the area of a parallelogram.', 'Say what congruent triangles are.', 'Draw a perpendicular from a vertex to a side.'],
    ifNotReady: 'Make sure the parallelogram result is secure; the triangle is derived from it.',
  },
  vocabulary: [
    { term: 'base of a triangle', meaning: 'Any side you choose to measure from.' },
    { term: 'corresponding height', meaning: 'The perpendicular distance from the opposite vertex to that base, or to the line containing it.' },
  ],
  explanation: [
    'Take any triangle, make a second copy, turn it a half turn and join the two along a side. They fit into a parallelogram with the same base and the same height, because the two copies are congruent and the turn matches the sides up.',
    'The parallelogram has area base times height, and the triangle is exactly half of it. So the triangle has area half of base times height. One copy, one turn, and the parallelogram result does the rest.',
    'Any side can be the base, but the height must match it: the perpendicular distance from the opposite vertex to that base. A triangle therefore has three base-and-height pairs, and all three give the same area — which is a useful check and sometimes a shortcut when only one pair is measurable.',
    'For an obtuse triangle the foot of the perpendicular can fall outside the base, on its extension. The height is still the perpendicular distance from the vertex to the line of the base, and the formula is unchanged. The picture looks different; the mathematics does not.',
    'As with the parallelogram, a slant side is not a height unless the triangle happens to be right-angled, in which case one leg is the base and the other genuinely is the height. That special case is convenient and is not a general rule.',
  ],
  representations: ['Two congruent triangles forming a parallelogram on the same base', 'The three base-height pairs of one triangle, all giving the same area'],
  visuals: [F_TRIANGLE],
  visualsById: { F_TRIANGLE },
  workedExamples: [
    {
      id: 's68a.we1',
      prompt: 'Find the area of a triangle with base 12 cm and height 7 cm.',
      steps: [
        { text: 'Two copies of the triangle form a parallelogram of base 12 and height 7.', reasoning: 'The construction is what licenses the halving.' },
        { text: 'That parallelogram has area 12 times 7 = 84 square cm.', reasoning: 'Using the result from the previous lesson.' },
        { text: 'The triangle is half of it, so 42 square cm.', reasoning: 'One of the two congruent copies.' },
      ],
      answer: '42 square cm.',
      visualRef: 'F_TRIANGLE',
    },
    {
      id: 's68a.we2',
      prompt: 'A triangle has sides 13, 14 and 15 cm, and the height to the 14 cm side is 12 cm. Find its area.',
      steps: [
        { text: 'Choose the base to match the height given: the 14 cm side.', reasoning: 'Base and height must be a matching pair, which is what determines the choice.' },
        { text: 'Area is half of 14 times 12.', reasoning: 'The other two side lengths play no part in this method.' },
        { text: 'That is 84 square cm.', reasoning: 'Square units, since two lengths were multiplied.' },
      ],
      answer: '84 square cm — the 13 and 15 are not needed here.',
    },
    {
      id: 's68a.we3',
      prompt: 'A right triangle has legs 9 cm and 12 cm and hypotenuse 15 cm. Find its area.',
      steps: [
        { text: 'In a right triangle the two legs are perpendicular to each other.', reasoning: 'So one leg can serve as the base and the other genuinely is the height.' },
        { text: 'Area is half of 9 times 12.', reasoning: 'Taking the legs as the matching base-and-height pair.' },
        { text: 'That is 54 square cm; the hypotenuse is not used.', reasoning: 'Using 15 anywhere here would be the slant-side error in a new disguise.' },
      ],
      answer: '54 square cm.',
    },
  ],
  misconceptionIds: [],
  guidedPractice: [
    {
      id: 's68a.g1',
      prompt: 'A triangle has base 10 cm and height 6 cm. Find its area.',
      hint: 'Half of base times height.',
      answer: '30 square cm',
      rationale: 'Half of 60.',
    },
    {
      id: 's68a.g2',
      prompt: 'How many base-and-height pairs does a triangle have?',
      hint: 'One per side.',
      answer: 'Three.',
      rationale: 'All three give the same area.',
    },
    {
      id: 's68a.g3',
      prompt: 'A triangle has area 24 square cm and base 8 cm. Find its height.',
      hint: 'Reverse the halving and the multiplication.',
      answer: '6 cm',
      rationale: 'Twice the area divided by the base.',
    },
  ],
  independentPractice: [
    {
      id: 's68a.i1',
      prompt: 'Find the area of a triangle with base 18 m and height 11 m.',
      answer: '99 square m.',
      rationale: 'Half of 198.',
    },
    {
      id: 's68a.i2',
      prompt: 'A triangle has area 60 square cm with one base 15 cm. Find the matching height.',
      answer: '8 cm.',
      rationale: 'Twice 60 over 15.',
    },
    {
      id: 's68a.i3',
      prompt: 'Explain why a triangle is half the parallelogram built from two copies of it.',
      answer: 'Because the two congruent copies exactly fill the parallelogram.',
      rationale: 'Equal pieces split the whole in two.',
    },
  ],
  reasoningApplication: [
    {
      id: 's68a.r1',
      prompt: 'A triangle’s three base-and-height pairs all give the same area. Explain what that means about the relationship between a side and its matching height, without computing an example.',
      expectedReasoning:
        'A longer side must have a proportionally shorter matching height, since their product is fixed at twice the area. A strong answer draws the general relation rather than verifying one triangle, and sees it gives a way to find an awkward height from an easy one.',
    },
  ],
  interactivePractice: [],
  summary:
    'Two congruent copies of a triangle make a parallelogram on the same base and height, so the triangle’s area is half of base times height. Any side may be the base provided the height is the perpendicular distance matching it.',
  nextStep:
    'Next you will find a triangle’s area from its three sides, with no height at all.',
  teacher: {
    objective: 'Students derive the triangle area and pair each base with its own height.',
    prerequisiteKnowledge: ['Parallelogram area', 'Congruence'],
    modelLanguage: ['Which height matches that base?', 'Is that a perpendicular distance?'],
    teachingNotes: [
      'Make the two-copies construction physically; the halving is then obvious rather than a rule.',
      'Give at least one problem with a redundant side length, so students practise choosing the matching pair.',
      'Do an obtuse triangle once, so the external foot is met before it appears in an exercise.',
    ],
    quickChecks: ['Base and height — do they match?', 'Which lengths are not needed?'],
    supportForStrugglingLearners: [
      'Cut two identical paper triangles and form the parallelogram.',
      'Mark the right angle at the foot of every height.',
    ],
    extension: ['Ask for the height to the shortest side of a 3-4-5 triangle.'],
    materialsNeeded: ['Paper triangles', 'Scissors', 'Ruler'],
  },
  reviewStatus: 'authored_draft',
};

export const SECTION_6_8_HERON: AuthoredSection = {
  contentArtifactId: 'ncert_iemh1_s6_8_heron_lesson',
  contentArtifactVersion: 1,
  source: source('6.8', 'Area of a Triangle', 15, 'ncert_iemh1_s6_8'),
  competencyCandidates: [],
  competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_iemh1_s6_8'],
    mayAssume: ['Area of a triangle from base and height', 'Square roots', 'Cyclic quadrilaterals from chapter 5'],
    mustNotIntroduce: [{ concept: 'Squaring a rectangle', belongsToSection: 'ncert_iemh1_s6_9' }],
  },
  learningGoal:
    'You will find a triangle’s area from its three sides using the semi-perimeter formula, and see Heron’s result as the special case of Brahmagupta’s.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: ['Compute a perimeter from three sides.', 'Find a square root.', 'Say what a cyclic quadrilateral is.'],
    ifNotReady: 'Make sure square roots are comfortable; the formula ends in one.',
  },
  vocabulary: [
    { term: 'semi-perimeter', meaning: 'Half the perimeter, usually written s.' },
    { term: 'Heron\'s formula', meaning: 'The area of a triangle from its three sides.' },
    { term: 'Brahmagupta\'s formula', meaning: 'The area of a cyclic quadrilateral from its four sides.' },
  ],
  explanation: [
    'Base and height is not always available. A triangular plot may be known only by its three side lengths, with no height measured and no easy way to measure one.',
    'There is a formula for exactly that case. Let s be half the perimeter. Then the area is the square root of s times (s − a) times (s − b) times (s − c), where a, b and c are the sides. It is called Heron’s formula, and this chapter uses it rather than proving it.',
    'Try it on the 3-4-5 triangle, where the answer is already known. The perimeter is 12, so s is 6, and the product is 6 times 3 times 2 times 1 = 36, whose square root is 6. Base and height give half of 3 times 4, which is also 6. The two methods agree, which is the check worth doing before trusting a formula.',
    'Brahmagupta extended this to a cyclic quadrilateral — four vertices on one circle, from chapter 5. With sides a, b, c, d and s again the semi-perimeter, the area is the square root of (s − a)(s − b)(s − c)(s − d).',
    'Now look at what happens when one side shrinks to nothing. Put d = 0 and the quadrilateral collapses to a triangle; the last bracket becomes s, and the expression becomes Heron’s formula exactly. Heron is not a separate result but the special case of Brahmagupta’s with a vanishing fourth side.',
  ],
  representations: ['A triangle labelled by its three sides with no height drawn', 'Brahmagupta’s quadrilateral collapsing to Heron’s triangle as one side vanishes'],
  visuals: [],
  visualsById: {  },
  workedExamples: [
    {
      id: 's68b.we1',
      prompt: 'Find the area of a triangle with sides 13, 14 and 15 cm.',
      steps: [
        { text: 'The perimeter is 42, so the semi-perimeter s is 21.', reasoning: 'Halving the perimeter is the first step of the formula.' },
        { text: 'The three brackets are 21 − 13 = 8, 21 − 14 = 7 and 21 − 15 = 6.', reasoning: 'Each side is subtracted from s in turn.' },
        { text: 'The product is 21 times 8 times 7 times 6 = 7056.', reasoning: 'Multiplying all four factors before taking any root.' },
        { text: 'Its square root is 84 square cm.', reasoning: 'The formula ends in a root, and the unit is square because this is an area.' },
      ],
      answer: '84 square cm — matching the base-and-height answer from the previous lesson.',
    },
    {
      id: 's68b.we2',
      prompt: 'Check Heron’s formula on a right triangle with sides 6, 8 and 10 cm.',
      steps: [
        { text: 'The semi-perimeter is 12.', reasoning: 'The perimeter is 24, and the semi-perimeter is half of it.' },
        { text: 'The product is 12 times 6 times 4 times 2 = 576.', reasoning: 'Subtracting each side from 12 in turn.' },
        { text: 'The square root is 24 square cm.', reasoning: 'Taking the root completes the formula and gives the area in square units.' },
        { text: 'Base and height give half of 6 times 8 = 24.', reasoning: 'The two legs are perpendicular, so they are a base-height pair, and the answers agree.' },
      ],
      answer: '24 square cm by both methods.',
    },
    {
      id: 's68b.we3',
      prompt: 'Show that Brahmagupta’s formula becomes Heron’s when the fourth side is zero.',
      steps: [
        { text: 'With d = 0, s is half of a + b + c, which is the triangle’s semi-perimeter.', reasoning: 'Removing one side turns the quadrilateral into a triangle.' },
        { text: 'The fourth bracket is s − 0, which is just s.', reasoning: 'That bracket, which distinguished the two formulas, becomes the leading factor.' },
        { text: 'The expression becomes the root of s(s − a)(s − b)(s − c).', reasoning: 'Which is Heron’s formula exactly.' },
      ],
      answer: 'Heron’s formula is the d = 0 case of Brahmagupta’s.',
    },
  ],
  misconceptionIds: [],
  guidedPractice: [
    {
      id: 's68b.g1',
      prompt: 'A triangle has sides 5, 12 and 13. Find s.',
      hint: 'Half the perimeter.',
      answer: '15',
      rationale: 'Perimeter 30, halved.',
    },
    {
      id: 's68b.g2',
      prompt: 'When would you choose Heron over base-and-height?',
      hint: 'What is given to you?',
      answer: 'When only the three sides are known.',
      rationale: 'No height is needed.',
    },
    {
      id: 's68b.g3',
      prompt: 'How many sides does Brahmagupta’s formula need, and what must the quadrilateral be?',
      hint: 'Four sides, and a special condition.',
      answer: 'Four, and the quadrilateral must be cyclic.',
      rationale: 'All four vertices must lie on one circle.',
    },
  ],
  independentPractice: [
    {
      id: 's68b.i1',
      prompt: 'Find the area of a triangle with sides 7, 24 and 25 cm.',
      answer: '84 square cm.',
      rationale: 's is 28; the product is 28 times 21 times 4 times 3.',
    },
    {
      id: 's68b.i2',
      prompt: 'Find the area of a cyclic quadrilateral with sides 3, 4, 5 and 6 cm.',
      answer: 'About 18.97 square cm.',
      rationale: 's is 9; the product is 6 times 5 times 4 times 3 = 360.',
    },
    {
      id: 's68b.i3',
      prompt: 'Explain why Heron is called a special case rather than a separate formula.',
      answer: 'Because it is Brahmagupta’s with the fourth side set to zero.',
      rationale: 'One result covers both.',
    },
  ],
  reasoningApplication: [
    {
      id: 's68b.r1',
      prompt: 'Heron’s formula uses only the three sides, with no height. Explain why that is enough to determine the area, and what it says about how much three side lengths fix.',
      expectedReasoning:
        'Three side lengths determine a triangle completely up to position, by SSS congruence, so every other measurement including the area is already fixed by them. A strong answer connects the formula to the congruence condition rather than treating it as a lucky algebraic fact.',
    },
  ],
  interactivePractice: [],
  summary:
    'Heron’s formula gives a triangle’s area from its three sides through the semi-perimeter, and Brahmagupta’s does the same for a cyclic quadrilateral from four sides. Setting the fourth side to zero turns one into the other.',
  nextStep:
    'Next you will turn a rectangle into a square of exactly the same area.',
  teacher: {
    objective: 'Students apply the semi-perimeter formulas and relate Heron to Brahmagupta.',
    prerequisiteKnowledge: ['Square roots', 'Perimeter', 'Cyclic quadrilaterals'],
    modelLanguage: ['What is given — sides or a height?', 'Does the check agree?'],
    teachingNotes: [
      'Always verify on a triangle whose area is known another way. A formula accepted without a check is memorised, not understood.',
      'The d = 0 collapse is a one-line derivation worth doing on the board; it turns two formulas into one.',
    ],
    quickChecks: ['Which method does this question allow?', 'What is s here?'],
    supportForStrugglingLearners: [
      'Lay out s and the three brackets in a column before multiplying.',
      'Check every answer against base-and-height where a height is available.',
    ],
    extension: ['Ask whether any three positive lengths give a triangle, and what the formula does when they do not.'],
    materialsNeeded: ['Calculator'],
  },
  reviewStatus: 'authored_draft',
};

export const SECTION_6_9: AuthoredSection = {
  contentArtifactId: 'ncert_iemh1_s6_9_lesson',
  contentArtifactVersion: 1,
  source: source('6.9', 'Squaring a Rectangle', 23, 'ncert_iemh1_s6_9'),
  competencyCandidates: [],
  competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_iemh1_s6_8'],
    mayAssume: ['Area of a rectangle and a triangle', 'Constructions with compasses', 'Right angles in a semicircle from chapter 5'],
    mustNotIntroduce: [{ concept: 'Area of a circle', belongsToSection: 'ncert_iemh1_s6_10' }],
  },
  learningGoal:
    'You will construct a square equal in area to a given rectangle, and extend the method to a triangle.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: ['Construct a perpendicular with compasses.', 'Find the midpoint of a segment.', 'State what a semicircle does to an inscribed angle.'],
    ifNotReady: 'Revisit the semicircle result from the circles chapter; the construction depends on it.',
  },
  vocabulary: [
    { term: 'squaring a figure', meaning: 'Constructing a square with the same area as that figure.' },
    { term: 'geometric mean', meaning: 'A length whose square equals the product of two given lengths.' },
  ],
  explanation: [
    'Two rectangles with the same area can look completely different — 2 by 18 and 6 by 6 both cover 36 square units. Squaring a rectangle asks for the one square that matches a given rectangle, which turns "how much area" into a single length.',
    'The construction is short. Lay the two sides end to end on a line, making a segment of length a + b. Find its midpoint and draw a semicircle on it. Erect a perpendicular at the point where the two sides meet, and let it meet the semicircle. That perpendicular is the side of the required square.',
    'Why it works uses the circles chapter. The angle in a semicircle is a right angle, so the perpendicular splits a right triangle into two smaller ones that share their angles. Comparing them gives the perpendicular’s square equal to a times b — exactly the rectangle’s area.',
    'So the construction produces a length whose square is the product of the two sides. That length is called the geometric mean of a and b, and it is what "the side of the equal square" means.',
    'A triangle can be squared too, in two steps. First turn it into a rectangle of the same area — base times half the height does it — then square that rectangle by the same construction. Nothing new is needed, which is the mark of a method rather than a trick.',
  ],
  representations: ['The two sides laid end to end with the semicircle on the total', 'The perpendicular rising to the semicircle as the side of the square'],
  visuals: [],
  visualsById: {  },
  workedExamples: [
    {
      id: 's69.we1',
      prompt: 'A rectangle is 9 cm by 4 cm. Find the side of the square with the same area.',
      steps: [
        { text: 'The rectangle has area 9 times 4 = 36 square cm.', reasoning: 'The square must match this area exactly.' },
        { text: 'The square’s side squared must equal 36.', reasoning: 'Area of a square is its side squared.' },
        { text: 'So the side is 6 cm.', reasoning: 'Six is the geometric mean of 9 and 4, which the construction would produce.' },
      ],
      answer: '6 cm.',
    },
    {
      id: 's69.we2',
      prompt: 'Describe the construction for a 9 cm by 4 cm rectangle.',
      steps: [
        { text: 'Draw a segment of 9 + 4 = 13 cm, marking the join at 9 cm.', reasoning: 'Laying the sides end to end is what makes the semicircle produce their product.' },
        { text: 'Find the midpoint and draw a semicircle of diameter 13 cm.', reasoning: 'The semicircle supplies the right angle the argument needs.' },
        { text: 'Erect a perpendicular at the join and extend it to the semicircle.', reasoning: 'That intersection is determined by the circle, not chosen.' },
        { text: 'The perpendicular measures 6 cm, which is the square’s side.', reasoning: 'It matches the computed geometric mean, confirming the construction.' },
      ],
      answer: 'The perpendicular at the join, measured up to the semicircle, is the side.',
    },
    {
      id: 's69.we3',
      prompt: 'How would you square a triangle with base 10 cm and height 6 cm?',
      steps: [
        { text: 'Its area is half of 10 times 6 = 30 square cm.', reasoning: 'The triangle result from earlier in the chapter.' },
        { text: 'Build a rectangle of the same area, for instance 10 cm by 3 cm.', reasoning: 'Base times half the height gives a rectangle matching the triangle.' },
        { text: 'Square that rectangle by the construction.', reasoning: 'The method is reused unchanged, which is why no new idea is needed.' },
        { text: 'The side is the geometric mean of 10 and 3, about 5.48 cm.', reasoning: 'Its square is 30, the original area.' },
      ],
      answer: 'Convert to an equal rectangle first, then square the rectangle.',
    },
  ],
  misconceptionIds: [],
  guidedPractice: [
    {
      id: 's69.g1',
      prompt: 'A rectangle is 16 cm by 4 cm. Find the side of the equal square.',
      hint: 'What squares to 64?',
      answer: '8 cm',
      rationale: 'Sixteen times four is 64.',
    },
    {
      id: 's69.g2',
      prompt: 'Which earlier result makes the construction work?',
      hint: 'What angle does a semicircle give?',
      answer: 'The angle in a semicircle is a right angle.',
      rationale: 'That right angle is what creates the similar triangles.',
    },
    {
      id: 's69.g3',
      prompt: 'Can every rectangle be squared this way?',
      hint: 'Does the construction need anything special?',
      answer: 'Yes.',
      rationale: 'The construction works for any two positive side lengths.',
    },
  ],
  independentPractice: [
    {
      id: 's69.i1',
      prompt: 'Find the side of the square equal in area to a 25 cm by 1 cm rectangle.',
      answer: '5 cm.',
      rationale: 'The geometric mean of 25 and 1.',
    },
    {
      id: 's69.i2',
      prompt: 'A rectangle is 8 cm by 2 cm. Find the side of the equal square.',
      answer: '4 cm.',
      rationale: 'Sixteen square units.',
    },
    {
      id: 's69.i3',
      prompt: 'Explain why squaring a triangle needs no new construction.',
      answer: 'Because the triangle is first converted into an equal rectangle.',
      rationale: 'The rectangle construction then applies unchanged.',
    },
  ],
  reasoningApplication: [
    {
      id: 's69.r1',
      prompt: 'Two rectangles of the same area square to the same side. Explain what the construction therefore measures, and why it gives a single number for a shape that could have many shapes.',
      expectedReasoning:
        'It measures area alone, expressed as the side of the matching square, so any two rectangles of equal area give the same result however different their proportions. A strong answer sees the construction as reducing a two-number description to the one number that area really is.',
    },
  ],
  interactivePractice: [],
  summary:
    'A rectangle is squared by laying its sides end to end, drawing a semicircle on the total and raising a perpendicular at the join: that perpendicular is the geometric mean of the sides and the side of the equal square. A triangle is squared by first converting it to an equal rectangle.',
  nextStep:
    'Next you will find the area of a shape with no straight sides at all.',
  teacher: {
    objective: 'Students construct a square equal in area to a rectangle and justify the construction.',
    prerequisiteKnowledge: ['Constructions', 'Semicircle right angle', 'Area'],
    modelLanguage: ['What does the semicircle give you?', 'Does the measured side square to the area?'],
    teachingNotes: [
      'Have students measure the constructed side and square it; agreement with the rectangle area is the proof they can perform themselves.',
      'Name the geometric mean once the construction is understood, not before.',
    ],
    quickChecks: ['Where does the right angle come from?', 'What is the area being matched?'],
    supportForStrugglingLearners: [
      'Do the construction once with easy numbers where the answer is a whole number.',
      'Measure and check rather than trusting the drawing.',
    ],
    extension: ['Ask which rectangle of a given area has the shortest perimeter.'],
    materialsNeeded: ['Compasses', 'Ruler'],
  },
  reviewStatus: 'authored_draft',
};

export const SECTION_6_10_DISC: AuthoredSection = {
  contentArtifactId: 'ncert_iemh1_s6_10_disc_lesson',
  contentArtifactVersion: 1,
  source: source('6.10', 'Area of a Circle', 26, 'ncert_iemh1_s6_10'),
  competencyCandidates: [],
  competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_iemh1_s6_6'],
    mayAssume: ['Area of a rectangle', 'Circumference as 2 pi r', 'Rearrangement preserving area'],
    mustNotIntroduce: [{ concept: 'Area of a sector', belongsToSection: 'ncert_iemh1_s6_10' }],
  },
  learningGoal:
    'You will derive the area of a circle by cutting it into thin sectors rearranged into a near-rectangle, and use the result.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: ['Find the area of a rectangle.', 'State the circumference of a circle.', 'Explain why rearranging pieces preserves area.'],
    ifNotReady: 'Make sure the rectangle area and the circumference are both fluent; the derivation combines them.',
  },
  vocabulary: [
    { term: 'disc', meaning: 'The region enclosed by a circle, as distinct from the circle itself.' },
    { term: 'sector', meaning: 'A slice of a disc between two radii.' },
  ],
  explanation: [
    'A circle has no sides, so the cutting-and-rearranging method needs a new kind of cut. Slice the disc into many thin sectors, like segments of an orange, and lay them out alternately pointing up and down, interleaved.',
    'The shape that results is bumpy along the top and bottom but is nearly a rectangle. Its height is the radius, since each sector reaches from centre to edge. Its length is half the circumference, because half the sectors point up and half point down, so each long side takes half the border.',
    'So its area is about r times half of 2 pi r, which is pi r squared. The thinner the sectors, the straighter the bumpy edges become and the closer the shape is to a true rectangle — and the area approaches pi r squared exactly.',
    'This is Archimedes’ argument, and it is a thought experiment carried to a limit rather than a finite dissection. With any particular number of sectors the shape is not a rectangle; the result is what the shapes approach as the sectors grow thinner without end. Saying that honestly matters, because the earlier dissections in this chapter were exact at a finite stage and this one is not.',
    'The result itself is exact: a disc of radius r has area pi r squared, in square units. Note how different it is from the circumference, 2 pi r — one is a length and one is an area, and they share the symbol pi without being the same kind of quantity.',
  ],
  representations: ['A disc cut into thin sectors, interleaved into a near-rectangle', 'The near-rectangle labelled with height r and length half the circumference'],
  visuals: [F_SECTORS],
  visualsById: { F_SECTORS },
  workedExamples: [
    {
      id: 's610a.we1',
      prompt: 'Find the area of a circle of radius 7 cm, with pi as 22/7.',
      steps: [
        { text: 'Area is pi r squared.', reasoning: 'The sector rearrangement gives a rectangle of height r and length pi r.' },
        { text: 'r squared is 49, and 22/7 times 49 is 154.', reasoning: 'The sevens cancel, which is why this radius is chosen for mental work.' },
        { text: 'So the area is 154 square cm.', reasoning: 'Square units, since this is a region.' },
      ],
      answer: '154 square cm.',
      visualRef: 'F_SECTORS',
    },
    {
      id: 's610a.we2',
      prompt: 'A circle has area 314 square cm. Find its radius, with pi as 3.14.',
      steps: [
        { text: 'Set 3.14 times r squared = 314.', reasoning: 'Working backwards from the area.' },
        { text: 'So r squared = 100.', reasoning: 'Dividing both sides by pi.' },
        { text: 'The radius is 10 cm.', reasoning: 'Taking the positive root, since a radius is a length.' },
      ],
      answer: '10 cm.',
    },
    {
      id: 's610a.we3',
      prompt: 'Why is this derivation a limit rather than an exact dissection?',
      steps: [
        { text: 'With any finite number of sectors the edges are bumpy, not straight.', reasoning: 'So the figure is not actually a rectangle at any stage.' },
        { text: 'Thinner sectors make the bumps smaller without ever removing them.', reasoning: 'The approximation improves but never terminates.' },
        { text: 'The area approaches pi r squared as the sectors grow thinner without end.', reasoning: 'The result is the limit of the process, not the value at any step.' },
      ],
      answer: 'Because no finite stage gives a true rectangle; the result is what the process approaches.',
    },
  ],
  misconceptionIds: [],
  guidedPractice: [
    {
      id: 's610a.g1',
      prompt: 'A circle has radius 10 cm. Find its area with pi as 3.14.',
      hint: 'Pi times r squared.',
      answer: '314 square cm',
      rationale: 'Pi times 100.',
    },
    {
      id: 's610a.g2',
      prompt: 'Which is an area, 2 pi r or pi r squared?',
      hint: 'Which multiplies two lengths?',
      answer: 'pi r squared.',
      rationale: 'The other is a length, the circumference.',
    },
    {
      id: 's610a.g3',
      prompt: 'What is the height of the near-rectangle in the derivation?',
      hint: 'How far does each sector reach?',
      answer: 'The radius.',
      rationale: 'Each sector runs from centre to edge.',
    },
  ],
  independentPractice: [
    {
      id: 's610a.i1',
      prompt: 'Find the area of a circle of radius 21 cm with pi as 22/7.',
      answer: '1386 square cm.',
      rationale: '22/7 times 441.',
    },
    {
      id: 's610a.i2',
      prompt: 'A circular park has area 616 square m. Find its radius with pi as 22/7.',
      answer: '14 m.',
      rationale: 'r squared is 196.',
    },
    {
      id: 's610a.i3',
      prompt: 'Explain why the near-rectangle has length equal to half the circumference.',
      answer: 'Because half the sectors point up and half point down, so each long side takes half the border.',
      rationale: 'The border is shared equally between the two sides.',
    },
  ],
  reasoningApplication: [
    {
      id: 's610a.r1',
      prompt: 'A circle’s radius is doubled. Describe what happens to its circumference and to its area, and explain why the two answers differ.',
      expectedReasoning:
        'Circumference doubles and area quadruples, because one depends on r and the other on r squared. A strong answer argues from the powers rather than computing two cases, and notes this is why a pizza of twice the radius feeds four times as many people while taking only twice the crust.',
    },
  ],
  interactivePractice: [],
  summary:
    'Cutting a disc into thin sectors and interleaving them gives a near-rectangle of height r and length pi r, so the area is pi r squared. The result is the limit of a process rather than an exact finite dissection, and it is an area while 2 pi r is a length.',
  nextStep:
    'Next you will take a share of that area, as you did with the circumference.',
  teacher: {
    objective: 'Students derive and apply the area of a disc.',
    prerequisiteKnowledge: ['Rectangle area', 'Circumference'],
    modelLanguage: ['Which is the height of the rearranged shape?', 'Length or area?'],
    teachingNotes: [
      'Cut a paper disc into eight sectors and then sixteen; the improvement is visible and makes the limit idea concrete.',
      'Be honest that this one is a limit, unlike the parallelogram dissection. Students should know which arguments are exact.',
    ],
    quickChecks: ['Where does the r squared come from?', 'Circumference or area?'],
    supportForStrugglingLearners: [
      'Cut and interleave paper sectors before any formula.',
      'Write 2 pi r and pi r squared side by side with their units.',
    ],
    extension: ['Ask how many sectors would make the bumps smaller than a millimetre.'],
    materialsNeeded: ['Paper discs', 'Scissors', 'Compasses'],
  },
  reviewStatus: 'authored_draft',
};

export const SECTION_6_10_SECTOR: AuthoredSection = {
  contentArtifactId: 'ncert_iemh1_s6_10_sector_lesson',
  contentArtifactVersion: 1,
  source: source('6.10', 'Area of a Circle', 26, 'ncert_iemh1_s6_10'),
  competencyCandidates: [],
  competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_iemh1_s6_10'],
    mayAssume: ['Area of a disc', 'Arc length as a fraction of the circumference', 'Angles at a centre'],
    mustNotIntroduce: [],
  },
  learningGoal:
    'You will find the area of a sector as the fraction of the disc determined by its angle, and distinguish it from the arc that bounds it.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: ['Compute the area of a disc.', 'Write an angle as a fraction of 360 degrees.', 'Find an arc length.'],
    ifNotReady: 'Make sure the disc area is fluent; a sector is a share of it.',
  },
  vocabulary: [
    { term: 'sector', meaning: 'The region between two radii and the arc joining them.' },
    { term: 'arc', meaning: 'The curved edge of that sector, which is a length and not a region.' },
  ],
  explanation: [
    'A sector is a slice of a disc: the region between two radii and the arc between their ends. Its share of the disc is exactly the share its angle takes of a full turn, which is the same reasoning used for arc length.',
    'So a sector of angle theta has area pi r squared times theta over 360. A half turn gives half the disc, a right angle gives a quarter. No new derivation is needed — the disc result is simply scaled by a fraction.',
    'Keep the two sector quantities apart. The arc is the curved edge, a length of 2 pi r times theta over 360, measured in centimetres. The sector is the region, an area of pi r squared times theta over 360, measured in square centimetres. Same angle, same circle, different quantities and different units.',
    'If a question asks for the perimeter of a sector rather than its area, the border is the arc plus the two radii — because the straight edges are part of the border too. Forgetting the radii is the usual slip, and tracing the border once catches it.',
    'Everything in this chapter has had this shape: establish a result for the whole figure, then take the share an angle or a dissection determines. Perimeter and area have travelled the same route and stayed in different units throughout.',
  ],
  representations: ['A sector with its angle marked beside the whole disc', 'The sector’s border traced: arc plus two radii'],
  visuals: [F_SECTORS],
  visualsById: { F_SECTORS },
  workedExamples: [
    {
      id: 's610b.we1',
      prompt: 'Find the area of a 90-degree sector in a circle of radius 14 cm, with pi as 22/7.',
      steps: [
        { text: 'The whole disc has area 22/7 times 196 = 616 square cm.', reasoning: 'The sector is a share of this, so it is computed first.' },
        { text: 'Ninety degrees is one quarter of a full turn.', reasoning: 'The angle fixes the share.' },
        { text: 'A quarter of 616 is 154 square cm.', reasoning: 'Scaling the disc area by the fraction.' },
      ],
      answer: '154 square cm.',
      visualRef: 'F_SECTORS',
    },
    {
      id: 's610b.we2',
      prompt: 'Find the perimeter of that same sector.',
      steps: [
        { text: 'The border is the arc plus the two radii.', reasoning: 'Tracing the border once shows all three pieces; the straight edges count.' },
        { text: 'The arc is a quarter of the circumference, 88 divided by 4 = 22 cm.', reasoning: 'Arc length uses the same fraction as the area did, but of the circumference.' },
        { text: 'Adding the two radii: 22 + 14 + 14 = 50 cm.', reasoning: 'A length, so the unit stays linear.' },
      ],
      answer: '50 cm — and note the area of the same sector was 154 square cm.',
    },
    {
      id: 's610b.we3',
      prompt: 'A sector has area 77 square cm in a circle of radius 14 cm. Find its angle, with pi as 22/7.',
      steps: [
        { text: 'The whole disc has area 616 square cm.', reasoning: 'Needed as the whole that the sector is a share of.' },
        { text: 'The sector is 77 of 616, which is one eighth.', reasoning: 'Dividing the part by the whole gives the fraction.' },
        { text: 'One eighth of 360 degrees is 45 degrees.', reasoning: 'Reversing the fraction back to an angle.' },
      ],
      answer: '45 degrees.',
    },
  ],
  misconceptionIds: [],
  guidedPractice: [
    {
      id: 's610b.g1',
      prompt: 'What fraction of a disc is a 120-degree sector?',
      hint: '120 out of 360.',
      answer: 'One third.',
      rationale: 'The angle is a third of a full turn.',
    },
    {
      id: 's610b.g2',
      prompt: 'Is a sector’s perimeter just its arc?',
      hint: 'What else bounds the region?',
      answer: 'No, the two radii count too.',
      rationale: 'All three pieces form the border.',
    },
    {
      id: 's610b.g3',
      prompt: 'A 180-degree sector of a disc of area 100 square cm. Find its area.',
      hint: 'Half the disc.',
      answer: '50 square cm',
      rationale: 'A half turn takes half the region.',
    },
  ],
  independentPractice: [
    {
      id: 's610b.i1',
      prompt: 'Find the area of a 60-degree sector in a circle of radius 21 cm, with pi as 22/7.',
      answer: '231 square cm.',
      rationale: 'One sixth of the 1386 square cm disc.',
    },
    {
      id: 's610b.i2',
      prompt: 'Find the perimeter of a 60-degree sector of radius 21 cm, with pi as 22/7.',
      answer: '64 cm.',
      rationale: 'Arc 22 plus two radii of 21.',
    },
    {
      id: 's610b.i3',
      prompt: 'Explain the difference between an arc and a sector in one sentence.',
      answer: 'The arc is the curved edge, a length; the sector is the region it encloses with the radii, an area.',
      rationale: 'Different quantities, different units.',
    },
  ],
  reasoningApplication: [
    {
      id: 's610b.r1',
      prompt: 'Arc length and sector area both use the fraction theta over 360. Explain why the same fraction serves two different quantities, and what that tells you about how a sector relates to its disc.',
      expectedReasoning:
        'The angle determines what proportion of the whole figure is taken, and both the border and the region are divided in that same proportion by the two radii. A strong answer sees the fraction as describing the slice itself rather than either measurement, which is why it applies to both.',
    },
  ],
  interactivePractice: [],
  summary:
    'A sector takes the same share of the disc as its angle takes of a full turn, giving pi r squared times theta over 360. Its arc is a length and the sector is an area; its perimeter includes the two radii as well as the arc.',
  nextStep:
    'That completes the chapter: borders measured, regions derived from the rectangle, and shares taken by angle.',
  teacher: {
    objective: 'Students compute sector area and distinguish it from arc length.',
    prerequisiteKnowledge: ['Disc area', 'Arc length', 'Fractions of 360'],
    modelLanguage: ['Area or length?', 'Have you included the radii?'],
    teachingNotes: [
      'Set arc and sector questions side by side so the unit difference is forced into view.',
      'The sector-perimeter omission is predictable; require the border to be traced in writing.',
    ],
    quickChecks: ['Which quantity, and what unit?', 'What fraction of the whole?'],
    supportForStrugglingLearners: [
      'Shade the sector and trace its border in a different colour.',
      'Write the fraction once and reuse it for both quantities.',
    ],
    extension: ['Ask what angle gives a sector whose area equals the square on its radius.'],
    materialsNeeded: ['Compasses', 'Protractor', 'Coloured pencils'],
  },
  reviewStatus: 'authored_draft',
};

/** Chapter 6, in the book's order. Eleven lessons from ten sections, with
 *  §6.6 merged into §6.7 and §6.8 and §6.10 each split in two. */
export function perimeterAreaChapterSections(): AuthoredSection[] {
  return [
    SECTION_6_1,
    SECTION_6_2,
    SECTION_6_3,
    SECTION_6_4,
    SECTION_6_5,
    SECTION_6_6_7,
    SECTION_6_8_BASE,
    SECTION_6_8_HERON,
    SECTION_6_9,
    SECTION_6_10_DISC,
    SECTION_6_10_SECTOR,
  ];
}
