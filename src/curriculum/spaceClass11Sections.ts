// ===========================================================================
// v0.84.0-c11.42 checkpoint 97 — CLASS 11 CHAPTER 11, INTRODUCTION TO THREE
// DIMENSIONAL GEOMETRY. The three summative-core sections, §11.2 to §11.4.
//
// C11-3DG-FO10, the section formula in space, is NOT authored here: it is
// formative-only and sits inside the recorded nine-unit governance debt.
// Chapter 11 is therefore "summative-core authored complete", not fully
// authored for all current-syllabus content.
//
// Every triple, octant, plane and distance below is derived from the same
// Point3D objects. No lesson types a coordinate twice.
// ===========================================================================

import type { AuthoredSection } from './authoredSection';
import { type L, makeLesson } from './class11Lesson';
import {
  coordinate3D, describePosition, distanceSquared3D, formatDistance3D, midpoint3D,
  sectionPoint3D,
  octantLabel, octantOf, orderedTriple, p3, planar, planeEquation, planeName,
  ALL_OCTANTS,
} from './coordinateSpace';
import { distance as distance2D, formatRadical, formatRational } from './coordinateGeometry';

export const SPACE_C11_CHAPTER_ID = 'ncert_kemh1_ch11';
/**
 * v0.84.0-c11.48 checkpoint 100 — C11-3DG-FO10 is CBSE-only with no NCERT
 * section owner, so it carries a chapter-less sentinel. It is prerequisite
 * on 3DG-03 and sits beside Chapter 11 instructionally, but the chapter
 * does not own it — the FO2/FO3/FO5b defect, not repeated.
 */
export const SPACE_C11_CHAPTERLESS_ID = 'cbse_fo10_c11_section_formula';
const BOOK = 'Mathematics, Textbook for Class XI (NCERT, Reprint 2026-27)';

const source = (sec: string, title: string, page: number) => ({
  officialChapterId: SPACE_C11_CHAPTER_ID,
  officialSectionId: `ncert_kemh1_s${sec.replace(/\./g, '_')}`,
  sectionNumber: sec, exactTitle: title, startPage: page,
  textbook: BOOK, sourceReference: 'kemh1', inspectionDate: '2026-10-26',
});
/** FO-10 names CBSE and nothing else: no section, no page. */
const cbseSource = (title: string) => ({
  officialChapterId: SPACE_C11_CHAPTERLESS_ID,
  sourceKind: 'cbse_only' as const,
  officialSectionId: '',
  cbseEntryId: 'FO-10',
  sectionNumber: '',
  exactTitle: title,
  startPage: 0,
  textbook: 'CBSE Class XI syllabus, Unit III — no NCERT chapter owner',
  sourceReference: 'cbse_fo10',
  inspectionDate: '2026-10-26',
});

const lesson = (l: L): AuthoredSection =>
  makeLesson(l, (l as { id: string }).id.startsWith('cbse_')
    ? ((_s: string, title: string) => cbseSource(title) as never)
    : source);

// --- canonical points, each stored ONCE -----------------------------------
export const ORIGIN = p3('O', 0, 0, 0, 'O');
export const P_OCTANT = p3('P', 2, 3, 4, 'P');
export const P_MIXED = p3('Q', -3, 1, -2, 'Q');
export const P_ON_PLANE = p3('R', 4, 0, 5, 'R');
export const P_ON_AXIS = p3('S', 0, 0, 6, 'S');
export const D_A = p3('A', 1, -1, 2, 'A');
export const D_B = p3('B', 4, 3, -2, 'B');
export const FLAT_A = p3('C', 1, 2, 3, 'C');
export const FLAT_B = p3('D', 4, 6, 3, 'D');
export const EQ_M = p3('M', 0, 0, 0, 'M');
export const EQ_1 = p3('E', 3, 0, 0, 'E');
export const EQ_2 = p3('F', 0, -3, 0, 'F');

export const V_AXES = coordinate3D('v_axes', [ORIGIN, P_OCTANT], {
  planes: ['xy', 'yz', 'zx'], extent: 6,
  caption: 'The three axes, the three coordinate planes, and one point away from all of them',
  altText: `A three-dimensional axis diagram. The x-axis runs right, the z-axis runs up, and the y-axis is drawn going back at an angle because the page is flat. The origin O sits at (0, 0, 0) where all three meet. The point P at ${orderedTriple(P_OCTANT)} lies off every coordinate plane, ${describePosition(P_OCTANT)}.`,
});
export const V_PLANE_POINT = coordinate3D('v_plane_point', [P_ON_PLANE, P_ON_AXIS, ORIGIN], {
  planes: ['zx'], extent: 7,
  caption: 'A point on a coordinate plane and a point on an axis',
  altText: `A three-dimensional axis diagram showing R at ${orderedTriple(P_ON_PLANE)}, which has y = 0 and so lies on the zx-plane, and S at ${orderedTriple(P_ON_AXIS)}, which has x = 0 and y = 0 and so lies on the z-axis. Neither is in any octant.`,
});
export const V_PLOT = coordinate3D('v_plot', [P_OCTANT, P_MIXED, ORIGIN], { extent: 6,
  caption: 'Two plotted points and the sign patterns of their octants',
  altText: `A three-dimensional axis diagram with P at ${orderedTriple(P_OCTANT)}, ${describePosition(P_OCTANT)}, and Q at ${orderedTriple(P_MIXED)}, ${describePosition(P_MIXED)}. The two points sit in different octants because their coordinate signs differ.`,
});
export const V_DISTANCE = coordinate3D('v_distance', [D_A, D_B], {
  extent: 6, segments: [{ from: 'A', to: 'B', style: 'solid' }], distanceBetween: ['A', 'B'],
  caption: `The distance from A to B, exactly`,
  altText: `A three-dimensional axis diagram with A at ${orderedTriple(D_A)} and B at ${orderedTriple(D_B)} joined by a straight segment. The exact distance between them is ${formatDistance3D(D_A, D_B)}, obtained from the differences in x, y and z rather than measured off the drawing.`,
});
export const V_FLAT = coordinate3D('v_flat', [FLAT_A, FLAT_B], {
  extent: 7, segments: [{ from: 'C', to: 'D', style: 'solid' }], distanceBetween: ['C', 'D'],
  caption: 'Two points at the same height',
  altText: `A three-dimensional axis diagram with C at ${orderedTriple(FLAT_A)} and D at ${orderedTriple(FLAT_B)}, both at z = 3, joined by a segment. Because the z coordinates are equal the distance ${formatDistance3D(FLAT_A, FLAT_B)} is the same as the two-dimensional distance between (1, 2) and (4, 6).`,
});

// --- FO-10 canonical objects -----------------------------------------------
export const SEC_A = p3('A', 1, 2, 3, 'A');
export const SEC_B = p3('B', 7, 8, 9, 'B');
export const SEC_P = sectionPoint3D(SEC_A, SEC_B, 1, 2, 'P');
export const FRAC_A = p3('C', 0, 0, 0, 'C');
export const FRAC_B = p3('D', 7, 11, 5, 'D');
export const FRAC_P = sectionPoint3D(FRAC_A, FRAC_B, 1, 2, 'Q');
export const FLAT_S = p3('E', 1, 2, 5, 'E');
export const FLAT_T = p3('F', 9, 6, 5, 'F');
export const FLAT_P = sectionPoint3D(FLAT_S, FLAT_T, 3, 1, 'R');
export const MID_P = midpoint3D(SEC_A, SEC_B, 'M');

export const V_SECTION = coordinate3D('v_section', [SEC_A, SEC_B, SEC_P], {
  extent: 10, segments: [{ from: 'A', to: 'B' }],
  divides: { point: 'P', from: 'A', to: 'B', m1: 1, m2: 2 },
  caption: `P divides AB internally in the ratio 1 : 2`,
  altText: `A three-dimensional axis diagram with A at ${orderedTriple(SEC_A)} and B at ${orderedTriple(SEC_B)} joined by a straight segment, and P at ${orderedTriple(SEC_P)} marked on that segment between them. P lies internally, one third of the way from A, because AP : PB is 1 : 2.`,
});
export const V_FRACTION = coordinate3D('v_fraction', [FRAC_A, FRAC_B, FRAC_P], {
  extent: 12, segments: [{ from: 'C', to: 'D' }],
  divides: { point: 'Q', from: 'C', to: 'D', m1: 1, m2: 2 },
  caption: 'A division whose coordinates are not whole numbers',
  altText: `A three-dimensional axis diagram with C at ${orderedTriple(FRAC_A)} and D at ${orderedTriple(FRAC_B)} joined by a segment, and Q at ${orderedTriple(FRAC_P)} marked on it. Q divides the segment internally, lying between C and D, with CQ : QD = 1 : 2. Its coordinates are exact fractions, not rounded decimals.`,
});
export const V_FLAT_SEC = coordinate3D('v_flat_sec', [FLAT_S, FLAT_T, FLAT_P], {
  extent: 10, segments: [{ from: 'E', to: 'F' }],
  divides: { point: 'R', from: 'E', to: 'F', m1: 3, m2: 1 },
  caption: 'A segment at constant height',
  altText: `A three-dimensional axis diagram with E at ${orderedTriple(FLAT_S)} and F at ${orderedTriple(FLAT_T)}, both at z = 5, joined by a segment with R at ${orderedTriple(FLAT_P)} on it. R divides the segment internally, lying between E and F, with ER : RF = 3 : 1. Because the two heights are equal the z coordinate of R is also 5, and the x and y coordinates are what the flat section formula would give.`,
});

export const C11_SPACE_SECTIONS: AuthoredSection[] = [

lesson({ id:'ncert_kemh1_s11_2_axes_planes_lesson', sec:'11.2', title:'Coordinate Axes and Coordinate Planes in Three Dimensional Space', page:192,
 assume:['Coordinate axes in a plane','Signs of positive and negative numbers'],
 goal:'You will name the three coordinate planes and the eight octants, and say where a region of space lies.',
 checks:['Plot a point on a flat pair of axes.','Say whether a number is positive or negative.'],
 ifNot:'Revisit the coordinate plane; space adds one axis to what you already use.',
 representationFamilies:['coordinate:3d'],
 visuals:[V_AXES, V_PLANE_POINT],
 vocab:[['coordinate planes','The three flat surfaces each pair of axes spans.'],
  ['octant','One of the eight regions the three planes cut space into.'],
  ['origin','The point where all three axes meet.']],
 expl:[`A flat page needs two numbers to fix a point. Space needs three, so a third axis is added at right angles to the other two: the z-axis, usually drawn going up.`,
  `Each PAIR of axes spans a flat surface. The x and y axes span the ${planeName('xy')}, the y and z axes the ${planeName('yz')}, and the z and x axes the ${planeName('zx')}.`,
  `Each plane has an equation, and it is the simplest kind: the ${planeName('xy')} is every point where ${planeEquation('xy')}, because leaving the plane is exactly what a non-zero z means.`,
  `So membership is a matter of a vanishing coordinate, not of where a point looks on a drawing: a point is on the ${planeName('zx')} precisely when ${planeEquation('zx')}.`,
  `The three planes cut space into ${ALL_OCTANTS.length} regions, called octants — eight, because each of the three coordinates can be positive or negative independently, and 2 x 2 x 2 is 8.`,
  `An octant is identified by that pattern of signs. The one containing ${orderedTriple(P_OCTANT)} is the octant where all three are positive, ${octantLabel(octantOf(P_OCTANT)!)}.`,
  `A point with a zero coordinate is in NO octant. It sits on a plane, which is the boundary between octants rather than inside one: ${P_ON_PLANE.label} at ${orderedTriple(P_ON_PLANE)} is ${describePosition(P_ON_PLANE)}.`,
  `If two coordinates vanish the point lies on an axis, which is the boundary of boundaries: ${P_ON_AXIS.label} at ${orderedTriple(P_ON_AXIS)} is ${describePosition(P_ON_AXIS)}.`],
 rep:['A three-dimensional axis diagram, with the depth axis drawn at an angle because the page is flat'],
 we:[{id:'s112.we1',prompt:`Which coordinate plane contains ${P_ON_PLANE.label} at ${orderedTriple(P_ON_PLANE)}?`,steps:[['Look for a coordinate that is zero.','That is what puts a point on a plane.'],[`Here y = 0.`,`The plane where ${planeEquation('zx')} is the ${planeName('zx')}.`],[`So ${P_ON_PLANE.label} is ${describePosition(P_ON_PLANE)}.`,'Its other two coordinates may be anything at all.']],answer:`The ${planeName('zx')}.`},
  {id:'s112.we2',prompt:`Which octant contains ${orderedTriple(P_OCTANT)}?`,steps:[['Check that no coordinate is zero.','A zero would put the point on a plane instead.'],['Read the three signs: all positive.','The signs are the whole answer.'],[`So the octant is ${octantLabel(octantOf(P_OCTANT)!)}.`,'Naming it by signs needs no numbering convention.']],answer:octantLabel(octantOf(P_OCTANT)!)},
  {id:'s112.we3',prompt:'Why are there exactly eight octants?',steps:[['Each coordinate is either positive or negative.','Two choices, for each of three coordinates.'],['2 x 2 x 2 = 8.','Every combination of signs is a real region of space.'],[`The eight patterns are ${ALL_OCTANTS.map(octantLabel).join(', ')}.`,'None is missing and none is repeated.']],answer:'Because three coordinates each take one of two signs, giving 2 x 2 x 2 = 8.'}],
 g:[{id:'s112.g1',prompt:`What is the equation of the ${planeName('xy')}?`,hint:'Which coordinate must vanish?',answer:planeEquation('xy'),why:'Leaving that plane is exactly what a non-zero z means.'},
  {id:'s112.g2',prompt:'How many octants are there?',hint:'Two signs, three coordinates.',answer:'Eight.',why:'2 x 2 x 2 = 8.'},
  {id:'s112.g3',prompt:'Is a point with z = 0 in an octant?',hint:'Where does it sit?',answer:'No.',why:`It lies on the ${planeName('xy')}, which is a boundary, not a region.`}],
 i:[{id:'s112.i1',prompt:'Which plane contains (0, 5, 7)?',answer:`The ${planeName('yz')}.`,why:`Its x coordinate is zero, and ${planeEquation('yz')} is that plane.`},
  {id:'s112.i2',prompt:'Which octant contains (-1, -2, -3)?',answer:'The octant (-, -, -).',why:'All three coordinates are negative.'},
  {id:'s112.i3',prompt:'Where does (0, 0, -4) lie?',answer:'On the z-axis.',why:'Both x and y vanish.'},
  {id:'s112.i4',prompt:'A student says (3, 0, 2) is in the first octant. What is wrong?',answer:'It is in no octant.',why:'A zero coordinate puts it on a plane.'}],
 td:[{id:'s112.td1',prompt:'Why does one zero coordinate put a point on a plane, while two put it on an axis?',reasoning:'Each zero removes a direction of freedom. With all three coordinates free a point can be anywhere in space. Fixing z = 0 confines it to a flat surface: it can still move in two directions, which is what a plane is. Fixing both x = 0 and y = 0 leaves one direction, which is a line. So the count of zeros is a count of lost dimensions, and the names plane and axis are descriptions of what is left rather than labels applied from outside. The origin, where all three vanish, has nothing left to move in — a single point.'}],
 summary:`Space needs three coordinates. Each pair of axes spans a coordinate plane whose equation is simply that the third coordinate vanishes: the ${planeName('xy')} is ${planeEquation('xy')}. The three planes cut space into eight octants, one for each pattern of signs, and a point with any zero coordinate lies on a plane rather than inside an octant.`,
 next:'Next you will plot points from their coordinates.',
 t:['Name the planes and octants and place a region of space.',['Coordinate plane'],['"the signs are the answer", for naming an octant'],['Test membership by looking for zero coordinates, never by where a point appears on the drawing.','Say the octant by its sign pattern; no numbering convention is in the source.'],['Ask where a point with one zero coordinate lies.'],['Count zeros before naming a region.'],['Ask why eight and not six.']]} as unknown as L),

lesson({ id:'ncert_kemh1_s11_3_coordinates_lesson', sec:'11.3', title:'Coordinates of a Point in Space', page:194,
 prereq:['ncert_kemh1_s11_2'], assume:['Coordinate planes and octants','Plotting on a flat pair of axes'],
 goal:'You will read and plot an ordered triple and state the sign pattern of its octant.',
 checks:['Name the three coordinate planes.','Say which octant a sign pattern describes.'],
 ifNot:'Revisit the previous lesson; the planes are what the triple is measured against.',
 representationFamilies:['coordinate:3d'],
 visuals:[V_PLOT],
 vocab:[['ordered triple','The three coordinates of a point, written in the order x, y, z.']],
 expl:[`A point in space is written as an ordered triple, ${orderedTriple(P_OCTANT)}. The order is fixed: the first number is always x, the second y, the third z.`,
  `Each coordinate measures a distance from one coordinate plane. The z coordinate says how far the point is from the ${planeName('xy')}, and its sign says which side.`,
  `Reading a triple is therefore three separate questions, each about one plane — not one question about a position in a picture.`,
  `To plot ${orderedTriple(P_MIXED)}, go ${formatRational(P_MIXED.x)} along x, ${formatRational(P_MIXED.y)} along y, then ${formatRational(P_MIXED.z)} along z. The order does not matter for where you end up, but each step is a different direction.`,
  `The octant follows from the signs alone: ${P_MIXED.label} is ${describePosition(P_MIXED)}.`,
  `The drawing is where care is needed. A flat page cannot show three perpendicular directions, so the y-axis is drawn at an angle, and two points far apart in space can appear close together on the page.`,
  `That is why the coordinates, not the picture, settle every question. Two points that look adjacent may be in different octants entirely.`,
  `A zero coordinate is still a real answer, not a missing one. ${P_ON_PLANE.label} at ${orderedTriple(P_ON_PLANE)} has y = 0, so it is ${describePosition(P_ON_PLANE)}.`],
 rep:['A three-dimensional coordinate diagram, with each point labelled by its exact triple'],
 we:[{id:'s113.we1',prompt:`Plot ${orderedTriple(P_OCTANT)} and name its octant.`,steps:[[`Move ${formatRational(P_OCTANT.x)} along x, ${formatRational(P_OCTANT.y)} along y, ${formatRational(P_OCTANT.z)} along z.`,'Each step is measured from a different plane.'],['No coordinate is zero, so the point is inside an octant.','Check this before naming one.'],[`All three signs are positive, so the octant is ${octantLabel(octantOf(P_OCTANT)!)}.`,'The signs are read from the triple, not from the drawing.']],answer:`${orderedTriple(P_OCTANT)}, in the octant ${octantLabel(octantOf(P_OCTANT)!)}.`},
  {id:'s113.we2',prompt:`Which octant contains ${orderedTriple(P_MIXED)}?`,steps:[['Read the signs in order.',`x is negative, y positive, z negative.`],['No coordinate vanishes.','So an octant is the right kind of answer.'],[`The octant is ${octantLabel(octantOf(P_MIXED)!)}.`,`${P_MIXED.label} is ${describePosition(P_MIXED)}.`]],answer:octantLabel(octantOf(P_MIXED)!)},
  {id:'s113.we3',prompt:`Where is ${orderedTriple(P_ON_PLANE)}?`,steps:[['One coordinate is zero.','That rules an octant out immediately.'],[`y = 0, which is the ${planeName('zx')}.`,`Its equation is ${planeEquation('zx')}.`],[`So the point is ${describePosition(P_ON_PLANE)}.`,'Giving it an octant would be wrong, not merely imprecise.']],answer:`On the ${planeName('zx')}.`}],
 g:[{id:'s113.g1',prompt:'What does the second number in a triple measure?',hint:'Which axis?',answer:'The y coordinate.',why:'The order x, y, z is fixed.'},
  {id:'s113.g2',prompt:`What is the octant of ${orderedTriple(P_MIXED)}?`,hint:'Read the three signs.',answer:octantLabel(octantOf(P_MIXED)!),why:'The signs alone fix the octant.'},
  {id:'s113.g3',prompt:'Can two points that look close on the page be far apart?',hint:'The page is flat.',answer:'Yes.',why:'A flat drawing projects three directions onto two.'}],
 i:[{id:'s113.i1',prompt:'What is the octant of (5, -2, 7)?',answer:'(+, -, +).',why:'Those are the signs of its coordinates.'},
  {id:'s113.i2',prompt:'Where does (0, 3, 0) lie?',answer:'On the y-axis.',why:'Both x and z vanish.'},
  {id:'s113.i3',prompt:'A point is plotted and read off the drawing as (2, 2, 2), but its triple is (2, -2, 2). Which is right?',answer:'The triple.',why:'The drawing is a projection; the coordinates are the point.'},
  {id:'s113.i4',prompt:'Does the order of the three steps change where you arrive?',answer:'No.',why:'The three directions are independent.'}],
 td:[{id:'s113.td1',prompt:'Why can two points that are far apart in space end up looking close together in the diagram?',reasoning:'Because the diagram throws one dimension away. Three perpendicular directions cannot all be drawn perpendicular on a flat page, so one is drawn at an angle and every point is projected onto two numbers instead of three. Projection is many-to-one: a whole line of points in space can land on the same spot on the page. That is not a flaw in the drawing but the price of flattening, and it is exactly why the coordinates are kept as the answer and the picture is treated as an aid. When a question asks which octant, the triple decides it.'}],
 summary:`A point in space is an ordered triple, read x then y then z, each coordinate measuring a distance from one coordinate plane. The signs alone name the octant, and a zero coordinate means the point lies on a plane and in no octant. The drawing projects three directions onto a flat page, so the coordinates, not the picture, settle every question.`,
 next:'Next you will measure the distance between two points in space.',
 t:['Read and plot a triple and name its octant by signs.',['Planes and octants'],['"the triple decides it", against the drawing'],['Check for zero coordinates BEFORE naming an octant.','Treat the projection as an aid, never as evidence.'],['Ask which is right when drawing and triple disagree.'],['Read the signs in order.'],['Ask why distant points can look close.']]} as unknown as L),

lesson({ id:'ncert_kemh1_s11_4_distance_lesson', sec:'11.4', title:'Distance between Two Points', page:197,
 prereq:['ncert_kemh1_s11_3'], assume:['Coordinates in space','The distance formula in a plane','Pythagoras'],
 goal:'You will derive the distance formula in space and use it to test geometric claims.',
 checks:['Find the distance between two points in a plane.','State Pythagoras.'],
 ifNot:'Revisit the planar distance formula; the space formula is built on top of it.',
 representationFamilies:['coordinate:3d'],
 visuals:[V_DISTANCE, V_FLAT],
 vocab:[['exact value','A distance left as a radical, such as \u221a41, rather than rounded.']],
 expl:[`In a plane, the distance between two points comes from one right triangle: the horizontal difference and the vertical difference are the legs, and Pythagoras gives the hypotenuse.`,
  `Space needs one more step, and it is the same idea twice. Drop both points to the ${planeName('xy')}. Their shadows are separated by the planar distance you already know.`,
  `Now the segment joining the two points is the hypotenuse of a SECOND right triangle: one leg is that planar distance, the other is the difference in height, and the two meet at a right angle because the vertical is perpendicular to the plane.`,
  `Applying Pythagoras again gives the squared distance as the planar squared distance plus the squared difference in z — which is why the formula gains one more squared term and nothing else.`,
  `For ${D_A.label} at ${orderedTriple(D_A)} and ${D_B.label} at ${orderedTriple(D_B)}, the differences are ${formatRational(D_B.x)} \u2212 ${formatRational(D_A.x)}, ${formatRational(D_B.y)} \u2212 ${formatRational(D_A.y)} and ${formatRational(D_B.z)} \u2212 ${formatRational(D_A.z)}, giving a squared distance of ${formatRational(distanceSquared3D(D_A, D_B))} and a distance of exactly ${formatDistance3D(D_A, D_B)}.`,
  `That value is left as a radical. ${formatDistance3D(D_A, D_B)} is the distance; a rounded decimal is a description of it, and rounding early makes later comparisons unreliable.`,
  `A check worth making: if the two points are at the same height the z difference is zero, the extra term vanishes, and the formula becomes the planar one. ${FLAT_A.label} and ${FLAT_B.label} are both at z = 3, and their distance ${formatDistance3D(FLAT_A, FLAT_B)} equals the plane distance ${formatRadical(distance2D(planar(FLAT_A), planar(FLAT_B)))} between their shadows.`,
  `The formula is useful for testing claims as well as measuring. To ask whether a point is equidistant from two others, compare the two squared distances — exactly, with no roots taken and nothing rounded.`],
 rep:['A three-dimensional diagram with the segment drawn and the exact distance stated'],
 we:[{id:'s114.we1',prompt:`Find the distance from ${D_A.label} ${orderedTriple(D_A)} to ${D_B.label} ${orderedTriple(D_B)}.`,steps:[['Take the three differences, in x, y and z.','Each difference is a leg of the construction.'],[`Square and add them to get ${formatRational(distanceSquared3D(D_A, D_B))}.`,'This is the squared distance, still exact.'],[`So the distance is ${formatDistance3D(D_A, D_B)}.`,'Left as a radical, because that IS the value.']],answer:formatDistance3D(D_A, D_B)},
  {id:'s114.we2',prompt:`Why does the distance from ${FLAT_A.label} to ${FLAT_B.label} match a plane calculation?`,steps:[['Both points are at z = 3.','So the difference in z is zero.'],['The squared z term contributes nothing.','What remains is the planar formula exactly.'],[`Both routes give ${formatDistance3D(FLAT_A, FLAT_B)}.`,'The space formula contains the plane formula rather than replacing it.']],answer:`${formatDistance3D(FLAT_A, FLAT_B)}, by either route.`},
  {id:'s114.we3',prompt:`Is ${EQ_M.label} ${orderedTriple(EQ_M)} equidistant from ${orderedTriple(EQ_1)} and ${orderedTriple(EQ_2)}?`,steps:[['Find both squared distances.',`Each comes to ${formatRational(distanceSquared3D(EQ_M, EQ_1))}.`],['Compare them without taking roots.','Equal squares mean equal distances, since a distance is never negative.'],['They agree, so the point is equidistant.','Comparing exactly avoids two roundings that could disagree.']],answer:'Yes, both distances are 3.'}],
 g:[{id:'s114.g1',prompt:'How many squared differences does the space formula add?',hint:'One per coordinate.',answer:'Three.',why:'One for each of x, y and z.'},
  {id:'s114.g2',prompt:'What happens when the two points have the same z?',hint:'What does that term become?',answer:'It reduces to the plane formula.',why:'The squared z difference is zero.'},
  {id:'s114.g3',prompt:'Why compare squared distances when testing equal distances?',hint:'What do you avoid?',answer:'It avoids taking roots and rounding.',why:'Equal squares mean equal distances.'}],
 i:[{id:'s114.i1',prompt:'Find the distance between (0, 0, 0) and (2, 3, 6).',answer:'7.',why:'4 + 9 + 36 = 49, whose root is exact.'},
  {id:'s114.i2',prompt:'Two points differ only in z, by 8. What is the distance?',answer:'8.',why:'The other two differences are zero.'},
  {id:'s114.i3',prompt:'A student computes a distance using only the x and y differences. What is missing?',answer:'The squared z difference.',why:'That is the term space adds to the plane formula.'},
  {id:'s114.i4',prompt:'Is \u221a41 or 6.40 the distance?',answer:'\u221a41.',why:'The decimal is a rounded description of it.'}],
 td:[{id:'s114.td1',prompt:'Why does the formula gain exactly one more squared term, rather than changing shape entirely?',reasoning:'Because the construction is Pythagoras applied twice, and the second application treats the first result as a single leg. The planar distance between the two shadows is one number; the height difference is another; they meet at a right angle, so their squares add. Nothing about the first triangle needs revisiting. The same reasoning would extend to a fourth coordinate and a fifth: each new perpendicular direction contributes one more squared difference and leaves the rest alone. So the formula is not a new rule for space but the old rule used once more, which is why it reduces back to the plane formula the moment the new difference is zero.'}],
 summary:`The distance in space is Pythagoras used twice: the planar distance between the two shadows is one leg, the difference in height the other, and their squares add. So the squared distance is the sum of the three squared differences — for ${orderedTriple(D_A)} and ${orderedTriple(D_B)} that is ${formatRational(distanceSquared3D(D_A, D_B))}, giving exactly ${formatDistance3D(D_A, D_B)}. With equal z the extra term vanishes and the plane formula returns. Geometric claims are tested by comparing squared distances exactly.`,
 next:'Later work measures positions and separations in space using these coordinates.',
 t:['Derive the space distance formula and test claims with it.',['Plane distance','Pythagoras'],['"Pythagoras twice", as the derivation'],['Derive the formula through the two triangles rather than stating it; the derivation is what makes the extra term obvious.','Compare squared distances when testing equality, so nothing is rounded.'],['Ask what is missing when a z difference is dropped.'],['Take all three differences before squaring.'],['Ask why one more term and not a new rule.']]} as unknown as L),

lesson({ id:'cbse_fo10_section_formula_lesson', sec:'', title:'Section formula in three dimensions', page:0,
 prereq:['ncert_kemh1_s11_4'], assume:['Coordinates in space','The section formula in a plane'],
 /**
  * Placement, not ownership: the lesson sits beside Chapter 11 and is
  * required instruction, but no NCERT section owns it.
  */
 chapterlessRole:'required_core',
 goal:'You will find the point that divides a segment in space in a given ratio.',
 checks:['Find the point dividing a segment in a plane in a given ratio.','Read an ordered triple.'],
 ifNot:'Revisit the plane section formula; the space version adds one coordinate to it.',
 representationFamilies:['coordinate:3d'],
 visuals:[V_SECTION, V_FRACTION, V_FLAT_SEC],
 vocab:[['divides internally','Lies on the segment between the two endpoints, not beyond either.'],
  ['ratio AP : PB','How the point splits the segment: the part from A to P against the part from P to B.']],
 expl:[`In a plane you already find the point dividing a segment in a given ratio by taking a weighted average of the two endpoints, one coordinate at a time. Space changes nothing about that idea. It only adds a third coordinate to average.`,
  `Say P divides AB internally so that AP : PB = m : n. Then each coordinate of P is the weighted average of the matching coordinates of A and B: P = (nA + mB) divided by (m + n).`,
  `The weights look backwards at first, and that is the one thing worth slowing down for. A LARGER m means a longer AP, which puts P further from A and closer to B — so B is the endpoint that carries m.`,
  `Checking it on the ends makes this concrete. If n is tiny, P sits almost at B; if m is tiny, P sits almost at A. The weight on an endpoint measures the distance to the OTHER one.`,
  `For ${SEC_A.label} at ${orderedTriple(SEC_A)} and ${SEC_B.label} at ${orderedTriple(SEC_B)} with AP : PB = 1 : 2, each coordinate takes two parts of A and one part of B, over three. That gives P at ${orderedTriple(SEC_P)}, one third of the way along.`,
  `The answer is kept exact. For ${orderedTriple(FRAC_A)} and ${orderedTriple(FRAC_B)} in the ratio 1 : 2 the point is ${orderedTriple(FRAC_P)} — fractions, not rounded decimals, because those fractions ARE the coordinates.`,
  `The midpoint is not a separate rule. It is this one with the ratio 1 : 1, where each coordinate is the plain average: ${orderedTriple(SEC_A)} and ${orderedTriple(SEC_B)} give ${orderedTriple(MID_P)}.`,
  `And if the two endpoints share a coordinate, the formula still works and simply returns it. ${FLAT_S.label} and ${FLAT_T.label} are both at z = 5, so their dividing point is too: ${orderedTriple(FLAT_P)}. The x and y come out exactly as the plane formula would give them.`],
 rep:['A three-dimensional diagram with both endpoints, the dividing point, and the ratio stated'],
 we:[{id:'fo10.we1',prompt:`Find the point dividing ${orderedTriple(SEC_A)} to ${orderedTriple(SEC_B)} in the ratio 1 : 2.`,steps:[['Weight B by 1 and A by 2, then divide by 3.','The larger part of the ratio goes to the far endpoint.'],[`For x: (2 x 1 + 1 x 7) / 3 = 3. The same for y and z.`,'One coordinate at a time, exactly as in a plane.'],[`So the point is ${orderedTriple(SEC_P)}.`,`It sits a third of the way from ${SEC_A.label}, which matches AP : PB = 1 : 2.`]],answer:orderedTriple(SEC_P)},
  {id:'fo10.we2',prompt:`Divide ${orderedTriple(FRAC_A)} to ${orderedTriple(FRAC_B)} in the ratio 1 : 2.`,steps:[['Apply the same weighting.','Nothing about fractions changes the method.'],[`For x: (2 x 0 + 1 x 7) / 3 = 7/3.`,'The result is not a whole number, and that is fine.'],[`The point is ${orderedTriple(FRAC_P)}, left exactly as fractions.`,'Rounding here would make later comparisons unreliable.']],answer:orderedTriple(FRAC_P)},
  {id:'fo10.we3',prompt:`Divide ${orderedTriple(FLAT_S)} to ${orderedTriple(FLAT_T)} in the ratio 3 : 1, where both ends are at the same height.`,steps:[['Both z coordinates are 5.','A weighted average of 5 and 5 is 5, whatever the weights.'],[`So z stays 5, and only x and y move: ${orderedTriple(FLAT_P)}.`,'The formula handles a constant coordinate without a special case.'],[`Those x and y are exactly what the plane formula gives for (1, 2) and (9, 6).`,'The space formula contains the plane one rather than replacing it.']],answer:orderedTriple(FLAT_P)}],
 g:[{id:'fo10.g1',prompt:'In AP : PB = m : n, which endpoint carries m?',hint:'Which end does a larger m move P toward?',answer:'B, the far endpoint.',why:'A larger m means a longer AP, so P moves toward B.'},
  {id:'fo10.g2',prompt:'What ratio gives the midpoint?',hint:'Equal parts.',answer:'1 : 1.',why:'Equal weights make each coordinate the plain average.'},
  {id:'fo10.g3',prompt:'Both endpoints have z = 4. What is z at the dividing point?',hint:'Average of 4 and 4.',answer:'4.',why:'A weighted average of equal values is that value.'}],
 i:[{id:'fo10.i1',prompt:'Divide (0, 0, 0) to (6, 9, 3) in the ratio 1 : 2.',answer:'(2, 3, 1).',why:'Two parts of the first end and one of the second, over three.'},
  {id:'fo10.i2',prompt:`A student divides ${orderedTriple(SEC_A)} to ${orderedTriple(SEC_B)} in the ratio 1 : 2 and writes (5, 6, 7). What went wrong?`,answer:'The weights were reversed.',why:`(5, 6, 7) is the 2 : 1 point. A larger first part pulls P toward B, so B carries m, not A. The correct answer is ${orderedTriple(SEC_P)}.`},
  {id:'fo10.i3',prompt:'Can the ratio 0 : 1 divide a segment internally?',answer:'No.',why:'A zero part would put the point at an endpoint rather than between them.'},
  {id:'fo10.i4',prompt:`Is ${orderedTriple(FRAC_P)} or (2.33, 3.67, 1.67) the dividing point?`,answer:orderedTriple(FRAC_P)+'.',why:'The decimal is a rounded description of it.'}],
 td:[{id:'fo10.td1',prompt:'Swapping the ratio from m : n to n : m moves the point somewhere specific. Where, and why?',reasoning:'It lands on the mirror image of the original point through the midpoint. Each coordinate is a weighted average, and swapping the weights swaps how far the result sits from each end: a point one third from A becomes one third from B. The midpoint is the one place this changes nothing, because 1 : 1 is its own swap — which is another way of seeing that the midpoint is the balance point of the segment. It also explains why the ratio must say which end it starts from: m : n is a statement about AP first and PB second, and reading it the other way round gives a different, equally valid point.'}],
 summary:`A point dividing AB internally in the ratio AP : PB = m : n has each coordinate equal to (n times A plus m times B) over (m + n). B carries m because a larger m lengthens AP and pulls the point toward B. The method is the plane formula with one more coordinate, the midpoint is the 1 : 1 case, and results stay exact: ${orderedTriple(FRAC_A)} to ${orderedTriple(FRAC_B)} in 1 : 2 gives ${orderedTriple(FRAC_P)}, not a decimal.`,
 next:'Later work places points along segments in space using these ratios.',
 t:['Find an internal dividing point in space and keep it exact.',['Plane section formula','Coordinates in space'],['"the weight on an endpoint measures the distance to the other one"'],['Check the weighting on the ends before computing: tiny n puts P near B.','Keep fractions as fractions; a rounded coordinate is a description, not the point.'],['Ask what went wrong in a reversed-weight answer.'],['Weight the far endpoint by the first part of the ratio.'],['Ask where swapping the ratio moves the point.']]} as unknown as L),

];
