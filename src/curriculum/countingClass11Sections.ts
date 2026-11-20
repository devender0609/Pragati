// ===========================================================================
// v0.84.0-c11.22 checkpoint 88 — CLASS 11 CHAPTER 6, PERMUTATIONS AND
// COMBINATIONS.
//
// Authored before Binomial Theorem because C11-BIN-01 needs BOTH
// C11-IND-01, authored at checkpoint 87, and C11-PNC-05, authored here.
// Until now only one of the two existed.
//
// Every count a student reads comes from `counting.ts`, which derives it
// from whether order matters and whether the objects are distinguishable.
// Nothing in this file multiplies anything by hand.
// ===========================================================================

import type { AuthoredSection } from './authoredSection';
import { type L, makeLesson } from './class11Lesson';
import {
  type CountResult, arrangementFigure, combinations, countRepeated, countStaged,
  countWithFixedPositions, describeCount, enumerateRepeated, enumerateSelection,
  factorial, fallingFactorial, permutations, repeatedArrangement, stageTree, stagedChoice,
} from './counting';

export const PNC_C11_CHAPTER_ID = 'ncert_kemh1_ch06';
const BOOK = 'Mathematics, Textbook for Class XI (NCERT, Reprint 2026-27)';
const SRC = 'kemh1';
const INSPECTED = '2026-10-26';

const source = (sec: string, title: string, page: number) => {
  const parts = sec.split('.');
  const parent = parts.length > 2 ? parts.slice(0, 2).join('.') : sec;
  return {
    officialChapterId: PNC_C11_CHAPTER_ID,
    officialSectionId: `ncert_kemh1_s${parent.replace(/\./g, '_')}`,
    ...(parts.length > 2 ? { officialSubsectionNumber: sec } : {}),
    sectionNumber: parent, exactTitle: title, startPage: page,
    textbook: BOOK, sourceReference: SRC, inspectionDate: INSPECTED,
  };
};

const lesson = (l: L): AuthoredSection => makeLesson(l, source);

// --- canonical counting objects, every figure derived from them -----------
export const SC_CLOTHES = stagedChoice('sc_clothes', [
  { name: 'shirt', choices: 3 },
  { name: 'trousers', choices: 4 },
]);
export const SC_THREE = stagedChoice('sc_three', [
  { name: 'starter', choices: 2 },
  { name: 'main', choices: 3 },
  { name: 'pudding', choices: 2 },
]);
export const REP_AABC = repeatedArrangement('rep_aabc', 4, [
  { label: 'A', count: 2 }, { label: 'B', count: 1 }, { label: 'C', count: 1 },
]);
export const REP_LETTERS = repeatedArrangement('rep_letters', 6, [
  { label: 'A', count: 3 }, { label: 'B', count: 2 }, { label: 'C', count: 1 },
]);

const n = (r: CountResult) => describeCount(r);
const P = (a: number, b: number) => n(permutations(a, b));
const C = (a: number, b: number) => n(combinations(a, b));
const F = (a: number) => n(factorial(a));

export const V_TREE = stageTree('v_tree', SC_CLOTHES,
  `A branching diagram read from the top down. One point at the top splits into three branches, one for each shirt. Every one of those splits again into four, one for each pair of trousers, giving ${n(countStaged(SC_CLOTHES))} end points in all. Each end point is one complete outfit, and no outfit appears at more than one end point.`);

export const V_TREE_THREE = stageTree('v_tree_three', SC_THREE,
  `A three-level branching diagram. The top point splits into two starters, each of those into three mains, and each of those into two puddings, giving ${n(countStaged(SC_THREE))} end points. Each end point is one complete meal, read by following a single path from the top.`);

export const V_ARRANGEMENT = arrangementFigure('v_arrangement', REP_AABC,
  `A list of every distinct arrangement of the four letters A, A, B and C. There are ${n(countRepeated(REP_AABC))} of them rather than twenty-four, because swapping the two identical A letters does not produce a different arrangement, and each arrangement is written once.`);

export const CANONICAL_COUNTING_VISUALS = [V_TREE, V_TREE_THREE, V_ARRANGEMENT];

export const C11_PNC_SECTIONS: AuthoredSection[] = [

lesson({ id:'ncert_kemh1_s6_2_counting_principle_lesson', sec:'6.2', title:'Fundamental Principle of Counting', page:114,
 assume:['Multiplication','Listing outcomes'],
 notIntroduce:[['Factorial notation','ncert_kemh1_s6_3_1'],['Permutations','ncert_kemh1_s6_3']],
 goal:'You will count the outcomes of a choice made in stages, without listing them all.',
 checks:['Multiply two whole numbers.','List the outcomes of a small choice.'], ifNot:'Try listing a small case first; this lesson is about what to do when the list gets too long.',
 vocab:[['stage','One of the successive choices making up a whole decision.'],
  ['outcome','One complete set of choices, one from each stage.'],
  ['fundamental principle of counting','If one stage can be done in m ways and the next in n ways, the two together can be done in mn ways.']],
 expl:[`Suppose you pick a shirt from ${SC_CLOTHES.stages[0].choices} and trousers from ${SC_CLOTHES.stages[1].choices}. You could list every outfit, and for small numbers that works.`,
  `Listing is reliable but it does not scale, and it hides the structure. Notice instead that each of the ${SC_CLOTHES.stages[0].choices} shirts can go with any of the ${SC_CLOTHES.stages[1].choices} pairs of trousers. That gives ${SC_CLOTHES.stages[1].choices} outfits per shirt, and ${SC_CLOTHES.stages[0].choices} shirts, so ${n(countStaged(SC_CLOTHES))} outfits altogether.`,
  'That is the fundamental principle of counting: when a decision is made in stages and every choice at one stage can be followed by every choice at the next, multiply the numbers of choices.',
  'The multiplication is not a rule to memorise. It is what "every choice pairs with every choice" means in arithmetic, and it fails the moment that condition fails — if a particular shirt ruled out a particular pair of trousers, the stages would no longer be independent and the product would overcount.',
  `A branching diagram makes the structure visible. One point splits into ${SC_CLOTHES.stages[0].choices} branches, each of those into ${SC_CLOTHES.stages[1].choices}, and the end points are the outcomes. A tree is trustworthy only when every valid outcome appears at exactly one end point, which is why the branches must be drawn from the choices rather than sketched by eye.`,
  `The principle extends to any number of stages. A meal with ${SC_THREE.stages.map(x=>x.choices).join(', ')} choices at its three stages has ${n(countStaged(SC_THREE))} possible meals, and the diagram simply grows another level.`],
 rep:['A branching diagram with one point splitting into branches for each stage, and the outcomes at the end points'],
 visuals:[V_TREE, V_TREE_THREE],
 we:[{id:'s62.we1',prompt:`How many outfits can be made from ${SC_CLOTHES.stages[0].choices} shirts and ${SC_CLOTHES.stages[1].choices} pairs of trousers?`,steps:[['There are two stages: choose a shirt, then choose trousers.','Naming the stages is what makes the principle applicable.'],[`Every shirt can be worn with every pair of trousers, so each of the ${SC_CLOTHES.stages[0].choices} shirts gives ${SC_CLOTHES.stages[1].choices} outfits.`,'This is the condition the principle needs: the stages do not restrict each other.'],[`Multiplying gives ${n(countStaged(SC_CLOTHES))} outfits.`,'The same number appears as the end points of the branching diagram.']],answer:`${n(countStaged(SC_CLOTHES))} outfits.`},
  {id:'s62.we2',prompt:`A meal has ${SC_THREE.stages.map(x=>`${x.choices} ${x.name}s`).join(', ')}. How many meals are possible?`,steps:[['There are three stages, each independent of the others.','Any starter can be followed by any main, and any main by any pudding.'],[`So the count is ${SC_THREE.stages.map(x=>x.choices).join(' × ')}.`,'One factor per stage, in the order the choices are made.'],[`That gives ${n(countStaged(SC_THREE))} meals.`,'The principle extends to any number of stages without changing.']],answer:`${n(countStaged(SC_THREE))} meals.`},
  {id:'s62.we3',prompt:'Why would the multiplication be wrong if one shirt could not be worn with one pair of trousers?',steps:[['The principle assumes every choice at one stage can be followed by every choice at the next.','That is what lets each first choice contribute the same number of outcomes.'],['If one combination is forbidden, one shirt contributes fewer outfits than the others.','The stages are no longer independent.'],[`The product would count an outfit that does not exist, so the true number would be one less than ${n(countStaged(SC_CLOTHES))}.`,'The condition is part of the principle, not a detail around it.']],answer:'Because the stages would no longer be independent.'}],
 g:[{id:'s62.g1',prompt:'A password has 2 letters then 3 digits, chosen from 5 letters and 4 digits with repeats allowed. How many stages are there?',hint:'Count the choices made, not the kinds.',answer:'Five.',why:'Each letter and each digit is its own choice, so there are five successive stages.'},
  {id:'s62.g2',prompt:'How many outcomes come from stages with 2 and 6 choices?',hint:'Multiply.',answer:'12.',why:'Each of the 2 first choices can be followed by any of the 6 second ones.'},
  {id:'s62.g3',prompt:'When does the multiplication principle not apply?',hint:'What must be true of the stages?',answer:'When a choice at one stage rules out a choice at another.',why:'The principle needs every combination to be available; otherwise some first choices contribute fewer outcomes.'}],
 i:[{id:'s62.i1',prompt:'How many two-digit codes use a first digit from 4 options and a second from 5?',answer:'20.',why:'Four first choices, each followed by five second choices.'},
  {id:'s62.i2',prompt:'Why is a branching diagram only trustworthy if each outcome appears once?',answer:'Because a repeated end point would count the same outcome twice.',why:'The diagram is meant to show the outcomes exactly, so a duplicate makes its total wrong.'},
  {id:'s62.i3',prompt:'Does the order in which you consider the stages change the total?',answer:'No.',why:'Multiplication gives the same product whatever order the factors are taken in.'},
  {id:'s62.i4',prompt:'Why not simply list the outcomes every time?',answer:'Because the list grows too long to write.',why:`Three stages already give ${n(countStaged(SC_THREE))} outcomes, and adding stages multiplies the length again.`}],
 td:[{id:'s62.td1',prompt:'Multiplying is a very small piece of arithmetic. Why is it worth naming this as a principle at all?',reasoning:'Because the naming is about the condition, not the arithmetic. Everyone can multiply; what the principle supplies is the question you must answer before you are entitled to. Are the stages really independent? Does every choice here pair with every choice there? Once those are settled the multiplication is trivial, and when they are not, no amount of multiplying will fix it. Nearly every counting error later in the chapter is a case of multiplying when the condition did not hold.'}],
 summary:`When a decision is made in stages and every choice at one stage can be followed by every choice at the next, the number of outcomes is the product of the numbers of choices: ${SC_CLOTHES.stages[0].choices} shirts and ${SC_CLOTHES.stages[1].choices} pairs of trousers give ${n(countStaged(SC_CLOTHES))} outfits. The principle fails as soon as the stages restrict one another.`,
 next:'Next you will meet a short way of writing the products this leads to.',
 t:['Count staged outcomes by multiplying independent choices.',['Multiplication'],['"every choice pairs with every choice" as the condition, stated before multiplying'],['Draw the tree once for a small case so the product is seen rather than asserted.','The failure case — one forbidden combination — teaches the condition better than the rule does.'],['Ask when the principle does not apply.'],['Name the stages aloud before any arithmetic.'],['Ask what happens with a fourth stage.']]} as unknown as L),

lesson({ id:'ncert_kemh1_s6_3_1_factorial_lesson', sec:'6.3.1', title:'Factorial Notation', page:119,
 prereq:['ncert_kemh1_s6_2'], assume:['The fundamental principle of counting','Multiplication of whole numbers'],
 goal:'You will write and use factorial notation for the products that counting keeps producing.',
 checks:['Multiply a run of consecutive whole numbers.','State the fundamental principle of counting.'], ifNot:'Revisit the counting principle; factorials are shorthand for the products it produces.',
 vocab:[['factorial','The product of all the whole numbers from 1 up to n, written n!.']],
 expl:['Counting problems keep producing the same shape of product: a run of consecutive whole numbers multiplied together. Writing that out becomes unwieldy, so it gets a name.',
  `For a whole number n, n! means the product of every whole number from 1 up to n. So 5! is 1 × 2 × 3 × 4 × 5, which is ${F(5)}.`,
  `Factorials grow very fast. 5! is ${F(5)}, 10! is already ${F(10)}, and 20! is ${F(20)}. That growth is why the shorthand earns its place, and why these counts must be kept as exact whole numbers rather than rounded.`,
  `The source also defines 0! = ${F(0)}. That is a definition rather than a product with no factors evaluated by accident, and it is made so that the formulas in the next lessons work without a special case at the ends.`,
  'A useful relationship falls out immediately: n! is n times (n − 1)!. Each factorial contains the one below it, which is exactly why large factorials cancel so neatly in a quotient.',
  `That cancelling matters in practice. The quotient 7!/4! does not need both factorials worked out: everything from 1 up to 4 appears in both, so what remains is 5 × 6 × 7, which is ${n(fallingFactorial(7,3))}.`,
  'Factorials are defined only for whole numbers that are not negative. A factorial of a negative number or a fraction has no meaning at this level, and asking for one is a question without an answer rather than a calculation that returns something odd.'],
 rep:['A factorial written out as a product, with the smaller factorial inside it marked'],
 we:[{id:'s631.we1',prompt:'Work out 6!.',steps:[['6! means the product of every whole number from 1 up to 6.','That is the definition, read directly.'],['So it is 1 × 2 × 3 × 4 × 5 × 6.','Six factors, in order.'],[`That comes to ${F(6)}.`,`It is also 6 × 5!, which is 6 × ${F(5)}, a useful check.`]],answer:F(6)},
  {id:'s631.we2',prompt:'Simplify 7!/4! without working out either factorial.',steps:[['7! is 1 × 2 × … × 7, and 4! is 1 × 2 × 3 × 4.','Both products start the same way.'],['Every factor of 4! appears in 7!, so those factors cancel.','This is why factorial quotients are easier than they look.'],[`What remains is 5 × 6 × 7, which is ${n(fallingFactorial(7,3))}.`,`Working both out first would have meant ${F(7)} divided by ${F(4)} — the same answer by a much longer route.`]],answer:n(fallingFactorial(7,3))},
  {id:'s631.we3',prompt:'Why is 0! defined to be 1 rather than 0?',steps:[['A product with no factors is not obviously anything, so the value is fixed by definition.','This is a choice the source makes explicitly, not something derived.'],['The definition is chosen so the formulas of the next lessons need no special case.','With 0! = 1 the general expressions stay correct at the extreme values.'],[`So 0! = ${F(0)}.`,'Defining it as 0 would make those formulas collapse to zero, which would be useless.']],answer:F(0)}],
 g:[{id:'s631.g1',prompt:'What is 4!?',hint:'Multiply from 1 up to 4.',answer:F(4),why:'The factorial is the product of every whole number up to that value.'},
  {id:'s631.g2',prompt:'Simplify 9!/8!.',hint:'How much of 9! is 8!?',answer:'9.',why:'9! is 9 × 8!, so everything but the 9 cancels.'},
  {id:'s631.g3',prompt:'Does (−3)! have a value?',hint:'What does the product run over?',answer:'No.',why:'Factorials are defined only for whole numbers that are not negative; there is no product to form.'}],
 i:[{id:'s631.i1',prompt:'What is 7!?',answer:F(7),why:'The product of every whole number from 1 up to 7.'},
  {id:'s631.i2',prompt:'Simplify 10!/7!.',answer:n(fallingFactorial(10,3)),why:'Everything up to 7 cancels, leaving 8 × 9 × 10.'},
  {id:'s631.i3',prompt:'Express 8! using 6!.',answer:'8 × 7 × 6!.',why:'Each factorial contains the one below it, so the extra factors can be written separately.'},
  {id:'s631.i4',prompt:'Which is larger, 5! or 2 × 4!?',answer:'5!.',why:`5! is 5 × 4! while the other is 2 × 4!, so comparing the multipliers is enough: ${F(5)} against 48.`}],
 td:[{id:'s631.td1',prompt:'Factorials grow faster than almost anything else you have met. Why does that matter for counting rather than being a curiosity?',reasoning:'Because it explains why counting problems cannot be solved by listing. Arranging ten objects gives 10! orders, which is over three million; arranging twenty gives a number with nineteen digits. No list of that length can be written, let alone checked, so the only route to the answer is structural. It also explains why the arithmetic must stay exact: a number that large cannot be held approximately and still be a count, since a count is a specific whole number of things and rounding it makes it false.'}],
 summary:`n! is the product of every whole number from 1 up to n, with 0! defined as ${F(0)}. The values grow quickly — 5! is ${F(5)} and 20! is ${F(20)} — and each factorial contains the one below it, which lets quotients such as 7!/4! be simplified by cancelling to ${n(fallingFactorial(7,3))}.`,
 next:'Next you will use these products to count arrangements where order matters.',
 t:['Write and simplify factorials, including quotients, as exact whole numbers.',['Counting principle','Multiplication'],['"from 1 up to n", said as the definition rather than a rule'],['Show the cancellation in a quotient before any large factorial is evaluated; it is the technique the rest of the chapter uses.','Keep the values exact — rounding a count makes it wrong, not merely imprecise.'],['Ask for 9!/8! without a calculator.'],['Write the smaller factorial inside the larger one.'],['Ask why 0! is defined as it is.']]} as unknown as L),


lesson({ id:'ncert_kemh1_s6_3_permutations_lesson', sec:'6.3', title:'Permutations', page:118,
 prereq:['ncert_kemh1_s6_3_1'], assume:['Factorial notation','The fundamental principle of counting'],
 notIntroduce:[['Objects that are not all distinct','ncert_kemh1_s6_3_3'],['Combinations','ncert_kemh1_s6_4']],
 goal:'You will derive the formula for the number of ordered arrangements of r objects chosen from n.',
 checks:['Simplify a factorial quotient.','Apply the counting principle to stages.'], ifNot:'Revisit factorials; the formula here is a factorial quotient produced by counting stages.',
 vocab:[['permutation','An arrangement of objects in which the order matters.'],
  ['nPr','The number of permutations of r objects taken from n distinct objects.']],
 expl:['A permutation is an arrangement where order matters. Taking A then B is a different permutation from taking B then A, even though the same two objects are involved.',
  `That distinction is the whole lesson. From the three objects A, B and C there are ${P(3,2)} ordered pairs, and listing them shows each pair appearing twice in the two possible orders.`,
  'To count them in general, treat filling the positions as stages. The first position can be filled in n ways. The second has one fewer object available, so n − 1 ways. The third has n − 2, and so on.',
  `Filling r positions therefore gives r factors, counting down from n: n × (n − 1) × … with r terms. For 5 objects in 3 positions that is 5 × 4 × 3, which is ${P(5,3)}.`,
  'Now write that product as a factorial quotient. The descending run from n with r factors is exactly what remains when (n − r)! is cancelled out of n!, so the count is n!/(n − r)!, written nPr.',
  `The two routes agree by construction rather than by coincidence. For 5 and 3, the staged product is 5 × 4 × 3 and the quotient is 5!/2!, and both come to ${P(5,3)}.`,
  `The formula needs r to be at most n: you cannot fill more positions than you have objects. Asking for ${P(3,5)} is not a calculation with an unusual answer but a question with no answer at all.`,
  `At the extreme where r equals n, every object is used and the count is n! — for 4 objects, ${P(4,4)} arrangements, which is also ${F(4)}.`],
 rep:['Positions filled one at a time, with the number of remaining choices falling by one at each step'],
 we:[{id:'s63.we1',prompt:'Derive the number of ways to fill 3 positions from 5 distinct objects.',steps:[['Filling the positions is a staged choice, so the counting principle applies.','Each position is one stage.'],['The first position has 5 objects available, the second 4, the third 3.','One object is used up at each stage, so the choices fall by one.'],[`Multiplying gives 5 × 4 × 3 = ${P(5,3)}.`,'Three stages, so three factors counting down from 5.'],[`As a factorial quotient that is 5!/2!, which is the same ${P(5,3)}.`,'The run from 5 downwards is what survives when 2! is cancelled from 5!.']],answer:P(5,3)},
  {id:'s63.we2',prompt:`Why are there ${P(3,2)} ordered pairs from A, B and C rather than ${C(3,2)}?`,steps:[['Order matters in a permutation, so AB and BA are counted separately.','That is the definition being applied.'],[`Listing them confirms it: the pairs are ${enumerateSelection(['A','B','C'],2,true).map(x=>x.join('')).join(', ')}.`,`Six in all, which matches ${P(3,2)}.`],[`If order did not matter there would be only ${C(3,2)}, because each pair would be counted once instead of twice.`,'That is the next lesson; here the two orders are genuinely different arrangements.']],answer:`${P(3,2)}, because each pair is counted in both orders.`},
  {id:'s63.we3',prompt:'How many arrangements use all 4 of 4 distinct objects?',steps:[['Here r equals n, so every object is placed.','There are four positions and four objects.'],['The staged product is 4 × 3 × 2 × 1.','The choices fall by one until none remain.'],[`That is ${P(4,4)}, which is also 4! — the quotient 4!/0! with 0! equal to ${F(0)}.`,'This is where the definition of 0! earns its place: no special case is needed.']],answer:P(4,4)}],
 g:[{id:'s63.g1',prompt:'What does nPr count?',hint:'Does order matter?',answer:'Ordered arrangements of r objects taken from n distinct objects.',why:'Two selections of the same objects in different orders are counted separately.'},
  {id:'s63.g2',prompt:'Work out the number of ordered pairs from 6 objects.',hint:'Two stages.',answer:P(6,2),why:'Six choices for the first position and five for the second.'},
  {id:'s63.g3',prompt:'Why must r be at most n?',hint:'What runs out?',answer:'Because you cannot fill more positions than you have objects.',why:'The staged product would need a stage with no objects left, so no arrangement exists.'}],
 i:[{id:'s63.i1',prompt:'Work out the number of ordered triples from 7 objects.',answer:P(7,3),why:'Seven, then six, then five choices as the positions are filled.'},
  {id:'s63.i2',prompt:'Express the number of ordered pairs from n objects as a factorial quotient.',answer:'n!/(n − 2)!.',why:'Two positions means two factors counting down, which is what cancelling (n − 2)! from n! leaves.'},
  {id:'s63.i3',prompt:'Is AB the same permutation as BA?',answer:'No.',why:'Order matters in a permutation, so the two arrangements are different.'},
  {id:'s63.i4',prompt:'What is the number of arrangements of all 5 of 5 distinct objects?',answer:P(5,5),why:'Every object is used, so the count is 5!.'}],
 td:[{id:'s63.td1',prompt:'The staged product and the factorial quotient give the same answer. Why bother with the second form at all?',reasoning:'Because the two forms are good for different things. The staged product is how you would actually compute a small case, and it shows where the answer comes from: positions filled one at a time with one fewer object each time. The quotient hides that story but makes the structure visible — it shows nPr as a single object built from factorials, which is what lets it be compared with and divided by other such objects. The next lesson divides nPr by r! to reach combinations, and that step is natural in the quotient form and awkward in the product.'}],
 summary:`A permutation is an arrangement where order matters. Filling r positions from n distinct objects gives r factors counting down from n, which equals n!/(n − r)! and is written nPr — for 5 objects in 3 positions, ${P(5,3)}. The formula requires r to be at most n.`,
 next:'Next you will see what changes when some of the objects are identical.',
 t:['Derive nPr from staged position-filling and reconcile it with the factorial quotient.',['Factorials','Counting principle'],['"order matters", said every time a permutation is named'],['Derive by filling positions before the formula appears; the falling choices are the whole idea.','List the six ordered pairs from three objects once — it makes order concrete before it becomes notation.'],['Ask whether AB and BA are the same.'],['Say how many objects remain at each position.'],['Ask what happens when r equals n.']]} as unknown as L),


lesson({ id:'ncert_kemh1_s6_3_3_repeated_objects_lesson', sec:'6.3.3', title:'Permutations When All the Objects Are Not Distinct', page:124,
 prereq:['ncert_kemh1_s6_3'], assume:['Permutations','Factorial notation'],
 goal:'You will count arrangements when some objects are identical, and when some positions are fixed.',
 checks:['Work out nPr for small values.','Simplify a factorial quotient.'], ifNot:'Revisit permutations; this lesson corrects that count when objects repeat.',
 vocab:[['indistinguishable objects','Objects that cannot be told apart, so swapping them does not change the arrangement.']],
 expl:[`Arranging ${REP_AABC.total} distinct objects gives ${F(REP_AABC.total)} orders. But suppose the objects are ${REP_AABC.groups.map(g=>`${g.count} ${g.label}`).join(', ')} — the two A letters are identical.`,
  `Swapping the two A letters does not produce a new arrangement, yet ${F(REP_AABC.total)} counts it as one. Every genuine arrangement has therefore been counted twice, once for each order of the identical pair.`,
  `Dividing by 2! removes exactly that duplication, leaving ${n(countRepeated(REP_AABC))} distinct arrangements. Listing them confirms it: there are ${enumerateRepeated(REP_AABC).length} and no more.`,
  `The denominator is not arbitrary. A group of p identical objects can be permuted among itself in p! ways, all giving the same arrangement, so p! is precisely the factor by which that group inflated the count. With several groups the divisors multiply: for ${REP_LETTERS.groups.map(g=>`${g.count} ${g.label}`).join(', ')} the count is ${F(REP_LETTERS.total)} divided by ${REP_LETTERS.groups.map(g=>`${g.count}!`).join(' × ')}, which is ${n(countRepeated(REP_LETTERS))}.`,
  'The group sizes must account for every object. If they add to fewer than the total, some object has been left out and the problem described is a different one — the formula would then be answering a question nobody asked.',
  `A separate demand is a fixed position. If some objects must sit in particular places, those are settled first and only the rest are arranged: with ${5} objects of which ${2} are fixed, the remaining three can be arranged in ${n(countWithFixedPositions({id:'f',total:5,fixed:2}))} ways.`,
  'These two situations are different and stay separate. Repetition divides out arrangements that were never distinct; a fixed position removes objects from the arrangement altogether. Treating both with one formula would blur what is actually being counted.'],
 rep:['A list of every distinct arrangement of a small set with a repeated letter, each written once'],
 visuals:[V_ARRANGEMENT],
 we:[{id:'s633.we1',prompt:`How many distinct arrangements are there of ${REP_AABC.groups.map(g=>`${g.count} ${g.label}`).join(', ')}?`,steps:[[`If all ${REP_AABC.total} were distinct there would be ${F(REP_AABC.total)} arrangements.`,'That is the ordinary permutation count for four objects.'],['But the two A letters are identical, so swapping them gives the same arrangement.','Every genuine arrangement has been counted twice.'],[`Dividing by 2! gives ${n(countRepeated(REP_AABC))}.`,`Listing confirms ${enumerateRepeated(REP_AABC).length} distinct arrangements.`]],answer:n(countRepeated(REP_AABC))},
  {id:'s633.we2',prompt:`How many distinct arrangements are there of ${REP_LETTERS.groups.map(g=>`${g.count} ${g.label}`).join(', ')}?`,steps:[[`All ${REP_LETTERS.total} distinct would give ${F(REP_LETTERS.total)}.`,'The starting point is always the ordinary count.'],[`The A letters can be permuted among themselves in ${F(3)} ways and the B letters in ${F(2)}, all giving the same arrangement.`,'Each group inflates the count by its own factorial.'],[`So divide by ${REP_LETTERS.groups.map(g=>`${g.count}!`).join(' × ')}, giving ${n(countRepeated(REP_LETTERS))}.`,'The divisors multiply because the groups inflate independently.']],answer:n(countRepeated(REP_LETTERS))},
  {id:'s633.we3',prompt:'Why does a fixed position need a different treatment from a repeated object?',steps:[['A repeated object means two arrangements that looked different are actually the same.','The correction is to divide out arrangements that were never distinct.'],['A fixed position means an object is not being arranged at all.','The correction is to arrange fewer objects, not to divide.'],[`With 5 objects of which 2 are fixed, the remaining three give ${n(countWithFixedPositions({id:'f',total:5,fixed:2}))} arrangements.`,'Dividing would give the wrong answer here, because nothing was overcounted.']],answer:'Because one removes duplicates and the other removes objects.'}],
 g:[{id:'s633.g1',prompt:'Why divide by the factorial of a repetition group?',hint:'How many ways can identical objects swap?',answer:'Because a group of p identical objects can be permuted in p! ways that all give the same arrangement.',why:'That factor is exactly how much the group inflated the ordinary count.'},
  {id:'s633.g2',prompt:'How many distinct arrangements of 3 objects where 2 are identical?',hint:'Start from 3!.',answer:'3.',why:'3! is 6, and the identical pair halves it.'},
  {id:'s633.g3',prompt:'What must the group sizes add to?',hint:'Every object must be somewhere.',answer:'The total number of objects.',why:'If they add to less, an object has been left out and the problem described is a different one.'}],
 i:[{id:'s633.i1',prompt:'How many distinct arrangements of 5 objects where 3 are identical?',answer:'20.',why:'5! is 120, divided by 3! which is 6.'},
  {id:'s633.i2',prompt:'Why is the count smaller than the ordinary permutation count?',answer:'Because arrangements that were counted separately turn out to be the same.',why:'Identical objects cannot be told apart, so swapping them does not create something new.'},
  {id:'s633.i3',prompt:'If every object is distinct, what does the formula give?',answer:'n!, the ordinary count.',why:'Each group has one member and 1! is 1, so the denominator makes no difference.'},
  {id:'s633.i4',prompt:'With 6 objects of which 2 are fixed in place, how many arrangements of the rest?',answer:n(countWithFixedPositions({id:'f6',total:6,fixed:2})),why:'The fixed objects are settled, leaving four to arrange freely.'}],
 td:[{id:'s633.td1',prompt:'The ordinary permutation count is too big when objects repeat. Why is dividing the right correction, rather than subtracting?',reasoning:'Because the overcount is multiplicative rather than additive. Each genuine arrangement has not been counted once too often; it has been counted p! times, once for every internal order of its identical group. A quantity counted a fixed number of times too often is corrected by dividing by that number, and subtracting would only be right if a fixed number of extra arrangements had been added, which is not what happened. The clearest check is a small case: with two identical letters among four, list the arrangements and every one appears exactly twice, never twice-plus-something.'}],
 summary:`When objects repeat, the ordinary count n! is too large because identical objects can be swapped without changing the arrangement. Dividing by the factorial of each repetition group removes exactly that duplication: ${REP_AABC.groups.map(g=>`${g.count} ${g.label}`).join(', ')} gives ${n(countRepeated(REP_AABC))}. A fixed position is a separate matter — those objects are settled first and the rest arranged.`,
 next:'Next you will count selections where order does not matter at all.',
 t:['Count arrangements with repeated objects by dividing out internal permutations, and treat fixed positions separately.',['Permutations','Factorials'],['"swapping identical objects does not make a new arrangement"'],['List the twelve arrangements of A, A, B, C once; seeing each appear exactly twice in the unreduced list explains the divisor better than the formula does.','Keep repetition and fixed positions apart — merging them is the usual source of error here.'],['Ask why the denominator is a factorial.'],['Start from the ordinary count every time, then correct it.'],['Ask what happens when no objects repeat.']]} as unknown as L),

lesson({ id:'ncert_kemh1_s6_4_combinations_lesson', sec:'6.4', title:'Combinations', page:130,
 prereq:['ncert_kemh1_s6_3'], assume:['Permutations','Factorial notation'],
 goal:'You will count selections where order does not matter, and derive nCr from nPr.',
 checks:['Work out nPr.','Say what makes two permutations different.'], ifNot:'Revisit permutations; combinations are what you get when order stops mattering.',
 vocab:[['combination','A selection of objects in which the order does not matter.'],
  ['nCr','The number of combinations of r objects chosen from n distinct objects.']],
 expl:['Sometimes order is irrelevant. Choosing a committee of three from a group is not changed by the order the names were written in, whereas choosing first, second and third place certainly is.',
  `The difference is large. From 5 objects there are ${P(5,3)} ordered triples but only ${C(5,3)} unordered selections. The same objects, counted under different rules.`,
  `Compare them directly on a small case. From A, B, C and D the unordered pairs are ${enumerateSelection(['A','B','C','D'],2,false).map(x=>x.join('')).join(', ')} — ${C(4,2)} of them — while the ordered pairs number ${P(4,2)}, each unordered pair appearing in both of its orders.`,
  'That observation is the derivation. Every unordered selection of r objects can be arranged in r! orders, and each of those orders is one of the permutations. So the permutations are the combinations multiplied by r!.',
  'Written out: nPr = nCr × r!, and therefore nCr = nPr / r!. Substituting the permutation formula gives nCr = n!/(r!(n − r)!).',
  `Check it on the pairs: ${P(4,2)} divided by ${F(2)} is ${C(4,2)}, which is exactly the number listed.`,
  `The division is always exact. nCr counts a number of selections, so it must be a whole number — ${C(10,4)} selections of four from ten, not an approximation. The r! never leaves a remainder because the permutations fall into equal groups of r!, one group per selection.`,
  'This is the object the binomial theorem will later need. For now what matters is that nCr is a well-defined exact count, and that it differs from nPr for a reason you can state rather than a formula you have to remember.'],
 rep:['The same objects listed as ordered pairs and as unordered selections, side by side'],
 we:[{id:'s64.we1',prompt:`Derive the number of ways to choose 3 from 5 when order does not matter.`,steps:[[`There are ${P(5,3)} ordered triples, by the permutation formula.`,'Start from what is already known.'],[`Each unordered selection of 3 can be arranged in ${F(3)} orders, and all of those appear among the ordered triples.`,'So the ordered count is the unordered count multiplied by 3!.'],[`Dividing gives ${P(5,3)} ÷ ${F(3)} = ${C(5,3)}.`,'The division is exact because the triples fall into equal groups of 6.']],answer:C(5,3)},
  {id:'s64.we2',prompt:`Why are there ${C(4,2)} unordered pairs from four objects but ${P(4,2)} ordered ones?`,steps:[[`The unordered pairs are ${enumerateSelection(['A','B','C','D'],2,false).map(x=>x.join('')).join(', ')}.`,`That is ${C(4,2)} selections.`],['Each one can be written in 2 orders, and both count as separate permutations.',`So the ordered count is ${C(4,2)} × ${F(2)}.`],[`That gives ${P(4,2)}, matching the permutation formula.`,'The factor of 2! is precisely what order contributes.']],answer:`${C(4,2)} unordered against ${P(4,2)} ordered.`},
  {id:'s64.we3',prompt:'Why must nCr always be a whole number?',steps:[['nCr counts selections, and you cannot have part of a selection.','The answer must be a whole number for the question to make sense.'],['The permutations split into groups, one group per selection, each containing exactly r! arrangements.','Equal groups mean the division leaves no remainder.'],[`So dividing nPr by r! is exact — for example ${P(10,4)} ÷ ${F(4)} = ${C(10,4)}.`,'An answer with a fraction would mean the grouping argument had gone wrong.']],answer:'Because the permutations fall into equal groups of r!, one per selection.'}],
 g:[{id:'s64.g1',prompt:'What is the difference between a permutation and a combination?',hint:'One word.',answer:'In a permutation order matters; in a combination it does not.',why:'The same objects in a different order are a new permutation but the same combination.'},
  {id:'s64.g2',prompt:'How many ways to choose 2 from 6 when order does not matter?',hint:'Divide the ordered count by 2!.',answer:C(6,2),why:`There are ${P(6,2)} ordered pairs, and each selection accounts for 2 of them.`},
  {id:'s64.g3',prompt:'Why divide nPr by r! rather than by n!?',hint:'How many orders does one selection have?',answer:'Because each selection of r objects has r! orders, not n!.',why:'Only the chosen objects are being rearranged; the ones left behind play no part.'}],
 i:[{id:'s64.i1',prompt:'How many ways to choose 4 from 10 when order does not matter?',answer:C(10,4),why:`There are ${P(10,4)} ordered selections, and each unordered one accounts for ${F(4)} of them.`},
  {id:'s64.i2',prompt:'A team of 3 is picked from 8 people. Permutation or combination?',answer:'Combination.',why:'The team is the same whatever order the members were picked in.'},
  {id:'s64.i3',prompt:'Positions of first, second and third are awarded among 8 runners. Permutation or combination?',answer:'Permutation.',why:'The order determines who gets which position, so different orders are genuinely different outcomes.'},
  {id:'s64.i4',prompt:'Is nCr ever larger than nPr?',answer:'No.',why:'nPr is nCr multiplied by r!, which is at least 1, so the ordered count is never smaller.'}],
 td:[{id:'s64.td1',prompt:'Permutations and combinations use the same objects and the same numbers. Why is deciding which one applies usually harder than the arithmetic?',reasoning:'Because the question does not announce itself. Nothing in the numbers tells you whether order matters; that comes from what the objects are being used for. A team of three and a podium of three are the same selection and different counts, and the only way to tell them apart is to ask whether swapping two of the chosen objects produces a different outcome in the situation described. Once that is settled the formula follows immediately, which is why the useful habit is to ask the question in words before reaching for either formula.'}],
 summary:`A combination is a selection where order does not matter. Each selection of r objects corresponds to r! permutations, so nPr = nCr × r! and nCr = n!/(r!(n − r)!). From 5 objects there are ${P(5,3)} ordered triples but only ${C(5,3)} selections, and nCr is always a whole number because the permutations fall into equal groups.`,
 next:'Later work on expansions of powers will use this count directly.',
 t:['Derive nCr from nPr by dividing out the orders of each selection.',['Permutations','Factorials'],['"does order matter here?", asked before any formula'],['Put the ordered and unordered lists side by side for four objects; the factor of r! is then visible rather than asserted.','The permutation-or-combination decision is the real skill — give situations rather than numbers.'],['Ask whether a committee is a permutation or a combination.'],['State in words whether order matters before choosing a formula.'],['Ask why the division never leaves a remainder.']]} as unknown as L),

];
