// ===========================================================================
// v0.84.0-c11.26 checkpoint 90 — CLASS 11 CHAPTER 12, §12.5 AND §12.5.1/2.
//
// C11-LIM-05 and C11-LIM-06. Three systems meet here and none is rebuilt:
// limits (ck86), functions (ck81) and induction (ck87).
//
// ON THE BINOMIAL THEOREM: it is NOT used. The source derives the
// derivative of x^(k+1) by writing it as x^k times x and applying the
// product rule, with the induction hypothesis supplying the derivative of
// x^k — no expansion of (x+h)^n is needed on that route. Reaching for the
// checkpoint-89 model here would have been reuse for its own sake, and
// would have imported a tool the proof does not call for.
//
// §12.5.2 ACCOUNTING: the source has two subsections under §12.5 —
// §12.5.1 "Algebra of derivative of functions" and §12.5.2 "Derivative of
// polynomials and trigonometric functions". The frozen decomposition maps
// C11-LIM-06 to §12.5.1 while its objective covers both. Rather than
// inventing a unit the decomposition does not have, LIM-06 keeps its
// canonical identity and records §12.5.2 as ADDITIONAL covered subsection
// provenance, so the coverage is visible instead of silently dropped.
// ===========================================================================

import type { AuthoredSection } from './authoredSection';
import { type InductionProof, naturalsFrom, proofLayout } from './induction';
import { type L, makeLesson } from './class11Lesson';
import {
  derivativeAt, describeDerivative, differenceQuotient, powerRule,
  productRule, quotientRule, sumRule,
} from './derivative';
import { limitTable, polynomial, rational, secantGraph } from './limits';

export const LIM_C11_CHAPTER_ID = 'ncert_kemh1_ch12';
const BOOK = 'Mathematics, Textbook for Class XI (NCERT, Reprint 2026-27)';

/**
 * §12.5.2 ACCOUNTING. The source has two subsections under §12.5 and the
 * frozen decomposition maps C11-LIM-06 to §12.5.1 alone, while its
 * objective covers polynomial and trigonometric derivatives too — which is
 * §12.5.2. Rather than invent a unit the decomposition does not have, the
 * lesson keeps its canonical identity and records the extra subsection
 * here, so the coverage is visible in provenance instead of dropped.
 */
const ALSO_COVERS: Record<string, string[]> = { '12.5.1': ['12.5.2'] };

const source = (sec: string, title: string, page: number) => {
  const parts = sec.split('.');
  const parent = parts.length > 2 ? parts.slice(0, 2).join('.') : sec;
  return {
    officialChapterId: LIM_C11_CHAPTER_ID,
    officialSectionId: `ncert_kemh1_s${parent.replace(/\./g, '_')}`,
    ...(parts.length > 2 ? { officialSubsectionNumber: sec } : {}),
    // §12.5.2 recorded rather than dropped.
    ...(ALSO_COVERS[sec] ? { additionalSubsectionNumbers: ALSO_COVERS[sec] } : {}),
    sectionNumber: parent, exactTitle: title, startPage: page,
    textbook: BOOK, sourceReference: 'kemh1', inspectionDate: '2026-10-26',
  };
};

const lesson = (l: L): AuthoredSection => makeLesson(l, source as never);

// --- functions and rules, all derived -------------------------------------
export const F_SQ = polynomial('f', 'x²', (x) => x * x);
export const F_CUBE = polynomial('g', 'x³', (x) => x ** 3);
export const F_RECIP = rational('r', '1/x', () => 1, (x) => x, [0]);
export const ONE = polynomial('1', '1', () => 1);
export const ZERO = polynomial('0', '0', () => 0);
export const X = polynomial('x', 'x', (x) => x);

export const R_POWER2 = powerRule(2);
export const R_POWER3 = powerRule(3);
export const R_SUM = sumRule('sum', { f: F_SQ, g: X, df: R_POWER2.derivative, dg: ONE }, 1);
export const R_PRODUCT = productRule('prod', { f: F_SQ, g: X, df: R_POWER2.derivative, dg: ONE });
export const R_QUOTIENT = quotientRule('quot', { f: ONE, g: X, df: ZERO, dg: ONE }, [0]);

const d = (at: number) => describeDerivative(derivativeAt(F_SQ, at));
const Q = differenceQuotient(F_SQ, 3);

export const V_QUOTIENT_TABLE = limitTable('v_dq_table', Q, Q.name, 0,
  `A table of the difference quotient for x² at the point 3, as h gets closer to zero from both sides. The values settle towards ${d(3)}. The row for h equal to zero is absent, because the quotient has no value there — it is the approach that gives the derivative, not substitution.`);

export const V_SECANT = secantGraph('v_dq_secant', F_SQ, F_SQ.name, 3, [1, 0.5, 0.25],
  `The curve of x² with the point at 3 marked, and chords drawn from it to nearby points. As the second point slides towards 3 the chords turn, settling on the line of slope ${d(3)} that just touches the curve there.`);

/**
 * The textbook derives the derivative of x^n "by induction hypothesis", so
 * this is a real `InductionProof`, not prose that says the word.
 */
export const P_POWER_RULE: InductionProof = {
  id: 'ind_power_rule',
  claim: 'For every positive integer n, the derivative of x^n is n x^(n−1)',
  domain: naturalsFrom(1, 'every positive integer n from 1 upwards'),
  baseCase: {
    at: 1, leftValue: 1, rightValue: 1,
    steps: [
      { statement: 'At n = 1 the function is x itself, and its difference quotient is [(x + h) − x] / h, which is h/h.', justification: 'The quotient is formed from the function, not quoted; for non-zero h it simplifies to 1.' },
      { statement: 'That equals 1 for every non-zero h, so its limit as h approaches 0 is 1.', justification: 'A quantity that is constantly 1 near the target approaches 1.' },
      { statement: 'The claim at n = 1 predicts 1 · x^0, which is also 1, so the two agree.', justification: 'Both sides reduce to 1 by calculation, so the base case is checked rather than assumed.' },
    ],
  },
  hypothesis: {
    assumesAbout: 'k',
    statement: 'Suppose the derivative of x^k is k x^(k−1) for one particular positive integer k.',
    conditional: true,
  },
  inductiveStep: {
    startsFrom: 'k', arrivesAt: 'k+1',
    steps: [
      { statement: 'Write x^(k+1) as the product of x^k and x.', justification: 'One more factor of x is exactly what raising the index by one means.' },
      { statement: 'Differentiate that product by the product rule: the derivative is (derivative of x^k)(x) + (x^k)(derivative of x).', justification: 'Both factors vary with x, so each contributes a term.' },
      { statement: 'By the hypothesis the first derivative is k x^(k−1), and the derivative of x is 1.', justification: 'The hypothesis is used here, on the index k only, and nowhere else in the step.' },
      { statement: 'So the derivative is k x^(k−1) · x + x^k, which is k x^k + x^k.', justification: 'Multiplying x^(k−1) by x raises the index back to k.' },
      { statement: 'Collecting gives (k + 1) x^k, which is the claim with k + 1 in place of n.', justification: 'The coefficient and the index are both exactly what the claim requires at k + 1.' },
    ],
  },
  conclusion: {
    statement: 'The derivative of x^n is n x^(n−1) for every positive integer n.',
    restsOn: ['base_case', 'inductive_step'],
  },
};

export const V_POWER_PROOF = proofLayout('v_power_proof', P_POWER_RULE,
  'The proof that the derivative of x to the n is n times x to the n minus one, set out in five labelled parts. The claim states the rule for every positive integer. The base case checks n = 1, where the difference quotient simplifies to 1 and the rule also predicts 1. The induction hypothesis assumes the rule for one index k. The inductive step writes x to the k plus one as a product, differentiates it by the product rule, substitutes the hypothesis and collects terms to reach k plus one times x to the k. The conclusion states the rule for every positive integer, resting on the base case and the step together.');

export const C11_DERIV_SECTIONS: AuthoredSection[] = [

lesson({ id:'ncert_kemh1_s12_5_first_principles_lesson', sec:'12.5', title:'Derivatives', page:306,
 prereq:['ncert_kemh1_s12_3','cbse_fo4_induction'],
 assume:['Limits of a function','Proof by mathematical induction','The binomial theorem'],
 notIntroduce:[['Derivatives of composite functions','']],
 goal:'You will define the derivative as the limit of a difference quotient and derive it from first principles.',
 checks:['Find a limit as a variable approaches a value.','Say what an induction proof needs.'],
 ifNot:'Revisit limits first; the derivative is a particular limit and nothing else.',
 vocab:[['difference quotient','The quantity [f(x + h) − f(x)] / h, the slope of a chord.'],
  ['derivative at a point','The limit of the difference quotient as h approaches 0, written f′(a).'],
  ['derivative as a function','The rule f′(x) giving the derivative at each point where it exists.']],
 expl:[`Take the curve of ${F_SQ.name} and the point where x is 3. Join that point to a nearby one, h further along. The chord between them has slope [f(3 + h) − f(3)] / h.`,
  `This is the difference quotient. For h = 1 it is 7, for h = 0.1 it is 6.1, for h = 0.01 it is 6.01 — the chords are turning towards something.`,
  `The one value you may not use is h = 0. There the quotient reads 0/0, which is not a number, and the quotient simply has no value there. That is not an inconvenience to work around: it is why a limit is needed.`,
  `So the derivative at 3 is the limit of the quotient as h approaches 0, and that limit is ${d(3)}. The quotient is undefined at 0 and its limit exists — the same distinction met when limits were introduced, now doing real work.`,
  `Geometrically the chords settle on the line that just touches the curve at that point, and ${d(3)} is its slope.`,
  `Doing this at a single point gives a number, f′(3). Doing it at a general point gives a rule, f′(x) — a function in its own right, with its own domain. The two are different objects and the notation keeps them apart.`,
  `For powers a pattern appears: the derivative of x² is 2x, and of x³ is 3x². In general the derivative of x^n is n x^(n−1) for a positive integer n. This is a claim about every positive integer, so checking a few cases does not establish it; the textbook proves it by induction, writing the derivative of x^(k+1) as a product and using the hypothesis on x^k.`,
  `The rule is stated for a positive integral index, which is the scope here. Negative and fractional powers are a later matter and are not claimed.`],
 rep:['A table of the difference quotient as h approaches 0, and chords settling on a tangent'],
 visuals:[V_QUOTIENT_TABLE, V_SECANT, V_POWER_PROOF],
 we:[{id:'s125.we1',prompt:`Find the derivative of ${F_SQ.name} at 3 from first principles.`,steps:[['Form the difference quotient [f(3 + h) − f(3)] / h.','It is built from the function, not written down from a rule.'],['Expanding gives [(9 + 6h + h²) − 9] / h, which is (6h + h²)/h.','The 9 cancels, leaving every remaining term with a factor of h.'],['For non-zero h this simplifies to 6 + h. Note that this cancellation is only valid because h is not 0.','If h were 0 there would be nothing to cancel, and the quotient would have no value.'],[`As h approaches 0 that approaches ${d(3)}.`,'The derivative is this limit, not the value of the quotient at 0, which does not exist.']],answer:d(3)},
  {id:'s125.we2',prompt:'Why can the difference quotient be undefined at h = 0 while its derivative exists?',steps:[['At h = 0 the quotient reads 0/0, which is not a number.','Division by zero is undefined, so the quotient genuinely has no value there.'],['But the limit asks what the quotient approaches for h near 0, never at 0.','The approach is a question about nearby values only.'],[`Those nearby values settle on ${d(3)}, so the limit exists and the derivative is that limit.`,'Existence of the limit and existence of the value are separate questions, as limits established.']],answer:'Because the limit asks about nearby values, not the value at the point.'},
  {id:'s125.we3',prompt:'Why does the derivative of x^n need a proof rather than a few checks?',steps:[['The claim is about every positive integer n, of which there are infinitely many.','Any finite number of checks leaves infinitely many cases untested.'],['Induction handles this: verify n = 1, then show that the rule at k forces it at k + 1.','The step is where the product rule and the hypothesis do the work.'],['Together those give the rule for every positive integer.','This is the same proof structure met in the prerequisite, applied to a new claim.']],answer:'Because infinitely many cases cannot be checked one at a time.'}],
 g:[{id:'s125.g1',prompt:'What is the value of the difference quotient at h = 0?',hint:'What does the fraction read there?',answer:'It has no value.',why:'Both numerator and denominator are 0, and 0/0 is not a number.'},
  {id:'s125.g2',prompt:'What is the derivative of x³ by the power rule?',hint:'Lower the index by one.',answer:R_POWER3.rule,why:'The rule gives n x^(n−1) with n = 3.'},
  {id:'s125.g3',prompt:'What is the difference between f′(3) and f′(x)?',hint:'One is a number.',answer:'f′(3) is a number; f′(x) is a function.',why:'The first is the derivative at one point, the second the rule giving it at each point.'}],
 i:[{id:'s125.i1',prompt:`Find the derivative of ${F_SQ.name} at 5 from first principles.`,answer:d(5),why:'The quotient simplifies to 10 + h for non-zero h, which approaches 10.'},
  {id:'s125.i2',prompt:'A student writes the quotient and then puts h = 0 to get the answer. What is wrong?',answer:'The quotient has no value at h = 0.',why:'The derivative is the limit as h approaches 0, and substitution at 0 is not available.'},
  {id:'s125.i3',prompt:'What is the derivative of x by the power rule?',answer:'1',why:'With n = 1 the rule gives 1 · x^0, which is 1.'},
  {id:'s125.i4',prompt:'Does the power rule as stated here cover x^(−2)?',answer:'No.',why:'It is stated for a positive integral index; negative powers are outside this scope.'}],
 td:[{id:'s125.td1',prompt:'The difference quotient has no value at h = 0, yet the whole definition points at h = 0. Why is that not a contradiction?',reasoning:'Because the definition never asks for the value there. A limit is a statement about what happens near a point, deliberately excluding the point itself, and that exclusion is what makes the derivative possible rather than what threatens it. If the quotient did have a value at 0 there would be nothing to take a limit of — the chord would have both endpoints in the same place and no slope at all. The undefined point is not a flaw patched over by the limit; it is the reason the limit is the right tool.'},
  {id:'s125.td2',prompt:'Why does proving the power rule need both the product rule and induction, rather than just one of them?',reasoning:'Because each does something the other cannot. The product rule converts the derivative of x^(k+1) into an expression involving the derivative of x^k — it moves the problem down one index but settles nothing on its own, since the derivative of x^k is still unknown. Induction supplies exactly that missing piece as the hypothesis, and in return needs some way to connect one index to the next, which is what the product rule provides. Neither is sufficient alone: the product rule without induction gives an infinite regress, and induction without it has no step to take.'}],
 summary:`The derivative at a point is the limit of the difference quotient [f(x + h) − f(x)] / h as h approaches 0. The quotient has no value at h = 0, which is precisely why a limit is needed. For ${F_SQ.name} at 3 the derivative is ${d(3)}. The derivative at a point is a number; the derivative as a function is a rule. For a positive integral index the derivative of x^n is n x^(n−1), proved by induction.`,
 next:'Next you will combine derivatives of sums, products and quotients.',
 t:['Define the derivative as the limit of a difference quotient and derive it from first principles.',['Limits','Induction','Binomial theorem'],['"as h approaches 0", never "at h = 0"'],['Show the cancellation and say aloud that it needs h non-zero; that single remark prevents the commonest error in the chapter.','Separate f′(3) from f′(x) explicitly — students who blur them struggle later with the rules.'],['Ask what the quotient equals at h = 0.'],['Form the quotient before simplifying it.'],['Ask whether the power rule covers negative indices.']]} as unknown as L),


lesson({ id:'ncert_kemh1_s12_5_1_algebra_of_derivatives_lesson', sec:'12.5.1', title:'Algebra of Derivative of Functions', page:310,
 prereq:['ncert_kemh1_s12_5','cbse_fo4_induction'],
 assume:['The derivative from first principles','The power rule','Radian measure'],
 notIntroduce:[['Derivatives of composite functions','']],
 goal:'You will derive and use the rules for differentiating sums, differences, products and quotients.',
 checks:['Find a derivative from first principles.','State the power rule.'],
 ifNot:'Revisit first principles; every rule here is derived from that same limit.',
 vocab:[['product rule','The derivative of a product is the derivative of the first times the second, plus the first times the derivative of the second.'],
  ['quotient rule','The derivative of a quotient, valid only where the denominator is not zero.']],
 expl:[`Differentiating from first principles every time is correct but slow. The rules below are not shortcuts invented to avoid it — each is derived from the same limit, once, so it need not be redone.`,
  `Sums are the easy case. The difference quotient of f + g splits into the quotient of f plus the quotient of g, and the limit of a sum is the sum of the limits. So (f + g)′ = f′ + g′, and differences behave the same way: ${R_SUM.of} has derivative ${R_SUM.rule}.`,
  `Products do not behave that way, and it is worth seeing why. The quotient for fg involves f(x + h)g(x + h) − f(x)g(x), and both factors have changed. Adding and subtracting one middle term splits that into a part where only f changed and a part where only g changed.`,
  `That gives two terms, one for each factor varying: ${R_PRODUCT.of} has derivative ${R_PRODUCT.rule}. Anyone expecting f′g′ is assuming only one factor moves at a time, which is not what a product does.`,
  `Quotients follow similarly, with one extra condition. ${R_QUOTIENT.of} has derivative ${R_QUOTIENT.rule}, valid ${R_QUOTIENT.domainDescription}.`,
  `That condition is part of the rule, not a footnote. The function ${R_QUOTIENT.of} has no value where x is 0, so neither does its derivative — even though the written expression might look as though it could be evaluated there. A rule may never give a function a domain wider than it started with.`,
  `With these rules and the power rule, any polynomial can be differentiated: break it into terms, differentiate each, and add. The source also gives the derivatives of the basic trigonometric functions, and those formulas hold only when the angle is measured in radians, because the limits they rest on were established in radian measure.`],
 rep:['Each rule written beside the function it differentiates, with its domain condition'],
 we:[{id:'s1251.we1',prompt:`Differentiate ${R_SUM.of}.`,steps:[['The difference quotient of a sum splits into the two separate quotients.','Because the numerator separates term by term.'],['The limit of a sum is the sum of the limits, so the derivatives add.','This is the algebra of limits applied directly.'],[`So the derivative is ${R_SUM.rule}.`,'Each piece differentiated by the power rule.']],answer:R_SUM.rule},
  {id:'s1251.we2',prompt:`Differentiate ${R_PRODUCT.of} and explain why it has two terms.`,steps:[['In the quotient for a product, both factors change as h changes.','f(x + h)g(x + h) differs from f(x)g(x) in both places at once.'],['Adding and subtracting a middle term separates the change in f from the change in g.','Each piece then has only one factor varying.'],[`Taking limits gives ${R_PRODUCT.rule}.`,'One term for each factor varying, which is why f′g′ is wrong.']],answer:R_PRODUCT.rule},
  {id:'s1251.we3',prompt:`Differentiate ${R_QUOTIENT.of} and state where the result is valid.`,steps:[['Apply the quotient rule to the numerator and denominator.','The derivative of 1 is 0 and the derivative of x is 1.'],[`That gives ${R_QUOTIENT.rule}.`,'Which simplifies, but the simplification does not change where it is defined.'],[`It is valid ${R_QUOTIENT.domainDescription} — the point 0 is excluded.`,'The original function has no value there, so neither can its derivative.']],answer:`${R_QUOTIENT.rule}, valid ${R_QUOTIENT.domainDescription}.`}],
 g:[{id:'s1251.g1',prompt:'Is the derivative of a product the product of the derivatives?',hint:'How many factors change?',answer:'No.',why:'Both factors vary, so the derivative has two terms, one for each.'},
  {id:'s1251.g2',prompt:`Where is the derivative of ${R_QUOTIENT.of} defined?`,hint:'Where is the function itself defined?',answer:'Everywhere except 0.',why:'A derivative cannot exist where the function has no value.'},
  {id:'s1251.g3',prompt:'Why must the angle be in radians for the trigonometric derivatives?',hint:'What were the underlying limits measured in?',answer:'Because the limits those formulas rest on were established in radian measure.',why:'In degrees the same limits take different values, so the formulas would not hold.'}],
 i:[{id:'s1251.i1',prompt:'Differentiate x³ + x.',answer:'3x² + 1.',why:'Differentiate each term by the power rule and add.'},
  {id:'s1251.i2',prompt:'A student differentiates a product as f′g′. What have they assumed?',answer:'That only one factor changes at a time.',why:'Both factors vary, so each contributes its own term.'},
  {id:'s1251.i3',prompt:'After simplifying a quotient derivative, may the excluded point be included again?',answer:'No.',why:'The original function has no value there, and simplification does not change its domain.'},
  {id:'s1251.i4',prompt:'Can these rules differentiate a function of a function?',answer:'No.',why:'That needs a separate rule, which is outside the scope of this section.'}],
 td:[{id:'s1251.td1',prompt:'Why does differentiating a product need two terms when differentiating a sum needs only one each?',reasoning:'Because of what changes. In a sum the two parts contribute independently: move x a little and the total moves by the change in f plus the change in g, with no interaction. In a product the two interact — the change in the product depends on the change in f multiplied by the current value of g, and on the change in g multiplied by the current value of f. Each term records one of those, and the term where both change at once vanishes in the limit because it carries two factors of h. So the two terms are not a quirk of notation but a record of the two ways a product can move.'},
  {id:'s1251.td2',prompt:'The simplified derivative of a quotient often looks perfectly well defined at the excluded point. Why keep the exclusion?',reasoning:'Because the derivative belongs to the original function, not to the expression that happens to represent it after simplification. The derivative at a point is the limit of a difference quotient built from the function, and where the function has no value there is no quotient to form, so there is nothing for a limit to be. A tidy-looking expression is not evidence that a derivative exists; it is only a formula that agrees with the derivative wherever the derivative is defined. Dropping the condition would be claiming a slope for a point the curve never reaches.'}],
 summary:`Sums and differences differentiate term by term. Products need two terms, ${R_PRODUCT.rule}, because both factors vary. Quotients give ${R_QUOTIENT.rule}, valid ${R_QUOTIENT.domainDescription} — the domain restriction is part of the rule. With the power rule these handle any polynomial, and the trigonometric derivatives hold in radian measure only. Differentiating a function of a function is a separate matter not covered here.`,
 next:'Composite functions need a further rule, treated separately.',
 t:['Derive and apply the sum, difference, product and quotient rules, keeping domain restrictions.',['First principles','Power rule','Radians'],['"both factors change", said when the product rule appears'],['Derive the product rule by adding and subtracting the middle term; stating it alone leaves f′g′ looking just as plausible.','Keep the quotient domain condition attached to the rule every time — students drop it the moment the expression simplifies.'],['Ask whether a simplified derivative may be evaluated at an excluded point.'],['State the domain alongside the derivative.'],['Ask what rule a function of a function would need.']]} as unknown as L),

];
