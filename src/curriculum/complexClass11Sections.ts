// ===========================================================================
// v0.84.0-c11.12 checkpoint 83 — CLASS 11 CHAPTER 4, COMPLEX NUMBERS.
//
// One semantic complex number drives every form in these lessons: the
// algebraic display, the arithmetic, the conjugate and modulus, the Argand
// point, the polar form and the roots of a quadratic. Nothing is typed twice.
// ===========================================================================

import type { AuthoredSection } from './authoredSection';
import { type L, makeLesson } from './class11Lesson';
import {
  type Complex, add, argandSpec, complex, complexRoots, conjugate, describeArgandPoint,
  divide, divisionDenominator, formatComplex, formatModulus, formatPolar, formatRational,
  modulusSquared, multiply, placement, polarForm, powerOfI, powerOfIRemainder,
  subtract,
} from './complexNumbers';

export const CPX_C11_CHAPTER_ID = 'ncert_kemh1_ch04';
const BOOK = 'Mathematics, Textbook for Class XI (NCERT, Reprint 2026-27)';
const SRC = 'kemh1';
const INSPECTED = '2026-10-26';

const source = (sec: string, title: string, page: number) => {
  const parts = sec.split('.');
  const parent = parts.length > 2 ? parts.slice(0, 2).join('.') : sec;
  return {
    officialChapterId: CPX_C11_CHAPTER_ID,
    officialSectionId: `ncert_kemh1_s${parent.replace(/\./g, '_')}`,
    ...(parts.length > 2 ? { officialSubsectionNumber: sec } : {}),
    sectionNumber: parent, exactTitle: title, startPage: page,
    textbook: BOOK, sourceReference: SRC, inspectionDate: INSPECTED,
  };
};

/** §4.5 changes assessment status partway through; both halves keep the parent. */
const fragmentSource = (sec: string, title: string, page: number, fragmentId: string) => ({
  officialChapterId: CPX_C11_CHAPTER_ID,
  sourceKind: 'scope_fragment' as const,
  officialSectionId: `ncert_kemh1_s${sec.replace(/\./g, '_')}`,
  scopeFragmentId: fragmentId,
  sectionNumber: sec, exactTitle: title, startPage: page,
  textbook: BOOK, sourceReference: SRC, inspectionDate: INSPECTED,
});

const cbseSource = (title: string, page: number, entry: string) => ({
  officialChapterId: CPX_C11_CHAPTER_ID,
  sourceKind: 'cbse_only' as const,
  cbseEntryId: entry,
  officialSectionId: '', sectionNumber: '', exactTitle: title, startPage: page,
  textbook: 'Mathematics, Subject Code 041, Classes XI-XII, CBSE 2026-27',
  sourceReference: 'Maths_SecP2_2026-27', inspectionDate: INSPECTED,
});

const lesson = (l: L): AuthoredSection => makeLesson(l, source, fragmentSource, cbseSource);

// --- canonical numbers, derived once --------------------------------------
export const Z1 = complex(3, 4);
export const Z2 = complex(1, -2);
export const Z3 = complex(1, 1);
export const F = (z: Complex) => formatComplex(z);

export const V_ARGAND_BASIC = argandSpec('v_argand_basic',
  [{ z: Z1 }, { z: complex(-2, 3) }, { z: complex(-1, -2) }, { z: complex(2, -1) }],
  `An Argand plane with a horizontal real axis and a vertical imaginary axis. Four numbers are plotted: ${describeArgandPoint(Z1)}; ${describeArgandPoint(complex(-2, 3))}; ${describeArgandPoint(complex(-1, -2))}; and ${describeArgandPoint(complex(2, -1))}. Each sits in a different quadrant, so the sign of each part decides the quadrant.`);

export const V_ARGAND_MODULUS = argandSpec('v_argand_modulus',
  [{ z: Z1 }],
  `An Argand plane showing ${describeArgandPoint(Z1)}, with a segment drawn from the origin to the point. The length of that segment is the modulus, ${formatModulus(Z1)}, so the modulus is the distance of the number from the origin.`,
  { showVectors: true });

export const V_ARGAND_POLAR = argandSpec('v_argand_polar',
  [{ z: Z3 }],
  `An Argand plane showing ${describeArgandPoint(Z3)}, with a segment from the origin to the point and the angle that segment makes with the positive real axis marked at the origin. The segment length is the modulus ${formatModulus(Z3)} and the marked angle is the argument, so the two together fix the point as surely as its coordinates do.`,
  { showVectors: true, showArgument: true });

export const CANONICAL_ARGAND = [V_ARGAND_BASIC, V_ARGAND_MODULUS, V_ARGAND_POLAR];

export const C11_CPX_SECTIONS: AuthoredSection[] = [

lesson({ id:'ncert_kemh1_s4_2_complex_numbers_lesson', sec:'4.2', title:'Complex Numbers', page:76,
 assume:['Real numbers','Quadratic equations and the discriminant from Class 10'],
 notIntroduce:[['Algebra of complex numbers','ncert_kemh1_s4_3'],['The Argand plane','ncert_kemh1_s4_5']],
 goal:'You will write a complex number as a + ib, name its real and imaginary parts, and see why the real number line alone could not supply a square root of minus one.',
 checks:['Say what the discriminant of a quadratic tells you.','Square a negative real number.'], ifNot:'Revisit the discriminant; this chapter begins where Class 10 stopped.',
 vocab:[['imaginary unit','The number i, defined so that i squared is \u22121.'],
  ['complex number','A number of the form a + ib with a and b real.'],
  ['real part','The number a in a + ib.'],
  ['imaginary part','The number b in a + ib.']],
 expl:['Every real number has a square that is zero or positive. A positive times a positive is positive, and so is a negative times a negative. So no real number squares to \u22121, and the equation x\u00b2 + 1 = 0 has no solution among the reals.',
  'In Class 10 that was the end of the matter: a quadratic with a negative discriminant was said to have no real roots. Notice the word real. It was never claimed that no root exists anywhere, only that none lies on the real number line.',
  'The resolution is to extend the number system rather than to give up. We introduce a new number i, called the imaginary unit and defined by the single property that i squared is \u22121, and then build the numbers a + ib with a and b real. These are the complex numbers.',
  `In a + ib, a is called the real part and b the imaginary part. For ${F(Z1)} the real part is ${formatRational(Z1.re)} and the imaginary part is ${formatRational(Z1.im)}. The imaginary part is the real number b, not ib.`,
  `The reals have not been discarded. A complex number with imaginary part zero is a real number, which is why ${F(complex(5,0))} is written simply as it is rather than as 5 + 0i. A number with real part zero, such as ${F(complex(0,1))}, is called purely imaginary.`,
  'One caution from the textbook that matters immediately. The symbol \u221a\u22121 means i and nothing more. The familiar rule that \u221aa \u00d7 \u221ab = \u221a(ab) was established for non-negative a and b, and it does not carry over to negative ones. Applying it there produces contradictions, so in this chapter a negative sign is taken out as i before any radical is multiplied.'],
 rep:['The real number line drawn inside a wider plane, with the new numbers occupying the space off the line'],
 we:[{id:'s42.we1',prompt:`Name the real and imaginary parts of ${F(Z2)}.`,steps:[['Compare the number with the form a + ib.','The two parts are read off the form, not computed.'],[`The real part is ${formatRational(Z2.re)} and the imaginary part is ${formatRational(Z2.im)}.`,'The imaginary part is the real coefficient of i, so it carries the sign and not the letter.']],answer:`real part ${formatRational(Z2.re)}, imaginary part ${formatRational(Z2.im)}.`},
  {id:'s42.we2',prompt:'Why can no real number satisfy x\u00b2 = \u22121?',steps:[['A positive real squared is positive, and a negative real squared is also positive.','Both cases give the same sign, which is what rules out the equation.'],['Zero squared is zero.','That exhausts the real numbers: every one is positive, negative or zero.'],['So no real number has square \u22121, and a new number must be introduced if the equation is to have a solution.','The extension is a decision to enlarge the system, not a discovery hidden inside the reals.']],answer:'Because every real square is zero or positive.'},
  {id:'s42.we3',prompt:'A student writes \u221a\u22124 \u00d7 \u221a\u22129 = \u221a36 = 6. What has gone wrong?',steps:[['They have used \u221aa \u00d7 \u221ab = \u221a(ab) with two negative numbers.','That rule was established for non-negative values and is not available here.'],['Taking the negatives out first gives 2i \u00d7 3i = 6i\u00b2.',`And i\u00b2 is \u22121, so the product is ${F(complex(-6,0))}, not 6, which is the contradiction the caution exists to prevent.`],['The two answers differ in sign, which shows the rule genuinely fails rather than merely looking unfamiliar.','This is why the textbook cautions that \u221a\u22121 means i and the radical laws are not extended.']],answer:`${F(complex(-6,0))}, after taking each negative out as i.`}],
 g:[{id:'s42.g1',prompt:`What is the imaginary part of ${F(complex(0,7))}?`,hint:'Compare with a + ib.',answer:'7.',why:'The real part is zero and the coefficient of i is 7, so the imaginary part is the real number 7.'},
  {id:'s42.g2',prompt:'Is every real number a complex number?',hint:'What is b for a real number?',answer:'Yes.',why:'A real number a is a + i0, so it is a complex number whose imaginary part happens to be zero.'},
  {id:'s42.g3',prompt:'What is i\u00b2?',hint:'It is the defining property.',answer:F(multiply(complex(0,1),complex(0,1))),why:'i was introduced precisely so that its square is \u22121; everything else in the chapter follows from that.'}],
 i:[{id:'s42.i1',prompt:`Write ${F(complex(0,-3))} in the form a + ib and name both parts.`,answer:'0 + i(\u22123); real part 0, imaginary part \u22123.',why:'The number is purely imaginary, so its real part is zero while its imaginary part is the signed coefficient of i.'},
  {id:'s42.i2',prompt:'Did Class 10 make a mistake in saying a quadratic had no real roots?',answer:'No.',why:'The statement was about the real numbers and was correct there. The domain has since been enlarged, which changes what is available rather than what was true.'},
  {id:'s42.i3',prompt:'Why is the imaginary part of 3 + 4i the number 4 and not 4i?',answer:'Because the form a + ib names b, which is real.',why:'Keeping the imaginary part real is what lets the parts be added and compared like ordinary numbers in the next lesson.'},
  {id:'s42.i4',prompt:'Simplify \u221a\u221225 using the safe convention.',answer:'5i.',why:'Take the negative out as i first, giving i\u221a25 = 5i; multiplying radicals of negatives directly is not permitted.'}],
 td:[{id:'s42.td1',prompt:'Mathematics did not have to invent i. What makes the invention worth making?',reasoning:'Because it closes a gap that kept reappearing. Without it, whether a quadratic has roots depends on its coefficients in a way that has to be checked case by case, and whole methods stop working whenever a discriminant turns negative. With it, every quadratic has roots and the methods run through uninterrupted. The test of such an extension is whether the old system survives inside the new one unchanged, and it does: every real number is still here, with all its arithmetic intact.'}],
 summary:`A complex number is a + ib with a and b real, where i is defined by i\u00b2 = \u22121. The real part is a and the imaginary part is the real number b. Every real number is complex with b = 0, and \u221a\u22121 means i, so the radical laws for non-negative numbers are not extended to negative ones.`,
 next:'Next you will add, subtract and multiply these numbers.',
 t:['Write complex numbers in standard form and identify both parts.',['Real numbers','Discriminant'],['"the imaginary part is the real number b" to stop b being read as bi'],['Worked example 3 is the textbook caution in action and is worth doing before any exercise involving radicals of negatives.','Frame the Class 10 statement as still true in a smaller domain, never as an error.'],['Ask for the real part of a purely imaginary number.'],['Have the student write each number in the form a + ib before naming the parts.'],['Ask whether i is a real number.']]} as unknown as L),

lesson({ id:'ncert_kemh1_s4_3_algebra_lesson', sec:'4.3', title:'Algebra of Complex Numbers', page:78,
 prereq:['ncert_kemh1_s4_2'], assume:['Complex numbers in standard form','Real arithmetic'],
 notIntroduce:[['Division','ncert_kemh1_s4_3_5']],
 goal:'You will add, subtract and multiply complex numbers by working on their parts, and see where the minus sign in multiplication comes from.',
 checks:['Name the real and imaginary parts of a complex number.','State i squared.'], ifNot:'Revisit the standard form; every operation here works on the two parts.',
 vocab:[['standard form','A complex number written as a + ib with the two parts separated.']],
 expl:[`Addition is done part by part. The real parts add and the imaginary parts add, so (a + ib) + (c + id) is (a + c) + i(b + d). With ${F(Z1)} and ${F(Z2)} the sum is ${F(add(Z1,Z2))}.`,
  `Subtraction works the same way: ${F(Z1)} \u2212 ${F(Z2)} is ${F(subtract(Z1,Z2))}. Nothing new is needed, because the parts are ordinary real numbers.`,
  'Multiplication is where i earns its keep. Multiply out as usual, and four products appear: ac, iad, ibc and i\u00b2bd. The first three behave normally. The last contains i\u00b2, which is \u22121, so that term becomes \u2212bd and joins the real part.',
  `That gives (a + ib)(c + id) = (ac \u2212 bd) + i(ad + bc). The minus sign is not a convention to remember; it is i\u00b2 appearing. For ${F(Z1)} and ${F(Z2)} the product is ${F(multiply(Z1,Z2))}.`,
  'The ordinary rules of arithmetic still hold. Addition and multiplication are commutative and associative, multiplication distributes over addition, 0 and 1 behave as they always did, and every complex number has a negative. That is what makes working with these numbers feel familiar rather than like learning a new game.',
  `Two complex numbers are equal only when both parts match. ${F(complex(2,3))} and ${F(complex(3,2))} are different numbers, because equality is a condition on each part separately.`],
 rep:['Two complex numbers written one above the other with the real parts aligned and the imaginary parts aligned'],
 we:[{id:'s43.we1',prompt:`Find ${F(Z1)} + ${F(Z2)}.`,steps:[[`Add the real parts: ${formatRational(Z1.re)} + ${formatRational(Z2.re)}.`,'The parts are real numbers, so this is ordinary addition.'],[`Add the imaginary parts: ${formatRational(Z1.im)} + ${formatRational(Z2.im)}.`,'The coefficients of i add for the same reason that like terms do.'],[`So the sum is ${F(add(Z1,Z2))}.`,'The answer is already in standard form, with the two parts separated.']],answer:F(add(Z1,Z2))},
  {id:'s43.we2',prompt:`Find ${F(Z1)} \u00d7 ${F(Z2)}.`,steps:[['Multiply out all four products as you would with any two binomials.','Nothing about complex numbers changes how brackets expand.'],['Three products are ordinary; the fourth contains i\u00b2.','This is the only step where the new number does anything.'],[`Replace i\u00b2 by \u22121, which moves that term into the real part, giving ${F(multiply(Z1,Z2))}.`,'The sign change is i\u00b2 appearing, not a rule to be memorised separately.']],answer:F(multiply(Z1,Z2))},
  {id:'s43.we3',prompt:`A student gives the product of ${F(Z1)} and ${F(Z2)} as ${F(complex(3,-8))}. What has gone wrong?`,steps:[['They have multiplied the real parts together and the imaginary parts together.','That would be right for adding, where the parts stay separate, and is exactly what multiplication does not do.'],['Multiplication mixes the parts, because each term of one bracket meets each term of the other.',`Expanding properly gives ${F(multiply(Z1,Z2))}, where the i squared term has moved into the real part.`]],answer:F(multiply(Z1,Z2))}],
 g:[{id:'s43.g1',prompt:`Find ${F(Z3)} + ${F(complex(2,3))}.`,hint:'Parts separately.',answer:F(add(Z3,complex(2,3))),why:'The real parts give 1 + 2 and the imaginary parts give 1 + 3, each an ordinary addition.'},
  {id:'s43.g2',prompt:'What is i \u00d7 i?',hint:'The defining property.',answer:F(multiply(complex(0,1),complex(0,1))),why:'i was defined so that its square is \u22121, which is the fact every multiplication in this chapter relies on.'},
  {id:'s43.g3',prompt:`Is ${F(complex(2,3))} equal to ${F(complex(3,2))}?`,hint:'Compare both parts.',answer:'No.',why:'Equality requires the real parts to match and the imaginary parts to match; here each is the other\u2019s opposite.'}],
 i:[{id:'s43.i1',prompt:`Find ${F(Z3)} \u00d7 ${F(Z3)}.`,answer:F(multiply(Z3,Z3)),why:'Expanding gives 1 + i + i + i\u00b2, and i\u00b2 is \u22121, so the two real terms cancel and only the imaginary part survives.'},
  {id:'s43.i2',prompt:'Why does multiplying two complex numbers mix the parts when adding does not?',answer:'Because each term of one bracket multiplies each term of the other.',why:'Addition keeps like with like, while multiplication produces cross terms, one of which contains i\u00b2 and lands in the real part.'},
  {id:'s43.i3',prompt:`Find ${F(complex(0,2))} \u00d7 ${F(complex(0,3))}.`,answer:F(multiply(complex(0,2),complex(0,3))),why:'The product is 6i\u00b2, and replacing i\u00b2 by \u22121 makes the result a real number, which is worth noticing.'},
  {id:'s43.i4',prompt:'Can the product of two non-real complex numbers be real?',answer:'Yes.',why:'The previous item is an example: when the cross terms cancel, only the real part remains.'}],
 td:[{id:'s43.td1',prompt:'Why is it worth checking that the usual rules of arithmetic still hold for these new numbers?',reasoning:'Because without them nothing learned before would transfer. If multiplication were not distributive, expanding brackets would be invalid and every worked example in this chapter would need its own justification. The extension is useful precisely because it adds a new number without taking anything away: the familiar machinery still runs, and only i\u00b2 behaves in a way the reals had no room for.'}],
 summary:`Complex numbers add and subtract part by part. Multiplication expands as usual, and the i\u00b2 term becomes \u22121, giving (ac \u2212 bd) + i(ad + bc). Two complex numbers are equal only when both parts match.`,
 next:'Next you will see what happens to powers of i, and how to divide.',
 t:['Add, subtract and multiply complex numbers from their parts.',['Standard form','Real arithmetic'],['"i squared is minus one" said aloud at the moment the sign changes'],['The parts-times-parts error in worked example 3 is the most common and comes from over-generalising addition.','Make students point at the i\u00b2 term before writing the answer; the minus sign then stops being arbitrary.'],['Ask what 2i times 3i is.'],['Expand all four products in a column before collecting.'],['Ask when a product of two complex numbers is real.']]} as unknown as L),


lesson({ id:'ncert_kemh1_s4_3_5_powers_division_lesson', sec:'4.3.5', title:'The Modulus and the Conjugate of a Complex Number', page:82,
 prereq:['ncert_kemh1_s4_3'], assume:['Multiplication of complex numbers','i squared is \u22121'],
 goal:'You will reduce any integer power of i using a cycle of four, and divide one complex number by another using the conjugate.',
 checks:['Multiply two complex numbers.','State i squared.'], ifNot:'Revisit multiplication; both the cycle and the division rest on it.',
 vocab:[['conjugate','The conjugate of a + ib is a \u2212 ib, the same number with the sign of the imaginary part reversed.']],
 expl:[`Powers of i repeat. i\u2070 is ${F(powerOfI(0))}, i\u00b9 is ${F(powerOfI(1))}, i\u00b2 is ${F(powerOfI(2))} and i\u00b3 is ${F(powerOfI(3))}. Then i\u2074 is ${F(powerOfI(4))} and the cycle begins again.`,
  `So a power of i depends only on the remainder when the exponent is divided by 4. For i\u00b2\u2070\u00b2\u2076 the remainder is ${powerOfIRemainder(2026)}, so the value is ${F(powerOfI(2026))}. No one multiplies i by itself two thousand times.`,
  'Division needs a different idea, because a + ib sitting underneath a fraction line is awkward. The trick is to make the denominator real, and the conjugate does exactly that.',
  `Multiplying c + id by its conjugate c \u2212 id gives c\u00b2 + d\u00b2, since the cross terms cancel and the i\u00b2 term changes sign. That is a real number, and it is positive whenever the denominator is not zero. For ${F(Z2)} it is ${formatRational(divisionDenominator(Z2))}.`,
  `So to divide, multiply above and below by the conjugate of the denominator. Dividing ${F(Z1)} by ${F(Z2)} gives ${F(divide(Z1,Z2))}, and the result is again in standard form.`,
  'Division by zero remains impossible. The conjugate of 0 is 0 and the denominator c\u00b2 + d\u00b2 becomes 0, so there is nothing to divide by. The quotient has no value, which is a statement about absence rather than about size.'],
 rep:['The four powers of i arranged round a circle, with an arrow returning from the fourth to the first'],
 we:[{id:'s435.we1',prompt:'Find i\u00b2\u2070\u00b2\u2076.',steps:[['Divide the exponent by 4 and keep the remainder.','The powers repeat every four steps, so only the remainder matters.'],[`2026 leaves remainder ${powerOfIRemainder(2026)}.`,'Everything before the remainder is a whole number of complete cycles, each returning to 1.'],[`So the value is i to that remainder, which is ${F(powerOfI(2026))}.`,'The work is one division, not two thousand multiplications.']],answer:F(powerOfI(2026))},
  {id:'s435.we2',prompt:`Divide ${F(Z1)} by ${F(Z2)}.`,steps:[[`Multiply numerator and denominator by the conjugate of the denominator, ${F(conjugate(Z2))}.`,'Multiplying above and below by the same non-zero number leaves the value unchanged.'],[`The denominator becomes ${formatRational(divisionDenominator(Z2))}, a real number, because the cross terms cancel.`,'This is the whole purpose of the conjugate here.'],[`Dividing both parts of the numerator by that real number gives ${F(divide(Z1,Z2))}.`,'Once the denominator is real, division is ordinary arithmetic on the two parts.']],answer:F(divide(Z1,Z2))},
  {id:'s435.we3',prompt:'Why does multiplying by the conjugate make the denominator real?',steps:[['Expand (c + id)(c \u2212 id): the two cross terms are icd and \u2212icd.','They are equal in size and opposite in sign, so they cancel.'],['What remains is c\u00b2 \u2212 i\u00b2d\u00b2, and i\u00b2 is \u22121.','The subtraction of a negative turns into addition.'],['So the product is c\u00b2 + d\u00b2, which is real and positive unless c and d are both zero.','The sign reversal in the conjugate is chosen precisely to make the cross terms cancel.']],answer:'Because the cross terms cancel and i\u00b2 turns the subtraction into addition.'}],
 g:[{id:'s435.g1',prompt:'Find i\u00b9\u2070\u2070.',hint:'What is the remainder on division by 4?',answer:F(powerOfI(100)),why:'100 is a whole number of complete cycles, so the power returns to the start of the cycle.'},
  {id:'s435.g2',prompt:`What is the conjugate of ${F(Z1)}?`,hint:'Reverse one sign only.',answer:F(conjugate(Z1)),why:'The conjugate changes the sign of the imaginary part and leaves the real part exactly as it was.'},
  {id:'s435.g3',prompt:`What is the denominator after multiplying ${F(Z3)} by its conjugate?`,hint:'c squared plus d squared.',answer:formatRational(divisionDenominator(Z3)),why:'Both parts are 1, so the product is 1 + 1, and the result is real as the method requires.'}],
 i:[{id:'s435.i1',prompt:'Find i\u2077 + i\u2075.',answer:F(add(powerOfI(7),powerOfI(5))),why:`The remainders are ${powerOfIRemainder(7)} and ${powerOfIRemainder(5)}, giving ${F(powerOfI(7))} and ${F(powerOfI(5))}, which cancel.`},
  {id:'s435.i2',prompt:`Divide ${F(complex(2,0))} by ${F(complex(0,1))}.`,answer:F(divide(complex(2,0),complex(0,1))),why:'Multiplying above and below by the conjugate of i gives a real denominator, and the result turns out purely imaginary.'},
  {id:'s435.i3',prompt:'Why can you not divide by 0 + 0i?',answer:'Because the real denominator c\u00b2 + d\u00b2 would be zero.',why:'The conjugate method produces nothing to divide by, and the quotient has no value at all rather than a very large one.'},
  {id:'s435.i4',prompt:'What is the conjugate of a real number?',answer:'The number itself.',why:'Its imaginary part is zero, and reversing the sign of zero changes nothing.'}],
 td:[{id:'s435.td1',prompt:'The cycle of powers of i has length four. Why four, and not some other number?',reasoning:'Because two multiplications by i take you to \u22121, and two more take you back to 1. Multiplying by i once is not enough to return anywhere, and the square lands on \u22121 rather than 1, so a further square is needed. Four is the smallest number of steps that composes back to the identity, which is why every exponent reduces to one of exactly four cases.'}],
 summary:`Powers of i repeat with period four, so i to any integer power is settled by the remainder modulo 4. Division is done by multiplying above and below by the conjugate of the denominator, which makes it the real number c\u00b2 + d\u00b2; division by zero remains impossible.`,
 next:'Next you will give that real number a name and a meaning.',
 t:['Reduce integer powers of i and divide complex numbers using the conjugate.',['Multiplication','i squared'],['"what is the remainder?" rather than "what is the power?"'],['Insist on the remainder method from the first example; students who multiply out lose the point and the time.','Worked example 3 explains why the conjugate works and should not be skipped for the procedure alone.'],['Ask for i to the power 23.'],['Write the four-step cycle on the board and leave it there.'],['Ask what happens to the cycle for negative exponents.']]} as unknown as L),

lesson({ id:'ncert_kemh1_s4_4_modulus_conjugate_lesson', sec:'4.4', title:'Modulus of a Complex Number', page:84,
 prereq:['ncert_kemh1_s4_3_5'], assume:['Conjugate','Multiplication','Square roots of non-negative numbers'],
 goal:'You will compute the modulus of a complex number exactly and connect it to the conjugate through the identity z times its conjugate equals the modulus squared.',
 checks:['Find the conjugate of a complex number.','Multiply two complex numbers.'], ifNot:'Revisit the conjugate; the modulus is built from the same product.',
 vocab:[['modulus','The modulus of z = a + ib is \u221a(a\u00b2 + b\u00b2), written |z|.']],
 expl:[`The modulus of a + ib is \u221a(a\u00b2 + b\u00b2), written |z|. For ${F(Z1)} the parts give 9 + 16 = 25, so the modulus is ${formatModulus(Z1)}.`,
  `It is often irrational, and there is no reason to spoil it with a decimal. For ${F(Z3)} the modulus is ${formatModulus(Z3)}, which is exact; writing 1.414 instead would be an approximation of a number we can name precisely.`,
  `The modulus is never negative, and it is zero only for the number zero: ${formatModulus(complex(0,0))}. That follows from the definition, since a sum of two squares is zero only when both are.`,
  `The conjugate and the modulus are closely tied. Multiplying z by its conjugate gives a\u00b2 + b\u00b2, which is exactly |z|\u00b2. For ${F(Z1)} the product is ${F(multiply(Z1,conjugate(Z1)))} and the modulus squared is ${formatRational(modulusSquared(Z1))}.`,
  `Adding z to its conjugate is just as tidy: the imaginary parts cancel and twice the real part remains. For ${F(Z1)} that gives ${F(add(Z1,conjugate(Z1)))}, which is twice ${formatRational(Z1.re)}.`,
  `Conjugating twice returns the original number, because reversing a sign twice leaves it alone. This is why the conjugate is a genuinely reversible operation rather than a one-way simplification.`],
 rep:['A right triangle with the real part along the base and the imaginary part vertical, the hypotenuse labelled as the modulus'],
 visuals:[V_ARGAND_MODULUS],
 we:[{id:'s44.we1',prompt:`Find the modulus of ${F(Z1)}.`,steps:[['Square each part: 3 squared is 9 and 4 squared is 16.','Both parts are real, so these are ordinary squares, and both are non-negative.'],['Add them: 9 + 16 = 25.','The sum under the radical is what the definition asks for.'],[`Take the square root: ${formatModulus(Z1)}.`,'Here the sum is a perfect square, so the modulus is a whole number.']],answer:formatModulus(Z1)},
  {id:'s44.we2',prompt:`Find the modulus of ${F(Z3)} and leave it exact.`,steps:[['Both parts are 1, so the squares are 1 and 1.','The arithmetic is the same whatever the parts are.'],[`The sum is 2, so the modulus is ${formatModulus(Z3)}.`,'This is irrational and is left as a radical, which is exact rather than rounded.'],['A decimal would be an approximation of a number we can write exactly.','Keeping it exact also keeps later arithmetic exact.']],answer:formatModulus(Z3)},
  {id:'s44.we3',prompt:`Verify that ${F(Z1)} times its conjugate equals the modulus squared.`,steps:[[`The conjugate is ${F(conjugate(Z1))}.`,'Only the sign of the imaginary part changes.'],[`The product is ${F(multiply(Z1,conjugate(Z1)))}, a real number, because the cross terms cancel.`,'This is the same cancellation that made division work.'],[`The modulus squared is ${formatRational(modulusSquared(Z1))}, which agrees.`,'The identity is a consequence of the definitions, not a separate fact to learn.']],answer:`Both give ${formatRational(modulusSquared(Z1))}.`}],
 g:[{id:'s44.g1',prompt:`What is the modulus of ${F(complex(0,-5))}?`,hint:'Square both parts.',answer:formatModulus(complex(0,-5)),why:'The real part is zero and the square of \u22125 is 25, so the modulus is 5 and the sign disappears in the squaring.'},
  {id:'s44.g2',prompt:'Can a modulus be negative?',hint:'What is under the radical?',answer:'No.',why:'It is the square root of a sum of squares, which is never negative, and the root is taken non-negative.'},
  {id:'s44.g3',prompt:'Which complex number has modulus zero?',hint:'When is a sum of squares zero?',answer:F(complex(0,0)),why:'A sum of two squares is zero only when both are, so both parts must be zero.'}],
 i:[{id:'s44.i1',prompt:`Find the modulus of ${F(complex(-3,4))}.`,answer:formatModulus(complex(-3,4)),why:'Squaring removes the sign, so this has the same modulus as 3 + 4i; the modulus measures size, not direction.'},
  {id:'s44.i2',prompt:'What is the conjugate of the conjugate of z?',answer:'z.',why:'Reversing the sign of the imaginary part twice restores it, so the operation undoes itself.'},
  {id:'s44.i3',prompt:`What is ${F(Z3)} plus its conjugate?`,answer:F(add(Z3,conjugate(Z3))),why:'The imaginary parts are opposite and cancel, leaving twice the real part, which is always a real number.'},
  {id:'s44.i4',prompt:'Why is z times its conjugate always real?',answer:'Because the cross terms cancel.',why:'What remains is a\u00b2 + b\u00b2, with no i in it, and that quantity is exactly the modulus squared.'}],
 td:[{id:'s44.td1',prompt:'Why should the modulus be defined with a square root of a sum of squares, rather than as something simpler like a + b?',reasoning:'Because a + b would not measure size. It changes when the signs change, can be negative, and can be zero for numbers that are not zero, such as 3 \u2212 3i. The sum of squares fixes all three problems at once: squaring removes the signs, the total is never negative, and it vanishes only when both parts do. The next lesson shows that the definition also turns out to be a distance, which is the real justification.'}],
 summary:`|z| = \u221a(a\u00b2 + b\u00b2), kept exact: ${formatModulus(Z1)} for ${F(Z1)} and ${formatModulus(Z3)} for ${F(Z3)}. The modulus is never negative and is zero only for zero. Multiplying z by its conjugate gives |z|\u00b2, and adding them gives twice the real part.`,
 next:'Next you will see where these numbers live.',
 t:['Compute exact moduli and connect them to the conjugate.',['Conjugate','Multiplication'],['"exactly" whenever a radical is left unevaluated'],['Resist decimals throughout; the exact radical is the answer, not a step towards one.','The z times conjugate identity links this lesson back to division and forward to the Argand plane.'],['Ask for the modulus of a purely imaginary number.'],['Compute the two squares in a column before adding.'],['Ask whether |zw| equals |z||w|.']]} as unknown as L),

lesson({ id:'ncert_kemh1_s4_5_argand_plane_lesson', sec:'4.5', title:'Argand Plane and Polar Representation', page:86,
 fragmentId:'SF-1-SUMMATIVE',
 prereq:['ncert_kemh1_s4_4'], assume:['Modulus','Plotting points on the coordinate plane'],
 notIntroduce:[['Polar representation','ncert_kemh1_s4_5_polar']],
 goal:'You will place a complex number as a point on the plane and read the modulus as its distance from the origin.',
 checks:['Compute a modulus.','Plot a point from a pair of coordinates.'], ifNot:'Revisit the modulus; this lesson gives it a geometric meaning.',
 vocab:[['Argand plane','The coordinate plane used to represent complex numbers, with the real part along the horizontal axis and the imaginary part along the vertical.']],
 expl:[`A complex number has two real parts to it, and a plane has two coordinates. That suggests the representation: place a + ib at the point (a, b). The horizontal axis carries the real part and the vertical axis the imaginary part.`,
  `This plane is called the Argand plane. ${F(Z1)} sits at ${describeArgandPoint(Z1)}, which is one point and not two separate pieces of information.`,
  `The signs of the two parts decide the quadrant. ${F(complex(-2,3))} lies in ${typeof placement(complex(-2,3))==='number'?'quadrant '+placement(complex(-2,3)):placement(complex(-2,3))}, and ${F(complex(-1,-2))} in ${typeof placement(complex(-1,-2))==='number'?'quadrant '+placement(complex(-1,-2)):placement(complex(-1,-2))}.`,
  `Numbers with one part zero lie on an axis rather than in a quadrant. A real number sits on the horizontal axis, and ${F(complex(0,2))} sits on the ${placement(complex(0,2))}. The origin is ${F(complex(0,0))} itself.`,
  `Now the modulus makes geometric sense. The distance from the origin to (a, b) is \u221a(a\u00b2 + b\u00b2) by the Pythagorean theorem, which is exactly the modulus. So |z| is the distance of z from the origin, and the definition of the previous lesson was a distance all along.`,
  'The conjugate also becomes visible: reversing the sign of the imaginary part reflects the point across the horizontal axis. A number and its conjugate are mirror images, which is why they have the same modulus.'],
 rep:['A plane with the real axis horizontal and the imaginary axis vertical, four numbers plotted, one in each quadrant'],
 visuals:[V_ARGAND_BASIC, V_ARGAND_MODULUS],
 we:[{id:'s45.we1',prompt:`Where does ${F(Z1)} sit on the Argand plane?`,steps:[['Read the real part as the horizontal coordinate.','The axis assignment is the whole content of the representation.'],['Read the imaginary part as the vertical coordinate.','The imaginary part is a real number, so it can serve as a coordinate directly.'],[`So the point is ${describeArgandPoint(Z1)}.`,'One point carries the whole number; nothing is held separately.']],answer:describeArgandPoint(Z1)},
  {id:'s45.we2',prompt:`Why is the modulus of ${F(Z1)} the same as its distance from the origin?`,steps:[['The point is at (3, 4), so the horizontal and vertical offsets from the origin are 3 and 4.','These offsets are the two parts of the number.'],['The distance is \u221a(3\u00b2 + 4\u00b2) by the Pythagorean theorem.','A right triangle is formed with the two offsets as legs.'],[`That is \u221a25 = ${formatModulus(Z1)}, which is the modulus.`,'The definition and the distance are the same calculation, which is why the modulus deserves to be called a size.']],answer:formatModulus(Z1)},
  {id:'s45.we3',prompt:`A student plots ${F(complex(2,-1))} at (\u22121, 2). What has gone wrong?`,steps:[['They have swapped the two coordinates and lost a sign.','The real part belongs on the horizontal axis and the imaginary part on the vertical; the order is not interchangeable.'],[`The correct position is ${describeArgandPoint(complex(2,-1))}.`,'Swapping would place the number in a different quadrant entirely, describing a different complex number.']],answer:describeArgandPoint(complex(2,-1))}],
 g:[{id:'s45.g1',prompt:`In which quadrant does ${F(complex(-2,3))} lie?`,hint:'Check the sign of each part.',answer:`Quadrant ${placement(complex(-2,3))}.`,why:'The real part is negative and the imaginary part positive, which places the point to the left and above the origin.'},
  {id:'s45.g2',prompt:`Where does ${F(complex(0,2))} sit?`,hint:'What is its real part?',answer:`On the ${placement(complex(0,2))}.`,why:'A zero real part puts the point on the vertical axis, which is a boundary and not a quadrant.'},
  {id:'s45.g3',prompt:'What does taking the conjugate do to the plotted point?',hint:'Which coordinate changes?',answer:'It reflects it across the real axis.',why:'Only the vertical coordinate changes sign, so the point flips above or below the horizontal axis while its distance from the origin is unchanged.'}],
 i:[{id:'s45.i1',prompt:`Plot ${F(complex(-1,-2))} and name its quadrant.`,answer:describeArgandPoint(complex(-1,-2)),why:'Both parts are negative, so the point lies left of and below the origin, in the third quadrant.'},
  {id:'s45.i2',prompt:'Why do a number and its conjugate have the same modulus?',answer:'Because they are mirror images across the real axis.',why:'Reflection does not change distance from the origin, and in the algebra the sign disappears when the imaginary part is squared.'},
  {id:'s45.i3',prompt:'Which numbers lie on the horizontal axis?',answer:'The real numbers.',why:'Their imaginary part is zero, so the vertical coordinate is zero, which is exactly the real number line sitting inside the plane.'},
  {id:'s45.i4',prompt:'What is the set of numbers whose modulus is 1?',answer:'The points at distance 1 from the origin, forming a circle.',why:'The modulus is a distance, so fixing it fixes the distance from the origin and traces a circle of that radius.'}],
 td:[{id:'s45.td1',prompt:'The real numbers fit on a line. Why do complex numbers need a plane?',reasoning:'Because a complex number carries two independent real quantities and a line offers only one coordinate to record them. Nothing on the line could distinguish 3 + 4i from 3 + 5i while keeping its real part in place. The plane also explains what the extension actually did: the real line is still there as the horizontal axis, unchanged, with the new numbers occupying the space off it. The reals were not replaced; room was added around them.'}],
 summary:`The Argand plane places a + ib at (a, b), with the real axis horizontal and the imaginary axis vertical. The quadrant follows from the signs of the parts, numbers with a zero part lie on an axis, and the modulus is the distance of the point from the origin.`,
 next:'Next, an optional second way of fixing the same point.',
 t:['Represent complex numbers as points and read the modulus as a distance.',['Modulus','Coordinate plotting'],['"the real part goes across, the imaginary part goes up"'],['The swapped-coordinate error in worked example 3 is common and changes the quadrant, which makes it easy to catch by eye.','Draw the right triangle explicitly when connecting modulus to distance.'],['Ask where a purely imaginary number sits.'],['Mark the horizontal coordinate first, every time, before the vertical.'],['Ask what the numbers with modulus less than 1 look like.']]} as unknown as L),


lesson({ id:'ncert_kemh1_s4_5_polar_lesson', sec:'4.5', title:'Polar Representation of a Complex Number', page:88,
 fragmentId:'SF-1-FORMATIVE',
 prereq:['ncert_kemh1_s4_5'], assume:['The Argand plane','Modulus','Radian measure and the trigonometric functions'],
 goal:'You will fix a complex number by its distance from the origin and its direction, and convert between that description and the usual one.',
 checks:['Read a point on the Argand plane.','Give sin and cos of a standard angle.'], ifNot:'Revisit the Argand plane and the trigonometric functions; this lesson uses both.',
 vocab:[['argument','An angle the segment from the origin to the point makes with the positive real axis.'],
  ['polar representation','Writing a non-zero complex number as r(cos \u03b8 + i sin \u03b8), using its modulus and an argument.']],
 expl:[`A point on the plane can be fixed in two ways. The usual one gives two coordinates. The other gives a distance and a direction, and for complex numbers that is the polar representation.`,
  `The distance is the modulus r, which we already have. The direction is an angle \u03b8 measured from the positive real axis, called an argument of the number.`,
  `From the right triangle, a = r cos \u03b8 and b = r sin \u03b8. Substituting into a + ib gives z = r(cos \u03b8 + i sin \u03b8), which is the polar form. For ${F(Z3)} this is ${formatPolar(Z3)}.`,
  `The angle carries its unit. Here arguments are given in radians, using the measure from the trigonometric functions chapter, so \u03c0/4 is a quarter of a straight angle and not the number 0.785.`,
  `The direction must be read with the quadrant in mind. ${F(complex(-1,1))} has polar form ${formatPolar(complex(-1,1))}; dividing the parts and taking an inverse tangent without noticing the signs would place it in the wrong half of the plane.`,
  `One number is excluded. ${F(complex(0,0))} has modulus ${formatModulus(complex(0,0))}, and ${polarForm(complex(0,0)).note}. It is not given the angle 0 for convenience, because that would assert a direction the origin does not have.`],
 rep:['A segment from the origin to a point, with its length marked as the modulus and the angle at the origin marked as the argument'],
 visuals:[V_ARGAND_POLAR],
 we:[{id:'s45p.we1',prompt:`Write ${F(Z3)} in polar form.`,steps:[[`Find the modulus: ${formatModulus(Z3)}.`,'This is the distance from the origin and becomes the r in the form.'],['Find the direction: both parts are equal and positive, so the point lies on the diagonal of the first quadrant.','Equal positive parts make equal legs, so the angle is half a right angle.'],[`So the polar form is ${formatPolar(Z3)}.`,'The modulus and the argument between them fix the point exactly as the coordinates did.']],answer:formatPolar(Z3)},
  {id:'s45p.we2',prompt:`Write ${F(complex(-1,1))} in polar form.`,steps:[['The real part is negative and the imaginary part positive, so the point is in the second quadrant.','The quadrant has to be settled before the angle, not after.'],['The parts are equal in size, so the direction is half a right angle past the vertical.','The size of the angle comes from the parts; which way it points comes from the signs.'],[`So the form is ${formatPolar(complex(-1,1))}.`,'Taking an inverse tangent of the ratio alone would have given the first-quadrant angle instead.']],answer:formatPolar(complex(-1,1))},
  {id:'s45p.we3',prompt:`A student gives the argument of ${F(complex(0,0))} as 0. What has gone wrong?`,steps:[[`The modulus is ${formatModulus(complex(0,0))}, so the point is the origin itself.`,'There is no segment from the origin to the origin, so no direction to measure.'],['An angle of 0 would assert that the number points along the positive real axis.',`But ${polarForm(complex(0,0)).note}, so no value is correct rather than this one being wrong.`]],answer:'Zero has no argument; the question has no answer rather than the answer being 0.'}],
 g:[{id:'s45p.g1',prompt:`What is the modulus in the polar form of ${F(complex(2,2))}?`,hint:'Distance from the origin.',answer:formatModulus(complex(2,2)),why:'Both parts are 2, so the sum of squares is 8 and the modulus is the exact radical rather than a decimal.'},
  {id:'s45p.g2',prompt:`Do ${F(Z3)} and ${F(complex(2,2))} have the same argument?`,hint:'Do they point the same way?',answer:'Yes.',why:'They lie on the same ray from the origin, so they share a direction and differ only in distance.'},
  {id:'s45p.g3',prompt:'Why must the quadrant be considered when finding an argument?',hint:'What does the ratio of the parts lose?',answer:'Because the ratio of the parts is the same for opposite directions.',why:'Two points on opposite sides of the origin give the same ratio, so the signs are what distinguish them.'}],
 i:[{id:'s45p.i1',prompt:`Write ${F(complex(0,3))} in polar form.`,answer:formatPolar(complex(0,3)),why:'The point lies on the positive imaginary axis, so its direction is a quarter turn from the positive real axis and its distance is 3.'},
  {id:'s45p.i2',prompt:'Can one complex number have more than one argument?',answer:'Yes.',why:'Adding a full turn returns to the same direction, so arguments differing by a whole number of turns describe the same point.'},
  {id:'s45p.i3',prompt:'What do two numbers with the same modulus but different arguments have in common?',answer:'They are the same distance from the origin.',why:'They lie on the same circle about the origin, differing only in direction.'},
  {id:'s45p.i4',prompt:'Does the polar form change which number is being described?',answer:'No.',why:'It is a second description of the same point, so the modulus and argument can always be converted back to the two parts.'}],
 td:[{id:'s45p.td1',prompt:'Why does the number zero have no argument, when every other complex number has one?',reasoning:'Because an argument is the direction of the segment from the origin to the point, and for zero that segment has no length. A segment of zero length points nowhere in particular, so every angle would describe it equally well and none would describe it better. Assigning 0 by convention would make the formula tidier and the statement false: it would claim a direction the number does not have. Saying the argument is undefined is the accurate answer.'}],
 summary:`A non-zero complex number can be written as r(cos \u03b8 + i sin \u03b8), with r its modulus and \u03b8 an argument measured from the positive real axis: ${F(Z3)} is ${formatPolar(Z3)}. The quadrant decides the direction, and zero has no argument at all.`,
 next:'Next, an optional look at quadratics whose roots leave the real line.',
 t:['Convert between rectangular and polar representations, respecting quadrant and the undefined argument of zero.',['Argand plane','Modulus','Trigonometric functions'],['"a distance and a direction" when the polar form is first written'],['CURRICULUM NOTE: polar representation is formative-only under the current CBSE scope while the Argand plane itself is summative, so the two halves of this section are assessed differently. Teach it as enrichment; keep it out of summative tests.','The zero case in worked example 3 is the one students most want to answer wrongly.'],['Ask for the argument of a negative real number.'],['Mark the quadrant on a sketch before writing any angle.'],['Ask what multiplying two numbers does to their arguments.']]} as unknown as L),

lesson({ id:'ncert_kemh1_fo5b_complex_quadratics_lesson', sec:'\u2014', title:'Quadratic Equations over the Complex Numbers', page:0,
 cbseEntry:'FO-5',
 prereq:['ncert_kemh1_s4_5_polar'], assume:['The quadratic formula and the discriminant','Complex numbers and the conjugate'],
 goal:'You will find the roots of a real-coefficient quadratic whose discriminant is negative, and see that they form a conjugate pair.',
 checks:['State the quadratic formula.','Find the conjugate of a complex number.'], ifNot:'Revisit the discriminant from Class 10; this lesson resumes exactly where it stopped.',
 vocab:[['complex root','A root of an equation that is a complex number and not a real one.']],
 expl:['In Class 10 a quadratic with a negative discriminant was reported as having no real roots, and the matter ended there. The number system has since been enlarged, and the sentence can now be completed.',
  `The quadratic formula still applies. The difficulty was always \u221aD with D negative, and that is no longer an obstacle: take the negative out as i, so \u221a(\u2212k) is i\u221ak for positive k. The caution from earlier in the chapter still holds, which is why the i comes out before anything is multiplied.`,
  `Take x\u00b2 + 2x + 5 = 0. The discriminant is ${complexRoots(1,2,5).discriminant}, which is negative, so there are no real roots. The formula now gives ${complexRoots(1,2,5).writtenRoots}.`,
  `The two roots are ${complexRoots(1,2,5).roots?.map(F).join(' and ')}, and they are conjugates of each other: ${(()=>{const r=complexRoots(1,2,5);return r.roots?F(conjugate(r.roots[0]))===F(r.roots[1]):false;})()}. That happens whenever the coefficients are real, because the two roots differ only in the sign in front of the radical.`,
  `Not every surd disappears. For 2x\u00b2 + x + 3 = 0 the discriminant is ${complexRoots(2,1,3).discriminant} and the roots are ${complexRoots(2,1,3).writtenRoots}, exact and irrational. A decimal would lose information the exact form keeps.`,
  'There is a general result in the background. The fundamental theorem of algebra states that every polynomial equation of degree at least one with complex coefficients has at least one complex root. At this level the theorem is stated and used, not proved: nothing in this chapter establishes it, and its proof belongs to later study.'],
 rep:['A quadratic with a negative discriminant, its two roots plotted as a mirror-image pair about the real axis'],
 we:[{id:'fo5b.we1',prompt:'Solve x\u00b2 + 2x + 5 = 0.',steps:[[`Find the discriminant: ${complexRoots(1,2,5).discriminant}.`,'It is negative, so Class 10 would have stopped here with no real roots.'],['Apply the formula, taking the negative out of the radical as i.','This is the safe convention: the sign leaves the radical before any multiplication.'],[`That gives ${complexRoots(1,2,5).writtenRoots}, so the roots are ${complexRoots(1,2,5).roots?.map(F).join(' and ')}.`,'The surd reduced to a whole number here, which does not always happen.']],answer:complexRoots(1,2,5).writtenRoots},
  {id:'fo5b.we2',prompt:'Solve 2x\u00b2 + x + 3 = 0 and leave the answer exact.',steps:[[`The discriminant is ${complexRoots(2,1,3).discriminant}, again negative.`,'The method is the same whatever the size of the discriminant.'],['Take the negative out as i; the remaining radical does not simplify.','23 has no square factor, so the surd stays.'],[`The roots are ${complexRoots(2,1,3).writtenRoots}.`,'Leaving the radical is exact; a decimal would be an approximation of a number we can write down.']],answer:complexRoots(2,1,3).writtenRoots},
  {id:'fo5b.we3',prompt:'Why do the two roots always form a conjugate pair when the coefficients are real?',steps:[['The formula gives the same real expression for both roots, with the radical added in one and subtracted in the other.','Everything outside the radical is identical for the two roots.'],['With a negative discriminant the radical carries the i, so the two roots differ only in the sign of their imaginary part.','That is precisely the relationship between a number and its conjugate.'],['So the roots are conjugates, and in particular they have the same modulus.','This fails if the coefficients are not real, which is why the condition matters.']],answer:'Because they differ only in the sign of the radical, which carries the i.'}],
 g:[{id:'fo5b.g1',prompt:'Solve x\u00b2 + 1 = 0.',hint:'What is the discriminant?',answer:complexRoots(1,0,1).writtenRoots,why:'The discriminant is \u22124, so the roots are purely imaginary and are conjugates of one another.'},
  {id:'fo5b.g2',prompt:'Solve x\u00b2 + 9 = 0.',hint:'Take the negative out as i.',answer:complexRoots(1,0,9).writtenRoots,why:'The discriminant is \u221236, whose size is a perfect square, so the surd reduces to a whole number.'},
  {id:'fo5b.g3',prompt:'Was Class 10 wrong to say such an equation has no real roots?',hint:'What did the statement claim?',answer:'No.',why:'The statement was about the real numbers and remains true. The roots exist, and they lie outside the real line.'}],
 i:[{id:'fo5b.i1',prompt:'Solve x\u00b2 \u2212 2x + 5 = 0.',answer:complexRoots(1,-2,5).writtenRoots,why:'The discriminant is \u221216, and the formula gives a conjugate pair with real part 1.'},
  {id:'fo5b.i2',prompt:'If one root of a real-coefficient quadratic is 3 + 2i, what is the other?',answer:F(conjugate(complex(3,2))),why:'With real coefficients the roots come in conjugate pairs, so the second is the conjugate of the first.'},
  {id:'fo5b.i3',prompt:'Does the fundamental theorem of algebra get proved in this chapter?',answer:'No.',why:'It is stated at this level and used; the proof belongs to later study and nothing here establishes it.'},
  {id:'fo5b.i4',prompt:'Can a real-coefficient quadratic have exactly one complex root and one real root?',answer:'No.',why:'The roots differ only in the sign of the radical, so either both are real or they form a conjugate pair.'}],
 td:[{id:'fo5b.td1',prompt:'Class 10 said these equations had no real roots. What exactly changed, and what did not?',reasoning:'What changed is the set of numbers available to be a root. What did not change is a single fact about the real numbers: there is still no real number satisfying x\u00b2 + 2x + 5 = 0, and the Class 10 statement remains true as stated. The careful wording turns out to have been doing real work. "No real roots" was never a claim that no roots exist, and the complex numbers supply what the real line could not hold.'}],
 summary:`With a negative discriminant the quadratic formula still applies once the negative is taken out of the radical as i, giving a conjugate pair of complex roots: x\u00b2 + 2x + 5 = 0 has roots ${complexRoots(1,2,5).writtenRoots}. The fundamental theorem of algebra is stated at this level, not proved.`,
 next:'That completes the chapter on complex numbers.',
 t:['Solve real-coefficient quadratics with negative discriminant, giving exact conjugate roots.',['Quadratic formula','Conjugate'],['"no real roots, and here is why that wording mattered"'],['CURRICULUM NOTE: this topic is prescribed by CBSE as formative-only with the fundamental theorem stated rather than proved, and the current textbook gives it no section. Treat it as enrichment and keep it out of summative tests.','Do not let the theorem drift into a proof sketch; the scope is a statement and its use.'],['Ask for the second root given one of a conjugate pair.'],['Compute the discriminant first and say aloud whether it is negative before touching the formula.'],['Ask whether a cubic with real coefficients must have a real root.']]} as unknown as L),

];
