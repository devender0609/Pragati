// ===========================================================================
// v0.84.0-c10.5 checkpoint 59 — CLASS 10 STATISTICS OF GROUPED DATA.
//
// The risk here is that three routes to the same mean can disagree. They
// cannot, because no derived number is authored: every class mark, product,
// total and all three means are computed from ONE `GroupedDistribution` per
// dataset, and `meansReconcile` fails the build if they ever part company.
//
// The datasets are Pragati's own. The source's worked example reaches 39.71
// by all three methods; nothing from it is reproduced.
//
// Source: NCERT Mathematics, Textbook for Class X (Reprint 2026-27), §13.2
// (folio 171), §13.3 (183), §13.4 (188). CBSE 041/241 2026-27 prescribes
// mean, median and mode of grouped data, with bimodal situations avoided.
// The frozen crosswalk records the ogive as a passing mention, not
// prescribed and not taught, so no ogive lesson appears here.
// ===========================================================================

import type { AuthoredSection } from './authoredSection';
import {
  classMark, classWidth, cumulativeFrequencies, directMean, median,
  medianClassIndex, modalClassIndex, mode, sumFd, sumFu, sumFx, totalFrequency,
  type GroupedDistribution, type GroupedTableSpec,
} from './groupedDistribution';

export const STATISTICS_CHAPTER_ID = 'ncert_jemh1_ch13';

const BOOK = 'Mathematics, Textbook for Class X (Reprint 2026-27)';
const SRC = 'https://ncert.nic.in/textbook/pdf/jemh1dd.zip';
const INSPECTED = '2026-10-16';

const source = (sectionNumber: string, exactTitle: string, startPage: number, officialSectionId: string) => ({
  officialChapterId: STATISTICS_CHAPTER_ID, officialSectionId, sectionNumber, exactTitle,
  startPage, textbook: BOOK, sourceReference: SRC, inspectionDate: INSPECTED,
});

// --- the canonical datasets ------------------------------------------------

/** Daily water use. Marks 5,15,25,35,45; N = 40; mean 25.5; mode 26. */
export const D_WATER: GroupedDistribution = {
  id: 'water_litres', unitLabel: 'household', quantity: 'Litres used per day', convention: 'continuous',
  intervals: [
    { lower: 0, upper: 10, frequency: 4 }, { lower: 10, upper: 20, frequency: 8 },
    { lower: 20, upper: 30, frequency: 14 }, { lower: 30, upper: 40, frequency: 10 },
    { lower: 40, upper: 50, frequency: 4 },
  ],
};

/** Seedling heights. Marks 7.5,...,27.5; N = 50; mean 17.3. */
export const D_SEEDLINGS: GroupedDistribution = {
  id: 'seedling_heights', unitLabel: 'seedling', quantity: 'Height in millimetres', convention: 'continuous',
  intervals: [
    { lower: 5, upper: 10, frequency: 6 }, { lower: 10, upper: 15, frequency: 11 },
    { lower: 15, upper: 20, frequency: 18 }, { lower: 20, upper: 25, frequency: 9 },
    { lower: 25, upper: 30, frequency: 6 },
  ],
};

/** Reading minutes, skewed so mean, median and mode genuinely differ. */
export const D_READING: GroupedDistribution = {
  id: 'reading_minutes', unitLabel: 'student', quantity: 'Minutes read per day', convention: 'continuous',
  intervals: [
    { lower: 0, upper: 20, frequency: 15 }, { lower: 20, upper: 40, frequency: 25 },
    { lower: 40, upper: 60, frequency: 12 }, { lower: 60, upper: 80, frequency: 6 },
    { lower: 80, upper: 100, frequency: 2 },
  ],
};

export const CANONICAL_DISTRIBUTIONS = [D_WATER, D_SEEDLINGS, D_READING];

// Numbers the prose quotes are READ from the model, never typed.
const n = (v: number) => String(Number(v.toFixed(4)));
const W = {
  N: totalFrequency(D_WATER), sfx: sumFx(D_WATER), mean: directMean(D_WATER),
  h: classWidth(D_WATER)!, sfd: sumFd(D_WATER, 25), sfu: sumFu(D_WATER, 25)!,
  mode: mode(D_WATER)!, modalIdx: modalClassIndex(D_WATER)!,
};
const S = { N: totalFrequency(D_SEEDLINGS), sfx: sumFx(D_SEEDLINGS), mean: directMean(D_SEEDLINGS) };
const R = {
  N: totalFrequency(D_READING), sfx: sumFx(D_READING), mean: directMean(D_READING),
  cf: cumulativeFrequencies(D_READING), medIdx: medianClassIndex(D_READING)!,
  med: median(D_READING)!, mode: mode(D_READING)!,
};

const table = (
  distribution: GroupedDistribution, columns: GroupedTableSpec['columns'],
  caption: string, altText: string, assumedMean?: number,
  purpose: GroupedTableSpec['purpose'] = 'show_definition'
): GroupedTableSpec => ({ type: 'grouped_table', purpose, status: 'concept_specific', distribution, columns, assumedMean, caption, altText });

export const T_WATER_DIRECT = table(D_WATER, ['classMark', 'fx'],
  'Water use, with the class mark and f\u1d62x\u1d62 for each class.',
  `A grouped frequency table of daily water use in litres across ${W.N} households. The five classes are 0 to 10, 10 to 20, 20 to 30, 30 to 40 and 40 to 50, with frequencies 4, 8, 14, 10 and 4. Each row also shows the class mark, the midpoint of the class, and the product of the frequency and the class mark. Those products total ${n(W.sfx)}, and dividing by ${W.N} gives a mean of ${n(W.mean)} litres.`);

export const T_WATER_ASSUMED = table(D_WATER, ['classMark', 'd', 'fd'],
  'The same data, with deviations from an assumed mean of 25.',
  `The same water-use table, now showing for each class the deviation of its class mark from the assumed mean of 25, and the frequency multiplied by that deviation. The deviations are minus 20, minus 10, 0, 10 and 20. The products total ${n(W.sfd)}, and 25 plus ${n(W.sfd)} divided by ${W.N} gives ${n(W.mean)}, the same mean as the direct method.`,
  25, 'support_reasoning');

export const T_WATER_STEP = table(D_WATER, ['classMark', 'u', 'fu'],
  'The same data again, with step deviations and the common class width.',
  `The same water-use table, now showing the step deviation u for each class, which is the deviation from the assumed mean of 25 divided by the common class width of ${W.h}. The step deviations are minus 2, minus 1, 0, 1 and 2, and the products with the frequencies total ${n(W.sfu)}. The mean is 25 plus ${W.h} times ${n(W.sfu)} divided by ${W.N}, which is ${n(W.mean)} once more.`,
  25, 'support_reasoning');

export const T_SEEDLINGS = table(D_SEEDLINGS, ['classMark', 'fx'],
  'Seedling heights, with class marks and products.',
  `A grouped frequency table of seedling heights in millimetres for ${S.N} seedlings. The classes are 5 to 10, 10 to 15, 15 to 20, 20 to 25 and 25 to 30, with frequencies 6, 11, 18, 9 and 6. The class marks are 7.5, 12.5, 17.5, 22.5 and 27.5, and the products with the frequencies total ${n(S.sfx)}, so the mean height is ${n(S.mean)} millimetres.`);

export const T_WATER_MODE = table(D_WATER, ['classMark'],
  'Water use: the modal class is the one with the greatest frequency.',
  `The water-use table for ${W.N} households, with its frequencies 4, 8, 14, 10 and 4. The greatest frequency is 14, which belongs to the class 20 to 30, so that class is the modal class. The class before it has frequency 8 and the class after it has frequency 10. The mode estimated inside that class is ${n(W.mode)} litres, which is a number, not the interval itself.`,
  undefined, 'support_reasoning');

export const T_READING_CF = table(D_READING, ['cumulative'],
  'Reading minutes, with the cumulative frequency built class by class.',
  `A grouped frequency table of minutes read per day by ${R.N} students. The classes are 0 to 20, 20 to 40, 40 to 60, 60 to 80 and 80 to 100, with frequencies 15, 25, 12, 6 and 2. The cumulative frequencies, formed by adding each frequency to the running total, are ${R.cf.join(', ')}, and the last one equals the total number of students.`,
  undefined, 'show_construction');

export const T_READING_FULL = table(D_READING, ['classMark', 'fx', 'cumulative'],
  'Reading minutes, with everything the three averages need.',
  `The reading-minutes table showing, for each class, the frequency, the class mark, the product of the two and the cumulative frequency. The products total ${n(R.sfx)} across ${R.N} students, giving a mean of ${n(R.mean)} minutes. The greatest frequency is 25, in the class 20 to 40, and the cumulative frequency first reaches ${R.N / 2} in that same class, so it is both the modal class and the median class. The mode is about ${n(R.mode)} minutes and the median is ${n(R.med)} minutes.`,
  undefined, 'support_reasoning');

export const CANONICAL_TABLES = [
  T_WATER_DIRECT, T_WATER_ASSUMED, T_WATER_STEP, T_SEEDLINGS,
  T_WATER_MODE, T_READING_CF, T_READING_FULL,
];

/** Re-exported so lessons and tests read the same numbers. */
export const STATS = { W, S, R, classMark, n };

const teacher = (objective: string, prereq: string[], lang: string[], notes: string[], checks: string[], support: string[], ext: string[]) => ({
  objective, prerequisiteKnowledge: prereq, modelLanguage: lang, teachingNotes: notes,
  quickChecks: checks, supportForStrugglingLearners: support, extension: ext, materialsNeeded: [],
});

export const C10_SECTION_13_2A: AuthoredSection = {
  contentArtifactId: 'ncert_jemh1_s13_2_direct_mean_lesson',
  contentArtifactVersion: 1,
  source: source('13.2', 'Mean of Grouped Data', 171, 'ncert_jemh1_s13_2'),
  competencyCandidates: [], competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: [],
    mayAssume: ['Mean of ungrouped data', 'Weighted mean', 'Reading a frequency table'],
    mustNotIntroduce: [
      { concept: 'The assumed-mean method', belongsToSection: 'ncert_jemh1_s13_2b' },
      { concept: 'Mode and median of grouped data', belongsToSection: 'ncert_jemh1_s13_3' },
    ],
  },
  learningGoal:
    'You will compute the mean of grouped data by the direct method, using the class mark of each interval as the value that stands for every observation in it.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: ['Find the mean of a short list of numbers.', 'Read a frequency from a table.', 'Multiply a frequency by a value and add the results.'],
    ifNotReady: 'Revise the mean of ungrouped data from Class IX. Grouped data uses the same idea with one extra decision.',
  },
  vocabulary: [
    { term: 'class interval', meaning: 'One of the ranges the data has been sorted into, such as 20\u201330.' },
    { term: 'class mark', meaning: 'The midpoint of a class interval, found as (lower limit + upper limit) / 2.' },
    { term: 'frequency', meaning: 'How many observations fall in a class interval.' },
    { term: 'direct method', meaning: 'Computing the mean as \u03a3f\u1d62x\u1d62 / \u03a3f\u1d62, using the class marks directly.' },
  ],
  explanation: [
    'Grouping data costs something. Once ten households are recorded as "between 20 and 30 litres", their individual readings are gone, and the mean can no longer be computed exactly.',
    'So a decision has to be made: one value must stand for every observation in a class. The natural choice is the midpoint, called the class mark, because the observations are spread across the interval and the midpoint sits in the middle of that spread. For 20\u201330 the class mark is (20 + 30) / 2 = 25.',
    'This is an estimate, not the true mean, and it is worth saying so. If every household in 20\u201330 actually used 21 litres, treating them as 25 would overstate the total. Over many classes such errors tend to offset, which is what makes the estimate usable.',
    'Once each class has a representative value, the computation is a weighted mean. A class of 14 households at a class mark of 25 contributes 14 \u00d7 25 to the total; adding these products and dividing by the number of households gives the mean.',
    `In symbols the mean is \u03a3f\u1d62x\u1d62 / \u03a3f\u1d62, where x\u1d62 is the class mark of the ith class and f\u1d62 its frequency. For the water-use data, the products total ${n(W.sfx)} across ${W.N} households, so the mean is ${n(W.mean)} litres.`,
    'Two slips account for most wrong answers. Using an endpoint instead of the midpoint shifts every contribution in the same direction, so the error does not cancel. And forgetting to multiply by the frequency treats a class of 14 households exactly like a class of 4.',
    'Notice that the denominator is \u03a3f\u1d62, the number of observations, not the number of classes. There are five classes here and forty households, and it is the forty that the total is shared among.',
  ],
  representations: ['A grouped frequency table with class marks and f\u1d62x\u1d62 products'],
  visuals: [T_WATER_DIRECT, T_SEEDLINGS],
  visualsById: { T_WATER_DIRECT, T_SEEDLINGS },
  workedExamples: [
    {
      id: 's132a.we1',
      prompt: 'Find the mean daily water use from the grouped table, using the direct method.',
      steps: [
        { text: 'Find the class mark of each class: 5, 15, 25, 35 and 45.', reasoning: 'Each is the midpoint of its interval, for example (20 + 30) / 2 = 25, and this is the value that will stand for every household in that class.' },
        { text: 'Multiply each class mark by its frequency: 4\u00d75 = 20, 8\u00d715 = 120, 14\u00d725 = 350, 10\u00d735 = 350, 4\u00d745 = 180.', reasoning: 'Each product is the estimated total for that class, so a class with more households contributes more, which is what weighting means.' },
        { text: `Add the products: 20 + 120 + 350 + 350 + 180 = ${n(W.sfx)}, which is \u03a3f\u1d62x\u1d62.`, reasoning: 'This is the estimated total litres used by all the households together.' },
        { text: `Add the frequencies: 4 + 8 + 14 + 10 + 4 = ${W.N}, which is \u03a3f\u1d62.`, reasoning: 'The denominator counts households, not classes \u2014 there are five classes but forty households sharing the total.' },
        { text: `Divide: ${n(W.sfx)} / ${W.N} = ${n(W.mean)} litres.`, reasoning: 'The quotient is the estimated mean, and it lands inside the class with the greatest frequency, which is a reasonable place for it to be.' },
      ],
      answer: `The mean is ${n(W.mean)} litres per day.`,
      visualRef: 'T_WATER_DIRECT',
    },
    {
      id: 's132a.we2',
      prompt: 'Find the mean seedling height from the grouped table.',
      steps: [
        { text: 'The class marks are 7.5, 12.5, 17.5, 22.5 and 27.5.', reasoning: 'The classes are five units wide, so each midpoint falls on a half, which is normal and should not be rounded away.' },
        { text: 'The products are 45, 137.5, 315, 202.5 and 165.', reasoning: 'For example 11 seedlings at a class mark of 12.5 contribute 137.5 millimetres to the estimated total.' },
        { text: `\u03a3f\u1d62x\u1d62 = ${n(S.sfx)} and \u03a3f\u1d62 = ${S.N}.`, reasoning: 'Adding the two columns separately keeps the numerator and the denominator from being confused with each other.' },
        { text: `Mean = ${n(S.sfx)} / ${S.N} = ${n(S.mean)} millimetres.`, reasoning: 'Dividing only at the end avoids rounding each product, which would move the answer.' },
      ],
      answer: `The mean height is ${n(S.mean)} millimetres.`,
      visualRef: 'T_SEEDLINGS',
    },
    {
      id: 's132a.we3',
      prompt: 'A student computes the water-use mean as (5 + 15 + 25 + 35 + 45) / 5 = 25. What has gone wrong?',
      steps: [
        { text: 'The student has averaged the class marks and ignored the frequencies.', reasoning: 'That treats every class as though it contained the same number of households, which it does not: one holds 14 and another holds 4.' },
        { text: 'The divisor 5 counts classes, but the mean is shared among households.', reasoning: 'The denominator of a grouped mean is \u03a3f\u1d62, which is 40 here, not the number of rows in the table.' },
        { text: `The correct computation weights each class mark by its frequency, giving ${n(W.mean)}.`, reasoning: 'The student\u2019s answer of 25 is close only because this distribution happens to be nearly symmetric; on skewed data the error would be large.' },
      ],
      answer: `The frequencies were ignored; the mean is ${n(W.mean)}, not 25.`,
    },
  ],
  guidedPractice: [
    { id: 's132a.g1', prompt: 'What is the class mark of the interval 35\u201350?', hint: 'Add the two limits and halve.', answer: '42.5.', rationale: '(35 + 50) / 2 = 42.5. The class mark need not be a whole number, and rounding it would distort every product that uses it.' },
    { id: 's132a.g2', prompt: 'A class 10\u201320 has frequency 7. What does it contribute to \u03a3f\u1d62x\u1d62?', hint: 'Which value stands for the class?', answer: '105.', rationale: 'The class mark is 15, so the contribution is 7 \u00d7 15 = 105, the estimated total for those seven observations.' },
    { id: 's132a.g3', prompt: 'Why is the grouped mean an estimate rather than the exact mean?', hint: 'What happened to the original readings?', answer: 'Because grouping discarded the individual values, and the class mark stands in for all of them.', rationale: 'The true mean would need the original observations. The class mark assumes they are spread evenly about the midpoint, which is reasonable but not exact.' },
  ],
  independentPractice: [
    { id: 's132a.i1', prompt: 'Find the class marks of 0\u201315, 15\u201330 and 30\u201345.', answer: '7.5, 22.5 and 37.5.', rationale: 'Each is the midpoint of its interval, and the marks are themselves 15 apart, matching the class width.' },
    { id: 's132a.i2', prompt: `For the water data, what is \u03a3f\u1d62 and what does it count?`, answer: `${W.N}, the number of households.`, rationale: 'It is the total frequency, not the number of classes, and it is the divisor in the direct method.' },
    { id: 's132a.i3', prompt: 'A table has classes 0\u201310, 10\u201320, 20\u201330 with frequencies 5, 0 and 7. Can the mean still be found?', answer: 'Yes \u2014 a frequency of 0 contributes 0 to the numerator and 0 to the total.', rationale: 'The class 10\u201320 simply holds no observations. Its product is 0 \u00d7 15 = 0, and the mean is (5\u00d75 + 0 + 7\u00d725) / 12 = 200 / 12, about 16.67.' },
    { id: 's132a.i4', prompt: 'Explain why using the upper limit instead of the class mark gives a biased answer.', answer: 'Because every class is overstated in the same direction, so the errors add rather than offset.', rationale: 'The class mark can be too high for one class and too low for another, and those errors tend to cancel. An endpoint is wrong the same way every time.' },
  ],
  misconceptionIds: [], interactivePractice: [],
  reasoningApplication: [
    {
      id: 's132a.td1',
      prompt: 'Why is the midpoint a reasonable representative of a class, and when would it be a poor one?',
      expectedReasoning:
        'It is reasonable when the observations in a class are spread fairly evenly across it, because then the amounts by which the midpoint overstates some and understates others roughly balance. It would be poor if the observations clustered at one end \u2014 if every household in the class 20\u201330 actually used close to 21 litres, the midpoint of 25 would overstate all of them, and nothing in the grouped table would reveal it. Grouping hides exactly the information needed to check this, which is why the result is called an estimate.',
    },
    {
      id: 's132a.td2',
      prompt: 'Two tables of the same data use different class widths. Must the direct method give the same mean from both?',
      expectedReasoning:
        'No. The class marks change when the boundaries change, and each observation is then represented by a different value, so the estimated total changes too. Both answers are legitimate estimates of the same true mean and will usually be close, but they are not required to agree exactly. Only the three methods applied to the SAME table are required to agree, because there the representative values are identical and only the arithmetic route differs.',
    },
  ],
  summary:
    `Grouping loses the individual values, so each class is represented by its class mark, the midpoint of its interval. The mean is then the weighted average \u03a3f\u1d62x\u1d62 / \u03a3f\u1d62, where the denominator counts observations rather than classes. For the water data this gives ${n(W.sfx)} / ${W.N} = ${n(W.mean)} litres. The answer is an estimate, because the original readings are gone.`,
  nextStep: 'Next you will find the same mean by a route that keeps the arithmetic smaller.',
  teacher: teacher(
    'Students compute a grouped mean by the direct method and explain why the class mark is used.',
    ['Mean of ungrouped data', 'Weighted mean'],
    ['Which single value will stand for this whole class?', 'Multiply by the frequency \u2014 fourteen households, not one.', 'The divisor counts households, not rows.'],
    [
      'The third worked example is worth the time: averaging the class marks gives 25 here, which is close enough to look right. Saying out loud why it is wrong anyway matters more than the arithmetic.',
      'Say plainly that the answer is an estimate. Students who believe grouped data gives the exact mean are surprised later when two groupings disagree.',
      'Watch for class marks being rounded to whole numbers; 7.5 is correct and should stay.',
    ],
    ['Ask what the class mark of 35\u201350 is.', 'Ask whether the divisor is 5 or 40, and why.'],
    ['Have the student write the class-mark column before any multiplication begins.'],
    ['Ask what happens to the estimate if one class is unusually wide.'],
  ),
  reviewStatus: 'authored_draft',
};

export const C10_SECTION_13_2B: AuthoredSection = {
  contentArtifactId: 'ncert_jemh1_s13_2_assumed_mean_lesson',
  contentArtifactVersion: 1,
  source: source('13.2', 'Mean of Grouped Data', 171, 'ncert_jemh1_s13_2'),
  competencyCandidates: [], competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_jemh1_s13_2'],
    mayAssume: ['Class marks and the direct method', 'Signed arithmetic'],
    mustNotIntroduce: [{ concept: 'The step-deviation method', belongsToSection: 'ncert_jemh1_s13_2c' }],
  },
  learningGoal:
    'You will compute a grouped mean by the assumed-mean method, and explain why the answer does not depend on which assumed mean you chose.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: ['Compute a grouped mean by the direct method.', 'Subtract to get a negative number and keep its sign.', 'Add a column of positive and negative values.'],
    ifNotReady: 'Revise the direct method. This lesson computes the same mean by a different route, so the two must agree.',
  },
  vocabulary: [
    { term: 'assumed mean', meaning: 'A convenient value a, subtracted from every class mark to make the arithmetic smaller. Written a.' },
    { term: 'deviation', meaning: 'The difference d\u1d62 = x\u1d62 \u2212 a between a class mark and the assumed mean.' },
    { term: 'correction term', meaning: 'The quantity \u03a3f\u1d62d\u1d62 / \u03a3f\u1d62 added back to a to recover the true mean.' },
  ],
  explanation: [
    'The direct method asked us to multiply 14 by 25 and 10 by 35 and add the results. Nothing is wrong with that, but the numbers are larger than they need to be, and large numbers invite arithmetic slips.',
    'The assumed-mean method shrinks them. Pick any convenient value a \u2014 usually a class mark near the middle \u2014 and measure every class mark from it: d\u1d62 = x\u1d62 \u2212 a. Instead of 5, 15, 25, 35, 45 the working values become \u221220, \u221210, 0, 10, 20.',
    'Then mean = a + \u03a3f\u1d62d\u1d62 / \u03a3f\u1d62. The second term is a correction: it says how far, on average, the data sits above or below the value you assumed.',
    'Why this is legitimate, rather than a trick: subtracting a from every class mark subtracts a from the mean as well, because the mean of a set of values shifted by a constant shifts by that same constant. So the mean of the deviations is the true mean minus a, and adding a back recovers it.',
    `For the water data with a = 25, the deviations give \u03a3f\u1d62d\u1d62 = ${n(W.sfd)}, so the mean is 25 + ${n(W.sfd)} / ${W.N} = ${n(W.mean)} litres \u2014 the same answer the direct method gave.`,
    'That agreement is not a coincidence to be checked occasionally; it is forced by the algebra. If your two answers differ, one of them contains an arithmetic error, and the most common one is a lost minus sign on a deviation below the assumed mean.',
    'The choice of a is genuinely free. Taking a = 15, or a = 0, or a = 1000 would change every deviation and every product, and the final mean would come out the same. A convenient a only makes the arithmetic pleasant; it has no effect on the result.',
  ],
  representations: ['The same table with a deviation column and its products'],
  visuals: [T_WATER_ASSUMED, T_WATER_DIRECT],
  visualsById: { T_WATER_ASSUMED, T_WATER_DIRECT },
  workedExamples: [
    {
      id: 's132b.we1',
      prompt: 'Find the mean water use by the assumed-mean method, taking a = 25.',
      steps: [
        { text: 'Choose a = 25, the class mark of the middle class.', reasoning: 'A class mark near the centre keeps the deviations small and symmetric, which is the only reason to prefer one value of a over another.' },
        { text: 'Compute d\u1d62 = x\u1d62 \u2212 25 for each class: \u221220, \u221210, 0, 10, 20.', reasoning: 'Classes below the assumed mean give negative deviations, and those signs must be carried into the products.' },
        { text: 'Multiply by the frequencies: 4\u00d7(\u221220) = \u221280, 8\u00d7(\u221210) = \u221280, 14\u00d70 = 0, 10\u00d710 = 100, 4\u00d720 = 80.', reasoning: 'Each product says how much that class pulls the mean above or below the assumed value.' },
        { text: `Add them: \u221280 \u2212 80 + 0 + 100 + 80 = ${n(W.sfd)} = \u03a3f\u1d62d\u1d62.`, reasoning: 'The negatives and positives nearly cancel, which is exactly what makes this total small and easy to handle.' },
        { text: `Apply the formula: mean = 25 + ${n(W.sfd)} / ${W.N} = 25 + ${n(W.sfd / W.N)} = ${n(W.mean)}.`, reasoning: 'The correction term is small because the assumed mean was already close to the truth; adding it back recovers the actual mean.' },
      ],
      answer: `${n(W.mean)} litres, the same as the direct method gave.`,
      visualRef: 'T_WATER_ASSUMED',
    },
    {
      id: 's132b.we2',
      prompt: 'Repeat with a = 15 and confirm the answer does not change.',
      steps: [
        { text: 'With a = 15 the deviations become \u221210, 0, 10, 20, 30.', reasoning: 'Every deviation is 10 larger than before, because the assumed mean was lowered by 10.' },
        { text: 'The products are \u221240, 0, 140, 200 and 120.', reasoning: 'These are larger numbers than with a = 25, which is the practical cost of a less central choice.' },
        { text: `\u03a3f\u1d62d\u1d62 = ${n(sumFd(D_WATER, 15))}, so mean = 15 + ${n(sumFd(D_WATER, 15))} / ${W.N} = ${n(W.mean)}.`, reasoning: 'The correction term is now much bigger, and it has to be, because it is making up more ground from a starting point further from the truth.' },
        { text: 'The mean is unchanged.', reasoning: 'Lowering a by 10 raised every deviation by 10, which raised the correction term by exactly 10, so the two changes cancel in the sum a + correction.' },
      ],
      answer: `${n(W.mean)} litres again \u2014 the choice of a does not affect the result.`,
    },
    {
      id: 's132b.we3',
      prompt: 'A student computing with a = 25 writes all five deviations as positive: 20, 10, 0, 10, 20. What answer do they get, and why is it wrong?',
      steps: [
        { text: 'Their products are 80, 80, 0, 100 and 80, totalling 340.', reasoning: 'Treating the two classes below the assumed mean as though they were above it reverses the direction of their contribution.' },
        { text: `Their mean would be 25 + 340 / ${W.N} = ${n(25 + 340 / W.N)}, which is far from ${n(W.mean)}.`, reasoning: 'The error is large because two whole classes are pulling the wrong way, not because the arithmetic slipped slightly.' },
        { text: 'A deviation below the assumed mean must be negative.', reasoning: 'The deviation measures direction as well as distance: a class at 5 litres sits 20 below 25, and the sign is what records that.' },
        { text: 'Comparing against the direct method would have caught it immediately.', reasoning: 'The two routes must agree, so a disagreement is a signal to look for a lost sign rather than to pick the answer that looks nicer.' },
      ],
      answer: `They get ${n(25 + 340 / W.N)}; the deviations below a must carry a minus sign.`,
    },
  ],
  guidedPractice: [
    { id: 's132b.g1', prompt: 'With a = 20, what is the deviation of the class mark 7.5?', hint: 'Which side of a is it on?', answer: '\u221212.5.', rationale: 'd = 7.5 \u2212 20 = \u221212.5. The class mark is below the assumed mean, so the deviation is negative.' },
    { id: 's132b.g2', prompt: `For the water data with a = 25, \u03a3f\u1d62d\u1d62 = ${n(W.sfd)}. What is the correction term?`, hint: 'Divide by the total frequency.', answer: `${n(W.sfd / W.N)}.`, rationale: `${n(W.sfd)} / ${W.N} = ${n(W.sfd / W.N)}, so the data sits that far above the assumed mean on average.` },
    { id: 's132b.g3', prompt: 'Two students use a = 25 and a = 35 on the same table. Must their final means agree?', hint: 'What does changing a do to every deviation?', answer: 'Yes, exactly.', rationale: 'Raising a by 10 lowers every deviation by 10 and so lowers the correction term by 10, which exactly offsets the higher starting value.' },
  ],
  independentPractice: [
    { id: 's132b.i1', prompt: `Compute the seedling mean with a = 17.5.`, answer: `${n(S.mean)} millimetres.`, rationale: `The deviations are \u221210, \u22125, 0, 5 and 10, giving \u03a3f\u1d62d\u1d62 = ${n(sumFd(D_SEEDLINGS, 17.5))}, and 17.5 + ${n(sumFd(D_SEEDLINGS, 17.5))} / ${S.N} = ${n(S.mean)}.` },
    { id: 's132b.i2', prompt: 'If \u03a3f\u1d62d\u1d62 comes out as exactly 0, what does that tell you?', answer: 'That the assumed mean was exactly the true mean.', rationale: 'The correction term is then 0, so the mean equals a. It means the guess happened to be perfect, not that an error was made.' },
    { id: 's132b.i3', prompt: 'Why is a central value usually chosen for a, if any value works?', answer: 'Because it keeps the deviations small and makes the arithmetic easier.', rationale: 'A distant a gives large deviations and large products. The answer is unaffected; only the effort changes.' },
    { id: 's132b.i4', prompt: 'A student gets 25.5 by the direct method and 28 by the assumed-mean method on the same table. What should they conclude?', answer: 'That one of the two contains an arithmetic error.', rationale: 'The methods are algebraically equivalent on the same table, so they cannot genuinely disagree. A lost sign on a deviation is the likeliest cause.' },
  ],
  misconceptionIds: [], interactivePractice: [],
  reasoningApplication: [
    {
      id: 's132b.td1',
      prompt: 'Why does changing the assumed mean not change the final mean? Answer in terms of what the two parts of the formula do.',
      expectedReasoning:
        'The formula is a + \u03a3f\u1d62d\u1d62 / \u03a3f\u1d62, and the two parts move in opposite directions by the same amount. Increasing a by some amount k lowers every deviation by k, so it lowers the average deviation by k, so it lowers the correction term by exactly k. The sum of a larger starting value and a correspondingly smaller correction is unchanged. The assumed mean is only a place to measure from, and measuring the same data from a different origin cannot alter where its centre actually is.',
    },
    {
      id: 's132b.td2',
      prompt: 'Could the assumed-mean method ever be more accurate than the direct method on the same table?',
      expectedReasoning:
        'Not more accurate, because the two are algebraically the same computation and must give the same number. It can be more reliable in practice, since smaller numbers are easier to handle and a slip is less likely. But both rest on the same estimate \u2014 the class mark standing for every observation in its class \u2014 so neither recovers information that grouping destroyed. Accuracy is set by the grouping; the method only affects the arithmetic.',
    },
  ],
  summary:
    `Choose any convenient a, measure each class mark from it as d\u1d62 = x\u1d62 \u2212 a, and compute mean = a + \u03a3f\u1d62d\u1d62 / \u03a3f\u1d62. The second term corrects for how far the data sits from the value assumed. The choice of a is free: raising it lowers the correction by the same amount. For the water data with a = 25, \u03a3f\u1d62d\u1d62 = ${n(W.sfd)} and the mean is ${n(W.mean)} litres, agreeing with the direct method.`,
  nextStep: 'Next you will shrink the arithmetic once more, when the classes are equally wide.',
  teacher: teacher(
    'Students compute a grouped mean by the assumed-mean method and explain its independence from a.',
    ['The direct method', 'Signed arithmetic'],
    ['Which side of a is this class mark on?', 'Change a and the correction changes to match.', 'If the two methods disagree, one of them is wrong.'],
    [
      'Running the same table with two different values of a, as the second worked example does, settles the independence question better than any explanation. Students who have only seen one choice of a half-believe it is the right one.',
      'The lost minus sign is the characteristic error here, and the third worked example shows it producing an answer that is wrong but not absurd.',
      'Encourage cross-checking against the direct method. It is the cheapest error detector in the chapter.',
    ],
    ['Ask what happens to the correction term if a is raised by 5.', 'Ask what \u03a3f\u1d62d\u1d62 = 0 would mean.'],
    ['Have the student write the sign of each deviation before computing any product.'],
    ['Ask for the value of a that would make the correction term zero.'],
  ),
  reviewStatus: 'authored_draft',
};

export const C10_SECTION_13_2C: AuthoredSection = {
  contentArtifactId: 'ncert_jemh1_s13_2_step_deviation_lesson',
  contentArtifactVersion: 1,
  source: source('13.2', 'Mean of Grouped Data', 171, 'ncert_jemh1_s13_2'),
  competencyCandidates: [], competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_jemh1_s13_2'],
    mayAssume: ['The direct and assumed-mean methods', 'Class width'],
    mustNotIntroduce: [{ concept: 'Mode and median of grouped data', belongsToSection: 'ncert_jemh1_s13_3' }],
  },
  learningGoal:
    'You will compute a grouped mean by the step-deviation method where the classes are equally wide, and judge which of the three methods suits a given table.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: ['Compute a mean by the assumed-mean method.', 'Find the width of a class interval.', 'Divide a deviation by the class width.'],
    ifNotReady: 'Revise the assumed-mean method. Step deviation is that method with one extra division.',
  },
  vocabulary: [
    { term: 'class width', meaning: 'The size of each class interval, written h. The method needs every class to have the same h.' },
    { term: 'step deviation', meaning: 'u\u1d62 = (x\u1d62 \u2212 a) / h \u2014 the deviation measured in whole classes rather than in units.' },
    { term: 'method choice', meaning: 'Deciding which of the three routes makes the arithmetic easiest for a particular table.' },
  ],
  explanation: [
    'With a = 25 the water-use deviations were \u221220, \u221210, 0, 10 and 20. Every one of them is a multiple of 10, which is the class width, and that is not an accident: equally wide classes have class marks equally spaced.',
    'So the deviations can be counted in classes instead of litres. Dividing each by h = 10 gives u\u1d62 = \u22122, \u22121, 0, 1, 2 \u2014 the number of steps each class sits from the assumed mean.',
    'The mean is then a + h \u00d7 \u03a3f\u1d62u\u1d62 / \u03a3f\u1d62. The h is there to convert the answer back from steps into the original units, and leaving it out is the characteristic error of this method.',
    `For the water data, \u03a3f\u1d62u\u1d62 = ${n(W.sfu)}, so the mean is 25 + 10 \u00d7 ${n(W.sfu)} / ${W.N} = ${n(W.mean)} litres. Three routes, three different sets of intermediate numbers, one answer.`,
    'The method needs equally wide classes, because u\u1d62 is only meaningful as a count of steps when every step is the same size. If the widths differ, dividing by any single h would mean different things in different rows, and the assumed-mean method should be used instead.',
    'None of the three is best in general. The direct method is fine when the numbers are small. The assumed mean helps when the class marks are large or awkward. Step deviation helps when the classes are equally wide and the width is a convenient number. The right choice is the one that makes the arithmetic easiest on the table in front of you.',
    'Whichever route you take, do the dividing at the end. Rounding \u03a3f\u1d62u\u1d62 / \u03a3f\u1d62 before multiplying by h multiplies the rounding error by h as well, and that is the one way to make two correct methods appear to disagree.',
  ],
  representations: ['The same table with step deviations and their products'],
  visuals: [T_WATER_STEP, T_WATER_ASSUMED],
  visualsById: { T_WATER_STEP, T_WATER_ASSUMED },
  workedExamples: [
    {
      id: 's132c.we1',
      prompt: 'Find the mean water use by the step-deviation method, with a = 25.',
      steps: [
        { text: 'Check the class width: every class is 10 wide, so h = 10 and the method applies.', reasoning: 'Equal widths are a precondition, not a convenience, because u\u1d62 counts steps and the steps must all be the same size.' },
        { text: 'Compute u\u1d62 = (x\u1d62 \u2212 25) / 10: \u22122, \u22121, 0, 1, 2.', reasoning: 'Each class mark is a whole number of class widths away from the assumed mean, which is what makes these integers.' },
        { text: 'Multiply by the frequencies: \u22128, \u22128, 0, 10, 8.', reasoning: 'These are far smaller than the assumed-mean products of \u221280, \u221280, 0, 100, 80, and that is the whole gain.' },
        { text: `Add: \u22128 \u2212 8 + 0 + 10 + 8 = ${n(W.sfu)} = \u03a3f\u1d62u\u1d62.`, reasoning: 'The total is small because the classes below and above the assumed mean largely offset one another.' },
        { text: `Mean = 25 + 10 \u00d7 ${n(W.sfu)} / ${W.N} = 25 + ${n(10 * W.sfu / W.N)} = ${n(W.mean)}.`, reasoning: 'Multiplying by h converts the correction from steps back into litres; omitting it would give 25.05 instead.' },
      ],
      answer: `${n(W.mean)} litres \u2014 the same as both earlier methods.`,
      visualRef: 'T_WATER_STEP',
    },
    {
      id: 's132c.we2',
      prompt: 'Find the seedling mean by step deviation, with a = 17.5.',
      steps: [
        { text: 'The classes are 5 wide throughout, so h = 5.', reasoning: 'Checking h before starting avoids applying the method to a table it does not fit.' },
        { text: 'u\u1d62 = (x\u1d62 \u2212 17.5) / 5 gives \u22122, \u22121, 0, 1, 2.', reasoning: 'The awkward half-values in the class marks disappear once they are measured in steps, which is a second benefit on this table.' },
        { text: `The products are \u221212, \u221211, 0, 9 and 6, totalling ${n(sumFu(D_SEEDLINGS, 17.5)!)}.`, reasoning: 'Every product is a small whole number, where the direct method needed 137.5 and 202.5.' },
        { text: `Mean = 17.5 + 5 \u00d7 ${n(sumFu(D_SEEDLINGS, 17.5)!)} / ${S.N} = ${n(S.mean)} millimetres.`, reasoning: 'This matches the direct method exactly, as it must.' },
      ],
      answer: `${n(S.mean)} millimetres.`,
    },
    {
      id: 's132c.we3',
      prompt: 'A student omits h and reports the water-use mean as 25.05. Where did the error enter, and what should they have written?',
      steps: [
        { text: `They computed 25 + ${n(W.sfu)} / ${W.N} = 25.05.`, reasoning: 'The correction term was left in steps rather than converted back into litres.' },
        { text: 'The step deviations count classes, and each class is 10 litres wide.', reasoning: 'A correction of 0.05 classes is a correction of 0.5 litres, so the two numbers measure different things.' },
        { text: `Multiplying by h = 10 gives 25 + ${n(10 * W.sfu / W.N)} = ${n(W.mean)}.`, reasoning: 'The h is the unit conversion, which is why the formula carries it and the assumed-mean formula does not.' },
        { text: 'The direct method would have exposed the error at once.', reasoning: 'An answer of 25.05 against 25.5 is a tenfold shortfall in the correction term, which points straight at a missing factor of h.' },
      ],
      answer: `The factor h was omitted; the mean is ${n(W.mean)}, not 25.05.`,
    },
  ],
  guidedPractice: [
    { id: 's132c.g1', prompt: 'A table has classes 0\u201325, 25\u201350, 50\u201375. What is h, and may step deviation be used?', hint: 'Are all the widths the same?', answer: 'h = 25, and yes.', rationale: 'Every class spans 25 units, so the step deviations count equal steps and the method applies.' },
    { id: 's132c.g2', prompt: 'A table has classes 0\u201310, 10\u201330, 30\u201340. May step deviation be used?', hint: 'Compare the widths.', answer: 'No \u2014 the widths are 10, 20 and 10.', rationale: 'There is no single h, so dividing by one value would mean a different number of steps in different rows. Use the assumed-mean method instead.' },
    { id: 's132c.g3', prompt: `For the water data \u03a3f\u1d62u\u1d62 = ${n(W.sfu)} and h = 10. What is the correction in litres?`, hint: 'Divide, then convert.', answer: '0.5 litres.', rationale: `${n(W.sfu)} / ${W.N} = 0.05 classes, and 0.05 \u00d7 10 = 0.5 litres, which lifts 25 to ${n(W.mean)}.` },
  ],
  independentPractice: [
    { id: 's132c.i1', prompt: 'With a = 25 and h = 10, what is u for the class mark 45?', answer: '2.', rationale: '(45 \u2212 25) / 10 = 2, meaning that class sits two whole class widths above the assumed mean.' },
    { id: 's132c.i2', prompt: 'Which method would you choose for classes 0\u20132, 2\u20134, 4\u20136 with small frequencies, and why?', answer: 'The direct method.', rationale: 'The class marks are 1, 3 and 5 and the frequencies are small, so the products are already easy. Transforming would add work without reducing any.' },
    { id: 's132c.i3', prompt: 'Must the three methods agree on the same table? Give the reason.', answer: 'Yes \u2014 they are the same computation rearranged.', rationale: 'Each transformation is undone by its own correction term, so the routes differ only in the size of the intermediate numbers.' },
    { id: 's132c.i4', prompt: 'How could rounding too early make two correct methods appear to disagree?', answer: 'By rounding the correction term before multiplying by h.', rationale: 'A rounding error of 0.01 in \u03a3f\u1d62u\u1d62 / \u03a3f\u1d62 becomes 0.1 after multiplying by h = 10, which is large enough to show up as a disagreement with the direct method.' },
  ],
  misconceptionIds: [], interactivePractice: [],
  reasoningApplication: [
    {
      id: 's132c.td1',
      prompt: 'When does the step-deviation method genuinely simplify the arithmetic, and when does it add work for nothing?',
      expectedReasoning:
        'It helps when the classes are equally wide AND the width is large enough that dividing by it shrinks the numbers meaningfully \u2014 class marks of 5, 15, 25, 35 become steps of \u22122, \u22121, 0, 1. It adds work when the class marks are already small, since dividing 1, 3, 5 by a width of 2 produces fractions where whole numbers were available. It cannot be used at all when the widths differ, because a step would then mean a different distance in different rows.',
    },
    {
      id: 's132c.td2',
      prompt: 'Three students use the three different methods on the same table and get 25.5, 25.5 and 25.05. What has most likely happened, and how would you confirm it?',
      expectedReasoning:
        'The two agreeing answers are almost certainly right, since the methods are algebraically equivalent and an identical error by two different routes would be a coincidence. The odd answer is a tenth of the way from 25 to 25.5, which points at a correction term left in steps rather than converted to units \u2014 the missing factor of h. Confirming it is a single multiplication: 0.05 \u00d7 10 = 0.5, which closes the gap exactly.',
    },
  ],
  summary:
    `When the classes are equally wide, measure the deviations in classes: u\u1d62 = (x\u1d62 \u2212 a) / h. Then mean = a + h \u00d7 \u03a3f\u1d62u\u1d62 / \u03a3f\u1d62, where h converts the correction back into the original units. For the water data \u03a3f\u1d62u\u1d62 = ${n(W.sfu)} and the mean is ${n(W.mean)} litres, matching both earlier methods. No method is best in general; choose by what makes the arithmetic easiest, and divide only at the end.`,
  nextStep: 'Next you will find the value that occurs most often rather than the one at the centre.',
  teacher: teacher(
    'Students apply the step-deviation method where h is common, and choose among the three methods.',
    ['The assumed-mean method', 'Class width'],
    ['Check h before you start.', 'The h converts steps back into units.', 'Which method makes THIS table easiest?'],
    [
      'The omitted h is the signature error, and the third worked example shows it producing 25.05 against 25.5 \u2014 a tenfold shortfall that points straight at the cause.',
      'Resist ranking the methods. Students who learn that step deviation is best apply it to unequal classes, where it is not merely harder but wrong.',
      'The rounding point deserves a minute: it is the only way two correct methods can appear to disagree.',
    ],
    ['Ask whether step deviation may be used on classes 0\u201310, 10\u201330, 30\u201340.', 'Ask what the h in the formula is for.'],
    ['Have the student write h at the top of the page and circle it before computing any u.'],
    ['Ask for a table on which the direct method is clearly the easiest of the three.'],
  ),
  reviewStatus: 'authored_draft',
};

export const C10_SECTION_13_3A: AuthoredSection = {
  contentArtifactId: 'ncert_jemh1_s13_3_mode_lesson',
  contentArtifactVersion: 1,
  source: source('13.3', 'Mode of Grouped Data', 183, 'ncert_jemh1_s13_3'),
  competencyCandidates: [], competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_jemh1_s13_2'],
    mayAssume: ['Mode of ungrouped data from Class IX', 'Class marks, boundaries and class width'],
    mustNotIntroduce: [{ concept: 'Median of grouped data', belongsToSection: 'ncert_jemh1_s13_4' }],
  },
  learningGoal:
    'You will identify the modal class of a grouped distribution and compute an estimated mode from it, keeping the class and the number distinct.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: ['Say what the mode of a short list of numbers is.', 'Find the class with the greatest frequency.', 'Identify the lower boundary and the width of a class.'],
    ifNotReady: 'Revise the mode of ungrouped data. Grouped data cannot give the exact mode, only an estimate inside one class.',
  },
  vocabulary: [
    { term: 'modal class', meaning: 'The class interval with the greatest frequency. An interval, not a number.' },
    { term: 'mode', meaning: 'A single value estimated inside the modal class, representing where observations are densest.' },
    { term: 'lower boundary', meaning: 'The lower limit l of the modal class, used as the starting point of the estimate.' },
  ],
  explanation: [
    'For a list of numbers the mode is the value that occurs most often. Grouped data cannot give that, because the individual values are gone \u2014 we know fourteen households used between 20 and 30 litres, but not what any of them used.',
    'What the table does show is where observations are densest: the class with the greatest frequency, called the modal class. For the water data that is 20\u201330, with a frequency of 14.',
    'The modal class is an interval. The mode is a number. Calling 20\u201330 "the mode" confuses a range with a value, and the whole point of the next step is to produce the value.',
    'Where inside the class should the estimate sit? Not necessarily at the midpoint. If the class before the modal class is busier than the class after, the crowd is leaning backwards and the estimate should sit nearer the lower end; if the class after is busier, it should sit nearer the upper end.',
    'The formula makes that precise: mode = l + h(f\u2081 \u2212 f\u2080) / (2f\u2081 \u2212 f\u2080 \u2212 f\u2082), where l is the lower boundary of the modal class, h its width, f\u2081 its frequency, f\u2080 the frequency of the class before and f\u2082 of the class after.',
    `For the water data l = 20, h = 10, f\u2081 = 14, f\u2080 = 8 and f\u2082 = 10, giving a mode of ${n(W.mode)} litres. It sits just above the lower boundary, because the class after the modal class is busier than the class before it.`,
    'Keeping f\u2080 and f\u2082 the right way round matters. They are the neighbours of the modal class, not the smallest and largest frequencies in the table, and swapping them moves the estimate to the wrong side of the class.',
  ],
  representations: ['A frequency table with the modal class and its two neighbours identified'],
  visuals: [T_WATER_MODE],
  visualsById: { T_WATER_MODE },
  workedExamples: [
    {
      id: 's133a.we1',
      prompt: 'Find the modal class and the mode of the water-use data.',
      steps: [
        { text: 'Compare the frequencies 4, 8, 14, 10 and 4. The greatest is 14.', reasoning: 'The modal class is chosen by greatest FREQUENCY, not by the largest class values \u2014 the class 40\u201350 holds the biggest litre readings but only four households.' },
        { text: 'So the modal class is 20\u201330. This is an interval, not yet the mode.', reasoning: 'Naming it explicitly as an interval keeps the next step from being skipped.' },
        { text: 'Read off l = 20, h = 10, f\u2081 = 14, f\u2080 = 8 and f\u2082 = 10.', reasoning: 'f\u2080 and f\u2082 are the frequencies of the classes immediately before and after the modal class, in that order.' },
        { text: 'Substitute: 20 + 10(14 \u2212 8) / (28 \u2212 8 \u2212 10) = 20 + 60 / 10.', reasoning: 'The numerator 14 \u2212 8 = 6 measures how much the modal class exceeds the class before it; the denominator 2f\u2081 \u2212 f\u2080 \u2212 f\u2082 = 10 balances both neighbours.' },
        { text: `So the mode is ${n(W.mode)} litres.`, reasoning: 'It lies inside the modal class, as it must, and nearer the lower end because the class after is busier than the class before.' },
      ],
      answer: `Modal class 20\u201330; mode ${n(W.mode)} litres.`,
      visualRef: 'T_WATER_MODE',
    },
    {
      id: 's133a.we2',
      prompt: 'Find the modal class and mode of the reading-minutes data.',
      steps: [
        { text: 'The frequencies are 15, 25, 12, 6 and 2, so the modal class is 20\u201340.', reasoning: 'Twenty-five students read for between 20 and 40 minutes, more than in any other class.' },
        { text: 'Here l = 20, h = 20, f\u2081 = 25, f\u2080 = 15 and f\u2082 = 12.', reasoning: 'The class width is 20 for this table, not 10, and using the wrong h would scale the whole correction.' },
        { text: 'Substitute: 20 + 20(25 \u2212 15) / (50 \u2212 15 \u2212 12) = 20 + 200 / 23.', reasoning: 'The denominator is 23, so the estimate moves about 8.7 units into a class 20 units wide.' },
        { text: `The mode is about ${n(R.mode)} minutes.`, reasoning: 'It sits below the midpoint of 30 because the class before the modal class is busier than the class after it, pulling the estimate downwards.' },
      ],
      answer: `Modal class 20\u201340; mode about ${n(R.mode)} minutes.`,
    },
    {
      id: 's133a.we3',
      prompt: 'A student reports the water-use mode as "20\u201330". Why is that not an answer, and a second student swaps f\u2080 and f\u2082 \u2014 what do they get?',
      steps: [
        { text: 'The first student has named the modal class, not the mode.', reasoning: 'The modal class is where the answer lies; the mode is a single number estimated inside it, and the question asked for the number.' },
        { text: 'The second student uses f\u2080 = 10 and f\u2082 = 8 by mistake.', reasoning: 'They have read the neighbours in the wrong order, which is easy to do when the two frequencies are close.' },
        { text: 'Their computation is 20 + 10(14 \u2212 10) / (28 \u2212 10 \u2212 8) = 20 + 40 / 10 = 24.', reasoning: 'The denominator is unchanged because it adds both neighbours, so only the numerator shifts \u2014 which is why this error is quiet.' },
        { text: `The correct value is ${n(W.mode)}, so the estimate has moved to the wrong side of the class centre.`, reasoning: 'Swapping the neighbours reverses the direction the data leans, which is exactly what the formula is measuring.' },
      ],
      answer: `"20\u201330" is the modal class, not the mode; swapping the neighbours gives 24 instead of ${n(W.mode)}.`,
    },
  ],
  guidedPractice: [
    { id: 's133a.g1', prompt: 'Classes 0\u20135, 5\u201310, 10\u201315 have frequencies 9, 17, 4. Which is the modal class?', hint: 'Greatest frequency, not greatest value.', answer: '5\u201310.', rationale: 'Its frequency of 17 is the greatest. The class 10\u201315 contains the largest values but only four observations.' },
    { id: 's133a.g2', prompt: 'For that table, what are f\u2080, f\u2081 and f\u2082?', hint: 'Order matters.', answer: 'f\u2080 = 9, f\u2081 = 17, f\u2082 = 4.', rationale: 'f\u2081 is the modal class frequency, f\u2080 the class before it and f\u2082 the class after it.' },
    { id: 's133a.g3', prompt: 'Why can grouped data give only an estimated mode?', hint: 'What did grouping discard?', answer: 'Because the individual observations are gone.', rationale: 'The exact mode would need the original values. The formula estimates where they are densest from the pattern of the frequencies.' },
  ],
  independentPractice: [
    { id: 's133a.i1', prompt: 'Compute the mode for classes 0\u20135, 5\u201310, 10\u201315 with frequencies 9, 17, 4.', answer: 'About 6.9 units.', rationale: '5 + 5(17 \u2212 9) / (34 \u2212 9 \u2212 4) = 5 + 40 / 21, about 6.9. The estimate sits below the midpoint because the class before is far busier than the class after.' },
    { id: 's133a.i2', prompt: 'Explain the difference between the modal class and the mode in one sentence.', answer: 'The modal class is the interval with the greatest frequency; the mode is a single value estimated inside it.', rationale: 'One is a range the answer lies in, the other is the answer.' },
    { id: 's133a.i3', prompt: 'If f\u2080 and f\u2082 are equal, where in the modal class does the mode fall?', answer: 'At its midpoint.', rationale: 'With f\u2080 = f\u2082 the formula gives l + h(f\u2081 \u2212 f\u2080) / (2f\u2081 \u2212 2f\u2080) = l + h/2. Equal neighbours mean no lean in either direction.' },
    { id: 's133a.i4', prompt: 'Why is the class with the largest values not necessarily the modal class?', answer: 'Because the modal class is chosen by frequency, not by the size of the values.', rationale: 'A class of large readings with few observations is sparse, which is the opposite of what the mode is looking for.' },
  ],
  misconceptionIds: [], interactivePractice: [],
  reasoningApplication: [
    {
      id: 's133a.td1',
      prompt: 'Why is the modal class not itself the numerical mode, and why is the midpoint not used as the estimate?',
      expectedReasoning:
        'The modal class is an interval and the mode is a number, so the class locates the answer rather than being it. The midpoint is not used because the two neighbouring frequencies carry information about where inside the class the observations are densest: if the class before is much busier than the class after, the crowd thins out going upwards and the estimate should sit low in the class. The formula uses exactly that comparison, and reduces to the midpoint when the neighbours are equal.',
    },
    {
      id: 's133a.td2',
      prompt: 'Two classes share the greatest frequency. What should you do, and why is picking one of them unsatisfactory?',
      expectedReasoning:
        'There is no single modal class, so the formula has no unique input and the distribution has two peaks. Picking one would present a choice made by the solver as a fact about the data, and the two would give different answers, so the report would depend on which was chosen rather than on the observations. The honest response is to say the distribution is bimodal. The current scope avoids such data precisely because the single-mode formula has nothing to say about it.',
    },
  ],
  summary:
    `The modal class is the class interval with the greatest frequency \u2014 an interval, not the mode. The mode is estimated inside it as l + h(f\u2081 \u2212 f\u2080) / (2f\u2081 \u2212 f\u2080 \u2212 f\u2082), where f\u2080 and f\u2082 are the frequencies of the classes immediately before and after. For the water data this gives ${n(W.mode)} litres. Equal neighbours put the estimate at the midpoint; an unequal pair leans it towards the busier side.`,
  nextStep: 'Next you will ask what the mean and the mode each tell you about the same data.',
  teacher: teacher(
    'Students identify the modal class and compute the mode, keeping interval and value distinct.',
    ['Mode of ungrouped data', 'Class boundaries and width'],
    ['Greatest frequency, not greatest value.', 'That is the modal class \u2014 now find the mode.', 'Which neighbour is busier? That is the way it leans.'],
    [
      'The interval-versus-number distinction is the one that costs marks, and it is worth insisting the modal class be named aloud as an interval before the formula is written.',
      'The swapped-neighbours error in the third worked example leaves the denominator unchanged, so the wrong answer stays inside the class and looks plausible.',
      'Equal neighbours giving the midpoint is worth deriving once; it shows the formula is measuring lean rather than applying magic.',
    ],
    ['Ask which class is modal when the largest values sit in a sparse class.', 'Ask what f\u2080 and f\u2082 refer to.'],
    ['Have the student label f\u2080, f\u2081 and f\u2082 on the table before substituting anything.'],
    ['Ask where the mode falls when f\u2082 is zero.'],
  ),
  reviewStatus: 'authored_draft',
};

export const C10_SECTION_13_3B: AuthoredSection = {
  contentArtifactId: 'ncert_jemh1_s13_3_mean_vs_mode_lesson',
  contentArtifactVersion: 1,
  source: source('13.3', 'Mode of Grouped Data', 183, 'ncert_jemh1_s13_3'),
  competencyCandidates: [], competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_jemh1_s13_3'],
    mayAssume: ['The grouped mean', 'The modal class and the mode'],
    mustNotIntroduce: [{ concept: 'The median of grouped data', belongsToSection: 'ncert_jemh1_s13_4' }],
  },
  learningGoal:
    'You will say what the mean and the mode each tell you about a distribution, and explain why they can differ on the same data.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: ['Compute a grouped mean.', 'Identify a modal class and compute the mode.', 'Read frequencies across a whole table.'],
    ifNotReady: 'Revise the two previous lessons. This one compares what they produce rather than how to produce them.',
  },
  vocabulary: [
    { term: 'central tendency', meaning: 'A single value chosen to stand for a whole distribution.' },
    { term: 'skewed', meaning: 'Describing a distribution whose observations trail off further on one side than the other.' },
    { term: 'outlier', meaning: 'An observation far from the rest, which pulls the mean more than the mode.' },
  ],
  explanation: [
    'The mean and the mode are both measures of central tendency \u2014 single numbers standing for a whole distribution \u2014 and they answer different questions. Treating them as competing estimates of one quantity is the mistake this lesson is about.',
    'The mean answers: if the total were shared equally, how much would each get? Every observation contributes to it, so every observation can move it.',
    'The mode answers: where are the observations densest? It is driven by the busiest class and its two neighbours, and is almost unmoved by what happens far away in the tails \u2014 an outlier sitting well clear of the rest of the data can shift the mean noticeably while leaving the mode exactly where it was.',
    `On the water data they are close \u2014 a mean of ${n(W.mean)} and a mode of ${n(W.mode)} \u2014 because that distribution is nearly symmetric. Being close is a property of this data, not a rule.`,
    `On the reading-minutes data they are not. The mean is ${n(R.mean)} minutes and the mode about ${n(R.mode)}. Most students read for 20 to 40 minutes, but a few read for 60, 80 or 100, and those long sessions pull the mean upwards while leaving the busiest class where it was.`,
    'So which should be reported? It depends what is being asked. A library planning total staff hours needs the mean, because it needs the total. A library deciding how long a typical visit lasts is better served by the mode, because a value the data actually clusters around describes most visitors better than an average few of them are near.',
    'Neither is more correct. Reporting only one of them, where they differ, hides something true about the data \u2014 which is why a distribution with a long tail is usually described by more than a single number.',
  ],
  representations: ['Two tables, one nearly symmetric and one with a long upper tail'],
  visuals: [T_READING_FULL, T_WATER_DIRECT],
  visualsById: { T_READING_FULL, T_WATER_DIRECT },
  workedExamples: [
    {
      id: 's133b.we1',
      prompt: 'Compute the mean and the mode of the reading-minutes data and explain why they differ.',
      steps: [
        { text: `The mean is \u03a3f\u1d62x\u1d62 / \u03a3f\u1d62 = ${n(R.sfx)} / ${R.N} = ${n(R.mean)} minutes.`, reasoning: 'Every class contributes, including the eight students in the two highest classes with class marks of 70 and 90.' },
        { text: `The modal class is 20\u201340 with frequency 25, and the mode is about ${n(R.mode)} minutes.`, reasoning: 'The mode is decided by that class and its two neighbours alone; the sparse upper classes play no part in it.' },
        { text: `The mean exceeds the mode by about ${n(R.mean - R.mode)} minutes.`, reasoning: 'The gap exists because the distribution trails off upwards: a few long sessions lift the average without changing where most students are.' },
        { text: 'The distribution is skewed upwards, so the mean is pulled towards the tail.', reasoning: 'This is the characteristic signature of a long tail, and the size of the gap is a measure of how pronounced it is.' },
      ],
      answer: `Mean ${n(R.mean)}, mode about ${n(R.mode)}; the upper tail pulls the mean up.`,
      visualRef: 'T_READING_FULL',
    },
    {
      id: 's133b.we2',
      prompt: 'Compute both for the water-use data and compare the gap with the reading data.',
      steps: [
        { text: `The mean is ${n(W.mean)} litres and the mode ${n(W.mode)} litres.`, reasoning: 'Both were computed in earlier lessons from the same table, so no new arithmetic is needed.' },
        { text: `They differ by only ${n(Math.abs(W.mean - W.mode))} litres.`, reasoning: 'The frequencies rise to a peak and fall away roughly evenly, so neither tail dominates the other.' },
        { text: 'The water distribution is close to symmetric; the reading distribution is not.', reasoning: 'A small gap suggests symmetry and a large one suggests a tail, which is information the two numbers carry jointly and neither carries alone.' },
      ],
      answer: `Water: mean ${n(W.mean)}, mode ${n(W.mode)} \u2014 nearly symmetric, unlike the reading data.`,
      visualRef: 'T_WATER_DIRECT',
    },
    {
      id: 's133b.we3',
      prompt: 'A report on reading says "students read for about 35 minutes a day". Is this fair?',
      steps: [
        { text: `It quotes the mean of ${n(R.mean)} minutes, which is correctly computed.`, reasoning: 'Nothing arithmetic is wrong with the statement, which is why the problem is easy to miss.' },
        { text: `But the busiest class is 20\u201340, and ${R.cf[1]} of the ${R.N} students read for under 40 minutes.`, reasoning: 'Well over half the students sit below the quoted figure, so it does not describe a typical student.' },
        { text: 'The word "about" suggests a typical value, which is closer to the mode.', reasoning: 'A reader takes "students read for about 35 minutes" as a claim about the ordinary case rather than about the total divided by the headcount.' },
        { text: 'Reporting both, or saying most students read 20 to 40 minutes, would be fairer.', reasoning: 'The mean is the right number for the total reading time; it is the wrong number for the typical student, and the sentence asked for the second.' },
      ],
      answer: 'Arithmetically right, but misleading as a claim about the typical student.',
    },
  ],
  guidedPractice: [
    { id: 's133b.g1', prompt: 'Which measure is more affected by a few unusually large observations?', hint: 'Which one uses every value?', answer: 'The mean.', rationale: 'Every observation enters the mean, so a few large ones raise it. The mode depends only on the busiest class and its neighbours.' },
    { id: 's133b.g2', prompt: 'A shop wants to know which shoe size to stock most of. Mean or mode?', hint: 'What is the question actually asking for?', answer: 'The mode.', rationale: 'The shop needs the size that is most in demand. A mean shoe size might not even be a size that exists.' },
    { id: 's133b.g3', prompt: 'A council needs the total water used by 40 households. Mean or mode?', hint: 'Which one can be multiplied back up?', answer: 'The mean.', rationale: 'Mean times the number of households reconstructs the total. The mode has no such relationship to the total.' },
  ],
  independentPractice: [
    { id: 's133b.i1', prompt: 'If the mean is much larger than the mode, what does that suggest about the distribution?', answer: 'That it has a long tail on the upper side.', rationale: 'A few large observations lift the mean while leaving the busiest class unchanged, so the gap opens upwards.' },
    { id: 's133b.i2', prompt: 'Can the mode be larger than the mean?', answer: 'Yes, when the tail runs downwards.', rationale: 'A few unusually small observations pull the mean below the busiest class, reversing the gap. Nothing forces either to be larger.' },
    { id: 's133b.i3', prompt: `For the reading data, how many of the ${R.N} students read for less than the mean of ${n(R.mean)} minutes?`, answer: `At least ${R.cf[1]}.`, rationale: `The cumulative frequency up to 40 minutes is ${R.cf[1]}, and the mean of ${n(R.mean)} lies in the next class, so at least that many students fall below it.` },
    { id: 's133b.i4', prompt: 'Why is quoting only one measure sometimes misleading?', answer: 'Because where they differ, each describes something the other does not.', rationale: 'The mean carries the total and the mode carries the typical case. On skewed data they answer different questions and one alone hides the skew.' },
  ],
  misconceptionIds: [], interactivePractice: [],
  reasoningApplication: [
    {
      id: 's133b.td1',
      prompt: 'Why can the mean and the mode differ substantially on the same data, when both claim to represent its centre?',
      expectedReasoning:
        'They use different information. The mean uses every observation, so a few extreme values shift it in their direction by an amount proportional to how extreme they are. The mode uses only the busiest class and its immediate neighbours, so distant observations are invisible to it. On a symmetric distribution the two coincide closely because there is no direction for the extremes to pull. On a skewed one the mean follows the tail while the mode stays with the crowd, and the gap between them measures the skew.',
    },
    {
      id: 's133b.td2',
      prompt: 'A quantity is reported by its mean alone. What question would you ask before accepting it as describing a typical case?',
      expectedReasoning:
        'Whether the distribution is roughly symmetric. If it has a long tail, the mean sits away from where most observations are and describes no typical case at all \u2014 the reading data has a mean of 35 minutes while most students read for under 40 and the busiest class is 20 to 40. Asking for the mode, or for the shape of the frequencies, would reveal whether the mean is standing in for the crowd or being dragged by a few extremes.',
    },
  ],
  summary:
    `The mean answers "what if the total were shared equally" and uses every observation; the mode answers "where are observations densest" and is driven by the busiest class. On nearly symmetric data they agree closely \u2014 the water figures are ${n(W.mean)} and ${n(W.mode)}. On skewed data they separate: the reading figures are ${n(R.mean)} and about ${n(R.mode)}, because a few long sessions lift the mean. Neither is more correct; which to report depends on the question.`,
  nextStep: 'Next you will meet a third measure, found by counting to the middle of the data.',
  teacher: teacher(
    'Students interpret mean and mode as answers to different questions and explain when they diverge.',
    ['Grouped mean', 'Modal class and mode'],
    ['What question is this number answering?', 'Which observations can move it?', 'Close together means symmetric \u2014 that is data, not a rule.'],
    [
      'Pairing a symmetric table with a skewed one is what makes the point. On the water data alone students conclude the two measures are interchangeable.',
      'The misleading-report example is worth discussing as writing, not just arithmetic: the sentence is true and still gives a false impression.',
      'Avoid ranking the measures. The question decides, and students who learn the mean is "better" will use it on skewed data.',
    ],
    ['Ask which measure a shoe shop needs.', 'Ask what a large gap between them suggests.'],
    ['Have the student state the question each number answers before comparing the two.'],
    ['Ask for a situation where the mode is larger than the mean.'],
  ),
  reviewStatus: 'authored_draft',
};

export const C10_SECTION_13_4A: AuthoredSection = {
  contentArtifactId: 'ncert_jemh1_s13_4_cumulative_frequency_lesson',
  contentArtifactVersion: 1,
  source: source('13.4', 'Median of Grouped Data', 188, 'ncert_jemh1_s13_4'),
  competencyCandidates: [], competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_jemh1_s13_2'],
    mayAssume: ['Grouped frequency distributions from Class IX', 'Median of ungrouped data'],
    mustNotIntroduce: [{ concept: 'The median formula for grouped data', belongsToSection: 'ncert_jemh1_s13_4b' }],
  },
  learningGoal:
    'You will build a cumulative frequency table from a grouped distribution and use it to identify the median class.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: ['Find the median of a short ordered list.', 'Add a column of frequencies.', 'Read a running total.'],
    ifNotReady: 'Revise the median of ungrouped data. The idea of counting to the middle carries over; the counting is what changes.',
  },
  vocabulary: [
    { term: 'cumulative frequency', meaning: 'The running total of frequencies up to and including a class \u2014 how many observations fall below its upper boundary.' },
    { term: 'median class', meaning: 'The first class whose cumulative frequency reaches N/2, where the middle observation lies.' },
    { term: 'median', meaning: 'The value with half the observations below it and half above.' },
  ],
  explanation: [
    'The median of an ordered list is the value in the middle. With grouped data there is no list to walk along, so the middle has to be located by counting classes instead of observations.',
    'That counting is what a cumulative frequency does. Add each frequency to the running total, and the result for a class tells you how many observations fall below its upper boundary.',
    `For the reading data the frequencies 15, 25, 12, 6 and 2 give cumulative frequencies of ${R.cf.join(', ')}. So ${R.cf[0]} students read for under 20 minutes, ${R.cf[1]} for under 40, and so on.`,
    `Two checks fall out of how the column is built. It can never decrease, because each step adds a frequency and frequencies are never negative. And the last entry must equal the total frequency, ${R.N} here, because by the final class every observation has been counted. A column that falls, or that ends anywhere but \u03a3f\u1d62, contains an arithmetic error.`,
    `To find the middle, halve the total: N/2 = ${R.N / 2}. Then read down the cumulative column for the FIRST class whose total reaches ${R.N / 2}. The cumulative frequency is ${R.cf[0]} after the first class, which has not reached it, and ${R.cf[1]} after the second, which has. So the median class is ${D_READING.intervals[R.medIdx].lower}\u2013${D_READING.intervals[R.medIdx].upper}.`,
    'Note that it is the first class to reach N/2, not the first to exceed it. If a cumulative frequency lands exactly on N/2, that class is the median class.',
    'Like the modal class, the median class is an interval and not yet the answer. It says which class the middle observation falls in; the next lesson estimates where inside it.',
  ],
  representations: ['A grouped table with the cumulative frequency built up class by class'],
  visuals: [T_READING_CF],
  visualsById: { T_READING_CF },
  workedExamples: [
    {
      id: 's134a.we1',
      prompt: 'Build the cumulative frequency column for the reading-minutes data and identify the median class.',
      steps: [
        { text: 'Start with the first frequency: 15 students read for under 20 minutes.', reasoning: 'The first cumulative entry is just the first frequency, since no classes precede it.' },
        { text: `Add the next: 15 + 25 = ${R.cf[1]} students read for under 40 minutes.`, reasoning: 'Each entry adds the new class to everything already counted, which is what makes it a running total rather than a frequency.' },
        { text: `Continuing gives ${R.cf.join(', ')}.`, reasoning: 'Each step adds 12, then 6, then 2, and the column rises throughout because no frequency is negative.' },
        { text: `Check the last entry: ${R.cf[4]} equals \u03a3f\u1d62 = ${R.N}.`, reasoning: 'By the final class every student has been counted, so a different final value would mean an addition error somewhere in the column.' },
        { text: `Halve the total: N/2 = ${R.N / 2}. The first cumulative frequency to reach ${R.N / 2} is ${R.cf[1]}, in the class ${D_READING.intervals[1].lower}\u2013${D_READING.intervals[1].upper}.`, reasoning: `After the first class only ${R.cf[0]} students have been counted, which is short of ${R.N / 2}, so the middle observation must lie in the second class.` },
      ],
      answer: `Cumulative frequencies ${R.cf.join(', ')}; median class ${D_READING.intervals[1].lower}\u2013${D_READING.intervals[1].upper}.`,
      visualRef: 'T_READING_CF',
    },
    {
      id: 's134a.we2',
      prompt: 'Find the median class of the water-use data.',
      steps: [
        { text: `The frequencies 4, 8, 14, 10, 4 give cumulative frequencies ${cumulativeFrequencies(D_WATER).join(', ')}.`, reasoning: 'Each is the running total, and the final entry matches the forty households.' },
        { text: `N/2 = ${W.N / 2}.`, reasoning: 'This is the position of the middle observation, counted from the bottom.' },
        { text: `The cumulative frequency is ${cumulativeFrequencies(D_WATER)[1]} after the second class, short of ${W.N / 2}, and ${cumulativeFrequencies(D_WATER)[2]} after the third.`, reasoning: 'The third class is the first to reach the halfway count, so the middle household lies within it.' },
        { text: 'So the median class is 20\u201330.', reasoning: 'It is the same interval as the modal class here, which happens on this data and is not a general rule.' },
      ],
      answer: 'Median class 20\u201330.',
    },
    {
      id: 's134a.we3',
      prompt: 'A student writes the cumulative column for frequencies 8, 11, 6, 5 as 8, 19, 25, 29 \u2014 but the table says \u03a3f\u1d62 = 31. What has gone wrong?',
      steps: [
        { text: 'The column ends at 29, not 31.', reasoning: 'The final cumulative frequency must equal the total, so a mismatch is a definite error rather than a rounding effect.' },
        { text: 'Check the given frequencies: 8 + 11 + 6 + 5 = 30.', reasoning: 'The frequencies themselves do not sum to 31 either, so the discrepancy did not start in the cumulative column.' },
        { text: 'So either a frequency was mistyped or \u03a3f\u1d62 was.', reasoning: 'The running totals are internally consistent with the frequencies shown, which points the error at the source data rather than the addition.' },
        { text: 'The check caught it without needing to recompute anything downstream.', reasoning: 'This is why the final-entry check is worth doing first: it detects errors before they propagate into the median class and the median.' },
      ],
      answer: 'The column is consistent with the frequencies shown, so the stated total or a frequency is wrong.',
    },
  ],
  guidedPractice: [
    { id: 's134a.g1', prompt: 'Frequencies 5, 9, 12, 4. Write the cumulative frequencies.', hint: 'Add each one to the running total.', answer: '5, 14, 26, 30.', rationale: 'Each entry adds the next frequency, and the last equals \u03a3f\u1d62 = 30.' },
    { id: 's134a.g2', prompt: 'For that table, what is N/2 and which is the median class?', hint: 'First to reach it, not first to exceed it.', answer: 'N/2 = 15, and the third class.', rationale: 'The cumulative frequency is 14 after the second class, just short of 15, and 26 after the third, so the third is the first to reach it.' },
    { id: 's134a.g3', prompt: 'Can a cumulative frequency column ever decrease?', hint: 'What is added at each step?', answer: 'No.', rationale: 'Each entry adds a frequency, and frequencies are never negative. A column that falls contains an arithmetic error.' },
  ],
  independentPractice: [
    { id: 's134a.i1', prompt: 'Frequencies 3, 7, 10, 8, 2. Find the cumulative frequencies and the median class.', answer: '3, 10, 20, 28, 30; the third class.', rationale: 'N/2 = 15, and the cumulative frequency reaches 15 first at 20, in the third class.' },
    { id: 's134a.i2', prompt: 'Why must the last cumulative frequency equal \u03a3f\u1d62?', answer: 'Because by the final class every observation has been counted.', rationale: 'The running total has absorbed every frequency, so it is the sum of them all by construction.' },
    { id: 's134a.i3', prompt: 'A cumulative frequency lands exactly on N/2. Is that class the median class?', answer: 'Yes.', rationale: 'The convention is the first class to REACH N/2, and landing exactly on it counts as reaching it.' },
    { id: 's134a.i4', prompt: 'Explain the difference between a frequency and a cumulative frequency in one sentence.', answer: 'A frequency counts one class; a cumulative frequency counts that class and all before it.', rationale: 'One is local to its row, the other is a running total, which is why only the cumulative column can locate the middle.' },
  ],
  misconceptionIds: [], interactivePractice: [],
  reasoningApplication: [
    {
      id: 's134a.td1',
      prompt: 'Why does locating the median need a cumulative frequency, when the mode needed only the frequencies themselves?',
      expectedReasoning:
        'The mode asks which class is busiest, which is a question about one row at a time, so comparing frequencies answers it directly. The median asks where the middle observation falls, which is a question about position in the ordered data, and position depends on everything below it. Only a running total carries that information: a frequency of 25 says nothing about whether those students are near the bottom or the top until you know how many came before.',
    },
    {
      id: 's134a.td2',
      prompt: 'The last cumulative frequency does not match \u03a3f\u1d62. Describe what you would check, in order, and why that order.',
      expectedReasoning:
        'First re-add the frequencies, because if they do not sum to the stated \u03a3f\u1d62 the error is in the source data or the stated total, and nothing in the cumulative column is at fault. If they do sum correctly, re-add the running totals step by step, since a single slip there propagates to every entry after it. Checking the frequencies first avoids correcting a column that was right all along, and the final-entry check is worth doing before anything downstream because it catches the error before it reaches the median class.',
    },
  ],
  summary:
    `A cumulative frequency is the running total of frequencies up to a class, so it says how many observations fall below that class's upper boundary. It can never decrease and must end at \u03a3f\u1d62, which gives two free checks. The median class is the FIRST class whose cumulative frequency reaches N/2; for the reading data N/2 = ${R.N / 2} and the median class is ${D_READING.intervals[1].lower}\u2013${D_READING.intervals[1].upper}. Like the modal class, it is an interval rather than the answer.`,
  nextStep: 'Next you will estimate where inside that class the median actually falls.',
  teacher: teacher(
    'Students build a cumulative frequency column and identify the median class from it.',
    ['Grouped frequency distributions', 'Median of ungrouped data'],
    ['Does it end at \u03a3f\u1d62?', 'First to REACH N/2, not first to exceed it.', 'That is the median class \u2014 an interval, not the median.'],
    [
      'Teach the two structural checks as habits rather than as facts. A column that must rise and must end at \u03a3f\u1d62 is self-auditing, and students who check it catch their own errors before the median is computed.',
      'The reach-versus-exceed convention matters only in the exact-landing case, but that case appears often enough to be worth naming.',
      'The modal class and median class coincide on the water data. Say that this is coincidence, or students will expect it.',
    ],
    ['Ask what the final cumulative frequency must equal.', 'Ask which class is median when a total lands exactly on N/2.'],
    ['Have the student write N/2 at the top of the page before reading down the column.'],
    ['Ask what a decreasing cumulative frequency would imply about a frequency.'],
  ),
  reviewStatus: 'authored_draft',
};

export const C10_SECTION_13_4B: AuthoredSection = {
  contentArtifactId: 'ncert_jemh1_s13_4_median_lesson',
  contentArtifactVersion: 1,
  source: source('13.4', 'Median of Grouped Data', 188, 'ncert_jemh1_s13_4'),
  competencyCandidates: [], competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_jemh1_s13_4'],
    mayAssume: ['Cumulative frequency and the median class', 'Class boundaries and width'],
    mustNotIntroduce: [{ concept: 'Ogive and graphical median', belongsToSection: 'not_prescribed_in_current_scope' }],
  },
  learningGoal:
    'You will compute the median of grouped data from the median class, using the cumulative frequency that precedes it.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: ['Build a cumulative frequency column.', 'Identify the median class.', 'Read the lower boundary and width of a class.'],
    ifNotReady: 'Revise the previous lesson. The median class is the starting point for everything here.',
  },
  vocabulary: [
    { term: 'preceding cumulative frequency', meaning: 'The cumulative frequency cf of the class just before the median class \u2014 how many observations are already counted before it starts.' },
    { term: 'frequency of the median class', meaning: 'The count f of observations in the median class itself, across which the remaining distance is shared.' },
  ],
  explanation: [
    'The median class says the middle observation lies somewhere between two boundaries. Estimating where inside is the same kind of step as estimating the mode inside the modal class, but the reasoning is different.',
    `Take the reading data. N/2 = ${R.N / 2}, and ${R.cf[0]} students have been counted before the median class begins. So ${R.N / 2 - R.cf[0]} more observations must be passed to reach the middle.`,
    `Those ${R.N / 2 - R.cf[0]} observations lie among the ${D_READING.intervals[1].frequency} in the median class. Assuming they are spread evenly across the class \u2014 the same kind of assumption the class mark made \u2014 passing ${R.N / 2 - R.cf[0]} of ${D_READING.intervals[1].frequency} means travelling that fraction of the way across it.`,
    `The class is ${classWidth(D_READING)} units wide and starts at ${D_READING.intervals[1].lower}, so the median is ${D_READING.intervals[1].lower} + ${classWidth(D_READING)} \u00d7 ${R.N / 2 - R.cf[0]} / ${D_READING.intervals[1].frequency} = ${n(R.med)} minutes.`,
    'In symbols: median = l + h(N/2 \u2212 cf) / f, where l is the lower boundary of the median class, h its width, f its frequency and cf the cumulative frequency of the class BEFORE it.',
    'The cf is the value most often taken from the wrong row. It belongs to the class preceding the median class, not to the median class itself; using the latter would mean the middle had already been passed, and the formula would run backwards.',
    'Where the classes are written inclusively, as 10\u201319 and 20\u201329, l must be the true lower boundary of 9.5 or 19.5 rather than the printed limit. The gap between consecutive classes is split between them before the formula is used.',
  ],
  representations: ['A cumulative table with the median class, its preceding total and its frequency marked'],
  visuals: [T_READING_CF, T_READING_FULL],
  visualsById: { T_READING_CF, T_READING_FULL },
  workedExamples: [
    {
      id: 's134b.we1',
      prompt: 'Find the median of the reading-minutes data.',
      steps: [
        { text: `The cumulative frequencies are ${R.cf.join(', ')} and N/2 = ${R.N / 2}.`, reasoning: 'The column was built in the previous lesson and its final entry matches the sixty students, so it can be trusted.' },
        { text: `The median class is ${D_READING.intervals[1].lower}\u2013${D_READING.intervals[1].upper}, the first to reach ${R.N / 2}.`, reasoning: `Only ${R.cf[0]} students are counted before it, which is short of ${R.N / 2}.` },
        { text: `Read off l = ${D_READING.intervals[1].lower}, h = ${classWidth(D_READING)}, f = ${D_READING.intervals[1].frequency} and cf = ${R.cf[0]}.`, reasoning: `The cf of ${R.cf[0]} belongs to the class BEFORE the median class; taking ${R.cf[1]} instead would mean the middle had already been passed.` },
        { text: `Substitute: ${D_READING.intervals[1].lower} + ${classWidth(D_READING)}(${R.N / 2} \u2212 ${R.cf[0]}) / ${D_READING.intervals[1].frequency} = ${D_READING.intervals[1].lower} + ${classWidth(D_READING)} \u00d7 ${R.N / 2 - R.cf[0]} / ${D_READING.intervals[1].frequency}.`, reasoning: `There are ${R.N / 2 - R.cf[0]} observations still to pass, spread among the ${D_READING.intervals[1].frequency} in this class.` },
        { text: `So the median is ${n(R.med)} minutes.`, reasoning: 'It lies inside the median class, as it must, and above the midpoint because more than half of that class must be crossed to reach the middle.' },
      ],
      answer: `The median is ${n(R.med)} minutes.`,
      visualRef: 'T_READING_CF',
    },
    {
      id: 's134b.we2',
      prompt: 'Find the median of the water-use data.',
      steps: [
        { text: `Cumulative frequencies ${cumulativeFrequencies(D_WATER).join(', ')}, and N/2 = ${W.N / 2}.`, reasoning: 'The column ends at forty, matching the total number of households.' },
        { text: `The median class is 20\u201330, with l = 20, h = 10, f = 14 and cf = ${cumulativeFrequencies(D_WATER)[1]}.`, reasoning: `Twelve households are counted before the class begins, so eight more are needed to reach the twentieth.` },
        { text: `Median = 20 + 10(${W.N / 2} \u2212 ${cumulativeFrequencies(D_WATER)[1]}) / 14 = 20 + 80 / 14.`, reasoning: 'Eight observations out of fourteen means travelling eight fourteenths of the way across a class ten litres wide.' },
        { text: `So the median is about ${n(median(D_WATER)!)} litres.`, reasoning: `This sits close to the mean of ${n(W.mean)} and the mode of ${n(W.mode)}, which is what a nearly symmetric distribution looks like.` },
      ],
      answer: `About ${n(median(D_WATER)!)} litres.`,
    },
    {
      id: 's134b.we3',
      prompt: `A student computing the reading median uses cf = ${R.cf[1]} instead of ${R.cf[0]}. What do they get, and why is it wrong?`,
      steps: [
        { text: `Their numerator becomes ${R.N / 2} \u2212 ${R.cf[1]} = ${R.N / 2 - R.cf[1]}, a negative number.`, reasoning: `The cumulative frequency ${R.cf[1]} already exceeds ${R.N / 2}, so subtracting it says the middle lies behind the start of the class.` },
        { text: `Their median would be ${D_READING.intervals[1].lower} + ${classWidth(D_READING)} \u00d7 ${R.N / 2 - R.cf[1]} / ${D_READING.intervals[1].frequency} = ${n(D_READING.intervals[1].lower + classWidth(D_READING)! * (R.N / 2 - R.cf[1]) / D_READING.intervals[1].frequency)}.`, reasoning: 'The answer falls below the lower boundary of the median class, which is impossible for a value the class was chosen to contain.' },
        { text: 'The cf must come from the class before the median class.', reasoning: 'It counts what has already been passed before entering the class, and the formula then shares the remaining distance across that class.' },
        { text: 'A negative numerator is itself the warning sign.', reasoning: 'If N/2 \u2212 cf comes out negative, the wrong row was read, because by construction the preceding cumulative frequency is below N/2.' },
      ],
      answer: `They get ${n(D_READING.intervals[1].lower + classWidth(D_READING)! * (R.N / 2 - R.cf[1]) / D_READING.intervals[1].frequency)}, outside the median class; cf must be the preceding class's total.`,
    },
  ],
  guidedPractice: [
    { id: 's134b.g1', prompt: 'Classes 0\u201310, 10\u201320, 20\u201330 have frequencies 6, 14, 10. Find the median.', hint: 'Build the cumulative column first.', answer: 'About 16.43 units.', rationale: 'Cumulative 6, 20, 30; N/2 = 15; median class 10\u201320 with l = 10, h = 10, f = 14, cf = 6. Then 10 + 10(15 \u2212 6)/14 = 10 + 90/14, about 16.43.' },
    { id: 's134b.g2', prompt: 'In the median formula, which row does cf come from?', hint: 'Before or within?', answer: 'The class immediately before the median class.', rationale: 'It counts the observations already passed before the median class begins, which is what the formula subtracts from N/2.' },
    { id: 's134b.g3', prompt: 'Why is the median also only an estimate?', hint: 'What is assumed about the median class?', answer: 'Because the observations inside the median class are assumed to be spread evenly.', rationale: 'The individual values are gone, so the position within the class is interpolated rather than observed.' },
  ],
  independentPractice: [
    { id: 's134b.i1', prompt: 'Frequencies 4, 10, 16, 6 over classes of width 5 starting at 0. Find the median.', answer: '11.25.', rationale: 'Cumulative 4, 14, 30, 36; N/2 = 18; median class 10\u201315 with cf = 14 and f = 16. Then 10 + 5(18 \u2212 14)/16 = 10 + 1.25 = 11.25.' },
    { id: 's134b.i2', prompt: 'If N/2 \u2212 cf comes out negative, what has gone wrong?', answer: 'The cumulative frequency was read from the wrong row.', rationale: 'The preceding cumulative frequency is below N/2 by construction, so a negative result means the median class\u2019s own total was used.' },
    { id: 's134b.i3', prompt: 'A table lists classes as 10\u201319, 20\u201329, 30\u201339. What value of l should be used for the second class?', answer: '19.5.', rationale: 'The classes are inclusive, so the gap between 19 and 20 is split and the true lower boundary is 19.5.' },
    { id: 's134b.i4', prompt: 'Must the median always lie inside the median class?', answer: 'Yes.', rationale: 'The fraction (N/2 \u2212 cf) / f lies between 0 and 1, so l + h times that fraction lies between l and l + h.' },
  ],
  misconceptionIds: [], interactivePractice: [],
  reasoningApplication: [
    {
      id: 's134b.td1',
      prompt: 'Explain what each part of l + h(N/2 \u2212 cf) / f contributes, as a journey to the middle observation.',
      expectedReasoning:
        'The l is where the median class begins, so the journey starts there. The cf counts what has already been passed before arriving, so N/2 \u2212 cf is how many observations still lie between the start of the class and the middle. Dividing by f turns that count into a fraction of the class, on the assumption that its observations are evenly spread. Multiplying by h converts the fraction into the original units. So the formula is a starting point plus a measured distance into the class, and every symbol has a job in that sentence.',
    },
    {
      id: 's134b.td2',
      prompt: 'The median is an estimate, like the mean and the mode. What assumption does each of the three rely on, and are they the same assumption?',
      expectedReasoning:
        'The mean assumes every observation in a class sits at its midpoint. The median assumes the observations inside the median class are spread evenly, so that a fraction of the count corresponds to the same fraction of the width. The mode assumes the relationship between the modal class and its two neighbours indicates where density peaks inside it. All three are about what grouping hid, but they are different assumptions and they use different parts of the table, which is part of why the three answers can differ on the same data.',
    },
  ],
  summary:
    `The median is l + h(N/2 \u2212 cf) / f, where l is the lower boundary of the median class, h its width, f its frequency and cf the cumulative frequency of the class BEFORE it. The fraction (N/2 \u2212 cf) / f says how far into the class the middle observation falls, assuming an even spread. For the reading data this gives ${n(R.med)} minutes. A negative numerator means cf was read from the wrong row.`,
  nextStep: 'Next you will put all three averages side by side on the same data.',
  teacher: teacher(
    'Students compute a grouped median and explain the role of each term.',
    ['Cumulative frequency', 'Median class', 'Class boundaries'],
    ['How many are already counted before this class starts?', 'cf comes from the row ABOVE.', 'A negative numerator means the wrong row.'],
    [
      'The journey reading \u2014 start at l, count what is left, share it across the class, convert to units \u2014 is what makes the formula memorable. Students who learn it as four symbols cannot reconstruct it.',
      'The wrong-row error produces an answer outside the median class, which is a detectable impossibility worth pointing out as a self-check.',
      'Inclusive class limits are the quiet trap: the printed 20 is not the boundary when the previous class ends at 19.',
    ],
    ['Ask which row cf is read from.', 'Ask what a negative N/2 \u2212 cf indicates.'],
    ['Have the student mark l, h, f and cf on the table before substituting.'],
    ['Ask what the median becomes when cf is exactly N/2.'],
  ),
  reviewStatus: 'authored_draft',
};

export const C10_SECTION_13_4C: AuthoredSection = {
  contentArtifactId: 'ncert_jemh1_s13_4_comparing_averages_lesson',
  contentArtifactVersion: 1,
  source: source('13.4', 'Median of Grouped Data', 188, 'ncert_jemh1_s13_4'),
  competencyCandidates: [], competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_jemh1_s13_4', 'ncert_jemh1_s13_3'],
    mayAssume: ['The grouped mean, mode and median'],
    mustNotIntroduce: [{ concept: 'Ogive and graphical determination of median', belongsToSection: 'not_prescribed_in_current_scope' }],
  },
  learningGoal:
    'You will compare the mean, median and mode of the same grouped data and say which question each of them answers.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: ['Compute a grouped mean.', 'Compute a mode from a modal class.', 'Compute a median from a median class.'],
    ifNotReady: 'Revise the three computations. This lesson is about choosing between their answers, not about producing them.',
  },
  vocabulary: [
    { term: 'measure of central tendency', meaning: 'Any single value chosen to represent a whole distribution \u2014 mean, median or mode.' },
    { term: 'resistant', meaning: 'Describing a measure little affected by a few extreme observations.' },
  ],
  explanation: [
    'Three measures of central tendency, three questions. The mean asks what each would get if the total were shared equally. The median asks what value sits in the middle when the data is ordered. The mode asks where the observations are densest.',
    `On the water data all three are close: mean ${n(W.mean)}, median ${n(median(D_WATER)!)} and mode ${n(W.mode)}. Nothing is being settled by the choice, because the distribution is nearly symmetric.`,
    `On the reading data they separate: mean ${n(R.mean)}, median ${n(R.med)} and mode about ${n(R.mode)}. The ordering is mode below median below mean, which is the signature of a distribution with a long upper tail.`,
    'The reason for that ordering is in how each uses the data. A handful of students reading for 80 or 100 minutes enter the mean at full weight and pull it up. The median only cares that they are above the middle, not how far above, so it barely moves. The mode does not see them at all.',
    'That is what makes the median resistant: replacing the two students in the top class with two who read for 500 minutes would change the mean considerably and leave the median exactly where it is.',
    'Which to report depends on the question. A total budget needs the mean. A typical case on skewed data is better served by the median, which is why incomes are usually reported that way. A stocking decision needs the mode.',
    'Some books mention an approximate relationship linking the three on moderately skewed data. It is an empirical observation, not an identity, and it does not hold exactly on this or any particular dataset \u2014 so it is not used here to compute one measure from the other two.',
  ],
  representations: ['One table carrying the mean, median and mode of the same data'],
  visuals: [T_READING_FULL, T_WATER_DIRECT],
  visualsById: { T_READING_FULL, T_WATER_DIRECT },
  workedExamples: [
    {
      id: 's134c.we1',
      prompt: 'Compute all three measures for the reading data and describe what each says.',
      steps: [
        { text: `Mean = ${n(R.sfx)} / ${R.N} = ${n(R.mean)} minutes.`, reasoning: 'Total reading time shared equally among all sixty students, so every student contributes.' },
        { text: `Median: N/2 = ${R.N / 2}, median class ${D_READING.intervals[1].lower}\u2013${D_READING.intervals[1].upper}, giving ${n(R.med)} minutes.`, reasoning: 'Half the students read less than this and half read more, regardless of how extreme the longest sessions are.' },
        { text: `Mode: modal class ${D_READING.intervals[1].lower}\u2013${D_READING.intervals[1].upper}, giving about ${n(R.mode)} minutes.`, reasoning: 'The densest part of the distribution, decided by the busiest class and its two neighbours.' },
        { text: `The order is ${n(R.mode)} < ${n(R.med)} < ${n(R.mean)}.`, reasoning: 'Mode below median below mean is what a long upper tail produces, because only the mean follows the extremes all the way.' },
      ],
      answer: `Mean ${n(R.mean)}, median ${n(R.med)}, mode about ${n(R.mode)} \u2014 separated by the upper tail.`,
      visualRef: 'T_READING_FULL',
    },
    {
      id: 's134c.we2',
      prompt: 'Compute all three for the water data and compare the spread of answers.',
      steps: [
        { text: `Mean ${n(W.mean)}, median ${n(median(D_WATER)!)}, mode ${n(W.mode)}.`, reasoning: 'All three were computed in earlier lessons from the same table, so this is a comparison rather than new work.' },
        { text: `They span only about ${n(Math.max(W.mean, median(D_WATER)!, W.mode) - Math.min(W.mean, median(D_WATER)!, W.mode))} litres.`, reasoning: 'The frequencies rise to a peak and fall away fairly evenly, so no tail drags the mean away from the others.' },
        { text: 'On data like this the choice of measure hardly matters.', reasoning: 'Which is itself useful to know: the three measures agreeing is evidence of symmetry, and their disagreeing is evidence of skew.' },
      ],
      answer: `All three within about ${n(Math.max(W.mean, median(D_WATER)!, W.mode) - Math.min(W.mean, median(D_WATER)!, W.mode))} litres \u2014 the distribution is nearly symmetric.`,
      visualRef: 'T_WATER_DIRECT',
    },
    {
      id: 's134c.we3',
      prompt: 'The two students in the top reading class are replaced by two who read for 500 minutes. Which measures change?',
      steps: [
        { text: 'The mean changes substantially, because those two observations enter it at their full size.', reasoning: 'Each extra 410 minutes adds 410 to the total, which is spread over sixty students, so the mean rises by nearly fourteen minutes.' },
        { text: 'The median does not change at all.', reasoning: 'Those students were already above the middle, and the median depends only on how many observations lie on each side, not on how far away they are.' },
        { text: 'The mode does not change either.', reasoning: 'The busiest class and its neighbours are untouched, so the formula\u2019s inputs are identical.' },
        { text: 'This is what resistance means.', reasoning: 'The median and mode ignore the size of extreme values, which makes them more stable descriptions when a few observations are unusual.' },
      ],
      answer: 'Only the mean changes; the median and mode are resistant to the change.',
    },
  ],
  guidedPractice: [
    { id: 's134c.g1', prompt: 'Which of the three is least affected by one very large observation?', hint: 'Which one counts positions rather than sizes?', answer: 'The median.', rationale: 'It depends only on how many observations lie on each side, so moving one of them further away changes nothing.' },
    { id: 's134c.g2', prompt: 'Mean 48, median 35, mode 30. What shape is the distribution?', hint: 'Which direction are the extremes pulling?', answer: 'Skewed upwards, with a long upper tail.', rationale: 'The mean sits well above the other two, which happens when a few large observations pull it towards the tail.' },
    { id: 's134c.g3', prompt: 'Why are house prices usually reported as a median rather than a mean?', hint: 'What do a few very expensive houses do?', answer: 'Because a few very expensive houses would pull the mean above any typical price.', rationale: 'The median describes the middle of the market, which is what a buyer wants to know, and it is resistant to the extremes.' },
  ],
  independentPractice: [
    { id: 's134c.i1', prompt: 'All three measures of a distribution are nearly equal. What does that suggest?', answer: 'That the distribution is close to symmetric.', rationale: 'With no tail to pull the mean away, the centre, the middle and the peak nearly coincide.' },
    { id: 's134c.i2', prompt: 'A charity needs the total donated by 200 donors and knows the mean. Is that enough?', answer: 'Yes \u2014 mean times 200 gives the total.', rationale: 'Only the mean has that relationship to the total. Neither the median nor the mode can be multiplied back up.' },
    { id: 's134c.i3', prompt: `For the reading data, which measure best describes a typical student, and why?`, answer: `The median of ${n(R.med)} or the mode of about ${n(R.mode)} minutes.`, rationale: `The mean of ${n(R.mean)} is lifted by a few long sessions, and ${R.cf[1]} of the ${R.N} students read for under 40 minutes.` },
    { id: 's134c.i4', prompt: 'Should an approximate relationship between the three be used to compute one from the other two?', answer: 'No \u2014 it is an empirical observation, not an identity.', rationale: 'It holds only approximately and only for moderately skewed data, so a value computed from it would not be the measure itself. Each should be computed from the data.' },
  ],
  misconceptionIds: [], interactivePractice: [],
  reasoningApplication: [
    {
      id: 's134c.td1',
      prompt: 'On the reading data the mode is below the median and the median below the mean. Explain that ordering from how each measure uses the observations.',
      expectedReasoning:
        'The mode sits with the busiest class and ignores everything far from it, so it stays low where the crowd is. The median counts positions: it moves up only as far as needed for half the observations to lie on each side, and a long tail affects it only through how many are in it, not how far out. The mean weighs every observation by its size, so the students reading for 80 and 100 minutes pull it furthest. Each measure responds to the tail more than the one before it, which produces exactly that ordering whenever the tail runs upwards.',
    },
    {
      id: 's134c.td2',
      prompt: 'A single number is wanted to summarise a distribution. What would you need to know before choosing one, and what would you lose either way?',
      expectedReasoning:
        'You would need to know what the number is for and whether the distribution is skewed. If a total is to be reconstructed, only the mean will do. If a typical case is wanted and the data has a long tail, the median or the mode describes it better. You lose something whichever is chosen: a single number cannot carry both where the crowd is and what the total comes to, and on skewed data those are genuinely different places. That is why a distribution with a long tail is usually reported with more than one measure.',
    },
  ],
  summary:
    `Mean, median and mode answer different questions: the equal share, the middle, and the densest point. On the nearly symmetric water data they agree closely at ${n(W.mean)}, ${n(median(D_WATER)!)} and ${n(W.mode)}. On the skewed reading data they separate as ${n(R.mode)} < ${n(R.med)} < ${n(R.mean)}, because only the mean follows the long upper tail. The median is resistant: extreme values change their size, not their side. Any approximate relationship among the three is empirical and is not used to compute one from the others.`,
  nextStep: 'The remaining work of this chapter applies these measures to further distributions.',
  teacher: teacher(
    'Students compare the three measures on the same data and choose between them by the question asked.',
    ['Grouped mean, mode and median'],
    ['What question is this number answering?', 'Does the size of that observation matter, or only its side?', 'Agreement is evidence of symmetry.'],
    [
      'The replace-the-top-class example makes resistance concrete in a way a definition does not: one measure moves a lot and two do not move at all.',
      'Pairing a symmetric table with a skewed one is again what carries the lesson. On one table alone the three measures look interchangeable.',
      'Treat any mean-median-mode relationship as empirical. Students who learn it as a formula will use it to compute a missing measure, which it cannot do.',
    ],
    ['Ask which measure survives one huge observation unchanged.', 'Ask which measure reconstructs a total.'],
    ['Have the student write the three values in a row and say what each answers before comparing them.'],
    ['Ask what the three would look like on a distribution with a long LOWER tail.'],
  ),
  reviewStatus: 'authored_draft',
};

export const CLASS10_STATISTICS_SECTIONS: AuthoredSection[] = [
  C10_SECTION_13_2A, C10_SECTION_13_2B, C10_SECTION_13_2C,
  C10_SECTION_13_3A, C10_SECTION_13_3B,
  C10_SECTION_13_4A, C10_SECTION_13_4B, C10_SECTION_13_4C,
];
