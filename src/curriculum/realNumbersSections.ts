// ===========================================================================
// v0.84.0-c10.8 checkpoint 62 — CLASS 10 REAL NUMBERS.
//
// The governing problem here is not mathematical. The rationalised §1.1
// still announces that the chapter will use Euclid's division algorithm in
// §1.2, and that material was removed. An author working from the
// introduction would teach it, and nothing about the resulting lesson would
// look wrong.
//
// So the stale sentence is recorded in the source model as evidence and
// treated as residue, never as instruction. `auditRationalisationLeak`
// enforces the line, and it distinguishes teaching the removed topic from
// naming it in order to exclude it — because a governance note has to be
// able to say what it is excluding.
//
// Every integer quantity is computed by `numberTheory`, exactly. There is no
// floating point anywhere near a divisibility claim.
//
// Source: NCERT Mathematics, Textbook for Class X (Reprint 2026-27), §1.2
// (folio 2) and §1.3 (folio 6). §1.1 is REVIEW and earns no unit of its own;
// its usable context is carried into the first lesson. CBSE 041/241 2026-27
// prescribes proofs of irrationality for root 2, root 3 and root 5.
// ===========================================================================

import type { AuthoredSection } from './authoredSection';
import {
  formatFactorisation, hcfByFactorisation, lcmByFactorisation, primeFactorise,
} from './numberTheory';

export const REAL_NUMBERS_CHAPTER_ID = 'ncert_jemh1_ch01';

const BOOK = 'Mathematics, Textbook for Class X (Reprint 2026-27)';
const SRC = 'https://ncert.nic.in/textbook/pdf/jemh1dd.zip';
const INSPECTED = '2026-10-16';

const source = (sectionNumber: string, exactTitle: string, startPage: number, officialSectionId: string) => ({
  officialChapterId: REAL_NUMBERS_CHAPTER_ID, officialSectionId, sectionNumber, exactTitle,
  startPage, textbook: BOOK, sourceReference: SRC, inspectionDate: INSPECTED,
});

/**
 * The §1.1 disposition, recorded where an author will see it.
 *
 * This is a governance note, not student content. It names the removed topic
 * precisely so the exclusion is documented; `auditRationalisationLeak`
 * recognises it as a diagnosis rather than instruction.
 */
export const SECTION_1_1_DISPOSITION = {
  sectionNumber: '1.1',
  role: 'REVIEW',
  warrantsUnit: false,
  note:
    'The printed §1.1 still advertises that §1.2 will use Euclid\u2019s division algorithm. ' +
    'Rationalisation removed that material, so it is not part of the current scope and is not taught. ' +
    'The source model continues to record the sentence as evidence; only its usable framing — the link ' +
    'back to Class IX real numbers and forward to divisibility — is carried into the first lesson.',
};

// --- canonical integers, factorised once -----------------------------------

export const PAIR_HCF_LCM = { a: 96, b: 404 } as const;
export const PAIR_CONTEXT = { a: 336, b: 54 } as const;
const F = (n: number) => formatFactorisation(primeFactorise(n));
const H = (a: number, b: number) => hcfByFactorisation(a, b);
const L = (a: number, b: number) => lcmByFactorisation(a, b);

const teacher = (objective: string, prereq: string[], lang: string[], notes: string[], checks: string[], support: string[], ext: string[]) => ({
  objective, prerequisiteKnowledge: prereq, modelLanguage: lang, teachingNotes: notes,
  quickChecks: checks, supportForStrugglingLearners: support, extension: ext, materialsNeeded: [],
});

export const C10_SECTION_1_2A: AuthoredSection = {
  contentArtifactId: 'ncert_jemh1_s1_2_fta_lesson',
  contentArtifactVersion: 1,
  source: source('1.2', 'The Fundamental Theorem of Arithmetic', 2, 'ncert_jemh1_s1_2'),
  competencyCandidates: [], competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: [],
    mayAssume: ['Prime and composite numbers from Class IX', 'Writing a number as a product of primes', 'Index notation'],
    mustNotIntroduce: [
      { concept: 'HCF and LCM from prime factorisation', belongsToSection: 'ncert_jemh1_s1_2b' },
      { concept: 'Proofs of irrationality', belongsToSection: 'ncert_jemh1_s1_3' },
    ],
  },
  learningGoal:
    'You will state the Fundamental Theorem of Arithmetic and write a composite number as a product of primes, understanding in what sense that factorisation is unique.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: ['Say what makes a number prime.', 'Write 60 as a product of primes.', 'Read index notation such as 2\u00b3.'],
    ifNotReady: 'Revise primes from Class IX. You already know how to factorise; this chapter is about what the factorisation guarantees.',
  },
  vocabulary: [
    { term: 'prime', meaning: 'A whole number greater than 1 whose only positive factors are 1 and itself.' },
    { term: 'composite', meaning: 'A whole number greater than 1 that is not prime, so it has a factor other than 1 and itself.' },
    { term: 'prime factorisation', meaning: 'A way of writing a number as a product of primes, usually with equal primes collected into powers.' },
    { term: 'Fundamental Theorem of Arithmetic', meaning: 'The result that every composite number is a product of primes, in exactly one way apart from the order.' },
    { term: 'unique', meaning: 'Here: there is only one such collection of primes, however you arrive at it.' },
  ],
  explanation: [
    'You have been factorising numbers into primes since Class IX. What this chapter adds is a guarantee about that process, and the guarantee turns out to carry the whole chapter.',
    'The Fundamental Theorem of Arithmetic says: every composite positive integer can be written as a product of primes, and that factorisation is unique apart from the order in which the primes are written.',
    'Each part of the statement matters. It is about positive integers, and about composite ones \u2014 a prime is already a product of one prime, and 1 is neither prime nor composite and has no factorisation of this kind. Uniqueness is up to order, so 2 \u00d7 3 \u00d7 2 and 2\u00b2 \u00d7 3 are the same factorisation written differently, not two different ones.',
    `Try it on ${PAIR_HCF_LCM.a}. Dividing by 2 repeatedly and then by 3 gives ${F(PAIR_HCF_LCM.a)}. Starting instead from ${PAIR_HCF_LCM.a} = 8 \u00d7 12 and breaking each piece down gives the same collection. The theorem is the promise that this always happens: the route does not matter.`,
    'That promise is why the theorem is worth stating. Without it, two people factorising the same number might reasonably reach different answers, and nothing built on factorisation could be trusted. With it, a number\u2019s primes are a property of the number itself.',
    'This course uses the theorem without proving it. It can be proved, and the textbook discusses it, but the proof is outside what the current curriculum asks of you \u2014 what you are expected to do is state it correctly and use it.',
    'A note on where this chapter is going. The printed introduction announces a method for divisibility that is no longer part of the course, so ignore that sentence; the chapter you are doing uses prime factorisation throughout, first for HCF and LCM and then for proving that certain square roots are irrational.',
  ],
  representations: ['Prime factorisations written as powers, reached by two different routes'],
  visuals: [], visualsById: {},
  workedExamples: [
    {
      id: 's12a.we1',
      prompt: `Write ${PAIR_HCF_LCM.a} as a product of primes, and then do it again starting from a different pair of factors.`,
      steps: [
        { text: `Divide by the smallest prime repeatedly: ${PAIR_HCF_LCM.a} = 2 \u00d7 48 = 2 \u00d7 2 \u00d7 24, and so on down to 3.`, reasoning: 'Taking the smallest prime each time is one systematic route, and it stops when what remains is itself prime.' },
        { text: `Collecting the repeats gives ${F(PAIR_HCF_LCM.a)}.`, reasoning: 'Index notation collects equal primes, which is what makes two orderings visibly the same factorisation.' },
        { text: `Now start from ${PAIR_HCF_LCM.a} = 8 \u00d7 12. Then 8 = 2\u00b3 and 12 = 2\u00b2 \u00d7 3.`, reasoning: 'Neither 8 nor 12 is prime, so each must be broken down further before the factorisation is complete.' },
        { text: `Multiplying those gives 2\u00b3 \u00d7 2\u00b2 \u00d7 3 = ${F(PAIR_HCF_LCM.a)} \u2014 the same collection.`, reasoning: 'The theorem guarantees this agreement; finding it is a check on the arithmetic rather than a discovery about this particular number.' },
      ],
      answer: `${PAIR_HCF_LCM.a} = ${F(PAIR_HCF_LCM.a)}, by either route.`,
    },
    {
      id: 's12a.we2',
      prompt: 'A student writes 60 = 4 \u00d7 15 and stops, calling it the prime factorisation. What is wrong?',
      steps: [
        { text: 'Neither 4 nor 15 is prime: 4 = 2\u00b2 and 15 = 3 \u00d7 5.', reasoning: 'A factorisation is into PRIMES, so every factor must itself have no factors besides 1 and itself.' },
        { text: `Breaking both down gives 60 = ${F(60)}.`, reasoning: 'Now every factor is prime and the process cannot continue, which is how you know the factorisation is complete.' },
        { text: 'The student\u2019s version is a correct factorisation, just not a prime one.', reasoning: '4 \u00d7 15 really does equal 60, so the arithmetic is right and only the stopping point is wrong \u2014 which is why this error survives a quick check.' },
      ],
      answer: `60 = ${F(60)}; 4 and 15 are composite.`,
    },
    {
      id: 's12a.we3',
      prompt: 'Are 2\u00b2 \u00d7 3 \u00d7 5 and 5 \u00d7 2 \u00d7 3 \u00d7 2 different prime factorisations of the same number?',
      steps: [
        { text: 'Both multiply to 60.', reasoning: 'Checking the product first confirms they are factorisations of the same number before the question of uniqueness arises.' },
        { text: 'The second lists the same primes \u2014 two 2s, one 3, one 5 \u2014 in a different order.', reasoning: 'Collecting the repeats turns it into 2\u00b2 \u00d7 3 \u00d7 5, which is the first one exactly.' },
        { text: 'So they are the same factorisation, written differently.', reasoning: 'The theorem\u2019s uniqueness is up to order, so a reordering is not a counterexample to it \u2014 which is precisely what the phrase "apart from the order" is protecting.' },
      ],
      answer: 'The same factorisation; uniqueness is up to order.',
    },
  ],
  guidedPractice: [
    { id: 's12a.g1', prompt: 'Write 540 as a product of primes.', hint: 'Divide by the smallest prime repeatedly.', answer: `${F(540)}.`, rationale: `540 = 2 \u00d7 270 = 2 \u00d7 2 \u00d7 135, and 135 = 27 \u00d7 5 = 3\u00b3 \u00d7 5, giving ${F(540)}.` },
    { id: 's12a.g2', prompt: 'Is 2 \u00d7 9 \u00d7 5 a prime factorisation of 90?', hint: 'Check every factor.', answer: 'No \u2014 9 is composite.', rationale: `9 = 3\u00b2, so the prime factorisation is ${F(90)}. The product is right; the factors are not all prime.` },
    { id: 's12a.g3', prompt: 'Why does the theorem speak about composite numbers rather than all positive integers?', hint: 'Think about 1 and about a prime itself.', answer: 'Because 1 has no prime factorisation and a prime is already one.', rationale: '1 is neither prime nor composite, and a prime such as 7 is trivially a product of the single prime 7, so the interesting claim concerns composites.' },
  ],
  independentPractice: [
    { id: 's12a.i1', prompt: 'Write 1260 as a product of primes.', answer: `${F(1260)}.`, rationale: `1260 = 2\u00b2 \u00d7 315, and 315 = 3\u00b2 \u00d7 35 = 3\u00b2 \u00d7 5 \u00d7 7, giving ${F(1260)}.` },
    { id: 's12a.i2', prompt: 'A claimed factorisation of 84 is 2 \u00d7 6 \u00d7 7. Find the error and correct it.', answer: `6 is composite; 84 = ${F(84)}.`, rationale: '6 = 2 \u00d7 3, so collecting gives 2\u00b2 \u00d7 3 \u00d7 7. The product 2 \u00d7 6 \u00d7 7 is 84, so only the primality of the factors fails.' },
    { id: 's12a.i3', prompt: 'Two students factorise 300 by different routes. Must they agree?', answer: 'Yes, apart from the order.', rationale: `The theorem guarantees it: both will reach ${F(300)} however they start.` },
    { id: 's12a.i4', prompt: 'State the Fundamental Theorem of Arithmetic in your own words.', answer: 'Every composite positive integer is a product of primes, in exactly one way apart from the order.', rationale: 'The three conditions \u2014 positive integer, composite, unique up to order \u2014 all carry weight and should appear.' },
  ],
  misconceptionIds: [], interactivePractice: [],
  reasoningApplication: [
    {
      id: 's12a.td1',
      prompt: 'Why does reordering the prime factors not violate the theorem\u2019s claim of uniqueness?',
      expectedReasoning:
        'Because the theorem claims uniqueness of the COLLECTION of primes, not of the sequence they are written in. Multiplication does not depend on order, so 2 \u00d7 3 \u00d7 2 and 2 \u00d7 2 \u00d7 3 are the same product; collecting repeats into powers makes the sameness visible. The phrase "apart from the order" is in the statement precisely to say that reorderings do not count as different factorisations. What would violate the theorem is a genuinely different set of primes multiplying to the same number, and that never happens.',
    },
    {
      id: 's12a.td2',
      prompt: 'What would go wrong in mathematics if a number could be factorised into primes in two genuinely different ways?',
      expectedReasoning:
        'Anything built on prime factorisation would stop being well defined. The HCF and LCM of two numbers are read off their prime exponents, so two different factorisations could give two different HCFs for the same pair. The irrationality arguments later in this chapter work by comparing how often a prime appears on each side of an equation, and that comparison would mean nothing if the count were not fixed by the number itself. Uniqueness is what makes a number\u2019s primes a property of the number rather than of how you happened to find them.',
    },
  ],
  summary:
    `Every composite positive integer is a product of primes, and that factorisation is unique apart from the order \u2014 the Fundamental Theorem of Arithmetic, which this course uses without proving. Collect equal primes into powers, so ${PAIR_HCF_LCM.a} = ${F(PAIR_HCF_LCM.a)} whichever route you take. A factorisation is complete only when every factor is prime.`,
  nextStep: 'Next you will use those prime powers to find the HCF and LCM of two numbers.',
  teacher: teacher(
    'Students state the theorem accurately and factorise composites, understanding uniqueness up to order.',
    ['Primes and composites', 'Index notation'],
    ['Is every factor prime? Then you are finished.', 'Same primes, different order \u2014 same factorisation.', 'We use this theorem; we do not prove it here.'],
    [
      'The printed introduction still announces a divisibility method that rationalisation removed. Students who read ahead will ask; the honest answer is that the sentence is out of date and the chapter uses prime factorisation instead.',
      'Factorising by two routes in the first worked example is what makes uniqueness concrete. Stated alone it sounds like a formality.',
      'Watch for stopping at a composite factor \u2014 4 \u00d7 15 is a correct factorisation of 60 and a wrong answer to the question asked.',
    ],
    ['Ask why the theorem mentions composite numbers.', 'Ask whether 2 \u00d7 9 \u00d7 5 is a prime factorisation.'],
    ['Have the student circle each factor and tick it only once they have checked it is prime.'],
    ['Ask what would break if factorisation were not unique.'],
  ),
  reviewStatus: 'authored_draft',
};

export const C10_SECTION_1_2B: AuthoredSection = {
  contentArtifactId: 'ncert_jemh1_s1_2_hcf_lcm_lesson',
  contentArtifactVersion: 1,
  source: source('1.2', 'The Fundamental Theorem of Arithmetic', 2, 'ncert_jemh1_s1_2'),
  competencyCandidates: [], competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_jemh1_s1_2'],
    mayAssume: ['The Fundamental Theorem of Arithmetic', 'Prime factorisation with powers', 'HCF and LCM from Class VI'],
    mustNotIntroduce: [{ concept: 'Proofs of irrationality', belongsToSection: 'ncert_jemh1_s1_3' }],
  },
  learningGoal:
    'You will find the HCF and LCM of two numbers from their prime exponents, explain why the minimum and maximum are the right choices, and use the relation HCF \u00d7 LCM = product for two numbers.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: ['Write a number as a product of prime powers.', 'Say what HCF and LCM mean.', 'Compare two exponents of the same prime.'],
    ifNotReady: 'Revise the previous lesson. Everything here is read off prime exponents, so the factorisations must come first.',
  },
  vocabulary: [
    { term: 'HCF', meaning: 'The highest common factor \u2014 the largest number that divides both.' },
    { term: 'LCM', meaning: 'The lowest common multiple \u2014 the smallest number both divide into.' },
    { term: 'exponent', meaning: 'The power a prime is raised to in a factorisation, recording how many times it appears.' },
    { term: 'divides', meaning: 'One number divides another when the division leaves no remainder.' },
  ],
  explanation: [
    'Uniqueness of prime factorisation makes a number\u2019s primes a fixed property of it, and that is what lets HCF and LCM be read off rather than searched for.',
    'Start from what divisibility means in terms of primes. A number d divides n exactly when every prime in d appears in n at least as often. So 2\u00b2 divides 2\u2075 \u00d7 3 because 5 is at least 2, and 2\u2076 does not.',
    'A common factor of a and b must therefore use each prime no more often than either one has it \u2014 so no more than the SMALLER of the two exponents. The largest such number takes exactly that minimum for every shared prime, and that is the HCF. Taking the minimum is not a rule to remember; it is forced by what dividing both means.',
    'A common multiple has to be divisible by both, so it must contain each prime at least as often as either one has it \u2014 at least the LARGER exponent. The smallest such number takes exactly that maximum, and that is the LCM. A prime appearing in only one number still appears, with its exponent, because the multiple must be divisible by that number too.',
    `Take ${PAIR_HCF_LCM.a} and ${PAIR_HCF_LCM.b}. Their factorisations are ${F(PAIR_HCF_LCM.a)} and ${F(PAIR_HCF_LCM.b)}. The only shared prime is 2, with exponents 5 and 2, so the HCF is 2\u00b2 = ${H(PAIR_HCF_LCM.a, PAIR_HCF_LCM.b)}. The LCM takes the maximum of every prime appearing in either, giving ${L(PAIR_HCF_LCM.a, PAIR_HCF_LCM.b)}.`,
    `For two numbers there is a shortcut worth knowing: HCF \u00d7 LCM = the product of the numbers. Here ${H(PAIR_HCF_LCM.a, PAIR_HCF_LCM.b)} \u00d7 ${L(PAIR_HCF_LCM.a, PAIR_HCF_LCM.b)} = ${PAIR_HCF_LCM.a * PAIR_HCF_LCM.b}, which is ${PAIR_HCF_LCM.a} \u00d7 ${PAIR_HCF_LCM.b}. It works because for each prime, the minimum and the maximum exponent are the two original exponents in some order, so adding them returns the original total.`,
    'That reasoning also shows why the relation is about TWO numbers. With three, the minimum and maximum no longer account for a middle exponent: for 4, 6 and 15 the HCF is 1 and the LCM is 60, and 1 \u00d7 60 is nowhere near 360. The identity does not extend.',
  ],
  representations: ['Two factorisations with their exponents compared prime by prime'],
  visuals: [], visualsById: {},
  workedExamples: [
    {
      id: 's12b.we1',
      prompt: `Find the HCF and LCM of ${PAIR_HCF_LCM.a} and ${PAIR_HCF_LCM.b} from their prime factorisations.`,
      steps: [
        { text: `Factorise both: ${PAIR_HCF_LCM.a} = ${F(PAIR_HCF_LCM.a)} and ${PAIR_HCF_LCM.b} = ${F(PAIR_HCF_LCM.b)}.`, reasoning: 'Everything that follows is read from these exponents, so an error here would propagate into both answers.' },
        { text: 'The only prime in both is 2, with exponents 5 and 2.', reasoning: '3 appears only in the first and 101 only in the second, so neither can be part of a common factor.' },
        { text: `The HCF takes the minimum: 2\u00b2 = ${H(PAIR_HCF_LCM.a, PAIR_HCF_LCM.b)}.`, reasoning: 'Any higher power of 2 would fail to divide the second number, which has only two factors of 2.' },
        { text: `The LCM takes the maximum of every prime in either: 2\u2075 \u00d7 3 \u00d7 101 = ${L(PAIR_HCF_LCM.a, PAIR_HCF_LCM.b)}.`, reasoning: 'A common multiple must be divisible by both, so it needs the 3 from the first and the 101 from the second as well as the larger power of 2.' },
        { text: `Check: ${H(PAIR_HCF_LCM.a, PAIR_HCF_LCM.b)} \u00d7 ${L(PAIR_HCF_LCM.a, PAIR_HCF_LCM.b)} = ${PAIR_HCF_LCM.a * PAIR_HCF_LCM.b} = ${PAIR_HCF_LCM.a} \u00d7 ${PAIR_HCF_LCM.b}.`, reasoning: 'The relation holds for two numbers, so it is a free check on both answers at once.' },
      ],
      answer: `HCF ${H(PAIR_HCF_LCM.a, PAIR_HCF_LCM.b)}, LCM ${L(PAIR_HCF_LCM.a, PAIR_HCF_LCM.b)}.`,
    },
    {
      id: 's12b.we2',
      prompt: `Two ribbons of length ${PAIR_CONTEXT.a} cm and ${PAIR_CONTEXT.b} cm are to be cut into equal pieces, as long as possible, with none left over. How long is each piece, and how many are there?`,
      steps: [
        { text: 'A piece length must divide both ribbons exactly, and we want the largest such length \u2014 that is the HCF.', reasoning: 'Translating the situation into "divides both, as large as possible" is what identifies HCF rather than LCM here.' },
        { text: `${PAIR_CONTEXT.a} = ${F(PAIR_CONTEXT.a)} and ${PAIR_CONTEXT.b} = ${F(PAIR_CONTEXT.b)}.`, reasoning: 'Both factorisations are needed before any exponent can be compared.' },
        { text: `Shared primes are 2 and 3, with minimum exponents 1 and 1, so the HCF is ${H(PAIR_CONTEXT.a, PAIR_CONTEXT.b)} cm.`, reasoning: `The first has 2\u2074 and the second 2\u00b9, so only one factor of 2 is common; similarly 3\u00b9 against 3\u00b3.` },
        { text: `The pieces number ${PAIR_CONTEXT.a} / ${H(PAIR_CONTEXT.a, PAIR_CONTEXT.b)} = ${PAIR_CONTEXT.a / H(PAIR_CONTEXT.a, PAIR_CONTEXT.b)} and ${PAIR_CONTEXT.b} / ${H(PAIR_CONTEXT.a, PAIR_CONTEXT.b)} = ${PAIR_CONTEXT.b / H(PAIR_CONTEXT.a, PAIR_CONTEXT.b)}, so ${PAIR_CONTEXT.a / H(PAIR_CONTEXT.a, PAIR_CONTEXT.b) + PAIR_CONTEXT.b / H(PAIR_CONTEXT.a, PAIR_CONTEXT.b)} pieces in all.`, reasoning: 'Both divisions come out whole, which confirms the length really does divide each ribbon with nothing left.' },
      ],
      answer: `${H(PAIR_CONTEXT.a, PAIR_CONTEXT.b)} cm each, ${PAIR_CONTEXT.a / H(PAIR_CONTEXT.a, PAIR_CONTEXT.b) + PAIR_CONTEXT.b / H(PAIR_CONTEXT.a, PAIR_CONTEXT.b)} pieces.`,
    },
    {
      id: 's12b.we3',
      prompt: 'The HCF of two numbers is 1 and their LCM is 60. Could the numbers be 4, 6 and 15?',
      steps: [
        { text: 'That is three numbers, and the relation HCF \u00d7 LCM = product is stated for two.', reasoning: 'Checking how many numbers are involved comes before applying any identity about them.' },
        { text: 'For 4, 6 and 15 the HCF is indeed 1 and the LCM is indeed 60.', reasoning: 'No prime divides all three, and taking each prime\u2019s maximum exponent gives 2\u00b2 \u00d7 3 \u00d7 5 = 60.' },
        { text: 'But 1 \u00d7 60 = 60, while 4 \u00d7 6 \u00d7 15 = 360.', reasoning: 'The identity fails, and by a wide margin, so it is not a near miss caused by rounding or a special case.' },
        { text: 'The relation does not extend to three numbers.', reasoning: 'With two numbers the minimum and maximum exponents ARE the two originals, so they sum correctly; with three, a middle exponent is simply dropped.' },
      ],
      answer: 'No \u2014 the relation holds for two numbers only.',
    },
  ],
  guidedPractice: [
    { id: 's12b.g1', prompt: 'Find the HCF of 6 and 20 from prime exponents.', hint: 'Which primes are in both?', answer: `${H(6, 20)}.`, rationale: `6 = ${F(6)} and 20 = ${F(20)}. Only 2 is shared, with minimum exponent 1, so the HCF is 2.` },
    { id: 's12b.g2', prompt: 'Find the LCM of 6 and 20.', hint: 'Take the maximum of every prime in either.', answer: `${L(6, 20)}.`, rationale: `Maximum exponents give 2\u00b2 \u00d7 3 \u00d7 5 = 60, and 2 \u00d7 60 = 120 = 6 \u00d7 20 confirms it.` },
    { id: 's12b.g3', prompt: 'Why does the HCF take the minimum exponent rather than the maximum?', hint: 'What must a common factor divide?', answer: 'Because it must divide both, and the smaller exponent is the most either can supply.', rationale: 'Taking the larger would give a number that does not divide the one with fewer copies of that prime, so it would not be a common factor at all.' },
  ],
  independentPractice: [
    { id: 's12b.i1', prompt: 'Find the HCF and LCM of 510 and 92.', answer: `HCF ${H(510, 92)}, LCM ${L(510, 92)}.`, rationale: `510 = ${F(510)} and 92 = ${F(92)}. Only 2 is shared with minimum exponent 1; the LCM takes every prime at its maximum.` },
    { id: 's12b.i2', prompt: 'The HCF of two numbers is 12 and their LCM is 180. If one number is 36, find the other.', answer: '60.', rationale: 'For two numbers HCF \u00d7 LCM = their product, so 12 \u00d7 180 = 2160 and the other number is 2160 / 36 = 60.' },
    { id: 's12b.i3', prompt: 'Two bells ring every 12 and 18 minutes. If they ring together now, when next?', answer: `In ${L(12, 18)} minutes.`, rationale: `A time when both ring is a common multiple, and the next one is the lowest: 12 = ${F(12)}, 18 = ${F(18)}, maximum exponents give ${L(12, 18)}.` },
    { id: 's12b.i4', prompt: 'A prime appears in one number but not the other. Does it appear in the HCF? In the LCM?', answer: 'Not in the HCF; yes in the LCM.', rationale: 'Its minimum exponent across the two is 0, so it is absent from the HCF, but its maximum is positive, so the LCM must contain it to be divisible by that number.' },
  ],
  misconceptionIds: [], interactivePractice: [],
  reasoningApplication: [
    {
      id: 's12b.td1',
      prompt: 'Explain, in terms of divisibility, why the LCM takes the maximum exponent of every prime appearing in either number.',
      expectedReasoning:
        'A common multiple must be divisible by both numbers, and one number divides another exactly when every prime it contains appears in the other at least as often. So the multiple needs each prime at least as many times as whichever number has it more often \u2014 that is the maximum. Taking fewer would fail to be divisible by that number; taking more would still be a common multiple but a larger one, and the LCM is the smallest. A prime present in only one number still appears, because the multiple has to be divisible by that number too.',
    },
    {
      id: 's12b.td2',
      prompt: 'Why does HCF \u00d7 LCM = product hold for two numbers but not for three?',
      expectedReasoning:
        'For each prime, the two numbers have two exponents, and the minimum and the maximum of two values are just those two values in some order \u2014 so adding the HCF\u2019s exponent to the LCM\u2019s returns the sum of the originals, which is what the product needs. With three numbers there are three exponents, and the minimum and maximum capture only two of them; the middle one is dropped entirely. The witness is 4, 6 and 15, where the HCF is 1 and the LCM is 60, giving 60 against a product of 360.',
    },
  ],
  summary:
    `Divisibility in terms of primes decides everything here: the HCF takes the MINIMUM exponent of each shared prime, because a common factor can use no more than either number supplies, and the LCM takes the MAXIMUM of every prime in either, because a common multiple must contain enough of each. For ${PAIR_HCF_LCM.a} and ${PAIR_HCF_LCM.b} this gives ${H(PAIR_HCF_LCM.a, PAIR_HCF_LCM.b)} and ${L(PAIR_HCF_LCM.a, PAIR_HCF_LCM.b)}. For TWO numbers, HCF \u00d7 LCM equals the product \u2014 a useful check, and one that fails for three.`,
  nextStep: 'Next you will use prime factorisation to prove that certain square roots are irrational.',
  teacher: teacher(
    'Students compute HCF and LCM from prime exponents and justify the minimum and maximum choices.',
    ['Prime factorisation with powers', 'Meaning of HCF and LCM'],
    ['What must a common factor divide?', 'Minimum for HCF, maximum for LCM \u2014 and say why.', 'Two numbers only, for the product relation.'],
    [
      'Derive the minimum and maximum from divisibility rather than stating them. Students who learn them as a rule apply them confidently in the wrong direction when a problem is phrased unusually.',
      'The three-number counterexample is worth the time: the identity is exactly the kind of thing students over-extend.',
      'The product relation doubles as a check on both answers, which is worth pointing out as a habit.',
    ],
    ['Ask why the HCF takes the smaller exponent.', 'Ask whether 1 \u00d7 60 = 4 \u00d7 6 \u00d7 15.'],
    ['Have the student write both factorisations in a column, aligned by prime, before comparing anything.'],
    ['Ask what the HCF is when the two numbers share no prime at all.'],
  ),
  reviewStatus: 'authored_draft',
};

export const C10_SECTION_1_3A: AuthoredSection = {
  contentArtifactId: 'ncert_jemh1_s1_3_root2_proof_lesson',
  contentArtifactVersion: 1,
  source: source('1.3', 'Revisiting Irrational Numbers', 6, 'ncert_jemh1_s1_3'),
  competencyCandidates: [], competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_jemh1_s1_2'],
    mayAssume: [
      'Irrational numbers from Class IX',
      'Proof by contradiction from Class IX',
      'The Fundamental Theorem of Arithmetic',
      'The result that if a prime divides a square it divides the number',
    ],
    mustNotIntroduce: [{ concept: 'Irrationality of root 3, root 5 and combinations', belongsToSection: 'ncert_jemh1_s1_3b' }],
  },
  learningGoal:
    'You will prove that \u221a2 is irrational by contradiction, and say exactly which step the lowest-terms assumption makes possible.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: [
      'Say what it means for a number to be rational.',
      'Write a fraction in lowest terms.',
      'Recall the shape of a proof by contradiction from Class IX.',
    ],
    ifNotReady: 'Revise rational and irrational numbers from Class IX. This lesson deepens an argument you have already met rather than introducing one.',
  },
  vocabulary: [
    { term: 'rational number', meaning: 'A number that can be written as a / b with a and b integers and b not zero.' },
    { term: 'irrational number', meaning: 'A real number that cannot be written in that form.' },
    { term: 'lowest terms', meaning: 'A fraction whose numerator and denominator share no common factor other than 1.' },
    { term: 'proof by contradiction', meaning: 'Assuming the opposite of what you want, deriving something impossible, and concluding the assumption was false.' },
    { term: 'divides', meaning: 'One number divides another when the division leaves no remainder.' },
  ],
  explanation: [
    'You met irrational numbers in Class IX, and you have used proof by contradiction there too, so neither idea is new. What is new here is the tool: the Fundamental Theorem of Arithmetic now does the work, and that makes the same argument extend far beyond the one case.',
    'The tool is a consequence of unique factorisation, and this course uses it as a result rather than proving it: if a prime p divides a\u00b2, then p divides a. In factorisation terms, a\u00b2 has every prime of a appearing twice as often, so a prime in a\u00b2 must already have been in a.',
    'Now the proof. Suppose, for contradiction, that \u221a2 is rational. Then \u221a2 = a / b for integers a and b with b not zero \u2014 and, crucially, we may choose the fraction in LOWEST TERMS, so a and b share no common factor other than 1. Every rational number has such a form, so assuming it costs nothing.',
    'Squaring gives 2 = a\u00b2 / b\u00b2, so a\u00b2 = 2b\u00b2. The right-hand side is 2 times an integer, so 2 divides a\u00b2. By the result above, 2 divides a.',
    'Write a = 2k for some integer k. Substituting gives 4k\u00b2 = 2b\u00b2, so b\u00b2 = 2k\u00b2. By the same reasoning, 2 divides b\u00b2 and therefore 2 divides b.',
    'So 2 divides both a and b. But we chose them with no common factor other than 1, and 2 is a common factor. That is the contradiction, and it is the lowest-terms assumption that produces it \u2014 without that condition, a and b sharing a factor of 2 would be unremarkable and the argument would simply stop.',
    'Since assuming \u221a2 rational forces an impossibility, the assumption is false: \u221a2 is irrational. Notice what the proof did NOT do. It did not compute decimals, and no amount of computing would help \u2014 a decimal expansion can be examined to a million places without settling whether it ever repeats.',
  ],
  representations: ['The contradiction chain, from assumption to impossible conclusion'],
  visuals: [], visualsById: {},
  workedExamples: [
    {
      id: 's13a.we1',
      prompt: 'Prove that \u221a2 is irrational.',
      steps: [
        { text: 'Suppose, for contradiction, that \u221a2 is rational, so \u221a2 = a / b with a and b integers, b \u2260 0, and the fraction in lowest terms.', reasoning: 'Assuming the opposite is the opening move of a contradiction proof, and lowest terms is available because every rational has such a form.' },
        { text: 'Square both sides: 2 = a\u00b2 / b\u00b2, so a\u00b2 = 2b\u00b2.', reasoning: 'Squaring removes the root and turns a statement about \u221a2 into one about integers, where divisibility arguments are available.' },
        { text: 'The right side is 2 times an integer, so 2 divides a\u00b2; and since 2 is prime, 2 divides a.', reasoning: 'This is the lemma doing its work \u2014 without it, knowing 2 divides a\u00b2 would say nothing about a itself.' },
        { text: 'So a = 2k for some integer k. Substituting: (2k)\u00b2 = 2b\u00b2, that is 4k\u00b2 = 2b\u00b2, so b\u00b2 = 2k\u00b2.', reasoning: 'Replacing a by what divisibility gave us is what pushes the same argument onto b.' },
        { text: 'By the same reasoning, 2 divides b\u00b2 and therefore 2 divides b.', reasoning: 'The lemma applies identically, since b\u00b2 is now also twice an integer.' },
        { text: 'So 2 divides both a and b, contradicting that they share no common factor other than 1.', reasoning: 'The contradiction is with the choice of lowest terms, which is exactly why that condition had to be stated at the start.' },
        { text: 'The assumption is therefore false, and \u221a2 is irrational.', reasoning: 'A supposition leading to an impossibility cannot hold, which is the whole structure of proof by contradiction.' },
      ],
      answer: '\u221a2 is irrational.',
    },
    {
      id: 's13a.we2',
      prompt: 'A student writes the same proof but omits "in lowest terms". Where does their argument fail?',
      steps: [
        { text: 'Every step still holds up to "2 divides both a and b".', reasoning: 'Squaring, the lemma and the substitution never used the lowest-terms condition, so nothing before this point is affected.' },
        { text: 'But without that condition, 2 dividing both is not a contradiction at all.', reasoning: 'Plenty of fractions have an even numerator and denominator \u2014 4/6 for instance \u2014 so the conclusion is simply a fact about this representation.' },
        { text: 'The argument stops with a true statement and no impossibility.', reasoning: 'A contradiction proof needs something impossible, and "a and b are both even" is perfectly possible unless we have ruled it out in advance.' },
        { text: 'So the lowest-terms choice is load-bearing, not tidiness.', reasoning: 'It is the only assumption the final step contradicts, which makes it the hinge of the entire proof.' },
      ],
      answer: 'Without lowest terms there is no contradiction; the proof does not conclude.',
    },
    {
      id: 's13a.we3',
      prompt: 'Why is computing \u221a2 to many decimal places not a proof of irrationality?',
      steps: [
        { text: 'A rational number has a decimal expansion that either terminates or eventually repeats.', reasoning: 'So irrationality is a claim about the whole infinite expansion, not about any finite part of it.' },
        { text: 'Any computation shows finitely many places.', reasoning: 'A pattern could begin after the last place computed, and no finite check can rule that out.' },
        { text: 'Seeing no repetition is therefore evidence, not proof.', reasoning: 'It is consistent with irrationality and also with a very long repeating block, so it does not distinguish the two.' },
        { text: 'The contradiction argument settles it in finitely many steps instead.', reasoning: 'It reasons about what rationality would force, rather than inspecting the number, which is why it can reach a definite conclusion.' },
      ],
      answer: 'A finite computation cannot rule out repetition beginning later; proof is needed.',
    },
  ],
  guidedPractice: [
    { id: 's13a.g1', prompt: 'In the proof, which assumption does the final step contradict?', hint: 'What was chosen at the very start?', answer: 'That a and b share no common factor other than 1.', rationale: 'The proof shows 2 divides both, which is impossible only because they were chosen in lowest terms.' },
    { id: 's13a.g2', prompt: 'From a\u00b2 = 2b\u00b2, why may we conclude that a is even?', hint: 'Which result about primes is being used?', answer: 'Because 2 divides a\u00b2 and 2 is prime, so 2 divides a.', rationale: 'Without that result, a\u00b2 being even would not by itself tell us anything about a.' },
    { id: 's13a.g3', prompt: 'Is proof by contradiction new in Class 10?', hint: 'Where did you meet \u221a2 before?', answer: 'No \u2014 you used it in Class IX.', rationale: 'What is new is the tool: unique factorisation now supplies the divisibility step, which lets the same structure handle other square roots.' },
  ],
  independentPractice: [
    { id: 's13a.i1', prompt: 'Complete the step: a\u00b2 = 2b\u00b2 shows 2 divides a\u00b2, therefore ___.', answer: '2 divides a.', rationale: 'The prime-divides-a-square result applies, since 2 is prime. Concluding anything about b at this stage would be premature.' },
    { id: 's13a.i2', prompt: 'Why is the assumption b \u2260 0 needed?', answer: 'Because a / b is not a number when b is 0.', rationale: 'Rationality means being expressible as a quotient of integers with a non-zero denominator, so the condition is part of the definition being assumed.' },
    { id: 's13a.i3', prompt: 'A student says the proof shows a and b are both even, so \u221a2 is irrational. What is missing?', answer: 'The contradiction with lowest terms.', rationale: 'Both being even is only impossible because they were chosen sharing no factor. Stating the consequence without the conflict leaves the proof unfinished.' },
    { id: 's13a.i4', prompt: 'Which earlier result does the whole proof depend on?', answer: 'That if a prime divides a square, it divides the number.', rationale: 'It is used twice, once for a and once for b, and the argument has no divisibility step without it.' },
  ],
  misconceptionIds: [], interactivePractice: [],
  reasoningApplication: [
    {
      id: 's13a.td1',
      prompt: 'Why must the rational form be chosen in lowest terms? Describe precisely what the proof would and would not establish without it.',
      expectedReasoning:
        'Every step up to "2 divides both a and b" works regardless, so without the condition the proof would still establish that any representation of \u221a2 as a fraction has an even numerator and an even denominator. That is true and useless: it is simply a property of such a representation, with nothing impossible about it. The contradiction only appears because we fixed in advance that a and b share no factor, so finding a shared factor of 2 is a conflict with our own choice. The lowest-terms assumption is the one the final step contradicts, which makes it the hinge rather than a tidying detail.',
    },
    {
      id: 's13a.td2',
      prompt: 'The proof uses the result that a prime dividing a square divides the number. Why would the argument collapse if that were only true for 2?',
      expectedReasoning:
        'For \u221a2 alone it would be enough \u2014 the argument only ever applies it with p = 2. But the value of the result is that it holds for every prime, which is what lets the identical structure prove \u221a3 and \u221a5 irrational by changing nothing but the prime. If it were special to 2, each new square root would need its own separate argument and there would be no general method. The result comes from unique factorisation, which is a fact about all primes, so the generality is not a bonus but the reason the tool was worth establishing.',
    },
  ],
  summary:
    'Suppose \u221a2 = a / b in LOWEST TERMS. Squaring gives a\u00b2 = 2b\u00b2, so 2 divides a\u00b2 and hence a; writing a = 2k gives b\u00b2 = 2k\u00b2, so 2 divides b as well. But a and b were chosen with no common factor, and 2 is one \u2014 the contradiction. The lowest-terms condition is what makes the final step impossible rather than merely true, and the prime-divides-a-square result is what supplies each divisibility step.',
  nextStep: 'Next you will run the same argument for other square roots and for numbers built from them.',
  teacher: teacher(
    'Students reproduce the contradiction proof for \u221a2 and identify the role of the lowest-terms condition.',
    ['Rational and irrational numbers', 'Proof by contradiction', 'The prime-divides-a-square result'],
    ['What are we assuming, and what will contradict it?', 'Why does 2 dividing a\u00b2 tell us about a?', 'You have used contradiction before \u2014 what is new is the tool.'],
    [
      'The second worked example, omitting lowest terms, is worth as much as the proof. A condition students cannot locate in the argument is one they will drop under pressure.',
      'Say explicitly that neither irrationality nor contradiction is new. Class IX covered both, and claiming novelty misrepresents what they already have.',
      'Watch for the proof being recited as symbols. Asking which assumption the last line contradicts separates reproduction from understanding.',
    ],
    ['Ask which assumption the final step contradicts.', 'Ask why decimals cannot settle the question.'],
    ['Have the student write the assumption on its own line and return to it at the end.'],
    ['Ask whether the same proof structure would work for \u221a7.'],
  ),
  reviewStatus: 'authored_draft',
};

export const C10_SECTION_1_3B: AuthoredSection = {
  contentArtifactId: 'ncert_jemh1_s1_3_more_irrationals_lesson',
  contentArtifactVersion: 1,
  source: source('1.3', 'Revisiting Irrational Numbers', 6, 'ncert_jemh1_s1_3'),
  competencyCandidates: [], competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_jemh1_s1_3'],
    mayAssume: ['The contradiction proof for \u221a2', 'The prime-divides-a-square result', 'Closure of the rationals under addition and multiplication'],
    mustNotIntroduce: [{ concept: 'A required proof for \u221ap for general prime p', belongsToSection: 'enrichment_only' }],
  },
  learningGoal:
    'You will prove that \u221a3 and \u221a5 are irrational by the same contradiction argument, and prove that numbers such as 3 + 2\u221a5 are irrational by reducing them to that case.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: ['Reproduce the contradiction proof for \u221a2.', 'Say what lowest terms contributes to it.', 'Add and multiply two rational numbers.'],
    ifNotReady: 'Revise the previous lesson. Everything here is that argument applied again, so it must be secure first.',
  },
  vocabulary: [
    { term: 'closure', meaning: 'A set is closed under an operation when combining two of its members always gives a member \u2014 the rationals are closed under addition and multiplication.' },
    { term: 'reduce to a known case', meaning: 'Showing that a new claim would follow from, or contradict, one already proved.' },
  ],
  explanation: [
    'The \u221a2 argument used the number 2 only through one property: it is prime, so the prime-divides-a-square result applies to it. Any prime has that property, which is why the same proof works again.',
    'For \u221a3, suppose \u221a3 = a / b in lowest terms. Squaring gives a\u00b2 = 3b\u00b2, so 3 divides a\u00b2 and hence a. Writing a = 3k gives 9k\u00b2 = 3b\u00b2, so b\u00b2 = 3k\u00b2, and 3 divides b as well \u2014 contradicting lowest terms.',
    'Changing 2 to 3 is not mechanical substitution: the step from 9k\u00b2 = 3b\u00b2 to b\u00b2 = 3k\u00b2 divides by 3 where the \u221a2 proof divided by 2, and it is worth checking that the arithmetic really works out rather than assuming it will. The same argument runs for \u221a5, with 25k\u00b2 = 5b\u00b2 giving b\u00b2 = 5k\u00b2.',
    'This course asks you to prove irrationality for \u221a2, \u221a3 and \u221a5. The textbook also discusses the general result for \u221ap with p prime; that generality explains WHY the three proofs look alike, and it is worth understanding, but reproducing a proof for arbitrary p is not something you are required to do.',
    'Numbers like 3 + 2\u221a5 need a different move, because there is nothing to square usefully. Instead, assume the opposite and rearrange until a known irrational is left equal to something rational.',
    'Suppose 3 + 2\u221a5 were rational, say equal to r. Then 2\u221a5 = r \u2212 3, so \u221a5 = (r \u2212 3) / 2. The right-hand side is built from rationals by subtraction and division by 2, and the rationals are closed under those, so it is rational. That makes \u221a5 rational, which we have just proved false.',
    'So the method is: isolate the irrational part, and show the remaining expression would have to be rational. It reduces a new claim to one already settled, which is why this lesson depends on the last.',
  ],
  representations: ['The same contradiction chain, run with a different prime'],
  visuals: [], visualsById: {},
  workedExamples: [
    {
      id: 's13b.we1',
      prompt: 'Prove that \u221a3 is irrational.',
      steps: [
        { text: 'Suppose \u221a3 is rational, so \u221a3 = a / b with a and b integers, b \u2260 0, and in lowest terms.', reasoning: 'The same opening as before, and the lowest-terms condition is again what the final step will contradict.' },
        { text: 'Squaring gives 3 = a\u00b2 / b\u00b2, so a\u00b2 = 3b\u00b2.', reasoning: 'Clearing the denominator turns the claim into a divisibility statement about integers.' },
        { text: '3 divides a\u00b2, and 3 is prime, so 3 divides a.', reasoning: 'The prime-divides-a-square result applies to 3 exactly as it did to 2, because it holds for every prime.' },
        { text: 'Write a = 3k. Then (3k)\u00b2 = 3b\u00b2, that is 9k\u00b2 = 3b\u00b2, so b\u00b2 = 3k\u00b2.', reasoning: 'Dividing both sides by 3 is what leaves b\u00b2 as three times an integer \u2014 the step where the prime being 3 rather than 2 actually matters.' },
        { text: 'So 3 divides b\u00b2 and therefore 3 divides b.', reasoning: 'The prime-divides-a-square result applies again, now to b, because b\u00b2 has just been shown to be three times an integer.' },
        { text: '3 divides both a and b, contradicting lowest terms, so \u221a3 is irrational.', reasoning: 'The contradiction is with the choice made at the start, exactly as in the \u221a2 proof.' },
      ],
      answer: '\u221a3 is irrational.',
    },
    {
      id: 's13b.we2',
      prompt: 'Prove that \u221a5 is irrational, and say which step differs from the \u221a3 proof.',
      steps: [
        { text: 'Suppose \u221a5 = a / b in lowest terms. Squaring gives a\u00b2 = 5b\u00b2.', reasoning: 'Identical in form; only the prime has changed.' },
        { text: '5 divides a\u00b2, and 5 is prime, so 5 divides a. Write a = 5k.', reasoning: 'The result holds for 5 as for any prime, which is why no new justification is needed.' },
        { text: 'Then 25k\u00b2 = 5b\u00b2, so b\u00b2 = 5k\u00b2, and 5 divides b.', reasoning: 'Here the squared factor is 25 rather than 9, and dividing by 5 leaves 5k\u00b2 \u2014 the arithmetic that has to be checked rather than assumed.' },
        { text: '5 divides both a and b, contradicting lowest terms.', reasoning: 'The same conflict as before closes the proof.' },
        { text: 'The only difference is the arithmetic in the substitution step.', reasoning: 'The structure is identical because it depends only on the prime-divides-a-square result, which is indifferent to which prime is used.' },
      ],
      answer: '\u221a5 is irrational; only the substitution arithmetic differs.',
    },
    {
      id: 's13b.we3',
      prompt: 'Prove that 3 + 2\u221a5 is irrational.',
      steps: [
        { text: 'Suppose 3 + 2\u221a5 is rational, equal to some rational r.', reasoning: 'Squaring would not help here, so the plan is to isolate \u221a5 and reach a claim already known to be false.' },
        { text: 'Then 2\u221a5 = r \u2212 3, so \u221a5 = (r \u2212 3) / 2.', reasoning: 'Each rearrangement is reversible, so the new equation holds exactly when the assumed one does.' },
        { text: 'r \u2212 3 is rational, and dividing a rational by 2 gives a rational.', reasoning: 'The rationals are closed under subtraction and under division by a non-zero rational, so the right-hand side cannot escape being rational.' },
        { text: 'So \u221a5 would be rational, which the previous example disproved.', reasoning: 'This is the reduction: the new assumption forces a statement already shown impossible.' },
        { text: 'Hence 3 + 2\u221a5 is irrational.', reasoning: 'The assumption led to a contradiction with an established result, so it must be false.' },
      ],
      answer: '3 + 2\u221a5 is irrational.',
    },
  ],
  guidedPractice: [
    { id: 's13b.g1', prompt: 'In the \u221a3 proof, what does a = 3k give when substituted?', hint: 'Square it carefully.', answer: '9k\u00b2 = 3b\u00b2, so b\u00b2 = 3k\u00b2.', rationale: 'Squaring 3k gives 9k\u00b2, and dividing through by 3 leaves b\u00b2 as three times an integer, which is what the next divisibility step needs.' },
    { id: 's13b.g2', prompt: 'Prove that 5 \u2212 \u221a3 is irrational.', hint: 'Isolate the root.', answer: 'If it were rational r, then \u221a3 = 5 \u2212 r, which would be rational \u2014 contradiction.', rationale: '5 \u2212 r is a difference of rationals and so rational, but \u221a3 is irrational, so the assumption fails.' },
    { id: 's13b.g3', prompt: 'Are you required to prove \u221ap irrational for every prime p?', hint: 'What does the current scope name?', answer: 'No \u2014 \u221a2, \u221a3 and \u221a5 are the required cases.', rationale: 'The general result explains why the three proofs look alike and is worth understanding, but reproducing it is not a required task.' },
  ],
  independentPractice: [
    { id: 's13b.i1', prompt: 'Prove that \u221a7 is irrational, or say why the same structure applies.', answer: 'The same argument works: 7 is prime, so 7 divides a\u00b2 implies 7 divides a.', rationale: 'From a\u00b2 = 7b\u00b2 we get 49k\u00b2 = 7b\u00b2, so b\u00b2 = 7k\u00b2 and 7 divides b too, contradicting lowest terms.' },
    { id: 's13b.i2', prompt: 'Prove that 2\u221a3 is irrational.', answer: 'If 2\u221a3 = r were rational, then \u221a3 = r / 2 would be rational \u2014 contradiction.', rationale: 'Dividing a rational by 2 gives a rational, so \u221a3 would be rational, which is false.' },
    { id: 's13b.i3', prompt: 'A student says 3 + 2\u221a5 is irrational because it contains a root. Is that a proof?', answer: 'No.', rationale: '\u221a4 contains a root sign and equals 2, which is rational. The appearance of a radical settles nothing; the argument has to reduce to a known irrational.' },
    { id: 's13b.i4', prompt: 'Which fact about the rationals does the 3 + 2\u221a5 proof rely on?', answer: 'That they are closed under subtraction and division by a non-zero rational.', rationale: 'That closure is what forces (r \u2212 3) / 2 to be rational, which is the step producing the contradiction.' },
  ],
  misconceptionIds: [], interactivePractice: [],
  reasoningApplication: [
    {
      id: 's13b.td1',
      prompt: 'Could the same proof structure work for \u221a7? And for \u221a4? Explain the difference.',
      expectedReasoning:
        'For \u221a7 it works, because the argument uses the prime only through the result that a prime dividing a square divides the number, and 7 is prime. For \u221a4 it fails, and it must, since \u221a4 = 2 is rational. The step that breaks is "4 divides a\u00b2 implies 4 divides a" \u2014 false, as a = 2 shows, since 4 divides 4 but not 2. That result holds for primes, and 4 is composite, so the tool is simply unavailable. This is why the proofs are stated for primes rather than for any number.',
    },
    {
      id: 's13b.td2',
      prompt: 'Why does proving \u221a2, \u221a3 and \u221a5 irrational not by itself establish that \u221ap is irrational for every prime p?',
      expectedReasoning:
        'Three cases are three cases. Each proof settles its own number completely, but there are infinitely many primes and no finite collection of examples covers them. What makes the general claim plausible is that none of the three proofs used anything about the particular prime except that it was prime \u2014 so the argument could be rewritten with p throughout. That observation is the beginning of a general proof rather than the proof itself, and this course asks for the three named cases rather than the general statement.',
    },
  ],
  summary:
    'The \u221a2 argument used 2 only through its primeness, so it runs unchanged for \u221a3 and \u221a5 \u2014 though the substitution arithmetic (9k\u00b2, 25k\u00b2) must be checked each time rather than assumed. For numbers such as 3 + 2\u221a5, isolate the root instead: if the number were rational, closure of the rationals would force \u221a5 to be rational, which is false. The general \u221ap result explains the pattern and is not a required proof task.',
  nextStep: 'The chapter summary recapitulates the theorem, the lemma and these proofs.',
  teacher: teacher(
    'Students run the contradiction argument for \u221a3 and \u221a5 and reduce composite expressions to a known irrational.',
    ['The \u221a2 proof', 'Closure of the rationals'],
    ['What did the \u221a2 proof actually use about 2?', 'Isolate the root, then ask what would have to be rational.', 'Check the substitution arithmetic \u2014 do not assume it.'],
    [
      'Resist letting students treat \u221a3 as \u221a2 with the numeral changed. The 9k\u00b2 and 25k\u00b2 steps are where an unchecked substitution goes wrong.',
      'The \u221a4 question in Think deeper is the sharpest check on whether they know why the proofs are stated for primes.',
      'The general \u221ap result should be discussed and not set as a task; the current scope names three cases.',
    ],
    ['Ask whether the structure works for \u221a7, and for \u221a4.', 'Ask which closure property the 3 + 2\u221a5 proof uses.'],
    ['Have the student write the \u221a2 proof beside the \u221a3 proof and mark the lines that differ.'],
    ['Ask what would have to change to prove \u221a6 irrational.'],
  ),
  reviewStatus: 'authored_draft',
};

export const CLASS10_REAL_NUMBERS_SECTIONS: AuthoredSection[] = [
  C10_SECTION_1_2A, C10_SECTION_1_2B, C10_SECTION_1_3A, C10_SECTION_1_3B,
];
