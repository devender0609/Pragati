// ===========================================================================
// v0.84.0-c11.24 checkpoint 89 — CLASS 11 CHAPTER 7, §7.2.
//
// The first authored unit that depends on two separately authored
// prerequisites from different source structures: C11-PNC-05 (combinations,
// NCERT §6.4) and C11-IND-01 (induction, CBSE-only, no chapter owner).
//
// Nothing about induction or combinations is re-implemented here. The proof
// is an `InductionProof`, validated by the same validator as every other
// proof in the corpus; the coefficients come from `combinations`.
// ===========================================================================

import type { AuthoredSection } from './authoredSection';
import { type InductionProof, naturalsFrom, proofLayout } from './induction';
import { type L, makeLesson } from './class11Lesson';
import {
  adjacentCoefficientsCombine, coefficientRows, describeExpansion, describeTerm,
  expand, termAt,
} from './binomial';
import { combinations, describeCount } from './counting';

export const BIN_C11_CHAPTER_ID = 'ncert_kemh1_ch07';
const BOOK = 'Mathematics, Textbook for Class XI (NCERT, Reprint 2026-27)';

const source = (sec: string, title: string, page: number) => ({
  officialChapterId: BIN_C11_CHAPTER_ID,
  officialSectionId: `ncert_kemh1_s${sec.replace(/\./g, '_')}`,
  sectionNumber: sec, exactTitle: title, startPage: page,
  textbook: BOOK, sourceReference: 'kemh1', inspectionDate: '2026-10-26',
});

const lesson = (l: L): AuthoredSection => makeLesson(l, source);

// --- canonical objects, all derived --------------------------------------
export const E2 = expand('bin_e2', 2);
export const E3 = expand('bin_e3', 3);
export const E4 = expand('bin_e4', 4);
const C = (n: number, r: number) => describeCount(combinations(n, r));
const ID = adjacentCoefficientsCombine(4, 2);

export const V_COEFFICIENT_ROWS = coefficientRows('v_bin_rows', 5,
  `Rows of binomial coefficients from n = 0 to n = 5, each row one line of numbers. Row 0 is a single 1; row 1 is 1 and 1; row 4 is ${expand('x', 4).terms.map((t) => describeCount(t.coefficient)).join(', ')}. Each entry in row n is the number of ways of choosing that many of the n factors to contribute the second symbol, and every row begins and ends with 1 because there is exactly one way to choose none and one way to choose all.`);

/**
 * The textbook's proof, as an instance of the shared induction model.
 * There is no binomial-specific proof type: the same five parts, the same
 * validator, the same failure modes caught.
 */
export const P_BINOMIAL: InductionProof = {
  id: 'ind_binomial',
  claim: 'For a positive integral index n, (a + b)^n is the sum over r from 0 to n of nCr a^(n−r) b^r',
  domain: naturalsFrom(1, 'every positive integer n from 1 upwards'),
  baseCase: {
    at: 1, leftValue: 1, rightValue: 1,
    steps: [
      { statement: 'At n = 1 the left side is (a + b) itself, which is a + b.', justification: 'A quantity raised to the first power is that quantity unchanged.' },
      { statement: `The right side is 1C0 a + 1C1 b, and both coefficients are ${C(1, 0)}, so it is a + b as well.`, justification: 'There is one way to choose none of the single factor and one way to choose it, so both coefficients equal 1.' },
      { statement: 'The two sides agree, so the claim is true at n = 1.', justification: 'Both reduce to the same expression a + b by substitution, not by assumption.' },
    ],
  },
  hypothesis: {
    assumesAbout: 'k',
    statement: 'Suppose the expansion holds for some particular index n = k.',
    conditional: true,
  },
  inductiveStep: {
    startsFrom: 'k', arrivesAt: 'k+1',
    steps: [
      { statement: 'Write (a + b)^(k+1) as (a + b)^k multiplied by (a + b).', justification: 'One more factor of (a + b) is exactly what raising the index by one means.' },
      { statement: 'By the hypothesis, replace (a + b)^k with its expansion, the sum of kCr a^(k−r) b^r.', justification: 'The hypothesis is used precisely here, on the index k only, and nowhere else in the step.' },
      { statement: 'Multiplying that sum by a raises each first exponent by one; multiplying it by b raises each second exponent by one. This gives two sums.', justification: 'Each term of the bracket is multiplied by each of a and b, by the distributive law.' },
      { statement: 'Collect the two sums term by term. The term in a^(k+1−r) b^r receives kCr from the first sum and kC(r−1) from the second.', justification: 'The same power of b arises from the r-th term multiplied by a and from the (r−1)-th term multiplied by b.' },
      { statement: `Those two coefficients add to the next one: kCr + kC(r−1) = (k+1)Cr. For k = 4 and r = 2 this reads ${ID.left} = ${ID.right}.`, justification: 'Choosing r of k + 1 objects either leaves the new object out, which is kCr ways, or includes it, which is kC(r−1) ways, and those cases are separate and cover everything.' },
      { statement: 'So the collected expression is the sum of (k+1)Cr a^(k+1−r) b^r, which is the claim with k + 1 in place of n.', justification: 'Every coefficient has become the one the claim requires at index k + 1, and the exponents still add to k + 1.' },
    ],
  },
  conclusion: {
    statement: 'The expansion holds for every positive integer n.',
    restsOn: ['base_case', 'inductive_step'],
  },
};

export const V_PROOF_BINOMIAL = proofLayout('v_bin_proof', P_BINOMIAL,
  'The proof of the binomial theorem set out in five labelled parts. The claim states the expansion for a positive integral index. The base case checks n = 1, where both sides come to a + b. The induction hypothesis assumes the expansion for one particular index k. The inductive step multiplies that expansion by one more factor of a + b, collects the terms with the same power of b, and uses the fact that two adjacent coefficients of one row add to a coefficient of the next. The conclusion states the result for every positive integer, resting on the base case and the step together.');

export const C11_BIN_SECTIONS: AuthoredSection[] = [

lesson({ id:'ncert_kemh1_s7_2_binomial_theorem_lesson', sec:'7.2', title:'Binomial Theorem for Positive Integral Indices', page:160,
 prereq:['ncert_kemh1_s6_4','cbse_fo4_induction'],
 assume:['Combinations and nCr','Proof by mathematical induction','Expanding a product of brackets'],
 notIntroduce:[['Negative and fractional indices',''],['Infinite binomial series','']],
 goal:'You will state the binomial theorem for a positive integral index and follow its proof by induction.',
 checks:['Work out nCr for small values.','Say what the five parts of an induction proof are.'],
 ifNot:'Revisit combinations and the induction prerequisite; this theorem is built from both.',
 vocab:[['binomial','A sum of two terms, such as a + b.'],
  ['binomial coefficient','The number nCr multiplying a term in the expansion.'],
  ['general term','The term at index r, carrying nCr with exponents n − r and r.']],
 expl:[`Multiplying (a + b) by itself a few times shows a pattern. ${describeExpansion(E2)} for the square, and ${describeExpansion(E3)} for the cube.`,
  'Two things stay true in every line. Each term has a power of a and a power of b that add to the index, and the coefficients are not arbitrary.',
  `Where do the coefficients come from? Expanding (a + b)^${E3.n} means choosing, from each of the ${E3.n} brackets, either a or b, and adding up every way of doing it. A term with b^2 comes from choosing b in exactly 2 of the ${E3.n} brackets — and the number of ways to do that is ${E3.n}C2, which is ${C(3,2)}. The coefficient is a count, which is why it is a combination.`,
  `That gives the theorem. For a positive integral index n, (a + b)^n is the sum over r from 0 to n of nCr a^(n−r) b^r. The term at index r is nCr a^(n−r) b^r, and the exponents add to n because every bracket contributes exactly one of the two symbols.`,
  `The ends behave without any special rule. The first coefficient is nC0, which is ${C(4,0)}, because there is one way to choose none of the brackets; the last is nCn, also ${C(4,4)}, because there is one way to choose all of them. The same formula gives both.`,
  `Laying the rows out shows the structure: row n holds nC0 up to nCn, and ${E4.n} gives ${E4.terms.map(t=>describeCount(t.coefficient)).join(', ')}.`,
  'Checking a few indices is not a proof, though. The claim is about every positive integer, and no number of verified cases settles a statement with infinitely many instances. The source proves it by induction on the index.',
  'The step turns on one fact about the coefficients: two adjacent ones in a row add to the coefficient below them between them. That is not a coincidence of the numbers. Choosing r objects from k + 1 either leaves the new object out, which can be done kCr ways, or takes it, which can be done kC(r−1) ways — separate cases covering everything, so the counts add.'],
 rep:['The rows of coefficients, and the proof set out in its five parts'],
 visuals:[V_COEFFICIENT_ROWS, V_PROOF_BINOMIAL],
 we:[{id:'s72.we1',prompt:`Expand (a + b)^${E4.n} using the theorem.`,steps:[[`The index is ${E4.n}, so there are ${E4.n+1} terms, with r running from 0 to ${E4.n}.`,'One term for each number of brackets that can contribute b.'],[`The coefficients are ${E4.n}C0 up to ${E4.n}C${E4.n}, which are ${E4.terms.map(t=>describeCount(t.coefficient)).join(', ')}.`,'Each is a count of ways to choose that many brackets.'],[`Writing the exponents so they add to ${E4.n} gives ${describeExpansion(E4)}.`,'The power of a falls as the power of b rises, and the pair always totals the index.']],answer:describeExpansion(E4)},
  {id:'s72.we2',prompt:`In the expansion of (a + b)^${E4.n}, why is the coefficient of ${describeTerm(E4, termAt(E4,2)!)} equal to ${C(4,2)} rather than something else?`,steps:[[`The term with b^2 arises whenever exactly 2 of the ${E4.n} brackets contribute b.`,'The other brackets must then contribute a, which fixes the power of a.'],[`The number of ways to choose which 2 of the ${E4.n} brackets those are is ${E4.n}C2.`,'Order does not matter here: choosing brackets 1 and 3 is the same selection as 3 and 1.'],[`So the coefficient is ${C(4,2)}, a count rather than a quoted number.`,'Every coefficient in the theorem arises this way.']],answer:`${C(4,2)}, because it counts the ways of choosing which 2 brackets give b.`},
  {id:'s72.we3',prompt:'Why does the inductive step need two adjacent coefficients to combine?',steps:[['Multiplying the expansion at index k by one more (a + b) produces two sums, one from multiplying by a and one by b.','Each original term appears twice, with a different exponent raised.'],['Terms with the same power of b must then be collected, and each such term picks up a contribution from each sum.','The term in b^r gets kCr from the a-multiplication and kC(r−1) from the b-multiplication.'],[`Those add to (k+1)Cr — for k = 4 and r = 2, ${ID.left} = ${ID.right} — which is exactly the coefficient the claim needs at index k + 1.`,'Without this the step would stop at two uncollected sums and the claim at k + 1 would not have been reached.']],answer:'Because collecting like terms makes each new coefficient the sum of two old ones.'}],
 g:[{id:'s72.g1',prompt:'How many terms are in the expansion of a binomial with index 6?',hint:'Count the possible values of r.',answer:'7.',why:'r runs from 0 to 6 inclusive, giving one more term than the index.'},
  {id:'s72.g2',prompt:'What is the coefficient at index r = 1 when n = 5?',hint:'It is a combination.',answer:C(5,1),why:'There are 5 ways to choose which single bracket contributes the second symbol.'},
  {id:'s72.g3',prompt:'In a term of the expansion of index 7, the power of a is 3. What is the power of b?',hint:'They add to the index.',answer:'4.',why:'Every bracket contributes exactly one symbol, so the two exponents total the index.'}],
 i:[{id:'s72.i1',prompt:'Write the expansion of a binomial with index 3.',answer:describeExpansion(E3),why:'The coefficients are 3C0 to 3C3 and the exponents add to 3 in every term.'},
  {id:'s72.i2',prompt:'What is the coefficient of the term with b^3 when n = 5?',answer:C(5,3),why:'It counts the ways of choosing which 3 of the 5 brackets contribute b.'},
  {id:'s72.i3',prompt:'Someone writes an expansion of index 4 in which one term is a^2b^3. What is wrong?',answer:'The exponents add to 5, not 4.',why:'Each of the 4 brackets gives exactly one symbol, so the powers must total 4.'},
  {id:'s72.i4',prompt:'Why is the first coefficient always 1, whatever the index?',answer:'Because nC0 is 1.',why:'There is exactly one way to choose none of the brackets, so no special rule is needed for the end.'},
  {id:'s72.i5',prompt:'A proof checks the expansion at n = 1, 2, 3 and 4 and stops. Is the theorem proved?',answer:'No.',why:'Four cases leave infinitely many unchecked; only the inductive step carries the claim to every index.'}],
 td:[{id:'s72.td1',prompt:'Why should counting have anything to do with expanding an algebraic power? The two look like different subjects.',reasoning:'Because the expansion is a counting problem wearing algebraic notation. Multiplying out (a + b)^n means forming every product that takes one symbol from each bracket, and then collecting the ones that look alike. A term with b^r comes from every selection of r brackets that gave b, so its coefficient is the number of such selections — which is nCr by definition, not by analogy. Once that is seen, the coefficients stop being a table to memorise and become the answer to a question about choosing. The same move explains why the ends are 1 and why adjacent coefficients add: both are facts about choosing that happen to show up as facts about algebra.'},
  {id:'s72.td2',prompt:'The base case here is almost trivial, and the inductive step does all the work. Why is the base case needed at all?',reasoning:'Because the step proves an implication, not a statement. It establishes that IF the expansion holds at k THEN it holds at k + 1 — a chain of conditionals that reaches nothing unless something anchors it. Without a verified starting index the chain floats: the same step would equally carry a false claim from one index to the next, since an implication from a false premise tells you nothing. The base case being easy is not the same as it being optional, and a proof that skips it has shown only that the claim is self-propagating, never that it is true.'}],
 summary:`For a positive integral index n, (a + b)^n is the sum over r from 0 to n of nCr a^(n−r) b^r. The coefficients are combinations because each counts the ways of choosing which brackets contribute the second symbol, and the exponents in every term add to n. The source proves the theorem by induction on the index, with the step resting on two adjacent coefficients adding to the next.`,
 next:'The method of induction used here also supports later work on derivatives.',
 t:['State the binomial theorem for a positive integral index and follow its proof by induction.',['Combinations','Induction','Expanding brackets'],['"the coefficient counts something", said before the formula appears'],['Derive one coefficient by counting bracket selections before stating the theorem; it converts the formula from a table into an explanation.','The base case is worth dwelling on precisely because it looks trivial — students who skip it have not seen what the step does and does not prove.'],['Ask why the exponents add to n.'],['Say what the coefficient counts, not just what it equals.'],['Ask whether four verified cases prove the theorem.']]} as unknown as L),

];
