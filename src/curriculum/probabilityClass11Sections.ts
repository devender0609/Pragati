// ===========================================================================
// v0.84.0-c11.31 checkpoint 92 — CLASS 11 CHAPTER 14, PROBABILITY.
//
// Seven units, and the first one is the governance case: C11-PRB-FO12 is
// FORMATIVE_ONLY and REQUIRED_PREREQUISITE at the same time. Formative does
// not mean optional — it is taught first, inside an official textbook
// chapter, and it is not summative-eligible. Neither field is inferred from
// the other.
//
// §14.1 is MIXED SCOPE. Its body changes assessment status partway through,
// so the two fragments stay separate lessons: SF-3-FORMATIVE (random
// experiment, outcomes, sample space) and SF-3-SUMMATIVE (event as subset).
// Classifying all of §14.1 one way would be false either way.
//
// Nothing here rebuilds set theory or the sample space. Events are subsets
// of a real sample space, and probability is exact Rational throughout.
// ===========================================================================

import type { AuthoredSection } from './authoredSection';
import { type L, makeLesson } from './class11Lesson';
import { type Event, type Experiment, formatRational, rational } from './sampleSpace';
import {
  additionRule, andEvent,
  complementRule, equallyLikelyAssignment, notEvent, orEvent, probabilityOf, show,
} from './probabilitySpace';

export const PRB_C11_CHAPTER_ID = 'ncert_kemh1_ch14';
const BOOK = 'Mathematics, Textbook for Class XI (NCERT, Reprint 2026-27)';

/**
 * §14.1's two fragments share a parent section and carry their fragment id,
 * so the mixed scope is visible in provenance rather than flattened.
 */
const source = (sec: string, title: string, page: number, fragmentId?: string) => {
  const parts = sec.split('.');
  const parent = parts.length > 2 ? parts.slice(0, 2).join('.') : sec;
  return {
    officialChapterId: PRB_C11_CHAPTER_ID,
    officialSectionId: `ncert_kemh1_s${parent.replace(/\./g, '_')}`,
    ...(parts.length > 2 ? { officialSubsectionNumber: sec } : {}),
    ...(fragmentId ? { scopeFragmentId: fragmentId } : {}),
    sectionNumber: parent, exactTitle: title, startPage: page,
    textbook: BOOK, sourceReference: 'kemh1', inspectionDate: '2026-10-26',
  };
};

const FRAGMENTS: Record<string, string> = {
  ncert_kemh1_sf3_formative_lesson: 'SF-3-FORMATIVE',
  ncert_kemh1_sf3_summative_lesson: 'SF-3-SUMMATIVE',
};

const lesson = (l: L): AuthoredSection =>
  makeLesson(l, (sec, title, page) => source(sec, title, page, FRAGMENTS[(l as { id: string }).id]));

// --- canonical experiments and events, all derived ------------------------
export const DIE: Experiment = {
  id: 'die', description: 'a die is rolled once',
  outcomes: ['1', '2', '3', '4', '5', '6'],
  equallyLikely: 'the die is modelled as fair, so no face is favoured over another',
};
export const TWO_COINS: Experiment = {
  id: 'two_coins', description: 'two coins are tossed together',
  outcomes: ['HH', 'HT', 'TH', 'TT'],
  equallyLikely: 'each coin is modelled as fair and the tosses do not affect each other',
};
export const EVEN: Event = { id: 'even', experimentId: 'die', description: 'the number is even', outcomes: ['2', '4', '6'] };
export const ODD: Event = { id: 'odd', experimentId: 'die', description: 'the number is odd', outcomes: ['1', '3', '5'] };
export const BELOW_FOUR: Event = { id: 'below_four', experimentId: 'die', description: 'the number is below 4', outcomes: ['1', '2', '3'] };
export const SIX: Event = { id: 'six', experimentId: 'die', description: 'the number is 6', outcomes: ['6'] };

export const DIE_ASSIGNMENT = equallyLikelyAssignment(DIE);
export const COIN_ASSIGNMENT = equallyLikelyAssignment(TWO_COINS);

const P = (ev: Event) => show(probabilityOf(DIE, DIE_ASSIGNMENT, ev));
export const NOT_EVEN = notEvent(DIE, EVEN);
export const EVEN_AND_LOW = andEvent(DIE, EVEN, BELOW_FOUR);
export const EVEN_OR_LOW = orEvent(DIE, EVEN, BELOW_FOUR);
export const ADD = additionRule(DIE, DIE_ASSIGNMENT, EVEN, BELOW_FOUR);
export const COMP = complementRule(DIE, DIE_ASSIGNMENT, EVEN);

export const C11_PRB_SECTIONS: AuthoredSection[] = [

lesson({ id:'ncert_kemh1_sf3_formative_lesson', sec:'14.1', title:'Event', page:383,
 prereq:['ncert_kemh1_s1_5'], assume:['Sets and set notation','Listing outcomes'],
 notIntroduce:[['Probability of an event','ncert_kemh1_s14_2']],
 goal:'You will describe a random experiment by listing its outcomes as a sample space in set notation.',
 checks:['Write a set using braces.','List the possible results of a simple experiment.'],
 ifNot:'Revisit set notation; a sample space is written as a set.',
 vocab:[['random experiment','An action whose individual result cannot be predicted, though all possible results are known.'],
  ['outcome','One possible result of the experiment.'],
  ['sample space','The set of all possible outcomes, written S.']],
 expl:[`Rolling a die is a random experiment. Nobody can say which face will land uppermost, yet everyone knows the complete list of possibilities.`,
  `That list is the sample space, written as a set: S = {${DIE.outcomes.join(', ')}}. The braces matter — it is a set, with each outcome appearing once.`,
  `Because it is a set, listing an outcome twice does not make it more likely. A sample space with "6" written twice is not a different experiment; it is the same set, written carelessly.`,
  `The outcomes must also be complete. If a possible result is missing, the set is not the sample space of that experiment but of a different one.`,
  `Tossing ${TWO_COINS.description} gives S = {${TWO_COINS.outcomes.join(', ')}}. Note that HT and TH are separate outcomes, because the two coins are distinguishable even when they look alike.`,
  `Nothing here is about probability yet. Before asking how likely something is, there has to be a clear set of what could happen — and that set is what this lesson builds.`],
 rep:['The sample space written in braces, with each outcome once'],
 we:[{id:'sf3f.we1',prompt:`Write the sample space for ${DIE.description}.`,steps:[['List every possible result of the roll.','Each face is one outcome.'],['Write them inside braces, each once.','The sample space is a set.'],[`So S = {${DIE.outcomes.join(', ')}}.`,'Six outcomes, complete and without repeats.']],answer:`S = {${DIE.outcomes.join(', ')}}`},
  {id:'sf3f.we2',prompt:`Write the sample space for ${TWO_COINS.description}.`,steps:[['Each coin can land in two ways, and both results together make one outcome.','So an outcome records what both coins did.'],['The possibilities are head-head, head-tail, tail-head and tail-tail.','HT and TH differ because the coins are distinguishable.'],[`So S = {${TWO_COINS.outcomes.join(', ')}}.`,'Four outcomes in all.']],answer:`S = {${TWO_COINS.outcomes.join(', ')}}`},
  {id:'sf3f.we3',prompt:'A student writes S = {1, 2, 3, 4, 5, 6, 6} for a die. What is wrong?',steps:[['A sample space is a set, and a set holds each member once.','Repeating an element does not change the set.'],['So this is still the same six outcomes, written with a redundant 6.','It is not a seven-outcome experiment.'],['Written properly the sample space has six outcomes.','Repeating an outcome cannot make it more likely.']],answer:'A sample space is a set, so an outcome is listed only once.'}],
 g:[{id:'sf3f.g1',prompt:'What makes an experiment random?',hint:'What is known and unknown?',answer:'The individual result cannot be predicted, though all possible results are known.',why:'Both halves matter: unpredictable outcome, known possibilities.'},
  {id:'sf3f.g2',prompt:'How many outcomes are in the sample space for two coins?',hint:'Each coin has two results.',answer:'4.',why:'Each of the two results for the first pairs with each for the second.'},
  {id:'sf3f.g3',prompt:'Why are HT and TH different outcomes?',hint:'Are the coins distinguishable?',answer:'Because the two coins are distinguishable, so which one showed heads matters.',why:'Each outcome records what both coins did.'}],
 i:[{id:'sf3f.i1',prompt:'Write the sample space for tossing one coin.',answer:'S = {H, T}.',why:'Two possible results, each listed once.'},
  {id:'sf3f.i2',prompt:'Is {1, 2, 3} the sample space for a die?',answer:'No.',why:'It is incomplete; three possible outcomes are missing.'},
  {id:'sf3f.i3',prompt:'Why is the sample space written with braces?',answer:'Because it is a set.',why:'Set notation carries the rules that each outcome appears once and order does not matter.'},
  {id:'sf3f.i4',prompt:'Does listing an outcome twice make it more likely?',answer:'No.',why:'A set is unchanged by repetition; the experiment is the same.'}],
 td:[{id:'sf3f.td1',prompt:'Why describe the possible results as a set rather than just a list?',reasoning:'Because the rules of a set are exactly the rules the possibilities obey. Each outcome happens or does not, so it belongs once; the order in which someone writes them changes nothing about the experiment; and two descriptions with the same members describe the same experiment. A list carries none of those guarantees — it tolerates repeats and treats order as meaningful. Choosing set notation is not a preference about symbols but a claim about what kind of object the possibilities form, and everything later in the chapter depends on it, since an event will be a subset of this set.'}],
 summary:`A random experiment has unpredictable individual results but a known set of possibilities. That set is the sample space S, written in braces with each outcome once: a die gives S = {${DIE.outcomes.join(', ')}}, and two coins give S = {${TWO_COINS.outcomes.join(', ')}}. Repeating an outcome does not make it more likely.`,
 next:'Next you will pick out parts of the sample space and call them events.',
 t:['Describe a random experiment by its sample space, written as a set.',['Set notation'],['"the set of all possible outcomes", as the definition of S'],['List the sample space in full before any talk of likelihood; the chapter rests on it.','Press on why HT and TH differ — it is where two-coin sample spaces go wrong.'],['Ask what is wrong with a repeated outcome.'],['Write S in braces every time.'],['Ask what makes a sample space complete.']]} as unknown as L),

lesson({ id:'ncert_kemh1_sf3_summative_lesson', sec:'14.1', title:'Event', page:386,
 prereq:['ncert_kemh1_sf3_formative'], assume:['Sample space in set notation','Subsets'],
 goal:'You will describe an event as a subset of the sample space and say when it occurs.',
 checks:['Write a sample space.','Say what a subset is.'], ifNot:'Revisit the sample space lesson; an event is part of one.',
 vocab:[['event','A subset of the sample space.'],
  ['event occurs','The event occurs when the outcome that happened is a member of it.']],
 expl:[`With S = {${DIE.outcomes.join(', ')}} for a die, consider "${EVEN.description}". That describes some outcomes and not others — exactly {${EVEN.outcomes.join(', ')}}.`,
  `So an event is a subset of the sample space. It is a set, not a sentence: the words pick out which outcomes belong, and the event itself is that collection.`,
  `This matters because sets can be combined and compared, while sentences cannot. Everything in the rest of the chapter uses that.`,
  `An event occurs when the outcome that actually happened is a member of it. Roll a ${EVEN.outcomes[1]} and the event "${EVEN.description}" occurs, because ${EVEN.outcomes[1]} is in {${EVEN.outcomes.join(', ')}}. Roll a 3 and it does not.`,
  `Every event must be a subset of the sample space. An "event" containing an outcome that the experiment cannot produce is not an event of that experiment at all.`,
  `Two extremes are worth naming. The empty set is an event that never occurs, and the whole sample space is an event that always occurs — the outcome is always a member of S.`],
 rep:['The sample space with the outcomes of an event marked inside it'],
 we:[{id:'sf3s.we1',prompt:`Write "${EVEN.description}" as a subset of the die's sample space.`,steps:[[`The sample space is {${DIE.outcomes.join(', ')}}.`,'Every event is a subset of this.'],['Pick out the outcomes the description covers.','The even faces are 2, 4 and 6.'],[`So the event is {${EVEN.outcomes.join(', ')}}.`,'A set of outcomes, not a sentence.']],answer:`{${EVEN.outcomes.join(', ')}}`},
  {id:'sf3s.we2',prompt:`If the die shows ${EVEN.outcomes[1]}, does "${EVEN.description}" occur? And if it shows 3?`,steps:[['The event occurs when the actual outcome is a member of it.','That is the definition, applied directly.'],[`${EVEN.outcomes[1]} is in {${EVEN.outcomes.join(', ')}}, so the event occurs.`,'Membership settles it.'],[`3 is not in that set, so the event does not occur.`,'The same test, with the opposite answer.']],answer:'Yes for 4; no for 3.'},
  {id:'sf3s.we3',prompt:'Someone writes the event {5, 7} for a die. What is wrong?',steps:[['An event must be a subset of the sample space.','Every member must be a possible outcome.'],[`7 is not in {${DIE.outcomes.join(', ')}}.`,'The die cannot produce it.'],['So this is not an event of this experiment.','It describes outcomes the experiment never has.']],answer:'7 is not an outcome, so the set is not a subset of the sample space.'}],
 g:[{id:'sf3s.g1',prompt:'What kind of object is an event?',hint:'Set or sentence?',answer:'A subset of the sample space.',why:'The words describe it, but the event is the set of outcomes.'},
  {id:'sf3s.g2',prompt:'When does an event occur?',hint:'Think about membership.',answer:'When the outcome that happened is a member of it.',why:'Occurrence is membership, nothing more.'},
  {id:'sf3s.g3',prompt:'Which event always occurs?',hint:'Which subset holds every outcome?',answer:'The sample space itself.',why:'The outcome is always a member of S.'}],
 i:[{id:'sf3s.i1',prompt:`Write "${BELOW_FOUR.description}" as a subset for a die.`,answer:`{${BELOW_FOUR.outcomes.join(', ')}}`,why:'Those are the outcomes the description covers.'},
  {id:'sf3s.i2',prompt:'Does the event {2, 4, 6} occur when the die shows 5?',answer:'No.',why:'5 is not a member of that set.'},
  {id:'sf3s.i3',prompt:'What does the empty set mean as an event?',answer:'An event that never occurs.',why:'No outcome is a member of it.'},
  {id:'sf3s.i4',prompt:'Can an event contain an outcome not in the sample space?',answer:'No.',why:'An event must be a subset of the sample space.'}],
 td:[{id:'sf3s.td1',prompt:'Why insist that an event IS a set rather than the sentence describing it?',reasoning:'Because sets can be operated on and sentences cannot. Once "the number is even" is the set {2, 4, 6}, it can be intersected with another event, complemented against the sample space, or compared for overlap — and each of those operations has a precise answer. Left as a sentence, combining two events would mean combining two pieces of English, where "and" and "or" are matters of interpretation rather than calculation. The whole of the rest of this chapter — not, and, or, mutually exclusive, the addition rule — depends on events being the kind of thing set algebra applies to.'}],
 summary:`An event is a subset of the sample space, not a sentence: "${EVEN.description}" is the set {${EVEN.outcomes.join(', ')}}. An event occurs when the actual outcome is a member of it. Every event must be a subset of S, the empty set never occurs, and S itself always does.`,
 next:'Next you will combine events using not, and, or.',
 t:['Represent an event as a subset and decide occurrence by membership.',['Sample space','Subsets'],['"is a member of", as the test for occurrence'],['Write every event in braces before discussing it; the set form is what the next three lessons operate on.','Reject an out-of-space "event" explicitly — it shows why the subset condition is part of the definition.'],['Ask whether a given outcome makes the event occur.'],['Write the event as a set first.'],['Ask what the empty set means here.']]} as unknown as L),


lesson({ id:'ncert_kemh1_s14_1_2_not_and_or_lesson', sec:'14.1.2', title:'Algebra of events', page:388,
 prereq:['ncert_kemh1_sf3_summative','ncert_kemh1_s1_7'], assume:['Events as subsets','Union, intersection and complement of sets'],
 goal:'You will build new events from old ones using not, and, or.',
 checks:['Write an event as a subset.','Take the union of two sets.'], ifNot:'Revisit set operations; the three words here are exactly three of them.',
 vocab:[['not A','The event that A does not occur: the complement of A in S.'],
  ['A and B','The event that both occur: the intersection.'],
  ['A or B','The event that at least one occurs: the union.']],
 expl:[`Take A = "${EVEN.description}" = {${EVEN.outcomes.join(', ')}} and B = "${BELOW_FOUR.description}" = {${BELOW_FOUR.outcomes.join(', ')}} for a die.`,
  `"Not A" is the event that A fails to occur. Those are exactly the outcomes of S that are not in A: {${NOT_EVEN.outcomes.join(', ')}}. That is the complement, and it needs a sample space to be taken against — "not A" is meaningless without knowing what else could have happened.`,
  `"A and B" is the event that both occur, so the outcome must be in both sets: {${EVEN_AND_LOW.outcomes.join(', ')}}. That is the intersection.`,
  `"A or B" is the event that at least one occurs. An outcome in either set qualifies, and so does one in both: {${EVEN_OR_LOW.outcomes.join(', ')}}. That is the union.`,
  `The "or" here is inclusive. An outcome belonging to both events still makes "A or B" occur, and it appears in the union once. This is not the everyday "either one or the other but not both".`,
  `Each of the three words is a set operation, so each has a definite answer rather than an interpretation. That is what makes the next two lessons possible.`],
 rep:['The sample space as a rectangle with the two event regions and the operation shaded'],
 we:[{id:'s1412.we1',prompt:`Write "not A" where A = {${EVEN.outcomes.join(', ')}} for a die.`,steps:[[`The sample space is {${DIE.outcomes.join(', ')}}.`,'The complement is taken against it.'],['Keep the outcomes of S that are not in A.','Those are the odd faces.'],[`So not A = {${NOT_EVEN.outcomes.join(', ')}}.`,'Every outcome is in exactly one of A and not A.']],answer:`{${NOT_EVEN.outcomes.join(', ')}}`},
  {id:'s1412.we2',prompt:`Write "A and B" and "A or B" for A = {${EVEN.outcomes.join(', ')}} and B = {${BELOW_FOUR.outcomes.join(', ')}}.`,steps:[['"And" needs the outcome in both sets.',`Only ${EVEN_AND_LOW.outcomes.join(', ')} appears in both.`],['"Or" needs the outcome in at least one.','Everything in either set qualifies.'],[`So A and B = {${EVEN_AND_LOW.outcomes.join(', ')}}, A or B = {${EVEN_OR_LOW.outcomes.join(', ')}}.`,`Note that ${EVEN_AND_LOW.outcomes[0]} is in the union once, not twice.`]],answer:`and {${EVEN_AND_LOW.outcomes.join(', ')}}; or {${EVEN_OR_LOW.outcomes.join(', ')}}`},
  {id:'s1412.we3',prompt:'Why does "A or B" include the outcomes in both?',steps:[['"A or B" is the event that at least one of them occurs.','An outcome in both certainly makes at least one occur.'],['So it belongs to the union.','Excluding it would describe a different event.'],[`That is why ${EVEN_AND_LOW.outcomes[0]} appears in {${EVEN_OR_LOW.outcomes.join(', ')}}.`,'The "or" of this chapter is inclusive.']],answer:'Because at least one of them occurs, which is what "or" means here.'}],
 g:[{id:'s1412.g1',prompt:'Which set operation is "A and B"?',hint:'Both must happen.',answer:'Intersection.',why:'The outcome must belong to both events.'},
  {id:'s1412.g2',prompt:'Why does "not A" need a sample space?',hint:'Not A among what?',answer:'Because the complement is taken against S.',why:'Without knowing the other possibilities there is nothing to complement against.'},
  {id:'s1412.g3',prompt:'Is "A or B" exclusive here?',hint:'What about outcomes in both?',answer:'No, it is inclusive.',why:'An outcome in both still makes at least one occur.'}],
 i:[{id:'s1412.i1',prompt:`For a die, write "not ${BELOW_FOUR.description}".`,answer:'{4, 5, 6}.',why:'The outcomes of S not in {1, 2, 3}.'},
  {id:'s1412.i2',prompt:'If A and B share no outcomes, what is "A and B"?',answer:'The empty set.',why:'No outcome lies in both, so the intersection is empty.'},
  {id:'s1412.i3',prompt:'Does an outcome in both A and B belong to "A or B"?',answer:'Yes.',why:'It makes at least one of them occur.'},
  {id:'s1412.i4',prompt:'What is "A or not A"?',answer:'The whole sample space.',why:'Every outcome is in one or the other.'}],
 td:[{id:'s1412.td1',prompt:'Everyday "or" often means one or the other but not both. Why does mathematics use the inclusive version here?',reasoning:'Because the question being asked is whether at least one event occurred, and an outcome that makes both occur certainly satisfies that. If "or" excluded the overlap, then "A or B" would fail to occur in precisely the case where most would say it had occurred twice over, which is absurd. There is also a practical reason: the inclusive union composes cleanly with complement and intersection, and the exclusive version does not, so the whole algebra would have to be rebuilt around a weaker operation. The everyday sense is not wrong, only different, and the chapter says which it means.'}],
 summary:`Not A is the complement {${NOT_EVEN.outcomes.join(', ')}}, taken against the sample space. A and B is the intersection {${EVEN_AND_LOW.outcomes.join(', ')}}, and A or B is the union {${EVEN_OR_LOW.outcomes.join(', ')}}. The "or" is inclusive: an outcome in both still belongs, and appears once.`,
 next:'Next you will ask how a collection of events covers the sample space.',
 t:['Build events with not, and, or as complement, intersection and union.',['Set operations','Events as subsets'],['"at least one", as the reading of or'],['Shade the Venn region and write the set side by side; they must agree every time.','Say explicitly that or is inclusive — the everyday sense is the default students bring.'],['Ask what happens to outcomes in both.'],['Write the resulting set before naming it.'],['Ask for "A or not A".']]} as unknown as L),

lesson({ id:'ncert_kemh1_s14_1_4_exhaustive_exclusive_lesson', sec:'14.1.4', title:'Exhaustive and mutually exclusive events', page:390,
 prereq:['ncert_kemh1_s14_1_2'], assume:['Not, and, or events','Union and intersection'],
 goal:'You will decide whether a collection of events is exhaustive, mutually exclusive, both or neither.',
 checks:['Take the union of several events.','Test two events for a shared outcome.'], ifNot:'Revisit the algebra of events; both ideas here are read off set operations.',
 vocab:[['exhaustive','A collection whose union is the whole sample space.'],
  ['mutually exclusive','Events no two of which share an outcome.']],
 expl:[`Two questions can be asked of a collection of events. Do they cover everything? Can any two happen together?`,
  `They are exhaustive when their union is the whole sample space — whatever happens, some event in the collection occurs. For a die, {${EVEN.outcomes.join(', ')}} and {${ODD.outcomes.join(', ')}} together give every face, so they are exhaustive.`,
  `They are mutually exclusive when no two share an outcome, so no two can occur together. Those same two events share nothing, so they are mutually exclusive as well.`,
  `The two properties are independent, and all four combinations occur. {${EVEN.outcomes.join(', ')}} and {${BELOW_FOUR.outcomes.join(', ')}} are neither: they share ${EVEN_AND_LOW.outcomes.join(', ')}, and together they still miss ${DIE.outcomes.filter((o) => !EVEN_OR_LOW.outcomes.includes(o)).join(', ')}.`,
  `A collection can also be exhaustive without being mutually exclusive — the whole of S plus any other event covers everything but overlaps — or mutually exclusive without being exhaustive, like {${EVEN.outcomes[0]}} and {${EVEN.outcomes[1]}}, which share nothing and cover little.`,
  `Both questions are settled by the sets, not by the words used to describe them. Two events with very different descriptions may share an outcome, and two that sound opposite may not cover everything.`],
 rep:['Event regions drawn inside the sample space, showing overlap and coverage'],
 we:[{id:'s1414.we1',prompt:`Are {${EVEN.outcomes.join(', ')}} and {${ODD.outcomes.join(', ')}} exhaustive? Mutually exclusive?`,steps:[['Take their union and compare with the sample space.',`Together they give {${DIE.outcomes.join(', ')}}, which is S, so they are exhaustive.`],['Take their intersection.','They share no outcome, so they are mutually exclusive.'],['So this collection is both.','Every roll falls in exactly one of them.']],answer:'Both exhaustive and mutually exclusive.'},
  {id:'s1414.we2',prompt:`Are {${EVEN.outcomes.join(', ')}} and {${BELOW_FOUR.outcomes.join(', ')}} exhaustive or mutually exclusive?`,steps:[[`Their union is {${EVEN_OR_LOW.outcomes.join(', ')}}, which misses ${DIE.outcomes.filter((o) => !EVEN_OR_LOW.outcomes.includes(o)).join(', ')}.`,'So they are not exhaustive.'],[`Their intersection is {${EVEN_AND_LOW.outcomes.join(', ')}}, which is not empty.`,'So they are not mutually exclusive either.'],['This collection is neither.','The two properties failed independently.']],answer:'Neither.'},
  {id:'s1414.we3',prompt:'Give a collection that is mutually exclusive but not exhaustive.',steps:[['Mutually exclusive needs no shared outcome.','Single distinct outcomes certainly qualify.'],[`Take {${EVEN.outcomes[0]}} and {${EVEN.outcomes[1]}}.`,'They share nothing.'],['Their union misses four faces, so they are not exhaustive.','One property holds and the other does not.']],answer:`{${EVEN.outcomes[0]}} and {${EVEN.outcomes[1]}}.`}],
 g:[{id:'s1414.g1',prompt:'What makes a collection exhaustive?',hint:'What must the union be?',answer:'Their union is the whole sample space.',why:'Whatever happens, some event in the collection occurs.'},
  {id:'s1414.g2',prompt:'What makes two events mutually exclusive?',hint:'What must the intersection be?',answer:'They share no outcome.',why:'So they cannot both occur.'},
  {id:'s1414.g3',prompt:'Can a collection be exhaustive but not mutually exclusive?',hint:'Can covering sets overlap?',answer:'Yes.',why:'Covering everything says nothing about overlapping.'}],
 i:[{id:'s1414.i1',prompt:`Are {${BELOW_FOUR.outcomes.join(', ')}} and {4, 5, 6} exhaustive?`,answer:'Yes.',why:'Together they give every face of the die.'},
  {id:'s1414.i2',prompt:'Are an event and its complement mutually exclusive?',answer:'Yes.',why:'No outcome is in both.'},
  {id:'s1414.i3',prompt:'Are an event and its complement exhaustive?',answer:'Yes.',why:'Every outcome is in one or the other.'},
  {id:'s1414.i4',prompt:`Are {${EVEN.outcomes[0]}} and {${EVEN.outcomes[1]}} exhaustive?`,answer:'No.',why:'Their union covers only two of the six outcomes.'}],
 td:[{id:'s1414.td1',prompt:'Why keep exhaustive and mutually exclusive as separate ideas when the most useful collections have both?',reasoning:'Because they answer different questions and can fail separately. Exhaustive asks whether the collection leaves any possibility uncovered; mutually exclusive asks whether it double-counts. A collection can do either badly while doing the other perfectly, and the four combinations all occur in practice. Merging them into one notion of "well-behaved" would hide which thing has gone wrong when a calculation misbehaves — and in the next lessons the two have quite different consequences, since exhaustiveness makes probabilities total 1 while exclusivity is what lets them simply be added.'}],
 summary:`A collection is exhaustive when its union is the whole sample space, and mutually exclusive when no two members share an outcome. The properties are independent: {${EVEN.outcomes.join(', ')}} and {${ODD.outcomes.join(', ')}} are both, while {${EVEN.outcomes.join(', ')}} and {${BELOW_FOUR.outcomes.join(', ')}} are neither. Both are decided by the sets, not the descriptions.`,
 next:'Next you will assign probabilities to the outcomes themselves.',
 t:['Decide exhaustiveness and mutual exclusivity from the union and intersection.',['Set operations'],['"union is S" and "share no outcome", as the two tests'],['Work an example of each of the four combinations; students who see only the both case assume the properties come together.','Decide from the sets every time — descriptions mislead.'],['Ask for a collection that is one but not the other.'],['Take the union before answering.'],['Ask about an event and its complement.']]} as unknown as L),


lesson({ id:'ncert_kemh1_s14_2_axiomatic_probability_lesson', sec:'14.2', title:'Axiomatic Approach to Probability', page:394,
 prereq:['ncert_kemh1_s14_1_4'], assume:['Events as subsets','Exhaustive and mutually exclusive events','Fractions'],
 goal:'You will say what makes an assignment of numbers to outcomes a probability.',
 checks:['Add fractions.','Write an event as a subset.'], ifNot:'Revisit events; probability is assigned over them.',
 vocab:[['probability assignment','A number given to each outcome, obeying the axioms below.']],
 expl:[`Probability has been met before, as favourable outcomes over total. This chapter asks a different question: what makes a set of numbers a probability at all?`,
  `The answer is a short list of conditions. Give each outcome of S a number. The assignment is a probability when no number is negative, and when all of them together total exactly 1.`,
  `The probability of an event then follows: add the numbers of the outcomes inside it. The event's probability is not assigned separately — it is a consequence of which outcomes it contains.`,
  `From those conditions everything else follows. Because no number is negative and they total 1, every event has probability between 0 and 1. The impossible event has probability 0 and the whole sample space has probability 1.`,
  `An assignment failing either condition is not a probability. Numbers totalling ${formatRational(rational(6,5))} do not describe any experiment, and a negative number does not either. These are refused rather than adjusted — rescaling them would hide a real error.`,
  `Notice what the axioms do not say. They do not require the outcomes to be equally likely. A weighted die, where some faces carry more than others, has a perfectly good probability assignment as long as the numbers are non-negative and total 1.`,
  `That generality is the point of the axiomatic view. The familiar favourable-over-total rule is one particular assignment, and the next lesson shows which.`],
 rep:['Each outcome listed with its probability, and the total shown as 1'],
 we:[{id:'s142.we1',prompt:`For ${DIE.description} modelled as fair, write the probability of each outcome and check the conditions.`,steps:[[`There are ${DIE.outcomes.length} outcomes, and the die is modelled as fair.`,'So no face is favoured.'],[`Each gets ${show(rational(1,6))}.`,'Equal numbers for equal treatment.'],[`None is negative, and six copies of ${show(rational(1,6))} total 1.`,'Both conditions hold, so this is a probability assignment.']],answer:`each outcome ${show(rational(1,6))}, totalling 1`},
  {id:'s142.we2',prompt:`Find the probability of "${EVEN.description}" from the outcome probabilities.`,steps:[[`The event is {${EVEN.outcomes.join(', ')}}.`,'Three outcomes.'],['Add the probabilities of those outcomes.',`Three lots of ${show(rational(1,6))}.`],[`That gives ${P(EVEN)}.`,'Derived from the outcomes, not assigned to the event directly.']],answer:P(EVEN)},
  {id:'s142.we3',prompt:'Someone assigns 1/5 to each of a die\u2019s six outcomes. Is this a probability?',steps:[['Check the conditions rather than the plausibility.','None of the numbers is negative, so the first holds.'],[`Six lots of ${show(rational(1,5))} total ${formatRational(rational(6,5))}, not 1.`,'The second condition fails.'],['So it is not a probability assignment.','It is refused, not rescaled — rescaling would hide the error.']],answer:'No — the numbers total more than 1.'}],
 g:[{id:'s142.g1',prompt:'What two conditions make an assignment a probability?',hint:'Signs and total.',answer:'No number is negative, and they total 1.',why:'Those are the axioms at this level.'},
  {id:'s142.g2',prompt:'How is an event\u2019s probability found?',hint:'From its members.',answer:'By adding the probabilities of its outcomes.',why:'The event probability is derived, not assigned.'},
  {id:'s142.g3',prompt:'Must the outcomes be equally likely?',hint:'Do the axioms say so?',answer:'No.',why:'The axioms require only non-negativity and a total of 1.'}],
 i:[{id:'s142.i1',prompt:'What is the probability of the whole sample space?',answer:'1.',why:'It contains every outcome, and the outcome probabilities total 1.'},
  {id:'s142.i2',prompt:'What is the probability of the empty event?',answer:'0.',why:'There are no outcomes to add.'},
  {id:'s142.i3',prompt:'Can an outcome have probability −0.1?',answer:'No.',why:'The axioms forbid a negative probability.'},
  {id:'s142.i4',prompt:'Can two outcomes of a four-outcome experiment have probability 0.6 and 0.5?',answer:'No.',why:'Those alone exceed 1, so the total cannot be 1.'}],
 td:[{id:'s142.td1',prompt:'Why start from axioms when favourable-over-total already works?',reasoning:'Because favourable-over-total only works under an assumption that is often false. It counts outcomes, which treats them as interchangeable, and that is right only when they really are equally likely. A weighted die, a bent coin, a spinner with unequal sectors — none of these can be handled by counting, yet all have perfectly definite probabilities. Starting from the axioms covers all of them, and then recovers the counting rule as the special case where the assignment happens to be uniform. The generality is not abstraction for its own sake; it is what makes the familiar rule safe to use, by making its condition explicit.'}],
 summary:`An assignment of numbers to outcomes is a probability when none is negative and they total exactly 1. An event's probability is the sum of its outcomes' numbers, so it follows from which outcomes the event contains. Every event then has probability between 0 and 1. The axioms do not require equal likelihood.`,
 next:'Next you will see which assignment gives the familiar counting rule.',
 t:['State the axioms and derive event probability from outcome probabilities.',['Events','Fractions'],['"non-negative, and totalling 1", as the two conditions'],['Check a failing assignment explicitly; refusing it is more instructive than any valid example.','Say early that equal likelihood is NOT an axiom — it is the next lesson\u2019s special case.'],['Ask whether an assignment is valid, not what the answer is.'],['Add outcome probabilities to get the event\u2019s.'],['Ask about a weighted die.']]} as unknown as L),

lesson({ id:'ncert_kemh1_s14_2_2_equally_likely_lesson', sec:'14.2.2', title:'Probability of an event', page:397,
 prereq:['ncert_kemh1_s14_2'], assume:['Axiomatic probability','Events as subsets'],
 goal:'You will derive the favourable-over-total rule as the equally likely case of the axioms.',
 checks:['State the probability axioms.','Find an event\u2019s probability from outcome probabilities.'], ifNot:'Revisit the axioms; this lesson derives a rule from them.',
 vocab:[['equally likely','Outcomes modelled as carrying the same probability.']],
 expl:[`Suppose the ${DIE.outcomes.length} outcomes of an experiment are equally likely — each carries the same number. The axioms then decide what that number must be.`,
  `Call it p. The outcomes total 1, and there are ${DIE.outcomes.length} of them, so ${DIE.outcomes.length}p = 1 and p = ${show(rational(1,6))}. In general, with n equally likely outcomes each has probability 1/n.`,
  `Nothing was assumed about the value; it was forced. Equal likelihood plus a total of 1 leaves no choice.`,
  `Now take an event with k outcomes. Its probability is the sum of k copies of 1/n, which is k/n — the number of favourable outcomes over the total number.`,
  `So the familiar rule is not a definition. It is what the axioms give when, and only when, the outcomes are equally likely. For "${EVEN.description}" the rule gives ${P(EVEN)}, which is exactly what adding the outcome probabilities gave.`,
  `The condition is doing real work. If the outcomes are not equally likely, counting them is simply the wrong calculation, and the rule gives an answer to a question nobody asked. A weighted die has six outcomes, but its probabilities are not ${show(rational(1,6))} each.`,
  `This also explains why the earlier grades' work was correct: every experiment there was modelled with equally likely outcomes, so the condition held even when it was not stated.`],
 rep:['The outcomes of the event marked within the sample space, counted against the total'],
 we:[{id:'s1422.we1',prompt:`Derive the probability of a single outcome of ${DIE.description}, modelled as fair.`,steps:[['Let each outcome have probability p, since they are equally likely.','Equal likelihood means one common value.'],[`There are ${DIE.outcomes.length} outcomes and they total 1, so ${DIE.outcomes.length}p = 1.`,'This is the axiom applied, not an assumption.'],[`So p = ${show(rational(1,6))}.`,'The value is forced, not chosen.']],answer:show(rational(1,6))},
  {id:'s1422.we2',prompt:`Find the probability of "${BELOW_FOUR.description}" two ways.`,steps:[[`Adding outcome probabilities: three lots of ${show(rational(1,6))}.`,'Straight from the assignment.'],[`Counting: ${BELOW_FOUR.outcomes.length} favourable out of ${DIE.outcomes.length}.`,'The rule derived above.'],[`Both give ${P(BELOW_FOUR)}.`,'They agree because the rule came from the assignment.']],answer:P(BELOW_FOUR)},
  {id:'s1422.we3',prompt:'Why can favourable-over-total not be used for a weighted die?',steps:[['Counting outcomes treats them as interchangeable.','That is only right when they carry equal probability.'],['A weighted die has outcomes carrying different probabilities.','So counting them answers a different question.'],['The axioms still apply, but the probabilities must come from the assignment itself.','The rule is unavailable, not merely inaccurate.']],answer:'Because its outcomes are not equally likely, so counting them is the wrong calculation.'}],
 g:[{id:'s1422.g1',prompt:'With n equally likely outcomes, what is each one\u2019s probability?',hint:'What must n equal numbers add to?',answer:'1/n.',why:'n equal numbers totalling 1 must each be 1/n.'},
  {id:'s1422.g2',prompt:'Why does an event with k outcomes have probability k/n?',hint:'Add them.',answer:'Because it is k copies of 1/n.',why:'The event probability is the sum of its outcomes\u2019 probabilities.'},
  {id:'s1422.g3',prompt:'Is favourable-over-total a definition of probability?',hint:'What did it come from?',answer:'No — it is the equally likely case of the axioms.',why:'It is derived, and only valid under that condition.'}],
 i:[{id:'s1422.i1',prompt:`What is the probability of "${SIX.description}" for a fair die?`,answer:P(SIX),why:'One favourable outcome out of six equally likely ones.'},
  {id:'s1422.i2',prompt:'A bag has outcomes that are not equally likely. Can you count to find a probability?',answer:'No.',why:'Counting assumes the outcomes carry equal probability.'},
  {id:'s1422.i3',prompt:'For two fair coins, what is the probability of exactly one head?',answer:'1/2.',why:'Two of the four equally likely outcomes, HT and TH, are favourable.'},
  {id:'s1422.i4',prompt:'Does 1/n depend on which outcome is chosen?',answer:'No.',why:'Equal likelihood means they all carry the same probability.'}],
 td:[{id:'s1422.td1',prompt:'Earlier grades used favourable-over-total without mentioning any condition. Were those answers wrong?',reasoning:'No, because the condition held every time — the dice were fair, the coins unbiased, the balls identical except in colour. What was missing was not correctness but the statement of what made it correct. That matters as soon as an experiment appears where the condition fails, because nothing in the formula itself announces that it has stopped applying; it will return a number regardless. Naming the assumption converts a rule that happens to work into one whose scope you can check, which is precisely what the axiomatic treatment buys.'}],
 summary:`If n outcomes are equally likely, the axioms force each to have probability 1/n, and an event with k of them has probability k/n. The familiar favourable-over-total rule is therefore derived, not defined, and it is valid only under equal likelihood — for "${EVEN.description}" it gives ${P(EVEN)}, agreeing with the assignment.`,
 next:'Next you will find probabilities of not, and, or events.',
 t:['Derive 1/n and k/n from the axioms under equal likelihood.',['Axioms','Events'],['"equally likely", stated before any counting'],['Derive p from n·p = 1 rather than asserting 1/n; the forcing is the lesson.','Give one non-equally-likely experiment so the condition is seen to bite.'],['Ask whether counting is available for a weighted die.'],['State the assumption before counting.'],['Ask why earlier grades\u2019 answers were right.']]} as unknown as L),

lesson({ id:'ncert_kemh1_s14_2_3_probability_rules_lesson', sec:'14.2.3', title:'Probability of the event A or B', page:400,
 prereq:['ncert_kemh1_s14_2_2','ncert_kemh1_s14_1_2'], assume:['Equally likely probabilities','Not, and, or events','Mutually exclusive events'],
 goal:'You will find the probability of not, and, or events from the event sets.',
 checks:['Find the probability of an event.','Form the union and intersection of two events.'], ifNot:'Revisit the algebra of events; each rule here follows one set operation.',
 vocab:[],
 expl:[`Each of not, and, or is a set operation, so each has a probability — found, as always, by adding the probabilities of the outcomes in the resulting event.`,
  `Start with "not A". A and "not A" share no outcome and together cover S, so they are mutually exclusive and exhaustive. Their probabilities therefore total 1, giving P(not A) = 1 − P(A). For "${EVEN.description}" that is ${show(COMP.pEvent)} and ${show(COMP.pComplement)}.`,
  `Now "A or B". Adding P(A) and P(B) seems natural, but it counts every outcome of the overlap twice — once in each event. Subtracting the probability of "A and B" removes exactly that double count.`,
  `So P(A or B) = P(A) + P(B) − P(A and B). With A = "${EVEN.description}" and B = "${BELOW_FOUR.description}": ${show(ADD.pX)} + ${show(ADD.pY)} − ${show(ADD.pBoth)} = ${show(ADD.pEither)}.`,
  `Checking directly: the union is {${EVEN_OR_LOW.outcomes.join(', ')}}, whose outcomes total ${show(ADD.pEither)}. The rule and the event set agree, because the rule was derived from the set.`,
  `When A and B are mutually exclusive the overlap is empty, its probability is 0, and the subtraction removes nothing: P(A or B) = P(A) + P(B). That simpler form is a special case, not the general rule, and using it on overlapping events overstates the answer.`,
  `So the probability of any of these combinations is decided by the resulting event set. Change the operation and the set changes; change the set and the probability follows.`],
 rep:['The two event regions with the overlap marked, showing what is counted twice'],
 we:[{id:'s1423.we1',prompt:`Find the probability of "not ${EVEN.description}".`,steps:[[`P(${EVEN.description}) is ${show(COMP.pEvent)}.`,'From the outcome probabilities.'],['The event and its complement are mutually exclusive and exhaustive.','So their probabilities total 1.'],[`So the complement has probability 1 − ${show(COMP.pEvent)} = ${show(COMP.pComplement)}.`,'Derived from the partition, not quoted.']],answer:show(COMP.pComplement)},
  {id:'s1423.we2',prompt:`Find the probability that the die shows an even number or a number below 4.`,steps:[[`P(A) = ${show(ADD.pX)} and P(B) = ${show(ADD.pY)}.`,'Each from its own outcomes.'],[`They overlap at {${EVEN_AND_LOW.outcomes.join(', ')}}, with probability ${show(ADD.pBoth)}.`,'Those outcomes are in both events.'],[`So P(A or B) = ${show(ADD.pX)} + ${show(ADD.pY)} − ${show(ADD.pBoth)} = ${show(ADD.pEither)}.`,`Checking the union {${EVEN_OR_LOW.outcomes.join(', ')}} directly gives the same ${show(ADD.pEither)}.`]],answer:show(ADD.pEither)},
  {id:'s1423.we3',prompt:'Why subtract the probability of "A and B"?',steps:[['Adding P(A) and P(B) includes each overlap outcome twice.','It is counted once as part of A and once as part of B.'],['The union contains each outcome once.','So the sum overstates it by exactly the overlap.'],['Subtracting P(A and B) removes that excess once.','Which is why the rule has three terms rather than two.']],answer:'Because adding the two probabilities counts the overlap twice.'}],
 g:[{id:'s1423.g1',prompt:'What is P(not A) in terms of P(A)?',hint:'Think about the two conditions together.',answer:'1 − P(A).',why:'An event and its complement partition the sample space.'},
  {id:'s1423.g2',prompt:'Why does the addition rule subtract a term?',hint:'What gets counted twice?',answer:'Because the overlap is counted in both events.',why:'The union holds each outcome once.'},
  {id:'s1423.g3',prompt:'When does P(A or B) = P(A) + P(B)?',hint:'When is the overlap empty?',answer:'When A and B are mutually exclusive.',why:'The intersection then has probability 0.'}],
 i:[{id:'s1423.i1',prompt:`For a fair die, find P(not "${BELOW_FOUR.description}").`,answer:'1/2.',why:'The event has probability 1/2 and the two total 1.'},
  {id:'s1423.i2',prompt:'Two mutually exclusive events have probabilities 1/3 and 1/4. What is P(A or B)?',answer:'7/12.',why:'The overlap is empty, so the probabilities simply add.'},
  {id:'s1423.i3',prompt:'A student computes P(A or B) as P(A) + P(B) for overlapping events. Is the answer too large or too small?',answer:'Too large.',why:'The overlap has been counted twice.'},
  {id:'s1423.i4',prompt:'What is P(A and not A)?',answer:'0.',why:'No outcome lies in both, so the event is empty.'}],
 td:[{id:'s1423.td1',prompt:'Why is the mutually exclusive version taught as a special case rather than as a second rule to remember?',reasoning:'Because it is not a second rule — it is the same rule with one term equal to zero. Treating it separately invites the habit of choosing between two formulas, and the choice is exactly where mistakes happen, since overlap is easy to miss when events are described in words rather than written as sets. Keeping one rule with three terms means the question becomes "what is the overlap?", which can be answered by looking at the sets, instead of "which formula applies?", which cannot. The general form also degrades gracefully: if you wrongly suspect an overlap and compute it as zero, you still get the right answer.'}],
 summary:`P(not A) = 1 − P(A), because an event and its complement partition the sample space. P(A or B) = P(A) + P(B) − P(A and B), the subtraction removing the overlap counted twice — for even and below-four, ${show(ADD.pX)} + ${show(ADD.pY)} − ${show(ADD.pBoth)} = ${show(ADD.pEither)}. When the events are mutually exclusive the overlap is empty and the subtraction takes nothing away.`,
 next:'Later work builds on these rules for more involved experiments.',
 t:['Derive the complement and addition rules from the event sets.',['Probability of events','Set operations'],['"counted twice", said while the overlap is shaded'],['Compute the union directly as well as by the rule; agreement is what makes the rule trustworthy.','Keep one addition rule with three terms rather than two formulas to choose between.'],['Ask whether an answer is too large or too small.'],['Find the overlap before applying the rule.'],['Ask for P(A and not A).']]} as unknown as L),

];
