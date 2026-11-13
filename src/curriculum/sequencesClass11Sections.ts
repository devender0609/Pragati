// ===========================================================================
// v0.84.0-c11.28 checkpoint 91 — CLASS 11 CHAPTER 8, SEQUENCES AND SERIES.
//
// Seven summative-core units. C11-SEQ-FO8, the CBSE-only special-sum
// formulae, is NOT authored here and its material is kept out of these
// lessons.
//
// The architecture frontier is §8.4.2: an infinite geometric series is the
// limit of the sequence of partial sums, and the lesson shows the partial
// sums settling rather than substituting n = infinity into a finite formula.
// ===========================================================================

import type { AuthoredSection } from './authoredSection';
import { type L, makeLesson } from './class11Lesson';
import {
  arithmeticMean, describeGeometricMean, describeInfinite, describeSigma,
  finiteSeries, geometricMean, geometricProgression, gpSumByAddition, gpSumOfFirst,
  gpTerms, infiniteGeometricSum, insertArithmeticMeans, partialSums, sequence,
  partialSumFigure, seriesOf, sumOf, termsOf, writeExpanded,
} from './sequences';

export const SEQ_C11_CHAPTER_ID = 'ncert_kemh1_ch08';
const BOOK = 'Mathematics, Textbook for Class XI (NCERT, Reprint 2026-27)';

const source = (sec: string, title: string, page: number) => {
  const parts = sec.split('.');
  const parent = parts.length > 2 ? parts.slice(0, 2).join('.') : sec;
  return {
    officialChapterId: SEQ_C11_CHAPTER_ID,
    officialSectionId: `ncert_kemh1_s${parent.replace(/\./g, '_')}`,
    ...(parts.length > 2 ? { officialSubsectionNumber: sec } : {}),
    sectionNumber: parent, exactTitle: title, startPage: page,
    textbook: BOOK, sourceReference: 'kemh1', inspectionDate: '2026-10-26',
  };
};

const lesson = (l: L): AuthoredSection => makeLesson(l, source);

// --- canonical objects, every displayed value derived --------------------
export const SEQ_ODD = sequence('seq_odd', 'a_n = 2n + 1', (n) => 2 * n + 1);
export const SEQ_SQUARES = sequence('seq_sq', 'a_n = n²', (n) => n * n);
export const SER_ODD = seriesOf('ser_odd', SEQ_ODD, 4, '2k + 1');
export const SER_SQ = finiteSeries('ser_sq', 'k', 1, 5, 'k²', (k) => k * k);
export const MEANS = insertArithmeticMeans(4, 16, 3);
export const GP_GROWING = geometricProgression('gp_grow', 2, 3, 5);
export const GP_CONSTANT = geometricProgression('gp_const', 5, 1, 4);
export const GP_HALVING = geometricProgression('gp_half', 1, 0.5);
export const GP_DOUBLING = geometricProgression('gp_double', 1, 2);

const sumVal = (g: typeof GP_GROWING, n: number) => {
  const s = gpSumOfFirst(g, n);
  return s.kind === 'sum' ? String(s.value) : 'no sum';
};
export const INF_HALVING = infiniteGeometricSum(GP_HALVING);
export const PARTIALS = partialSums(GP_HALVING, 8);

/**
 * The partial sums, read forward from n = 1.
 *
 * This replaced a two-sided limit table, which sampled both sides of its
 * target and so opened with six "no value" cells — a sequence of partial
 * sums has no left side. Every value here comes from `partialSums`, and the
 * limiting value from the convergence result, so the figure reports what
 * the model concluded rather than deciding anything.
 */
export const V_PARTIAL_SUMS = partialSumFigure('v_partial_sums', GP_HALVING, 6,
  `A table of the running total after each term of 1 + a half + a quarter and so on, read forward from the first. After one term the total is 1, after two it is 1.5, then ${PARTIALS.slice(2, 6).map((x) => Number(x.toFixed(4))).join(', ')}. Each total is larger than the last and closer to ${describeInfinite(INF_HALVING)}, and none of them reaches it.`);

/** The same figure for a divergent ratio: no limiting value, and a reason. */
export const V_DIVERGENT_SUMS = partialSumFigure('v_divergent_sums', GP_DOUBLING, 6,
  `A table of the running total of 1 + 2 + 4 and so on, read forward from the first term. The totals are ${partialSums(GP_DOUBLING, 6).map((x) => Number(x.toFixed(0))).join(', ')}, each far larger than the last. They settle on nothing, so this series has no sum at all.`);

export const C11_SEQ_SECTIONS: AuthoredSection[] = [

lesson({ id:'ncert_kemh1_s8_2_sequences_lesson', sec:'8.2', title:'Sequences', page:177,
 assume:['Patterns in numbers','Substituting into a rule'],
 notIntroduce:[['Series and sigma notation','ncert_kemh1_s8_3']],
 goal:'You will read a sequence from its rule and name the term at any position.',
 checks:['Substitute a number into an expression.','Continue a simple number pattern.'], ifNot:'Practise substituting into a rule; a sequence is a rule read at each position.',
 vocab:[['sequence','An ordered list of numbers, each with a position.'],
  ['term','One number of a sequence, written a_n for the term at position n.'],
  ['general term','The rule giving the term at any position.']],
 expl:[`A sequence is an ordered list of numbers. Order is part of what it is: 3, 5, 7 and 7, 5, 3 are different sequences, even with the same numbers in them.`,
  `Each term has a position, counted from 1 here, and the term at position n is written a_n. The subscript is the position, not a multiplier.`,
  `A sequence is usually given by a rule rather than a list. With a_n = 2n + 1 the first five terms are ${termsOf(SEQ_ODD,5).join(', ')}, each found by putting the position into the rule.`,
  `That matters because a list runs out. The rule does not: it answers for position 50 as readily as for position 2, and the list of five terms is only what the sequence happens to show.`,
  `A sequence may be finite, with a stated number of terms, or go on without end. Both are sequences; only the first has a last term.`,
  `Different rules give different patterns. With a_n = n² the terms are ${termsOf(SEQ_SQUARES,5).join(', ')}, which grow faster and faster, while the first rule adds 2 each time.`,
  `A sequence is not a sum. The terms sit beside each other in order and nothing is added yet — that comes next, and it is a different object.`],
 rep:['A table of positions against terms, each term read from the rule'],
 we:[{id:'s82.we1',prompt:'Write the first five terms of the sequence with a_n = 2n + 1.',steps:[['Put n = 1 into the rule: 2(1) + 1.','The first position gives the first term.'],['Continue with n = 2, 3, 4 and 5.','Each position is substituted separately.'],[`That gives ${termsOf(SEQ_ODD,5).join(', ')}.`,'Each term comes from the rule, not from continuing a guessed pattern.']],answer:termsOf(SEQ_ODD,5).join(', ')},
  {id:'s82.we2',prompt:'Find the term at position 20 for a_n = n².',steps:[['The rule gives the term directly at any position.','There is no need to list the first nineteen.'],['Put n = 20: 20².',''+'Substitution is all that is required.'],[`That is ${SEQ_SQUARES.termAt(20)}.`,'This is why a rule is more useful than a list.']],answer:String(SEQ_SQUARES.termAt(20))},
  {id:'s82.we3',prompt:'Why are 3, 5, 7 and 7, 5, 3 different sequences?',steps:[['A sequence is ordered, so position is part of the information.','The first term of one is 3; of the other, 7.'],['Changing the order changes which term sits at which position.','So a_1 differs between them.'],['They contain the same numbers but are different sequences.','A set would not distinguish them; a sequence does.']],answer:'Because the order of the terms is part of the sequence.'}],
 g:[{id:'s82.g1',prompt:'What is the third term of a_n = 4n − 1?',hint:'Put n = 3.',answer:'11.',why:'Substituting the position into the rule gives 4(3) − 1.'},
  {id:'s82.g2',prompt:'What does the subscript in a_7 mean?',hint:'Is it a multiplier?',answer:'The position of the term.',why:'It names which term, not a quantity multiplying a.'},
  {id:'s82.g3',prompt:'Must every sequence have a last term?',hint:'Can a list go on?',answer:'No.',why:'A sequence may be finite or go on without end.'}],
 i:[{id:'s82.i1',prompt:'Write the first four terms of a_n = 3n.',answer:'3, 6, 9, 12.',why:'Each comes from substituting its position into the rule.'},
  {id:'s82.i2',prompt:'Find the tenth term of a_n = n².',answer:'100.',why:'The rule answers at any position without listing the earlier ones.'},
  {id:'s82.i3',prompt:'A sequence is listed as 2, 4, 6. Is that the whole sequence?',answer:'Not necessarily.',why:'A listed prefix shows some terms; the sequence may continue.'},
  {id:'s82.i4',prompt:'Is a sequence the same as a sum of its terms?',answer:'No.',why:'A sequence is an ordered list; adding the terms gives a different object.'}],
 td:[{id:'s82.td1',prompt:'Why give a sequence by a rule when a few terms already show the pattern?',reasoning:'Because a few terms never determine a pattern. The list 2, 4, 6 continues as 8 under one rule and as 10 under another that also fits, and nothing in the three numbers chooses between them. The rule is what makes the sequence a definite object rather than an invitation to guess, and it is also what lets a distant term be found without producing everything before it. Reading terms from a rule is therefore not a formality: it is the difference between knowing a sequence and recognising its opening.'}],
 summary:`A sequence is an ordered list of terms, with the term at position n written a_n. It is normally given by a rule: a_n = 2n + 1 gives ${termsOf(SEQ_ODD,5).join(', ')}. A sequence may be finite or endless, and it is not a sum — adding the terms makes something different.`,
 next:'Next you will add the terms of a sequence and write that sum compactly.',
 t:['Read terms from a rule and use subscript notation for position.',['Substitution'],['"position", every time the subscript is read aloud'],['Derive each term from the rule rather than continuing the pattern by eye; the habit is what makes the rule matter.','Say early that a sequence is not a sum — the confusion starts here and costs most later.'],['Ask for a distant term, so listing is impractical.'],['Substitute the position explicitly.'],['Ask whether three terms fix the rule.']]} as unknown as L),

lesson({ id:'ncert_kemh1_s8_3_series_sigma_lesson', sec:'8.3', title:'Series', page:181,
 prereq:['ncert_kemh1_s8_2'], assume:['Sequences and their terms','Addition'],
 notIntroduce:[['Formulae for special sums','']],
 goal:'You will write the sum of a sequence\u2019s terms in sigma notation and expand it again.',
 checks:['Read a term from a rule.','Add a short list of numbers.'], ifNot:'Revisit sequences; a series is built from one.',
 vocab:[['series','The sum of the terms of a sequence.'],
  ['sigma notation','A compact way of writing a sum, using the Greek letter sigma with an index and bounds.']],
 expl:[`Take the sequence with a_n = 2n + 1, whose first four terms are ${termsOf(SEQ_ODD,4).join(', ')}. Adding them gives ${sumOf(SER_ODD)}. That sum is a series.`,
  `A sequence and a series are different objects. The sequence is the ordered list; the series is the single number that results from adding its terms. Writing them the same way invites the error of treating one as the other.`,
  `Writing out long sums is impractical, so there is a notation. Sigma notation records three things: the index variable, where it starts, where it stops, and the expression being summed.`,
  `So ${describeSigma(SER_ODD)} means exactly ${writeExpanded(SER_ODD)}, which is ${sumOf(SER_ODD)}. Nothing is hidden in the notation: it is the same sum, written compactly.`,
  `The bounds are not decoration. Without them the symbol names no particular sum — it would say to add terms, without saying which. Changing the upper bound changes the sum.`,
  `Another example: ${describeSigma(SER_SQ)} expands to ${writeExpanded(SER_SQ)}, giving ${sumOf(SER_SQ)}.`,
  `The index variable is internal to the sum. Whether it is called k or i makes no difference to the answer, since it only counts the positions being included.`],
 rep:['Sigma notation beside the same sum written out term by term'],
 we:[{id:'s83.we1',prompt:`Expand and evaluate ${describeSigma(SER_ODD)}.`,steps:[['The index runs from 1 to 4, so there are four terms.','The bounds say exactly which positions are included.'],[`Substituting each value gives ${writeExpanded(SER_ODD)}.`,'Each term comes from the summand at that index.'],[`Adding gives ${sumOf(SER_ODD)}.`,'The notation and the written-out sum are the same quantity.']],answer:String(sumOf(SER_ODD))},
  {id:'s83.we2',prompt:`Evaluate ${describeSigma(SER_SQ)}.`,steps:[['The index runs from 1 to 5, so five terms are added.','One term for each position in the range.'],[`The terms are ${writeExpanded(SER_SQ)}.`,'Each is the square of its index.'],[`The sum is ${sumOf(SER_SQ)}.`,'Found by adding the terms, not by any special formula.']],answer:String(sumOf(SER_SQ))},
  {id:'s83.we3',prompt:'Why must sigma notation carry bounds?',steps:[['The symbol says to add terms of a sequence.','On its own it does not say which terms.'],['The lower and upper bounds fix where the index starts and stops.','Without them the expression names no particular number.'],[`Changing the upper bound from 4 to 3 changes ${sumOf(SER_ODD)} into a different sum.`,'So the bounds carry as much meaning as the summand.']],answer:'Because without them the notation names no particular sum.'}],
 g:[{id:'s83.g1',prompt:'What is the difference between a sequence and a series?',hint:'One is a sum.',answer:'A sequence is an ordered list; a series is the sum of its terms.',why:'The series is a single number obtained from the sequence.'},
  {id:'s83.g2',prompt:'How many terms are in a sum with index from 1 to 6?',hint:'Count inclusively.',answer:'6.',why:'Both bounds are included in the range.'},
  {id:'s83.g3',prompt:'Does renaming the index from k to i change the sum?',hint:'What does the index do?',answer:'No.',why:'The index only counts positions; it does not appear in the answer.'}],
 i:[{id:'s83.i1',prompt:'Expand the sum of k from k = 1 to 4.',answer:'1 + 2 + 3 + 4 = 10.',why:'Each index contributes its own value as the term.'},
  {id:'s83.i2',prompt:'Write the sum 2 + 4 + 6 + 8 in sigma notation.',answer:'The sum of 2k from k = 1 to 4.',why:'Each term is twice its position, and there are four of them.'},
  {id:'s83.i3',prompt:'How many terms does a sum with index from 3 to 7 have?',answer:'5.',why:'The positions 3, 4, 5, 6 and 7 are all included.'},
  {id:'s83.i4',prompt:'Is a series an ordered list?',answer:'No.',why:'It is a single number, the total of the terms.'}],
 td:[{id:'s83.td1',prompt:'Sigma notation says nothing a written-out sum does not. Why introduce it at all?',reasoning:'Because it makes the structure of a sum visible and manipulable. Written out, a sum is a row of numbers whose pattern you have to infer; in sigma form the rule, the starting point and the stopping point are separate, labelled parts, and each can be changed on its own. That is what makes it possible to reason about a sum before computing it — to say what happens as the upper bound grows, or to compare two sums whose summands differ. The compactness is a convenience; the separation of parts is the real gain.'}],
 summary:`A series is the sum of a sequence\u2019s terms, and it is a different object from the sequence. Sigma notation records the index, its lower and upper bounds, and the summand: ${describeSigma(SER_ODD)} is ${writeExpanded(SER_ODD)} = ${sumOf(SER_ODD)}. The bounds are essential, since without them no particular sum is named.`,
 next:'Next you will look at the number lying midway between two others.',
 t:['Write and expand finite sums in sigma notation, keeping sequence and series distinct.',['Sequences','Addition'],['"the sum of", read before the sigma symbol is named'],['Expand every sigma at least once before evaluating; the notation only earns trust when it is seen to be the same sum.','Keep "sequence" and "series" apart in every sentence — the vocabulary does the work here.'],['Ask how many terms a given range holds.'],['Write the bounds before the summand.'],['Ask what changing the upper bound does.']]} as unknown as L),

lesson({ id:'ncert_kemh1_s8_3_arithmetic_mean_lesson', sec:'8.3', title:'Arithmetic Mean', page:184,
 prereq:['ncert_kemh1_s8_3'], assume:['Arithmetic progressions','Series and sigma notation'],
 goal:'You will find the arithmetic mean of two numbers and insert arithmetic means between them.',
 checks:['Find a common difference in an arithmetic progression.','Add and divide two numbers.'], ifNot:'Revisit arithmetic progressions; inserting means is an exercise in even spacing.',
 vocab:[['arithmetic mean','The number midway between two others, their sum divided by 2.']],
 expl:[`The arithmetic mean of two numbers is their sum divided by 2. For 4 and 16 it is ${arithmeticMean(4,16)}.`,
  `What makes it the mean is spacing, not the formula. Between 4 and ${arithmeticMean(4,16)} the gap is ${arithmeticMean(4,16)-4}, and between ${arithmeticMean(4,16)} and 16 it is the same, so the three numbers form an arithmetic progression.`,
  `That view extends. Inserting several numbers between two endpoints so that all the gaps are equal is the same problem with more gaps.`,
  `Inserting ${MEANS.inserted.length} means between 4 and 16 gives ${MEANS.totalTerms} terms in all, and so ${MEANS.totalTerms-1} equal gaps. The common difference is the total rise divided by the number of gaps: ${MEANS.progression.d}.`,
  `The inserted numbers follow from that difference rather than being chosen: ${MEANS.inserted.join(', ')}, giving the full progression ${[4,...MEANS.inserted,16].join(', ')}.`,
  `The count of gaps is where care is needed. Inserting n means gives n + 2 terms and n + 1 gaps, not n — the two endpoints are terms too.`],
 rep:['The endpoints with the inserted terms between them, all gaps equal'],
 we:[{id:'s83m.we1',prompt:'Find the arithmetic mean of 4 and 16.',steps:[['Add the two numbers and divide by 2.','That is the definition.'],[`(4 + 16) ÷ 2 = ${arithmeticMean(4,16)}.`,'A single number midway between them.'],[`Checking the spacing: ${arithmeticMean(4,16)} − 4 equals 16 − ${arithmeticMean(4,16)}.`,'Equal gaps on both sides, which is what "midway" means.']],answer:String(arithmeticMean(4,16))},
  {id:'s83m.we2',prompt:`Insert ${MEANS.inserted.length} arithmetic means between 4 and 16.`,steps:[[`With ${MEANS.inserted.length} means inserted there are ${MEANS.totalTerms} terms altogether.`,'The two endpoints count as terms.'],[`So there are ${MEANS.totalTerms-1} equal gaps, and the common difference is (16 − 4) ÷ ${MEANS.totalTerms-1} = ${MEANS.progression.d}.`,'The rise is shared equally between the gaps.'],[`Adding that difference repeatedly gives ${MEANS.inserted.join(', ')}.`,`The full progression is ${[4,...MEANS.inserted,16].join(', ')}.`]],answer:MEANS.inserted.join(', ')},
  {id:'s83m.we3',prompt:'Why is the number of gaps one more than the number of inserted means?',steps:[['The inserted numbers sit between the two endpoints.','The endpoints are terms of the progression as well.'],['So n means give n + 2 terms in a row.','Every adjacent pair forms one gap.'],['A row of n + 2 terms has n + 1 gaps between them.','Dividing by n instead would space the terms wrongly.']],answer:'Because the two endpoints are terms, so n means give n + 2 terms and n + 1 gaps.'}],
 g:[{id:'s83m.g1',prompt:'What is the arithmetic mean of 7 and 13?',hint:'Add and halve.',answer:'10.',why:'Their sum is 20, and half of that is 10.'},
  {id:'s83m.g2',prompt:'Inserting 4 means between two numbers gives how many terms?',hint:'Count the endpoints.',answer:'6.',why:'Four inserted terms plus the two endpoints.'},
  {id:'s83m.g3',prompt:'Why do the gaps have to be equal?',hint:'What kind of progression results?',answer:'Because the result must be an arithmetic progression.',why:'Equal gaps are what makes a progression arithmetic.'}],
 i:[{id:'s83m.i1',prompt:'Find the arithmetic mean of 9 and 21.',answer:'15.',why:'Their sum is 30, halved.'},
  {id:'s83m.i2',prompt:'Insert 1 arithmetic mean between 6 and 14.',answer:'10.',why:'One mean gives three terms and two equal gaps of 4.'},
  {id:'s83m.i3',prompt:'Inserting 5 means between a and b gives how many gaps?',answer:'6.',why:'Seven terms in a row have six gaps between them.'},
  {id:'s83m.i4',prompt:'Is the arithmetic mean always one of the two numbers?',answer:'Only when they are equal.',why:'Otherwise it lies strictly between them.'}],
 td:[{id:'s83m.td1',prompt:'Why is the arithmetic mean worth a name when it is just an average?',reasoning:'Because naming it as the middle term of an arithmetic progression says more than "average" does. It places the number in a structure: the thing that makes a sequence evenly spaced. That is what lets the idea extend to inserting several terms at once, which an averaging view does not suggest at all, and it is what makes the later comparison with the geometric mean a comparison of two kinds of middle rather than of a formula with a formula.'}],
 summary:`The arithmetic mean of two numbers is their sum divided by 2 — for 4 and 16 it is ${arithmeticMean(4,16)} — and it is the middle term of a three-term arithmetic progression. Inserting n means gives n + 2 terms and n + 1 equal gaps, so the common difference is the total rise divided by n + 1.`,
 next:'Next you will meet progressions that multiply rather than add.',
 t:['Find arithmetic means and insert several, deriving the spacing from the endpoints.',['Arithmetic progressions'],['"equal gaps", said before any formula'],['Count the gaps aloud every time; the off-by-one between means and gaps is the error of this lesson.','Derive the inserted values from the common difference rather than listing them.'],['Ask how many gaps n inserted means create.'],['Find the common difference before any term.'],['Ask whether the mean can equal an endpoint.']]} as unknown as L),

lesson({ id:'ncert_kemh1_s8_4_geometric_progression_lesson', sec:'8.4', title:'Geometric Progression (G.P.)', page:186,
 prereq:['ncert_kemh1_s8_2'], assume:['Sequences and their terms','Powers'],
 notIntroduce:[['Sum of n terms of a geometric progression','ncert_kemh1_s8_4_1']],
 goal:'You will recognise a geometric progression and find its term at any position.',
 checks:['Read a term from a rule.','Evaluate a power.'], ifNot:'Revisit sequences and powers; a geometric progression multiplies by a fixed number each step.',
 vocab:[['geometric progression','A sequence in which each term is a fixed multiple of the one before.'],
  ['common ratio','The fixed multiplier, written r.']],
 expl:[`In an arithmetic progression each term is the previous one plus a fixed number. A geometric progression does the same thing with multiplication: each term is the previous one times a fixed number, the common ratio.`,
  `With first term ${GP_GROWING.a} and ratio ${GP_GROWING.r} the terms are ${gpTerms(GP_GROWING,5).join(', ')}. Each is ${GP_GROWING.r} times the one before.`,
  `This is a different kind of structure from an arithmetic progression, not the same one with a renamed letter. Adding a fixed amount gives steady growth; multiplying by a fixed amount gives growth that accelerates, and the two have different nth terms.`,
  `To reach the nth term, start at the first and multiply by the ratio n − 1 times: a_n = a r^(n−1). The exponent is n − 1 because the first term has not yet been multiplied at all.`,
  `Checking at n = 1: r^0 is 1, so the rule returns the first term exactly, as it must.`,
  `The ratio need not be greater than 1. With ratio ${GP_HALVING.r} the terms ${gpTerms(GP_HALVING,5).join(', ')} shrink towards zero without ever reaching it, and that behaviour matters later.`,
  `A ratio of ${GP_CONSTANT.r} gives every term equal to the first: ${gpTerms(GP_CONSTANT,4).join(', ')}. It is still a geometric progression, and it will need separate treatment when sums are taken.`],
 rep:['The terms written in a row with the multiplication between each pair marked'],
 we:[{id:'s84.we1',prompt:`Write the first five terms with first term ${GP_GROWING.a} and ratio ${GP_GROWING.r}.`,steps:[[`Start at ${GP_GROWING.a}.`,'The first term is given, not computed.'],[`Multiply by ${GP_GROWING.r} for each next term.`,'That is what the common ratio means.'],[`The terms are ${gpTerms(GP_GROWING,5).join(', ')}.`,'Generated forward, each from the one before.']],answer:gpTerms(GP_GROWING,5).join(', ')},
  {id:'s84.we2',prompt:`Find the fifth term using the rule rather than listing.`,steps:[['The nth term is the first term times the ratio raised to n − 1.','The first term has been multiplied zero times.'],[`For n = 5 that is ${GP_GROWING.a} × ${GP_GROWING.r}^4.`,'Four multiplications after the first term.'],[`That gives ${gpTerms(GP_GROWING,5)[4]}, matching the listed fifth term.`,'The rule and the listing agree, as they must.']],answer:String(gpTerms(GP_GROWING,5)[4])},
  {id:'s84.we3',prompt:'Why is the exponent n − 1 rather than n?',steps:[['The first term is where the progression starts.','Nothing has been multiplied yet at that point.'],['Reaching the second term takes one multiplication, the third takes two.','Each step adds one factor of the ratio.'],['So the nth term has n − 1 factors, and at n = 1 the rule returns the first term.','Using n would return a times r at the first position, which is the second term.']],answer:'Because the first term has not been multiplied by the ratio at all.'}],
 g:[{id:'s84.g1',prompt:'What makes a progression geometric rather than arithmetic?',hint:'Add or multiply?',answer:'Each term is a fixed multiple of the previous one.',why:'An arithmetic progression adds a fixed amount instead.'},
  {id:'s84.g2',prompt:'With first term 3 and ratio 2, what is the fourth term?',hint:'Three multiplications.',answer:'24.',why:'3 × 2³ gives 24.'},
  {id:'s84.g3',prompt:'What happens to the terms when the ratio is between 0 and 1?',hint:'Multiply by less than one.',answer:'They shrink towards zero.',why:'Each term is a fraction of the one before.'}],
 i:[{id:'s84.i1',prompt:'Write the first four terms with first term 1 and ratio 5.',answer:'1, 5, 25, 125.',why:'Each term is five times the one before.'},
  {id:'s84.i2',prompt:'Find the sixth term with first term 2 and ratio 3.',answer:String(gpTerms(GP_GROWING,6)[5]),why:'The rule gives 2 × 3⁵ without listing the earlier terms.'},
  {id:'s84.i3',prompt:'Is a sequence with every term equal to 5 a geometric progression?',answer:'Yes.',why:'Each term is 1 times the one before, so the ratio is 1.'},
  {id:'s84.i4',prompt:'Why is the first term of a geometric progression never 0?',answer:'Because every later term would be 0 and no ratio could be identified.',why:'Multiplying 0 by anything gives 0, so the progression carries no ratio.'}],
 td:[{id:'s84.td1',prompt:'Both kinds of progression are built from one repeated operation. Why treat them as different objects rather than one with a setting?',reasoning:'Because almost everything that follows differs. The nth terms have different shapes, one linear in n and one exponential; the sums are found by different manipulations; and only one of them can be continued forever to a finite total. Treating them as a single object with an add-or-multiply switch would hide all of that, and would suggest that results proved for one carry across to the other. They are siblings, not settings: related enough to compare, different enough that the comparison is worth making.'}],
 summary:`A geometric progression multiplies by a fixed common ratio each step, so a_n = a r^(n−1) — the exponent is n − 1 because the first term has not been multiplied yet. With first term ${GP_GROWING.a} and ratio ${GP_GROWING.r} the terms are ${gpTerms(GP_GROWING,5).join(', ')}. A ratio below 1 makes the terms shrink.`,
 next:'Next you will add the first n terms of a geometric progression.',
 t:['Recognise a geometric progression and find any term from the first term and ratio.',['Sequences','Powers'],['"times the one before", said whenever the ratio is named'],['Generate terms forward from the ratio rather than dividing to find it; division fails the moment a term is zero.','Check the rule at n = 1 explicitly — it is where the n − 1 earns its place.'],['Ask for a distant term so listing is impractical.'],['Say how many multiplications a position needs.'],['Ask what a ratio below 1 does to the terms.']]} as unknown as L),


lesson({ id:'ncert_kemh1_s8_4_1_gp_sum_lesson', sec:'8.4.1', title:'Sum to n terms of a G.P.', page:190,
 prereq:['ncert_kemh1_s8_4'], assume:['Geometric progressions','Series and sigma notation'],
 goal:'You will derive and use the sum of the first n terms of a geometric progression.',
 checks:['Find a term of a geometric progression.','Expand a short sum.'], ifNot:'Revisit geometric progressions; this sum is built from their terms.',
 vocab:[['sum to n terms','The total of the first n terms, written S_n.']],
 expl:[`Adding the first ${GP_GROWING.length} terms of the progression ${gpTerms(GP_GROWING,5).join(', ')} gives ${gpSumByAddition(GP_GROWING,5)}. For five terms that is easy; for fifty it is not.`,
  `The derivation uses a trick worth understanding rather than memorising. Write S_n as the sum of the terms. Then multiply the whole thing by the ratio r, which shifts every term one place along.`,
  `Almost every term appears in both lines. Subtracting the second from the first cancels all of them except the first term of one and the last term of the other, leaving S_n − rS_n = a − a r^n.`,
  `Factoring gives S_n(1 − r) = a(1 − r^n), and dividing gives S_n = a(1 − r^n)/(1 − r). The shift-and-subtract is what makes a long sum collapse to two terms.`,
  `Checking it: for the progression above with 5 terms the formula gives ${sumVal(GP_GROWING,5)}, the same as adding the terms directly.`,
  `There is one case the formula cannot handle. If r = 1 the denominator 1 − r is zero, and division by zero is not a value. This is not an awkward exception to remember but a step of the derivation that does not exist: with r = 1 the shift changes nothing and there is nothing to cancel.`,
  `That case is simple on its own terms. If r = 1 every term equals the first, so the sum of n of them is na. For ${GP_CONSTANT.length} terms of ${gpTerms(GP_CONSTANT,4).join(', ')} the sum is ${sumVal(GP_CONSTANT,4)}.`],
 rep:['The sum and its multiple written one above the other, with the cancelling terms marked'],
 we:[{id:'s841.we1',prompt:`Find the sum of the first 5 terms with first term ${GP_GROWING.a} and ratio ${GP_GROWING.r}.`,steps:[[`The terms are ${gpTerms(GP_GROWING,5).join(', ')}.`,'Generated from the first term and the ratio.'],[`The formula gives ${GP_GROWING.a}(1 − ${GP_GROWING.r}⁵)/(1 − ${GP_GROWING.r}).`,'Substituting the first term, the ratio and the number of terms.'],[`That is ${sumVal(GP_GROWING,5)}, and adding the five terms directly gives ${gpSumByAddition(GP_GROWING,5)}.`,'The two agree, which is the check worth making.']],answer:sumVal(GP_GROWING,5)},
  {id:'s841.we2',prompt:'Why does multiplying by r and subtracting help?',steps:[['Multiplying every term by r shifts each one into the next position.','The two rows then share almost all their terms.'],['Subtracting cancels every shared term.','Only the first term of one row and the last of the other survive.'],['So a sum of n terms collapses to a difference of two.','That is what makes the result usable for large n.']],answer:'Because the shift makes almost every term cancel.'},
  {id:'s841.we3',prompt:`Find the sum of ${GP_CONSTANT.length} terms when the ratio is 1.`,steps:[['With r = 1 the formula divides by 1 − 1, which is zero.','There is no value to compute, so the formula does not apply.'],['But a ratio of 1 means every term equals the first.','Nothing is changing from term to term.'],[`So the sum is simply the first term n times: ${sumVal(GP_CONSTANT,4)}.`,'Reached without dividing by zero at any point.']],answer:sumVal(GP_CONSTANT,4)}],
 g:[{id:'s841.g1',prompt:'What does multiplying the sum by r achieve?',hint:'Where do the terms go?',answer:'It shifts every term one place, so almost all cancel on subtraction.',why:'The two rows share all but two terms.'},
  {id:'s841.g2',prompt:'Why can the formula not be used when r = 1?',hint:'Look at the denominator.',answer:'Because 1 − r is zero.',why:'Division by zero has no value, so a separate argument is needed.'},
  {id:'s841.g3',prompt:'What is the sum of 6 terms each equal to 4?',hint:'Ratio 1.',answer:'24.',why:'With every term the same, the sum is the term times the count.'}],
 i:[{id:'s841.i1',prompt:'Find the sum of the first 4 terms with first term 1 and ratio 2.',answer:'15.',why:'1 + 2 + 4 + 8, which the formula also gives.'},
  {id:'s841.i2',prompt:'A student uses the formula with r = 1 and gets an error. Why?',answer:'The denominator is zero.',why:'The constant case must be handled by counting terms instead.'},
  {id:'s841.i3',prompt:'What is the sum of 10 terms each equal to 3?',answer:'30.',why:'Ten copies of the same term.'},
  {id:'s841.i4',prompt:'Does the formula work when the ratio is less than 1?',answer:'Yes.',why:'Only r = 1 breaks the denominator; other ratios are fine.'}],
 td:[{id:'s841.td1',prompt:'The r = 1 case is usually presented as an exception. Is it really an exception, or something else?',reasoning:'It is better seen as a case the derivation never covered. The whole argument rests on multiplying by r and subtracting, which only tells you something when the two rows differ — and at r = 1 they are identical, so the subtraction gives 0 = 0 and the method yields nothing. The division by zero at the end is the symptom, not the cause. Read that way the constant case is not an exception bolted onto a general rule but a separate situation with its own, easier, argument.'}],
 summary:`Multiplying S_n by r shifts the terms so that subtraction cancels almost all of them, giving S_n = a(1 − r^n)/(1 − r). For ${GP_GROWING.a} and ratio ${GP_GROWING.r} over 5 terms that is ${sumVal(GP_GROWING,5)}, matching direct addition. When r = 1 the derivation yields nothing and the denominator is zero, so the sum is counted instead: na.`,
 next:'Next you will ask what happens when the terms never stop.',
 t:['Derive the sum of n terms by shift-and-subtract, and handle r = 1 separately.',['Geometric progressions','Series'],['"almost every term cancels", said during the subtraction'],['Write the two rows one above the other and strike the cancelling terms; the collapse is the whole idea.','Treat r = 1 as a case the derivation never reached, not an exception to memorise.'],['Ask what goes wrong at r = 1.'],['Check the formula against direct addition once.'],['Ask what happens as n grows.']]} as unknown as L),

lesson({ id:'ncert_kemh1_s8_4_2_infinite_gp_lesson', sec:'8.4.2', title:'Infinite G.P. and its Sum', page:193,
 prereq:['ncert_kemh1_s8_4_1'], assume:['Sum of n terms of a geometric progression','Limits of a function'],
 goal:'You will decide when an infinite geometric series has a sum, and find it from the partial sums.',
 checks:['Find the sum of n terms of a geometric progression.','Say what a limit is.'], ifNot:'Revisit limits; an infinite sum is a limit, not a very long addition.',
 vocab:[['partial sum','The total of the first n terms, written S_n.'],
  ['converges','Describes a series whose partial sums settle on one number.'],
  ['geometric mean','The square root of the product of two positive numbers.']],
 expl:[`What could it mean to add infinitely many numbers? Not to carry out infinitely many additions — that is not something anyone can do, and no amount of adding reaches the end of an endless list.`,
  `Instead, look at the partial sums. S_1 is the first term, S_2 the first two, and so on. Each is an ordinary finite sum, and together they form a sequence of their own.`,
  `For the progression ${gpTerms(GP_HALVING,5).join(', ')} those partial sums are ${PARTIALS.slice(0,6).map((x)=>Number(x.toFixed(4))).join(', ')}. They climb, but never past ${describeInfinite(INF_HALVING)}, and each one is closer to it than the last.`,
  `That is what an infinite sum means here: the limit of the sequence of partial sums. If the partial sums settle on a number, the series converges and that number is its sum. The idea is the limit met earlier, applied to a new sequence.`,
  `Notice what is not being done. Nobody substitutes n = infinity into the formula for S_n. Infinity is not a number that can be put into a formula, and a formula answering for every n says nothing on its own about where the answers are heading.`,
  `The condition is on the ratio. When |r| < 1 each term is a fraction of the one before, the terms shrink towards zero, and the partial sums settle. The sum is then a/(1 − r), which for this progression gives ${describeInfinite(INF_HALVING)}.`,
  `When |r| is 1 or more the partial sums do not settle. With ratio ${GP_DOUBLING.r} the terms grow and the totals run away: ${describeInfinite(infiniteGeometricSum(GP_DOUBLING))}. With ratio 1 every term is the same and the totals climb forever; with ratio −1 they flip between two values without ever settling. In none of these cases is there a sum to report — not a very large one, none at all.`,
  `This section also introduces a second kind of middle. The geometric mean of two positive numbers is the square root of their product: for 4 and 9 it is ${describeGeometricMean(geometricMean(4,9))}, and for 2 and 3 it is ${describeGeometricMean(geometricMean(2,3))}, kept exact rather than rounded. It is defined for positive numbers only.`],
 rep:['A table of the partial sums, each closer to the limiting value than the last'],
 visuals:[V_PARTIAL_SUMS, V_DIVERGENT_SUMS],
 we:[{id:'s842.we1',prompt:`Find the sum of the infinite series with first term ${GP_HALVING.a} and ratio ${GP_HALVING.r}.`,steps:[[`First check the ratio: |${GP_HALVING.r}| is less than 1, so the series converges.`,'The condition is checked before any sum is claimed.'],[`The partial sums are ${PARTIALS.slice(0,5).map((x)=>Number(x.toFixed(4))).join(', ')}, each closer to ${describeInfinite(INF_HALVING)}.`,'This is the evidence that they settle.'],[`Their limit is a/(1 − r) = ${describeInfinite(INF_HALVING)}.`,'The sum is that limit, not the result of endless addition.']],answer:describeInfinite(INF_HALVING)},
  {id:'s842.we2',prompt:`Does the series with first term ${GP_DOUBLING.a} and ratio ${GP_DOUBLING.r} have a sum?`,steps:[[`The ratio has size ${Math.abs(GP_DOUBLING.r)}, which is not less than 1.`,'So the convergence condition fails.'],['The terms grow rather than shrink, so each partial sum is much larger than the last.','Nothing is settled on.'],[`So ${describeInfinite(infiniteGeometricSum(GP_DOUBLING))}.`,'There is no sum to report, rather than an enormous one.']],answer:'No — the partial sums grow without bound.'},
  {id:'s842.we3',prompt:'Why can the finite formula not simply be used with n = infinity?',steps:[['The formula S_n = a(1 − r^n)/(1 − r) answers for each whole number n.','Infinity is not a whole number, so there is nothing to substitute.'],['What can be asked is where those answers head as n grows.','That is a limit, a question about the whole sequence of answers.'],['When |r| < 1 the term r^n shrinks towards zero and the answers settle on a/(1 − r).','The same substitution would also hand back a number for divergent ratios, where none exists.']],answer:'Because infinity is not a number to substitute; the sum is a limit of the partial sums.'}],
 g:[{id:'s842.g1',prompt:'When does an infinite geometric series have a sum?',hint:'Look at the size of the ratio.',answer:'When |r| < 1.',why:'The terms then shrink towards zero and the partial sums settle.'},
  {id:'s842.g2',prompt:'What is a partial sum?',hint:'How many terms?',answer:'The total of the first n terms.',why:'It is an ordinary finite sum; the infinite sum is their limit.'},
  {id:'s842.g3',prompt:'What is the geometric mean of 4 and 9?',hint:'Square root of the product.',answer:describeGeometricMean(geometricMean(4,9)),why:'The product is 36 and its square root is exact.'}],
 i:[{id:'s842.i1',prompt:'Find the sum of the infinite series with first term 1 and ratio one third.',answer:'3/2.',why:'The ratio is below 1 in size, so the sum is a/(1 − r).'},
  {id:'s842.i2',prompt:'Does a series with ratio −1 have a sum?',answer:'No.',why:'The partial sums alternate between two values and never settle.'},
  {id:'s842.i3',prompt:'What is the geometric mean of 2 and 8?',answer:'4.',why:'The product is 16, whose square root is exact.'},
  {id:'s842.i4',prompt:'Is there a geometric mean of −4 and 9?',answer:'No.',why:'The geometric mean here is defined for positive numbers only.'}],
 td:[{id:'s842.td1',prompt:'How can adding infinitely many positive numbers give a finite total?',reasoning:'Because no infinite adding is taking place. The question has been replaced by a different one: where do the finite totals head? Each partial sum is an ordinary number reached by finitely many additions, and when the terms shrink fast enough those numbers crowd towards a single value without ever passing it. Calling that value the sum is a definition, chosen because it is the only number the totals could sensibly be said to approach. Nothing infinite is completed; a limit is identified.'},
  {id:'s842.td2',prompt:'Why does the condition fall on the ratio rather than on the terms getting small?',reasoning:'Because terms getting small is not enough on its own, and the ratio is what controls how fast they shrink. A geometric series with |r| < 1 has terms falling away in fixed proportion, so each contributes a shrinking share of what remains and the totals close in geometrically. Terms that merely drift towards zero can still accumulate without limit, which is why the condition is stated on r rather than on the terms. For this family the ratio is the whole story, and that is exactly why the family is worth singling out.'}],
 summary:`An infinite geometric series is the limit of its partial sums, not an endless addition and not the finite formula with n = infinity. When |r| < 1 the partial sums ${PARTIALS.slice(0,4).map((x)=>Number(x.toFixed(3))).join(', ')} settle on a/(1 − r) = ${describeInfinite(INF_HALVING)}. When |r| ≥ 1 there is no sum at all. The geometric mean of two positive numbers is the square root of their product, exact rather than rounded.`,
 next:'Next you will compare the two kinds of mean.',
 t:['Decide convergence from the ratio and find the sum as the limit of partial sums.',['Sum of n terms','Limits'],['"the limit of the partial sums", never "n equals infinity"'],['Show the partial sums before the formula; the table is what makes the limit real rather than asserted.','Say plainly that a divergent series has NO sum, not an infinite one — the phrasing is where the misconception lives.'],['Ask whether n = infinity can be substituted.'],['Check the ratio before claiming a sum.'],['Ask what happens at ratio exactly 1 and −1.']]} as unknown as L),

lesson({ id:'ncert_kemh1_s8_5_am_gm_lesson', sec:'8.5', title:'Relationship Between A.M. and G.M.', page:196,
 prereq:['ncert_kemh1_s8_3','ncert_kemh1_s8_4_2'], assume:['Arithmetic mean','Geometric mean','Expanding a square'],
 goal:'You will show that the arithmetic mean of two positive numbers is never less than their geometric mean.',
 checks:['Find both means of two numbers.','Expand (x − y)².'], ifNot:'Revisit both means; this lesson compares them.',
 vocab:[],
 expl:[`Two numbers have two kinds of middle. For 4 and 16 the arithmetic mean is ${arithmeticMean(4,16)} and the geometric mean is ${describeGeometricMean(geometricMean(4,16))}. The arithmetic one is larger.`,
  `That is not a coincidence of these numbers. For any two positive numbers the arithmetic mean is never less than the geometric mean.`,
  `The proof rests on something that cannot be negative. For positive a and b, consider (√a − √b)². A square of a real number is never negative, so this quantity is at least zero.`,
  `Expanding it gives a − 2√(ab) + b. So a + b − 2√(ab) ≥ 0, which rearranges to a + b ≥ 2√(ab), and halving gives (a + b)/2 ≥ √(ab) — exactly the arithmetic mean against the geometric mean.`,
  `Equality holds only when the square is zero, which happens only when √a equals √b, that is when the two numbers are equal. Otherwise the arithmetic mean is strictly larger.`,
  `The positivity is part of the claim, not a footnote. The square roots must exist for the argument to start, and the geometric mean itself is only defined for positive numbers here. Dropping that assumption does not leave a weaker result; it leaves no result at all.`,
  `Checking with 4 and 16: ${arithmeticMean(4,16)} against ${describeGeometricMean(geometricMean(4,16))}, and the claim holds. With 9 and 9 the means are both 9, the equality case.`],
 rep:['The two means marked on a line, with the arithmetic one never to the left of the geometric'],
 we:[{id:'s85.we1',prompt:'Compare the two means of 4 and 16.',steps:[[`The arithmetic mean is (4 + 16)/2 = ${arithmeticMean(4,16)}.`,'Their sum halved.'],[`The geometric mean is the square root of 64, which is ${describeGeometricMean(geometricMean(4,16))}.`,'Exact, since the product is a perfect square.'],[`So the arithmetic mean is the larger, as the relationship predicts.`,'And the two differ because the numbers differ.']],answer:`${arithmeticMean(4,16)} against ${describeGeometricMean(geometricMean(4,16))}`},
  {id:'s85.we2',prompt:'Prove that the arithmetic mean is never less than the geometric mean for positive a and b.',steps:[['Start from (√a − √b)², which is a square of a real number and so is at least 0.','The square roots exist because a and b are positive — this is where the assumption is used.'],['Expanding gives a − 2√(ab) + b ≥ 0.','The middle term carries the geometric mean.'],['Rearranging gives a + b ≥ 2√(ab).','Both means are now visible, one on each side.'],['Halving gives (a + b)/2 ≥ √(ab), which is the claim.','The inequality direction is preserved because 2 is positive.']],answer:'(a + b)/2 ≥ √(ab) for positive a and b.'},
  {id:'s85.we3',prompt:'When are the two means equal?',steps:[['The inequality came from a square being at least zero.','Equality in the conclusion needs equality there.'],['A square is zero only when the quantity squared is zero, so √a = √b.','Which for positive numbers means a = b.'],['So the means are equal exactly when the two numbers are equal.','Otherwise the arithmetic mean is strictly larger.']],answer:'Exactly when the two numbers are equal.'}],
 g:[{id:'s85.g1',prompt:'Which mean is larger for two different positive numbers?',hint:'Which did the proof bound below?',answer:'The arithmetic mean.',why:'It is never less, and strictly larger unless the numbers are equal.'},
  {id:'s85.g2',prompt:'What fact does the proof start from?',hint:'Something that cannot be negative.',answer:'That a square is never negative.',why:'The whole inequality follows from (√a − √b)² ≥ 0.'},
  {id:'s85.g3',prompt:'Why must a and b be positive?',hint:'What has to exist?',answer:'So the square roots exist and the geometric mean is defined.',why:'Without positivity the argument cannot even begin.'}],
 i:[{id:'s85.i1',prompt:'Compare the two means of 2 and 8.',answer:'5 against 4.',why:'The arithmetic mean is 5 and the geometric mean is the exact root of 16.'},
  {id:'s85.i2',prompt:'Can the geometric mean exceed the arithmetic mean for positive numbers?',answer:'No.',why:'The proof shows the arithmetic mean is never less.'},
  {id:'s85.i3',prompt:'What are the two means of 7 and 7?',answer:'Both 7.',why:'Equal numbers give the equality case.'},
  {id:'s85.i4',prompt:'A student applies the relationship to −4 and 9. What is wrong?',answer:'The numbers must be positive.',why:'The geometric mean is not defined here for a negative number, so the claim does not apply.'}],
 td:[{id:'s85.td1',prompt:'The proof turns on one small fact — that a square cannot be negative. Why is that enough to settle an inequality about every pair of positive numbers?',reasoning:'Because the fact is universal while the arrangement is specific. Every real square is at least zero regardless of what is squared, so choosing to square √a − √b imports that guarantee into a statement about a and b in particular. The skill is not in knowing that squares are non-negative, which is immediate, but in finding the expression whose expansion happens to contain both means. Once that expression is chosen the rest is rearrangement, and the universality of the starting fact is what makes the conclusion hold for every pair rather than for the ones that were tried.'}],
 summary:`For positive a and b the arithmetic mean is never less than the geometric mean: (a + b)/2 ≥ √(ab). The proof starts from (√a − √b)² ≥ 0 and rearranges. Equality holds exactly when a = b. The positivity assumption is essential — without it the square roots and the geometric mean are not available at all.`,
 next:'Later chapters use both means when comparing quantities.',
 t:['Prove the arithmetic-geometric mean relationship from a non-negative square, with its domain.',['Both means','Expanding a square'],['"a square is never negative", as the starting point'],['Let students try squaring other expressions first; finding the right one is the actual skill.','State the positivity before the first line of the proof, not after it — the argument depends on it.'],['Ask when the two means are equal.'],['Name the assumption before starting.'],['Ask what fails for negative numbers.']]} as unknown as L),

];
