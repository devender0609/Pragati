// ===========================================================================
// v0.84.0 checkpoint 37 — CLASS 9 CHAPTER 10: DATA.
//
// Two halves with different needs. §10.1 is the weighted mean, which is
// symbolic and needed nothing new. §10.2 is the representation pilot: the
// source asks a student to see that a percentage display answers some
// questions and discards others, and prose alone cannot show that.
//
// So the displays here read ONE canonical dataset each. The normalised
// view is computed from the raw values, not authored beside them, which
// is what makes "these two pictures are the same data" a fact rather than
// a claim. The dataset below is built so two households have almost the
// same composition and very different totals — the case the whole lesson
// turns on.
//
// All data is Pragati's own.
// ===========================================================================

import type { AuthoredSection } from './authoredSection';
import type { DataSet, DataDisplaySpec } from './dataDisplaySpecification';

export const DATA_CHAPTER_ID = 'ncert_iemh2_ch10';

const BOOK = 'Ganita Manjari, Textbook of Mathematics for Grade 9 (Part II)';
const SRC = 'https://ncert.nic.in/textbook/pdf/iemh2dd.zip';
const INSPECTED = '2026-10-07';

const source = (
  sectionNumber: string,
  exactTitle: string,
  startPage: number,
  officialSectionId: string
) => ({
  officialChapterId: DATA_CHAPTER_ID,
  officialSectionId,
  sectionNumber,
  exactTitle,
  startPage,
  textbook: BOOK,
  sourceReference: SRC,
  inspectionDate: INSPECTED,
});

// Monthly spending for three households. Composition is deliberately close
// across the three while the totals differ by a factor of four, so the
// normalised display makes them look alike and the absolute one does not.
const SPENDING: DataSet = {
  id: 'spending',
  categoryLabel: 'Household',
  categories: ['Rao', 'Iyer', 'Banerjee'],
  unit: 'rupees per month',
  series: [
    { id: 'food', label: 'Food', values: [6000, 12000, 24000] },
    { id: 'rent', label: 'Rent', values: [4500, 9000, 18000] },
    { id: 'travel', label: 'Travel', values: [1500, 3000, 6000] },
  ],
};

const D_ABSOLUTE: DataDisplaySpec = {
  type: 'data_display',
  dataSetId: 'spending',
  mode: 'stacked',
  status: 'concept_specific',
  purpose: 'How much does each household spend, and on what?',
  caption: 'Stacked columns: each column\u2019s height is that household\u2019s total spending.',
  altText:
    'Monthly spending for three households, stacked so each column\u2019s height is the household total. The Rao column reaches 12000 rupees, the Iyer column 24000 and the Banerjee column 48000. Within each column, food is the largest band, then rent, then travel.',
};

const D_GROUPED: DataDisplaySpec = {
  type: 'data_display',
  dataSetId: 'spending',
  mode: 'grouped',
  status: 'concept_specific',
  purpose: 'Which household spends most on food? On travel?',
  caption: 'The same figures as side-by-side columns, one per spending category.',
  altText:
    'Monthly spending for three households with food, rent and travel drawn side by side rather than piled up. Each bar can be compared directly against the same bar for another household: Banerjee spends 24000 on food against Iyer\u2019s 12000 and Rao\u2019s 6000.',
};

const D_NORMALISED: DataDisplaySpec = {
  type: 'data_display',
  dataSetId: 'spending',
  mode: 'normalised_stacked',
  status: 'concept_specific',
  purpose: 'What share of each household\u2019s spending goes on each thing?',
  caption: 'The same three households, each column scaled to 100%.',
  altText:
    'The same monthly spending, with every column scaled to the same height so it shows percentage composition. All three households now look identical \u2014 50 per cent food, 37.5 per cent rent, 12.5 per cent travel \u2014 because scaling to 100 per cent removes the totals, which differ fourfold.',
};

export const SECTION_10_1_MEAN: AuthoredSection = {
  contentArtifactId: 'ncert_iemh2_s10_1_mean_lesson',
  contentArtifactVersion: 1,
  source: source('10.1', 'Combining Things', 1, 'ncert_iemh2_s10_1'),
  competencyCandidates: [],
  competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: [],
    mayAssume: ['The mean of a list of values', 'Class 8 work with averages', 'Multiplying and dividing'],
    mustNotIntroduce: [{ concept: 'Mixtures and custom weights', belongsToSection: 'ncert_iemh2_s10_1' }, { concept: 'Data displays', belongsToSection: 'ncert_iemh2_s10_2' }],
  },
  learningGoal:
    'You will explain why averaging two group averages is wrong when the groups differ in size, and compute the weighted mean that repairs it.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: ['Find the mean of a list of numbers.', 'Multiply a mean by a count to recover a total.', 'Divide a total by a count.'],
    ifNotReady: 'Make sure you can recover a total from a mean and a count; that single move is what the lesson rests on.',
  },
  vocabulary: [
    { term: 'weighted mean', meaning: 'A mean in which each value counts according to how much of it there is.' },
    { term: 'weight', meaning: 'How much a value contributes — often a count, sometimes an importance.' },
    { term: 'simple mean', meaning: 'The ordinary mean, which treats every value as counting once.' },
  ],
  explanation: [
    'Two classes take the same test. Class A has 10 students averaging 80; class B has 40 averaging 60. What is the average across both?',
    'The tempting answer is to average the two averages: 80 and 60 give 70. It is wrong, and worth seeing why rather than just being told. Class B has four times as many students, so its 60 should pull the combined figure much closer to 60 than to 80.',
    'Go back to what a mean is. A mean of 80 across 10 students means the marks total 800. A mean of 60 across 40 students means they total 2400. Together that is 3200 marks shared among 50 students, so the true average is 64 — well below the 70 that averaging the averages gave.',
    'The repair is to weight each value by how much of it there is: multiply each group mean by its size, add, and divide by the total size. That is the weighted mean, and the simple mean is just the case where all the weights happen to be equal.',
    'So averaging averages is not a special rule to avoid; it is the weighted mean computed with the wrong weights. It treats a group of 10 and a group of 40 as counting the same, which they do not. Whenever group sizes differ, the weights are what carry that difference into the answer.',
  ],
  representations: ['Each group mean multiplied by its size, then totalled', 'The wrong answer and the right one side by side, with the gap explained'],
  visuals: [],
  visualsById: {  },
  workedExamples: [
    {
      id: 's101a.we1',
      prompt: 'Class A: 10 students averaging 80. Class B: 40 averaging 60. Find the combined mean.',
      steps: [
        { text: 'Recover each total: 10 times 80 = 800, and 40 times 60 = 2400.', reasoning: 'A mean times a count gives back the total, which is the quantity that can actually be added.' },
        { text: 'Add the totals: 3200 marks in all.', reasoning: 'Marks add; averages do not, which is the whole lesson in one line.' },
        { text: 'Divide by the total number of students, 50.', reasoning: 'The combined mean shares the combined total over everyone.' },
        { text: '3200 divided by 50 is 64.', reasoning: 'Notice it sits much nearer 60 than 80, because class B is four times the size.' },
      ],
      answer: '64, not the 70 that averaging the averages suggests.',
    },
    {
      id: 's101a.we2',
      prompt: 'A shop sells 30 pens at 12 rupees and 20 pens at 22 rupees. Find the mean price per pen sold.',
      steps: [
        { text: 'The weights are the quantities sold: 30 and 20.', reasoning: 'Each price counts as many times as there are pens at that price.' },
        { text: 'Revenue is 30 times 12 plus 20 times 22 = 360 + 440 = 800 rupees.', reasoning: 'Multiplying price by quantity turns each price into its contribution.' },
        { text: 'Divide by the 50 pens sold.', reasoning: 'The mean price per pen shares the revenue over the pens.' },
        { text: '800 divided by 50 is 16 rupees.', reasoning: 'The simple average of 12 and 22 would be 17, which overcounts the dearer pen.' },
      ],
      answer: '16 rupees per pen.',
    },
    {
      id: 's101a.we3',
      prompt: 'When does averaging the averages give the right answer?',
      steps: [
        { text: 'The weighted mean divides the total contribution by the total weight.', reasoning: 'That is the definition, and it reduces when the weights are special.' },
        { text: 'If every group has the same size, each mean is multiplied by the same number.', reasoning: 'That common factor cancels between the numerator and the denominator.' },
        { text: 'What is left is the simple average of the group means.', reasoning: 'So the shortcut is correct exactly when the groups are equal in size.' },
      ],
      answer: 'Only when the groups are equally sized — and then it is the weighted mean anyway.',
    },
  ],
  misconceptionIds: [],
  guidedPractice: [
    {
      id: 's101a.g1',
      prompt: '20 students average 70 and 30 average 80. Which is the combined mean nearer to?',
      hint: 'Which group is larger?',
      answer: '80',
      rationale: 'The larger group pulls the mean towards its own value.',
    },
    {
      id: 's101a.g2',
      prompt: 'Find that combined mean.',
      hint: 'Totals first, then divide by 50.',
      answer: '76',
      rationale: '1400 plus 2400 is 3800, over 50 students.',
    },
    {
      id: 's101a.g3',
      prompt: 'Why can two means not simply be added and halved?',
      hint: 'What quantity is actually additive here?',
      answer: 'Because totals add, not averages.',
      rationale: 'A mean has to be converted back to a total before anything can be combined.',
    },
  ],
  independentPractice: [
    {
      id: 's101a.i1',
      prompt: '15 students average 48 and 25 average 64. Find the combined mean.',
      answer: '58.',
      rationale: '720 plus 1600 is 2320, over 40 students.',
    },
    {
      id: 's101a.i2',
      prompt: 'A trader buys 8 kg of rice at 50 a kg and 12 kg at 60 a kg. Find the mean cost per kg.',
      answer: '56 rupees.',
      rationale: '400 plus 720 is 1120, over 20 kg.',
    },
    {
      id: 's101a.i3',
      prompt: 'Explain in one sentence what a weight is in a weighted mean.',
      answer: 'How much of that value there is, so it counts that many times.',
      rationale: 'The weight carries each value’s share of the whole into the answer.',
    },
  ],
  reasoningApplication: [
    {
      id: 's101a.r1',
      prompt: 'Two groups have means 50 and 90. Without computing, describe every combined mean that is possible as the group sizes vary, and say which sizes give 70.',
      expectedReasoning:
        'The combined mean can be anything strictly between 50 and 90, approaching each end as that group dominates, and equals 70 exactly when the groups are the same size. A strong answer reasons from the weights rather than from examples, and sees that the weighted mean is always between the smallest and largest value being combined.',
    },
  ],
  interactivePractice: [],
  summary:
    'Averaging group averages ignores group size and is simply the weighted mean with the wrong weights. Recover each total, add, and divide by the total weight: each value counts according to how much of it there is.',
  nextStep:
    'Next you will use the same idea where the weights are quantities in a mixture, or importance given to a component.',
  teacher: {
    objective: 'Students explain why averaging averages fails and compute weighted means.',
    prerequisiteKnowledge: ['The mean', 'Totals from means'],
    modelLanguage: ['What is the weight here?', 'Which quantity actually adds?'],
    teachingNotes: [
      'Run the two-class question cold and collect answers before any explanation. The 70 appears, and the error teaches better than a warning.',
      'Insist on recovering totals in writing every time. Students who jump to a formula cannot say what the weights mean.',
    ],
    quickChecks: ['What are the weights?', 'Nearer which group, and why?'],
    supportForStrugglingLearners: [
      'Write a two-column table of value and weight before computing.',
      'Use equal group sizes first, so the shortcut works, then change one size.',
    ],
    extension: ['Ask what happens to the combined mean as one group grows without limit.'],
    materialsNeeded: ['Exercise book'],
  },
  reviewStatus: 'authored_draft',
};

export const SECTION_10_1_MIX: AuthoredSection = {
  contentArtifactId: 'ncert_iemh2_s10_1_mixtures_lesson',
  contentArtifactVersion: 1,
  source: source('10.1', 'Combining Things', 1, 'ncert_iemh2_s10_1'),
  competencyCandidates: [],
  competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_iemh2_s10_1'],
    mayAssume: ['The weighted mean', 'Percentages', 'Multiplying by a fraction'],
    mustNotIntroduce: [{ concept: 'Data displays', belongsToSection: 'ncert_iemh2_s10_2' }],
  },
  learningGoal:
    'You will apply the weighted mean to mixtures and to marks where components carry different importance, choosing the right weights for each situation.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: ['Compute a weighted mean from values and weights.', 'Find a percentage of a quantity.', 'Say what a concentration means.'],
    ifNotReady: 'Make sure the weighted mean is fluent; this lesson is about deciding what the weights are.',
  },
  vocabulary: [
    { term: 'concentration', meaning: 'The share of a mixture that is one ingredient, usually as a percentage.' },
    { term: 'custom weight', meaning: 'A weight chosen for importance rather than counted as a quantity.' },
  ],
  explanation: [
    'Mix 2 litres of 30% juice with 3 litres of 80% juice. The result is not 55%, the average of the two, because there is more of the stronger one.',
    'The weights here are the volumes. Work in actual juice: 2 litres at 30% carries 0.6 litres of juice, and 3 litres at 80% carries 2.4. Together that is 3 litres of juice in 5 litres of mixture, which is 60%. The weighted mean gives the same answer directly: (2 times 30 + 3 times 80) divided by 5.',
    'Notice the check that makes this safe. The answer must lie between 30 and 80, and nearer the one you have more of. Any mixture answer outside that range is wrong, and the check costs nothing.',
    'Weights are not always quantities. A school may count a project as 40% of a mark and an exam as 60%. Nothing is being counted here — the weights are chosen to say what matters. A student with 90 on the project and 70 on the exam gets 0.4 times 90 plus 0.6 times 70, which is 78.',
    'That is the real content of this lesson: the arithmetic never changes, and the work is deciding what the weights are. Volumes for a mixture, counts for a combined class, assigned importance for marks. Choose them wrongly and the arithmetic will still run and still be wrong.',
  ],
  representations: ['Each ingredient’s contribution computed before the division', 'Weights as volumes in one case and as assigned importance in another'],
  visuals: [],
  visualsById: {  },
  workedExamples: [
    {
      id: 's101b.we1',
      prompt: 'Mix 2 litres of 30% juice with 3 litres of 80% juice. Find the concentration of the result.',
      steps: [
        { text: 'The weights are the volumes, 2 and 3 litres.', reasoning: 'In a mixture, how much of each you have is what decides its influence.' },
        { text: 'Contributions are 2 times 30 = 60 and 3 times 80 = 240.', reasoning: 'Each is the volume times the concentration, in the same units throughout.' },
        { text: 'Total 300, divided by the 5 litres of mixture.', reasoning: 'The weighted mean divides the total contribution by the total weight.' },
        { text: 'That is 60 per cent, which lies between 30 and 80 and nearer 80.', reasoning: 'The range check confirms the answer is of the right kind before anything else.' },
      ],
      answer: '60 per cent.',
    },
    {
      id: 's101b.we2',
      prompt: 'A project is weighted 40% and an exam 60%. A student scores 90 and 70. Find the final mark.',
      steps: [
        { text: 'The weights are assigned importance, not counts of anything.', reasoning: 'Nothing is being counted; the school has decided what each component is worth.' },
        { text: 'Contributions are 0.4 times 90 = 36 and 0.6 times 70 = 42.', reasoning: 'Each score is multiplied by its share of the final mark.' },
        { text: 'The weights already sum to 1, so the contributions are simply added.', reasoning: 'No division is needed when the weights are fractions of a whole.' },
      ],
      answer: '78.',
    },
    {
      id: 's101b.we3',
      prompt: 'A student mixes equal volumes of 20% and 60% solution and claims the result is 40%. Is the claim right?',
      steps: [
        { text: 'Equal volumes mean equal weights.', reasoning: 'This is the one case where the weights do not distinguish the two values.' },
        { text: 'With equal weights the weighted mean reduces to the simple average.', reasoning: 'The common weight cancels, as in the previous lesson.' },
        { text: 'So the result is indeed 40 per cent.', reasoning: 'The claim is right here, and would be wrong the moment the volumes differed.' },
      ],
      answer: 'Right — but only because the volumes are equal.',
    },
  ],
  misconceptionIds: [],
  guidedPractice: [
    {
      id: 's101b.g1',
      prompt: 'Mix 1 litre of 10% with 4 litres of 60%. Is the result nearer 10 or 60?',
      hint: 'Which do you have more of?',
      answer: 'Nearer 60.',
      rationale: 'Four fifths of the mixture is the stronger solution.',
    },
    {
      id: 's101b.g2',
      prompt: 'Find that concentration.',
      hint: 'Contributions, then divide by 5 litres.',
      answer: '50 per cent.',
      rationale: '10 plus 240 is 250, over 5 litres.',
    },
    {
      id: 's101b.g3',
      prompt: 'Weights of 30% and 70% are given to two components. What do the weights sum to?',
      hint: 'What fraction of the mark is covered?',
      answer: 'One whole, or 100 per cent.',
      rationale: 'Custom weights are shares of a single total mark.',
    },
  ],
  independentPractice: [
    {
      id: 's101b.i1',
      prompt: 'Mix 5 litres of 40% with 3 litres of 72%. Find the concentration.',
      answer: '52 per cent.',
      rationale: '200 plus 216 is 416, over 8 litres.',
    },
    {
      id: 's101b.i2',
      prompt: 'Components weighted 25%, 25% and 50% score 60, 80 and 90. Find the final mark.',
      answer: '80.',
      rationale: '15 plus 20 plus 45.',
    },
    {
      id: 's101b.i3',
      prompt: 'Explain why a mixture of 30% and 80% can never come out at 85%.',
      answer: 'Because a weighted mean always lies between the values combined.',
      rationale: 'No choice of positive weights pushes the answer past either end.',
    },
  ],
  reasoningApplication: [
    {
      id: 's101b.r1',
      prompt: 'In one example the weights were litres and in another they were percentages chosen by a school. Explain what the two have in common, and what you would have to decide before computing a weighted mean in a new situation.',
      expectedReasoning:
        'Both say how much each value counts towards the whole, whether measured or assigned. Before computing you must decide what plays that role and in what units, since the arithmetic is identical and will silently produce a wrong answer from wrong weights. A strong answer names choosing the weights as the mathematical decision.',
    },
  ],
  interactivePractice: [],
  summary:
    'A mixture’s concentration is the weighted mean of its parts with the volumes as weights, and marks combine the same way with assigned importance as weights. The arithmetic never changes; deciding what the weights are is the work, and the answer always lies between the values combined.',
  nextStep:
    'Next you will turn from combining numbers to displaying them, where the choice of representation does the same kind of work.',
  teacher: {
    objective: 'Students apply weighted means to mixtures and custom weights.',
    prerequisiteKnowledge: ['Weighted mean', 'Percentages'],
    modelLanguage: ['What are the weights here?', 'Is your answer between the two values?'],
    teachingNotes: [
      'The range check is cheap and catches most errors. Make it a required last line.',
      'Contrast measured weights with assigned ones explicitly; students treat all weights as counts otherwise.',
    ],
    quickChecks: ['Volumes or importance?', 'Between which two values must this lie?'],
    supportForStrugglingLearners: [
      'Compute the actual quantity of the ingredient before any formula.',
      'Tabulate value, weight and contribution in three columns.',
    ],
    extension: ['Ask what volumes of 30% and 80% would give exactly 50%.'],
    materialsNeeded: ['Exercise book'],
  },
  reviewStatus: 'authored_draft',
};

export const SECTION_10_2_BUILD: AuthoredSection = {
  contentArtifactId: 'ncert_iemh2_s10_2_build_lesson',
  contentArtifactVersion: 1,
  source: source('10.2', 'Visualising and Interpreting Data', 11, 'ncert_iemh2_s10_2'),
  competencyCandidates: [],
  competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_iemh2_s10_1'],
    mayAssume: ['Reading a table of values', 'Bar charts from earlier classes', 'Adding a column of numbers'],
    mustNotIntroduce: [{ concept: 'Choosing a display, and what it hides', belongsToSection: 'ncert_iemh2_s10_2' }],
  },
  learningGoal:
    'You will build and read clustered and stacked column displays from a table, and say which question each one answers.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: ['Read a value from a two-way table.', 'Add the entries in a column.', 'Read a scale on a vertical axis.'],
    ifNotReady: 'Make sure you can read a two-way table confidently; every display here is a picture of one.',
  },
  vocabulary: [
    { term: 'clustered columns', meaning: 'Series drawn side by side within each category, for comparing series.' },
    { term: 'stacked columns', meaning: 'Series piled up within each category, so the column height is the total.' },
    { term: 'series', meaning: 'One measured quantity shown across all the categories.' },
  ],
  explanation: [
    'Start with a table: three households, and what each spends a month on food, rent and travel. The table has every number in it, and nothing is hidden. What a display adds is the ability to see a pattern without reading each entry.',
    'Clustered columns put the three spending categories side by side within each household. Bars standing next to each other are easy to compare directly, so this display answers questions like which household spends most on food.',
    'Stacked columns pile the three on top of each other instead. Now each column’s total height is the household’s whole monthly spending, so this display answers how much each household spends altogether — a question the clustered version makes you add up by eye.',
    'Both are drawn from exactly the same table. Nothing was recomputed, nothing added. Changing how the bars are arranged changes which question is easy to answer, and that is the whole idea: a display does not contain more information than the table, it makes some of that information easier to see.',
    'Reading a display means reading its parts: the categories along the bottom, the series in the legend, the scale up the side, and the unit. A column twice as tall means twice as much only if the scale starts at zero, so checking the scale is part of reading the chart rather than a formality.',
  ],
  representations: ['The same table shown as clustered columns and as stacked columns', 'Each display labelled with the question it answers'],
  visuals: [],
  visualsById: {},
  dataSets: { spending: SPENDING },
  dataDisplays: [D_GROUPED, D_ABSOLUTE],
  workedExamples: [
    {
      id: 's102a.we1',
      prompt: 'Which household spends most on food, and which display shows it fastest?',
      steps: [
        { text: 'Food is one series, compared across three households.', reasoning: 'The question is about one series across categories, so bars of that one series must be comparable.' },
        { text: 'In the clustered display the three food bars stand separately and can be compared directly.', reasoning: 'Their bases all sit on the axis, so their heights are read against the same scale.' },
        { text: 'Banerjee’s food bar is the tallest, at 24000 rupees.', reasoning: 'Reading the value off the table confirms what the picture shows.' },
      ],
      answer: 'Banerjee, and the clustered display answers it fastest.',
    },
    {
      id: 's102a.we2',
      prompt: 'Which household spends the most overall?',
      steps: [
        { text: 'Overall spending is the total of the three series for one household.', reasoning: 'This is a question about totals, not about any single series.' },
        { text: 'The stacked display gives each total as a column height directly.', reasoning: 'Piling the series up makes the whole column the total, so no adding is needed.' },
        { text: 'Banerjee’s column is tallest, at 48000 rupees a month.', reasoning: 'Adding 24000, 18000 and 6000 from the table gives the same figure.' },
      ],
      answer: 'Banerjee, at 48000 rupees — read straight off the stacked column.',
    },
    {
      id: 's102a.we3',
      prompt: 'Why can the same table produce two displays that look so different?',
      steps: [
        { text: 'Both use identical values from the table.', reasoning: 'No recomputation happens when the arrangement changes.' },
        { text: 'Clustering places the bars side by side, so each is read against the axis separately.', reasoning: 'That arrangement makes comparing one series across categories easy.' },
        { text: 'Stacking places them end to end, so the column height becomes the sum.', reasoning: 'That arrangement makes totals easy and single-series comparison harder.' },
      ],
      answer: 'The numbers are the same; the arrangement decides which question is easy.',
    },
  ],
  misconceptionIds: [],
  guidedPractice: [
    {
      id: 's102a.g1',
      prompt: 'Which display shows a household’s total spending without adding up?',
      hint: 'Which arrangement makes the column height the total?',
      answer: 'Stacked.',
      rationale: 'Piling the series makes the whole column the sum.',
    },
    {
      id: 's102a.g2',
      prompt: 'Which display better compares travel spending across households?',
      hint: 'Which arrangement lets you compare one series directly?',
      answer: 'Clustered.',
      rationale: 'Each travel bar stands on the axis and is read against the same scale.',
    },
    {
      id: 's102a.g3',
      prompt: 'A column is twice as tall as another. Does that always mean twice the value?',
      hint: 'What would change that?',
      answer: 'Only if the scale starts at zero.',
      rationale: 'A scale beginning elsewhere makes heights misleading.',
    },
  ],
  independentPractice: [
    {
      id: 's102a.i1',
      prompt: 'From the table, find the Iyer household’s total monthly spending.',
      answer: '24000 rupees.',
      rationale: '12000 plus 9000 plus 3000.',
    },
    {
      id: 's102a.i2',
      prompt: 'Name a question the clustered display answers more easily than the stacked one.',
      answer: 'Which household spends most on rent.',
      rationale: 'Comparing one series across categories is what clustering is for.',
    },
    {
      id: 's102a.i3',
      prompt: 'Explain why both displays contain the same information.',
      answer: 'Because both are drawn from the same table without recomputation.',
      rationale: 'Arrangement changes visibility, not content.',
    },
  ],
  reasoningApplication: [
    {
      id: 's102a.r1',
      prompt: 'Both displays carry the same information, yet each makes a different question easy. Explain what that says about choosing a display, and whether any single display could make every question equally easy.',
      expectedReasoning:
        'The choice is about which relationship to put in front of the reader, not about which chart is correct. No single arrangement can privilege every comparison at once, since making totals immediate costs direct series comparison and the reverse. A strong answer frames display choice as a decision about the question being asked.',
    },
  ],
  interactivePractice: [],
  summary:
    'Clustered and stacked columns are two arrangements of one table. Clustering makes a series easy to compare across categories; stacking makes each category’s total immediate. Neither adds information, and the scale must be read before any height is interpreted.',
  nextStep:
    'Next you will meet a display that genuinely removes information, and work out what you can still conclude from it.',
  teacher: {
    objective: 'Students build and read clustered and stacked displays and match each to a question.',
    prerequisiteKnowledge: ['Reading tables', 'Bar charts'],
    modelLanguage: ['What question are you asking?', 'Which arrangement makes that easy?'],
    teachingNotes: [
      'Start from the table and keep it visible. Students who meet the chart first treat it as the data.',
      'Ask for the question before the display every time; that habit is what the next lesson needs.',
    ],
    quickChecks: ['Which display, and why?', 'Does the scale start at zero?'],
    supportForStrugglingLearners: [
      'Read three values off the table and find them in each display.',
      'Say the question aloud before choosing an arrangement.',
    ],
    extension: ['Ask which arrangement suits a dataset with many categories and two series.'],
    materialsNeeded: ['Squared paper', 'Ruler'],
  },
  reviewStatus: 'authored_draft',
};

export const SECTION_10_2_CHOOSE: AuthoredSection = {
  contentArtifactId: 'ncert_iemh2_s10_2_choose_lesson',
  contentArtifactVersion: 1,
  source: source('10.2', 'Visualising and Interpreting Data', 11, 'ncert_iemh2_s10_2'),
  competencyCandidates: [],
  competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_iemh2_s10_2'],
    mayAssume: ['Clustered and stacked displays', 'Percentages', 'Reading a legend and a scale'],
    mustNotIntroduce: [],
  },
  learningGoal:
    'You will compare a 100% stacked display with an absolute one, identify what normalisation removes, and decide which questions each display can and cannot answer.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: ['Convert a part of a total into a percentage.', 'Read a stacked column display.', 'Say what a total is in a table.'],
    ifNotReady: 'Make sure percentages are secure; the normalised display is percentages drawn as bars.',
  },
  vocabulary: [
    { term: 'normalised display', meaning: 'One where every column is scaled to the same height, showing composition as percentages.' },
    { term: 'composition', meaning: 'The share each part takes of a whole.' },
    { term: 'what a display conceals', meaning: 'Information present in the data that the display does not show.' },
  ],
  explanation: [
    'Take the same three households and scale every column to the same height, so each shows only percentages. This is the 100% stacked display, and it is the usual alternative to a pie chart for comparing composition.',
    'Something striking happens. All three households look identical — 50 per cent food, 37.5 per cent rent, 12.5 per cent travel. Their spending has exactly the same shape.',
    'But their totals are 12000, 24000 and 48000 rupees a month. The Banerjee household spends four times what the Rao household does, and in this display that difference is not merely hard to see — it is not there. Scaling each column to the same height is precisely the act of throwing the totals away.',
    'So the display answers some questions and not others. It answers what share of its spending each household puts into food, and whether two households have similar priorities. It cannot answer who spends more, or how much anyone spends, because those facts were removed when the columns were scaled. No amount of careful reading recovers them.',
    'That is the thing to take from this chapter, and it is mathematics rather than chart design. Every representation preserves some information and discards the rest. Reading a display well means knowing which is which — and a conclusion drawn from information the display does not contain is wrong however confidently it is stated.',
  ],
  representations: ['The three households as percentages, looking identical', 'The same three as absolute totals, differing fourfold'],
  visuals: [],
  visualsById: {},
  dataSets: { spending: SPENDING },
  dataDisplays: [D_NORMALISED, D_ABSOLUTE],
  workedExamples: [
    {
      id: 's102b.we1',
      prompt: 'In the normalised display, all three households look the same. What does that tell you, and what does it not?',
      steps: [
        { text: 'Equal shares mean the three have the same composition of spending.', reasoning: 'That is what the display shows, and it is a real conclusion.' },
        { text: 'Each puts half its spending into food, three eighths into rent and one eighth into travel.', reasoning: 'The percentages are readable directly from the display.' },
        { text: 'It tells you nothing about how much any of them spends.', reasoning: 'Scaling every column to the same height removed the totals from the picture entirely.' },
      ],
      answer: 'It tells you their spending has the same shape; it tells you nothing about amounts.',
    },
    {
      id: 's102b.we2',
      prompt: 'A reader concludes from the normalised display that the three households spend about the same. What is wrong?',
      steps: [
        { text: 'The conclusion is about amounts, and the display shows only shares.', reasoning: 'It uses information the display does not carry, which is the error.' },
        { text: 'The absolute display shows totals of 12000, 24000 and 48000.', reasoning: 'The amounts differ by a factor of four.' },
        { text: 'Identical percentage composition is entirely compatible with wildly different totals.', reasoning: 'Composition and magnitude are independent, which is why one display can show one and not the other.' },
      ],
      answer: 'The conclusion does not follow: equal shares say nothing about equal amounts.',
    },
    {
      id: 's102b.we3',
      prompt: 'A charity wants to show that it spends most of its money on programmes, not administration. Which display should it use?',
      steps: [
        { text: 'The claim is about shares of its spending, not about amounts.', reasoning: 'Identify what the claim actually asserts before choosing a display.' },
        { text: 'A normalised display shows exactly that composition.', reasoning: 'It is the right display for the question being asked.' },
        { text: 'But it will also hide whether the total has grown or shrunk.', reasoning: 'Choosing a display means accepting what it conceals as well as what it shows.' },
      ],
      answer: 'A normalised display answers the question asked — and a reader should know it hides the totals.',
    },
  ],
  misconceptionIds: [],
  guidedPractice: [
    {
      id: 's102b.g1',
      prompt: 'What does a 100% stacked display remove?',
      hint: 'What is the same for every column?',
      answer: 'The totals.',
      rationale: 'Scaling every column to one height discards how large each category was.',
    },
    {
      id: 's102b.g2',
      prompt: 'Two households show 50% food in a normalised display. Do they spend the same on food?',
      hint: 'Do you know their totals?',
      answer: 'Not necessarily.',
      rationale: 'Half of 12000 and half of 48000 are very different amounts.',
    },
    {
      id: 's102b.g3',
      prompt: 'Which display would you use to show that one household spends four times another?',
      hint: 'Which display keeps the totals?',
      answer: 'The absolute stacked display.',
      rationale: 'Column height is the total there, so the fourfold difference is visible.',
    },
  ],
  independentPractice: [
    {
      id: 's102b.i1',
      prompt: 'Give one question the normalised display answers and one it cannot.',
      answer: 'It answers what share goes on rent; it cannot answer who spends most.',
      rationale: 'Composition is preserved; magnitude is discarded.',
    },
    {
      id: 's102b.i2',
      prompt: 'Two companies have identical 100% stacked displays. What can you conclude?',
      answer: 'That their composition is the same, and nothing about their sizes.',
      rationale: 'The display carries proportion only.',
    },
    {
      id: 's102b.i3',
      prompt: 'Explain why a conclusion about totals drawn from a normalised display is unsound.',
      answer: 'Because the totals are not in the display at all.',
      rationale: 'The information was removed by the scaling, not merely made small.',
    },
  ],
  reasoningApplication: [
    {
      id: 's102b.r1',
      prompt: 'Construct two sets of figures that would produce identical 100% stacked displays but very different absolute ones, and say what your construction demonstrates about this kind of display.',
      expectedReasoning:
        'Any set and a multiple of it works — doubling every value leaves every share unchanged. The construction demonstrates that infinitely many datasets share one normalised display, so that display cannot determine the data. A strong answer states the many-to-one relationship rather than giving one example and stopping.',
    },
  ],
  interactivePractice: [],
  summary:
    'Scaling every column to 100% shows composition and discards the totals, so a normalised display can make very different datasets look identical. Every representation preserves some information and removes the rest, and a conclusion drawn from what a display does not carry is unsound.',
  nextStep:
    'That completes the chapter: combining numbers with weights, and choosing how to show them.',
  teacher: {
    objective: 'Students identify what normalisation removes and judge which conclusions a display supports.',
    prerequisiteKnowledge: ['Percentages', 'Stacked displays'],
    modelLanguage: ['Does the display carry that information?', 'What was removed by scaling?'],
    teachingNotes: [
      'Show the two displays of the same data together and let students notice the contradiction before explaining it.',
      'Press on unsound conclusions: ask which part of the display a claim rests on, and whether it is there.',
      'The many-to-one point is the deepest idea here and is worth stating plainly.',
    ],
    quickChecks: ['Can this display answer that?', 'What is missing from it?'],
    supportForStrugglingLearners: [
      'Keep the data table beside both displays so the totals remain available.',
      'Mark each question as answerable or not before attempting it.',
    ],
    extension: ['Ask what a pie chart conceals that a 100% stacked bar does not, and the reverse.'],
    materialsNeeded: ['Printed copies of both displays'],
  },
  reviewStatus: 'authored_draft',
};

/** Chapter 10, in the book's order. Four lessons from two sections, each
 *  section split in two. §10.1 needed no display architecture; §10.2 is
 *  the representation pilot. */
export function dataChapterSections(): AuthoredSection[] {
  return [
    SECTION_10_1_MEAN,
    SECTION_10_1_MIX,
    SECTION_10_2_BUILD,
    SECTION_10_2_CHOOSE,
  ];
}
