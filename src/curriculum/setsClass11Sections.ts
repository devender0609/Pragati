// ===========================================================================
// v0.84.0-c11.7 checkpoint 78 — CLASS 11 CHAPTER 1, SETS.
//
// The first authored Class 11 content, and the first consumer of
// `setTheory.ts`. Every roster, every membership claim, every Venn region and
// every count in these twelve lessons is DERIVED from the model. Nothing is
// typed twice, which is the whole point: the symbolic statement, the picture
// and the count cannot disagree, because they are three renderings of one
// object.
//
// C11-SET-FO1 is FORMATIVE_ONLY for assessment and REQUIRED_CORE
// instructionally. It is a lesson like the others and is ineligible for any
// future summative pool. The two fields are independent and neither is read
// off the other.
// ===========================================================================

import type { AuthoredSection } from './authoredSection';
import { type L, lessonBase as base, makeLesson, teacher } from './class11Lesson';
import {
  type ExplicitSet, type IntervalSet, type Universe, type VennSpec,
  cardinality, complement, difference, formatInterval, intersection,
  isMember, isProperSubset, isSubset, roster, setsEqual, shadedNotation,
  twoSetCount, union, deMorganUnionHolds, deMorganIntersectionHolds, countingRelationHolds,
  EMPTY_SET_SYMBOL,
} from './setTheory';

export const SETS_C11_CHAPTER_ID = 'ncert_kemh1_ch01';
const E = EMPTY_SET_SYMBOL;
const BOOK = 'Mathematics, Textbook for Class XI (NCERT, Reprint 2026-27)';
const SRC = 'kemh1';
const INSPECTED = '2026-10-26';

const fragmentSource = (sec: string, title: string, page: number, fragmentId: string) => ({
  officialChapterId: SETS_C11_CHAPTER_ID,
  sourceKind: 'scope_fragment' as const,
  officialSectionId: `ncert_kemh1_s${sec.replace('.', '_')}`,
  scopeFragmentId: fragmentId,
  sectionNumber: sec, exactTitle: title, startPage: page,
  textbook: BOOK, sourceReference: SRC, inspectionDate: INSPECTED,
});

const source = (sec: string, title: string, page: number) => ({
  officialChapterId: SETS_C11_CHAPTER_ID,
  officialSectionId: `ncert_kemh1_s${sec.replace('.', '_')}`,
  sectionNumber: sec, exactTitle: title, startPage: page,
  textbook: BOOK, sourceReference: SRC, inspectionDate: INSPECTED,
});

const set = (id: string, label: string, members: (string | number)[], description?: string): ExplicitSet =>
  ({ kind: 'explicit', id, label, members, description });
const interval = (id: string, label: string, low: number, high: number, lowClosed: boolean, highClosed: boolean): IntervalSet =>
  ({ kind: 'interval', id, label, low, high, lowClosed, highClosed });

// --- the canonical sets every lesson draws on ------------------------------
export const S_EVEN10 = set('even10', 'A', [2, 4, 6, 8], 'the even natural numbers below 10');
export const S_EVEN10_SHUFFLED = set('even10b', 'B', [8, 2, 6, 4, 2], 'the same members, written out of order and with a repeat');
export const S_FIRST5 = set('first5', 'A', [1, 2, 3, 4, 5]);
export const S_ODD5 = set('odd5', 'B', [1, 3, 5]);
export const S_EMPTY = set('empty', '\u2205', []);
export const S_CONTAINS_EMPTY = set('containsEmpty', '{\u2205}', [EMPTY_SET_SYMBOL]);
export const U_DIGITS = set('udigits', 'U', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) as Universe;
export const U_SMALL = set('usmall', 'U', [1, 2, 3, 4, 5, 6]) as Universe;
export const S_A = set('setA', 'A', [1, 2, 3, 4, 5, 6]);
export const S_B = set('setB', 'B', [4, 5, 6, 7, 8]);
export const I_OPEN = interval('iopen', '(2, 7)', 2, 7, false, false);
export const I_CLOSED = interval('iclosed', '[2, 7]', 2, 7, true, true);
export const I_HALF = interval('ihalf', '[2, 7)', 2, 7, true, false);
// Counting example: a class where some students play each game.
export const C_CRICKET = set('cricket', 'C', ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r']);
export const C_TENNIS = set('tennis', 'T', ['m', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x']);
export const U_CLASS = set('uclass', 'U', [...'abcdefghijklmnopqrstuvwxyz'.split('').slice(0, 26)]) as Universe;

export const CANONICAL_SETS = [S_EVEN10, S_FIRST5, S_ODD5, S_EMPTY, S_A, S_B, C_CRICKET, C_TENNIS];
export const CANONICAL_INTERVALS = [I_OPEN, I_CLOSED, I_HALF];

// Derived once from the model; every lesson below reads these rather than
// retyping a roster, a count or a region.
const AB_UNION = union(S_A, S_B);
const AB_INT = intersection(S_A, S_B);
const A_MINUS_B = difference(S_A, S_B);
const B_MINUS_A = difference(S_B, S_A);
const A_COMP_DIGITS = complement(U_DIGITS, S_A);
const A_COMP_SMALL = complement(U_SMALL, S_A);
const CT = twoSetCount(C_CRICKET, C_TENNIS, U_CLASS);

const venn = (id: string, shaded: VennSpec['shaded'], description: string, a = 'A', b = 'B'): VennSpec =>
  ({ type: 'venn', id, universeLabel: 'U', aLabel: a, bLabel: b, shaded, description,
    altText: description, caption: description, status: 'verified' });

export const V_SUBSET = venn('v_subset', ['A_and_B'], 'Two overlapping circles inside a rectangle marked U. The overlap, the region inside both A and B, is shaded.');
export const V_UNION = venn('v_union', ['A_only', 'A_and_B', 'B_only'], 'Two overlapping circles inside a rectangle marked U. Everything inside either circle is shaded, including the overlap region.');
export const V_INTERSECTION = venn('v_int', ['A_and_B'], 'Two overlapping circles. Only the overlap region, inside both circles, is shaded.');
export const V_DIFFERENCE = venn('v_diff', ['A_minus_B'], 'Two overlapping circles. The region inside A but outside B is shaded; the overlap is left unshaded.');
export const V_COMPLEMENT = venn('v_comp', ['A_complement'], 'A circle marked A inside a rectangle marked U. Everything inside the rectangle but outside the circle is shaded.');
export const V_COUNT = venn('v_count', ['A_only', 'A_and_B', 'B_only'], 'Two overlapping circles marked C and T inside a rectangle marked U. All three regions inside the circles are shaded and each carries its own count.', 'C', 'T');
export const CANONICAL_VENNS = [V_SUBSET, V_UNION, V_INTERSECTION, V_DIFFERENCE, V_COMPLEMENT, V_COUNT];





// A compact constructor for the remaining lessons. Every field is still
// authored; this only removes the repeated scaffolding.
const lesson = (l: L) => makeLesson(l, source, fragmentSource);
const makeLesson2 = lesson;

export const C11_SETS_SECTIONS: AuthoredSection[] = [
// ============================== C11-SET-01 =================================
{
  ...base,
  contentArtifactId: 'ncert_kemh1_s1_2_representations_lesson',
  source: source('1.2', 'Sets and their Representations', 2),
  sequence: { prerequisiteSectionIds: [], mayAssume: ['Natural numbers and the idea of a collection'], mustNotIntroduce: [
    { concept: 'Operations on sets', belongsToSection: 'ncert_kemh1_s1_9' },
    { concept: 'Subsets', belongsToSection: 'ncert_kemh1_s1_6' }] },
  learningGoal: 'You will write a collection in roster form and in set-builder form, and see that the two can describe the very same set.',
  priorKnowledgeCheck: { prompt: 'Before you start, check that you can:', checks: ['List the natural numbers below 10.', 'Say what makes a description precise rather than vague.'], ifNotReady: 'Spend a moment on what counts as a clear description of a collection. That is all this lesson assumes.' },
  vocabulary: [
    { term: 'set', meaning: 'A well-defined collection of objects, treated as one object in its own right.' },
    { term: 'element', meaning: 'An object belonging to a set. We write a \u2208 A for "a is an element of A" and a \u2209 A for "a is not".' },
    { term: 'roster form', meaning: 'Writing a set by listing its elements inside braces, as in {2, 4, 6, 8}.' },
    { term: 'set-builder form', meaning: 'Writing a set by stating the property its elements share, as in {x : x is an even natural number less than 10}.' },
  ],
  explanation: [
    'A set is a collection that is well defined: for any object you name, there is a definite answer to whether it belongs. "The even natural numbers below 10" is well defined. "The interesting numbers" is not, because two people would disagree about which numbers qualify.',
    'What makes a set a new idea rather than just a list is that the collection itself becomes one object. You can name it, compare it with another set, and later combine it with others.',
    `There are two ways to write one down. Roster form lists the elements: ${roster(S_EVEN10)}. Set-builder form gives the rule instead: {x : x is an even natural number less than 10}.`,
    'These two describe the same set. Which form you choose depends on the set, not on the mathematics: roster form is natural when there are few elements and you can see them all, set-builder form when there are many, or infinitely many, or when the rule is the thing worth saying.',
    'The symbol \u2208 means "is an element of". For the set above, 4 \u2208 A and 5 \u2209 A. Everything else in this chapter is built on that one relation.',
  ],
  representations: ['A set written in both forms side by side, so the same object is seen twice'],
  workedExamples: [
    { id: 's12.we1', prompt: 'Write the set of even natural numbers less than 10 in both forms.',
      steps: [
        { text: 'Check the description is well defined: for any number, we can decide whether it is an even natural number below 10.', reasoning: 'Without that, there is no set to write; the test comes before the notation.' },
        { text: `Roster form: list them. ${roster(S_EVEN10)}.`, reasoning: 'There are only four, so listing shows the whole set at a glance.' },
        { text: 'Set-builder form: {x : x is an even natural number and x < 10}.', reasoning: 'The colon is read "such that". The rule stands in for the list.' },
      ], answer: `${roster(S_EVEN10)}, or {x : x is an even natural number and x < 10}.` },
    { id: 's12.we2', prompt: 'Decide whether each is a set: (a) the first three letters of the alphabet, (b) the difficult chapters in this book.',
      steps: [
        { text: '(a) For any letter, we can decide whether it is one of the first three. It is a set: {a, b, c}.', reasoning: 'The membership question has one definite answer for every object.' },
        { text: '(b) "Difficult" depends on who is asked, so two people would list different chapters.', reasoning: 'Membership is not determined by the description, so there is no single collection to speak of.' },
      ], answer: '(a) is a set; (b) is not, because it is not well defined.' },
    { id: 's12.we3', prompt: `A student writes the set of even natural numbers below 10 as ${roster(S_EVEN10)} and then as {2, 4, 6, 8, 10}. Are both right?`,
      steps: [
        { text: 'Test 10 against the rule: is 10 less than 10?', reasoning: 'Membership is decided by the stated property, not by the look of the pattern.' },
        { text: 'It is not, so 10 does not belong and the second list is wrong.', reasoning: 'The pattern "keep adding 2" is a habit, not the rule; the rule has an upper limit the habit ignores.' },
      ], answer: `Only ${roster(S_EVEN10)} is correct.` },
  ],
  guidedPractice: [
    { id: 's12.g1', prompt: 'Write {x : x is an odd natural number less than 6} in roster form.', hint: 'Which odd naturals are below 6?', answer: roster(S_ODD5), rationale: `Testing each odd natural against the rule gives ${roster(S_ODD5)}; 7 fails because it is not below 6.` },
    { id: 's12.g2', prompt: 'Is "the tall students in the class" a set?', hint: 'Could two people disagree about a particular student?', answer: 'No.', rationale: 'There is no agreed line for "tall", so membership is not determined. A set needs a definite answer for every object.' },
    { id: 's12.g3', prompt: 'True or false: 3 \u2208 {2, 4, 6, 8}.', hint: 'Is 3 in the list?', answer: 'False; 3 \u2209 {2, 4, 6, 8}.', rationale: 'Membership is checked against the elements themselves, not against the pattern they follow.' },
  ],
  independentPractice: [
    { id: 's12.i1', prompt: 'Write the set of letters in the word "level" in roster form.', answer: '{l, e, v}.', rationale: 'The letters l and e each appear twice in the word, but a set records which objects belong, not how often they occur.' },
    { id: 's12.i2', prompt: 'Write {3, 6, 9, 12} in set-builder form.', answer: '{x : x is a multiple of 3 and x \u2264 12}, with x a natural number.', rationale: 'The rule has to pin down both the pattern and where it stops, or it describes a different set.' },
    { id: 's12.i3', prompt: 'Why can the same set have two different-looking descriptions?', answer: 'Because a set is determined by which objects belong to it, not by how it is written.', rationale: 'Notation is a way of pointing at the collection. Two notations that pick out the same objects point at the same set.' },
  ],
  reasoningApplication: [
    { id: 's12.td1', prompt: 'Someone claims that set-builder form is always better because it is shorter. When is roster form the honest choice?',
      expectedReasoning: 'When the rule is awkward to state but the elements are few and obvious. {a, b, c} needs no rule. Forcing a rule onto a short list can also mislead: a reader may take the rule as the definition and extend the pattern past where the set stops, which is exactly the mistake in the third worked example.' },
  ],
  summary: `A set is a well-defined collection treated as one object. Roster form lists its elements, ${roster(S_EVEN10)}; set-builder form states their shared property. Both can name the same set, because a set is fixed by what belongs to it.`,
  nextStep: 'Next you will meet a set with no elements at all.',
  teacher: teacher('Represent a set in roster and set-builder form and decide whether a description defines a set.',
    ['Natural numbers'], ['"is an element of" for \u2208', '"such that" for the colon in set-builder form'],
    ['The well-defined test deserves real time. Students accept "the interesting numbers" as a set surprisingly often.',
     'Worked example 3 is the pattern-over-rule error. It recurs all chapter and is worth naming here.'],
    ['Ask for a description that is not well defined, then ask why.'],
    ['Work from the rule to the list one object at a time, saying "yes it belongs" or "no it does not" out loud.'],
    ['Ask for a set that is easy in one form and painful in the other.']),
},
// ============================== C11-SET-02 =================================
{
  ...base,
  contentArtifactId: 'ncert_kemh1_s1_3_empty_set_lesson',
  source: source('1.3', 'The Empty Set', 3),
  sequence: { prerequisiteSectionIds: ['ncert_kemh1_s1_2'], mayAssume: ['Roster and set-builder form'], mustNotIntroduce: [{ concept: 'Subsets of the empty set', belongsToSection: 'ncert_kemh1_s1_6' }] },
  learningGoal: `You will recognise when a description has no elements at all, and see why ${EMPTY_SET_SYMBOL} and {${EMPTY_SET_SYMBOL}} are different sets.`,
  priorKnowledgeCheck: { prompt: 'Before you start, check that you can:', checks: ['Test an object against a stated rule.', 'Write a set in roster form.'], ifNotReady: 'Return to the previous lesson and practise deciding membership from a rule.' },
  vocabulary: [
    { term: 'empty set', meaning: `The set with no elements, written ${EMPTY_SET_SYMBOL} or { }.` },
    { term: 'null set', meaning: 'Another name for the empty set.' },
  ],
  explanation: [
    'Some descriptions are perfectly well defined and yet nothing satisfies them. "The natural numbers between 3 and 4" is one: we can test any number, and every test comes back no.',
    `That collection is still a set. It is the empty set, written ${EMPTY_SET_SYMBOL} or { }. It has no elements, so its roster is ${roster(S_EMPTY)}.`,
    'There is exactly one empty set. Two empty descriptions give the same set, because a set is fixed by what belongs to it, and in both cases nothing does.',
    `Now a distinction worth real care. ${EMPTY_SET_SYMBOL} has no elements. The set {${EMPTY_SET_SYMBOL}} has one element, and that element happens to be the empty set. A box with nothing in it is not the same as a box containing an empty box.`,
    `So ${EMPTY_SET_SYMBOL} has 0 elements and {${EMPTY_SET_SYMBOL}} has ${cardinality(S_CONTAINS_EMPTY)}. They are different sets, and writing one when you mean the other changes the mathematics.`,
  ],
  representations: ['An empty pair of braces, beside a pair of braces containing the empty-set symbol'],
  workedExamples: [
    { id: 's13.we1', prompt: 'Is {x : x is a natural number and 3 < x < 4} the empty set?',
      steps: [{ text: 'Test the natural numbers near the range: 3 is not strictly greater than 3, and 4 is not strictly less than 4.', reasoning: 'Strict inequalities exclude the endpoints, which is where the only candidates were.' },
        { text: 'No natural number lies strictly between them.', reasoning: 'The naturals have no member between consecutive values, so the description catches nothing.' },
        { text: `So the set is ${EMPTY_SET_SYMBOL}.`, reasoning: 'A well-defined description with no qualifying objects names the empty set, not a failure to make a set.' }],
      answer: `Yes, it is ${EMPTY_SET_SYMBOL}.` },
    { id: 's13.we2', prompt: `How many elements does {${EMPTY_SET_SYMBOL}} have?`,
      steps: [{ text: 'Look at what is inside the braces: one thing is listed.', reasoning: 'Counting elements means counting what the braces contain, whatever those things are.' },
        { text: `That one thing is ${EMPTY_SET_SYMBOL}, which is itself a set with no elements.`, reasoning: 'A set may have sets as elements; being empty does not stop it being an object.' },
        { text: `So {${EMPTY_SET_SYMBOL}} has ${cardinality(S_CONTAINS_EMPTY)} element.`, reasoning: `The emptiness of the element says nothing about how many elements the outer set has.` }],
      answer: `${cardinality(S_CONTAINS_EMPTY)} element.` },
    { id: 's13.we3', prompt: `A student writes ${EMPTY_SET_SYMBOL} = {${EMPTY_SET_SYMBOL}}. What has gone wrong?`,
      steps: [{ text: `Count each side: the left has ${cardinality(S_EMPTY)} elements, the right has ${cardinality(S_CONTAINS_EMPTY)}.`, reasoning: 'Two sets with different numbers of elements cannot be equal.' },
        { text: 'The student has treated the symbol as decoration rather than as an object that can itself be an element.', reasoning: 'Once sets can be elements of other sets, the braces around a symbol change what is being described.' }],
      answer: `They are different sets: ${EMPTY_SET_SYMBOL} is empty, {${EMPTY_SET_SYMBOL}} is not.` },
  ],
  guidedPractice: [
    { id: 's13.g1', prompt: 'Is {x : x is an even natural number and x is odd} empty?', hint: 'Can one number be both?', answer: `Yes, it is ${EMPTY_SET_SYMBOL}.`, rationale: 'No natural number is both even and odd, so no object satisfies the rule. The description is well defined and catches nothing.' },
    { id: 's13.g2', prompt: `Is { } the same as ${EMPTY_SET_SYMBOL}?`, hint: 'How many elements does each have?', answer: 'Yes.', rationale: 'Both have no elements, and a set is determined by its elements, so they are the same set written two ways.' },
    { id: 's13.g3', prompt: `Is {0} the empty set?`, hint: 'Is there something inside the braces?', answer: 'No.', rationale: 'It has one element, the number 0. A set containing zero is not an empty set; zero is an object like any other.' },
  ],
  independentPractice: [
    { id: 's13.i1', prompt: 'Give a well-defined description whose set is empty.', answer: 'For example, {x : x is a natural number and x + 1 = x}.', rationale: 'The description must be testable and must fail every test. Being untestable would make it not a set at all, which is a different situation.' },
    { id: 's13.i2', prompt: `How many elements does {${EMPTY_SET_SYMBOL}, 1} have?`, answer: '2.', rationale: `Two things are listed: the empty set and the number 1. The first being empty does not reduce the count.` },
    { id: 's13.i3', prompt: 'Why is there only one empty set?', answer: 'Because any two sets with no elements have exactly the same elements, namely none.', rationale: 'Equality of sets is decided by membership, and two empty sets agree on every membership question.' },
  ],
  reasoningApplication: [
    { id: 's13.td1', prompt: `Why do ${EMPTY_SET_SYMBOL} and {${EMPTY_SET_SYMBOL}} being different matter, rather than being a notational quibble?`,
      expectedReasoning: 'Because counting depends on it. Later in this chapter you count elements of unions and intersections, and a set that contains an empty set contributes one to the count while an empty set contributes none. If the two were confused, every count involving them would be out by one, and the error would look like arithmetic rather than like a misread of what the braces mean.' },
  ],
  summary: `A well-defined description with nothing satisfying it names the empty set ${EMPTY_SET_SYMBOL}, which has no elements. There is exactly one. It is not the same as {${EMPTY_SET_SYMBOL}}, which has one element.`,
  nextStep: 'Next you will separate sets that can be counted from those that cannot.',
  teacher: teacher(`Identify the empty set and distinguish it from {${EMPTY_SET_SYMBOL}}.`,
    ['Roster form', 'Testing membership against a rule'],
    [`"the empty set" rather than "nothing"`, '"has no elements" rather than "is nothing"'],
    [`The ${EMPTY_SET_SYMBOL} versus {${EMPTY_SET_SYMBOL}} distinction is the highest-value idea in this lesson and the easiest to skim past.`,
     'Students often think an empty description means "not a set". It means a set with nothing in it.'],
    [`Ask how many elements {${EMPTY_SET_SYMBOL}, ${EMPTY_SET_SYMBOL}} has.`],
    ['Use the box picture: an empty box, versus a box with an empty box inside it.'],
    [`Ask what {{${EMPTY_SET_SYMBOL}}} contains.`]),
},

makeLesson2({ id:'ncert_kemh1_s1_4_finite_infinite_lesson', sec:'1.4', title:'Finite and Infinite Sets', page:4,
 prereq:['ncert_kemh1_s1_3'], assume:['Roster and set-builder form','The empty set'],
 goal:'You will decide whether a set is finite or infinite from the rule that defines it, not from how its roster is written.',
 checks:['Write a set from a rule.','Count the elements of a short list.'], ifNot:'Revisit writing a set from a rule; that is what decides the answer here.',
 vocab:[['finite set','A set whose elements can be counted, the counting coming to an end.'],['infinite set','A set whose elements cannot be exhausted by counting.'],['cardinal number','For a finite set A, the number of distinct elements in it, written n(A).']],
 expl:['A set is finite if listing its elements would come to an end, and infinite if it would not. The empty set is finite, with no elements to count.',
  'The number of distinct elements of a finite set A is written n(A). Distinct matters: a roster that repeats an element does not count it twice.',
  'It is tempting to decide by looking at the notation. A roster with dots in it, like {1, 2, 3, ...}, suggests endlessness; one without dots suggests an end. That reading is unreliable, because {1, 2, 3, ..., 100} also has dots and is finite.',
  'The rule decides, not the dots. "The natural numbers" is infinite because for every one you name there is a larger one. "The natural numbers below 100" is finite because the rule puts a ceiling on it.',
  'For this course, finite or infinite is the whole classification. We do not compare the sizes of different infinite sets.'],
 rep:['Two rules side by side, one with a ceiling and one without'],
 we:[{id:'s14.we1',prompt:'Is the set of natural numbers less than 100 finite?',steps:[['The rule places a ceiling at 100.','A ceiling means the listing has somewhere to stop.'],['Counting from 1 upward reaches 99 and stops.','Reaching a last element is exactly what finite means.']],answer:'Finite, with n = 99.'},
  {id:'s14.we2',prompt:'Is the set of even natural numbers finite?',steps:[['Suppose the listing ended at some even number k.','Testing the claim against the rule is more reliable than reading the notation.'],['Then k + 2 is also even and larger, so the listing had not ended.','Every candidate for a last element produces a larger one, so there is none.']],answer:'Infinite.'},
  {id:'s14.we3',prompt:'A student says {1, 2, 3, ..., 50} is infinite because it has dots. What has gone wrong?',steps:[['Read the rule the dots stand for: continue to 50.','Dots abbreviate a listing; they do not assert that it never ends.'],['The listing stops at 50, so the set is finite with n = 50.','The notation was read as the mathematics, which is the error.']],answer:'It is finite; the dots are an abbreviation, not a claim of endlessness.'}],
 g:[{id:'s14.g1',prompt:'Is the set of letters of the English alphabet finite?',hint:'Does the listing end?',answer:'Finite, n = 26.',why:'The alphabet has a last letter, so the counting comes to an end.'},
  {id:'s14.g2',prompt:'Is the set of multiples of 5 finite?',hint:'Is there a largest one?',answer:'Infinite.',why:'For any multiple of 5 you name, adding 5 gives a larger one, so no listing can be complete.'},
  {id:'s14.g3',prompt:'What is n(A) for A = {3, 3, 5, 7}?',hint:'How many distinct elements?',answer:'3.',why:'The repeat of 3 is a feature of the writing, not of the set. The distinct elements are 3, 5 and 7.'}],
 i:[{id:'s14.i1',prompt:'Is the empty set finite or infinite?',answer:'Finite.',why:'Counting its elements ends immediately, with n = 0. Having nothing to count is not the same as counting forever.'},
  {id:'s14.i2',prompt:'Give an infinite set whose roster can be written with dots, and a finite one whose roster also uses dots.',answer:'{2, 4, 6, ...} is infinite; {2, 4, 6, ..., 20} is finite.',why:'The dots look the same in both. What differs is whether the rule they abbreviate has a stopping point.'},
  {id:'s14.i3',prompt:'Why does n(A) count distinct elements?',answer:'Because a set records which objects belong, not how many times they are written.',why:'Membership is a yes-or-no question for each object, so an object cannot belong twice.'}],
 td:[{id:'s14.td1',prompt:'Someone proposes a quick rule: "dots mean infinite". Construct two sets showing why the rule fails in both directions.',reasoning:'{1, 2, ..., 10} has dots and is finite, so dots do not imply infinite. The set of natural numbers can be written {x : x is a natural number} with no dots at all and is infinite, so the absence of dots does not imply finite. The notation is a way of writing the rule down; only the rule settles whether the counting ends.'}],
 summary:'A set is finite when counting its elements ends and infinite when it does not, and n(A) counts the distinct elements of a finite set. The rule decides, never the dots.',
 next:'Next you will decide when two sets are the same set.',
 t:['Classify a set as finite or infinite from its defining rule and compute n(A) for a finite set.',['Roster and set-builder form','The empty set'],['"the counting comes to an end" rather than "it is small"'],['The dots misconception is the lesson. Both worked example 3 and the Think deeper task attack it directly.','Resist comparing infinities; the source does not, and Class 11 does not need it.'],['Ask for a finite set written with dots.'],['Ask "is there a last one?" and have the student try to name it.'],['Ask whether the set of fractions between 0 and 1 is finite.']]}),

makeLesson2({ id:'ncert_kemh1_s1_5_equal_sets_lesson', sec:'1.5', title:'Equal Sets', page:5,
 prereq:['ncert_kemh1_s1_4'], assume:['Membership','Roster form','n(A) for a finite set'],
 goal:'You will decide whether two sets are equal by comparing membership, and see why order and repetition do not change a set.',
 checks:['Test whether an object belongs to a set.','List the distinct elements of a roster.'], ifNot:'Practise reading membership off a roster before comparing two of them.',
 vocab:[['equal sets','Two sets are equal when every element of each belongs to the other. We write A = B.']],
 expl:['Two sets are equal when they have exactly the same elements. Written out: every element of A is in B, and every element of B is in A.',
  'Nothing in that definition mentions the order of the writing, or whether an element was written twice, or which symbols were used. Those are all features of the notation.',
  `So ${roster(S_EVEN10)} and {8, 2, 6, 4, 2} are the same set. The second is written in a different order with 2 repeated, and neither changes which objects belong.`,
  'Checking equality is therefore a membership test done twice, once in each direction. Both directions are needed: every element of {1, 2} is in {1, 2, 3}, but the sets are not equal, because 3 is in the second and not the first.',
  'This is why a set can be described in two ways and still be one set, which is what the first lesson claimed and this lesson now justifies.'],
 rep:['The same set written twice, in different orders, side by side'],
 we:[{id:'s15.we1',prompt:`Is ${roster(S_EVEN10)} equal to {8, 2, 6, 4, 2}?`,steps:[['Check each element of the first against the second: 2, 4, 6 and 8 all appear.','This is the first direction of the test.'],['Check each element of the second against the first: 8, 2, 6, 4 all appear, and the repeated 2 adds nothing new.','The second direction. A repeat is already covered by the first occurrence.'],['Both directions hold, so the sets are equal.','Order and repetition were never part of the test.']],answer:'Yes, they are equal.'},
  {id:'s15.we2',prompt:'Is {1, 2} equal to {1, 2, 3}?',steps:[['Every element of {1, 2} is in {1, 2, 3}.','The first direction holds, but on its own it only shows that nothing in the smaller set is missing from the larger.'],['But 3 is in {1, 2, 3} and not in {1, 2}.','The second direction fails, and a single element present on one side only is enough to defeat equality however well the first direction went.']],answer:'No. One direction holding is not enough.'},
  {id:'s15.we3',prompt:'A student says {a, b} and {b, a} are different because the order differs. What has gone wrong?',steps:[['Ask the membership question for each object: a belongs to both, b belongs to both.','Equality is settled by membership, and membership has no notion of position.'],['Order is a property of the writing, like the choice of ink.','Treating a feature of the notation as a feature of the object is the error.']],answer:'They are the same set.'}],
 g:[{id:'s15.g1',prompt:'Is {3, 1, 2} equal to {1, 2, 3}?',hint:'Check membership both ways.',answer:'Yes.',why:'Each contains exactly 1, 2 and 3. The order of writing is not part of what a set is.'},
  {id:'s15.g2',prompt:'Is {1, 1, 2} equal to {1, 2}?',hint:'Which distinct objects belong?',answer:'Yes.',why:'Both have the elements 1 and 2. Writing 1 twice does not make it belong twice.'},
  {id:'s15.g3',prompt:'Why must equality be checked in both directions?',hint:'Think of a set inside a bigger one.',answer:'Because one direction only shows containment.',why:'Every element of {1, 2} is in {1, 2, 3}, yet the sets differ. The second direction is what rules that out.'}],
 i:[{id:'s15.i1',prompt:'Are {x : x is a letter in "follow"} and {f, o, l, w} equal?',answer:'Yes.',why:'The letters of "follow" are f, o, l, w, with o and l repeated in the word. The set records the distinct letters.'},
  {id:'s15.i2',prompt:'Give two sets where one direction of the test holds and the other fails.',answer:'For example {2} and {2, 4}.',why:'Every element of the first is in the second, but 4 is in the second only. This is containment without equality.'},
  {id:'s15.i3',prompt:`Is ${E} equal to {0}?`,answer:'No.',why:`${E} has no elements and {0} has one. They disagree about whether 0 belongs.`}],
 td:[{id:'s15.td1',prompt:'Why does order not matter for a set, when it clearly matters for a phone number?',reasoning:'Because a set answers only one question about each object: does it belong? A phone number is a sequence, where position carries information, so 2 in the first place and 2 in the third place mean different things. A set has no places. If we needed order we would use a different object, and in the next chapter ordered pairs do exactly that.'}],
 summary:`Two sets are equal when each contains every element of the other, tested in both directions. Order and repetition belong to the writing, not the set, so ${roster(S_EVEN10)} and {8, 2, 6, 4, 2} are one set.`,
 next:'Next you will ask when one set sits inside another.',
 t:['Decide equality of sets by two-directional membership testing.',['Membership','Roster form'],['"has exactly the same elements" rather than "looks the same"'],['The one-direction error in worked example 2 is the seed of the subset idea in the next lesson; naming it now makes that lesson easier.','Students who accept {a,b} = {b,a} readily may still reject {1,1,2} = {1,2}. Both come from the same confusion.'],['Ask whether {1,2} = {2,1,1}.'],['Have the student tick off elements one at a time in each direction.'],['Ask when order would matter, pointing toward ordered pairs.']]}),

makeLesson2({ id:'ncert_kemh1_s1_6_subsets_lesson', sec:'1.6', title:'Subsets', page:6,
 prereq:['ncert_kemh1_s1_5'], assume:['Equality of sets','Membership'],
 notIntroduce:[['Intervals as subsets of the reals','ncert_kemh1_s1_6_intervals'],['The universal set','ncert_kemh1_s1_7']],
 goal:'You will decide whether one set is contained in another, and separate a subset from a proper subset.',
 checks:['Test membership.','Decide equality of two sets.'], ifNot:'Go back to the two-directional equality test; a subset is one of those two directions.',
 vocab:[['subset','A is a subset of B when every element of A is also an element of B, written A \\u2286 B.'],['proper subset','A is a proper subset of B when A \\u2286 B and A is not equal to B.'],['subset test','Checking, one element at a time, that every element of the first set belongs to the second.']],
 expl:['The previous lesson needed two directions to establish equality. A single direction is worth a name of its own: when every element of A belongs to B, we say A is a subset of B, written A \\u2286 B.',
  `So ${roster(S_ODD5)} \\u2286 ${roster(S_FIRST5)}, because 1, 3 and 5 all appear in the second set. The test is elementwise and nothing else.`,
  'Every set is a subset of itself, since every element of A is certainly in A. And the empty set is a subset of every set, because it has no element that could fail the test.',
  `When A \\u2286 B and the two are not equal, A is a proper subset of B. ${roster(S_ODD5)} is a proper subset of ${roster(S_FIRST5)} because 2 and 4 are in the larger set only.`,
  'A caution about the reading of pictures: containment is decided by elements, not by a drawing. A circle drawn inside another circle asserts a subset relation; it does not establish one. The elements settle it.'],
 rep:['Two sets listed elementwise, with each element of the smaller checked against the larger'],
 visuals:[V_SUBSET],
 we:[{id:'s16.we1',prompt:`Is ${roster(S_ODD5)} a subset of ${roster(S_FIRST5)}?`,steps:[['Test 1: it is in the larger set.','The subset test is one element at a time, in one direction only.'],['Test 3, then 5: both are in the larger set.','Every element has been checked, which is what the definition requires.'],[`So ${roster(S_ODD5)} \\u2286 ${roster(S_FIRST5)}.`,'No element of the smaller set failed, so containment holds.']],answer:'Yes.'},
  {id:'s16.we2',prompt:`Is ${roster(S_ODD5)} a proper subset of ${roster(S_FIRST5)}?`,steps:[['Containment was established above.','Proper subset requires containment first, so the work already done is not repeated, only added to.'],[`The sets are not equal: 2 is in ${roster(S_FIRST5)} and not in ${roster(S_ODD5)}.`,'The extra element is what makes the containment strict.'],[`So it is a proper subset: ${isProperSubset(S_ODD5,S_FIRST5)}.`,'Both conditions hold: the containment was shown and the extra element rules out equality.']],answer:'Yes, a proper subset.'},
  {id:'s16.we3',prompt:'A student concludes A \\u2286 B because A has fewer elements than B. What has gone wrong?',steps:[['Take A = {7} and B = {1, 2, 3}. A has fewer elements.','A counterexample settles whether the reasoning is sound.'],['But 7 is not in B, so A is not a subset of B.','Size is a consequence of containment, never a substitute for the test.']],answer:'Fewer elements does not imply containment; each element must be checked.'}],
 g:[{id:'s16.g1',prompt:'Is {2, 4} \\u2286 {1, 2, 3, 4, 5}?',hint:'Check each element.',answer:'Yes.',why:'Both 2 and 4 appear in the larger set, so every element passes the test.'},
  {id:'s16.g2',prompt:`Is ${E} \\u2286 {1, 2}?`,hint:'Is there an element that fails?',answer:'Yes.',why:'The empty set has no element, so no element can fail the test. The containment holds vacuously.'},
  {id:'s16.g3',prompt:'Is {1, 2} a proper subset of {1, 2}?',hint:'Are they equal?',answer:'No.',why:'It is a subset, but the sets are equal, so the containment is not proper.'}],
 i:[{id:'s16.i1',prompt:'Is {1, 5} \\u2286 {1, 2, 3}?',answer:'No.',why:'5 is not in the second set, and a single failing element is enough to defeat containment.'},
  {id:'s16.i2',prompt:'List all subsets of {a, b}.',answer:`${E}, {a}, {b}, {a, b}.`,why:'Each element is either in or out, giving four combinations. The empty set and the whole set are both included.'},
  {id:'s16.i3',prompt:'If A \\u2286 B and B \\u2286 A, what follows?',answer:'A = B.',why:'The two containments are exactly the two directions of the equality test from the previous lesson.'},
  {id:'s16.i4',prompt:'A diagram shows circle A inside circle B. Does that prove A \\u2286 B?',answer:'No.',why:'The picture represents a claim about elements. It is only correct if every element of A really is in B, which the elements decide.'}],
 td:[{id:'s16.td1',prompt:`Why is ${E} a subset of every set, when it has nothing in common with them?`,reasoning:`The test asks whether any element of ${E} fails to belong to the other set. ${E} has no elements, so nothing can fail, and the test passes. It passes not because the sets share something but because there is no opportunity for the condition to break. The same reasoning shows there is nothing special about which set is on the right.`}],
 summary:`A \\u2286 B when every element of A is in B, tested one element at a time. If in addition A is not equal to B, the containment is proper. ${E} is a subset of every set and every set is a subset of itself.`,
 next:'Next you will see intervals treated as subsets of the real numbers.',
 t:['Decide subset and proper-subset relations by elementwise testing.',['Equality of sets','Membership'],['"every element of A is in B" rather than "A is smaller"'],['Connect the subset test explicitly to one direction of the equality test; students who see that get proper subset for free.','The vacuous truth for the empty set is worth stating carefully rather than asserting.'],['Ask whether {1} \\u2286 {1}.'],['Have the student check one element at a time and say which fails.'],['Ask how many subsets a three-element set has.']]}),

makeLesson2({ id:'ncert_kemh1_s1_6_intervals_lesson', sec:'1.6', title:'Intervals as Subsets of R', page:7,
 prereq:['ncert_kemh1_s1_6'], assume:['Subsets','The real number line from earlier classes'],
 goal:'You will read and write open, closed and half-open intervals as subsets of the real numbers, and say exactly which endpoints belong.',
 checks:['Decide whether one set is a subset of another.','Place numbers on a number line.'], ifNot:'Revise the subset test; an interval is a subset of the reals described by two endpoints.',
 vocab:[['interval','A set of all real numbers lying between two endpoints.'],['open interval','(a, b) is the set of reals strictly between a and b; neither endpoint belongs.'],['closed interval','[a, b] includes both endpoints.'],['half-open interval','An interval including one endpoint and excluding the other, such as [a, b).']],
 expl:['Between any two real numbers there are infinitely many more, so a set of reals cannot usually be listed. Intervals give a compact way to describe such sets.',
  `The open interval ${formatInterval(I_OPEN)} is {x : x is real and ${I_OPEN.low} < x < ${I_OPEN.high}}. Round brackets say the endpoints are excluded.`,
  `The closed interval ${formatInterval(I_CLOSED)} is {x : ${I_CLOSED.low} \\u2264 x \\u2264 ${I_CLOSED.high}}. Square brackets say the endpoints belong.`,
  `An interval can be closed at one end and open at the other, like ${formatInterval(I_HALF)}, which contains ${I_HALF.low} but not ${I_HALF.high}.`,
  'The bracket is not decoration. It answers a membership question about the endpoint, and swapping it changes which set is meant. Every interval here is a subset of the real numbers, and each is infinite, so none has a roster.'],
 rep:['A number line with the interval marked, a filled dot for an included endpoint and a hollow dot for an excluded one'],
 we:[{id:'s16i.we1',prompt:`Does ${I_OPEN.low} belong to ${formatInterval(I_OPEN)}?`,steps:[[`The interval is open at ${I_OPEN.low}, so the condition is ${I_OPEN.low} < x, strictly.`,'The bracket tells us which inequality to use.'],[`${I_OPEN.low} is not strictly greater than itself, so it fails: ${isMember(I_OPEN,2)}.`,'The endpoint is the one value the strict inequality excludes.']],answer:`No, ${I_OPEN.low} \\u2209 ${formatInterval(I_OPEN)}.`},
  {id:'s16i.we2',prompt:`Does ${I_CLOSED.low} belong to ${formatInterval(I_CLOSED)}?`,steps:[[`The interval is closed at ${I_CLOSED.low}, so the condition is ${I_CLOSED.low} \\u2264 x.`,'A square bracket admits the endpoint, which is the one value where the two bracket choices disagree.'],[`${I_CLOSED.low} satisfies that, so it belongs: ${isMember(I_CLOSED,2)}.`,'The same number belongs or not depending only on the bracket.']],answer:`Yes.`},
  {id:'s16i.we3',prompt:`Which of ${formatInterval(I_OPEN)}, ${formatInterval(I_CLOSED)} and ${formatInterval(I_HALF)} contain 7?`,steps:[[`${formatInterval(I_OPEN)}: open at 7, so 7 is excluded: ${isMember(I_OPEN,7)}.`,'Testing the endpoint against each bracket is the whole question.'],[`${formatInterval(I_CLOSED)}: closed at 7, so 7 belongs: ${isMember(I_CLOSED,7)}.`,'The same value, a different answer, because the bracket differs.'],[`${formatInterval(I_HALF)}: open at 7, so 7 is excluded: ${isMember(I_HALF,7)}.`,'Half-open means one end each way; here the right end is open.']],answer:`Only ${formatInterval(I_CLOSED)}.`}],
 g:[{id:'s16i.g1',prompt:`Is 5 in ${formatInterval(I_OPEN)}?`,hint:'Is it strictly between the endpoints?',answer:`Yes: ${isMember(I_OPEN,5)}.`,why:'5 lies strictly between 2 and 7, so it satisfies both strict inequalities.'},
  {id:'s16i.g2',prompt:`Write ${formatInterval(I_HALF)} in set-builder form.`,hint:'Which endpoint is included?',answer:`{x : ${I_HALF.low} \\u2264 x < ${I_HALF.high}}.`,why:'The square bracket on the left gives \\u2264 and the round bracket on the right gives <.'},
  {id:'s16i.g3',prompt:'Can an interval be written in roster form?',hint:'How many reals lie between 2 and 3?',answer:'No.',why:'Infinitely many reals lie between any two endpoints, so no list could be complete.'}],
 i:[{id:'s16i.i1',prompt:`How many elements does ${formatInterval(I_OPEN)} have?`,answer:'Infinitely many.',why:'Between any two reals there is another, so the listing never ends. The interval is a subset of R, not a short list.'},
  {id:'s16i.i2',prompt:`Is ${formatInterval(I_OPEN)} a subset of ${formatInterval(I_CLOSED)}?`,answer:'Yes.',why:'Every real strictly between 2 and 7 also satisfies the weaker conditions with \\u2264. The closed interval adds the two endpoints.'},
  {id:'s16i.i3',prompt:'A student writes (7, 2) for the numbers between 2 and 7. What is wrong?',answer:'The endpoints are in the wrong order.',why:'An interval is written with the smaller endpoint first; as written, no real is both greater than 7 and less than 2.'}],
 td:[{id:'s16i.td1',prompt:'Why do mathematicians bother distinguishing (2, 7) from [2, 7] when they differ by only two numbers out of infinitely many?',reasoning:'Because the difference is not about size but about which questions have answers. [2, 7] has a largest element and (2, 7) does not, so a claim like "the largest value is 7" is true of one and meaningless for the other. Later work on limits and on maximum values turns on exactly this, and two numbers out of infinitely many is enough to change what can be said.'}],
 summary:`An interval is a set of reals given by two endpoints, and the brackets say which endpoints belong: ${formatInterval(I_OPEN)} excludes both, ${formatInterval(I_CLOSED)} includes both, ${formatInterval(I_HALF)} includes only the left. Each is an infinite subset of R.`,
 next:'Next you will fix a universal set, which is what complements need.',
 t:['Interpret interval notation as a membership condition on the real numbers.',['Subsets','The real number line'],['"the endpoint belongs" rather than "the bracket is square"'],['Test the endpoint explicitly every time; it is the only value where the bracket changes the answer.','Students often treat brackets as stylistic. The third worked example makes the difference consequential.'],['Ask whether 7 is in [2, 7).'],['Use a number line with filled and hollow dots and read the dot aloud as belongs or does not.'],['Ask what [2, 2] contains.']]}),


makeLesson2({ id:'ncert_kemh1_s1_7_universal_set_lesson', sec:'1.7', title:'Universal Set', page:9,
 prereq:['ncert_kemh1_s1_6'], assume:['Subsets','Membership'],
 notIntroduce:[['Complement of a set','ncert_kemh1_s1_10']],
 goal:'You will fix a universal set for a discussion and see that the same set sits inside different valid universes.',
 checks:['Decide whether one set is a subset of another.','Write a set in roster form.'], ifNot:'Revisit the subset test; a universal set is one every set in the discussion sits inside.',
 vocab:[['universal set','The set containing every object under discussion in a particular context, usually written U.']],
 expl:['Every discussion about sets happens inside some larger collection. When we talk about the even numbers below 10, we have the natural numbers in mind, not the letters of the alphabet.',
  'That larger collection is called the universal set, written U. Choosing it is a decision about the context, not a discovery about the mathematics.',
  `A universal set has to contain every set being discussed. For A = ${roster(S_A)}, the set ${roster(U_DIGITS)} works, because every element of A is in it: ${isSubset(S_A,U_DIGITS)}. A set that left out 6 would not be a universe for A at all.`,
  `There is no single permanent U. For the same A, ${roster(U_SMALL)} is also a valid universe, since A is a subset of that too. The two are both legitimate and they are different.`,
  'This matters for what comes next. The idea of everything outside A only makes sense once outside has a boundary, and U is that boundary. Change U and you change what outside means, even though A has not moved.'],
 rep:['A rectangle marked U with the set A drawn inside it, the rectangle redrawn at a different size to show a second valid choice'],
 we:[{id:'s17.we1',prompt:`Is ${roster(U_DIGITS)} a valid universal set for A = ${roster(S_A)}?`,steps:[['Check that every element of A appears in the proposed universe.','A universe must contain the sets being discussed; otherwise some element of A is outside everything.'],[`Each of 1 to 6 is in the list, so A is a subset: ${isSubset(S_A,U_DIGITS)}.`,'Containment is the whole requirement, so nothing further about the universe needs checking.']],answer:'Yes.'},
  {id:'s17.we2',prompt:`Is {1, 2, 3} a valid universal set for A = ${roster(S_A)}?`,steps:[['Test the elements of A against it: 4 is in A.','The test runs over A, not over the proposed universe.'],[`4 is not in {1, 2, 3}, so A is not a subset: ${isSubset(S_A,set('u3','U',[1,2,3]))}.`,'One element outside is enough to disqualify the choice.']],answer:'No; it does not contain all of A.'},
  {id:'s17.we3',prompt:`Give two different valid universes for A = ${roster(S_A)} and say what each one is useful for.`,steps:[[`${roster(U_DIGITS)}: the natural numbers up to ten, useful when the discussion is about single-digit counting.`,'A universe is chosen to suit the conversation, and a different conversation would justify a different one.'],[`${roster(U_SMALL)}: exactly the numbers in A, useful when A is the whole of what is being discussed.`,'Both contain A, so both are valid; neither is more correct in the abstract.']],answer:'Both are valid; the choice depends on the context.'}],
 g:[{id:'s17.g1',prompt:`Is ${roster(U_SMALL)} a valid universe for ${roster(S_ODD5)}?`,hint:'Is every element of the set inside it?',answer:`Yes: ${isSubset(S_ODD5,U_SMALL)}.`,why:'1, 3 and 5 all appear in it, so the containment the definition requires holds.'},
  {id:'s17.g2',prompt:'Is there one universal set for all of mathematics?',hint:'Does the context ever change?',answer:'No.',why:'U is chosen to suit the discussion. A conversation about letters and a conversation about numbers need different universes.'},
  {id:'s17.g3',prompt:'Why must U contain every set being discussed?',hint:'What would it mean for an element to be outside the universe?',answer:'Otherwise some element would lie outside everything, and the universe would not be universal for that discussion.',why:'The whole purpose of U is to give outside a meaning, which it cannot do if it omits part of what is being talked about.'}],
 i:[{id:'s17.i1',prompt:`Propose a valid universe for the set of vowels, and one that is not valid.`,answer:'Valid: the letters of the English alphabet. Not valid: {a, e, i}.',why:'The second omits o and u, which are vowels, so the set of vowels is not a subset of it.'},
  {id:'s17.i2',prompt:'Can two different universes both be valid for the same set at the same time?',answer:'Yes.',why:`${roster(U_DIGITS)} and ${roster(U_SMALL)} both contain ${roster(S_A)}. Validity is containment, and more than one set can contain A.`},
  {id:'s17.i3',prompt:'If U is chosen to be A itself, is that allowed?',answer:'Yes.',why:'Every set is a subset of itself, so A satisfies the containment requirement. Nothing would then lie outside A, which is unusual but not wrong.'}],
 td:[{id:'s17.td1',prompt:'Why is choosing the universal set a decision rather than something you can work out from A?',reasoning:'Because A does not record what discussion it belongs to. The set {2, 4} could be part of a conversation about even numbers, about numbers under ten, or about the whole natural numbers, and each gives a different U. Every one of them contains A, so A cannot tell you which was meant. The next lesson shows why the choice has consequences: outside A means something different in each case.'}],
 summary:`A universal set U contains every object under discussion, and any U containing A is valid. There is no single permanent universe: ${roster(U_DIGITS)} and ${roster(U_SMALL)} are both valid for ${roster(S_A)}.`,
 next:'Next you will draw these relationships rather than list them.',
 t:['Choose and justify a universal set, and verify that it contains the sets under discussion.',['Subsets'],['"the universe for this discussion" rather than "the universe"'],['The two-valid-universes point is the lesson. Without it students treat U as a fixed object and complement looks intrinsic to A.','Worked example 2 makes the containment requirement bite rather than stating it.'],['Ask for a universe that would not work for the set of even numbers.'],['Draw the rectangle and ask where a disqualifying element would have to go.'],['Ask whether the empty set can be a universal set, and for which sets.']]}),

makeLesson2({ id:'ncert_kemh1_s1_8_venn_diagrams_lesson', sec:'1.8', title:'Venn Diagrams', page:10,
 prereq:['ncert_kemh1_s1_7'], assume:['Universal set','Subsets','Membership'],
 notIntroduce:[['Union and intersection as operations','ncert_kemh1_s1_9']],
 goal:'You will read a Venn diagram as a statement about membership, and say what each region of it means.',
 checks:['Choose a valid universal set.','Decide whether an element belongs to a set.'], ifNot:'Revisit the universal set; the rectangle in every Venn diagram is U.',
 vocab:[['Venn diagram','A picture in which a rectangle represents the universal set and closed curves inside it represent sets, so that regions correspond to membership conditions.'],['region','A part of a Venn diagram picked out by which sets it is inside and which it is outside.']],
 expl:['A Venn diagram turns membership into position. The rectangle is the universal set U, and each closed curve inside it is a set. An object is drawn inside a curve exactly when it belongs to that set.',
  'Two overlapping curves cut the rectangle into four regions, and each region is a membership condition: inside both, inside the first only, inside the second only, and inside neither.',
  'Reading a diagram means reading those conditions. A point in the overlap is in both sets. A point in the rectangle but outside both curves is in U and in neither set.',
  `A region can be named by the set expression it represents. The overlap is ${shadedNotation(V_INTERSECTION)}, the part of A outside B is ${shadedNotation(V_DIFFERENCE)}, and the part of the rectangle outside A is ${shadedNotation(V_COMPLEMENT)}.`,
  'A caution that runs through the rest of the chapter: the picture represents a claim, it does not establish one. Drawing one circle inside another asserts a subset relation that the elements must actually satisfy. Shading is a way of pointing at a region, not a reason the region contains what you want it to.'],
 rep:['A rectangle marked U containing two overlapping closed curves, with each of the four regions identified by the membership condition it represents'],
 visuals:[V_SUBSET,V_COMPLEMENT],
 we:[{id:'s18.we1',prompt:'What does a point in the overlap of two curves represent?',steps:[['Inside the first curve means it belongs to the first set.','Position inside a curve is the picture of membership.'],['Inside the second curve means it belongs to the second set as well.','The overlap is where both conditions hold at once.'],[`So the overlap represents ${shadedNotation(V_INTERSECTION)}.`,'The region has a name as a set expression, which is what lets a picture be checked.']],answer:'An object belonging to both sets.'},
  {id:'s18.we2',prompt:'What does the part of the rectangle outside both curves represent?',steps:[['Outside the first curve means it does not belong to the first set.','Outside is the picture of non-membership.'],['Outside the second means it does not belong to the second either.','Both conditions are negative, so the object belongs to neither set.'],['It is still inside the rectangle, so it belongs to U.','This is why the rectangle matters: without it, outside has no boundary.']],answer:'An object in the universe belonging to neither set.'},
  {id:'s18.we3',prompt:`A diagram draws A entirely inside B and the prose says A and B have no elements in common. What has gone wrong?`,steps:[['The picture asserts that every point of A is also in B.','Containment is what drawing one curve inside another means.'],['The prose asserts the overlap is empty, which contradicts that unless A itself is empty.','A figure and a sentence about the same sets cannot disagree; one of them is wrong.']],answer:'The figure and the prose make incompatible claims.'}],
 g:[{id:'s18.g1',prompt:'In a Venn diagram, what does the rectangle represent?',hint:'What contains everything under discussion?',answer:'The universal set U.',why:'Every object in the discussion is drawn somewhere inside it, which is what gives outside a meaning.'},
  {id:'s18.g2',prompt:'Two curves are drawn with no overlap at all. What does that say about the sets?',hint:'Is there a region inside both?',answer:'They have no element in common.',why:'With no overlap there is no region satisfying both membership conditions, so no object can be in both sets.'},
  {id:'s18.g3',prompt:'How many regions do two overlapping curves cut the rectangle into?',hint:'Count the in-or-out combinations.',answer:'Four.',why:'Each set gives an in-or-out choice, and the four combinations are: both, first only, second only, neither.'}],
 i:[{id:'s18.i1',prompt:'Draw-and-describe: A is a subset of B, both inside U. Which region is necessarily empty?',answer:'The part of A outside B.',why:'A subset relation means no element of A lies outside B, so that region can contain nothing.'},
  {id:'s18.i2',prompt:'Can a Venn diagram prove that two sets have a common element?',answer:'No.',why:'The diagram records a claim about membership. Whether the overlap actually contains anything is settled by the elements, not by the drawing.'},
  {id:'s18.i3',prompt:'Why does showing complement need the rectangle drawn?',answer:'Because outside A has to be outside A within something.',why:'Without the rectangle there is no boundary to the region outside the curve, so the picture would not say which objects are meant.'}],
 td:[{id:'s18.td1',prompt:'A classmate shades a region and says "there, that proves it". What is a Venn diagram actually good for, and what is it not good for?',reasoning:'It is good for seeing which membership conditions a region expresses, and therefore for noticing that two expressions pick out the same region. It is not good for establishing that any particular object is in any particular region, because the drawing was made by a person who decided where to put things. A shaded region names a set expression; whether that expression contains a given element is a question about the elements.'}],
 summary:'A Venn diagram represents the universal set as a rectangle and sets as curves inside it, so that regions correspond to membership conditions. Each region can be named by the set expression it represents, and the picture states a claim rather than proving one.',
 next:'Next you will combine two sets into new ones.',
 t:['Read a Venn diagram as a set of membership conditions and name each region by its set expression.',['Universal set','Membership'],['"the region representing" rather than "the shaded bit"'],['Insist on naming regions by expression from the start; it is what makes the operations lessons checkable rather than visual.','Worked example 3 sets up the figure-versus-prose audit used throughout the rest of the chapter.'],['Ask what the region inside B but outside A represents.'],['Point at a region and ask "in or out of A? in or out of B?" before naming it.'],['Ask how many regions three overlapping curves make.']]}),

makeLesson2({ id:'ncert_kemh1_s1_9_union_intersection_lesson', sec:'1.9', title:'Union and Intersection of Sets', page:11,
 prereq:['ncert_kemh1_s1_8'], assume:['Venn diagrams','Membership','Roster form'],
 notIntroduce:[['Difference of sets','ncert_kemh1_s1_9_difference'],['Complement','ncert_kemh1_s1_10']],
 goal:'You will build the union and the intersection of two sets from membership conditions, and see why the or in union includes both.',
 checks:['Read a region of a Venn diagram.','List the distinct elements of a set.'], ifNot:'Revisit reading Venn regions; union and intersection are two of those regions.',
 vocab:[['union','A \\u222a B is the set of elements belonging to A, or to B, or to both.'],['intersection','A \\u2229 B is the set of elements belonging to both A and B.'],['disjoint sets','Two sets whose intersection is empty.']],
 expl:[`The union of A and B, written A \\u222a B, contains every element that is in A, or in B, or in both. With A = ${roster(S_A)} and B = ${roster(S_B)}, the union is ${roster(AB_UNION)}.`,
  'The word or here is inclusive. An element in both sets still belongs to the union; it is not excluded for being in two places. In everyday speech "tea or coffee" often means one and not the other, but in mathematics or means at least one.',
  `An element in both appears once in the union. 4 is in A and in B, and ${roster(AB_UNION)} lists it a single time, because a set records which objects belong and not how many times they qualify.`,
  `The intersection A \\u2229 B contains the elements in both. Here that is ${roster(AB_INT)}, the three values the two sets share.`,
  `On a Venn diagram the union is every region inside either curve, ${shadedNotation(V_UNION)}, and the intersection is the overlap alone, ${shadedNotation(V_INTERSECTION)}.`,
  `If the intersection is empty the sets are called disjoint. That says nothing about either set being empty: ${roster(S_ODD5)} and {2, 4} are both non-empty and share nothing.`],
 rep:['Two overlapping curves with the union shaded, beside the same pair with only the overlap shaded'],
 visuals:[V_UNION,V_INTERSECTION],
 we:[{id:'s19.we1',prompt:`Find ${roster(S_A)} \\u222a ${roster(S_B)}.`,steps:[['Take every element of A: 1, 2, 3, 4, 5, 6 all qualify, since being in A is enough.','The union condition is satisfied by membership in either set alone.'],['Now every element of B: 4, 5 and 6 already qualified; 7 and 8 are new.','Elements already included are not added twice; the set records belonging, not counting.'],[`So the union is ${roster(AB_UNION)}, with ${cardinality(AB_UNION)} elements.`,'6 belongs because it is in A, in B, or both — any one of those is enough.']],answer:roster(AB_UNION)},
  {id:'s19.we2',prompt:`Find ${roster(S_A)} \\u2229 ${roster(S_B)}.`,steps:[['Test each element of A against B: 1, 2 and 3 are not in B.','The intersection condition needs both memberships, so failing either excludes the element.'],['4, 5 and 6 are in B as well.','These are the only elements satisfying both conditions.'],[`So the intersection is ${roster(AB_INT)}, with ${cardinality(AB_INT)} elements.`,'The result is exactly the overlap region of the diagram.']],answer:roster(AB_INT)},
  {id:'s19.we3',prompt:`A student computes ${roster(S_A)} \\u222a ${roster(S_B)} as {1,2,3,4,5,6,4,5,6,7,8}. What has gone wrong?`,steps:[['They have joined the two lists end to end.','Concatenating lists is not the same as forming a set; a list can repeat and a set cannot.'],['4, 5 and 6 appear twice, but each belongs once.',`Membership is a yes-or-no question, so the union is ${roster(AB_UNION)} with ${cardinality(AB_UNION)} elements, not 11.`]],answer:`${roster(AB_UNION)} — the shared elements belong once.`}],
 g:[{id:'s19.g1',prompt:`Find ${roster(S_ODD5)} \\u222a {2, 4}.`,hint:'Everything in either set.',answer:'{1, 2, 3, 4, 5}.',why:'The odd values 1, 3, 5 come from the first set and 2, 4 from the second; nothing is shared, so nothing is repeated.'},
  {id:'s19.g2',prompt:`Find ${roster(S_ODD5)} \\u2229 {2, 4}.`,hint:'What do they share?',answer:EMPTY_SET_SYMBOL,why:'No value is both odd and in {2, 4}, so the intersection is empty and the sets are disjoint.'},
  {id:'s19.g3',prompt:`Does ${roster(S_ODD5)} \\u2229 {2, 4} being empty make either set empty?`,hint:'Count the elements of each.',answer:'No.',why:'Both sets have elements; they simply share none. An empty intersection is a statement about the pair, not about either one.'}],
 i:[{id:'s19.i1',prompt:`How many elements does ${roster(S_A)} \\u222a ${roster(S_B)} have, and why is it not ${cardinality(S_A)} + ${cardinality(S_B)}?`,answer:`${cardinality(AB_UNION)}.`,why:`Adding the totals gives ${cardinality(S_A)+cardinality(S_B)}, which counts the ${cardinality(AB_INT)} shared elements twice. The union contains each element once.`},
  {id:'s19.i2',prompt:'Is A \\u222a B the same as B \\u222a A?',answer:'Yes.',why:'The condition "in A or in B" does not depend on which set is named first, so the same elements qualify either way.'},
  {id:'s19.i3',prompt:'If A \\u2286 B, what is A \\u222a B?',answer:'B.',why:'Every element of A is already in B, so the union adds nothing new to B.'},
  {id:'s19.i4',prompt:'If A \\u2286 B, what is A \\u2229 B?',answer:'A.',why:'Every element of A is in B, so every element of A satisfies both conditions, and no element outside A can.'}],
 td:[{id:'s19.td1',prompt:'Why is the or in union inclusive, when everyday or so often means one and not the other?',reasoning:'Because the exclusive reading would break the relationship between union and intersection. If elements in both were thrown out of the union, then A \\u222a B would not contain A, and a subset of A would not be a subset of the union. Adding a set to another would sometimes remove elements, which is not what combining means. The inclusive reading is what makes union behave like putting two collections together, and it is also what the counting relation later in this chapter depends on.'}],
 summary:`A \\u222a B holds everything in A, in B, or in both, with shared elements appearing once: ${roster(AB_UNION)}. A \\u2229 B holds what they share: ${roster(AB_INT)}. An empty intersection means the sets are disjoint, not that either is empty.`,
 next:'Next you will take one set away from another.',
 t:['Form unions and intersections from membership conditions and reconcile them with Venn regions.',['Venn diagrams','Roster form'],['"in A, in B, or in both" whenever union is said aloud'],['The inclusive-or point is the one that transfers to probability later; spend time on it.','The concatenation error in worked example 3 is very common and worth naming as a list-versus-set confusion.'],['Ask whether 5 is in the union, and why.'],['Have students test one element at a time against both conditions before writing anything.'],['Ask what A \\u222a A and A \\u2229 A are.']]}),


makeLesson2({ id:'ncert_kemh1_s1_9_difference_lesson', sec:'1.9', title:'Difference of Sets', page:13,
 prereq:['ncert_kemh1_s1_9'], assume:['Union and intersection','Venn regions'],
 notIntroduce:[['Complement, which needs a universe','ncert_kemh1_s1_10']],
 goal:'You will form A \\u2212 B from membership conditions and see why reversing the order gives a different set.',
 checks:['Form a union and an intersection.','Read a Venn region.'], ifNot:'Revisit union and intersection; difference is built from the same membership testing.',
 vocab:[['difference','A \\u2212 B is the set of elements that are in A and not in B.']],
 expl:[`The difference A \\u2212 B contains the elements of A that are not in B. Two conditions, and both must hold: in A, and not in B.`,
  `With A = ${roster(S_A)} and B = ${roster(S_B)}, we get A \\u2212 B = ${roster(A_MINUS_B)}. The values 4, 5 and 6 are in A but are also in B, so they are excluded.`,
  `Reversing the order gives a different set: B \\u2212 A = ${roster(B_MINUS_A)}. Difference is directional, and in general A \\u2212 B and B \\u2212 A are not equal — here ${setsEqual(A_MINUS_B,B_MINUS_A)} says they are not.`,
  `On a Venn diagram, A \\u2212 B is the part of A outside B: ${shadedNotation(V_DIFFERENCE)}. The overlap is not shaded, because those elements fail the second condition.`,
  'One distinction to hold on to for the next lesson. A \\u2212 B needs no universal set; it is built from A and B alone. The idea of everything not in A does need a universe, and that is a different operation.'],
 rep:['Two overlapping curves with only the part of A outside B shaded'],
 visuals:[V_DIFFERENCE],
 we:[{id:'s19d.we1',prompt:`Find ${roster(S_A)} \\u2212 ${roster(S_B)}.`,steps:[['Take each element of A and ask whether it is also in B.','Both conditions must hold, so membership in B disqualifies an element.'],['1, 2 and 3 are not in B, so they stay.','These satisfy in A and not in B, which is what the definition actually asks for.'],[`5 is excluded because although it is in A, it is also in B. Likewise 4 and 6, so A \\u2212 B = ${roster(A_MINUS_B)}.`,'The second condition does the excluding, and it removes exactly the elements the two sets share.']],answer:roster(A_MINUS_B)},
  {id:'s19d.we2',prompt:`Now find ${roster(S_B)} \\u2212 ${roster(S_A)} and compare.`,steps:[['Run the same test with the roles swapped: elements of B not in A.','The definition is the same; only which set supplies the candidates has changed.'],[`4, 5 and 6 are in A, so they go. 7 and 8 remain: ${roster(B_MINUS_A)}.`,'The shared elements are excluded either way, but what survives differs.'],[`${roster(A_MINUS_B)} and ${roster(B_MINUS_A)} have no element in common.`,'The order is part of what the operation means, not a convention about writing.']],answer:`${roster(B_MINUS_A)}, which differs from ${roster(A_MINUS_B)}.`},
  {id:'s19d.we3',prompt:'A diagram for A \\u2212 B shades the whole of A including the overlap. What has gone wrong?',steps:[['The shaded region would include elements that are in B.','Those fail the second condition, so they are not in the difference.'],[`The correct region is ${shadedNotation(V_DIFFERENCE)}: A with the overlap left clear.`,'The figure must shade the expression it claims, or the picture and the prose are two different claims.']],answer:'The overlap must not be shaded; shading it would show A, not A \\u2212 B.'}],
 g:[{id:'s19d.g1',prompt:`Find ${roster(S_FIRST5)} \\u2212 ${roster(S_ODD5)}.`,hint:'Which of 1 to 5 are not odd?',answer:'{2, 4}.',why:'1, 3 and 5 are in the second set and are removed; 2 and 4 satisfy in the first and not in the second.'},
  {id:'s19d.g2',prompt:`Find ${roster(S_ODD5)} \\u2212 ${roster(S_FIRST5)}.`,hint:'Which odd values are outside {1,2,3,4,5}?',answer:EMPTY_SET_SYMBOL,why:'Every element of the first set is also in the second, so nothing survives both conditions. The result is empty without either set being empty.'},
  {id:'s19d.g3',prompt:'Does A \\u2212 B need a universal set?',hint:'Which sets does the condition mention?',answer:'No.',why:'The two conditions refer only to A and B. Nothing outside those two sets is consulted.'}],
 i:[{id:'s19d.i1',prompt:'When is A \\u2212 B equal to A?',answer:'When A and B are disjoint.',why:'If nothing is shared, no element of A fails the second condition, so all of A survives.'},
  {id:'s19d.i2',prompt:'When is A \\u2212 B empty?',answer:'When A \\u2286 B.',why:'If every element of A is in B, each one fails the second condition and nothing remains.'},
  {id:'s19d.i3',prompt:'Can A \\u2212 B and B \\u2212 A ever be equal?',answer:'Yes, when both are empty, which happens exactly when A = B.',why:'A \\u2212 B empty means A \\u2286 B, and B \\u2212 A empty means B \\u2286 A. Both together give equality.'},
  {id:'s19d.i4',prompt:`Is ${roster(A_MINUS_B)} \\u222a ${roster(AB_INT)} equal to A?`,answer:'Yes.',why:'Every element of A is either in B or not, so A splits exactly into the overlap and the part outside B.'}],
 td:[{id:'s19d.td1',prompt:'Union and intersection give the same answer whichever set you name first. Why does difference behave differently?',reasoning:'Because its two conditions are not alike. Union and intersection ask the same question of both sets — in this one, in that one — so swapping the names swaps nothing. Difference asks a positive question of the first set and a negative one of the second, so the sets play different parts. Swapping them swaps which set supplies the candidates and which does the excluding, and those are different jobs.'}],
 summary:`A \\u2212 B contains the elements of A that are not in B: ${roster(A_MINUS_B)}. Reversing gives ${roster(B_MINUS_A)}, a different set, because the two sets play different parts. Difference needs no universal set.`,
 next:'Next you will take everything outside a set, which does need one.',
 t:['Form set differences and justify their directionality.',['Union and intersection','Venn regions'],['"in A and not in B" each time the difference is read aloud'],['The directionality is the lesson. Compute both orders every time until students stop expecting symmetry.','The no-universe-needed point is what makes complement land cleanly next lesson.'],['Ask what A \\u2212 A is.'],['Have students cross out the excluded elements on the roster of A rather than rewriting.'],['Ask whether (A \\u2212 B) \\u222a (B \\u2212 A) has a natural meaning.']]}),

makeLesson2({ id:'ncert_kemh1_s1_10_complement_lesson', sec:'1.10', title:'Complement of a Set', page:15,
 prereq:['ncert_kemh1_s1_10_pre'], assume:['Universal set','Difference of sets','Union and intersection','Venn regions'],
 goal:'You will form the complement of a set relative to a declared universe, and derive De Morgan\\u2019s laws rather than memorise them.',
 checks:['Choose a valid universal set.','Form A \\u2212 B.'], ifNot:'Revisit the universal set and the difference; a complement is a difference taken from U.',
 vocab:[['complement','A\\u2032 is the set of elements of the universal set that are not in A, that is U \\u2212 A.'],['De Morgan\\u2019s laws','The two identities relating the complement of a union and of an intersection to the complements of the separate sets.']],
 expl:[`The complement of A, written A\\u2032, is everything in the universal set that is not in A. In symbols it is U \\u2212 A, so it is a difference with U supplying the candidates.`,
  `With U = ${roster(U_DIGITS)} and A = ${roster(S_A)}, the complement is A\\u2032 = ${roster(A_COMP_DIGITS)}. 8 belongs to A\\u2032 because it is in U and not in A.`,
  `The complement depends on U, not on A alone. Take the same A with the smaller universe U = ${roster(U_SMALL)}: now A\\u2032 = ${roster(A_COMP_SMALL)}. A has not changed at all; what counts as outside has.`,
  `This is why a complement cannot be formed without a declared universe. Asking what is not in A is not a question about A until the boundary is fixed.`,
  `Now two identities, both taken within the same universal set U. The complement of a union is the intersection of the complements, (A \\u222a B)\\u2032 = A\\u2032 \\u2229 B\\u2032. Read the membership condition: to be outside A \\u222a B an element must fail to be in A and fail to be in B, which is exactly being in both complements. Checked on our sets, this is ${deMorganUnionHolds(U_DIGITS,S_A,S_B)}.`,
  `Similarly, within the same universal set U, (A \\u2229 B)\\u2032 = A\\u2032 \\u222a B\\u2032. To be outside the overlap, an element must miss at least one of the two sets, which is being in at least one complement. Checked on our sets, ${deMorganIntersectionHolds(U_DIGITS,S_A,S_B)}.`,
  'These are De Morgan\\u2019s laws. They are not symbol-shuffling rules: each one is a sentence about membership read carefully, and the and becoming or is the negation of or becoming and.'],
 rep:['A rectangle marked U with A inside it and everything outside A shaded, shown twice with different rectangles'],
 visuals:[V_COMPLEMENT],
 we:[{id:'s110.we1',prompt:`With U = ${roster(U_DIGITS)} and A = ${roster(S_A)}, find A\\u2032.`,steps:[['Complement means U \\u2212 A, so start from the elements of U.','U supplies the candidates; A does the excluding.'],['Remove those that are in A: 1 to 6 go.','Each removed element fails the not in A condition.'],[`8 belongs to A\\u2032 because it is in U and not in A. The complement is ${roster(A_COMP_DIGITS)}.`,'Every surviving element passes both conditions.']],answer:roster(A_COMP_DIGITS)},
  {id:'s110.we2',prompt:`Keep A the same but take U = ${roster(U_SMALL)}. What is A\\u2032 now?`,steps:[['The candidates are now only the elements of this smaller universe.','Changing U changes what outside can mean.'],[`Every element of this U is in A, so nothing survives: A\\u2032 = ${roster(A_COMP_SMALL)}.`,'Here A is the whole universe, so there is nothing outside it.'],[`The same A gave ${roster(A_COMP_DIGITS)} before and ${roster(A_COMP_SMALL)} now.`,'The complement is a fact about A together with U, never about A alone.']],answer:`${roster(A_COMP_SMALL)} — the complement changed although A did not.`},
  {id:'s110.we3',prompt:`Verify (A \\u222a B)\\u2032 = A\\u2032 \\u2229 B\\u2032 on U = ${roster(U_DIGITS)}, A = ${roster(S_A)}, B = ${roster(S_B)}.`,steps:[[`Left side: A \\u222a B = ${roster(AB_UNION)}, so its complement is ${roster(complement(U_DIGITS,AB_UNION))}.`,'Compute the union first, then take everything in U outside it.'],[`Right side: A\\u2032 = ${roster(A_COMP_DIGITS)} and B\\u2032 = ${roster(complement(U_DIGITS,S_B))}, so their intersection is ${roster(intersection(A_COMP_DIGITS,complement(U_DIGITS,S_B)))}.`,'Compute each complement separately, then what they share.'],[`The two sides agree: ${deMorganUnionHolds(U_DIGITS,S_A,S_B)}.`,'Being outside the union means missing both sets, which is what the intersection of the complements says.']],answer:'Both sides give the same set, as the membership reading predicts.'}],
 g:[{id:'s110.g1',prompt:`With U = ${roster(U_DIGITS)}, find the complement of ${roster(S_ODD5)}.`,hint:'Which elements of U are left?',answer:roster(complement(U_DIGITS,S_ODD5)),why:'Removing 1, 3 and 5 from U leaves everything else in U, each of which is in U and not in the set.'},
  {id:'s110.g2',prompt:'Why can A\\u2032 not be formed without a universe?',hint:'What would outside mean?',answer:'Because not in A has no boundary until U is fixed.',why:'The same A gives different complements under different universes, so without U the question has no single answer.'},
  {id:'s110.g3',prompt:'What is (A\\u2032)\\u2032?',hint:'Outside the outside.',answer:'A.',why:'An element of U is either in A or in A\\u2032, so removing A\\u2032 from U leaves exactly A.'}],
 i:[{id:'s110.i1',prompt:`With U = ${roster(U_DIGITS)}, what is U\\u2032?`,answer:EMPTY_SET_SYMBOL,why:'Nothing in U lies outside U, so no element satisfies the condition.'},
  {id:'s110.i2',prompt:'What is A \\u222a A\\u2032, and why?',answer:'U.',why:'Every element of U is either in A or not in A, so between them the two sets account for the whole universe.'},
  {id:'s110.i3',prompt:'What is A \\u2229 A\\u2032?',answer:EMPTY_SET_SYMBOL,why:'No element can be both in A and not in A, so the two sets share nothing.'},
  {id:'s110.i4',prompt:`Verify (A \\u2229 B)\\u2032 = A\\u2032 \\u222a B\\u2032 with U = ${roster(U_DIGITS)}.`,answer:`Both sides give ${roster(complement(U_DIGITS,AB_INT))}.`,why:`Being outside the overlap means missing at least one set, which is the union of the complements. Checked: ${deMorganIntersectionHolds(U_DIGITS,S_A,S_B)}.`}],
 td:[{id:'s110.td1',prompt:'In De Morgan\\u2019s laws an intersection turns into a union and a union into an intersection. Why should negation swap them?',reasoning:'Because being outside a union is a demanding condition and being outside an intersection is a weak one. To miss A \\u222a B you must miss A and also miss B, two requirements at once, which is an intersection of complements. To miss A \\u2229 B you need only miss one of them, which is a union. The swap is not a rule about symbols; it is what happens when you negate and and or in ordinary language, and the sets simply record it.'}],
 summary:`A\\u2032 is U \\u2212 A, everything in the universe outside A, so it depends on U: the same A gave ${roster(A_COMP_DIGITS)} under one universe and ${roster(A_COMP_SMALL)} under another. De Morgan\\u2019s laws follow by reading the membership conditions: missing a union means missing both, missing an intersection means missing at least one.`,
 next:'Next you will count the members of two overlapping sets.',
 t:['Form complements relative to a declared universe and derive De Morgan\\u2019s laws from membership conditions.',['Universal set','Difference','Union and intersection'],['"everything in U that is not in A" rather than "the opposite of A"'],['Worked example 2 is the heart of the lesson: same A, different U, different complement.','Derive De Morgan by reading the conditions aloud. Students who memorise the symbol swap cannot reconstruct it later.'],['Ask what the complement of the empty set is.'],['Compute U \\u2212 A explicitly rather than reaching for the complement symbol.'],['Ask whether De Morgan extends to three sets.']]}),

makeLesson2({ id:'ncert_kemh1_s1_9_practical_counting_lesson', sec:'1.9', title:'Practical Problems on Union and Intersection of Two Sets', page:17,
 fragmentId:'FO-1-APPLICATION',
 prereq:['ncert_kemh1_s1_9'], assume:['Union and intersection','Cardinality of a finite set','Venn regions'],
 goal:'You will count the members of two overlapping sets by accounting for each region once, and see why the overlap must be subtracted.',
 checks:['Form a union and an intersection.','Count the distinct elements of a finite set.'], ifNot:'Revisit union and intersection; this lesson counts the regions they produce.',
 vocab:[['inclusion-exclusion','The relation n(A \\u222a B) = n(A) + n(B) \\u2212 n(A \\u2229 B), which corrects the double counting of the overlap.']],
 expl:[`Two overlapping sets cut the people or objects being counted into three regions inside the union: in A only, in both, and in B only. Counting each region once gives the size of the union.`,
  `Take a group where ${CT.totalA} take up one activity and ${CT.totalB} take up another, with ${CT.both} doing both. The region counts are: ${CT.onlyA} in the first only, ${CT.both} in both, and ${CT.onlyB} in the second only. The union is ${CT.onlyA} + ${CT.both} + ${CT.onlyB} = ${CT.union}.`,
  `This way of counting is called inclusion-exclusion, and it begins with the regions. Now compare the region count with simply adding the totals: ${CT.totalA} + ${CT.totalB} = ${CT.totalA+CT.totalB}, which is ${CT.totalA+CT.totalB-CT.union} more than the ${CT.union} the regions give. The reason is that the ${CT.both} people doing both were counted once inside the first total and again inside the second.`,
  `So subtract the overlap once: n(A \\u222a B) = n(A) + n(B) \\u2212 n(A \\u2229 B). Here ${CT.totalA} + ${CT.totalB} \\u2212 ${CT.both} = ${CT.totalA+CT.totalB-CT.both}, matching the region count exactly. The relation holds: ${countingRelationHolds(C_CRICKET,C_TENNIS)}.`,
  `If a universal set is known, the rest follows. With a group of ${cardinality(U_CLASS)} altogether, the number outside both activities is ${cardinality(U_CLASS)} \\u2212 ${CT.union} = ${CT.outside}.`,
  `When the sets are disjoint the overlap is 0 and the subtraction changes nothing, so the relation still holds and simply reduces to adding the totals.`],
 rep:['Two overlapping curves inside a rectangle, each of the three inner regions carrying its own count, with the count outside both written in the corner'],
 visuals:[V_COUNT],
 we:[{id:'s19c.we1',prompt:`Of a group, ${CT.totalA} do the first activity, ${CT.totalB} the second, and ${CT.both} do both. How many do at least one?`,steps:[[`Find the region in the first only: ${CT.totalA} \\u2212 ${CT.both} = ${CT.onlyA}.`,'Removing the overlap from the first total leaves those in that activity alone.'],[`Find the region in the second only: ${CT.totalB} \\u2212 ${CT.both} = ${CT.onlyB}.`,'The same correction on the other side, which is what the definition actually asks for.'],[`Add the three regions once each: ${CT.onlyA} + ${CT.both} + ${CT.onlyB} = ${CT.union}.`,'Each person is now counted exactly once, which is what the union asks for.']],answer:`${CT.union}.`},
  {id:'s19c.we2',prompt:'Derive the counting relation from that region accounting.',steps:[[`n(A) counts the first-only region and the overlap; n(B) counts the second-only region and the overlap.`,'Each total already contains the overlap.'],[`So n(A) + n(B) counts the overlap twice and everything else once.`,'The double counting is the only error in the sum.'],[`Subtracting n(A \\u2229 B) once removes the surplus: n(A \\u222a B) = n(A) + n(B) \\u2212 n(A \\u2229 B) gives ${CT.totalA+CT.totalB-CT.both}.`,'The formula is bookkeeping, not a rule to remember.']],answer:'n(A \\u222a B) = n(A) + n(B) \\u2212 n(A \\u2229 B).'},
  {id:'s19c.we3',prompt:`A student answers ${CT.totalA+CT.totalB} for the number doing at least one. What has gone wrong?`,steps:[['They added the two totals without adjusting.','Each total already includes the people doing both.'],[`The ${CT.both} in both have been counted twice, so the answer is ${CT.totalA+CT.totalB-CT.union} too many.`,`Subtracting the overlap once gives ${CT.union}, since each person doing both was counted in each total.`]],answer:`${CT.union}; the overlap was counted twice.`}],
 g:[{id:'s19c.g1',prompt:'If 20 do one activity, 15 another and 5 do both, how many do at least one?',hint:'Subtract the overlap once.',answer:'30.',why:'20 + 15 = 35 counts the 5 doing both twice. Removing that surplus once gives 30.'},
  {id:'s19c.g2',prompt:'If the two activities share nobody, what does the relation become?',hint:'What is the overlap?',answer:'n(A \\u222a B) = n(A) + n(B).',why:'With an empty intersection there is nothing counted twice, so the correction term is zero.'},
  {id:'s19c.g3',prompt:`With a group of ${cardinality(U_CLASS)} and ${CT.union} doing at least one, how many do neither?`,hint:'What is left of the universe?',answer:`${CT.outside}.`,why:`Those doing neither are outside the union, so the count is ${cardinality(U_CLASS)} \\u2212 ${CT.union}.`}],
 i:[{id:'s19c.i1',prompt:'In a group of 40, 25 like one subject, 20 like another and 10 like both. How many like neither?',answer:'5.',why:'At least one is 25 + 20 \\u2212 10 = 35, so 40 \\u2212 35 = 5 lie outside the union.'},
  {id:'s19c.i2',prompt:'Can n(A \\u222a B) ever be larger than n(A) + n(B)?',answer:'No.',why:'The relation subtracts a count that is zero or more, so the union can never exceed the sum of the totals.'},
  {id:'s19c.i3',prompt:'If n(A) = 12, n(B) = 9 and n(A \\u222a B) = 15, how many are in both?',answer:'6.',why:'Rearranging the relation gives n(A \\u2229 B) = 12 + 9 \\u2212 15 = 6. The same bookkeeping run backwards.'},
  {id:'s19c.i4',prompt:'Why does the relation subtract the overlap once rather than twice?',answer:'Because it was counted twice in total, and should be counted once.',why:'Removing it twice would leave the people doing both out of the union altogether, which the inclusive reading of union forbids.'}],
 td:[{id:'s19c.td1',prompt:'If A and B are disjoint, what happens to the counting relation, and why is that the expected answer rather than a special case?',reasoning:'The overlap is empty, so the subtracted term is zero and the relation reduces to adding the totals. That is not a separate rule: the correction exists only to undo double counting, and with no shared elements there is none to undo. The disjoint case is the general relation with nothing to correct, which is a sign the relation was derived rather than invented for the overlapping case.'}],
 summary:`Counting two overlapping sets means counting each region once: ${CT.onlyA} + ${CT.both} + ${CT.onlyB} = ${CT.union}. Adding the totals instead counts the overlap twice, so n(A \\u222a B) = n(A) + n(B) \\u2212 n(A \\u2229 B). With the universe known, the rest lie outside the union.`,
 next:'That completes the chapter on sets.',
 t:['Count two overlapping finite sets by region accounting and derive the inclusion-exclusion relation.',['Union and intersection','Cardinality'],['"counted once in each total, so once too often" when explaining the subtraction'],['CURRICULUM NOTE: this topic is assessed formatively only under the current CBSE scope, but it is required instruction. Teach it fully; do not place it in summative tests.','Build the three region counts before writing the formula. Students who meet the formula first treat the subtraction as arbitrary.'],['Ask what happens to the relation when the sets are disjoint.'],['Fill the Venn regions with the actual counts and add them up by pointing.'],['Ask how the relation would extend to three overlapping sets.']]}),

];
