// ===========================================================================
// v0.84.0-c11.19 checkpoint 87 — C11-IND-01, MATHEMATICAL INDUCTION.
//
// POLICY DECISION RECORDED HERE
//
// Induction is taught ONCE, as a standalone CBSE-only required prerequisite
// placed before Chapter 7, rather than embedded separately inside each unit
// that needs it. Three units depend on it — C11-BIN-01, C11-LIM-05 and
// C11-LIM-06 — and embedding would teach the same method three times, where
// it could drift between copies. The decomposition already names induction
// as an independent object, and the provenance architecture already carries
// a CBSE-only source with no NCERT owner.
//
// PROVENANCE IS HONEST
//
// There is no NCERT chapter, section or page for this unit, and none is
// invented. `sourceKind` is `cbse_only`, the official section id is empty,
// and the chapter id is a prerequisite sentinel that is deliberately NOT an
// official chapter record, so the catalogue cannot show it as one.
//
// Assessment status stays FORMATIVE_ONLY and instructional status stays
// REQUIRED_PREREQUISITE. Required does not mean summative.
// ===========================================================================

import type { AuthoredSection } from './authoredSection';
import { type L, makeLesson } from './class11Lesson';
import {
  type InductionProof, examplesProveNothing, naturalsFrom, proofLayout, validateInductionProof,
} from './induction';

/**
 * A sentinel, not an official chapter. It is absent from OFFICIAL_CHAPTERS
 * on purpose, so this lesson can never be counted as a textbook chapter.
 */
export const IND_C11_PREREQUISITE_ID = 'cbse_c11_prerequisite';

const source = (_sec: string, title: string, _page: number) => ({
  officialChapterId: IND_C11_PREREQUISITE_ID,
  sourceKind: 'cbse_only' as const,
  // Empty: there is no NCERT section, and inventing one would be a lie.
  officialSectionId: '',
  cbseEntryId: 'FO-4',
  sectionNumber: '',
  exactTitle: title,
  startPage: 0,
  textbook: 'CBSE Class XI syllabus, Unit II — no NCERT chapter owner',
  sourceReference: 'cbse_fo4',
  inspectionDate: '2026-10-26',
});

const lesson = (l: L): AuthoredSection => makeLesson(l, source);

// --- the canonical proofs, verified by the model ---------------------------

/** A summation identity. The shape the binomial proof will later use. */
export const P_SUM: InductionProof = {
  id: 'ind_sum',
  claim: '1 + 2 + … + n = n(n + 1)/2',
  domain: naturalsFrom(1, 'every natural number n from 1 upwards'),
  baseCase: {
    at: 1, leftValue: 1, rightValue: 1,
    steps: [
      { statement: 'At n = 1 the left side is the single term 1.', justification: 'The sum of the first one natural number has only that one term in it.' },
      { statement: 'The right side is 1 × 2 ÷ 2, which is also 1.', justification: 'Substituting n = 1 into n(n + 1)/2 gives 1 × 2 over 2.' },
    ],
  },
  hypothesis: { assumesAbout: 'k', statement: 'Suppose the formula holds for some particular n = k.', conditional: true },
  inductiveStep: {
    startsFrom: 'k', arrivesAt: 'k+1',
    steps: [
      { statement: 'The sum to k + 1 equals the sum to k, plus the term k + 1.', justification: 'The only difference between the two sums is the one extra term on the end.' },
      { statement: 'By the hypothesis that sum to k is k(k + 1)/2, so the total is k(k + 1)/2 + (k + 1).', justification: 'The hypothesis is used exactly here, and nowhere else in the step.' },
      { statement: 'Taking out the common factor k + 1 gives (k + 1)(k + 2)/2.', justification: 'Both terms contain k + 1; removing it leaves k/2 + 1, which is (k + 2)/2.' },
      { statement: 'That is the formula with k + 1 in place of n.', justification: 'Replacing n by k + 1 in n(n + 1)/2 gives exactly (k + 1)(k + 2)/2.' },
    ],
  },
  conclusion: {
    statement: 'The formula holds for every natural number from 1 upwards.',
    restsOn: ['base_case', 'inductive_step'],
  },
};

/** A divisibility statement, so the method is seen on more than one shape. */
export const P_DIV: InductionProof = {
  id: 'ind_div',
  claim: '3 divides n³ − n',
  domain: naturalsFrom(1, 'every natural number n from 1 upwards'),
  baseCase: {
    at: 1, leftValue: 0, rightValue: 0,
    steps: [
      { statement: 'At n = 1 the expression is 1 − 1, which is 0.', justification: 'Substituting n = 1 into n³ − n gives 1 − 1.' },
      { statement: 'Zero is divisible by 3.', justification: 'Zero is 3 × 0, so 3 goes into it a whole number of times.' },
    ],
  },
  hypothesis: { assumesAbout: 'k', statement: 'Suppose 3 divides k³ − k for some particular k.', conditional: true },
  inductiveStep: {
    startsFrom: 'k', arrivesAt: 'k+1',
    steps: [
      { statement: 'Expanding (k + 1)³ − (k + 1) gives k³ + 3k² + 3k + 1 − k − 1.', justification: 'Cubing the bracket and subtracting the bracket, then collecting the terms.' },
      { statement: 'That simplifies to (k³ − k) + 3(k² + k).', justification: 'The 1 and the −1 cancel, and the remaining 3k² + 3k has a factor of 3.' },
      { statement: 'The first part is divisible by 3 by the hypothesis, and the second has a factor of 3.', justification: 'A sum of two multiples of 3 is itself a multiple of 3.' },
    ],
  },
  conclusion: {
    statement: '3 divides n³ − n for every natural number from 1 upwards.',
    restsOn: ['base_case', 'inductive_step'],
  },
};

/**
 * A powers statement. This is the shape the derivative of a power and the
 * binomial theorem will later lean on — method transfer, not the results
 * themselves, which belong to their own units.
 */
export const P_POWER: InductionProof = {
  id: 'ind_power',
  claim: '2ⁿ ≥ n + 1',
  domain: naturalsFrom(1, 'every natural number n from 1 upwards'),
  baseCase: {
    at: 1, leftValue: 2, rightValue: 2,
    steps: [
      { statement: 'At n = 1 the left side is 2¹, which is 2.', justification: 'A power with exponent 1 is just the base itself.' },
      { statement: 'The right side is 1 + 1, also 2, so the two sides are equal and the claim holds.', justification: 'The claim asks for at least, and equal satisfies at least.' },
    ],
  },
  hypothesis: { assumesAbout: 'k', statement: 'Suppose 2ᵏ ≥ k + 1 for some particular k.', conditional: true },
  inductiveStep: {
    startsFrom: 'k', arrivesAt: 'k+1',
    steps: [
      { statement: 'Doubling both sides of the hypothesis gives 2ᵏ⁺¹ ≥ 2(k + 1).', justification: 'Multiplying an inequality by the positive number 2 keeps its direction.' },
      { statement: '2(k + 1) is 2k + 2, which is at least k + 2 whenever k is at least 0.', justification: 'The difference between them is k, which is never negative here.' },
      { statement: 'So 2ᵏ⁺¹ ≥ k + 2, which is the claim with k + 1 in place of n.', justification: 'Replacing n by k + 1 in n + 1 gives k + 2.' },
    ],
  },
  conclusion: {
    statement: '2ⁿ ≥ n + 1 for every natural number from 1 upwards.',
    restsOn: ['base_case', 'inductive_step'],
  },
};

export const V_PROOF = proofLayout('v_ind_proof', P_SUM,
  'A proof set out in five labelled parts. The claim states that the sum of the first n natural numbers equals n times n plus one over two. The base case checks n equals 1, where both sides come to 1. The induction hypothesis assumes the claim for one particular value k. The inductive step adds the next term and rearranges to reach the same formula with k plus one in place of n. The conclusion states that the two obligations together establish the claim for every natural number from 1 upwards.');

export const CANONICAL_INDUCTION_PROOFS = [P_SUM, P_DIV, P_POWER];

const shape = (p: InductionProof) => validateInductionProof(p).length === 0
  ? 'the proof is complete'
  : 'the proof is incomplete';

export const C11_IND_SECTIONS: AuthoredSection[] = [

lesson({ id:'cbse_fo4_induction_lesson', sec:'', title:'The Principle of Mathematical Induction', page:0,
 assume:['Natural numbers','Algebraic rearrangement','Reading a general formula'],
 notIntroduce:[['The binomial theorem','ncert_kemh1_s7_2'],['The derivative of a power','ncert_kemh1_s12_5']],
 goal:'You will prove a statement about every natural number by checking one case and showing each case carries the next.',
 checks:['Substitute a number into a formula.','Factorise a common term out of two expressions.'], ifNot:'Practise substituting and factorising first; the method here is mostly those two moves used carefully.',
 vocab:[['mathematical induction','A method of proving a statement for every natural number from some starting point onwards.'],
  ['base case','The first value, where the statement is checked directly.'],
  ['induction hypothesis','The assumption that the statement holds for one particular value k.'],
  ['inductive step','The argument that the statement holding at k forces it to hold at k + 1.']],
 expl:['Some statements are claimed for every natural number at once. There are infinitely many of them, so they cannot be checked one by one, however long you keep going.',
  `Checking cases is not a proof. For ${P_SUM.claim}, you can verify n = 1, 2 and 3 and find them all correct — but ${examplesProveNothing([{at:1,holds:true},{at:2,holds:true},{at:3,holds:true}], P_SUM.domain)}`,
  'Induction replaces the infinite checking with two finite obligations. First, show the statement holds at the starting value. Second, show that whenever it holds at some value, it must also hold at the next one.',
  'Meet both and the statement follows for every value from the start onwards. The first obligation gives you one true case; the second turns any true case into the next true case; together they reach every value in turn.',
  'The dominoes picture is useful but incomplete. Lining up dominoes so each would knock the next over does nothing until one is actually pushed, and pushing one does nothing if the spacing fails somewhere down the line. Both obligations are needed, and the proof is the two arguments, not the picture.',
  `The hypothesis is where care is needed. You assume the statement for one particular k — not for every k, which is what is being proved. Writing "${P_SUM.hypothesis.statement}" keeps it conditional; writing that it holds for all k assumes the conclusion.`,
  `Set out in parts, a proof of ${P_SUM.claim} reads: check n = ${P_SUM.baseCase.at}, where both sides come to ${P_SUM.baseCase.leftValue}; assume it at k; add the next term and rearrange to reach the same formula at k + 1; conclude for ${P_SUM.domain.written}.`,
  'This method is worth learning on its own because several later results depend on it. The binomial theorem is proved this way, and a derivative result about powers uses an induction hypothesis in its derivation. Both are for their own lessons; what transfers is the method.'],
 rep:['A proof set out under five headings: claim, base case, induction hypothesis, inductive step, conclusion'],
 visuals:[V_PROOF],
 we:[{id:'ind.we1',prompt:`Prove that ${P_SUM.claim} for ${P_SUM.domain.written}.`,steps:[[`Base case. ${P_SUM.baseCase.steps[0].statement}`,P_SUM.baseCase.steps[0].justification],[P_SUM.baseCase.steps[1].statement,P_SUM.baseCase.steps[1].justification],[`Hypothesis. ${P_SUM.hypothesis.statement}`,'It is assumed for one particular k, not proved for every k; that is what the step will establish.'],[`Step. ${P_SUM.inductiveStep.steps[0].statement}`,P_SUM.inductiveStep.steps[0].justification],[P_SUM.inductiveStep.steps[1].statement,P_SUM.inductiveStep.steps[1].justification],[P_SUM.inductiveStep.steps[2].statement,P_SUM.inductiveStep.steps[2].justification],[P_SUM.inductiveStep.steps[3].statement,P_SUM.inductiveStep.steps[3].justification],[`Conclusion. ${P_SUM.conclusion.statement}`,'Both obligations are met: one case is true, and each true case forces the next.']],answer:`${shape(P_SUM)}: the formula holds for ${P_SUM.domain.written}.`},
  {id:'ind.we2',prompt:`Prove that ${P_DIV.claim} for ${P_DIV.domain.written}.`,steps:[[`Base case. ${P_DIV.baseCase.steps[0].statement}`,P_DIV.baseCase.steps[0].justification],[P_DIV.baseCase.steps[1].statement,P_DIV.baseCase.steps[1].justification],[`Hypothesis. ${P_DIV.hypothesis.statement}`,'Again assumed for one particular k only.'],[`Step. ${P_DIV.inductiveStep.steps[0].statement}`,P_DIV.inductiveStep.steps[0].justification],[P_DIV.inductiveStep.steps[1].statement,P_DIV.inductiveStep.steps[1].justification],[P_DIV.inductiveStep.steps[2].statement,P_DIV.inductiveStep.steps[2].justification],[`Conclusion. ${P_DIV.conclusion.statement}`,'The two obligations are met, so the divisibility holds throughout the range.']],answer:P_DIV.conclusion.statement},
  {id:'ind.we3',prompt:`Prove that ${P_POWER.claim} for ${P_POWER.domain.written}.`,steps:[[`Base case. ${P_POWER.baseCase.steps[0].statement}`,P_POWER.baseCase.steps[0].justification],[P_POWER.baseCase.steps[1].statement,P_POWER.baseCase.steps[1].justification],[`Hypothesis. ${P_POWER.hypothesis.statement}`,'A statement about one particular k, assumed so that the step has something to work from.'],[`Step. ${P_POWER.inductiveStep.steps[0].statement}`,P_POWER.inductiveStep.steps[0].justification],[P_POWER.inductiveStep.steps[1].statement,P_POWER.inductiveStep.steps[1].justification],[P_POWER.inductiveStep.steps[2].statement,P_POWER.inductiveStep.steps[2].justification],[`Conclusion. ${P_POWER.conclusion.statement}`,'This is the shape of argument that later work with powers will reuse.']],answer:P_POWER.conclusion.statement}],
 g:[{id:'ind.g1',prompt:'What two things must an induction proof establish?',hint:'One case, and one implication.',answer:'The base case, and that the statement at k forces it at k + 1.',why:'The first gives one true case and the second turns each true case into the next, so together they reach every value.'},
  {id:'ind.g2',prompt:'A student writes: "Assume the statement is true for all k." What is wrong?',hint:'What is being proved?',answer:'That assumes the conclusion.',why:'The hypothesis must be about one particular k; assuming it for every k is assuming the very thing the proof is meant to establish.'},
  {id:'ind.g3',prompt:'A student checks n = 1 up to n = 20 and calls it proved. Is it?',hint:'How many natural numbers are there?',answer:'No.',why:'Twenty cases leave infinitely many unchecked, and without the inductive step nothing carries the claim past the last one checked.'}],
 i:[{id:'ind.i1',prompt:`In the proof of ${P_SUM.claim}, what is checked in the base case?`,answer:`That both sides equal ${P_SUM.baseCase.leftValue} when n = ${P_SUM.baseCase.at}.`,why:'The base case is a direct substitution, not an assertion that the claim starts off true.'},
  {id:'ind.i2',prompt:'Why must the base case be at the first value of the claimed range?',answer:'Because the chain starts there.',why:'Checking a later value leaves everything before it unsupported, and the step only ever moves forwards.'},
  {id:'ind.i3',prompt:'In the inductive step, where exactly is the hypothesis used?',answer:'At the point where the expression for k is replaced by what the hypothesis says it equals.',why:'If the hypothesis is never used, the step has not connected k to k + 1 and the proof has a gap.'},
  {id:'ind.i4',prompt:'Can a proof conclude from the inductive step alone?',answer:'No.',why:'Without a base case the implication never starts: each case would depend on a previous one that was never established.'}],
 td:[{id:'ind.td1',prompt:'The base case proves one case and the inductive step proves no cases at all, only an implication. Why do the two together prove infinitely many?',reasoning:'Because the implication can be applied repeatedly to whatever the base case supplies. On its own, "if it holds at k then it holds at k + 1" asserts nothing about any actual number; it is a conditional with nothing feeding it. The base case supplies one true case, and the implication converts that into the next, then the next, with no stopping point. Neither part reaches far by itself, which is why removing either breaks the whole thing: an unanchored chain proves nothing, and a single checked case carries nowhere.'}],
 summary:`Mathematical induction proves a statement for every natural number from a starting value by two obligations: check the base case directly, then show the statement at k forces it at k + 1. Checking examples is not a proof — ${examplesProveNothing([{at:1,holds:true},{at:2,holds:true},{at:3,holds:true}], P_SUM.domain)}`,
 next:'Later units use this method to prove the binomial theorem and a result about derivatives of powers.',
 t:['Prove a statement over the natural numbers using a base case and an inductive step.',['Substitution','Factorising'],['"assume for one particular k", never "assume for all k"'],['The hypothesis error is the one to watch for; make students say which single value they are assuming before they write anything.','Show checked examples failing to be a proof before introducing the method, or induction looks like extra ceremony.'],['Ask what the base case actually checks.'],['Write the five headings first and fill them in, so no part can be skipped.'],['Ask where the hypothesis is used in the step.']]} as unknown as L),

];
