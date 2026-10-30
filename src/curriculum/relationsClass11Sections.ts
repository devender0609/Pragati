// ===========================================================================
// v0.84.0-c11.10 checkpoint 81 — CLASS 11 CHAPTER 2, RELATIONS AND FUNCTIONS.
//
// Every product, every domain, every range, every graph and every composition
// in these six lessons is derived from `relationsFunctions`, which is itself
// built on checkpoint 79's `setTheory`. Nothing is typed twice.
//
// FO-2, composition, is CBSE-only: prescribed formatively with no section in
// the current textbook, so it names a CBSE entry and no official section.
// ===========================================================================

import type { AuthoredSection } from './authoredSection';
import { type L, makeLesson } from './class11Lesson';
import { type ExplicitSet, roster, cardinality as setSize } from './setTheory';
import {
  buildFunctionGraph, cartesianProduct, combine, compose,
  compositionsAgree, constantFunction, formatTuple, functionFailureReason,
  greatestIntegerFunction, identityFunction, isManyToOne, logarithmicFunction,
  modulusFunction, pair, productCardinality, productsEqual, rangeIsProperSubsetOfCodomain,
  rationalFunction, relation, relationCodomain, relationDomain, relationRange,
  signumFunction, tuplesEqual,
} from './relationsFunctions';

export const RF_C11_CHAPTER_ID = 'ncert_kemh1_ch02';
const BOOK = 'Mathematics, Textbook for Class XI (NCERT, Reprint 2026-27)';
const SRC = 'kemh1';
const INSPECTED = '2026-10-26';

const source = (sec: string, title: string, page: number) => {
  const parts = sec.split('.');
  const parent = parts.length > 2 ? parts.slice(0, 2).join('.') : sec;
  return {
    officialChapterId: RF_C11_CHAPTER_ID,
    officialSectionId: `ncert_kemh1_s${parent.replace(/\./g, '_')}`,
    ...(parts.length > 2 ? { officialSubsectionNumber: sec } : {}),
    sectionNumber: parent, exactTitle: title, startPage: page,
    textbook: BOOK, sourceReference: SRC, inspectionDate: INSPECTED,
  };
};

const cbseSource = (title: string, page: number, entry: string) => ({
  officialChapterId: RF_C11_CHAPTER_ID,
  sourceKind: 'cbse_only' as const,
  cbseEntryId: entry,
  officialSectionId: '', sectionNumber: '', exactTitle: title, startPage: page,
  textbook: 'Mathematics, Subject Code 041, Classes XI-XII, CBSE 2026-27',
  sourceReference: 'Maths_SecP2_2026-27', inspectionDate: INSPECTED,
});

const lesson = (l: L): AuthoredSection => makeLesson(l, source, undefined, cbseSource);

const set = (id: string, label: string, members: (string | number)[]): ExplicitSet =>
  ({ kind: 'explicit', id, label, members });

// --- canonical objects, derived once ---------------------------------------
export const SET_A = set('A', 'A', [1, 2]);
export const SET_B = set('B', 'B', ['p', 'q', 'r']);
export const PROD_AB = cartesianProduct(SET_A, SET_B);
export const PROD_BA = cartesianProduct(SET_B, SET_A);
export const REL_R = relation('R', 'R', SET_A, SET_B, [pair(1, 'p'), pair(2, 'p')]);
export const REL_MISSING = relation('S', 'S', SET_A, SET_B, [pair(1, 'p')]);
export const REL_DOUBLE = relation('T', 'T', SET_A, SET_B, [pair(1, 'p'), pair(1, 'q'), pair(2, 'r')]);

export const F_CONSTANT = constantFunction(3);
export const F_IDENTITY = identityFunction();
export const F_MODULUS = modulusFunction();
export const F_SIGNUM = signumFunction();
export const F_LOG = logarithmicFunction();
export const F_GIF = greatestIntegerFunction();
export const F_RECIPROCAL = rationalFunction(() => 1, (x) => x, 'f(x) = 1/x', [0]);

export const G_MODULUS = buildFunctionGraph('g_mod', F_MODULUS, -4, 4,
  'The graph of the modulus function from minus four to four. Two straight pieces meeting at the origin in a V shape, the left falling to the origin and the right rising from it, so no value is ever negative.');
export const G_SIGNUM = buildFunctionGraph('g_sgn', F_SIGNUM, -3, 3,
  'The graph of the signum function. A horizontal piece at minus one for every negative argument, a single isolated point at the origin, and a horizontal piece at one for every positive argument. The three pieces are drawn separately because the function jumps between them.');
export const G_GIF = buildFunctionGraph('g_gif', F_GIF, -3, 3,
  'The graph of the greatest integer function. A sequence of horizontal steps, each one unit long, rising by one at every integer. Each step is drawn as its own piece because the value jumps at the integers rather than sliding.');
export const G_RECIPROCAL = buildFunctionGraph('g_recip', F_RECIPROCAL, -4, 4,
  'The graph of one over x. Two separate branches, one in the lower left and one in the upper right, with nothing drawn at zero because the function has no value there.');
export const CANONICAL_FUNCTION_GRAPHS = [G_MODULUS, G_SIGNUM, G_GIF, G_RECIPROCAL];

export const Q_IDENTITY_OVER_IDENTITY = combine('quotient', F_IDENTITY, F_IDENTITY, [0]);
export const SUM_MOD_ID = combine('sum', F_MODULUS, F_IDENTITY);
export const LOG_AFTER_MOD = compose(F_LOG, F_MODULUS);
export const MOD_AFTER_LOG = compose(F_MODULUS, F_LOG);

const prodList = (p: typeof PROD_AB) => p.map(formatTuple).join(', ');

/**
 * Renders a function value for prose. An argument outside the domain has no
 * value, and the words say so — printing the model's `null` into a lesson
 * would put an implementation detail in front of a student.
 */
const shown = (y: number | null, digits?: number): string =>
  y === null ? 'no value at all' : digits === undefined ? String(y) : y.toFixed(digits);

export const C11_RF_SECTIONS: AuthoredSection[] = [

lesson({ id:'ncert_kemh1_s2_2_cartesian_product_lesson', sec:'2.2', title:'Cartesian Products of Sets', page:19,
 assume:['Sets, membership and roster form','Cardinality of a finite set'],
 notIntroduce:[['Relations','ncert_kemh1_s2_3'],['Functions','ncert_kemh1_s2_4']],
 goal:'You will form the Cartesian product of two sets, count its elements, and see why the order of the two sets matters.',
 checks:['Write a set in roster form.','Count the distinct elements of a finite set.'], ifNot:'Revisit sets; a Cartesian product is built from two of them.',
 vocab:[['ordered pair','A pair (a, b) in which the first and second positions carry different meanings, so (a, b) and (b, a) are generally different.'],
  ['Cartesian product','A \u00d7 B is the set of all ordered pairs whose first coordinate is in A and second is in B.']],
 expl:['A set records which objects belong and nothing more, so {a, b} and {b, a} are the same set. Sometimes position carries meaning: a point on the plane is not the same point if its two coordinates are exchanged.',
  `For that we need an ordered pair, written (a, b). Here order is part of the identity: ${formatTuple(pair(1,2))} and ${formatTuple(pair(2,1))} are different, which is exactly what ${tuplesEqual(pair(1,2), pair(2,1))} records.`,
  `The Cartesian product A \u00d7 B is the set of every ordered pair whose first coordinate comes from A and second from B. With A = ${roster(SET_A)} and B = ${roster(SET_B)}, that gives ${prodList(PROD_AB)}.`,
  `Counting is straightforward: each of the ${setSize(SET_A)} choices for the first coordinate can be followed by any of the ${setSize(SET_B)} for the second, so the product has ${setSize(SET_A)} \u00d7 ${setSize(SET_B)} = ${productCardinality(SET_A, SET_B)} elements, which is what ${PROD_AB.length} confirms.`,
  `Because order matters inside each pair, it matters between the sets too. B \u00d7 A is ${prodList(PROD_BA)}, a different set of pairs: ${productsEqual(PROD_AB, PROD_BA)}. The two have the same number of elements, and that is not the same as being equal.`,
  `The idea extends. R \u00d7 R is the set of ordered pairs of reals, which is the coordinate plane, and R \u00d7 R \u00d7 R is the set of ordered triples, which is space. For a two-element set the triple product has ${cartesianProduct(SET_A, SET_A, SET_A).length} elements, by the same counting.`],
 rep:['A grid with the elements of A down the side and B along the top, each cell holding the ordered pair it stands for'],
 we:[{id:'s22.we1',prompt:`Form ${roster(SET_A)} \u00d7 ${roster(SET_B)}.`,steps:[['Take the first element of A and pair it with each element of B in turn.','Every pair with that first coordinate is produced before moving on, which keeps the listing systematic.'],['Repeat with the second element of A.','Each element of A contributes one pair for each element of B, and none is missed.'],[`That gives ${prodList(PROD_AB)}, which is ${PROD_AB.length} pairs.`,'The count matches the product of the two sizes, as the counting argument predicted.']],answer:prodList(PROD_AB)},
  {id:'s22.we2',prompt:`Is ${roster(SET_A)} \u00d7 ${roster(SET_B)} the same as ${roster(SET_B)} \u00d7 ${roster(SET_A)}?`,steps:[[`The first contains ${formatTuple(PROD_AB[0])}; the second contains ${formatTuple(PROD_BA[0])}.`,'Comparing a single member of each is enough to settle it.'],['Those are different ordered pairs, since the coordinates play different roles.',`So the two products are different sets: ${productsEqual(PROD_AB, PROD_BA)}.`],[`Both have ${PROD_AB.length} elements, which shows equal size does not mean equal set.`,'Cardinality counts members; equality asks which members.']],answer:'No. They have the same number of pairs but not the same pairs.'},
  {id:'s22.we3',prompt:'A student writes the product of {1, 1, 2} and {a} as four pairs. What has gone wrong?',steps:[['The first set is written with a repeat, but {1, 1, 2} and {1, 2} are the same set.','A set records membership, not how many times an element is written.'],[`So the product has 2 \u00d7 1 = 2 pairs, not four.`,'The repeat in the roster cannot create a pair, because it did not create an element.']],answer:'Two pairs: the repeated roster entry is not a second element.'}],
 g:[{id:'s22.g1',prompt:'If A has 3 elements and B has 4, how many are in A \u00d7 B?',hint:'Each first coordinate pairs with every second.',answer:'12.',why:'Each of the 3 choices for the first coordinate can be followed by any of the 4 for the second, giving 3 \u00d7 4 pairs.'},
  {id:'s22.g2',prompt:`Is ${formatTuple(pair(3,5))} the same as ${formatTuple(pair(5,3))}?`,hint:'Does position carry meaning?',answer:`No: ${tuplesEqual(pair(3,5), pair(5,3))}.`,why:'In an ordered pair the two positions mean different things, so exchanging the coordinates gives a different pair.'},
  {id:'s22.g3',prompt:'What is A \u00d7 B when B is empty?',hint:'Can a pair be completed?',answer:'The empty set.',why:'There is no second coordinate to choose, so no pair can be formed, whatever A contains.'}],
 i:[{id:'s22.i1',prompt:`Form {x, y} \u00d7 {1, 2} and count the pairs.`,answer:'(x, 1), (x, 2), (y, 1), (y, 2); four pairs.',why:'Two first coordinates each pair with two second coordinates, giving 2 \u00d7 2 = 4.'},
  {id:'s22.i2',prompt:'If A \u00d7 B has 15 elements and A has 5, how many does B have?',answer:'3.',why:'The size of the product is the product of the sizes, so the missing factor is 15 divided by 5.'},
  {id:'s22.i3',prompt:'When is A \u00d7 B equal to B \u00d7 A?',answer:'When A and B are equal, or one of them is empty.',why:'Otherwise some element of A is not in B, and a pair with it first appears in only one of the two products.'},
  {id:'s22.i4',prompt:'How many elements does R \u00d7 R \u00d7 R contain?',answer:'Infinitely many.',why:'Each coordinate may be any real number, and there are infinitely many choices for each of the three positions.'}],
 td:[{id:'s22.td1',prompt:'Sets ignore order, yet the Cartesian product is built from objects where order is everything. Why is that not a contradiction?',reasoning:'Because the product is itself a set, and what it ignores is the order of its own members: listing the pairs in a different sequence gives the same product. What the ordered pair records is structure inside each member. So one notion of order is discarded at the level of the collection while another is kept inside the things collected, and the two are about different things.'}],
 summary:`An ordered pair keeps its coordinates in fixed roles, so ${formatTuple(pair(1,2))} and ${formatTuple(pair(2,1))} differ. A \u00d7 B is the set of all such pairs taken from A then B, with ${setSize(SET_A)} \u00d7 ${setSize(SET_B)} = ${PROD_AB.length} members here, and it is not the same as B \u00d7 A.`,
 next:'Next you will pick out a part of a product and give it a name.',
 t:['Form Cartesian products, count them, and justify why the order of the factors matters.',['Sets and cardinality'],['"ordered pair" in full, to keep it separate from a two-element set'],['The equal-cardinality trap in worked example 2 is the one students fall into; make them compare members rather than counts.','The grid picture makes the counting argument visible and is worth drawing before the formula.'],['Ask whether (2, 2) is a legitimate ordered pair.'],['Fill the grid cell by cell, saying the pair aloud.'],['Ask how many elements A \u00d7 A has for a set of size n.']]} as unknown as L),

lesson({ id:'ncert_kemh1_s2_3_relations_lesson', sec:'2.3', title:'Relations', page:23,
 prereq:['ncert_kemh1_s2_2'], assume:['Cartesian products','Ordered pairs','Subsets'],
 notIntroduce:[['Functions','ncert_kemh1_s2_4']],
 goal:'You will define a relation as a subset of a Cartesian product, and separate its domain, its codomain and its range.',
 checks:['Form a Cartesian product.','Decide whether one set is a subset of another.'], ifNot:'Revisit the Cartesian product; a relation is part of one.',
 vocab:[['relation','A relation from A to B is a subset of A \u00d7 B.'],
  ['domain','The set of first coordinates that actually appear in the relation.'],
  ['codomain','The set B that the relation is declared to go to.'],
  ['range','The set of second coordinates that actually appear in the relation.']],
 expl:[`A Cartesian product holds every possible pairing. A relation picks out some of them: a relation from A to B is a subset of A \u00d7 B, and that is the whole definition.`,
  `Take R = {${REL_R.pairs.map(formatTuple).join(', ')}} as a relation from ${roster(SET_A)} to ${roster(SET_B)}. Each pair comes from the product, which is what makes R a relation rather than an arbitrary list.`,
  `Three sets come with every relation, and they are not interchangeable. The domain is the set of first coordinates that actually occur: ${roster(relationDomain(REL_R))}. The codomain is the declared target set: ${roster(relationCodomain(REL_R))}. The range is the set of second coordinates that actually occur: ${roster(relationRange(REL_R))}.`,
  `Here the range is smaller than the codomain, because ${roster(SET_B)} contains elements no pair reaches: ${rangeIsProperSubsetOfCodomain(REL_R)}. That is normal and not a defect. The codomain says where the relation is allowed to land; the range says where it does land.`,
  'Keeping them apart matters. A claim about the codomain is a claim about the declaration, and a claim about the range is a claim about the pairs. Treating them as one would make the second unfalsifiable.',
  'A relation can be drawn as an arrow diagram: the two sets side by side, with an arrow for each pair. The arrows are the pairs, so the picture carries no information the relation does not already hold.'],
 rep:['Two ovals labelled A and B with an arrow drawn for each pair of the relation'],
 we:[{id:'s23.we1',prompt:`For R = {${REL_R.pairs.map(formatTuple).join(', ')}} from ${roster(SET_A)} to ${roster(SET_B)}, find the domain, codomain and range.`,steps:[[`Domain: collect the first coordinates actually used, giving ${roster(relationDomain(REL_R))}.`,'Only coordinates appearing in a pair count; the domain is read off the relation, not declared.'],[`Codomain: the relation was declared to go to ${roster(relationCodomain(REL_R))}, so that is the codomain.`,'This one is a declaration, so it is taken from how the relation was introduced.'],[`Range: collect the second coordinates actually used, giving ${roster(relationRange(REL_R))}.`,'The two elements of B never used simply do not appear, which is permitted.']],answer:`domain ${roster(relationDomain(REL_R))}, codomain ${roster(relationCodomain(REL_R))}, range ${roster(relationRange(REL_R))}.`},
  {id:'s23.we2',prompt:`Is {(9, p)} a relation from ${roster(SET_A)} to ${roster(SET_B)}?`,steps:[['Check whether the pair belongs to the product: its first coordinate must be in A.','A relation is a subset of A \u00d7 B, so every pair must lie in that product.'],[`9 is not in ${roster(SET_A)}, so the pair is not in the product and the set is not a subset of it.`,'One stray pair is enough; subset means every member qualifies.']],answer:'No. The pair is not in A \u00d7 B.'},
  {id:'s23.we3',prompt:'A student says the range of a relation is always the whole codomain. What has gone wrong?',steps:[[`In R the codomain is ${roster(relationCodomain(REL_R))} but the range is ${roster(relationRange(REL_R))}.`,'A single counterexample settles a claim made for all relations.'],['The codomain is chosen when the relation is declared; the range is whatever the pairs happen to reach.','Confusing the two would make it impossible to say that a relation misses part of its target, which is often the interesting fact.']],answer:'The range is contained in the codomain but need not equal it.'}],
 g:[{id:'s23.g1',prompt:'Can a relation be the empty set?',hint:'Is the empty set a subset of every set?',answer:'Yes.',why:'The empty set is a subset of A \u00d7 B, so it is a relation; its domain and range are both empty.'},
  {id:'s23.g2',prompt:`Can a relation from A to B contain all of A \u00d7 B?`,hint:'Is a set a subset of itself?',answer:'Yes.',why:'Every set is a subset of itself, so the whole product is a relation; its range is then the whole codomain.'},
  {id:'s23.g3',prompt:'Which of domain, codomain and range is declared rather than derived?',hint:'Which one does not depend on the pairs?',answer:'The codomain.',why:'Domain and range are read off the pairs, while the codomain is fixed when the relation is introduced.'}],
 i:[{id:'s23.i1',prompt:'For {(1, p), (2, q)} from {1, 2} to {p, q, r}, give the range and the codomain.',answer:'Range {p, q}; codomain {p, q, r}.',why:'The pairs reach p and q only, while the codomain is the declared target and still contains r.'},
  {id:'s23.i2',prompt:'How many relations are there from a 2-element set to a 2-element set?',answer:'16.',why:'The product has 4 pairs and a relation is any subset of it, so there are 2 to the power 4 choices.'},
  {id:'s23.i3',prompt:'If the range equals the codomain, what does that say?',answer:'Every element of the target is reached by some pair.',why:'It is a statement about the relation, not a general rule, and other relations with the same codomain may not satisfy it.'},
  {id:'s23.i4',prompt:'Can the domain be smaller than A?',answer:'Yes.',why:'A relation need not use every element of A as a first coordinate; those unused simply do not appear in the domain.'}],
 td:[{id:'s23.td1',prompt:'Why keep a codomain at all, when the range already says where the relation lands?',reasoning:'Because the codomain records an intention that the range cannot. Declaring a relation into the integers says something about what kind of output is expected, which stays true even if only three integers are ever reached. It also lets two relations with the same pairs be distinguished when they were declared into different targets, and in the next lesson it is the codomain, not the range, that a function is said to map into.'}],
 summary:`A relation from A to B is a subset of A \u00d7 B. Its domain and range are read off the pairs actually present, while the codomain is the declared target, so the range sits inside the codomain and need not fill it.`,
 next:'Next you will ask which relations deserve a stronger name.',
 t:['Define a relation as a subset of a product and distinguish domain, codomain and range.',['Cartesian products','Subsets'],['"the codomain is declared, the range is reached"'],['The codomain-range confusion is the central difficulty and recurs in every later chapter that uses functions.','Draw the arrow diagram from the pairs, never the other way round, so students do not treat the picture as the source.'],['Ask for the range of a relation that reaches only one element.'],['List the pairs in a column and underline first coordinates, then second.'],['Ask how many relations there are from a set of size m to one of size n.']]} as unknown as L),


lesson({ id:'ncert_kemh1_s2_4_functions_lesson', sec:'2.4', title:'Functions', page:28,
 prereq:['ncert_kemh1_s2_3'], assume:['Relations','Domain, codomain and range'],
 notIntroduce:[['The standard real functions','ncert_kemh1_s2_4_1'],['Algebra of functions','ncert_kemh1_s2_4_2']],
 goal:'You will decide whether a relation is a function by testing one condition: every element of the domain has exactly one image.',
 checks:['Give the domain and range of a relation.','Say what makes a set a subset of a product.'], ifNot:'Revisit relations; a function is a relation that passes one extra test.',
 vocab:[['function','A relation from A to B in which every element of A has exactly one image in B.'],
  ['image','The second coordinate assigned to a given first coordinate.']],
 expl:['Every function is a relation, but most relations are not functions. The extra requirement is a single sentence: every element of A must have exactly one image in B.',
  'Both halves of that sentence do work. Every element means none may be left unassigned. Exactly one means none may be assigned two different images.',
  `Take S = {${REL_MISSING.pairs.map(formatTuple).join(', ')}} from ${roster(SET_A)} to ${roster(SET_B)}. It fails because ${functionFailureReason(REL_MISSING)}.`,
  `Now T = {${REL_DOUBLE.pairs.map(formatTuple).join(', ')}}. It fails for the opposite reason: ${functionFailureReason(REL_DOUBLE)}.`,
  `But R = {${REL_R.pairs.map(formatTuple).join(', ')}} is a function, even though both elements of A are sent to the same image. Many inputs sharing one output is permitted: ${isManyToOne(REL_R)}. What is forbidden is one input having several outputs, which is a different thing entirely.`,
  `For a function the domain is the whole of A, not merely the first coordinates that happen to appear, because the definition requires every element of A to be assigned something. A relation missing an input is not a function with a smaller domain; it is not a function from A at all.`,
  `The codomain and range stay as they were. R is a function into ${roster(relationCodomain(REL_R))} whose range is only ${roster(relationRange(REL_R))}, and that is perfectly ordinary.`],
 rep:['Three arrow diagrams side by side: one with an unassigned input, one with an input sending two arrows, and one valid function where two inputs share an image'],
 we:[{id:'s24.we1',prompt:`Is S = {${REL_MISSING.pairs.map(formatTuple).join(', ')}} a function from ${roster(SET_A)} to ${roster(SET_B)}?`,steps:[['Check each element of A in turn for an image.','The condition is about every element of A, so each must be examined.'],[`1 has the image p. But ${functionFailureReason(REL_MISSING)}.`,'An unassigned input breaks the every-element half of the requirement.'],['So S is a relation but not a function from A.','It cannot be rescued by shrinking the domain, because it was declared from A.']],answer:'No. One element of A has no image.'},
  {id:'s24.we2',prompt:`Is T = {${REL_DOUBLE.pairs.map(formatTuple).join(', ')}} a function?`,steps:[['Every element of A does have an image this time, so the first half holds.','Checking the easier condition first narrows what can be wrong.'],[`But ${functionFailureReason(REL_DOUBLE)}.`,'Two different images for one input breaks the exactly-one half.'],['So T is not a function either, for the opposite reason to S.','The two failures are distinct and worth naming separately.']],answer:'No. One element of A has two different images.'},
  {id:'s24.we3',prompt:`R sends both elements of A to the same image. Is it still a function?`,steps:[['Check the condition as written: does every element of A have exactly one image?','The condition says nothing about different inputs needing different outputs.'],[`1 has exactly one image and 2 has exactly one image, so R is a function: ${isManyToOne(REL_R)} records that it is many-to-one.`,'Many-to-one is allowed; one-to-many is not. The asymmetry is deliberate.'],['A function may lose information but may never be ambiguous.','That is the practical meaning of the condition.']],answer:'Yes. Different inputs may share an image.'}],
 g:[{id:'s24.g1',prompt:'Is every function a relation?',hint:'What is a function defined as?',answer:'Yes.',why:'A function is a relation satisfying an extra condition, so it is a subset of the product like any relation.'},
  {id:'s24.g2',prompt:'Is every relation a function?',hint:'Think of an unassigned input.',answer:'No.',why:'A relation may leave an element of A unassigned or assign it two images, and either failure disqualifies it.'},
  {id:'s24.g3',prompt:'May two different inputs have the same image?',hint:'Which half of the condition would that break?',answer:'Yes.',why:'The condition constrains how many images each input has, not how many inputs each image serves.'}],
 i:[{id:'s24.i1',prompt:'Is {(1, p), (2, p), (1, p)} a function from {1, 2} to {p, q}?',answer:'Yes.',why:'The repeated pair is the same pair, so each input still has exactly one image; a set does not count repetitions.'},
  {id:'s24.i2',prompt:'A relation from {1, 2, 3} to {a} assigns every input the image a. Is it a function?',answer:'Yes.',why:'Each of the three inputs has exactly one image, and all three sharing it is permitted.'},
  {id:'s24.i3',prompt:'Why is a relation missing an input not simply a function with a smaller domain?',answer:'Because it was declared as a relation from A, and the condition is about every element of A.',why:'Changing the domain would change which function is being discussed, so the original claim is still false.'},
  {id:'s24.i4',prompt:'How many functions are there from a 2-element set to a 3-element set?',answer:'9.',why:'Each of the two inputs is assigned independently to any of the three images, giving 3 \u00d7 3 choices.'}],
 td:[{id:'s24.td1',prompt:'Why is many-to-one allowed while one-to-many is forbidden?',reasoning:'Because a function has to answer a question unambiguously. Asked for the image of an input, it must produce one value, so two images would leave the question unanswered. Nothing goes wrong if two different inputs give the same answer: the question "what is the image of this input" still has a single reply for each. The asymmetry comes from the direction in which a function is used, not from any preference about tidiness.'}],
 summary:`A function from A to B is a relation in which every element of A has exactly one image in B. Leaving an input unassigned or giving it two images both break the condition, while many inputs sharing one image does not.`,
 next:'Next you will meet the real functions used most often.',
 t:['Apply the exactly-one-image condition to decide whether a relation is a function.',['Relations','Domain and range'],['"exactly one image for every element" as a single phrase'],['Test both failure modes separately; students who meet only the one-to-many case think the condition is about ambiguity alone.','The many-to-one case in worked example 3 is where most of the resistance appears.'],['Ask whether a constant assignment is a function.'],['Have the student tick each element of A as its image is found.'],['Ask how many functions there are from a set of size m to one of size n.']]} as unknown as L),

lesson({ id:'ncert_kemh1_s2_4_1_real_functions_lesson', sec:'2.4.1', title:'Some Functions and their Graphs', page:32,
 prereq:['ncert_kemh1_s2_4'], assume:['Functions','Domain, codomain and range','Plotting points'],
 goal:'You will recognise the standard real functions by rule, domain, range and graph, and see why some of their graphs must be drawn in pieces.',
 checks:['State the exactly-one-image condition.','Plot a point from a pair of coordinates.'], ifNot:'Revisit functions; each graph here is the set of pairs of one function.',
 vocab:[['real function','A function whose domain and codomain are sets of real numbers.'],
  ['modulus function','The function assigning each real number its distance from zero.'],
  ['signum function','The function recording only the sign of its argument.'],
  ['greatest integer function','The function assigning each real number the greatest integer not exceeding it.']],
 expl:[`A real function takes real numbers to real numbers. Its graph is simply the set of pairs (x, f(x)), so the picture and the rule are the same object seen two ways.`,
  `The simplest are the constant function, ${F_CONSTANT.rule}, whose domain is ${F_CONSTANT.domainDescription} and whose range is the single value ${F_CONSTANT.rangeDescription}; and the identity function, ${F_IDENTITY.rule}, where domain and range are both ${F_IDENTITY.rangeDescription}.`,
  `The modulus function ${F_MODULUS.rule} has domain ${F_MODULUS.domainDescription} and range ${F_MODULUS.rangeDescription}, since a distance is never negative. Its graph is the familiar V, and it comes from the rule rather than being drawn by hand.`,
  `The signum function records only the sign: ${F_SIGNUM.rule}. Its range is just ${F_SIGNUM.rangeDescription}. Its graph cannot be one line, because the value jumps as the argument passes zero, so it is drawn in ${G_SIGNUM.branches.length} separate pieces.`,
  `The greatest integer function ${F_GIF.rule} assigns each number the greatest integer not above it, giving range ${F_GIF.rangeDescription}. Its graph is a staircase: over the sampled range it needs ${G_GIF.branches.length} separate steps, because the value jumps at every integer instead of sliding.`,
  `Some functions exclude arguments outright. The reciprocal ${F_RECIPROCAL.rule} has domain ${F_RECIPROCAL.domainDescription}, so its graph has ${G_RECIPROCAL.branches.length} branches with nothing drawn at the excluded argument. The logarithmic function has domain ${F_LOG.domainDescription}, so no part of its graph lies to the left of zero.`,
  `In every case the domain belongs to the function. A drawn curve that passes over an excluded argument is not a neater picture of the same function; it is a picture of a different claim.`],
 rep:['The standard graphs plotted from their rules, with the jumping ones drawn in separate pieces and the excluded arguments left blank'],
 visuals:[G_MODULUS, G_SIGNUM, G_GIF, G_RECIPROCAL],
 we:[{id:'s241.we1',prompt:`Why is the range of ${F_CONSTANT.rule} only ${F_CONSTANT.rangeDescription}?`,steps:[['The range is the set of values actually attained.','Range is read off what the function produces, not off the codomain it is declared into.'],[`This rule produces the same value whatever the argument, so only one value is ever attained.`,'Every input gives the same output, which is permitted since many-to-one is allowed.'],[`So the range is the single-element set ${F_CONSTANT.rangeDescription}, while the codomain may be all of the reals.`,'The gap between them is exactly the codomain-range distinction from the previous lesson.']],answer:F_CONSTANT.rangeDescription},
  {id:'s241.we2',prompt:`Why must the graph of the greatest integer function be drawn in separate pieces?`,steps:[['Between two consecutive integers the value is constant, giving a horizontal step.','On that stretch the greatest integer below the argument does not change.'],['At each integer the value jumps by one rather than passing through the values in between.','Nothing is attained strictly between the two step heights, so no connecting line belongs there.'],[`Over the sampled range this gives ${G_GIF.branches.length} pieces, each drawn separately.`,'Joining them would show values the function never takes.']],answer:`${G_GIF.branches.length} separate steps.`},
  {id:'s241.we3',prompt:`A student draws the graph of ${F_RECIPROCAL.rule} as one continuous curve sweeping through the origin. What has gone wrong?`,steps:[[`The domain is ${F_RECIPROCAL.domainDescription}, so the excluded argument has no value at all.`,'The restriction is part of the function, not a remark about the picture.'],[`A curve drawn through it asserts a point there, so the correct graph has ${G_RECIPROCAL.branches.length} separate branches.`,'A line is a set of points, and drawing one over an excluded argument claims a point the function does not provide.']],answer:`Two separate branches, with nothing drawn at the excluded argument.`}],
 g:[{id:'s241.g1',prompt:`What is the domain of the logarithmic function?`,hint:'Which arguments are allowed?',answer:F_LOG.domainDescription,why:'The logarithm is defined only for positive arguments, so zero and negatives are excluded from the domain.'},
  {id:'s241.g2',prompt:`What is the range of ${F_MODULUS.rule}?`,hint:'Can a distance be negative?',answer:F_MODULUS.rangeDescription,why:'The modulus is a distance from zero, so it is never negative, and every non-negative value is attained.'},
  {id:'s241.g3',prompt:'What is the value of the signum function at zero?',hint:'Read the rule.',answer:'0.',why:`The rule assigns zero at zero, between the value below and the value above: ${F_SIGNUM.rule}.`}],
 i:[{id:'s241.i1',prompt:'What is the greatest integer of 2.7, and of \u22122.3?',answer:`${F_GIF.evaluate(2.7)} and ${F_GIF.evaluate(-2.3)}.`,why:'The greatest integer not exceeding a number lies below it, which for a negative argument means further from zero rather than nearer.'},
  {id:'s241.i2',prompt:'Why is the range of the signum function finite?',answer:'Because it has only three possible outputs.',why:`The rule distinguishes only negative, zero and positive arguments, so the range is ${F_SIGNUM.rangeDescription}.`},
  {id:'s241.i3',prompt:'Can a graph be used to read off the domain?',answer:'Only partly.',why:'A graph shows the sampled part of the domain. The domain belongs to the function, and the picture is a representation of it rather than the authority on it.'},
  {id:'s241.i4',prompt:'Is the modulus function one-to-one?',answer:'No.',why:'Two arguments equally far from zero share an image, which is many-to-one and perfectly permitted for a function.'}],
 td:[{id:'s241.td1',prompt:'Two of these functions jump and one simply has an argument missing. Why are those different situations, even though both graphs come in pieces?',reasoning:'The signum and greatest integer functions are defined everywhere; their graphs break because the value changes abruptly, so there is no point to draw between the pieces. The reciprocal is different: at the excluded argument the function has no value at all, so the gap is in the domain rather than in the values. One picture is missing a connection and the other is missing a point, and only the second changes what the function is defined on.'}],
 summary:`The standard real functions carry their domains and ranges with them: the constant has a single-value range, the modulus never goes negative, the signum takes only ${F_SIGNUM.rangeDescription}, and the greatest integer steps through the integers. Graphs are drawn in pieces wherever the function jumps or has no value.`,
 next:'Next you will combine two functions into a new one.',
 t:['Identify standard real functions by rule, domain, range and graph, including those drawn in pieces.',['Functions','Plotting points'],['"the domain belongs to the function" when a graph is discussed'],['The jump-versus-gap distinction in Think deeper is subtle and worth drawing on the board rather than stating.','Generate the graphs from the rules in front of the class; a hand-drawn V invites hand-drawn errors.'],['Ask for the greatest integer of a negative decimal.'],['Evaluate the rule at several arguments and plot before describing the shape.'],['Ask which of these functions are one-to-one.']]} as unknown as L),


lesson({ id:'ncert_kemh1_s2_4_2_algebra_of_functions_lesson', sec:'2.4.2', title:'Algebra of Real Functions', page:35,
 prereq:['ncert_kemh1_s2_4_1'], assume:['Real functions','Domain of a function'],
 notIntroduce:[['Composition of functions','ncert_kemh1_fo2']],
 goal:'You will add, subtract, multiply and divide real functions, and work out the domain of the result rather than assuming it.',
 checks:['Give the domain of the reciprocal function.','Evaluate a real function at an argument.'], ifNot:'Revisit the standard functions; the domain of each operand decides the domain of the result.',
 vocab:[['pointwise','Defined one argument at a time, by combining the two values the operand functions give there.']],
 expl:['Two real functions can be combined into a new one by working argument by argument. The sum of f and g is the function assigning f(x) + g(x) at each x, and difference, product and quotient are defined the same way.',
  'The rule is only half the definition. The new function also needs a domain, and that domain is not chosen freely: an argument can only be used if both operands supply a value there.',
  `So for a sum, difference or product, the domain is the set of arguments where both f and g are defined. Combining the modulus and identity functions gives ${SUM_MOD_ID.name}, defined ${SUM_MOD_ID.domainDescription}, which here is every real number because both operands are.`,
  `A quotient carries one further restriction. Even where both functions are defined, the quotient has no value at an argument where the divisor is zero, because division by zero produces no number. The domain is therefore the common domain with those arguments removed as well.`,
  `For instance the quotient of the identity function by itself is defined ${Q_IDENTITY_OVER_IDENTITY.domainDescription}. At the excluded argument it has no value: it has ${shown(Q_IDENTITY_OVER_IDENTITY.evaluate(0))}, while at 2 it gives ${shown(Q_IDENTITY_OVER_IDENTITY.evaluate(2))}.`,
  `That last example is worth pausing on. The quotient simplifies to a rule that looks defined everywhere, yet the function is not, because the exclusion came from the operation and does not disappear when the expression is tidied. A domain is part of the function, so two rules that agree wherever both are defined can still be different functions.`],
 rep:['Two function graphs with a third beneath, showing the combined values and the arguments where the result has none'],
 we:[{id:'s242.we1',prompt:'Why is the domain of a sum the common part of the two domains?',steps:[['The sum is defined by adding the two values at each argument.','The definition is pointwise, so it needs both values at every argument it claims.'],['If either function has no value at an argument, there is nothing to add there.','One missing operand is enough; addition needs two numbers.'],['So the sum is defined exactly where both are.','The domain is derived from the operands rather than chosen afterwards.']],answer:'Because the sum needs both values, so it exists only where both do.'},
  {id:'s242.we2',prompt:`Why does the quotient exclude arguments where the divisor is zero?`,steps:[['At such an argument both functions may well be defined, so the common domain does not exclude it.','The extra restriction is not inherited from the operands; it comes from the operation.'],['But division by zero produces no number at all.','This is the same refusal as the reciprocal function in the previous lesson.'],[`So the argument is removed: the quotient here is defined ${Q_IDENTITY_OVER_IDENTITY.domainDescription}.`,'The restriction belongs in the domain, not in a note beside the formula.']],answer:'Because division by zero yields no value, even where both operands do.'},
  {id:'s242.we3',prompt:'A student simplifies a quotient and says the result is defined everywhere. What has gone wrong?',steps:[['Simplifying changes how the rule is written, not which arguments the function was defined on.','The function was built by an operation, and the operation removed an argument.'],[`The excluded argument still has ${shown(Q_IDENTITY_OVER_IDENTITY.evaluate(0))}.`,'The tidier expression describes a different function, one that happens to agree wherever both are defined.'],['So the two functions are not equal, because their domains differ.','Equality of functions requires the same domain as well as the same values.']],answer:'The domain restriction survives the simplification.'}],
 g:[{id:'s242.g1',prompt:'What is the domain of the product of two functions each defined on all the reals?',hint:'Where are both defined?',answer:'All the reals.',why:'The common part of two domains that are each everything is everything, so the product loses nothing.'},
  {id:'s242.g2',prompt:'Is the difference of two functions defined where only one of them is?',hint:'How many values does subtraction need?',answer:'No.',why:'Subtraction needs both values at the argument, so a missing operand leaves nothing to subtract.'},
  {id:'s242.g3',prompt:'Where is the quotient of the identity by the modulus undefined?',hint:'Where is the divisor zero?',answer:'At zero.',why:'The modulus is zero only at zero, and a quotient has no value where the divisor vanishes.'}],
 i:[{id:'s242.i1',prompt:'If f is defined on the positive reals and g on all the reals, what is the domain of f + g?',answer:'The positive reals.',why:'The sum exists only where both operands do, and f is the more restrictive of the two.'},
  {id:'s242.i2',prompt:'Can a product be defined where neither operand is?',answer:'No.',why:'The product is computed from the two values, so it cannot exist where either is missing.'},
  {id:'s242.i3',prompt:'Why is the domain restriction structural rather than a note beside the formula?',answer:'Because the function has no value there at all.',why:'A note can be dropped when the expression is rewritten, whereas the domain is part of what the function is.'},
  {id:'s242.i4',prompt:`Evaluate ${SUM_MOD_ID.name} at \u22123.`,answer:shown(SUM_MOD_ID.evaluate(-3)),why:'The modulus gives 3 and the identity gives \u22123, and the sum adds the two values at that one argument.'}],
 td:[{id:'s242.td1',prompt:'Two formulas can be algebraically identical yet define different functions. How is that possible?',reasoning:'Because a function is a rule together with a domain, and algebra only operates on the rule. Simplifying a quotient can remove the symbol that caused an exclusion without removing the exclusion, since the exclusion was created by the operation rather than by the way it was written. The two functions then agree at every argument where both are defined and still differ, because one is defined at an argument where the other is not. Equality of functions is a claim about domains as much as about values.'}],
 summary:`Functions are combined pointwise, and the domain of the result is derived: sums, differences and products are defined where both operands are, while a quotient also excludes every argument where the divisor is zero. That exclusion survives any simplification of the formula.`,
 next:'Next, an optional look at feeding one function into another.',
 t:['Form sums, differences, products and quotients of real functions and derive the domain of each result.',['Real functions','Domain'],['"and the domain of the result is" as part of every answer, not an afterthought'],['Insist that every answer state a domain. Students who give only the rule will lose the quotient restriction within a week.','The simplification trap in worked example 3 is the single most valuable idea in the lesson.'],['Ask for the domain of a quotient whose divisor vanishes at two arguments.'],['Write the two domains before writing the combined rule.'],['Ask when the quotient of two functions has the same domain as their product.']]} as unknown as L),

lesson({ id:'ncert_kemh1_fo2_composition_lesson', sec:'\u2014', title:'Composition of Functions', page:0,
 cbseEntry:'FO-2',
 prereq:['ncert_kemh1_s2_4_2'], assume:['Functions','Domain of a function','Algebra of functions'],
 goal:'You will feed the output of one function into another, and see why the order and the domain both need care.',
 checks:['Evaluate a real function.','Give the domain of a logarithmic function.'], ifNot:'Revisit functions and their domains; composition depends on where each one is defined.',
 vocab:[['composition','The function g \u2218 f assigning to each x the value g(f(x)), where f(x) lies in the domain of g.']],
 expl:['Combining functions by arithmetic keeps them side by side. Composition does something different: it feeds the output of one into the other.',
  'For functions f and g, the composition g \u2218 f assigns to each argument x the value g(f(x)). The inner function acts first, even though it is written second, which is a common place to slip.',
  'This is not multiplication. The two functions are not multiplied together, and the symbol does not distribute. It records an order of application.',
  `Because it is an order, reversing it generally changes the result. Taking the logarithm of a modulus and taking the modulus of a logarithm are different functions: ${!compositionsAgree(LOG_AFTER_MOD, MOD_AFTER_LOG, [0.5, 2, 3])} is what comparing them at several arguments shows.`,
  `The domain needs two conditions, not one. An argument x belongs to the domain of g \u2218 f only when x is in the domain of f AND the value f(x) lies in the domain of g. The second condition is the one most easily forgotten.`,
  `For ${LOG_AFTER_MOD.name} the domain is ${LOG_AFTER_MOD.domainDescription}. At \u22122 the inner function gives 2, which the logarithm accepts, so the composition has the value ${shown(LOG_AFTER_MOD.evaluate(-2), 4)}. At zero the inner function gives zero, which the logarithm does not accept, so the composition has ${shown(LOG_AFTER_MOD.evaluate(0))}.`],
 rep:['Three sets in a row with arrows from the first to the second and from the second to the third, and a longer arrow beneath showing the composition'],
 we:[{id:'fo2.we1',prompt:'In g \u2218 f, which function acts first?',steps:[['Read the definition: the value is g(f(x)).','The expression is evaluated from the inside out.'],['The inner expression f(x) must be computed before g can be applied to it.','So f acts first even though it appears to the right in the symbol.'],['The notation records the order of application read right to left.','This is a convention worth stating explicitly, because the reading order misleads.']],answer:'f acts first.'},
  {id:'fo2.we2',prompt:`Does reversing the order change the result?`,steps:[['Compose in one order and then the other, and compare values at several arguments.','A single disagreement settles that the two functions are different.'],[`The two disagree: ${!compositionsAgree(LOG_AFTER_MOD, MOD_AFTER_LOG, [0.5, 2, 3])}.`,'Order is part of what composition means, so the two are genuinely different functions.'],['So composition is not commutative in general.','Occasionally two functions do commute, but that is a fact about those functions, not about composition.']],answer:'Yes, in general the two orders give different functions.'},
  {id:'fo2.we3',prompt:`Why does ${LOG_AFTER_MOD.name} have no value at zero?`,steps:[['Check the first condition: zero is in the domain of the inner function, which is defined everywhere.','The first condition alone would admit the argument.'],['Now the second: the inner function gives zero there, and the outer function does not accept zero.','The output of the inner function has to be an argument the outer one can take.'],[`So zero is outside the domain, and it has ${shown(LOG_AFTER_MOD.evaluate(0))}.`,'Dropping the second condition would wrongly admit this argument.']],answer:'Because the inner value falls outside the domain of the outer function.'}],
 g:[{id:'fo2.g1',prompt:'Is composition the same as multiplying two functions?',hint:'What is the value at x in each case?',answer:'No.',why:'A product multiplies the two values at x, while a composition uses one value as the argument of the other.'},
  {id:'fo2.g2',prompt:'What two conditions must an argument satisfy to lie in the domain of g \u2218 f?',hint:'One about x, one about f(x).',answer:'x must be in the domain of f, and f(x) in the domain of g.',why:'Both are needed: the inner function must produce a value, and that value must be acceptable to the outer one.'},
  {id:'fo2.g3',prompt:'If f and g are both defined on all the reals, is g \u2218 f defined everywhere?',hint:'Can the second condition fail?',answer:'Yes.',why:'Every inner value is a real number and the outer function accepts every real number, so both conditions hold everywhere.'}],
 i:[{id:'fo2.i1',prompt:'If f doubles its argument and g adds three, what does g \u2218 f do?',answer:'It doubles and then adds three.',why:'The inner function acts first, so the argument is doubled before three is added.'},
  {id:'fo2.i2',prompt:'What does f \u2218 g do with the same two functions?',answer:'It adds three and then doubles.',why:'Reversing the order changes which operation happens first, and the two results differ for every argument except one.'},
  {id:'fo2.i3',prompt:'Can the domain of g \u2218 f be smaller than the domain of f?',answer:'Yes.',why:'An argument where the inner value is unacceptable to the outer function is excluded even though f is defined there.'},
  {id:'fo2.i4',prompt:`Evaluate ${LOG_AFTER_MOD.name} at \u22122.`,answer:shown(LOG_AFTER_MOD.evaluate(-2), 4),why:'The inner function turns \u22122 into 2, which lies in the domain of the outer function, so the outer rule is then applied to 2.'}],
 td:[{id:'fo2.td1',prompt:'Why does composition need a domain condition that addition and multiplication do not?',reasoning:'Because the two operations use the functions differently. Adding two functions asks each for a value at the same argument, so the only requirement is that both are defined there. Composition asks the inner function for a value and then hands that value to the outer one as an argument, so the outer function is being used at a point nobody chose directly. Whether it is defined there depends on what the inner function produced, which is why the second condition is about f(x) rather than about x.'}],
 summary:`The composition g \u2218 f assigns g(f(x)), with the inner function acting first. It is not multiplication, the order generally matters, and an argument belongs to its domain only when x is in the domain of f and f(x) is in the domain of g.`,
 next:'That completes the chapter on relations and functions.',
 t:['Compose two functions, respect the order, and derive the domain from both conditions.',['Functions','Domains'],['"g after f" when reading the symbol aloud'],['CURRICULUM NOTE: composition is prescribed by CBSE as formative-only and the current textbook gives it no section of its own, so it sits outside the required core for this chapter. It rewards the students who are ready for it; keep it out of summative assessment, and do not let it displace the algebra of functions that precedes it.','The second domain condition is the whole difficulty. Ask for it on every example.'],['Ask which function acts first in g \u2218 f.'],['Compute the inner value and write it down before applying the outer function.'],['Ask whether any pair of functions commutes under composition.']]} as unknown as L),

];
