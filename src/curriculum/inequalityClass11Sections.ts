// ===========================================================================
// v0.84.0-c11.39 checkpoint 96 — CLASS 11 CHAPTER 5, LINEAR INEQUALITIES,
// plus the CBSE-only FO-6.
//
// Two NCERT lessons own §5.2 and §5.3. The third, C11-INQ-FO6, has NO
// NCERT owner: no current section teaches the two-variable case. It is
// chapter-less and instructionally REQUIRED_CORE, resolved at checkpoint
// 94 — so it is neither a prerequisite nor a Chapter 5 lesson, and the
// catalogue accounting has to say so rather than round it into either.
//
// Every region shown is derived from its inequality. No lesson types an
// interval, an endpoint, a shaded side or a boundary equation.
// ===========================================================================

import type { AuthoredSection } from './authoredSection';
import { type L, makeLesson } from './class11Lesson';
import {
  type OneVarInequality, applyTransform, boundaryEquation, describeHalfPlane, describeRay,
  halfPlane, halfPlaneRegion, numberLineRegion, oneVar, relationSymbol, relationWords,
  solve, system,
} from './inequality';

export const INQ_C11_CHAPTER_ID = 'ncert_kemh1_ch05';
const BOOK = 'Mathematics, Textbook for Class XI (NCERT, Reprint 2026-27)';

const source = (sec: string, title: string, page: number) => ({
  officialChapterId: INQ_C11_CHAPTER_ID,
  officialSectionId: `ncert_kemh1_s${sec.replace(/\./g, '_')}`,
  sectionNumber: sec, exactTitle: title, startPage: page,
  textbook: BOOK, sourceReference: 'kemh1', inspectionDate: '2026-10-26',
});

/**
 * FO-6 has NO NCERT owner. The id below is a chapter-less sentinel, not a
 * chapter: it carries the grade so the catalogue can place the lesson, and
 * nothing about it claims a textbook chapter. The same shape the induction
 * prerequisite uses — but with a different ROLE, declared below.
 */
export const INQ_C11_CHAPTERLESS_ID = 'cbse_fo6_c11_two_variable_inequalities';

const cbseSource = () => ({
  officialChapterId: INQ_C11_CHAPTERLESS_ID,
  sourceKind: 'cbse_only' as const,
  // Empty: there is no NCERT section, and inventing one would be a lie.
  officialSectionId: '',
  cbseEntryId: 'FO-6',
  sectionNumber: '',
  exactTitle: 'Graphical solution of linear inequalities in two variables',
  startPage: 0,
  textbook: 'CBSE Class XI syllabus, Unit II — no NCERT chapter owner',
  sourceReference: 'cbse_fo6',
  inspectionDate: '2026-10-26',
});

const lesson = (l: L): AuthoredSection =>
  makeLesson(l, (l as { id: string }).id.startsWith('cbse_') ? (() => cbseSource() as never) : source);

// --- canonical objects, every value derived -------------------------------
export const STRICT: OneVarInequality = oneVar('strict', 1, 0, '>', 3);
export const WEAK: OneVarInequality = oneVar('weak', 1, 0, '>=', 3);
export const NEGATIVE: OneVarInequality = oneVar('neg', -2, 0, '<', 6);
export const SOLVED_NEG = applyTransform(NEGATIVE, { op: 'multiply', value: -0.5 });
export const UPPER: OneVarInequality = oneVar('upper', 3, 2, '<=', 11);

export const H_SUM = halfPlane('h_sum', 1, 1, '<=', 4);
export const H_VERTICAL = halfPlane('h_vertical', 1, 0, '>', 2);
export const H_THROUGH_ORIGIN = halfPlane('h_origin', 1, -1, '>=', 0);
export const SYSTEM = system('inq_system', [H_SUM, H_VERTICAL]);

const VIEW = { xMin: -6, xMax: 6, yMin: -6, yMax: 6 };

export const V_STRICT = numberLineRegion('v_strict', STRICT, -2, 8,
  `The solution set of x ${relationSymbol(STRICT.relation)} 3`,
  `A number line from -2 to 8 with an open circle at 3 and the line shaded to the right. The circle is open because 3 does not satisfy x > 3, and the shading shows ${describeRay(STRICT)}.`);
export const V_WEAK = numberLineRegion('v_weak', WEAK, -2, 8,
  `The solution set of x ${relationSymbol(WEAK.relation)} 3`,
  `The same number line with a filled circle at 3 and shading to the right. The circle is filled because 3 does satisfy x is greater than or equal to 3, showing ${describeRay(WEAK)}.`);
export const V_SOLVED = numberLineRegion('v_solved', SOLVED_NEG, -8, 4,
  'The solution set after dividing by a negative number',
  `A number line from -8 to 4 with an open circle at ${solve(NEGATIVE).boundary} and shading to the right, showing ${describeRay(SOLVED_NEG)}. Dividing by a negative turned the original less-than into a greater-than, which is why the shading runs right rather than left.`);
export const V_UPPER = numberLineRegion('v_upper', UPPER, -4, 6,
  `The solution set of 3x + 2 ${relationSymbol(UPPER.relation)} 11`,
  `A number line from -4 to 6 with a filled circle at ${solve(UPPER).boundary} and shading to the left, showing ${describeRay(UPPER)}. The circle is filled because the relation allows equality.`);

export const V_HALF = halfPlaneRegion('v_half', [H_SUM], VIEW,
  `The half-plane satisfying x + y ${relationSymbol(H_SUM.relation)} 4`,
  `A coordinate plane from -6 to 6 on both axes with the solid line ${boundaryEquation(H_SUM)} drawn across it and the region below and left of that line shaded. The line is solid because the relation allows equality, and the shaded side is ${describeHalfPlane(H_SUM)}.`);
export const V_VERTICAL = halfPlaneRegion('v_vertical', [H_VERTICAL], VIEW,
  `The half-plane satisfying x ${relationSymbol(H_VERTICAL.relation)} 2`,
  `A coordinate plane with the dashed vertical line ${boundaryEquation(H_VERTICAL)} and everything to its right shaded. The line is dashed because the relation is strict, so points on it do not satisfy the inequality. A vertical boundary has no slope, which is why the line is given in general form.`);
export const V_SYSTEM = halfPlaneRegion('v_system', [H_SUM, H_VERTICAL], VIEW,
  'The region satisfying both inequalities at once',
  `A coordinate plane showing both boundary lines, ${boundaryEquation(H_SUM)} solid and ${boundaryEquation(H_VERTICAL)} dashed, with only the overlap of their two half-planes shaded. Every point in the shaded wedge satisfies both inequalities; a point satisfying just one of them lies outside it.`);

export const C11_INQ_SECTIONS: AuthoredSection[] = [

lesson({ id:'ncert_kemh1_s5_2_inequalities_lesson', sec:'5.2', title:'Inequalities', page:98,
 assume:['Equations and their solutions','Comparing numbers'],
 notIntroduce:[['Solving inequalities algebraically','ncert_kemh1_s5_3']],
 goal:'You will tell a strict inequality from a weak one and say what its solution set is.',
 checks:['Say which of two numbers is larger.','Check whether a value satisfies an equation.'],
 ifNot:'Revisit comparing numbers; an inequality compares rather than equates.',
 representationFamilies:[],
 vocab:[['inequality','A statement that one quantity is less than or greater than another.'],
  ['strict inequality','One using < or >, where the two sides are never equal.'],
  ['weak inequality','One using \u2264 or \u2265, where equality is allowed.'],
  ['solution set','The set of all values that make the statement true.']],
 expl:[`An equation such as x = 3 is satisfied by one number. An inequality such as x ${relationSymbol(STRICT.relation)} 3 is satisfied by many: 4 works, so does 3.5, so does 1000.`,
  `That is the first thing to notice. An inequality usually has no single answer, and asking "what is x?" is the wrong question. The right one is: which values make it true?`,
  `Those values together form the solution set. For x ${relationSymbol(STRICT.relation)} 3 it is ${describeRay(STRICT)}.`,
  `The symbol matters at exactly one point: the boundary. In x ${relationSymbol(STRICT.relation)} 3 the value 3 does not satisfy the statement, because 3 is not greater than itself. These are the strict inequalities, < and >.`,
  `In x ${relationSymbol(WEAK.relation)} 3 the value 3 does satisfy it, because the symbol allows equality. These are the weak ones, \u2264 and \u2265, and their solution sets include the boundary.`,
  `So the two statements differ by a single number, 3 — and in every other respect agree. Testing the boundary is the way to tell them apart, and it is where mistakes happen.`,
  `Checking a candidate is simple: put the value in and see whether the statement is true. For x ${relationSymbol(STRICT.relation)} 3, the value 2 gives a false statement, 3 gives a false statement, and 4 gives a true one.`],
 rep:['The inequality symbols, with the boundary value tested on each side'],
 we:[{id:'s52.we1',prompt:`Which of 2, 3 and 4 satisfy x ${relationSymbol(STRICT.relation)} 3?`,steps:[['Put each value into the statement in turn.','Checking is substitution, nothing more.'],[`2 ${relationWords(STRICT.relation)} 3 is false; 3 ${relationWords(STRICT.relation)} 3 is false.`,'A number is not greater than itself.'],[`4 ${relationWords(STRICT.relation)} 3 is true.`,`So only 4 of the three belongs to the solution set.`]],answer:'Only 4.'},
  {id:'s52.we2',prompt:`How does the answer change for x ${relationSymbol(WEAK.relation)} 3?`,steps:[['The symbol now allows equality.','That changes the boundary and nothing else.'],[`3 ${relationWords(WEAK.relation)} 3 is true.`,'So 3 now belongs.'],['2 is still outside and 4 is still inside.','The two statements differ by exactly one number.']],answer:'3 and 4 both satisfy it.'},
  {id:'s52.we3',prompt:'Why does an inequality not have a single answer?',steps:[['An equation names a value; an inequality names a comparison.','Many values can compare the same way.'],[`Every number past 3 satisfies x ${relationSymbol(STRICT.relation)} 3.`,'There is no largest one to report.'],['So the answer is a set, not a number.','That set is what the rest of the chapter finds and draws.']],answer:'Because many values satisfy the comparison, so the answer is a set.'}],
 g:[{id:'s52.g1',prompt:'Which symbols are strict?',hint:'Which exclude equality?',answer:'< and >.',why:'They never allow the two sides to be equal.'},
  {id:'s52.g2',prompt:`Does 3 satisfy x ${relationSymbol(WEAK.relation)} 3?`,hint:'Does the symbol allow equality?',answer:'Yes.',why:'The weak symbol permits the two sides to be equal.'},
  {id:'s52.g3',prompt:'What is a solution set?',hint:'One value or many?',answer:'The set of all values making the statement true.',why:'An inequality is usually satisfied by many values.'}],
 i:[{id:'s52.i1',prompt:'Does 5 satisfy x < 5?',answer:'No.',why:'The symbol is strict, so equality does not count.'},
  {id:'s52.i2',prompt:'Does 5 satisfy x \u2264 5?',answer:'Yes.',why:'The weak symbol allows equality.'},
  {id:'s52.i3',prompt:'Is x > 1 satisfied by more than one value?',answer:'Yes.',why:'Every number past 1 satisfies it.'},
  {id:'s52.i4',prompt:'Where do a strict and a weak inequality with the same boundary differ?',answer:'Only at the boundary value itself.',why:'Everywhere else the two statements agree.'}],
 td:[{id:'s52.td1',prompt:'Why does so much depend on one value at the boundary, when every other number behaves the same in both statements?',reasoning:'Because the boundary is the only place the two statements can be told apart, which makes it the only place an error shows. Everywhere else a mistake about strict versus weak is invisible — 4 and 1000 satisfy both forms — so a student can carry the confusion a long way without it costing anything, and then meet it at exactly the moment it matters. That is also why the picture of a solution set marks the boundary specially rather than just shading: the shading agrees in both cases, and only the endpoint carries the distinction.'}],
 summary:`An inequality is usually satisfied by many values, and those values form its solution set. Strict symbols, < and >, exclude the boundary: 3 does not satisfy x ${relationSymbol(STRICT.relation)} 3. Weak symbols, \u2264 and \u2265, include it. The two forms differ at the boundary and nowhere else, so testing that value is how to tell them apart.`,
 next:'Next you will find the solution set by solving, and draw it.',
 t:['Distinguish strict from weak and describe a solution set.',['Comparing numbers'],['"which values make it true", instead of "what is x"'],['Test the boundary value explicitly every time; it is the only place the two forms differ.','Resist giving a single number as an answer — the set is the answer.'],['Ask whether the boundary satisfies the statement.'],['Substitute candidates rather than reasoning in the abstract.'],['Ask why there is no single answer.']]} as unknown as L),

lesson({ id:'ncert_kemh1_s5_3_one_variable_lesson', sec:'5.3', title:'Algebraic Solutions of Linear Inequalities in One Variable and their Graphical Representation', page:100,
 prereq:['ncert_kemh1_s5_2'], assume:['Strict and weak inequalities','Solving linear equations'],
 goal:'You will solve a linear inequality in one variable and draw its solution on a number line.',
 checks:['Solve a linear equation.','Say whether a symbol is strict or weak.'],
 ifNot:'Revisit solving equations; the steps are the same with one exception.',
 representationFamilies:['region:number_line'],
 visuals:[V_STRICT, V_WEAK, V_SOLVED, V_UPPER],
 vocab:[['number line','A line on which the solution set is shaded, with the boundary marked open or closed.']],
 expl:[`Solving an inequality works like solving an equation: do the same thing to both sides until x stands alone. Adding or subtracting the same quantity, and multiplying or dividing by a positive number, all leave the solution set unchanged.`,
  `Take 3x + 2 ${relationSymbol(UPPER.relation)} 11. Subtract 2 from both sides, then divide by 3, and the solution is ${describeRay(UPPER)}.`,
  `One operation does not behave. Multiplying or dividing both sides by a NEGATIVE number reverses the relation: < becomes >, and \u2264 becomes \u2265.`,
  `Why: 2 is less than 5, but multiplying both by \u22121 gives \u22122 and \u22125, and \u22122 is the larger. Multiplying by a negative flips the order of every pair of numbers, so the symbol recording that order has to flip too.`,
  `So for \u22122x ${relationSymbol(NEGATIVE.relation)} 6, dividing by \u22122 gives ${describeRay(SOLVED_NEG)} — a greater-than, from a statement that began as a less-than.`,
  `The check is not to remember the rule but to test a value. ${solve(NEGATIVE).boundary - 1} does not satisfy the original, and ${solve(NEGATIVE).boundary + 1} does, which agrees with the solution found.`,
  `The solution is then drawn on a number line: the boundary marked, and everything satisfying the inequality shaded. The mark is an open circle for a strict relation and a filled one for a weak relation — the same distinction from the previous lesson, now visible.`],
 rep:['A number line with the boundary marked open or closed and the solution shaded'],
 we:[{id:'s53.we1',prompt:`Solve 3x + 2 ${relationSymbol(UPPER.relation)} 11 and draw it.`,steps:[['Subtract 2 from both sides.','Adding or subtracting never changes the relation.'],['Divide both sides by 3, which is positive.',`So the relation stays as it was, giving x ${relationSymbol(UPPER.relation)} ${solve(UPPER).boundary}.`],[`On the number line, a filled circle at ${solve(UPPER).boundary} with shading to the left.`,'Filled, because the relation allows equality.']],answer:`${describeRay(UPPER)}`},
  {id:'s53.we2',prompt:`Solve \u22122x ${relationSymbol(NEGATIVE.relation)} 6.`,steps:[['Divide both sides by \u22122.','The divisor is negative, so the relation reverses.'],[`That gives ${describeRay(SOLVED_NEG)}.`,'A less-than became a greater-than.'],[`Checking: ${solve(NEGATIVE).boundary + 1} satisfies the original and ${solve(NEGATIVE).boundary - 1} does not.`,'The test confirms the direction rather than trusting memory.']],answer:describeRay(SOLVED_NEG)},
  {id:'s53.we3',prompt:'Why does multiplying by a negative reverse the relation?',steps:[['Take a true comparison: 2 is less than 5.','A concrete pair is enough to see it.'],['Multiply both by \u22121: \u22122 and \u22125.','Now \u22122 is the larger of the two.'],['Multiplying by a negative reverses the order of every pair.','So the symbol recording that order must reverse too.']],answer:'Because multiplying by a negative reverses the order of every pair of numbers.'}],
 g:[{id:'s53.g1',prompt:'Which operation reverses the relation?',hint:'Which sign?',answer:'Multiplying or dividing by a negative number.',why:'It reverses the order of every pair of numbers.'},
  {id:'s53.g2',prompt:'Does subtracting 5 from both sides change the relation?',hint:'Does it reorder numbers?',answer:'No.',why:'Adding or subtracting shifts both sides equally.'},
  {id:'s53.g3',prompt:'When is the circle on the number line filled?',hint:'Which symbols?',answer:'When the relation is weak, \u2264 or \u2265.',why:'The boundary value belongs to the solution set.'}],
 i:[{id:'s53.i1',prompt:'Solve x + 4 > 7.',answer:'Values greater than 3, with 3 excluded.',why:'Subtracting 4 leaves the relation unchanged.'},
  {id:'s53.i2',prompt:'Solve \u2212x \u2265 2.',answer:'Values less than or equal to \u22122.',why:'Dividing by \u22121 reverses the relation.'},
  {id:'s53.i3',prompt:'A student solves \u22122x < 6 as x < \u22123. What went wrong?',answer:'The relation was not reversed.',why:'Dividing by a negative reverses it, giving x > \u22123.'},
  {id:'s53.i4',prompt:'How would you check a solved inequality without redoing the algebra?',answer:'Test a value on each side of the boundary.',why:'The solution must agree with the original statement.'}],
 td:[{id:'s53.td1',prompt:'The sign-reversal rule is usually just memorised. What is lost by learning it that way?',reasoning:'The ability to catch yourself. A memorised rule gives no signal when it has been forgotten — the algebra still produces an answer, and a wrong one looks exactly like a right one. Understanding that a negative multiplier reverses the order of every pair of numbers turns the rule into something you can rederive in a second from 2 and 5, and it also tells you where the rule does not apply, which memorisation never does. The habit of testing a value either side of the boundary is the same instinct: it checks the meaning rather than the procedure.'}],
 summary:`Solving a linear inequality follows the same steps as an equation, with one exception: multiplying or dividing by a NEGATIVE reverses the relation, because a negative multiplier reverses the order of every pair of numbers. So \u22122x ${relationSymbol(NEGATIVE.relation)} 6 gives ${describeRay(SOLVED_NEG)}. The solution is drawn on a number line, the boundary open for a strict relation and filled for a weak one.`,
 next:'Next you will take an inequality into two variables.',
 t:['Solve one-variable inequalities, handle sign reversal, and draw the solution.',['Strict and weak','Solving equations'],['"reverses the order", as the reason for the flip'],['Derive the reversal from 2 and 5 rather than stating it; a rederivable rule survives being forgotten.','Test a value either side of the boundary after every solution.'],['Ask what went wrong in a missing-reversal answer.'],['Check the divisor sign before dividing.'],['Ask when the circle is filled.']]} as unknown as L),

lesson({ id:'cbse_fo6_half_plane_lesson', sec:'', title:'Graphical solution of linear inequalities in two variables', page:0,
 /**
  * Instructionally required, but a prerequisite for nothing. The role is
  * declared rather than inferred, so the catalogue counts it truthfully
  * without a rule written around this one lesson.
  */
 chapterlessRole:'required_core',
 prereq:['ncert_kemh1_s5_3'], assume:['Solving one-variable inequalities','Plotting points on a coordinate plane'],
 goal:'You will shade the half-plane satisfying a two-variable inequality and find the region satisfying a system.',
 checks:['Plot a point from its coordinates.','Say whether a relation is strict or weak.'],
 ifNot:'Revisit the coordinate plane and the previous lesson; both are used in every step here.',
 representationFamilies:['region:half_plane'],
 visuals:[V_HALF, V_VERTICAL, V_SYSTEM],
 vocab:[['boundary line','The line where the two sides are equal.'],
  ['half-plane','All the points on one side of that line.'],
  ['system','Several inequalities that must hold at once.']],
 expl:[`With one variable the solution set was part of a line. With two variables, x and y, a point needs both coordinates, so the solution set is part of the plane.`,
  `Take x + y ${relationSymbol(H_SUM.relation)} 4. Replacing the relation with an equals sign gives the boundary line ${boundaryEquation(H_SUM)}, which divides the plane in two.`,
  `Every point on one side satisfies the inequality and every point on the other does not. Which side is which is settled by testing a single point: (0, 0) gives 0 ${relationWords(H_SUM.relation)} 4, which is true, so the side containing the origin is the solution.`,
  `One point decides the whole side, because the two sides cannot be mixed — crossing the boundary is the only way the comparison can change.`,
  `The origin is convenient but not always available. For ${boundaryEquation(H_THROUGH_ORIGIN)} the line passes through (0, 0), so the origin is on the boundary and settles nothing. Any other point off the line does instead.`,
  `The boundary itself belongs to the solution set only when the relation is weak, exactly as the endpoint did on the number line. A solid line shows it is included, a dashed line that it is not — and the written description says which, since a line style alone is easy to miss.`,
  `A boundary need not be slanted. x ${relationSymbol(H_VERTICAL.relation)} 2 has boundary ${boundaryEquation(H_VERTICAL)}, a vertical line, and the inequality says nothing about y at all: every point far enough to the right satisfies it, whatever its height.`,
  `A system asks for several inequalities at once. A point belongs only if it satisfies every one of them, so the region is where the half-planes OVERLAP — the intersection, not everything either one covers.`,
  `For x + y ${relationSymbol(H_SUM.relation)} 4 together with x ${relationSymbol(H_VERTICAL.relation)} 2, the point (3, 0) satisfies both and belongs. The point (0, 0) satisfies the first but not the second, so it is outside the region even though one inequality holds there.`],
 rep:['A coordinate plane with the boundary line drawn and the satisfying side shaded'],
 we:[{id:'fo6.we1',prompt:`Shade the region satisfying x + y ${relationSymbol(H_SUM.relation)} 4.`,steps:[[`Draw the boundary ${boundaryEquation(H_SUM)}.`,'Replacing the relation with equals gives the dividing line.'],['Test the origin: 0 + 0 = 0, and that satisfies the inequality.','So the side containing (0, 0) is the solution.'],[`Shade that side, with the line solid because the relation allows equality.`,`The region is ${describeHalfPlane(H_SUM)}.`]],answer:describeHalfPlane(H_SUM)},
  {id:'fo6.we2',prompt:`Shade the region satisfying x ${relationSymbol(H_VERTICAL.relation)} 2.`,steps:[[`The boundary is ${boundaryEquation(H_VERTICAL)}, a vertical line.`,'There is no y term, so y is unrestricted.'],['Test (0, 0): 0 is not greater than 2, so the origin fails.','The solution is the other side.'],['Shade to the right, with the line dashed because the relation is strict.','Points on the line itself do not satisfy it.']],answer:'Everything to the right of x = 2, the line excluded.'},
  {id:'fo6.we3',prompt:'Find the region satisfying both inequalities.',steps:[['Shade each half-plane separately.','Each has its own boundary and its own satisfying side.'],['Keep only what both have shaded.','A point must satisfy every inequality to belong.'],[`So (3, 0) belongs and (0, 0) does not, even though (0, 0) satisfies the first.`,'The region is the overlap, not everything either covers.']],answer:'The overlap of the two half-planes.'}],
 g:[{id:'fo6.g1',prompt:'How do you find the boundary line?',hint:'Change one symbol.',answer:'Replace the relation with an equals sign.',why:'The boundary is where the two sides are equal.'},
  {id:'fo6.g2',prompt:'When can the origin not be used as a test point?',hint:'Where might it lie?',answer:'When the boundary line passes through it.',why:'A point on the boundary does not tell you which side satisfies the inequality.'},
  {id:'fo6.g3',prompt:'Is a system\u2019s region the overlap or everything covered?',hint:'Must all hold?',answer:'The overlap.',why:'A point must satisfy every inequality in the system.'}],
 i:[{id:'fo6.i1',prompt:'What is the boundary line of 2x \u2212 y \u2265 6?',answer:'2x \u2212 y = 6.',why:'Replace the relation with an equals sign.'},
  {id:'fo6.i2',prompt:'Should the boundary be solid or dashed for x + y < 4?',answer:'Dashed.',why:'The relation is strict, so the line is excluded.'},
  {id:'fo6.i3',prompt:'A point satisfies one inequality of a system but not the other. Is it in the region?',answer:'No.',why:'Every inequality must hold.'},
  {id:'fo6.i4',prompt:'Does the solution region stop at the edge of the drawn axes?',answer:'No.',why:'The drawing is clipped; the region itself continues.'}],
 td:[{id:'fo6.td1',prompt:'Why does testing one point settle an entire half of the plane?',reasoning:'Because the comparison can only change by crossing the boundary. Move a point anywhere on one side — far away, close in — and the quantity ax + by moves continuously, so to go from satisfying the inequality to failing it that quantity must pass through the boundary value. If the path never crosses the line, the verdict never changes. That is why one test point is not a sample but a proof for its whole side, and it is also why a point ON the line tells you nothing: it is sitting exactly where the verdict changes.'},
  {id:'fo6.td2',prompt:'The shaded region runs off the edge of the picture. Is the solution set unbounded, or is the drawing just small?',reasoning:'Both, and the distinction matters. The solution set of x + y \u2264 4 genuinely has no edge — it contains points arbitrarily far down and to the left, and no drawing could ever show all of it. What appears on screen is that set cut down to the viewing rectangle. So the polygon you see is not the solution; it is a window onto it, and the part outside the window is as much a part of the answer as the part inside. Reading the picture as the whole answer is how an unbounded region gets mistaken for a bounded one.'}],
 summary:`A two-variable inequality divides the plane along its boundary line, found by replacing the relation with an equals sign. One test point off that line settles which side satisfies it: for x + y ${relationSymbol(H_SUM.relation)} 4 the origin works, but for ${boundaryEquation(H_THROUGH_ORIGIN)} it lies on the line and another point is needed. The boundary belongs only when the relation is weak. A system's region is where the half-planes overlap, since every inequality must hold.`,
 next:'Later work uses these regions when several conditions must hold at once.',
 t:['Shade a half-plane from a test point and find a system\u2019s region as an overlap.',['One-variable inequalities','Coordinate plane'],['"which side", settled by one tested point'],['Test the origin first but check it is off the line; the habit prevents the commonest error.','Say overlap, not "both shaded" — a system is an intersection and the word should carry that.'],['Ask whether a point satisfying one inequality belongs to the system.'],['Find the boundary before shading anything.'],['Ask what lies beyond the edge of the picture.']]} as unknown as L),

];
