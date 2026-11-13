// ===========================================================================
// v0.84.0-c11.33 checkpoint 93 — CLASS 11 CHAPTER 13, STATISTICS.
//
// PHASE 0 PROVENANCE CORRECTIONS, recorded before authoring:
//   STA-07 was filed under 13.5.3. Source records show 13.5.3 is the
//          CONTINUOUS frequency distribution and 13.5.4 is the shortcut
//          method. Corrected to 13.5.4.
//   STA-06 was 13.5.2 alone, which omitted continuous grouped data. It
//          covers 13.5.2 (discrete) and 13.5.3 (continuous).
//   STA-04 was 13.4.2 alone, which omitted the ungrouped case. §13.4 is
//          organised by ungrouped (13.4.1) vs grouped (13.4.2), NOT by
//          mean vs median, so both centres occur in both subsections.
//
// The instructional split (about the mean, about the median) differs from
// the source's organisation (ungrouped, grouped). That is allowed, and the
// accounting is explicit rather than silent.
//
// Every table cell comes from one dataset. No lesson types a deviation.
// ===========================================================================

import type { AuthoredSection } from './authoredSection';
import { type L, makeLesson } from './class11Lesson';
import type { GroupedDistribution } from './groupedDistribution';
import {
  dataset, expandToObservations, groupedDispersion, mean, meanDeviationAbout,
  range, shortcutVariance, show, signedDeviationTotal, varianceOf,
} from './dispersion';

export const STA_C11_CHAPTER_ID = 'ncert_kemh1_ch13';
const BOOK = 'Mathematics, Textbook for Class XI (NCERT, Reprint 2026-27)';

const source = (sec: string, title: string, page: number, covered?: string[]) => {
  const parts = sec.split('.');
  const parent = parts.length > 2 ? parts.slice(0, 2).join('.') : sec;
  return {
    officialChapterId: STA_C11_CHAPTER_ID,
    officialSectionId: `ncert_kemh1_s${parent.replace(/\./g, '_')}`,
    ...(parts.length > 2 ? { officialSubsectionNumber: sec } : {}),
    ...(covered ? { additionalSubsectionNumbers: covered } : {}),
    sectionNumber: parent, exactTitle: title, startPage: page,
    textbook: BOOK, sourceReference: 'kemh1', inspectionDate: '2026-10-26',
  };
};

/** Which subsections each unit genuinely covers, from the Phase 0 audit. */
const COVERED: Record<string, string[]> = {
  ncert_kemh1_s13_4_md_mean_lesson: ['13.4.1', '13.4.2'],
  ncert_kemh1_s13_4_md_median_lesson: ['13.4.1', '13.4.2'],
  ncert_kemh1_s13_5_variance_sd_lesson: ['13.5.1'],
  ncert_kemh1_s13_5_grouped_variance_lesson: ['13.5.2', '13.5.3'],
};

const lesson = (l: L): AuthoredSection =>
  makeLesson(l, (sec, title, page) => source(sec, title, page, COVERED[(l as { id: string }).id]));

// --- canonical datasets, every derived value computed ---------------------
export const TEAM_A = dataset('team_a', 'Team A', [4, 4, 5, 5, 6, 6], 'runs');
export const TEAM_B = dataset('team_b', 'Team B', [1, 2, 5, 5, 8, 9], 'runs');
/** Chosen so the mean and the median genuinely differ. */
export const SKEWED = dataset('skewed', 'the wages', [3, 4, 4, 5, 20], 'thousand rupees');
export const GROUPED: GroupedDistribution = {
  id: 'sta_grouped', unitLabel: 'marks', quantity: 'marks scored', convention: 'continuous',
  intervals: [
    { lower: 0, upper: 10, frequency: 3 },
    { lower: 10, upper: 20, frequency: 5 },
    { lower: 20, upper: 30, frequency: 2 },
  ],
};
/** A discrete frequency distribution — distinct from continuous classes. */
export const DISCRETE: GroupedDistribution = {
  id: 'sta_discrete', unitLabel: 'goals', quantity: 'goals scored', convention: 'continuous',
  intervals: [
    { lower: 4, upper: 4, frequency: 3 },
    { lower: 8, upper: 8, frequency: 5 },
    { lower: 12, upper: 12, frequency: 2 },
  ],
};

export const MD_A = meanDeviationAbout(TEAM_A, 'mean');
export const MD_B = meanDeviationAbout(TEAM_B, 'mean');
export const MD_SKEW_MEAN = meanDeviationAbout(SKEWED, 'mean');
export const MD_SKEW_MEDIAN = meanDeviationAbout(SKEWED, 'median');
export const VAR_B = varianceOf(TEAM_B);
export const GROUPED_MEAN = groupedDispersion(GROUPED, 'mean');
export const SHORTCUT = shortcutVariance(GROUPED, 15);
export const EXPANDED = dataset('expanded', 'expanded', expandToObservations(GROUPED));

const sc = SHORTCUT.kind === 'computed' ? SHORTCUT : null;

export const C11_STA_SECTIONS: AuthoredSection[] = [

lesson({ id:'ncert_kemh1_s13_2_dispersion_lesson', sec:'13.2', title:'Measures of Dispersion', page:359,
 assume:['Mean, median and mode of data','Reading a frequency table'],
 notIntroduce:[['Range','ncert_kemh1_s13_3']],
 goal:'You will explain why a measure of centre alone does not describe data, and name the measures of spread.',
 checks:['Find the mean of a short list.','Read a frequency table.'], ifNot:'Revisit measures of centre; this chapter asks a different question about the same data.',
 vocab:[['dispersion','How scattered the observations are about a central value.']],
 expl:[`Earlier classes found a single number to stand for a set of data — the mean, the median, the mode. Each answers the question "where is the centre?"`,
  `That question is not the only one. Consider ${TEAM_A.label} scoring ${TEAM_A.observations.join(', ')} and ${TEAM_B.label} scoring ${TEAM_B.observations.join(', ')}.`,
  `Both have mean ${mean(TEAM_A)}. By that measure the two are identical. But they are not: ${TEAM_A.label}'s scores sit close together, while ${TEAM_B.label}'s run from ${range(TEAM_B).min} to ${range(TEAM_B).max}.`,
  `The centre is the same and the data is plainly different, so a measure of centre has left something out. What it leaves out is the scatter — how far the observations lie from that centre.`,
  `That scatter is called dispersion, and this chapter measures it. The source names four measures: range, quartile deviation, mean deviation and standard deviation. This chapter studies the range, the mean deviation and the standard deviation.`,
  `Each works the same way in outline: pick a central value, see how far the observations fall from it, and summarise those distances in one number. The measures differ in how they do that last step, and the differences matter.`],
 rep:['The two sets of scores shown against their common mean'],
 we:[{id:'s132.we1',prompt:`Find the mean of each team's scores and compare the two sets.`,steps:[[`${TEAM_A.label}: ${TEAM_A.observations.join(' + ')} divided by ${TEAM_A.observations.length}.`,`That gives ${mean(TEAM_A)}.`],[`${TEAM_B.label}: the same calculation gives ${mean(TEAM_B)}.`,'The two means are equal.'],['But the scores themselves are clearly different.','So the mean alone has not described the data.']],answer:`Both have mean ${mean(TEAM_A)}, yet the sets differ.`},
  {id:'s132.we2',prompt:'Why is a measure of centre on its own not enough?',steps:[['A centre says where the data sits.','It says nothing about how tightly it clusters there.'],['Two sets can share a centre and be scattered quite differently.','The teams above are exactly that case.'],['So a second kind of measure is needed, describing spread.','That is what dispersion measures.']],answer:'Because two different sets can share the same centre.'},
  {id:'s132.we3',prompt:'Name the measures of dispersion this chapter studies.',steps:[['The source lists four measures in all.','Range, quartile deviation, mean deviation and standard deviation.'],['This chapter takes three of them.','Quartile deviation is left to later work.'],['So: range, mean deviation and standard deviation.','Each summarises distance from a centre differently.']],answer:'Range, mean deviation and standard deviation.'}],
 g:[{id:'s132.g1',prompt:'What does dispersion measure?',hint:'Centre, or scatter?',answer:'How scattered the observations are about a central value.',why:'It is the second question, after where the centre is.'},
  {id:'s132.g2',prompt:'Can two data sets have the same mean but differ?',hint:'Think of the two teams.',answer:'Yes.',why:'The mean fixes the centre, not the spread.'},
  {id:'s132.g3',prompt:'Does a larger mean imply a larger spread?',hint:'Are they the same quantity?',answer:'No.',why:'Centre and spread are independent descriptions.'}],
 i:[{id:'s132.i1',prompt:'Two sets both have mean 10. Must they be identical?',answer:'No.',why:'They may be scattered quite differently about 10.'},
  {id:'s132.i2',prompt:'Which team above is more consistent?',answer:TEAM_A.label,why:'Its scores lie closer to the common mean.'},
  {id:'s132.i3',prompt:'Name two measures of dispersion.',answer:'Range and standard deviation.',why:'Both summarise distance from a centre.'},
  {id:'s132.i4',prompt:'Is the mode a measure of dispersion?',answer:'No.',why:'It is a measure of centre.'}],
 td:[{id:'s132.td1',prompt:'Why was a measure of centre taught first if it is not enough on its own?',reasoning:'Because dispersion is defined relative to a centre and cannot be measured without one. Every measure in this chapter asks how far the observations lie from some central value, so the centre is not superseded but used — it becomes the reference point rather than the whole answer. The order is therefore not a false start corrected later; it is the first half of a description whose second half only makes sense once the first exists.'}],
 summary:`Two data sets can share a centre and still differ: ${TEAM_A.label} and ${TEAM_B.label} both have mean ${mean(TEAM_A)}, yet one clusters and the other spreads. Dispersion measures that scatter about a central value. The source names range, quartile deviation, mean deviation and standard deviation; this chapter studies the first, third and fourth.`,
 next:'Next you will measure spread with the simplest measure of all.',
 t:['Explain why centre alone is insufficient and name the measures of dispersion.',['Measures of centre'],['"how far from the centre", as the shape of every measure here'],['Show two sets with equal means before naming any measure; the need has to be felt first.','Avoid formulas entirely in this lesson — it exists to pose the question.'],['Ask whether equal means force equal data.'],['Compare two sets before measuring either.'],['Ask what the centre leaves out.']]} as unknown as L),

lesson({ id:'ncert_kemh1_s13_3_range_lesson', sec:'13.3', title:'Range', page:360,
 prereq:['ncert_kemh1_s13_2'], assume:['Measures of dispersion','Maximum and minimum'],
 goal:'You will compute the range of a data set and state its limitation.',
 checks:['Find the largest and smallest of a list.','Subtract two numbers.'], ifNot:'Revisit the previous lesson; the range is the first measure of spread.',
 vocab:[['range','The difference between the largest and smallest observations.']],
 expl:[`The simplest way to summarise spread is to take the distance between the two extremes. That is the range: the largest observation minus the smallest.`,
  `For ${TEAM_A.label}, scoring ${TEAM_A.observations.join(', ')}, the largest is ${range(TEAM_A).max} and the smallest ${range(TEAM_A).min}, so the range is ${range(TEAM_A).value}.`,
  `For ${TEAM_B.label} it is ${range(TEAM_B).max} − ${range(TEAM_B).min} = ${range(TEAM_B).value}. The larger range matches the impression that ${TEAM_B.label}'s scores are more scattered.`,
  `The range is easy to find and easy to understand, and for a quick comparison it is often enough.`,
  `But it uses only two observations and ignores every other one. Two sets can share the same smallest value, the same largest value and therefore the same range, while everything in between is arranged quite differently.`,
  `So the range detects whether the extremes are far apart, and nothing else. A single unusually high or low observation changes it completely, while a change among the middle observations does not move it at all.`,
  `That is why the chapter does not stop here. The measures that follow use every observation, not just two.`],
 rep:['The observations on a line with the two extremes marked'],
 we:[{id:'s133.we1',prompt:`Find the range of ${TEAM_B.label}'s scores.`,steps:[[`The scores are ${TEAM_B.observations.join(', ')}.`,'Find the extremes.'],[`The largest is ${range(TEAM_B).max} and the smallest is ${range(TEAM_B).min}.`,'Only these two are used.'],[`The range is ${range(TEAM_B).max} − ${range(TEAM_B).min} = ${range(TEAM_B).value}.`,`In ${TEAM_B.unit}, the same unit as the data.`]],answer:String(range(TEAM_B).value)},
  {id:'s133.we2',prompt:`Compare the ranges of the two teams.`,steps:[[`${TEAM_A.label} has range ${range(TEAM_A).value}.`,'Its extremes are close together.'],[`${TEAM_B.label} has range ${range(TEAM_B).value}.`,'Its extremes are far apart.'],['So the range agrees that the second set is more scattered.','One number, from two observations.']],answer:`${range(TEAM_A).value} against ${range(TEAM_B).value}`},
  {id:'s133.we3',prompt:'Why is the range an incomplete measure of spread?',steps:[['It uses only the largest and smallest observations.','Everything between them is ignored.'],['Two sets can share both extremes and differ completely inside.','Their ranges would be equal.'],['So the range cannot tell them apart.','A measure using every observation can.']],answer:'Because it depends only on the two extreme observations.'}],
 g:[{id:'s133.g1',prompt:'How is the range calculated?',hint:'Two observations.',answer:'Largest minus smallest.',why:'It is the distance between the extremes.'},
  {id:'s133.g2',prompt:'How many observations does the range use?',hint:'Count them.',answer:'Two.',why:'Only the maximum and the minimum.'},
  {id:'s133.g3',prompt:'What unit does the range have?',hint:'Same as the data?',answer:'The same unit as the observations.',why:'It is a difference of two observations.'}],
 i:[{id:'s133.i1',prompt:'Find the range of 3, 7, 7, 11.',answer:'8.',why:'11 − 3, using only the extremes.'},
  {id:'s133.i2',prompt:'Does changing a middle observation change the range?',answer:'No.',why:'The range depends only on the largest and smallest.'},
  {id:'s133.i3',prompt:'What is the range when every observation is equal?',answer:'0.',why:'The largest and smallest are the same value.'},
  {id:'s133.i4',prompt:'Can two different data sets have the same range?',answer:'Yes.',why:'They need only share their extremes.'}],
 td:[{id:'s133.td1',prompt:'If the range is so easily misled, why measure it at all?',reasoning:'Because it answers one question exactly, and cheaply: how far apart are the extremes? For quality control, for checking whether a reading is out of bounds, for a first glance at whether two sets are remotely comparable, that is the question being asked, and no more elaborate measure answers it better. The error is not using the range but reading it as a summary of the whole data when it was never looking at the whole data. Knowing precisely which two numbers a measure consulted is what tells you what it can and cannot be asked.'}],
 summary:`The range is the largest observation minus the smallest: ${range(TEAM_A).value} for ${TEAM_A.label} and ${range(TEAM_B).value} for ${TEAM_B.label}. It is quick and in the same unit as the data, but it uses only two observations, so two sets sharing their extremes have equal ranges however differently they are arranged inside.`,
 next:'Next you will measure spread using every observation.',
 t:['Compute the range and state its dependence on the extremes.',['Measures of dispersion'],['"only two observations", said whenever the range is computed'],['Show two sets with equal range and different interiors; the limitation must be seen, not stated.','Keep the unit attached — the range is in the data\u2019s own unit.'],['Ask whether a middle observation affects it.'],['Identify the extremes before subtracting.'],['Ask when the range is still the right measure.']]} as unknown as L),

lesson({ id:'ncert_kemh1_s13_4_md_mean_lesson', sec:'13.4', title:'Mean Deviation', page:361,
 prereq:['ncert_kemh1_s13_3'], assume:['Range','Mean of data','Absolute value'],
 goal:'You will compute the mean deviation about the mean for ungrouped and grouped data.',
 checks:['Find the mean of a list.','Take the absolute value of a negative number.'], ifNot:'Revisit the mean and absolute value; both are used in every row here.',
 vocab:[['deviation','The difference between an observation and a central value.'],
  ['mean deviation','The mean of the absolute deviations about a central value.']],
 expl:[`The range looked at two observations. To use all of them, measure how far each one lies from a central value and then average those distances.`,
  `Take ${TEAM_B.label}'s scores ${TEAM_B.observations.join(', ')}, whose mean is ${MD_B.centreValue}. The deviations x − mean are ${MD_B.rows.map((r) => r.deviation).join(', ')}.`,
  `Adding those deviations gives ${signedDeviationTotal(TEAM_B, 'mean')}. That is not an accident and not a feature of this data: the deviations about the mean always total zero, because the mean sits exactly where the positive and negative deviations balance.`,
  `So averaging the deviations as they stand would report every data set as having no spread at all. The distances have to be taken without their signs.`,
  `Taking absolute values gives ${MD_B.rows.map((r) => r.absolute).join(', ')}, totalling ${MD_B.totalAbsolute}. Dividing by the ${MD_B.rows.length} observations gives a mean deviation of ${show(MD_B.value)}.`,
  `Comparing with ${TEAM_A.label}, whose mean deviation is ${show(MD_A.value)}, the measure now distinguishes the two sets the mean could not — and unlike the range it has consulted every observation.`,
  `For grouped data the idea is unchanged, but each class stands for several observations, so its deviation is weighted by its frequency. With classes ${GROUPED.intervals.map((i) => `${i.lower}–${i.upper}`).join(', ')} and frequencies ${GROUPED.intervals.map((i) => i.frequency).join(', ')}, the mean is ${GROUPED_MEAN.centreValue} and the mean deviation is ${show(GROUPED_MEAN.meanDeviation)}.`,
  `Without the frequency weighting a class holding ${Math.max(...GROUPED.intervals.map((i) => i.frequency))} observations would count the same as one holding ${Math.min(...GROUPED.intervals.map((i) => i.frequency))}, which would describe a different data set entirely.`],
 rep:['A table of observations, deviations and absolute deviations, with frequencies where grouped'],
 we:[{id:'s134a.we1',prompt:`Find the mean deviation about the mean for ${TEAM_B.observations.join(', ')}.`,steps:[[`The mean is ${MD_B.centreValue}.`,'The central value comes first.'],[`The absolute deviations are ${MD_B.rows.map((r) => r.absolute).join(', ')}, totalling ${MD_B.totalAbsolute}.`,'Signs are dropped so the distances do not cancel.'],[`Dividing by ${MD_B.rows.length} gives ${show(MD_B.value)}.`,'The average distance from the mean.']],answer:show(MD_B.value)},
  {id:'s134a.we2',prompt:'Show that the signed deviations about the mean total zero.',steps:[[`The deviations are ${MD_B.rows.map((r) => r.deviation).join(', ')}.`,'Some positive, some negative.'],[`Their total is ${signedDeviationTotal(TEAM_B, 'mean')}.`,'The positives and negatives balance exactly.'],['This happens for every data set, which is why absolute values are needed.','Otherwise every mean deviation would be zero.']],answer:'0, for every data set.'},
  {id:'s134a.we3',prompt:`Find the mean deviation about the mean for the grouped data.`,steps:[[`The class marks are ${GROUPED_MEAN.rows.map((r) => r.x).join(', ')} with frequencies ${GROUPED_MEAN.rows.map((r) => r.f).join(', ')}, giving mean ${GROUPED_MEAN.centreValue}.`,'The class mark stands for its class.'],[`Each absolute deviation is multiplied by its frequency: ${GROUPED_MEAN.rows.map((r) => r.weightedAbsolute).join(', ')}.`,'The weighting is what makes a class count for all its observations.'],[`The total ${GROUPED_MEAN.totalWeightedAbsolute} divided by ${GROUPED_MEAN.totalFrequency} gives ${show(GROUPED_MEAN.meanDeviation)}.`,'The denominator is the total frequency, not the number of classes.']],answer:show(GROUPED_MEAN.meanDeviation)}],
 g:[{id:'s134a.g1',prompt:'Why are absolute values used?',hint:'What do signed deviations total?',answer:'Because the signed deviations about the mean always total zero.',why:'Without absolute values every data set would appear to have no spread.'},
  {id:'s134a.g2',prompt:'What is divided by what, for grouped data?',hint:'Which denominator?',answer:'The total weighted absolute deviation by the total frequency.',why:'Each class counts for as many observations as it holds.'},
  {id:'s134a.g3',prompt:'How many observations does the mean deviation use?',hint:'Compare with the range.',answer:'All of them.',why:'Every observation contributes its own distance.'}],
 i:[{id:'s134a.i1',prompt:'Find the mean deviation about the mean for 2, 4, 6.',answer:'4/3, about 1.33.',why:'The mean is 4 and the absolute deviations are 2, 0, 2.'},
  {id:'s134a.i2',prompt:'A student adds the signed deviations and gets 0. What went wrong?',answer:'The absolute values were not taken.',why:'Signed deviations about the mean always cancel.'},
  {id:'s134a.i3',prompt:'For grouped data, what represents each class?',answer:'Its class mark.',why:'The midpoint stands for the observations in that class.'},
  {id:'s134a.i4',prompt:'What is the mean deviation when all observations are equal?',answer:'0.',why:'Every observation sits at the centre, so every distance is zero.'}],
 td:[{id:'s134a.td1',prompt:'The signed deviations cancelling looks like an inconvenience. Is it telling us something instead?',reasoning:'It is telling us exactly what the mean is. The mean is the one value about which the deviations balance, so the total coming to zero is not a nuisance to be worked around but the defining property of the centre we chose. Once that is clear the absolute value stops looking like a patch: we are not repairing a broken calculation, we are asking a different question. The signed total asks where the balance point is, and we already know. The absolute total asks how far things sit from it, which is the question this chapter is actually about.'}],
 summary:`Mean deviation averages the distances of all observations from a central value. The signed deviations about the mean always total zero — ${signedDeviationTotal(TEAM_B, 'mean')} here — so absolute values are taken: ${TEAM_B.label} gives ${show(MD_B.value)} against ${TEAM_A.label}'s ${show(MD_A.value)}. For grouped data each class's absolute deviation is weighted by its frequency, giving ${show(GROUPED_MEAN.meanDeviation)}.`,
 next:'Next you will take the same measure about a different centre.',
 t:['Compute mean deviation about the mean, ungrouped and grouped, with absolute values.',['Mean','Absolute value'],['"the distances, not the differences"'],['Add the signed deviations aloud and get zero before introducing the absolute value; the need must be demonstrated.','Insist the grouped denominator is the total frequency, not the class count.'],['Ask what the signed deviations total.'],['Find the centre before any deviation.'],['Ask why the range needed replacing.']]} as unknown as L),

lesson({ id:'ncert_kemh1_s13_4_md_median_lesson', sec:'13.4', title:'Mean Deviation', page:364,
 prereq:['ncert_kemh1_s13_4_md_mean'], assume:['Mean deviation about the mean','Median of data'],
 goal:'You will compute the mean deviation about the median for ungrouped and grouped data.',
 checks:['Find the median of a list.','Compute a mean deviation about the mean.'], ifNot:'Revisit the previous lesson; only the central value changes here.',
 vocab:[],
 expl:[`The mean is not the only central value available. The median — the middle observation once they are ordered — can serve as the centre instead.`,
  `Nothing else about the calculation changes. Find the centre, take the absolute deviations from it, and average them. Only the centre is different.`,
  `Take the wages ${SKEWED.observations.join(', ')} in ${SKEWED.unit}. The mean is ${show(MD_SKEW_MEAN.centreValue)} and the median is ${MD_SKEW_MEDIAN.centreValue}, because one unusually large value pulls the mean upward while the middle observation stays put.`,
  `About the mean, the absolute deviations are ${MD_SKEW_MEAN.rows.map((r) => show(r.absolute)).join(', ')}, giving a mean deviation of ${show(MD_SKEW_MEAN.value)}.`,
  `About the median they are ${MD_SKEW_MEDIAN.rows.map((r) => show(r.absolute)).join(', ')}, giving ${show(MD_SKEW_MEDIAN.value)}. The same data gives two different answers, because they answer two different questions.`,
  `Neither is wrong. Each reports the average distance from the centre it was given, so the centre must be stated along with the answer — "mean deviation" on its own does not say which.`,
  `For grouped data the median is found from the distribution and the same frequency weighting applies, exactly as it did about the mean.`,
  `One observation is worth noticing: the mean deviation about the median here is the smaller of the two. For absolute distances the median is the centre that minimises them, which is part of why the source treats it as worth computing.`],
 rep:['A deviation table with the chosen centre named at its head'],
 we:[{id:'s134b.we1',prompt:`Find the median of ${SKEWED.observations.join(', ')}.`,steps:[['Order the observations.','They are already in order.'],[`There are ${SKEWED.observations.length}, so the middle one is the ${Math.ceil(SKEWED.observations.length / 2)}th.`,'An odd count has a single middle observation.'],[`That is ${MD_SKEW_MEDIAN.centreValue}.`,`Well below the mean of ${show(MD_SKEW_MEAN.centreValue)}, which the large value pulled up.`]],answer:String(MD_SKEW_MEDIAN.centreValue)},
  {id:'s134b.we2',prompt:'Find the mean deviation about the median for the same wages.',steps:[[`The median is ${MD_SKEW_MEDIAN.centreValue}.`,'The centre comes first, as always.'],[`The absolute deviations are ${MD_SKEW_MEDIAN.rows.map((r) => show(r.absolute)).join(', ')}, totalling ${show(MD_SKEW_MEDIAN.totalAbsolute)}.`,'Distances from the median, not the mean.'],[`Dividing by ${MD_SKEW_MEDIAN.rows.length} gives ${show(MD_SKEW_MEDIAN.value)}.`,`Against ${show(MD_SKEW_MEAN.value)} about the mean.`]],answer:show(MD_SKEW_MEDIAN.value)},
  {id:'s134b.we3',prompt:'Why do the two answers differ?',steps:[['The two centres are different numbers.','The mean is pulled by the large observation; the median is not.'],['Distances are measured from the centre given.','Different centre, different distances.'],['So the centre must be stated with the answer.','"Mean deviation" alone is ambiguous.']],answer:'Because they measure distance from different central values.'}],
 g:[{id:'s134b.g1',prompt:'What changes between the two mean deviations?',hint:'Only one thing.',answer:'The central value.',why:'The rest of the calculation is identical.'},
  {id:'s134b.g2',prompt:'Why is the median not pulled by one large observation?',hint:'What does it depend on?',answer:'Because it depends on position, not size.',why:'The middle observation stays middle however large the extreme is.'},
  {id:'s134b.g3',prompt:'Must the centre be stated with the answer?',hint:'Is one answer enough?',answer:'Yes.',why:'The same data gives different mean deviations about different centres.'}],
 i:[{id:'s134b.i1',prompt:'Find the median of 2, 5, 9.',answer:'5.',why:'The middle observation of three, in order.'},
  {id:'s134b.i2',prompt:'Find the median of 2, 4, 6, 10.',answer:'5.',why:'With an even count it is the mean of the middle two.'},
  {id:'s134b.i3',prompt:'Can mean deviation about the mean and about the median be equal?',answer:'Yes.',why:'When the mean and median coincide, so do the two answers.'},
  {id:'s134b.i4',prompt:'A student reports "mean deviation 3.6". What is missing?',answer:'Which centre it is about.',why:'The answer depends on the central value used.'}],
 td:[{id:'s134b.td1',prompt:'Why keep two versions of the same measure rather than settling on one centre?',reasoning:'Because the two centres describe different things about the data, and which is wanted depends on the question. The mean accounts for the size of every observation, so a single extreme value moves it; the median counts positions, so it does not. Where the extreme is a genuine part of what is being measured the mean is the honest centre; where it is an outlier distorting a typical picture the median is. Fixing on one centre would be deciding that question in advance for all data, which no measure should do. It is the same reason the chapter keeps the range even after better measures arrive.'}],
 summary:`Mean deviation about the median is the same calculation with a different centre. For the wages ${SKEWED.observations.join(', ')} the mean is ${show(MD_SKEW_MEAN.centreValue)} but the median is ${MD_SKEW_MEDIAN.centreValue}, giving ${show(MD_SKEW_MEAN.value)} about the mean and ${show(MD_SKEW_MEDIAN.value)} about the median. The centre must be stated with the answer.`,
 next:'Next you will handle the cancelling deviations a different way.',
 t:['Compute mean deviation about the median and explain why the centre matters.',['Median','Mean deviation'],['"about which centre?", asked of every answer'],['Use data whose mean and median genuinely differ, or the lesson\u2019s point cannot be seen.','Change only the centre when moving from the previous lesson — the algorithm is the same.'],['Ask what is missing from an unqualified answer.'],['Find the median before any deviation.'],['Ask why one extreme moves the mean but not the median.']]} as unknown as L),


lesson({ id:'ncert_kemh1_s13_5_variance_sd_lesson', sec:'13.5', title:'Variance and Standard Deviation', page:367,
 prereq:['ncert_kemh1_s13_4_md_mean'], assume:['Mean deviation','Squaring numbers','Square roots'],
 goal:'You will compute the variance and standard deviation of ungrouped data and explain why deviations are squared.',
 checks:['Square a negative number.','Find a square root.'], ifNot:'Revisit squaring; a squared deviation is never negative, which is the whole idea here.',
 vocab:[['variance','The mean of the squared deviations about the mean, written σ².'],
  ['standard deviation','The square root of the variance, written σ.']],
 expl:[`Absolute values solved the cancelling problem, but they are awkward to work with algebraically. There is another way to make a deviation non-negative: square it.`,
  `A square is never negative, so squared deviations cannot cancel — and unlike the absolute value, squaring is a smooth operation that later mathematics can handle easily.`,
  `Take ${TEAM_B.label}'s scores ${TEAM_B.observations.join(', ')}, with mean ${VAR_B.mean}. The deviations are ${VAR_B.rows.map((r) => r.deviation).join(', ')} and their squares ${VAR_B.rows.map((r) => r.squared).join(', ')}.`,
  `The squares total ${VAR_B.totalSquared}. Dividing by the number of observations, ${VAR_B.denominator}, gives the variance: ${show(VAR_B.variance)}.`,
  `The denominator is n, the number of observations. This is descriptive statistics — the data in hand is all the data there is, and every observation is divided among.`,
  `There is a cost to squaring. If the scores are in ${TEAM_B.unit}, the squared deviations are in ${TEAM_B.unit} squared, so the variance is too. A spread measured in squared units cannot be compared against the data directly.`,
  `Taking the square root undoes that. The standard deviation is √${show(VAR_B.variance)} = ${show(VAR_B.standardDeviation)}, back in ${TEAM_B.unit} — the same unit as the observations and as the mean.`,
  `So variance and standard deviation are not two measures but one, reported in two units. The variance is where the arithmetic happens; the standard deviation is what can be compared with the data.`],
 rep:['A table of observations, deviations and squared deviations, with the totals beneath'],
 we:[{id:'s135.we1',prompt:`Find the variance of ${TEAM_B.observations.join(', ')}.`,steps:[[`The mean is ${VAR_B.mean}.`,'Deviations are measured from it.'],[`The squared deviations are ${VAR_B.rows.map((r) => r.squared).join(', ')}, totalling ${VAR_B.totalSquared}.`,'Squaring removes the signs without absolute values.'],[`Dividing by ${VAR_B.denominator} gives ${show(VAR_B.variance)}.`,'The denominator is the number of observations.']],answer:show(VAR_B.variance)},
  {id:'s135.we2',prompt:'Find the standard deviation of the same scores.',steps:[[`The variance is ${show(VAR_B.variance)}.`,'In squared units.'],['Take its square root.','This returns the measure to the original unit.'],[`That gives ${show(VAR_B.standardDeviation)} ${TEAM_B.unit}.`,'Now comparable with the scores themselves.']],answer:show(VAR_B.standardDeviation)},
  {id:'s135.we3',prompt:'Why square the deviations rather than take absolute values?',steps:[['Both stop the deviations cancelling.','Either would serve that purpose.'],['But squaring is smooth and behaves well under algebra, while the absolute value is not.','That matters for everything built on this measure later.'],['The price is squared units, and the square root pays it back.','Hence variance and standard deviation as a pair.']],answer:'Because squaring prevents cancellation and is easier to work with algebraically.'}],
 g:[{id:'s135.g1',prompt:'What is the variance?',hint:'Mean of what?',answer:'The mean of the squared deviations about the mean.',why:'Each deviation is squared, then averaged.'},
  {id:'s135.g2',prompt:'What unit does the variance have?',hint:'Deviations were squared.',answer:'The square of the data\u2019s unit.',why:'Squaring the deviations squares the unit too.'},
  {id:'s135.g3',prompt:'How is the standard deviation obtained?',hint:'Undo the squaring.',answer:'By taking the square root of the variance.',why:'That returns the measure to the original unit.'}],
 i:[{id:'s135.i1',prompt:'Find the variance of 2, 4, 6.',answer:'8/3, about 2.67.',why:'The mean is 4 and the squared deviations are 4, 0, 4.'},
  {id:'s135.i2',prompt:'Can a variance be negative?',answer:'No.',why:'It is an average of squares, which are never negative.'},
  {id:'s135.i3',prompt:'What is the standard deviation when all observations are equal?',answer:'0.',why:'Every deviation is zero, so the variance is zero.'},
  {id:'s135.i4',prompt:'If the data is in metres, what unit has the standard deviation?',answer:'Metres.',why:'The square root undoes the squaring of the unit.'}],
 td:[{id:'s135.td1',prompt:'Mean deviation and standard deviation both measure spread with every observation. Why does the chapter need both?',reasoning:'Because they handle the cancelling problem differently, and that difference has consequences. The absolute value is the more direct answer to "how far on average?" and is easier to explain, but it resists algebra: there is no clean way to expand or combine absolute values. Squaring is less intuitive as a notion of distance, yet it opens into everything that follows, which is why standard deviation rather than mean deviation became the standard measure. Teaching both shows that the choice was a choice, made for reasons, rather than a formula handed down.'}],
 summary:`Squaring the deviations prevents cancellation without absolute values. The variance is the mean of the squared deviations — ${VAR_B.totalSquared} divided by ${VAR_B.denominator} gives ${show(VAR_B.variance)} — and the denominator is n, the number of observations. Variance carries the square of the data's unit, so the standard deviation, √${show(VAR_B.variance)} = ${show(VAR_B.standardDeviation)}, returns it to ${TEAM_B.unit}.`,
 next:'Next you will do the same for data given as a frequency distribution.',
 t:['Compute variance and standard deviation, and explain squaring and the square root.',['Mean deviation','Squares and roots'],['"squares cannot cancel", as the reason for squaring'],['Carry the unit through: squared units are what makes the square root necessary, not a formality.','Say the denominator is n and why — this is descriptive statistics, not a sample estimate.'],['Ask whether a variance can be negative.'],['Square each deviation before totalling.'],['Ask why both measures exist.']]} as unknown as L),

lesson({ id:'ncert_kemh1_s13_5_grouped_variance_lesson', sec:'13.5', title:'Variance and Standard Deviation', page:370,
 prereq:['ncert_kemh1_s13_5_variance_sd'], assume:['Variance and standard deviation','Frequency distributions','Class marks'],
 goal:'You will compute the variance and standard deviation of a frequency distribution.',
 checks:['Find a class mark.','Compute a variance for ungrouped data.'], ifNot:'Revisit the previous lesson and class marks; both are used in every row.',
 vocab:[['discrete frequency distribution','Data given as distinct values with their frequencies.'],
  ['continuous frequency distribution','Data given as class intervals with their frequencies.']],
 expl:[`Data often arrives already summarised, as values or classes with frequencies rather than a list of observations. The measure is unchanged; the bookkeeping differs.`,
  `The source treats two forms separately. A discrete frequency distribution lists distinct values — ${DISCRETE.intervals.map((i) => i.lower).join(', ')} with frequencies ${DISCRETE.intervals.map((i) => i.frequency).join(', ')} — where each value is exact.`,
  `A continuous frequency distribution lists class intervals such as ${GROUPED.intervals.map((i) => `${i.lower}–${i.upper}`).join(', ')}. Here the individual observations are not known, so each class is represented by its class mark, the midpoint.`,
  `That difference is real and worth keeping. In the discrete case the value is the observation; in the continuous case the class mark is a stand-in for observations that could be anywhere in the class.`,
  `The arithmetic from there is the same in both. Each row contributes its squared deviation multiplied by its frequency, because the row stands for that many observations.`,
  `For the classes above: the mean is ${GROUPED_MEAN.centreValue}, the squared deviations are ${GROUPED_MEAN.rows.map((r) => r.squared).join(', ')}, and weighted by frequency they give ${GROUPED_MEAN.rows.map((r) => r.weightedSquared).join(', ')}, totalling ${GROUPED_MEAN.totalWeightedSquared}.`,
  `Dividing by the total frequency ${GROUPED_MEAN.totalFrequency} gives a variance of ${show(GROUPED_MEAN.variance)}, and the standard deviation is ${show(GROUPED_MEAN.standardDeviation)}.`,
  `A check worth making: writing out all ${GROUPED_MEAN.totalFrequency} observations that the distribution stands for, and computing the variance directly from that list, gives ${show(varianceOf(EXPANDED).variance)} — the same number. The frequency formula is a shortcut for exactly that longer calculation.`],
 rep:['A grouped table with class marks, frequencies, deviations, squared deviations and weighted squares'],
 we:[{id:'s135g.we1',prompt:`Find the variance of the distribution with classes ${GROUPED.intervals.map((i) => `${i.lower}–${i.upper}`).join(', ')}.`,steps:[[`The class marks are ${GROUPED_MEAN.rows.map((r) => r.x).join(', ')}, giving mean ${GROUPED_MEAN.centreValue}.`,'Each class is represented by its midpoint.'],[`The weighted squared deviations are ${GROUPED_MEAN.rows.map((r) => r.weightedSquared).join(', ')}, totalling ${GROUPED_MEAN.totalWeightedSquared}.`,'Each squared deviation counts once per observation in its class.'],[`Dividing by ${GROUPED_MEAN.totalFrequency} gives ${show(GROUPED_MEAN.variance)}.`,`The standard deviation is ${show(GROUPED_MEAN.standardDeviation)}.`]],answer:show(GROUPED_MEAN.variance)},
  {id:'s135g.we2',prompt:'Check the grouped answer against the observations it stands for.',steps:[[`The distribution stands for ${GROUPED_MEAN.totalFrequency} observations: ${EXPANDED.observations.join(', ')}.`,'Each class mark repeated as often as its frequency.'],['Computing the variance of that list directly, as ungrouped data.','No frequency formula is used.'],[`It gives ${show(varianceOf(EXPANDED).variance)}, matching the grouped result.`,'The frequency formula is the same calculation, organised.']],answer:show(varianceOf(EXPANDED).variance)},
  {id:'s135g.we3',prompt:'Why must each squared deviation be multiplied by its frequency?',steps:[['A row stands for several observations, not one.','Its frequency says how many.'],['Each of those observations contributes the same squared deviation.','So the row contributes that square as many times.'],['Omitting the weighting would count a class of 5 the same as a class of 1.','That describes different data.']],answer:'Because each row represents as many observations as its frequency.'}],
 g:[{id:'s135g.g1',prompt:'What represents a class in a continuous distribution?',hint:'The midpoint.',answer:'Its class mark.',why:'The individual observations in the class are not known.'},
  {id:'s135g.g2',prompt:'What is the denominator for a frequency distribution?',hint:'Observations or classes?',answer:'The total frequency.',why:'That is how many observations there are.'},
  {id:'s135g.g3',prompt:'How does a discrete distribution differ from a continuous one?',hint:'What is in each row?',answer:'It lists exact values rather than class intervals.',why:'In the discrete case no midpoint stand-in is needed.'}],
 i:[{id:'s135g.i1',prompt:'What is the class mark of 20–30?',answer:'25.',why:'The midpoint of the interval.'},
  {id:'s135g.i2',prompt:'A class of frequency 4 has squared deviation 9. What does it contribute?',answer:'36.',why:'The squared deviation counts once per observation.'},
  {id:'s135g.i3',prompt:'Should the variance change if the rows are listed in a different order?',answer:'No.',why:'Every row contributes the same amount whatever its position.'},
  {id:'s135g.i4',prompt:'Is a class mark an actual observation?',answer:'Not necessarily.',why:'It stands for observations spread across the class.'}],
 td:[{id:'s135g.td1',prompt:'The class mark is usually not an observation anyone recorded. Why is it safe to compute with?',reasoning:'Because it is the best single stand-in available once the individual values are gone, and the errors it introduces tend to offset. Observations above the midpoint in one class are balanced by those below it, so across the distribution the substitution distorts less than it might appear. It is still an approximation, and that is worth being honest about: the grouped variance is the variance of a reconstructed data set, not of the original one. The expanded-data check in this lesson shows the formula is doing exactly what it claims — the approximation lies in the grouping itself, not in the arithmetic.'}],
 summary:`For a frequency distribution each row's squared deviation is weighted by its frequency, and the total is divided by the total frequency: ${GROUPED_MEAN.totalWeightedSquared} over ${GROUPED_MEAN.totalFrequency} gives ${show(GROUPED_MEAN.variance)}, with standard deviation ${show(GROUPED_MEAN.standardDeviation)}. A discrete distribution lists exact values; a continuous one lists classes represented by their class marks. Writing out all ${GROUPED_MEAN.totalFrequency} observations gives the same variance.`,
 next:'Next you will reach the same answer with less arithmetic.',
 t:['Compute variance and standard deviation for discrete and continuous frequency distributions.',['Variance','Class marks'],['"once per observation", said of every frequency weighting'],['Expand a small distribution into its observations once; it shows the formula is bookkeeping, not a new rule.','Keep discrete and continuous distinct — the class mark is a stand-in only in the continuous case.'],['Ask what a row of frequency 4 contributes.'],['Compute class marks before any deviation.'],['Ask whether reordering rows changes anything.']]} as unknown as L),

lesson({ id:'ncert_kemh1_s13_5_4_shortcut_lesson', sec:'13.5.4', title:'Shortcut method to find variance and standard deviation', page:373,
 prereq:['ncert_kemh1_s13_5_grouped_variance'], assume:['Grouped variance','Class width','Step deviations'],
 goal:'You will use the step-deviation method and show it agrees with the direct method.',
 checks:['Find a class width.','Compute a grouped variance directly.'], ifNot:'Revisit the previous lesson; this one reaches the same answer another way.',
 vocab:[['step deviation','The deviation from an assumed mean divided by the class width, written u.']],
 expl:[`The direct method works, but with large class marks the squared deviations become awkward numbers. The shortcut method reduces the arithmetic without changing the answer.`,
  `Pick an assumed mean a, and divide each deviation by the class width h. That gives the step deviation u = (x − a)/h, usually a small whole number.`,
  `With assumed mean ${sc ? sc.assumed : 0} and width ${sc ? sc.width : 0}, the class marks ${GROUPED_MEAN.rows.map((r) => r.x).join(', ')} give step deviations ${sc ? sc.rows.map((r) => r.u).join(', ') : ''} — far easier to square than the deviations themselves.`,
  `The variance is then recovered by σ² = h²[Σfu²/n − (Σfu/n)²]. With Σfu = ${sc ? sc.sumFu : 0} and Σfu² = ${sc ? sc.sumFu2 : 0} over ${GROUPED_MEAN.totalFrequency} observations, this gives ${sc ? show(sc.variance) : ''}.`,
  `The direct method gave ${show(GROUPED_MEAN.variance)}. The two agree, and that is the point: the shortcut is not a different measure or an approximation, it is the same variance reached by easier arithmetic.`,
  `The h² is there because dividing every deviation by h divided the variance by h². Multiplying back restores the original scale.`,
  `The assumed mean can be any convenient value. Choosing ${sc ? sc.assumed : 0} rather than another class mark changes the intermediate columns completely but not the final answer — a method that only worked for one lucky choice would not be a method.`,
  `One condition does matter. Step deviations divide by a common class width, so if the classes have different widths there is no single h and the method does not apply. The direct method still does.`],
 rep:['A step-deviation table with u, fu and fu² columns beside the class marks'],
 we:[{id:'s1354.we1',prompt:`Find the step deviations for assumed mean ${sc ? sc.assumed : 0}.`,steps:[[`The class width is ${sc ? sc.width : 0}.`,'All classes share it, so the method applies.'],[`Each step deviation is (class mark − ${sc ? sc.assumed : 0}) ÷ ${sc ? sc.width : 0}.`,'Subtract, then divide.'],[`That gives ${sc ? sc.rows.map((r) => r.u).join(', ') : ''}.`,'Small whole numbers, easy to square.']],answer:sc ? sc.rows.map((r) => r.u).join(', ') : ''},
  {id:'s1354.we2',prompt:'Find the variance by the shortcut method and compare with the direct one.',steps:[[`Σfu = ${sc ? sc.sumFu : 0} and Σfu² = ${sc ? sc.sumFu2 : 0}, over ${GROUPED_MEAN.totalFrequency} observations.`,'Both columns come from the step deviations.'],[`σ² = ${sc ? sc.width : 0}²[${sc ? sc.sumFu2 : 0}/${GROUPED_MEAN.totalFrequency} − (${sc ? sc.sumFu : 0}/${GROUPED_MEAN.totalFrequency})²] = ${sc ? show(sc.variance) : ''}.`,'The h² restores the scale lost by dividing.'],[`The direct method gave ${show(GROUPED_MEAN.variance)}.`,'The same number, as it must be.']],answer:sc ? show(sc.variance) : ''},
  {id:'s1354.we3',prompt:'Why must the classes share a common width?',steps:[['The step deviation divides each deviation by h.','That assumes one h exists.'],['With unequal widths there is no single divisor.','Different rows would be scaled differently.'],['So the method does not apply, and the direct method is used instead.','Inventing an h would give a wrong answer.']],answer:'Because the step deviation divides by one common width h.'}],
 g:[{id:'s1354.g1',prompt:'What is a step deviation?',hint:'Two operations.',answer:'The deviation from an assumed mean, divided by the class width.',why:'Subtracting then dividing makes the numbers small.'},
  {id:'s1354.g2',prompt:'Why does h² appear in the formula?',hint:'What did dividing do?',answer:'Because dividing the deviations by h divided the variance by h².',why:'Multiplying by h² restores the original scale.'},
  {id:'s1354.g3',prompt:'Must the shortcut agree with the direct method?',hint:'Same quantity?',answer:'Yes.',why:'It is the same variance computed another way.'}],
 i:[{id:'s1354.i1',prompt:'The classes are 0–10, 10–25, 25–40. Can the shortcut be used?',answer:'No.',why:'The widths differ, so there is no common h.'},
  {id:'s1354.i2',prompt:'Does changing the assumed mean change the variance?',answer:'No.',why:'Only the intermediate columns change.'},
  {id:'s1354.i3',prompt:'If the shortcut and direct answers differ, what follows?',answer:'One of them has an error.',why:'They compute the same quantity, so they cannot disagree.'},
  {id:'s1354.i4',prompt:'What is the step deviation of the class mark equal to the assumed mean?',answer:'0.',why:'Its deviation is zero, and zero divided by h is zero.'}],
 td:[{id:'s1354.td1',prompt:'Why is it worth proving the shortcut agrees rather than just trusting the formula?',reasoning:'Because a method that gives its own answer is not a shortcut but a second, competing measure, and nothing in the symbols themselves announces which you have. The agreement is what makes it safe to use the easier route and report the result as the variance, full stop. It is also the only way to catch an error in the derivation: a mistaken h² or a dropped term would still produce a plausible number, and only the comparison exposes it. Reconciling methods is how a calculation earns the right to be called the same quantity.'}],
 summary:`The step deviation u = (x − a)/h makes the arithmetic small, and σ² = h²[Σfu²/n − (Σfu/n)²] recovers the variance: ${sc ? show(sc.variance) : ''}, matching the direct method's ${show(GROUPED_MEAN.variance)}. The h² restores the scale that dividing removed. Any convenient assumed mean works, but the classes must share a common width or there is no h to divide by.`,
 next:'This completes the measures of dispersion in this chapter.',
 t:['Use step deviations to find the variance and reconcile it with the direct method.',['Grouped variance','Class width'],['"the same variance, easier arithmetic"'],['Compute both methods side by side; the agreement is the lesson, not the shortcut.','Try a second assumed mean so the method is seen not to depend on a lucky choice.'],['Ask what unequal widths do.'],['Check the common width before starting.'],['Ask what a disagreement would mean.']]} as unknown as L),

];
