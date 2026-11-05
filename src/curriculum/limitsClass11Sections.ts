// ===========================================================================
// v0.84.0-c11.17 checkpoint 86A — CLASS 12 LIMITS FOUNDATION (Chapter 12).
//
// FOUR UNITS ONLY: LIM-01 to LIM-04.
//
// LIM-05 and LIM-06 require C11-IND-01, the induction unit, which is still
// NEEDS_HUMAN_CHECK with no NCERT chapter owner. FO11 depends on LIM-06 in
// turn. None of the three is authored here, and the dependency is not
// removed to make the chapter easier.
//
// Every number a student reads comes from `limits.ts`, which takes the
// function as its input. Nothing in this file computes a limit by hand.
// ===========================================================================

import type { AuthoredSection } from './authoredSection';
import { type L, makeLesson } from './class11Lesson';
import {
  DISPLAY_OFFSETS, averageRateOfChange, compareValueWithLimit,
  describeComparison, describeLimit, limitOf, limitTable,
  polynomial, rational, secantGraph, valueAt,
} from './limits';

export const LIM_C11_CHAPTER_ID = 'ncert_kemh1_ch12';
const BOOK = 'Mathematics, Textbook for Class XI (NCERT, Reprint 2026-27)';
const SRC = 'kemh1';
const INSPECTED = '2026-10-26';

const source = (sec: string, title: string, page: number) => {
  const parts = sec.split('.');
  const parent = parts.length > 2 ? parts.slice(0, 2).join('.') : sec;
  return {
    officialChapterId: LIM_C11_CHAPTER_ID,
    officialSectionId: `ncert_kemh1_s${parent.replace(/\./g, '_')}`,
    ...(parts.length > 2 ? { officialSubsectionNumber: sec } : {}),
    sectionNumber: parent, exactTitle: title, startPage: page,
    textbook: BOOK, sourceReference: SRC, inspectionDate: INSPECTED,
  };
};

const lesson = (l: L): AuthoredSection => makeLesson(l, source);

// --- the functions every lesson draws on -----------------------------------
export const F_SQUARE = polynomial('square', 'x\u00b2', (x) => x * x);
export const F_DISTANCE = polynomial('distance', '5t\u00b2', (t) => 5 * t * t);
export const F_POLY = polynomial('cubic', 'x\u00b3 + 2x', (x) => x * x * x + 2 * x);
/** Undefined at 1, yet the limit there exists. The chapter's pivot. */
export const F_HOLE = rational('hole', '(x\u00b2 \u2212 1)/(x \u2212 1)', (x) => x * x - 1, (x) => x - 1, [1]);
export const F_SIMPLE = polynomial('simplified', 'x + 1', (x) => x + 1);
/** A denominator that stays zero: no cancellation is available. */
export const F_BLOWUP = rational('blowup', '1/(x \u2212 1)', () => 1, (x) => x - 1, [1]);
/** Two sides that disagree, so no two-sided limit. */
export const F_SIGNUM = {
  name: 'signum', inDomain: () => true,
  evaluate: (x: number) => (x > 0 ? 1 : x < 0 ? -1 : 0),
  domainDescription: 'every real number', rangeDescription: '\u22121, 0 or 1',
};
export const F_RATIONAL_OK = rational('ratOk', '(x + 3)/(x + 1)', (x) => x + 3, (x) => x + 1, [-1]);
export const F_SINC = rational('sinc', 'sin x / x', (x) => Math.sin(x), (x) => x, [0]);
export const F_EXP = rational('expLim', '(e\u02e3 \u2212 1)/x', (x) => Math.exp(x) - 1, (x) => x, [0]);
export const F_LOG = rational('logLim', 'log(1 + x)/x', (x) => Math.log(1 + x), (x) => x, [0]);

const lim = (f: Parameters<typeof limitOf>[0], a: number) => describeLimit(limitOf(f, a));
const cmp = (f: Parameters<typeof limitOf>[0], a: number) => describeComparison(compareValueWithLimit(f, a));
const num = (v: number | null) => (v === null ? 'no value' : String(v));
const rate = (f: Parameters<typeof averageRateOfChange>[0], a: number, b: number) => {
  const r = averageRateOfChange(f, a, b);
  return r.kind === 'slope' ? String(r.value) : r.reason;
};

export const V_SECANT = secantGraph('v_secant', F_SQUARE, 'The curve y = x\u00b2', 1, [3, 2, 1.5],
  'A curve rising from left to right, with a fixed point P marked on it where x is 1. Three dashed straight lines pass through P and through points further along the curve, each one less steep than the last as those points move closer to P. A solid line through P shows the position they approach, which is the tangent.', 4);

export const V_TABLE_HOLE = limitTable('v_table_hole', F_HOLE, '(x\u00b2 \u2212 1)/(x \u2212 1)', 1,
  'A table of values of the expression (x squared minus 1) divided by (x minus 1) at x values closing in on 1 from below and from above. The outputs rise towards 2 from the left and fall towards 2 from the right, while at x equal to 1 itself the expression has no value at all.', DISPLAY_OFFSETS);

export const V_TABLE_DNE = limitTable('v_table_dne', F_SIGNUM, 'the signum function', 0,
  'A table of signum values at x closing in on zero from both sides. Every value to the left of zero is minus one and every value to the right is plus one, so the two sides settle on different numbers and never meet.', DISPLAY_OFFSETS);

export const V_TABLE_SINC = limitTable('v_table_sinc', F_SINC, 'sin x / x', 0,
  'A table of sin x divided by x, with x measured in radians, at values closing in on zero from both sides. The outputs rise towards 1 from both directions, while at x equal to zero the expression has no value because the denominator is zero.', DISPLAY_OFFSETS);

export const CANONICAL_LIMIT_VISUALS = [V_SECANT, V_TABLE_HOLE, V_TABLE_DNE, V_TABLE_SINC];

export const C11_LIM_SECTIONS: AuthoredSection[] = [

lesson({ id:'ncert_kemh1_s12_2_rate_of_change_lesson', sec:'12.2', title:'Introduction and Rate of Change', page:220,
 prereq:['ncert_kemh1_s9_2'], assume:['Slope of a line','Functions and their graphs'],
 notIntroduce:[['The formal definition of a limit','ncert_kemh1_s12_3'],['The derivative from first principles','ncert_kemh1_s12_5']],
 goal:'You will see how the slope between two points on a curve becomes a rate of change, and what happens as those points close together.',
 checks:['Find the slope between two points.','Read a value off a function.'], ifNot:'Revisit slope; everything here is a slope, measured over smaller and smaller intervals.',
 vocab:[['average rate of change','The change in a function divided by the change in the input, across an interval.'],
  ['secant','A straight line through two points of a curve.'],
  ['tangent','The line a secant approaches as its two points close together.'],
  ['instantaneous rate of change','The rate at a single instant, rather than across an interval.']],
 expl:[`A car covering ${F_DISTANCE.rule} metres in t seconds is not travelling at one speed. Between two instants you can still say how fast it went on average: the distance gained divided by the time taken.`,
  `From t = 1 to t = 3 that average is ${rate(F_DISTANCE,1,3)} metres per second. From t = 1 to t = 2 it is ${rate(F_DISTANCE,1,2)}, and from t = 1 to t = 1.5 it is ${rate(F_DISTANCE,1,1.5)}. The intervals are shrinking and the answers are changing.`,
  'On a graph that average is a slope. Join the two points of the curve with a straight line, a secant, and its slope is exactly the average rate across that interval.',
  `Take the curve ${V_SECANT.functionRule} and fix a point P where x is 1. Secants from P to points further along have slopes ${V_SECANT.movers.map(m=>m.slope).join(', ')} as the second point moves closer.`,
  `Those slopes are settling. ${describeLimit(V_SECANT.limitingSlope).replace('the limit is','The value they approach is')}, and the line through P with that slope is the tangent at P.`,
  'So the tangent is not the line that "touches the curve once" — that description fails on plenty of curves. It is the position the secants approach as the interval closes to nothing.',
  'That approached value is the instantaneous rate of change: not an average across an interval, but the rate at the single point P. Making that idea precise is what the rest of the chapter is for.'],
 rep:['A curve with a fixed point, several secants through it, and the tangent they approach'],
 visuals:[V_SECANT],
 we:[{id:'s122.we1',prompt:`Find the average rate of change of ${F_DISTANCE.rule} from t = 1 to t = 3.`,steps:[['Find the function values at both ends of the interval.',`At t = 1 the value is ${num(valueAt(F_DISTANCE,1))} and at t = 3 it is ${num(valueAt(F_DISTANCE,3))}.`],['Divide the change in the function by the change in the input.','That is the definition of the average rate, and also the slope of the secant joining the two points.'],[`The result is ${rate(F_DISTANCE,1,3)} metres per second.`,'It is an average across the whole interval, not the speed at any one instant.']],answer:`${rate(F_DISTANCE,1,3)} metres per second.`},
  {id:'s122.we2',prompt:`How do the secant slopes of ${V_SECANT.functionRule} behave as the second point approaches P at x = 1?`,steps:[[`From the points used here the slopes are ${V_SECANT.movers.map(m=>m.slope).join(', ')}.`,'Each is the slope of a secant from P to a point further along the curve.'],['Each is smaller than the last, and the gaps between them are closing.','The second point is getting nearer to P, so the secant is turning less each time.'],[`They approach a single value: ${describeLimit(V_SECANT.limitingSlope).replace('the limit is ','')}.`,'That approached value is the slope of the tangent at P.']],answer:`They approach ${describeLimit(V_SECANT.limitingSlope).replace('the limit is ','')}.`},
  {id:'s122.we3',prompt:`Why is the average rate from t = 1 to t = 1.5, which is ${rate(F_DISTANCE,1,1.5)}, closer to the instantaneous rate at t = 1 than the average from t = 1 to t = 3?`,steps:[['The shorter interval allows the function less room to change its behaviour.','Over a long interval a single average hides everything that happened inside it.'],[`The averages are ${rate(F_DISTANCE,1,3)} over the long interval and ${rate(F_DISTANCE,1,1.5)} over the short one.`,'Each is correct for its own interval; they differ because the intervals differ.'],['Shrinking the interval further keeps improving the approximation, which is why the instantaneous rate is defined by closing the interval rather than by choosing a short one.','No particular short interval is the answer; the value they approach is.']],answer:'Because a shorter interval leaves less room for the rate to vary within it.'}],
 g:[{id:'s122.g1',prompt:'What does the slope of a secant measure?',hint:'Two points, one interval.',answer:'The average rate of change across the interval between its two points.',why:'The secant slope is the change in the function divided by the change in the input, which is exactly that average.'},
  {id:'s122.g2',prompt:'What is a tangent, in terms of secants?',hint:'What happens as the points close together?',answer:'The line the secants approach as the second point moves to the first.',why:'Defining it this way works for every curve, unlike describing it as a line touching at one point.'},
  {id:'s122.g3',prompt:`What is the average rate of change of ${F_DISTANCE.rule} from t = 1 to t = 2?`,hint:'Values at both ends, then divide.',answer:`${rate(F_DISTANCE,1,2)} metres per second.`,why:`The values are ${num(valueAt(F_DISTANCE,1))} and ${num(valueAt(F_DISTANCE,2))}, and the interval has width 1.`}],
 i:[{id:'s122.i1',prompt:`Find the average rate of change of ${V_SECANT.functionRule} from x = 1 to x = 3.`,answer:`${rate(F_SQUARE,1,3)}.`,why:`The values are ${num(valueAt(F_SQUARE,1))} and ${num(valueAt(F_SQUARE,3))}, and the interval has width 2.`},
  {id:'s122.i2',prompt:'Can the average rate of change across an interval equal the instantaneous rate at one of its ends?',answer:'Sometimes, but not in general.',why:'The average describes the whole interval; only for special functions, such as a straight line, is it the same at every point.'},
  {id:'s122.i3',prompt:'Why can a tangent not be defined as a line meeting the curve exactly once?',answer:'Because such a line may meet the curve again elsewhere, and some tangents cross the curve at the point itself.',why:'The approached-position definition describes what a tangent does locally, which is what matters.'},
  {id:'s122.i4',prompt:'What is the width of the interval used for an instantaneous rate?',answer:'There is none; the interval closes to nothing.',why:'The instantaneous rate is the value the averages approach as the width shrinks, not the average over any particular width.'}],
 td:[{id:'s122.td1',prompt:'A secant slope is an average across an interval and a tangent slope is a rate at a single point. Why does a quantity that needs two points to be defined still make sense at one?',reasoning:'Because the value at the single point is not computed from one point — it is the value the two-point answers approach as the two points merge. You can never actually use an interval of zero width, which is why the division would be meaningless there. What the method does instead is ask what the answers are tending towards, and that question has an answer even where the direct calculation has none. That move, from a quantity you cannot evaluate to a value it approaches, is exactly the idea the next lesson makes precise.'}],
 summary:`The average rate of change across an interval is the slope of the secant joining the endpoints. As the second point approaches the first, those slopes approach a single value — for ${V_SECANT.functionRule} at x = 1 the secant slopes ${V_SECANT.movers.map(m=>m.slope).join(', ')} approach ${describeLimit(V_SECANT.limitingSlope).replace('the limit is ','')} — and that value is the slope of the tangent, the instantaneous rate of change.`,
 next:'Next you will make precise what "approaches" means.',
 t:['Build the tangent as the limiting position of secants, and the instantaneous rate as the value averages approach.',['Slope','Functions'],['"the value the secant slopes approach" rather than "the slope at a point"'],['Show the secants turning as the second point closes in; the tangent then arrives as a position rather than a definition to memorise.','Resist the touches-once description — it is the misconception this lesson exists to prevent.'],['Ask what a secant slope measures.'],['Compute two averages over different intervals before any graph.'],['Ask what the interval width is for an instantaneous rate.']]} as unknown as L),

lesson({ id:'ncert_kemh1_s12_3_intuitive_limit_lesson', sec:'12.3', title:'Intuitive Idea of Derivatives and Limits', page:223,
 prereq:['ncert_kemh1_s12_2'], assume:['Rate of change','Functions and their domains'],
 notIntroduce:[['Limits of polynomials and rational functions','ncert_kemh1_s12_3_1']],
 goal:'You will say what it means for a function to approach a value near a point, and see that this is a different question from its value at the point.',
 checks:['Say what the domain of a function is.','Describe the tangent as a limiting position.'], ifNot:'Revisit the previous lesson; a limit is that same approaching idea, written for any function.',
 vocab:[['limit','The value a function approaches as its input approaches a point.'],
  ['approaches','Gets arbitrarily close to, without necessarily reaching.']],
 expl:[`Write lim as x tends to a of f(x) for the value f(x) approaches as x approaches a. The arrow matters: x moves towards a and never equals it, so the value of f at a is a separate question.`,
  `Take ${F_HOLE.rule}. At x = 1 the denominator is zero, so the function has ${num(valueAt(F_HOLE,1))} there — it is not in the domain.`,
  `But look at what happens nearby. As x closes in on 1 from below the values rise towards 2, and from above they fall towards 2. So ${lim(F_HOLE,1)}.`,
  `Put the two together: ${cmp(F_HOLE,1)}. A function can have no value at a point and still have a limit there, because the limit never asks about the point itself.`,
  `The two can also disagree without either being missing, and sometimes there is no limit at all. For the signum function at 0, ${lim(F_SIGNUM,0)}`,
  'That is the rule for a two-sided limit: both sides must approach the same value. If the left and the right settle on different numbers, no single value is being approached, and the limit does not exist.',
  'A table of nearby values is evidence for what is happening, not the definition. The limit is a statement about behaviour near the point, and a table simply lets you see that behaviour.'],
 rep:['A table of values closing in on a point from both sides, with the approached value marked'],
 visuals:[V_TABLE_HOLE, V_TABLE_DNE],
 we:[{id:'s123.we1',prompt:`Does ${F_HOLE.rule} have a value at x = 1, and does it have a limit there?`,steps:[[`Substituting 1 makes the denominator zero, so the function has ${num(valueAt(F_HOLE,1))} at that point.`,'A zero denominator puts the point outside the domain.'],['Now look at values on either side of 1 rather than at 1.','The limit asks only about nearby behaviour.'],[`They close in on the same number from both sides, so ${lim(F_HOLE,1)}.`,`In short, ${cmp(F_HOLE,1)}.`]],answer:`No value at x = 1, but ${lim(F_HOLE,1)}.`},
  {id:'s123.we2',prompt:'Why does the signum function have no limit at 0?',steps:[['For every negative x the value is \u22121, and for every positive x it is 1.','The function is constant on each side, but with different constants.'],['Approaching 0 from the left therefore settles on \u22121, and from the right on 1.','Each side has its own settled value.'],[`The two disagree, so ${lim(F_SIGNUM,0)}`,'A two-sided limit needs one value approached from both directions.']],answer:'Because the two sides approach different values.'},
  {id:'s123.we3',prompt:`Is the value of ${F_SQUARE.rule} at x = 2 the same as its limit there?`,steps:[[`The function is defined everywhere, so its value at 2 is ${num(valueAt(F_SQUARE,2))}.`,'Nothing excludes the point from the domain.'],['Values on both sides of 2 close in on the same number.',`So ${lim(F_SQUARE,2)}.`],[`Here ${cmp(F_SQUARE,2)}.`,'They agree in this case, but that agreement is a fact about this function, not a definition of limit.']],answer:`Yes: ${cmp(F_SQUARE,2)}.`}],
 g:[{id:'s123.g1',prompt:'Does x \u2192 a mean x = a?',hint:'What does the arrow describe?',answer:'No.',why:'x moves towards a without taking that value, which is why a limit can exist where the function has none.'},
  {id:'s123.g2',prompt:'What must be true for a two-sided limit to exist?',hint:'Count the directions.',answer:'Both sides must approach the same value.',why:'If the left and right settle on different numbers, no single value is being approached.'},
  {id:'s123.g3',prompt:'Can a function have a limit at a point where it has no value?',hint:'Think of the hole.',answer:'Yes.',why:'The limit describes nearby behaviour, and nearby behaviour does not depend on the point itself.'}],
 i:[{id:'s123.i1',prompt:`What is the limit of ${F_HOLE.rule} as x approaches 1?`,answer:`${lim(F_HOLE,1).replace('the limit is ','')}.`,why:'Values on both sides close in on that number, even though the function has no value at 1.'},
  {id:'s123.i2',prompt:'If a table of nearby values is rising towards 5 from one side and falling towards 5 from the other, what is the limit?',answer:'5.',why:'Both sides approach the same value, which is what a two-sided limit requires.'},
  {id:'s123.i3',prompt:'Does a table of values prove a limit?',answer:'No; it is evidence for what the function is doing.',why:'The limit is a statement about behaviour near the point; a table lets you observe that behaviour but does not define it.'},
  {id:'s123.i4',prompt:'What does it mean to say a limit does not exist?',answer:'That no single value is being approached.',why:'Either the two sides disagree, or the values fail to settle at all.'}],
 td:[{id:'s123.td1',prompt:'Why is it useful to have an idea that deliberately ignores the value of the function at the very point you are asking about?',reasoning:'Because the interesting questions are exactly the ones where the value at the point is missing or unhelpful. The rate of change in the previous lesson needed an interval of zero width, which cannot be evaluated. By asking what the nearby answers approach rather than what the answer at the point is, you get a usable value where direct evaluation gives nothing. Ignoring the point is not a limitation of the idea; it is what makes it work.'}],
 summary:`The limit of f as x approaches a is the value f approaches near a, which is a different question from its value at a. For ${F_HOLE.rule} at 1, ${cmp(F_HOLE,1)}. A two-sided limit exists only when both sides approach the same value, which is why ${lim(F_SIGNUM,0)}`,
 next:'Next you will compute limits for polynomials and rational functions.',
 t:['Define a limit as behaviour near a point, distinct from the value at the point.',['Rate of change','Domain'],['"approaches" and "at", used as deliberately different words'],['The hole example is the whole lesson; show that the function is undefined at 1 before showing the limit is 2.','Never introduce limits by substitution, or the distinction collapses at once.'],['Ask whether x \u2192 a means x = a.'],['Read the table from both sides before saying any value.'],['Ask what happens when the two sides disagree.']]} as unknown as L),


lesson({ id:'ncert_kemh1_s12_3_1_polynomial_rational_lesson', sec:'12.3.1', title:'Limits of Polynomials and Rational Functions', page:228,
 prereq:['ncert_kemh1_s12_3'], assume:['The intuitive idea of a limit','Domain of a rational function'],
 goal:'You will compute limits of polynomials and rational functions, including the case where a factor cancels and the original function still has a hole.',
 checks:['Say when a rational function is undefined.','State what a two-sided limit requires.'], ifNot:'Revisit the previous lesson; the hole example there is the case this lesson generalises.',
 vocab:[['direct substitution','Finding a limit by evaluating the function at the point, which is valid only when the point is in the domain and the function behaves smoothly there.']],
 expl:[`A polynomial has every real number in its domain and no jumps, so its values near a point close in on its value at that point. For ${F_POLY.rule} at x = 2, ${lim(F_POLY,2)}, and ${cmp(F_POLY,2)}.`,
  'So for polynomials, substituting the point gives the limit. That is a property of polynomials, not the meaning of a limit, and the distinction matters as soon as the function is a quotient.',
  `For a rational function, first ask whether the point is in the domain. For ${F_RATIONAL_OK.rule} at x = 1 the denominator is not zero, so substitution is available and ${lim(F_RATIONAL_OK,1)}.`,
  `When the denominator is zero the point is outside the domain and substitution is unavailable. ${F_HOLE.rule} at x = 1 is the case from the previous lesson: the function has ${num(valueAt(F_HOLE,1))} there.`,
  `But the numerator is zero there too, and it factors. Away from x = 1 the expression agrees exactly with ${F_SIMPLE.rule}, so the nearby behaviour is that of the simpler expression, and ${lim(F_HOLE,1)}.`,
  `This is where care is needed. Cancelling tells you about behaviour near the point; it does not change the function. ${F_HOLE.rule} is still undefined at 1 — ${cmp(F_HOLE,1)} — while ${F_SIMPLE.rule} is perfectly well defined there. The two agree everywhere except at the hole, and the hole stays.`,
  `Cancelling is not always available. For ${F_BLOWUP.rule} at x = 1 the numerator is not zero, so nothing cancels: ${lim(F_BLOWUP,1)}`],
 rep:['A table of values approaching a point where the function has a hole, and the simpler expression that agrees everywhere else'],
 visuals:[V_TABLE_HOLE],
 we:[{id:'s1231.we1',prompt:`Find the limit of ${F_POLY.rule} as x approaches 2.`,steps:[['This is a polynomial, so every real number is in its domain.','Nothing is excluded and there are no jumps.'],[`Its values near 2 therefore close in on its value at 2, which is ${num(valueAt(F_POLY,2))}.`,'For polynomials, substitution is available because of how they behave, not by definition.'],[`So ${lim(F_POLY,2)}.`,`Here ${cmp(F_POLY,2)}.`]],answer:`${lim(F_POLY,2).replace('the limit is ','')}.`},
  {id:'s1231.we2',prompt:`Find the limit of ${F_HOLE.rule} as x approaches 1.`,steps:[[`Check the domain first: at x = 1 the denominator is zero, so the function has ${num(valueAt(F_HOLE,1))} there and substitution is unavailable.`,'Direct substitution is only an option when the point is in the domain.'],[`The numerator factors, and away from x = 1 the expression agrees with ${F_SIMPLE.rule}.`,'The two expressions are equal for every x except the excluded one.'],[`So the nearby behaviour is that of the simpler expression, and ${lim(F_HOLE,1)}.`,`The original function is still undefined at 1: ${cmp(F_HOLE,1)}.`]],answer:`${lim(F_HOLE,1).replace('the limit is ','')}, with the function undefined at 1.`},
  {id:'s1231.we3',prompt:`Why does cancelling not work for ${F_BLOWUP.rule} at x = 1?`,steps:[['Cancelling needs a common factor in numerator and denominator.','That is what allows the expression to agree with a simpler one away from the point.'],['Here the numerator is 1, which shares no factor with the denominator.','There is nothing to cancel, so no simpler expression is available.'],[`The values grow without bound instead of settling, so ${lim(F_BLOWUP,1)}`,'A zero denominator does not by itself guarantee that a limit exists.']],answer:'Because the numerator is not zero there, so no factor cancels.'}],
 g:[{id:'s1231.g1',prompt:'When is direct substitution valid for a rational function?',hint:'Check the denominator first.',answer:'When the point is in the domain, so the denominator is not zero there.',why:'Outside the domain the function has no value to substitute, and the limit must be found another way.'},
  {id:'s1231.g2',prompt:`After cancelling, is ${F_HOLE.rule} defined at x = 1?`,hint:'Did the function change?',answer:'No.',why:'Cancelling describes nearby behaviour; the original function is still excluded at that point.'},
  {id:'s1231.g3',prompt:'Does a zero denominator always mean the limit does not exist?',hint:'Compare the two examples.',answer:'No.',why:'If the numerator is also zero a factor may cancel and the limit may exist; if not, the values grow without bound.'}],
 i:[{id:'s1231.i1',prompt:`Find the limit of ${F_RATIONAL_OK.rule} as x approaches 1.`,answer:`${lim(F_RATIONAL_OK,1).replace('the limit is ','')}.`,why:'The denominator is not zero at 1, so the point is in the domain and substitution is available.'},
  {id:'s1231.i2',prompt:'Why is substitution valid for every polynomial?',answer:'Because every real number is in the domain and the values nearby close in on the value at the point.',why:'It is a property of how polynomials behave, not the definition of a limit.'},
  {id:'s1231.i3',prompt:'Two expressions agree everywhere except at one point. Must they have the same limit there?',answer:'Yes.',why:'A limit depends only on nearby behaviour, and the two agree at every nearby point.'},
  {id:'s1231.i4',prompt:'Must they have the same value at that point?',answer:'No.',why:'One may be defined there and the other not, which is exactly the hole case.'}],
 td:[{id:'s1231.td1',prompt:'Cancelling a factor gives the right limit but the wrong function. Why is that not a contradiction?',reasoning:'Because the two expressions are being used to answer two different questions. The limit asks only about x values near the point, and on every one of those the original and the simplified expression give identical answers, so either may be used. The domain asks about the point itself, where only the simplified expression has a value. Treating cancelling as a rewrite of the function would lose the hole; treating it as a statement about nearby agreement keeps both facts intact. That is why the domain is checked before anything is cancelled, not after.'}],
 summary:`For a polynomial, substitution gives the limit because every point is in the domain. For a rational function, check the domain first: where the denominator is non-zero, substitute; where both numerator and denominator vanish, a factor may cancel and the limit exists even though the original function keeps its hole, as with ${F_HOLE.rule} at 1. Where nothing cancels, ${lim(F_BLOWUP,1)}`,
 next:'Next you will meet limits of trigonometric, exponential and logarithmic functions.',
 t:['Compute polynomial and rational limits, including the cancelling case, without losing the original domain.',['Intuitive limit','Rational domain'],['"check the domain first", every time, before any substitution'],['The hole surviving cancellation is the point of the lesson; ask after every cancellation whether the original is defined there.','Keep the non-cancelling example alongside, or students conclude that a zero denominator always cancels.'],['Ask whether substitution is valid before computing.'],['State the domain aloud before touching the algebra.'],['Ask what happens when only the denominator is zero.']]} as unknown as L),

lesson({ id:'ncert_kemh1_s12_4_trig_exp_log_lesson', sec:'12.4', title:'Limits of Trigonometric, Exponential and Logarithmic Functions', page:233,
 prereq:['ncert_kemh1_s12_3_1','ncert_kemh1_s3_3'], assume:['Limits of rational functions','Radian measure','Trigonometric functions'],
 goal:'You will use the standard limits for trigonometric, exponential and logarithmic functions, and see why radian measure is essential to them.',
 checks:['Convert a degree measure to radians.','Say when direct substitution is available.'], ifNot:'Revisit radian measure; the standard trigonometric limit is false without it.',
 vocab:[['standard limit','A limit result established once and then used as a known fact.']],
 expl:[`Some limits cannot be reached by substitution at all. For ${F_SINC.rule} at x = 0 the denominator is zero and nothing cancels, so the function has ${num(valueAt(F_SINC,0))} there.`,
  `Yet the values do settle. Approaching 0 from both sides, ${lim(F_SINC,0)}. This is the first standard limit, and it is used as a known result rather than re-derived each time.`,
  'It depends entirely on measuring angles in radians. The radian is defined so that arc length equals angle times radius, which is what makes sin x and x comparable for small x. In degrees the same quotient approaches a quite different number, so the result would simply be false.',
  'That is why the typed angle semantics matter here. An angle carried in degrees cannot be substituted into this limit, and the model keeps the two measures apart rather than treating a number as an angle.',
  `The exponential and logarithmic families give two more. For ${F_EXP.rule} at 0, ${lim(F_EXP,0)}, and for ${F_LOG.rule} at 0, ${lim(F_LOG,0)}.`,
  `Each has the same shape as the trigonometric one: the function has ${num(valueAt(F_EXP,0))} at the point, because the denominator vanishes there, and yet the nearby values settle on a definite number.`,
  'These three are the standard limits this chapter uses. They are results to know, and each is a statement about behaviour near zero rather than a value at zero.'],
 rep:['A table of values of sin x over x closing in on zero from both sides, with x in radians'],
 visuals:[V_TABLE_SINC],
 we:[{id:'s124.we1',prompt:`Why can the limit of ${F_SINC.rule} at 0 not be found by substitution?`,steps:[['Substituting zero makes the denominator zero.','The point is outside the domain, so the function has no value there.'],['The numerator is also zero, but sin x has no factor of x to cancel in the way a polynomial would.','So the rational-function cancelling method is unavailable.'],[`The values nevertheless settle: ${lim(F_SINC,0)}, which is why it is recorded as a standard limit.`,'It is established once and then used.']],answer:`Because the function has ${num(valueAt(F_SINC,0))} at 0; the limit is ${lim(F_SINC,0).replace('the limit is ','')}.`},
  {id:'s124.we2',prompt:'Why must x be in radians for that standard limit?',steps:[['The radian is defined so that the arc cut off on a unit circle has the same measure as the angle.','That is what puts sin x and x on the same scale for small x.'],['In degrees the angle number is about fifty-seven times larger for the same rotation.','The sine is unchanged, so the quotient is scaled by that factor.'],['The quotient would then approach a different number entirely, so the standard limit would be false.','This is why the angle measure is carried as part of the angle rather than as a bare number.']],answer:'Because the result depends on sin x and x being on the same scale, which only radian measure gives.'},
  {id:'s124.we3',prompt:`What is the limit of ${F_EXP.rule} as x approaches 0, and does the function have a value there?`,steps:[[`At x = 0 the denominator is zero, so the function has ${num(valueAt(F_EXP,0))} there.`,'The same shape as the trigonometric case.'],['Values on both sides of 0 close in on the same number.','Neither side disagrees with the other.'],[`So ${lim(F_EXP,0)}.`,'Another standard limit, used as a known result.']],answer:`${lim(F_EXP,0).replace('the limit is ','')}, with no value at 0.`}],
 g:[{id:'s124.g1',prompt:`What is the limit of ${F_SINC.rule} as x approaches 0?`,hint:'The first standard limit.',answer:`${lim(F_SINC,0).replace('the limit is ','')}.`,why:'The values settle on it from both sides, with x measured in radians.'},
  {id:'s124.g2',prompt:'Would that result hold with x in degrees?',hint:'Compare the two scales.',answer:'No.',why:'The degree measure of the same angle is about fifty-seven times larger, so the quotient approaches a different number.'},
  {id:'s124.g3',prompt:`What is the limit of ${F_LOG.rule} as x approaches 0?`,hint:'A standard limit of the same shape.',answer:`${lim(F_LOG,0).replace('the limit is ','')}.`,why:'The denominator vanishes at 0, but the nearby values settle on that number from both sides.'}],
 i:[{id:'s124.i1',prompt:`Does ${F_SINC.rule} have a value at x = 0?`,answer:'No.',why:'The denominator is zero there, so the point is outside the domain even though the limit exists.'},
  {id:'s124.i2',prompt:'What do the three standard limits in this section have in common?',answer:'Each has a zero denominator at the point, and each still settles on a definite value nearby.',why:'All three are statements about behaviour near zero rather than values at zero.'},
  {id:'s124.i3',prompt:'Why is a standard limit worth naming rather than recomputing?',answer:'Because it is used repeatedly as a known result.',why:'Establishing it once lets later work rest on it instead of redoing the same reasoning.'},
  {id:'s124.i4',prompt:`What is the limit of ${F_EXP.rule} as x approaches 0?`,answer:`${lim(F_EXP,0).replace('the limit is ','')}.`,why:'The values approach it from both sides, although the function has no value at 0.'}],
 td:[{id:'s124.td1',prompt:'The standard trigonometric limit is true in radians and false in degrees. What does that say about what a trigonometric function actually takes as input?',reasoning:'It says the input is an angle, not a number, and that the number standing for it depends on the unit chosen. Writing sin x and x in the same quotient only makes sense once both are measured on the same scale, which is what the radian provides by definition: the angle and the arc it cuts on a unit circle are the same quantity. In degrees the two are no longer comparable, so the quotient is multiplied by a conversion factor and settles elsewhere. A result that changes with the unit is a warning that the unit is part of the mathematics, not a presentational choice.'}],
 summary:`Three standard limits are established here: ${lim(F_SINC,0)} for ${F_SINC.rule}, ${lim(F_EXP,0)} for ${F_EXP.rule}, and ${lim(F_LOG,0)} for ${F_LOG.rule}. Each function has no value at 0, and each depends on nearby behaviour alone; the trigonometric one holds only in radian measure.`,
 next:'The remaining sections of this chapter build the derivative itself.',
 t:['Use the standard trigonometric, exponential and logarithmic limits, with radian measure treated as essential.',['Rational limits','Radian measure'],['"in radians" every time the trigonometric limit is stated'],['Compute the degree version once so students see a different number; the dependence then looks structural rather than pedantic.','All three have the same shape — no value at the point, a settled value nearby — which is worth naming explicitly.'],['Ask whether the function has a value at 0.'],['State the angle measure before writing the limit.'],['Ask what these standard limits will be used for later.']]} as unknown as L),

];
