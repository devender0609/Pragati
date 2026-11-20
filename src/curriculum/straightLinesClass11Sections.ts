// ===========================================================================
// v0.84.0-c11.13 checkpoint 84 — CLASS 11 CHAPTER 9, STRAIGHT LINES.
//
// One line object drives every form, every slope, every graph and every
// distance in these six lessons. Section 9.3 carries both summative and
// formative material, so its two halves are separate scope fragments and
// stay apart.
// ===========================================================================

import type { AuthoredSection } from './authoredSection';
import { type L, makeLesson } from './class11Lesson';
import { pt, rational, formatRational, formatRadical, formatPoint } from './coordinateGeometry';
import { formatAngle } from './angleMeasure';
import {
  distanceFromOrigin as distanceFromOriginOf,
  areParallel, arePerpendicular, axisParallelForm, describeAngleBetween, distanceToLine,
  formatSlope, generalForm, horizontalLine, inclination, interceptForm, intercepts,
  line, lineGraph, lineThrough, pointIsOn, pointSlopeForm,
  slopeInterceptForm, slopeOf, slopeThrough, sameLine, tanAngleBetween, verticalLine,
} from './straightLine';

export const STL_C11_CHAPTER_ID = 'ncert_kemh1_ch09';
const BOOK = 'Mathematics, Textbook for Class XI (NCERT, Reprint 2026-27)';
const SRC = 'kemh1';
const INSPECTED = '2026-10-26';

const source = (sec: string, title: string, page: number) => {
  const parts = sec.split('.');
  const parent = parts.length > 2 ? parts.slice(0, 2).join('.') : sec;
  return {
    officialChapterId: STL_C11_CHAPTER_ID,
    officialSectionId: `ncert_kemh1_s${parent.replace(/\./g, '_')}`,
    ...(parts.length > 2 ? { officialSubsectionNumber: sec } : {}),
    sectionNumber: parent, exactTitle: title, startPage: page,
    textbook: BOOK, sourceReference: SRC, inspectionDate: INSPECTED,
  };
};

/** §9.3 changes assessment status partway through; both halves keep the parent. */
const fragmentSource = (sec: string, title: string, page: number, fragmentId: string) => ({
  officialChapterId: STL_C11_CHAPTER_ID,
  sourceKind: 'scope_fragment' as const,
  officialSectionId: `ncert_kemh1_s${sec.replace(/\./g, '_')}`,
  scopeFragmentId: fragmentId,
  sectionNumber: sec, exactTitle: title, startPage: page,
  textbook: BOOK, sourceReference: SRC, inspectionDate: INSPECTED,
});

const lesson = (l: L): AuthoredSection => makeLesson(l, source, fragmentSource);

// --- canonical objects, derived once --------------------------------------
export const P_A = pt('A', 1, 2, 'A');
export const P_B = pt('B', 4, 8, 'B');
export const L_AB = lineThrough('L_AB', P_A, P_B, 'AB');
export const L_VERT = verticalLine('L_vert', rational(3, 1), 'x = 3');
export const L_HORZ = horizontalLine('L_horz', rational(-2, 1), 'y = -2');
export const L_DIAG = line('L_diag', 1, -1, 0, 'y = x');
export const L_ANTI = line('L_anti', 1, 1, 0, 'y = -x');
export const L_INT = line('L_int', 2, 3, -6, '2x + 3y - 6 = 0');
export const L_345 = line('L_345', 3, 4, -5, '3x + 4y - 5 = 0');
export const P_ORIGIN = pt('O', 0, 0, 'O');
export const P_Q = pt('Q', 2, 1, 'Q');

const S = (l: typeof L_AB) => formatSlope(slopeOf(l));

/**
 * Renders a model check in words. Interpolating the boolean itself would put
 * "true" in front of a student, which is an implementation detail rather than
 * mathematics — the same defect a null leak was at checkpoint 81.
 */
const confirms = (ok: boolean, yes: string, no: string): string => (ok ? yes : no);

export const G_SLOPE = lineGraph('g_slope', [L_AB],
  `A coordinate grid with the line through ${formatPoint(P_A)} and ${formatPoint(P_B)} drawn across it. Both points are marked. Going from the first to the second, x increases by 3 and y increases by 6, so the line rises twice as fast as it runs and its slope is ${S(L_AB)}.`,
  { markedPoints: [P_A, P_B] });

export const G_AXIS = lineGraph('g_axis', [L_VERT, L_HORZ],
  `A coordinate grid showing two lines parallel to the axes. The solid line is ${axisParallelForm(L_VERT)}, running straight up and down so that every point on it has the same x-coordinate and it has no slope at all. The dashed line is ${axisParallelForm(L_HORZ)}, running flat so that every point has the same y-coordinate and its slope is ${S(L_HORZ)}.`,
  { span: 6 });

export const G_PERP = lineGraph('g_perp', [L_DIAG, L_ANTI],
  `A coordinate grid showing two lines crossing at the origin at right angles. The solid line is ${generalForm(L_DIAG)}, rising from lower left to upper right with slope ${S(L_DIAG)}. The dashed line is ${generalForm(L_ANTI)}, falling from upper left to lower right with slope ${S(L_ANTI)}. The product of the two slopes is minus one, which is what makes them perpendicular.`);

export const G_DISTANCE = lineGraph('g_distance', [L_345],
  `A coordinate grid with the line ${generalForm(L_345)} drawn across it and the point ${formatPoint(P_Q)} marked away from it. The shortest route from the point to the line is the perpendicular one, and its length is ${formatRadical(distanceToLine(L_345, P_Q))}.`,
  { externalPoints: [P_Q] });

export const CANONICAL_LINE_GRAPHS = [G_SLOPE, G_AXIS, G_PERP, G_DISTANCE];

export const C11_STL_SECTIONS: AuthoredSection[] = [

lesson({ id:'ncert_kemh1_s9_2_slope_lesson', sec:'9.2', title:'Slope of a Line', page:150,
 assume:['Coordinates, distance and midpoint from Class 10','Tangent of an angle'],
 notIntroduce:[['The angle between two lines','ncert_kemh1_s9_2_1'],['Equations of lines','ncert_kemh1_s9_3']],
 goal:'You will measure the steepness of a line as a ratio of two changes, and see why a vertical line has no slope at all.',
 checks:['Find the distance between two points.','Say what tan of an angle means.'], ifNot:'Revisit coordinates from Class 10; slope is built from the same two coordinates.',
 vocab:[['slope','The ratio of the change in y to the change in x between two points of a line.'],
  ['angle of inclination','The angle a line makes with the positive direction of the x-axis, measured anticlockwise.']],
 expl:[`Class 10 gave the coordinate plane distance, midpoint and the section formula. All three describe where points are. Slope describes which way a line goes.`,
  `Take two points of a line. Going from ${formatPoint(P_A)} to ${formatPoint(P_B)}, x increases by 3 and y increases by 6. The slope is the ratio of those changes, ${S(L_AB)}, which says the line rises twice as fast as it runs.`,
  `In general, for points (x\u2081, y\u2081) and (x\u2082, y\u2082) the slope is (y\u2082 \u2212 y\u2081)/(x\u2082 \u2212 x\u2081). It does not matter which point is taken first: reversing both differences reverses both signs and leaves the ratio alone.`,
  `A horizontal line has slope ${S(L_HORZ)}, because y never changes however far you travel along it.`,
  `A vertical line is different in kind. For ${axisParallelForm(L_VERT)} every point has the same x-coordinate, so the denominator of the ratio is zero and the slope is ${S(L_VERT)}. This is not a very large slope; it is no slope. The line is perfectly respectable, and it is the ratio that fails to exist.`,
  `Slope also connects to direction. If \u03b8 is the angle the line makes with the positive x-axis, measured anticlockwise, then the slope is tan \u03b8. For ${generalForm(L_DIAG)} the inclination is ${formatAngle(inclination(L_DIAG))} and tan of that is ${S(L_DIAG)}. For a vertical line the inclination is ${formatAngle(inclination(L_VERT))}, where tan has no value — which is the same fact arriving from the other direction.`],
 rep:['A line drawn through two marked points, with the horizontal run and the vertical rise marked as the two changes whose ratio is the slope'],
 visuals:[G_SLOPE, G_AXIS],
 we:[{id:'s92.we1',prompt:`Find the slope of the line through ${formatPoint(P_A)} and ${formatPoint(P_B)}.`,steps:[['Find the change in y: 8 \u2212 2 = 6.','The rise is the difference of the second coordinates, taken in a consistent order.'],['Find the change in x: 4 \u2212 1 = 3.','The run uses the same order, which is what keeps the sign of the ratio meaningful.'],[`The slope is the ratio, ${S(L_AB)}.`,'The ratio is exact and stays a rational number rather than becoming a decimal.']],answer:S(L_AB)},
  {id:'s92.we2',prompt:`Find the slope of the line through ${formatPoint(pt('V1',3,1,'V1'))} and ${formatPoint(pt('V2',3,7,'V2'))}.`,steps:[['The change in y is 6, but the change in x is 3 \u2212 3 = 0.','Both points have the same x-coordinate, so the line runs straight up and down.'],[`A ratio with denominator zero has no value, so the slope is ${formatSlope(slopeThrough(pt('V1',3,1,'V1'), pt('V2',3,7,'V2')))}.`,'The line exists and is perfectly definite; it is the slope that does not.'],['Writing an infinite slope would claim a number where there is none.','Steepness beyond any bound is not the same as a value, and the difference matters when slopes are later multiplied and compared.']],answer:'The slope is not defined.'},
  {id:'s92.we3',prompt:'Does it matter which of the two points you take first?',steps:[['Taking them the other way round negates the change in y.','The rise becomes its own negative, so the numerator of the ratio changes sign.'],['It also negates the change in x.','Both differences are reversed by the same swap, so neither one changes the ratio on its own.'],['A ratio of two negated quantities is unchanged, so the slope is the same.','This is why no rule is needed about which point to call the first.']],answer:'No; both differences change sign and the ratio is unaffected.'}],
 g:[{id:'s92.g1',prompt:`What is the slope of ${axisParallelForm(L_HORZ)}?`,hint:'How much does y change along it?',answer:S(L_HORZ),why:'Every point has the same y-coordinate, so the rise is zero however far you travel and the ratio is zero.'},
  {id:'s92.g2',prompt:'A line has inclination 45 degrees. What is its slope?',hint:'Slope is tan of the inclination.',answer:S(L_DIAG),why:'tan 45 degrees is 1, so the line rises exactly as fast as it runs.'},
  {id:'s92.g3',prompt:`Why does ${axisParallelForm(L_VERT)} have no slope?`,hint:'What is the denominator?',answer:'Because the change in x between any two of its points is zero.',why:'The slope is a ratio, and a ratio with zero denominator has no value at all.'}],
 i:[{id:'s92.i1',prompt:'Find the slope of the line through (0, 0) and (5, -2).',answer:formatSlope(slopeThrough(pt('O',0,0,'O'), pt('R',5,-2,'R'))),why:'The rise is \u22122 and the run is 5, so the line falls as it goes right, which the negative slope records.'},
  {id:'s92.i2',prompt:'What does a negative slope tell you about a line?',answer:'It falls from left to right.',why:'A positive run accompanied by a negative rise means y decreases as x increases.'},
  {id:'s92.i3',prompt:'Two points have the same y-coordinate. What is the slope of the line through them?',answer:'0.',why:'The rise is zero while the run is not, so the ratio is zero and the line is horizontal.'},
  {id:'s92.i4',prompt:'Can a line have slope 0 and also be vertical?',answer:'No.',why:'A slope of 0 means y never changes, which is horizontal; a vertical line has no slope at all, and the two cases are opposites rather than variants.'}],
 td:[{id:'s92.td1',prompt:'Why is it better to say a vertical line has no slope than to say its slope is infinite?',reasoning:'Because infinity is not a number, and slope is defined as a number: a ratio of two real changes. Calling it infinite invites arithmetic that cannot be done — multiplying it by another slope to test perpendicularity, for instance, or substituting it into y = mx + c. Saying the slope is undefined records the situation accurately and warns that the usual formulas do not apply, which is exactly what a vertical line needs.'}],
 summary:`The slope of a line is the ratio of the change in y to the change in x, exact and independent of which point is taken first: ${S(L_AB)} for the line through ${formatPoint(P_A)} and ${formatPoint(P_B)}. A horizontal line has slope ${S(L_HORZ)}; a vertical line has no slope, because the denominator is zero. Slope is also tan of the angle of inclination.`,
 next:'Next you will use slopes to compare two lines.',
 t:['Compute slopes exactly and recognise the vertical case as undefined rather than infinite.',['Class 10 coordinates','Tangent'],['"no slope" rather than "infinite slope", every time'],['The vertical case is the single most important idea here and recurs in every later lesson of the chapter.','Keep slopes as exact fractions; decimals obscure the ratio and cause trouble in the perpendicularity test later.'],['Ask for the slope of a line through two points with equal x-coordinates.'],['Mark the rise and the run on the grid before writing the ratio.'],['Ask what inclination gives a slope of \u22121.']]} as unknown as L),

lesson({ id:'ncert_kemh1_s9_2_1_angle_between_lines_lesson', sec:'9.2.1', title:'Angle between Two Lines', page:153,
 prereq:['ncert_kemh1_s9_2'], assume:['Slope','Angle of inclination','Tangent'],
 goal:'You will decide when two lines are parallel or perpendicular, and find the angle between them when they are neither.',
 checks:['Find the slope of a line.','Say what happens to the slope of a vertical line.'], ifNot:'Revisit slope; every test in this lesson is built from it.',
 vocab:[['parallel lines','Lines in the same direction, which therefore never meet.'],
  ['perpendicular lines','Lines meeting at a right angle.']],
 expl:[`Two lines with slopes m\u2081 and m\u2082 make an angle with each other, and the source expresses its tangent as (m\u2082 \u2212 m\u2081)/(1 + m\u2081m\u2082). The acute angle between them is the one usually wanted, so the magnitude of that value is taken.`,
  `Two conditions fall out of the formula. If the numerator is zero the slopes are equal, the tangent is zero and the lines are parallel. If the denominator is zero, so that m\u2081m\u2082 = \u22121, the tangent has no value and the angle is a right angle: the lines are perpendicular.`,
  `For ${generalForm(L_DIAG)} and ${generalForm(L_ANTI)}, the slopes are ${S(L_DIAG)} and ${S(L_ANTI)}, whose product is \u22121. So ${describeAngleBetween(L_DIAG, L_ANTI)}.`,
  `Between ${generalForm(L_DIAG)} and ${axisParallelForm(L_HORZ)} the slopes are ${S(L_DIAG)} and ${S(L_HORZ)}, and ${describeAngleBetween(L_DIAG, L_HORZ)}.`,
  `The slope formula cannot handle every case, because a vertical line has no slope to put in it. Two vertical lines are plainly parallel, and ${axisParallelForm(L_VERT)} is plainly perpendicular to ${axisParallelForm(L_HORZ)}, yet neither fact can be read off the formula.`,
  `Checked directly: two vertical lines are parallel, ${confirms(areParallel(verticalLine('v1', rational(1,1)), verticalLine('v2', rational(5,1))), 'they are parallel', 'they are not parallel')}, and the horizontal and vertical pair are perpendicular, ${confirms(arePerpendicular(L_HORZ, L_VERT), 'they meet at a right angle', 'they do not meet at a right angle')}. The geometry is not in doubt; it is the slope formula that runs out, which is a reason to notice the vertical case rather than to force it.`],
 rep:['Two pairs of lines side by side: one pair crossing at a right angle, the other never meeting'],
 visuals:[G_PERP],
 we:[{id:'s921.we1',prompt:`Are ${generalForm(L_DIAG)} and ${generalForm(L_ANTI)} perpendicular?`,steps:[[`Find both slopes: ${S(L_DIAG)} and ${S(L_ANTI)}.`,'The test is about the two slopes, so both are needed before anything is multiplied.'],['Multiply them: the product is \u22121.','This makes the denominator of the angle formula zero, so the tangent has no value.'],[`A tangent with no value corresponds to a right angle, so ${describeAngleBetween(L_DIAG, L_ANTI)}.`,'The undefined tangent is the signal, not an obstacle.']],answer:'Yes, they are perpendicular.'},
  {id:'s921.we2',prompt:`Find the angle between ${generalForm(L_DIAG)} and ${axisParallelForm(L_HORZ)}.`,steps:[[`The slopes are ${S(L_DIAG)} and ${S(L_HORZ)}.`,'One of them is zero, which is fine: zero is a slope, unlike the vertical case.'],['Substituting into the formula gives a numerator equal to the first slope and a denominator of 1.',`So the tangent of the acute angle is ${tanAngleBetween(L_DIAG, L_HORZ) ? formatRational(tanAngleBetween(L_DIAG, L_HORZ)!) : 'not defined'}, which the formula delivers without any special case.`],['An angle whose tangent is 1 is 45 degrees.','Which matches the picture: the diagonal meets the horizontal at half a right angle.']],answer:'45 degrees.'},
  {id:'s921.we3',prompt:`A student says ${axisParallelForm(L_VERT)} and ${axisParallelForm(L_HORZ)} cannot be perpendicular because one has no slope. What has gone wrong?`,steps:[['They have treated the slope formula as the definition of perpendicularity.','It is a test that works when both slopes exist, not the meaning of the word.'],['Perpendicular means meeting at a right angle, and a vertical line plainly meets a horizontal one at a right angle.',`Checked directly, they meet at a right angle: ${confirms(arePerpendicular(L_VERT, L_HORZ), 'the perpendicularity test on the coefficients confirms it', 'the test does not confirm it')}.`],['So the formula is silent here rather than giving a negative answer.','A test that cannot be applied has not reported anything.']],answer:'They are perpendicular; the slope test simply does not apply.'}],
 g:[{id:'s921.g1',prompt:'Two lines have slopes 3 and 3. What can you say?',hint:'Equal slopes.',answer:'They are parallel.',why:'Equal slopes mean the same direction, so the numerator of the angle formula is zero and the lines never meet.'},
  {id:'s921.g2',prompt:'Two lines have slopes 2 and \u22121/2. What can you say?',hint:'Multiply them.',answer:'They are perpendicular.',why:'The product is \u22121, which makes the denominator zero and the angle a right angle.'},
  {id:'s921.g3',prompt:`Are two vertical lines parallel?`,hint:'Do they ever meet?',answer:`Yes: ${confirms(areParallel(verticalLine('a', rational(2,1)), verticalLine('b', rational(7,1))), 'they are parallel', 'they are not parallel')}.`,why:'They run in the same direction and never meet, even though neither has a slope to compare.'}],
 i:[{id:'s921.i1',prompt:'Can two lines be parallel if neither has a slope?',answer:'Yes.',why:'Two vertical lines have no slope and are parallel, which shows the slope test is sufficient rather than necessary.'},
  {id:'s921.i2',prompt:'What is the angle between two parallel lines?',answer:'There is none to speak of.',why:'They never meet, so there is no vertex at which to measure an angle; the formula records this by giving zero.'},
  {id:'s921.i3',prompt:'If the tangent of the angle between two lines has no value, what is the angle?',answer:'A right angle.',why:'The denominator vanishing is exactly the condition that the slopes multiply to \u22121.'},
  {id:'s921.i4',prompt:`Is ${generalForm(L_INT)} parallel to ${generalForm(line('t',4,6,1))}?`,answer:`Yes: ${confirms(areParallel(L_INT, line('t',4,6,1)), 'they are parallel', 'they are not parallel')}.`,why:'The coefficients of x and y are in the same ratio, so the directions agree even though the constants differ.'}],
 td:[{id:'s921.td1',prompt:'The slope test for perpendicularity fails for a vertical line. Does that make the test wrong?',reasoning:'No, it makes it partial. The test says that when both slopes exist, a product of minus one means a right angle, and that remains true. What it cannot do is report on a pair where one slope does not exist, and silence is not a denial. The lesson is to notice which cases a formula covers. A condition expressed through the coefficients of the equations rather than through slopes covers every pair, which is why the perpendicularity of a horizontal and a vertical line can be checked directly.'}],
 summary:`Equal slopes mean parallel lines; slopes whose product is \u22121 mean perpendicular ones, which is the case where the angle formula's denominator vanishes. The slope test is silent for vertical lines, though two verticals are parallel and a vertical meets a horizontal at a right angle.`,
 next:'Next you will write down the equation of a line.',
 t:['Classify pairs of lines as parallel or perpendicular and find the angle between them, including the vertical cases.',['Slope','Tangent'],['"the test does not apply here" rather than "the answer is no"'],['Worked example 3 is the case students get wrong, and it recurs when conics meet tangents later.','Insist on both slopes being written down before any product is taken.'],['Ask whether two horizontal lines are parallel.'],['Sketch the pair before applying any formula; the right angle is usually visible.'],['Ask for a condition for perpendicularity that works for vertical lines too.']]} as unknown as L),


lesson({ id:'ncert_kemh1_s9_3_axis_point_slope_lesson', sec:'9.3', title:'Various Forms of the Equation of a Line', page:156,
 fragmentId:'SF-2-SUMMATIVE',
 prereq:['ncert_kemh1_s9_2'], assume:['Slope','Points on the coordinate plane'],
 notIntroduce:[['Slope-intercept, two-point and intercept forms','ncert_kemh1_s9_3_forms'],['Normal and general forms','ncert_kemh1_s9_3_fo9']],
 goal:'You will write the equation of a line parallel to an axis, and build the point-slope form from the definition of slope rather than from memory.',
 checks:['Compute the slope between two points.','Say which lines have no slope.'], ifNot:'Revisit slope; the point-slope form is the slope definition rearranged.',
 vocab:[['equation of a line','A relation satisfied by the coordinates of every point of the line and by no others.']],
 expl:[`An equation of a line is a condition its points satisfy. Two conditions must hold: every point of the line satisfies it, and no other point does.`,
  `Lines parallel to the axes are the simplest. On ${axisParallelForm(L_VERT)} every point has x-coordinate 3 whatever its height, so that single statement is the equation. On ${axisParallelForm(L_HORZ)} every point has y-coordinate \u22122.`,
  `Now a line through a known point with a known slope. Let the point be (x\u2081, y\u2081) and let (x, y) be any other point of the line. The slope between them is (y \u2212 y\u2081)/(x \u2212 x\u2081), and that must equal m.`,
  `Multiplying through gives y \u2212 y\u2081 = m(x \u2212 x\u2081), the point-slope form. It is not a formula to remember separately: it is the definition of slope with the denominator cleared.`,
  `For the line through ${formatPoint(P_A)} with slope ${S(L_AB)}, this gives ${pointSlopeForm(L_AB, P_A)}, and rearranging gives ${generalForm(L_AB)}.`,
  `The form has a limit worth naming. It contains m, so it cannot describe a vertical line, which has no slope to substitute. That is not a gap in the geometry — ${axisParallelForm(L_VERT)} is a perfectly good equation — but a reminder that no single form covers every line.`],
 rep:['A line through one marked point, with a second general point on it and the two coordinate differences marked'],
 visuals:[G_AXIS],
 we:[{id:'s93.we1',prompt:`Write the equation of the vertical line through ${formatPoint(pt('V',3,5,'V'))}.`,steps:[['A vertical line keeps the same x-coordinate at every height.','That is what being parallel to the y-axis means.'],[`The point has x-coordinate 3, so every point of the line does: ${axisParallelForm(L_VERT)}.`,'The y-coordinate is unconstrained, which is why it does not appear.'],['No slope is needed, and none is available.','The equation exists even though the point-slope form cannot produce it.']],answer:axisParallelForm(L_VERT) ?? ''},
  {id:'s93.we2',prompt:`Derive the equation of the line through ${formatPoint(P_A)} with slope ${S(L_AB)}.`,steps:[['Let (x, y) be any point of the line other than the given one.','The equation must describe every such point, so it starts from a general one.'],['The slope between the two points must be the given slope, by definition of the line.','This is the only condition the line imposes.'],[`Clearing the denominator gives ${pointSlopeForm(L_AB, P_A)}, which rearranges to ${generalForm(L_AB)}.`,'Nothing was memorised; the form is the slope definition with the fraction removed.']],answer:pointSlopeForm(L_AB, P_A) ?? ''},
  {id:'s93.we3',prompt:'A student tries to write a vertical line in point-slope form. What goes wrong?',steps:[['The form contains m, and a vertical line has no slope.','There is nothing to substitute, so the expression cannot be completed.'],[`The line still has an equation, ${axisParallelForm(L_VERT)}, written directly from the constant x-coordinate.`,'The limitation belongs to the form, not to the line.']],answer:'No slope exists to substitute; the line is written as x equals a constant instead.'}],
 g:[{id:'s93.g1',prompt:'Write the equation of the horizontal line through (4, 7).',hint:'Which coordinate is fixed?',answer:'y = 7.',why:'Every point of a horizontal line has the same y-coordinate, and the x-coordinate is free.'},
  {id:'s93.g2',prompt:'Write the line through (0, 1) with slope 3 in point-slope form.',hint:'Substitute into y \u2212 y\u2081 = m(x \u2212 x\u2081).',answer:'y \u2212 1 = 3(x \u2212 0).',why:'The given point supplies x\u2081 and y\u2081 and the given slope supplies m, directly from the derivation.'},
  {id:'s93.g3',prompt:'Which lines cannot be written in point-slope form?',hint:'Which have no slope?',answer:'Vertical lines.',why:'The form requires a value for m, and a vertical line has none.'}],
 i:[{id:'s93.i1',prompt:'Write the equation of the y-axis.',answer:'x = 0.',why:'Every point on it has x-coordinate zero, and its y-coordinate may be anything, so it is a vertical line through the origin.'},
  {id:'s93.i2',prompt:'Does every point satisfying y \u2212 2 = 2(x \u2212 1) lie on the line through (1, 2) with slope 2?',answer:'Yes.',why:'The equation was derived as the condition for the slope to that point to equal 2, so satisfying it is exactly lying on the line.'},
  {id:'s93.i3',prompt:'Why does the point-slope form need a point as well as a slope?',answer:'Because slope alone fixes only the direction.',why:'Infinitely many parallel lines share a slope; the point selects which one.'},
  {id:'s93.i4',prompt:`Is ${formatPoint(P_B)} on the line ${generalForm(L_AB)}?`,answer:`Yes: ${confirms(pointIsOn(L_AB, P_B), 'the point satisfies the equation', 'the point does not satisfy the equation')}.`,why:'Substituting its coordinates satisfies the equation, which is precisely what being on the line means.'}],
 td:[{id:'s93.td1',prompt:'Why does an equation of a line need to exclude points as well as include them?',reasoning:'Because a condition satisfied by every point of the line but also by others would describe something larger. The equation y = 2x is satisfied by the points of one particular line and by nothing else, which is what makes it an equation of that line rather than of a region containing it. Both halves are needed: inclusion makes it describe the line, exclusion makes it describe only the line.'}],
 summary:`A line parallel to an axis is written by fixing the constant coordinate, such as ${axisParallelForm(L_VERT)} or ${axisParallelForm(L_HORZ)}. The point-slope form y \u2212 y\u2081 = m(x \u2212 x\u2081) is the definition of slope with the denominator cleared, and it cannot describe a vertical line, which has no slope.`,
 next:'Next you will meet the other summative forms.',
 t:['Write axis-parallel equations and derive the point-slope form from the slope definition.',['Slope'],['"the condition every point satisfies" when an equation is introduced'],['Derive the point-slope form live rather than stating it; students who meet it as a formula cannot rebuild it.','The vertical exception in worked example 3 prepares the limitation of slope-intercept form next lesson.'],['Ask which coordinate is fixed on a vertical line.'],['Write the slope condition as a fraction first, then clear it.'],['Ask how many lines pass through one point with no slope given.']]} as unknown as L),

lesson({ id:'ncert_kemh1_s9_3_forms_lesson', sec:'9.3', title:'Slope-intercept, Two-point and Intercept Forms', page:159,
 fragmentId:'SF-2-SUMMATIVE',
 prereq:['ncert_kemh1_s9_3'], assume:['Point-slope form','Slope','Intercepts'],
 notIntroduce:[['Normal and general forms','ncert_kemh1_s9_3_fo9']],
 goal:'You will write a line in three further forms and recognise that different equations can describe the same line.',
 checks:['Write a line in point-slope form.','Find the slope between two points.'], ifNot:'Revisit the point-slope form; each form here is derived from it.',
 vocab:[['y-intercept','The y-coordinate where a line crosses the y-axis.'],
  ['x-intercept','The x-coordinate where a line crosses the x-axis.']],
 expl:[`Each form below is the point-slope form with a particular point substituted, so none is a new fact.`,
  `Take the point where the line crosses the y-axis, which is (0, c). Substituting gives y \u2212 c = m(x \u2212 0), that is y = mx + c, the slope-intercept form. Here c is the y-intercept. For ${generalForm(L_AB)} this is ${slopeInterceptForm(L_AB)}.`,
  `If two points are known instead of a slope, compute the slope from them and substitute either point. That gives the two-point form. The same caution applies as before: if the two points share an x-coordinate there is no slope, and the line is written as x equals a constant.`,
  `If both intercepts are known, the line can be written as x/a + y/b = 1, where a is the x-intercept and b the y-intercept. For ${generalForm(L_INT)} the intercepts are ${formatRational(intercepts(L_INT).x!)} and ${formatRational(intercepts(L_INT).y!)}, giving ${interceptForm(L_INT)}.`,
  `This form has its own limitation. A line through the origin has both intercepts zero, and the expression would divide by zero, so ${generalForm(L_DIAG)} has no intercept form: ${interceptForm(L_DIAG) === null ? 'the form does not exist for it' : ''}.`,
  `A line is not its equation. ${generalForm(L_INT)} and 4x + 6y \u2212 12 = 0 look different and describe the same points, because one is a multiple of the other: ${confirms(sameLine(L_INT, line('scaled', 4, 6, -12)), 'the two equations describe one line', 'they are different lines')}. Multiplying an equation through by a non-zero number changes which points satisfy it not at all.`],
 rep:['One line shown three times with a different form written beside each, the intercepts marked on the axes'],
 visuals:[G_SLOPE],
 we:[{id:'s93f.we1',prompt:`Write ${generalForm(L_AB)} in slope-intercept form.`,steps:[[`The slope is ${S(L_AB)}.`,'The slope can be read from the coefficients or computed from two points.'],['The line passes through the origin, so the y-intercept is 0.','Substituting the crossing point into point-slope form is what produces this form.'],[`So the equation is ${slopeInterceptForm(L_AB)}.`,'The absent constant term is the y-intercept being zero, not an omission.']],answer:slopeInterceptForm(L_AB) ?? ''},
  {id:'s93f.we2',prompt:`Write ${generalForm(L_INT)} in intercept form.`,steps:[[`Find where it crosses each axis: the intercepts are ${formatRational(intercepts(L_INT).x!)} and ${formatRational(intercepts(L_INT).y!)}.`,'Setting one variable to zero finds the crossing on the other axis.'],[`Substituting into x/a + y/b = 1 gives ${interceptForm(L_INT)}.`,'The form displays both crossings at once, which is its advantage.'],['Both intercepts are non-zero here, which the form requires.','A zero intercept would put a zero in a denominator.']],answer:interceptForm(L_INT) ?? ''},
  {id:'s93f.we3',prompt:`A student says ${generalForm(L_INT)} and 4x + 6y \u2212 12 = 0 are different lines. What has gone wrong?`,steps:[['They have compared the equations rather than the points satisfying them.','Two equations are different objects even when they describe the same set.'],['The second is the first multiplied by 2, and multiplying an equation by a non-zero number leaves its solutions unchanged.',`So the lines are the same: ${confirms(sameLine(L_INT, line('s2', 4, 6, -12)), 'comparing the two as lines rather than as equations confirms it', 'they differ')}.`],['A line is a set of points; an equation is a way of describing it.','Many descriptions, one object, which is why two different-looking answers can both be right.']],answer:'They are the same line written two ways.'}],
 g:[{id:'s93f.g1',prompt:`What is the y-intercept of ${slopeInterceptForm(line('y1',1,-1,3)) ?? ''}?`,hint:'The constant term.',answer:'3.',why:'In slope-intercept form the constant is the y-coordinate where the line crosses the y-axis.'},
  {id:'s93f.g2',prompt:'Which lines have no intercept form?',hint:'When would a denominator vanish?',answer:'Lines through the origin, and lines parallel to an axis.',why:'Each of these has at least one zero intercept, which the form would place in a denominator.'},
  {id:'s93f.g3',prompt:'Do 2x + 3y = 6 and 4x + 6y = 12 describe the same line?',hint:'Is one a multiple of the other?',answer:'Yes.',why:'The second is twice the first, and scaling an equation does not change which points satisfy it.'}],
 i:[{id:'s93f.i1',prompt:'Write the line through (0, 0) and (2, 6) in slope-intercept form.',answer:'y = 3x.',why:'The slope is 3 and the line passes through the origin, so the y-intercept is zero.'},
  {id:'s93f.i2',prompt:'Why can a vertical line not be written as y = mx + c?',answer:'Because it has no slope to put in m.',why:'The form is the point-slope form specialised, so it inherits that limitation exactly.'},
  {id:'s93f.i3',prompt:'If two equations are not multiples of each other, can they describe the same line?',answer:'No.',why:'Equations of the same line must impose the same condition, and for linear equations that means one is a non-zero multiple of the other.'},
  {id:'s93f.i4',prompt:`Are ${generalForm(L_INT)} and 2x + 3y + 6 = 0 the same line?`,answer:`No: ${confirms(sameLine(L_INT, line('s3',2,3,6)), 'the two equations describe one line', 'they are different lines')}.`,why:'The coefficients of x and y match but the constants are not in the same ratio, so the lines are parallel rather than identical.'}],
 td:[{id:'s93f.td1',prompt:'Why are there several forms for the equation of a line at all, rather than one?',reasoning:'Because each form is built around the information you happen to have. Knowing a point and a direction makes point-slope natural; knowing where a line meets the axes makes intercept form natural. None adds any mathematics: they are all the same condition rearranged, and each can be converted into any other. The reason to know several is convenience in reading a situation, and the reason to know they are equivalent is so that two different-looking answers can be recognised as one.'}],
 summary:`Slope-intercept, two-point and intercept forms are all the point-slope form with particular information substituted. A line through the origin has no intercept form and a vertical line has no slope-intercept form. Different equations describe the same line exactly when one is a non-zero multiple of the other.`,
 next:'Next you will measure how far a point lies from a line.',
 t:['Convert between line forms and recognise equivalent equations.',['Point-slope form','Intercepts'],['"the same line written differently" whenever two forms appear'],['The scalar-multiple question in worked example 3 is the one that matters later, when conic tangents arrive in different scalings.','Point out each form\u2019s exception as it is introduced rather than collecting them at the end.'],['Ask for the intercept form of a line through the origin.'],['Convert each new form back to the general form to check.'],['Ask what condition on coefficients makes two lines identical.']]} as unknown as L),


lesson({ id:'ncert_kemh1_s9_4_distance_lesson', sec:'9.4', title:'Distance of a Point From a Line', page:164,
 prereq:['ncert_kemh1_s9_3_forms'], assume:['The general form of a line','Perpendicular lines','Exact distances from Class 10'],
 goal:'You will find the shortest distance from a point to a line, and see why that distance does not depend on how the equation was written.',
 checks:['Write a line in general form.','Say what makes two lines perpendicular.'], ifNot:'Revisit the general form; the distance is built from its coefficients.',
 vocab:[['perpendicular distance','The length of the perpendicular segment from a point to a line, which is the shortest distance between them.']],
 expl:[`Asking how far a point is from a line means asking for the shortest route. Every other segment from the point to the line is the hypotenuse of a right triangle whose leg is the perpendicular one, and a hypotenuse is longer than a leg. So the shortest distance is measured along the perpendicular.`,
  `To find it, drop a perpendicular from the point to the line, locate the foot, and measure. Carrying that through for a general line Ax + By + C = 0 and a point (x\u2081, y\u2081) gives the distance as the magnitude of Ax\u2081 + By\u2081 + C divided by the square root of A\u00b2 + B\u00b2.`,
  `The numerator is what you get by substituting the point into the left side of the equation. If the point is on the line that substitution gives zero, and the distance is zero, which is the answer it should be.`,
  `For ${formatPoint(P_Q)} and ${generalForm(L_345)} the distance is ${formatRadical(distanceToLine(L_345, P_Q))}. It is kept exact; where the result is irrational the radical stays rather than becoming a decimal, as with ${formatRadical(distanceToLine(line('xy',1,1,0), pt('R',1,0,'R')))} from ${formatPoint(pt('R',1,0,'R'))} to ${generalForm(line('xy',1,1,0))}.`,
  `One property is worth checking rather than assuming. The same line can be written as 3x + 4y \u2212 5 = 0 or as 6x + 8y \u2212 10 = 0. Doubling every coefficient doubles the numerator and doubles the denominator too, since the square root of four times A\u00b2 + B\u00b2 is twice the square root of it. The two cancel, so the distance is unchanged: ${formatRadical(distanceToLine(L_345, P_Q))} either way, and comparing the two scalings ${confirms(formatRadical(distanceToLine(L_345, P_Q)) === formatRadical(distanceToLine(line('scaled2', 6, 8, -10), P_Q)), 'confirms they give the same distance', 'shows they disagree')}.`,
  `That had to come out this way. The distance between a point and a line is a geometric fact about the two of them, and nothing about the arithmetic used to write the equation down should be able to change it.`],
 rep:['A line with a point off it, the perpendicular segment drawn to the foot, and a second slanted segment drawn longer for comparison'],
 visuals:[G_DISTANCE],
 we:[{id:'s94.we1',prompt:`Find the distance from ${formatPoint(P_Q)} to ${generalForm(L_345)}.`,steps:[['Substitute the point into the left side of the equation: 3(2) + 4(1) \u2212 5.','This is the numerator of the formula, before the magnitude is taken.'],['Take the magnitude, then divide by the square root of 3\u00b2 + 4\u00b2.','The denominator depends only on the coefficients of x and y, not on the point.'],[`The square root of 25 is 5, so the distance is ${formatRadical(distanceToLine(L_345, P_Q))}.`,'The result is exact, with no decimal needed.']],answer:formatRadical(distanceToLine(L_345, P_Q))},
  {id:'s94.we2',prompt:`Find the distance from ${formatPoint(P_A)} to ${generalForm(L_AB)}.`,steps:[[`The point lies on the line: ${confirms(pointIsOn(L_AB, P_A), 'the point satisfies the equation', 'the point does not satisfy the equation')}.`,'Which can be checked by substitution before any formula is used.'],['Substituting gives zero in the numerator.','A point on the line satisfies the equation, which is what the numerator tests.'],[`So the distance is ${formatRadical(distanceToLine(L_AB, P_A))}.`,'The formula and the geometry agree: a point on a line is no distance from it.']],answer:formatRadical(distanceToLine(L_AB, P_A))},
  {id:'s94.we3',prompt:'Why does doubling every coefficient leave the distance unchanged?',steps:[['Doubling A, B and C doubles the numerator, since every term of the substitution is doubled.','The numerator is linear in the coefficients.'],['It also multiplies A\u00b2 + B\u00b2 by four, so the square root is doubled.','The denominator is the square root of a quadratic in the coefficients, so it scales by the same factor.'],['A doubled numerator over a doubled denominator is the same number.',`Checked: ${confirms(formatRadical(distanceToLine(L_345, P_Q)) === formatRadical(distanceToLine(line('sc', 6, 8, -10), P_Q)), 'both scalings give the same distance', 'the two scalings disagree')}.`]],answer:'Numerator and denominator are both doubled, so the ratio is unchanged.'}],
 g:[{id:'s94.g1',prompt:'What is the distance from a point on a line to that line?',hint:'What does substitution give?',answer:'0.',why:'The point satisfies the equation, so the numerator vanishes and the distance is zero.'},
  {id:'s94.g2',prompt:`What is the distance from the origin to ${generalForm(L_345)}?`,hint:'Substitute zero for both coordinates.',answer:formatRadical(distanceToLine(L_345, P_ORIGIN)),why:'Only the constant term survives the substitution, and it is divided by the square root of 3\u00b2 + 4\u00b2.'},
  {id:'s94.g3',prompt:'Why is the perpendicular distance the shortest?',hint:'What kind of triangle do other segments form?',answer:'Because any other segment is the hypotenuse of a right triangle with the perpendicular as a leg.',why:'A hypotenuse is always longer than either leg, so no other route can be shorter.'}],
 i:[{id:'s94.i1',prompt:`Find the distance from ${formatPoint(pt('R',1,0,'R'))} to ${generalForm(line('xy2',1,1,0))}.`,answer:formatRadical(distanceToLine(line('xy3',1,1,0), pt('R',1,0,'R'))),why:'Substituting gives 1, and the denominator is the square root of 2, so the exact distance keeps its radical.'},
  {id:'s94.i2',prompt:'Can the distance from a point to a line be negative?',answer:'No.',why:'The numerator is taken in magnitude and the denominator is a positive square root, so the result is never negative.'},
  {id:'s94.i3',prompt:'Does the distance depend on which side of the line the point lies?',answer:'No.',why:'The substitution changes sign across the line, but the magnitude removes that, leaving the same distance on either side.'},
  {id:'s94.i4',prompt:'What does the denominator of the formula depend on?',answer:'Only the coefficients of x and y.',why:'It measures the direction of the line, which is why it is unaffected by the constant term or by the point.'}],
 td:[{id:'s94.td1',prompt:'The distance formula had to be independent of how the equation was scaled. Why is that a requirement rather than a lucky property?',reasoning:'Because the distance is a fact about a point and a line, two geometric objects, while scaling is something done to a piece of notation. If the answer changed when the equation was doubled, the formula would be measuring the writing rather than the geometry, and the same question would have many answers depending on how someone happened to write the line down. Checking the invariance is therefore a test of whether the formula computes what it claims to.'}],
 summary:`The shortest distance from a point to a line is measured along the perpendicular, and equals the magnitude of Ax\u2081 + By\u2081 + C divided by the square root of A\u00b2 + B\u00b2. It is zero exactly when the point is on the line, it is kept exact, and it does not change when the equation is scaled.`,
 next:'Next, an optional pair of further forms.',
 t:['Derive and apply the perpendicular distance from a point to a line, exactly.',['General form','Perpendicularity'],['"shortest distance" rather than "the distance", until the perpendicular is established'],['Derive the formula rather than stating it; the substitution in the numerator then explains the zero case for free.','The scale-invariance check in worked example 3 is the one that shows the formula measures geometry rather than notation.'],['Ask for the distance from the origin to a line through the origin.'],['Substitute the point into the left side first and look at the number before dividing.'],['Ask for the distance between two parallel lines.']]} as unknown as L),

lesson({ id:'ncert_kemh1_s9_3_fo9_lesson', sec:'9.3', title:'Normal Form and the General Equation of a Line', page:161,
 fragmentId:'SF-2-FORMATIVE',
 prereq:['ncert_kemh1_s9_3_forms'], assume:['Line forms','Perpendicular distance','Typed angles and the trigonometric functions'],
 goal:'You will describe a line by the perpendicular from the origin, and see how every form of a line reduces to one general equation.',
 checks:['Write a line in general form.','Find the distance from the origin to a line.'], ifNot:'Revisit the general form and the distance formula; this lesson rests on both.',
 vocab:[['normal form','Writing a line by the length of the perpendicular from the origin and the angle that perpendicular makes with the positive x-axis.'],
  ['general equation','The form Ax + By + C = 0, which every line satisfies for some A, B and C not both zero.']],
 expl:[`Every form so far has described a line by points on it or by its direction. The normal form describes it instead by the perpendicular dropped to it from the origin: how long that perpendicular is, and which way it points.`,
  `Let p be the length of that perpendicular and \u03c9 the angle it makes with the positive x-axis. The source writes the line as x cos \u03c9 + y sin \u03c9 = p. The angle is a genuine angle with a unit, not a bare number, and the trigonometric functions here are the ones from the functions chapter.`,
  `For ${generalForm(L_345)} the perpendicular from the origin has length ${formatRadical(distanceFromOriginOf(L_345))}, which is the distance computed in the previous lesson. The normal form simply names that length and that direction.`,
  `Behind all of this sits one equation. Every form met in this chapter can be rearranged into Ax + By + C = 0, with A and B not both zero, and conversely every such equation with A and B not both zero describes a line.`,
  `That general form is the one that covers every case without exception. It describes ${axisParallelForm(L_VERT)} as ${generalForm(L_VERT)}, which the slope-intercept form could not touch, and it describes ${generalForm(L_DIAG)}, which has no intercept form. Nothing has to be set aside.`,
  `Two equations of this shape describe the same line exactly when one is a non-zero multiple of the other, which is why ${generalForm(L_INT)} and 4x + 6y \u2212 12 = 0 are one line: ${confirms(sameLine(L_INT, line('fo9s', 4, 6, -12)), 'the two equations describe one line', 'they are different lines')}.`],
 rep:['A line with the perpendicular from the origin drawn to it, the length marked and the angle at the origin marked'],
 visuals:[G_DISTANCE],
 we:[{id:'fo9.we1',prompt:`What is the length of the perpendicular from the origin to ${generalForm(L_345)}?`,steps:[['This is the distance from the origin to the line, which the previous lesson computed.','The normal form uses the same quantity rather than a new one.'],['Substituting the origin leaves only the constant term in the numerator.','Both coordinates are zero, so the first two terms vanish.'],[`Dividing by the square root of 3\u00b2 + 4\u00b2 gives ${formatRadical(distanceFromOriginOf(L_345))}.`,'That length is the p of the normal form.']],answer:formatRadical(distanceFromOriginOf(L_345))},
  {id:'fo9.we2',prompt:`Write ${axisParallelForm(L_VERT)} in general form.`,steps:[['Move everything to one side: x \u2212 3 = 0.','The general form requires zero on the right.'],[`So A is 1, B is 0 and C is \u22123, giving ${generalForm(L_VERT)}.`,'B being zero is what makes the line vertical, and it causes no difficulty here.'],['The slope-intercept form could not express this line at all.','The general form covers it without an exception, which is its advantage.']],answer:generalForm(L_VERT)},
  {id:'fo9.we3',prompt:'Why can every line be written in general form?',steps:[['Each named form is an equation in x and y with no powers above the first.','That is true of point-slope, slope-intercept, two-point and intercept forms alike.'],['Collecting the x terms, the y terms and the constants on one side produces Ax + By + C = 0.','Rearrangement does not change which points satisfy the equation.'],['A and B are not both zero, because then no x or y would remain and the equation would not describe a line.','The condition on A and B is what keeps the form meaningful.']],answer:'Because every form is linear and rearranges to that shape.'}],
 g:[{id:'fo9.g1',prompt:`Write ${axisParallelForm(L_HORZ)} in general form.`,hint:'Collect the x term, the y term and the constant on one side.',answer:generalForm(L_HORZ),why:'The coefficient of x is zero, which is permitted since A and B are not both zero.'},
  {id:'fo9.g2',prompt:'What does p represent in the normal form?',hint:'A length from where?',answer:'The length of the perpendicular from the origin to the line.',why:'It is the same quantity as the distance from the origin computed by the distance formula.'},
  {id:'fo9.g3',prompt:'Can A and B both be zero in the general equation?',hint:'What would remain?',answer:'No.',why:'The equation would contain neither x nor y and so could not describe a line.'}],
 i:[{id:'fo9.i1',prompt:'Which lines can the general form describe that the slope-intercept form cannot?',answer:'Vertical lines.',why:'They have no slope, so m cannot be given a value, while the general form simply takes B equal to zero.'},
  {id:'fo9.i2',prompt:'If the perpendicular from the origin has length zero, what does that mean?',answer:'The line passes through the origin.',why:'A zero distance from a point to a line means the point lies on it.'},
  {id:'fo9.i3',prompt:`Do ${generalForm(L_INT)} and 4x + 6y \u2212 12 = 0 describe the same line?`,answer:`Yes: ${confirms(sameLine(L_INT, line('fo9b', 4, 6, -12)), 'the two equations describe one line', 'they are different lines')}.`,why:'The second is twice the first, and scaling an equation does not change its solutions.'},
  {id:'fo9.i4',prompt:'Why is the angle in the normal form a genuine angle rather than a number?',answer:'Because it is a direction, measured from the positive x-axis.',why:'Its cosine and sine appear in the equation, so it has to be the kind of object those functions take.'}],
 td:[{id:'fo9.td1',prompt:'The general equation describes every line without exception, yet it is the slope-intercept form that students usually learn first. Is that the wrong order?',reasoning:'Not wrong, but worth understanding. Slope-intercept form is easier to picture, because m and c both have direct meanings you can see on a graph, and most lines met early are not vertical. The general form is harder to read at a glance and better behaved: it needs no exceptions, it makes scaling and equivalence visible, and it extends to curves later. The familiar form is the better place to start and the general one is the better place to reason from.'}],
 summary:`The normal form x cos \u03c9 + y sin \u03c9 = p describes a line by the perpendicular from the origin: its length and its direction. Every form of a line rearranges to the general equation Ax + By + C = 0 with A and B not both zero, which covers vertical lines and lines through the origin without exception.`,
 next:'That completes the chapter on straight lines.',
 t:['Describe a line by the perpendicular from the origin and reduce every form to the general equation.',['Line forms','Distance from a point to a line'],['"the perpendicular from the origin" in full, to keep p and \u03c9 attached to a picture'],['CURRICULUM NOTE: the normal form and the general equation are prescribed by CBSE as formative-only within this section, while the other forms in the same section are summative. Teach them as enrichment and keep them out of summative tests.','The general form is used internally throughout this chapter because it handles every case; that is a mathematical convenience and does not change its assessment status.'],['Ask for the general form of a line through the origin.'],['Rearrange each earlier form into general form side by side.'],['Ask what the normal form looks like for a line through the origin.']]} as unknown as L),

];
