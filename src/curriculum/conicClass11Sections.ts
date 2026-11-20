// ===========================================================================
// v0.84.0-c11.15 checkpoint 85 — CLASS 11 CHAPTER 10, CONIC SECTIONS.
//
// One conic object per curve drives its locus, parameters, standard
// equation, focal data, eccentricity, latus rectum and drawn figure.
// Nothing is typed twice. Section 10.4.2 is structural only, so its
// latus-rectum content lives inside the parabola lesson rather than
// becoming a ninth unit.
// ===========================================================================

import type { AuthoredSection } from './authoredSection';
import { type L, makeLesson } from './class11Lesson';
import { pt, rational, formatRational, formatRadical, formatPoint } from './coordinateGeometry';
import {
  circle, coneSection, conicGraph, directrix, eccentricity, ellipse, focalDifference,
  focalDistance, focalSum, foci, focusDirectrixHolds, hyperbola, latusRectum, onCircle,
  parabola, parabolaFocus, standardEquation, vertices,
} from './conicSections';

export const CON_C11_CHAPTER_ID = 'ncert_kemh1_ch10';
const BOOK = 'Mathematics, Textbook for Class XI (NCERT, Reprint 2026-27)';
const SRC = 'kemh1';
const INSPECTED = '2026-10-26';

const source = (sec: string, title: string, page: number) => {
  const parts = sec.split('.');
  const parent = parts.length > 2 ? parts.slice(0, 2).join('.') : sec;
  return {
    officialChapterId: CON_C11_CHAPTER_ID,
    officialSectionId: `ncert_kemh1_s${parent.replace(/\./g, '_')}`,
    ...(parts.length > 2 ? { officialSubsectionNumber: sec } : {}),
    sectionNumber: parent, exactTitle: title, startPage: page,
    textbook: BOOK, sourceReference: SRC, inspectionDate: INSPECTED,
  };
};

const lesson = (l: L): AuthoredSection => makeLesson(l, source);

/** Renders a model check in words rather than as a raw boolean. */
const confirms = (ok: boolean, yes: string, no: string): string => (ok ? yes : no);

export const O = pt('O', 0, 0, 'O');
export const C_5 = circle('c5', O, rational(5, 1));
export const P_8 = parabola('p8', rational(2, 1), 'right');
export const P_UP = parabola('pup', rational(1, 1), 'up');
export const E_H = ellipse('eh', rational(5, 1), rational(3, 1), 'horizontal');
export const E_V = ellipse('ev', rational(5, 1), rational(3, 1), 'vertical');
export const H_34 = hyperbola('h34', rational(3, 1), rational(4, 1), 'horizontal');

const EQ = standardEquation;
const EC = (c: typeof E_H | typeof H_34) => formatRadical(eccentricity(c));
const LR = (c: typeof E_H | typeof H_34 | typeof P_8) => formatRational(latusRectum(c));

export const V_CONE_CIRCLE = coneSection('v_cone_circle', 'perpendicular_to_axis', 'circle',
  'A double cone standing point to point, with its axis drawn as a dashed vertical line. A plane cuts straight across it perpendicular to that axis, and the curve of the cut is a circle.');
export const V_CONE_ELLIPSE = coneSection('v_cone_ellipse', 'oblique_not_parallel_to_generator', 'ellipse',
  'The double cone cut by a slanting plane that still crosses every slanting edge of one nappe. The cut closes on itself, and the curve is an ellipse.');
export const V_CONE_PARABOLA = coneSection('v_cone_parabola', 'parallel_to_generator', 'parabola',
  'The same double cone cut by a plane tilted until it runs parallel to one slanting edge of the cone. The cut meets only one nappe and never closes, and the curve is a parabola.');
export const V_CONE_HYPERBOLA = coneSection('v_cone_hyperbola', 'parallel_to_axis', 'hyperbola',
  'The double cone cut by a plane running parallel to the axis, so that it meets both nappes. The cut produces two separate open curves, and together they form a hyperbola.');

export const V_DEG_POINT = coneSection('v_deg_point', 'perpendicular_to_axis', 'point',
  'The same double cone, cut by a plane perpendicular to the axis but passing through the vertex itself. The circle has shrunk until nothing is left of it but the vertex, marked as a single dot.', true);
export const V_DEG_LINE = coneSection('v_deg_line', 'parallel_to_generator', 'straight line',
  'The double cone cut by a plane through the vertex, parallel to one slanting edge. The plane now contains that edge, so the section is the single straight generator drawn from the vertex down the surface.', true);
export const V_DEG_PAIR = coneSection('v_deg_pair', 'parallel_to_axis', 'pair of intersecting lines',
  'The double cone cut by a plane through the vertex, running parallel to the axis so that it meets both nappes. It cuts one generator from each, and the two straight lines cross at the vertex.', true);

export const V_CIRCLE = conicGraph('v_circle', C_5,
  `A coordinate grid showing the circle ${EQ(C_5)}, centred at the origin and marked C, passing through the points five units away from the centre in every direction. Its radius is ${formatRational(C_5.radius)}.`);
export const V_PARABOLA = conicGraph('v_parabola', P_8,
  `A coordinate grid showing the parabola ${EQ(P_8)} opening to the right from its vertex at the origin, marked V. The focus is marked F at ${formatPoint(parabolaFocus(P_8))}, and the directrix is drawn as a dashed vertical line at ${directrix(P_8).written}. Every point of the curve is the same distance from the focus as from that line.`,
  { showFoci: true, showDirectrix: true });
export const V_ELLIPSE_H = conicGraph('v_ellipse_h', E_H,
  `A coordinate grid showing the ellipse ${EQ(E_H)}, centred at the origin and wider than it is tall, so its major axis lies along the horizontal axis. The two foci are marked on that axis at ${foci(E_H).map(formatPoint).join(' and ')}.`,
  { showFoci: true });
export const V_ELLIPSE_V = conicGraph('v_ellipse_v', E_V,
  `A coordinate grid showing the ellipse ${EQ(E_V)}, centred at the origin and taller than it is wide, so its major axis lies along the vertical axis. The two foci are marked on that axis at ${foci(E_V).map(formatPoint).join(' and ')}. It is the same shape as the previous ellipse turned through a right angle.`,
  { showFoci: true });
export const V_HYPERBOLA = conicGraph('v_hyperbola', H_34,
  `A coordinate grid showing the hyperbola ${EQ(H_34)}, drawn as two separate open curves that never meet, one opening to the left and one to the right of the centre. The foci are marked at ${foci(H_34).map(formatPoint).join(' and ')} and the vertices at ${vertices(H_34).map(formatPoint).join(' and ')}.`,
  { showFoci: true });

export const CANONICAL_CONIC_VISUALS = [
  V_CONE_CIRCLE, V_CONE_ELLIPSE, V_CONE_PARABOLA, V_CONE_HYPERBOLA,
  V_DEG_POINT, V_DEG_LINE, V_DEG_PAIR,
  V_CIRCLE, V_PARABOLA, V_ELLIPSE_H, V_ELLIPSE_V, V_HYPERBOLA,
];

export const C11_CON_SECTIONS: AuthoredSection[] = [

lesson({ id:'ncert_kemh1_s10_2_cone_sections_lesson', sec:'10.2', title:'Sections of a Cone', page:168,
 assume:['Circles from earlier classes','The coordinate plane'],
 notIntroduce:[['Degenerate cases','ncert_kemh1_s10_2_2'],['Equations of conics','ncert_kemh1_s10_3']],
 goal:'You will see how one double cone produces four different curves, according to how a plane cuts it.',
 checks:['Describe a circle.','Say what a plane is.'], ifNot:'Picture a cone first; everything in this chapter comes from cutting one.',
 vocab:[['conic section','A curve obtained by cutting a double cone with a plane.'],
  ['nappe','One of the two halves of a double cone, meeting at the vertex.'],
  ['generator','A straight line lying along the surface of the cone through its vertex.']],
 expl:['Take two cones joined point to point, sharing an axis, each extending indefinitely. That is a double cone, and each half is called a nappe.',
  'Now cut it with a plane. The curve where plane and cone meet is a conic section, and which curve you get depends entirely on how the plane is tilted.',
  'Cut straight across, perpendicular to the axis, and the section closes into a circle. Tilt the plane a little, so it still crosses every generator of one nappe, and the closed curve stretches into an ellipse.',
  'Tilt further, until the plane runs parallel to one generator. Now it can never cross that generator, so the curve cannot close. It runs away indefinitely, and it is a parabola.',
  'Tilt further still, so the plane runs parallel to the axis. It now meets both nappes, cutting a separate curve from each, and the pair together is a hyperbola.',
  'Four curves from one surface, distinguished by nothing but the angle of the cut. That is why they are studied together rather than as four unrelated shapes, and why the rest of this chapter can treat them with one method.'],
 rep:['A double cone shown four times, each with a plane at a different tilt and the resulting curve named beneath'],
 visuals:[V_CONE_CIRCLE, V_CONE_ELLIPSE, V_CONE_PARABOLA, V_CONE_HYPERBOLA],
 we:[{id:'s102.we1',prompt:'Which curve does a plane perpendicular to the axis produce?',steps:[['A perpendicular cut meets the cone at the same distance from the axis all the way round.','The cone is symmetric about its axis, so a perpendicular slice sees the same radius in every direction.'],['Every point of the curve is therefore equally far from the axis, which is a circle.','The symmetry of the cone is what forces the symmetry of the section.']],answer:'A circle.'},
  {id:'s102.we2',prompt:'Why does a plane parallel to a generator give an open curve rather than a closed one?',steps:[['A closed curve requires the plane to cross every generator of the nappe.','Only then does the section come back round to where it started.'],['A plane parallel to one generator never meets that generator at all, however far either is extended.','Parallel lines in the plane of those two do not meet.'],['So one direction is left uncrossed and the curve cannot close: it is a parabola.','The open shape is a consequence of a missed generator, not of the plane being far away.']],answer:'Because it never crosses the generator it is parallel to.'},
  {id:'s102.we3',prompt:'Why does a hyperbola have two separate pieces?',steps:[['A plane parallel to the axis runs between the two nappes rather than across just one.','The axis passes through both nappes, so anything parallel to it can reach both.'],['It therefore cuts a curve from the upper nappe and another from the lower.','The two nappes touch only at the vertex, which the plane misses.'],['The two pieces never join, because the surface they come from is joined only at a point the plane avoids.','This is why a hyperbola is drawn as two branches and never as one continuous line.']],answer:'Because the plane meets both nappes, and they touch only at the vertex.'}],
 g:[{id:'s102.g1',prompt:'Which cut gives an ellipse?',hint:'Tilted, but still crossing every generator.',answer:'An oblique plane that crosses every generator of one nappe.',why:'Crossing every generator lets the curve close, and the tilt stretches it out of a circle.'},
  {id:'s102.g2',prompt:'Can a single cone, rather than a double one, give a hyperbola?',hint:'How many pieces does a hyperbola have?',answer:'No.',why:'A hyperbola has a branch on each nappe, so a single nappe can supply only one of them.'},
  {id:'s102.g3',prompt:'What distinguishes the four conic sections?',hint:'What is changed between the four pictures?',answer:'The angle at which the plane cuts the cone.',why:'The cone is the same in every case; only the tilt of the plane differs, and that alone decides the curve.'}],
 i:[{id:'s102.i1',prompt:'Is a circle a special kind of ellipse?',answer:'Yes, in the sense that it is the section of an untilted plane.',why:'Tilting the plane away from perpendicular stretches the circle into an ellipse, so the circle is the limiting case where there is no tilt.'},
  {id:'s102.i2',prompt:'Why is a parabola the boundary case between an ellipse and a hyperbola?',answer:'Because it is where the plane first becomes parallel to a generator.',why:'Below that tilt the curve still closes; beyond it the plane reaches the second nappe, so the parabola marks the changeover.'},
  {id:'s102.i3',prompt:'Does the size of the cone change which conic you get?',answer:'No.',why:'Only the angle of the cut matters; a larger cone gives a larger curve of the same kind.'},
  {id:'s102.i4',prompt:'Which conic results from a plane parallel to the axis?',answer:'A hyperbola.',why:'Such a plane meets both nappes, producing two branches.'}],
 td:[{id:'s102.td1',prompt:'Four very different-looking curves come from one surface. Why is that worth knowing, rather than just studying each curve separately?',reasoning:'Because it predicts that they will share properties, and they do. Each turns out to be describable by a focus and a measure of how far the cut is tilted, and each has a second-degree equation. If they were unrelated shapes there would be no reason to expect any of that. The common origin is the reason one chapter can handle all four, and the reason a single number, the eccentricity, can say which one you are looking at.'}],
 summary:'A double cone cut by a plane gives a circle when the cut is perpendicular to the axis, an ellipse when it is tilted but still crosses every generator, a parabola when it runs parallel to a generator, and a hyperbola when it is parallel to the axis and meets both nappes.',
 next:'Next you will see what happens when the plane passes through the vertex.',
 t:['Classify conic sections by the angle at which a plane cuts a double cone.',['Circles','Planes'],['"the angle of the cut" rather than "the shape"'],['Build the four cases by tilting one plane progressively; students who meet them as four separate facts miss that they are one family.','The parabola as the boundary case is the idea that makes eccentricity meaningful later.'],['Ask which cut cannot close.'],['Tilt a card against a paper cone and watch the section change.'],['Ask what happens when the plane passes through the vertex itself.']]} as unknown as L),

lesson({ id:'ncert_kemh1_s10_2_2_degenerate_lesson', sec:'10.2.2', title:'Degenerated Conic Sections', page:170,
 prereq:['ncert_kemh1_s10_2'], assume:['Sections of a cone'],
 goal:'You will see what the four conics collapse to when the cutting plane passes through the vertex of the cone.',
 checks:['Name the four conic sections.','Say where the two nappes meet.'], ifNot:'Revisit the cone sections; these are the same cuts moved onto the vertex.',
 vocab:[['degenerate conic','The curve obtained when the cutting plane passes through the vertex of the cone, which collapses to a point, a line, or a pair of intersecting lines.']],
 expl:['Every cut so far has missed the vertex. Move the plane so that it passes through the vertex and the same four tilts give something much smaller.',
  'A plane perpendicular to the axis through the vertex touches the cone at the vertex alone. The circle has shrunk to a single point.',
  'A plane parallel to a generator through the vertex meets the cone along that one generator. The parabola has collapsed to a straight line.',
  'A plane parallel to the axis through the vertex cuts along two generators, one on each nappe. The hyperbola has collapsed to a pair of intersecting lines, crossing at the vertex.',
  'These three are called degenerate conic sections. They are not failures of the method; they are what the ordinary cases become in a limiting position, and they are still sections of a cone.',
  'The name is worth taking literally. Something has degenerated: a curve with extent has lost it, and what remains is a point or straight lines with no curvature at all.'],
 rep:['Three cones, each cut by a plane through the vertex, showing a point, a single line, and two crossing lines'],
 visuals:[V_DEG_POINT, V_DEG_LINE, V_DEG_PAIR],
 we:[{id:'s1022.we1',prompt:'What does the plane perpendicular to the axis give when it passes through the vertex?',steps:[['Away from the vertex this cut gives a circle whose radius shrinks as the plane nears the vertex.','The cone narrows towards the vertex, so the section narrows with it.'],['At the vertex the radius has reached zero.','There is no width left for a circle to have.'],['So the section is a single point.','The circle has not disappeared; it has shrunk to nothing but its centre.']],answer:'A single point.'},
  {id:'s1022.we2',prompt:'Why does a plane through the vertex parallel to a generator give one line rather than two?',steps:[['Such a plane touches the cone along the generator it is parallel to.','Being parallel and sharing the vertex means it contains that generator.'],['It does not reach across to the other nappe, because a plane parallel to a generator stays on one side.','That is the same reason the ordinary parabola uses only one nappe.'],['So the section is a single straight line.','One nappe can supply only one generator here.']],answer:'A single straight line.'},
  {id:'s1022.we3',prompt:'Why do two intersecting lines rather than two parallel ones come from the vertex cut parallel to the axis?',steps:[['The plane meets both nappes, so it cuts a line from each.','This is the hyperbola case, moved onto the vertex.'],['Both lines pass through the vertex, because the plane contains it.','Every generator passes through the vertex by definition.'],['Two lines sharing a point intersect there, so they cannot be parallel.','The vertex is the point of intersection, which is also where the two branches of the ordinary hyperbola would have been closest.']],answer:'Because both lines pass through the vertex.'}],
 g:[{id:'s1022.g1',prompt:'What distinguishes a degenerate section from an ordinary one?',hint:'Where is the plane?',answer:'The plane passes through the vertex.',why:'The same tilts give ordinary conics when the plane misses the vertex and degenerate ones when it does not.'},
  {id:'s1022.g2',prompt:'Which ordinary conic degenerates to a point?',hint:'Which one closes most tightly?',answer:'The circle.',why:'Its radius shrinks to zero as the cutting plane approaches the vertex.'},
  {id:'s1022.g3',prompt:'Which degenerates to a pair of intersecting lines?',hint:'Which one has two pieces?',answer:'The hyperbola.',why:'Its two branches become two generators, one from each nappe, meeting at the vertex.'}],
 i:[{id:'s1022.i1',prompt:'Is a point a conic section?',answer:'Yes, a degenerate one.',why:'It is still obtained by cutting a cone with a plane; the plane simply passes through the vertex.'},
  {id:'s1022.i2',prompt:'Can a degenerate section be curved?',answer:'No.',why:'All three cases are a point or straight lines, which is what makes them degenerate rather than merely small.'},
  {id:'s1022.i3',prompt:'What does an ellipse degenerate to?',answer:'A point.',why:'Like the circle, it closes around the axis and shrinks to the vertex as the plane approaches it.'},
  {id:'s1022.i4',prompt:'Why study these cases at all?',answer:'Because they show what the ordinary cases become in a limiting position.',why:'They also appear later as the exceptional solutions of second-degree equations, so recognising them prevents treating a point or a line as a failed curve.'}],
 td:[{id:'s1022.td1',prompt:'The degenerate cases are a point and some straight lines. Why call them conic sections at all, rather than saying the cut produced nothing interesting?',reasoning:'Because they arise from exactly the same construction, and excluding them would make the classification untidy rather than tidier. If you move the plane gradually towards the vertex, the circle shrinks continuously to a point; there is no moment at which the section stops being a section. The same algebra that produces a circle produces a point when the radius reaches zero. A rule with no exceptions is more useful than one that works except at the vertex.'}],
 summary:'When the cutting plane passes through the vertex, the conic sections collapse: the circle and ellipse to a point, the parabola to a single straight line, and the hyperbola to a pair of lines intersecting at the vertex. These are the degenerate conic sections.',
 next:'Next you will put a conic on the coordinate plane and find its equation.',
 t:['Identify the three degenerate conic sections and the cuts that produce them.',['Sections of a cone'],['"the plane passes through the vertex" as the thing that makes a case degenerate'],['Show the circle shrinking continuously; the point then looks like a limit rather than an oddity.','These cases return when second-degree equations are solved, so naming them now saves confusion later.'],['Ask what the ellipse degenerates to.'],['Move a card towards the tip of a paper cone and watch the section shrink.'],['Ask whether two parallel lines can be a degenerate conic.']]} as unknown as L),


lesson({ id:'ncert_kemh1_s10_3_circle_lesson', sec:'10.3', title:'Circle', page:172,
 prereq:['ncert_kemh1_s10_2'], assume:['Sections of a cone','Distance between two points','Slope of a line'],
 goal:'You will derive the equation of a circle from its distance definition, and read a centre and radius back out of one.',
 checks:['Find the distance between two points.','Say what a circle is.'], ifNot:'Revisit the distance formula; the circle equation is that formula with the distance fixed.',
 vocab:[['circle','The set of points in a plane at a fixed distance from a fixed point.'],['centre','The fixed point.'],['radius','The fixed distance.']],
 expl:['A circle is defined by a condition, not by an equation: it is the set of points at a fixed distance from a fixed point. The equation is what that condition becomes in coordinates.',
  'Let the centre be (h, k) and the radius r. A point (x, y) lies on the circle exactly when its distance from the centre is r.',
  'The distance formula gives that distance as the square root of (x − h)² + (y − k)². Setting it equal to r and squaring both sides removes the radical and leaves (x − h)² + (y − k)² = r².',
  `With the centre at the origin this simplifies to x² + y² = r². For radius ${formatRational(C_5.radius)} that is ${EQ(C_5)}.`,
  `The equation can be read backwards. From ${EQ(C_5)} the centre is ${formatPoint(C_5.centre)} and the radius is ${formatRational(C_5.radius)}, because the right-hand side is r squared.`,
  `Testing a point means substituting it. ${formatPoint(pt('P',3,4,'P'))} satisfies the equation, so ${confirms(onCircle(C_5, pt('P',3,4,'P')), 'it lies on the circle', 'it does not lie on the circle')}; ${formatPoint(pt('Q',3,3,'Q'))} does not, so ${confirms(onCircle(C_5, pt('Q',3,3,'Q')), 'it lies on the circle', 'it lies off the circle')}.`,
  'The radius has to be positive. A radius of zero would leave only the centre itself, which is the degenerate point case from the previous lesson rather than a circle.'],
 rep:['A circle on coordinate axes with the centre marked and one radius drawn to a point on the curve'],
 visuals:[V_CIRCLE],
 we:[{id:'s103.we1',prompt:`Derive the equation of the circle of radius ${formatRational(C_5.radius)} centred at the origin.`,steps:[['Let (x, y) be any point on the circle. Its distance from the origin must equal the radius.','This is the definition of the circle, written for a general point.'],['The distance from the origin is the square root of x² + y², so that root equals the radius.','The distance formula with the centre at (0, 0).'],[`Squaring both sides removes the radical: ${EQ(C_5)}.`,'Squaring is safe because both sides are non-negative, so no solutions are gained or lost.']],answer:EQ(C_5)},
  {id:'s103.we2',prompt:`Find the centre and radius of ${EQ(C_5)}.`,steps:[['Compare with (x − h)² + (y − k)² = r². Here neither variable is shifted.','Nothing is subtracted from x or y, so both h and k are zero.'],[`So the centre is ${formatPoint(C_5.centre)}.`,'The shifts in the brackets are what move the centre.'],[`The right-hand side is r squared, so the radius is its square root, ${formatRational(C_5.radius)}.`,'The equation stores the square of the radius, not the radius itself.']],answer:`centre ${formatPoint(C_5.centre)}, radius ${formatRational(C_5.radius)}.`},
  {id:'s103.we3',prompt:`Is ${formatPoint(pt('Q',3,3,'Q'))} on the circle ${EQ(C_5)}?`,steps:[['Substitute the coordinates into the left-hand side: 9 + 9 = 18.','Membership is tested by substitution, never by looking at a drawing.'],[`18 is not 25, so ${confirms(onCircle(C_5, pt('Q',3,3,'Q')), 'the point is on the circle', 'the point is not on the circle')}.`,'A point whose distance squared is less than r squared lies inside rather than on it.']],answer:'No; it lies inside the circle.'}],
 g:[{id:'s103.g1',prompt:'What is the equation of the circle of radius 3 centred at the origin?',hint:'Square the radius.',answer:'x² + y² = 9.',why:'The right-hand side is the square of the radius, and a centre at the origin shifts neither variable.'},
  {id:'s103.g2',prompt:'What is the centre of (x − 2)² + (y + 1)² = 16?',hint:'Read the shifts inside the brackets.',answer:'(2, −1).',why:'The brackets subtract the centre coordinates, so a plus one inside means the y-coordinate is minus one.'},
  {id:'s103.g3',prompt:'Why must the radius be positive?',hint:'What would a radius of zero leave?',answer:'Because a radius of zero leaves only the centre.',why:'That is the degenerate point case rather than a circle, and a negative radius has no meaning as a distance.'}],
 i:[{id:'s103.i1',prompt:'Find the radius of x² + y² = 49.',answer:'7.',why:'The right-hand side is r squared, so the radius is its positive square root.'},
  {id:'s103.i2',prompt:`Is ${formatPoint(pt('R',0,5,'R'))} on ${EQ(C_5)}?`,answer:confirms(onCircle(C_5, pt('R',0,5,'R')), 'Yes.', 'No.'),why:'Substituting gives 0 + 25 = 25, which matches, so the point is exactly five units from the centre.'},
  {id:'s103.i3',prompt:'What does the equation describe if the right-hand side is zero?',answer:'A single point, the centre.',why:'A sum of two squares is zero only when both are, which forces x = h and y = k; this is the degenerate case.'},
  {id:'s103.i4',prompt:'Why does squaring both sides not change which points satisfy the condition?',answer:'Because both sides are non-negative.',why:'For non-negative quantities, equality of squares and equality of the quantities are the same statement.'}],
 td:[{id:'s103.td1',prompt:'The circle was defined by a distance condition and ended up as an equation. What was gained by the translation?',reasoning:'The condition is easier to understand and the equation is easier to compute with. Asking whether a point is at distance five from the origin requires a square root; asking whether x² + y² equals 25 requires only arithmetic. The translation also makes the circle comparable with the other conics, which arrive as equations of the same degree, so curves that look quite different can be handled by one set of techniques.'}],
 summary:'A circle is the set of points at a fixed distance r from a centre (h, k), which in coordinates becomes (x − h)² + (y − k)² = r². Centred at the origin this is x² + y² = r², and the centre and radius can be read straight back out.',
 next:'Next you will meet a conic defined by a point and a line together.',
 t:['Derive the circle equation from the distance definition and extract centre and radius.',['Distance formula'],['"the set of points at a fixed distance" before any equation appears'],['Derive rather than state; the squaring step is where the familiar form comes from and students who miss it cannot rebuild it.','The zero-radius case links back to the degenerate lesson and forward to second-degree equations.'],['Ask for the radius of x² + y² = 36.'],['Write the distance condition as a sentence before writing any symbols.'],['Ask what the equation looks like for a circle not centred at the origin.']]} as unknown as L),

lesson({ id:'ncert_kemh1_s10_4_parabola_lesson', sec:'10.4', title:'Parabola', page:175,
 prereq:['ncert_kemh1_s10_3'], assume:['The circle','Distance from a point to a line','Distance between two points'],
 goal:'You will derive the standard equation of a parabola from its focus and directrix, and identify its vertex, axis and latus rectum.',
 checks:['Find the distance from a point to a vertical line.','Derive the circle equation from a distance condition.'], ifNot:'Revisit the circle; the method is the same, with a different condition.',
 vocab:[['parabola','The set of points equidistant from a fixed point and a fixed line.'],['focus','The fixed point.'],['directrix','The fixed line.'],
  ['vertex','The point of the parabola on its axis, midway between focus and directrix.'],['axis','The line through the focus perpendicular to the directrix.'],
  ['latus rectum','The chord through the focus perpendicular to the axis.']],
 expl:['A circle used one fixed point. A parabola uses a fixed point and a fixed line, and asks for the points equally far from both.',
  `Put the focus at ${formatPoint(parabolaFocus(P_8))} and the directrix at ${directrix(P_8).written}, so the vertex sits at the origin midway between them. Call the distance from vertex to focus a.`,
  'For a point (x, y) the distance to the focus is the square root of (x − a)² + y². The distance to the directrix, a vertical line, is simply the horizontal gap, x + a.',
  'Setting the two equal and squaring gives (x − a)² + y² = (x + a)². The x² terms cancel, the a² terms cancel, and what remains is y² = 4ax.',
  `For a equal to ${formatRational(P_8.a)} this is ${EQ(P_8)}. The axis is the horizontal axis, the vertex is the origin, and the curve opens towards the focus.`,
  `The condition can be checked. ${formatPoint(pt('A',2,4,'A'))} lies on this parabola, and ${confirms(focusDirectrixHolds(P_8, pt('A',2,4,'A')), 'its distance to the focus equals its distance to the directrix', 'the two distances differ')}; ${formatPoint(pt('B',2,5,'B'))} does not, and ${confirms(focusDirectrixHolds(P_8, pt('B',2,5,'B')), 'the distances agree', 'the two distances differ')}.`,
  `The chord through the focus perpendicular to the axis is the latus rectum. Substituting the focus coordinate into the equation gives its half-length, so the full length is 4a, here ${LR(P_8)}.`,
  `Turning the picture gives the other standard forms. With the focus on the vertical axis the roles of x and y swap: ${EQ(P_UP)} opens upwards. A parabola opening sideways is not a function of x at all, since a vertical line meets it twice, and that is no objection to it being a perfectly good curve.`],
 rep:['A parabola with its focus marked, its directrix drawn as a dashed line, and one point joined to both by segments of equal length'],
 visuals:[V_PARABOLA],
 we:[{id:'s104.we1',prompt:'Derive the standard equation of a parabola with focus (a, 0) and directrix x = −a.',steps:[['Let (x, y) be a point of the parabola. Its distance to the focus is the square root of (x − a)² + y².','The distance formula between the point and the focus.'],['Its distance to the directrix is the horizontal gap to the line x = −a, which is x + a.','Distance to a vertical line is measured horizontally, so only the x-coordinates matter.'],['Set the two equal and square: (x − a)² + y² = (x + a)².','Squaring is safe because both distances are non-negative.'],['Expanding, the x² and a² terms cancel on both sides, leaving y² = 4ax.','The cancellation is why the result is so simple; nothing was discarded.']],answer:'y² = 4ax.'},
  {id:'s104.we2',prompt:`Find the focus, directrix and latus rectum of ${EQ(P_8)}.`,steps:[[`Compare with y² = 4ax: here 4a is ${LR(P_8)}, so a is ${formatRational(P_8.a)}.`,'The coefficient of x is four times the vertex-to-focus distance.'],[`The focus is ${formatPoint(parabolaFocus(P_8))} and the directrix is ${directrix(P_8).written}.`,'Both sit a units from the vertex, on opposite sides along the axis.'],[`The latus rectum has length 4a, which is ${LR(P_8)}.`,'It is the same number as the coefficient of x, which is a useful check rather than a coincidence.']],answer:`focus ${formatPoint(parabolaFocus(P_8))}, directrix ${directrix(P_8).written}, latus rectum ${LR(P_8)}.`},
  {id:'s104.we3',prompt:`Verify that ${formatPoint(pt('A',2,4,'A'))} lies on ${EQ(P_8)} using the defining condition.`,steps:[[`Its distance to the focus ${formatPoint(parabolaFocus(P_8))} is the square root of 0 + 16, which is 4.`,'The point is directly above the focus, so only the vertical gap counts.'],[`Its distance to the directrix ${directrix(P_8).written} is 2 + 2, which is 4.`,'Measured horizontally from the line to the point.'],[`The two agree, so ${confirms(focusDirectrixHolds(P_8, pt('A',2,4,'A')), 'the point satisfies the defining condition', 'the point does not satisfy it')}.`,'Substituting into the equation gives 16 = 16, which is the same fact in algebraic form.']],answer:'Both distances are 4, so the point is on the parabola.'}],
 g:[{id:'s104.g1',prompt:'What is the vertex of y² = 4ax?',hint:'Midway between focus and directrix.',answer:'The origin.',why:'The focus is at (a, 0) and the directrix at x = −a, so the midpoint on the axis is (0, 0).'},
  {id:'s104.g2',prompt:'What is the length of the latus rectum of y² = 12x?',hint:'It equals the coefficient of x.',answer:'12.',why:'Here 4a is 12, and the latus rectum has length 4a.'},
  {id:'s104.g3',prompt:'Which way does x² = 4ay open?',hint:'Which variable is squared?',answer:'Upwards.',why:'Squaring x makes y the free direction, so the axis is vertical and the curve opens towards the focus above the vertex.'}],
 i:[{id:'s104.i1',prompt:'Find the focus of y² = 16x.',answer:'(4, 0).',why:'4a is 16 so a is 4, and the focus lies a units from the vertex along the axis.'},
  {id:'s104.i2',prompt:'Why is a sideways parabola not a function of x?',answer:'Because a vertical line meets it twice.',why:'For each positive x there are two values of y with the same square, and a function may assign only one.'},
  {id:'s104.i3',prompt:'Where does the parabola meet its axis?',answer:'At the vertex.',why:'The vertex is the only point of the curve on the axis, lying midway between focus and directrix.'},
  {id:'s104.i4',prompt:'Can the focus lie on the directrix?',answer:'No.',why:'Then every point equidistant from both would have to be on the line itself, and the curve would degenerate rather than being a parabola.'}],
 td:[{id:'s104.td1',prompt:'The circle used one fixed point and the parabola uses a point and a line. Why does that small change produce such a different curve?',reasoning:'Because the two distances grow at different rates. Moving away from the centre of a circle increases the only distance involved, so the condition pins the points to a closed loop. For a parabola, moving away increases the distance to the focus and the distance to the line together, and they can keep pace with each other indefinitely. Nothing closes the curve, which is the same fact the cone showed: the cutting plane never crosses the generator it is parallel to.'}],
 summary:`A parabola is the set of points equidistant from a focus and a directrix. With focus (a, 0) and directrix x = −a the condition gives y² = 4ax, with vertex at the origin, axis along the x-axis and latus rectum of length 4a — here ${EQ(P_8)} with latus rectum ${LR(P_8)}.`,
 next:'Next you will use two fixed points instead of one.',
 t:['Derive the parabola equation from focus and directrix and identify its features, including the latus rectum.',['Circle derivation','Distance to a line'],['"equidistant from a point and a line" before any equation'],['The cancellation in the derivation is the whole lesson; work it on the board rather than quoting y² = 4ax.','The latus rectum belongs here — the textbook subsection is structural only and carries no separate lesson.'],['Ask for the directrix of y² = 8x.'],['Measure both distances for one point before any algebra.'],['Ask what happens to the curve as a grows.']]} as unknown as L),


lesson({ id:'ncert_kemh1_s10_5_ellipse_lesson', sec:'10.5', title:'Ellipse', page:180,
 prereq:['ncert_kemh1_s10_4'], assume:['The parabola','Distance between two points'],
 notIntroduce:[['Eccentricity and latus rectum','ncert_kemh1_s10_5_2']],
 goal:'You will derive both standard equations of an ellipse and see that the two are different orientations rather than rival formulas.',
 checks:['Derive a conic equation from a distance condition.','Name the focus of a parabola.'], ifNot:'Revisit the parabola derivation; the method is the same with two fixed points.',
 vocab:[['ellipse','The set of points whose distances from two fixed points have a constant sum.'],['foci','The two fixed points.'],
  ['major axis','The longer axis of the ellipse, through both foci.'],['minor axis','The shorter axis, perpendicular to the major axis at the centre.'],
  ['vertices','The endpoints of the major axis.']],
 expl:['A parabola balanced one distance against another. An ellipse uses two fixed points, the foci, and asks for the points whose two distances add to a constant.',
  'Call that constant 2a and put the foci on the horizontal axis at (−c, 0) and (c, 0). Writing both distances, setting the sum to 2a and clearing the radicals leads to x²/a² + y²/b² = 1, where b² = a² − c².',
  `That relation is the one to hold on to: c² = a² − b², so the foci are closer to the centre than the vertices are. For ${EQ(E_H)} we get a = ${formatRational(E_H.a)}, b = ${formatRational(E_H.b)} and c = ${formatRadical(focalDistance(E_H))}, putting the foci at ${foci(E_H).map(formatPoint).join(' and ')}.`,
  `The sum of distances is 2a everywhere on the curve. At the vertex ${formatPoint(vertices(E_H)[1])} the two distances total ${(focalSum(E_H, vertices(E_H)[1])).toFixed(0)}, which is twice ${formatRational(E_H.a)} as promised.`,
  `Now turn the picture through a right angle, putting the foci on the vertical axis. The same derivation runs with x and y exchanged, and the equation becomes ${EQ(E_V)}.`,
  `Compare the two: ${EQ(E_H)} and ${EQ(E_V)}. The denominators have swapped. This is not a slip in one of them — it is how the equation records which axis is the major one. In the first the larger denominator sits under x², so the ellipse is wider than it is tall; in the second it sits under y², so the ellipse is taller than it is wide.`,
  'So the denominator order carries real information. Reading it as cosmetic would lose the orientation entirely, and with it the position of the foci.'],
 rep:['Two ellipses side by side, one wider than tall and one taller than wide, each with its foci marked on the longer axis'],
 visuals:[V_ELLIPSE_H, V_ELLIPSE_V],
 we:[{id:'s105.we1',prompt:`Find a, b, c and the foci of ${EQ(E_H)}.`,steps:[[`The denominators are ${formatRational(E_H.a)}² and ${formatRational(E_H.b)}². The larger sits under x², so the major axis is horizontal.`,'The larger denominator always lies under the variable along the major axis.'],[`So a is ${formatRational(E_H.a)} and b is ${formatRational(E_H.b)}.`,'a is the semi-major and b the semi-minor axis, never the other way round.'],[`Then c² = a² − b² = 25 − 9 = 16, so c is ${formatRadical(focalDistance(E_H))}, and the foci are ${foci(E_H).map(formatPoint).join(' and ')} on the major axis.`,'The foci lie on the major axis because that is the axis the two fixed points defined.']],answer:`a = ${formatRational(E_H.a)}, b = ${formatRational(E_H.b)}, c = ${formatRadical(focalDistance(E_H))}, foci ${foci(E_H).map(formatPoint).join(' and ')}.`},
  {id:'s105.we2',prompt:`How does ${EQ(E_V)} differ from ${EQ(E_H)}?`,steps:[['The larger denominator has moved from under x² to under y².','That is the only change between the two equations.'],[`So the major axis is now vertical, and the foci move to ${foci(E_V).map(formatPoint).join(' and ')}.`,'The foci always lie on the major axis, so moving the axis moves them.'],['The two describe the same shape in different orientations, not two different shapes.','Rotating one through a right angle produces the other exactly.']],answer:'The major axis is vertical rather than horizontal.'},
  {id:'s105.we3',prompt:`Verify the defining condition at the vertex ${formatPoint(vertices(E_H)[1])} of ${EQ(E_H)}.`,steps:[[`Its distances to the two foci ${foci(E_H).map(formatPoint).join(' and ')} are 9 and 1.`,'The vertex lies on the major axis, so both distances are measured along it.'],[`They sum to ${(focalSum(E_H, vertices(E_H)[1])).toFixed(0)}, which is 2a.`,'The constant sum is twice the semi-major axis, which is what fixes a in the derivation.'],['Every other point of the ellipse gives the same total.','That constancy is the definition; the equation is only its coordinate form.']],answer:`The distances sum to ${(focalSum(E_H, vertices(E_H)[1])).toFixed(0)}, which is 2a.`}],
 g:[{id:'s105.g1',prompt:'In x²/16 + y²/25 = 1, which axis is the major one?',hint:'Where is the larger denominator?',answer:'The vertical axis.',why:'25 is larger and sits under y², so the ellipse extends further vertically.'},
  {id:'s105.g2',prompt:'What relation connects a, b and c for an ellipse?',hint:'The foci sit inside the vertices.',answer:'c² = a² − b².',why:'Subtracting makes c smaller than a, which is why the foci lie between the centre and the vertices.'},
  {id:'s105.g3',prompt:'Where do the foci always lie?',hint:'Which axis defined them?',answer:'On the major axis.',why:'The two fixed points of the definition are the foci, and the longer axis is the one joining them through the centre.'}],
 i:[{id:'s105.i1',prompt:'Find the foci of x²/25 + y²/16 = 1.',answer:'(−3, 0) and (3, 0).',why:'c² = 25 − 16 = 9, so c is 3, and the major axis is horizontal because the larger denominator is under x².'},
  {id:'s105.i2',prompt:'What happens to the ellipse when a equals b?',answer:'It becomes a circle.',why:'Then c is zero, the two foci merge at the centre, and the constant-sum condition becomes a constant-distance one.'},
  {id:'s105.i3',prompt:'Are x²/9 + y²/25 = 1 and x²/25 + y²/9 = 1 the same curve?',answer:'No.',why:'They are the same shape in different orientations: one is taller than wide and the other wider than tall, with foci on different axes.'},
  {id:'s105.i4',prompt:'Why must a be larger than b?',answer:'Because a is defined as the semi-major axis.',why:'If the value under y² were larger, the roles would swap and the equation would be the other orientation, not an ellipse with b greater than a.'}],
 td:[{id:'s105.td1',prompt:'The source gives two standard equations for the ellipse with the denominators swapped. Why is that two pieces of information rather than one piece written twice?',reasoning:'Because the equation has to record the orientation somewhere, and the denominator order is where. Both forms say the same thing about shape — the semi-axes are a and b — and different things about direction: which way the curve is stretched, and therefore which axis carries the foci. Treating one as a misprint for the other would discard the orientation, and an ellipse with its foci placed on the wrong axis is a different curve, not a redrawn one.'}],
 summary:`An ellipse is the set of points whose distances from two foci have constant sum 2a, giving x²/a² + y²/b² = 1 with c² = a² − b². The second standard form, with the denominators swapped, is the same shape with its major axis vertical: ${EQ(E_H)} against ${EQ(E_V)}.`,
 next:'Next you will measure how far from circular an ellipse is.',
 t:['Derive both standard ellipse equations and read orientation, axes and foci from them.',['Parabola derivation','Distance formula'],['"the larger denominator sits under the major axis variable"'],['The two orientations are the single most misread point in this chapter; show them side by side rather than one after the other.','Check the constant sum at a vertex; it makes 2a concrete rather than a letter in a derivation.'],['Ask which axis is major in x²/4 + y²/9 = 1.'],['Mark the foci before writing any equation.'],['Ask what happens to the foci as b approaches a.']]} as unknown as L),

lesson({ id:'ncert_kemh1_s10_5_2_ellipse_eccentricity_lesson', sec:'10.5.2', title:'Eccentricity and Latus Rectum of an Ellipse', page:185,
 prereq:['ncert_kemh1_s10_5'], assume:['The ellipse and its parameters'],
 goal:'You will compute the eccentricity and latus rectum of an ellipse from its own parameters, exactly.',
 checks:['Find a, b and c for an ellipse.','Say where the foci lie.'], ifNot:'Revisit the ellipse; both quantities here are built from a, b and c.',
 vocab:[['eccentricity','The ratio c/a, measuring how far an ellipse departs from a circle.']],
 expl:['The eccentricity of an ellipse is e = c/a, the ratio of the focal distance to the semi-major axis. It is a single number saying how stretched the ellipse is.',
  `For ${EQ(E_H)}, c is ${formatRadical(focalDistance(E_H))} and a is ${formatRational(E_H.a)}, so e is ${EC(E_H)}. Keeping it as a fraction is exact; a decimal would only approximate it.`,
  'Because c² = a² − b² with b positive, c is always less than a, so the eccentricity of an ellipse is always less than 1. That is not a separate rule but a consequence of the relation between the three parameters.',
  'The extremes are worth noting. As b approaches a the foci close on the centre, c approaches zero and e approaches zero: the ellipse becomes a circle. As b shrinks towards zero, e approaches 1 and the ellipse flattens towards a segment.',
  `The latus rectum is the chord through a focus perpendicular to the major axis. Substituting the focus coordinate into the equation and solving gives its half-length as b²/a, so the full length is 2b²/a. For ${EQ(E_H)} that is ${LR(E_H)}.`,
  'Both quantities come from a and b alone. Nothing new is measured: the ellipse already contains the information, and these are two ways of reading it out.'],
 rep:['An ellipse with the latus rectum drawn as a vertical chord through one focus, and the ratio c to a marked along the major axis'],
 visuals:[V_ELLIPSE_H],
 we:[{id:'s1052.we1',prompt:`Find the eccentricity of ${EQ(E_H)}.`,steps:[[`From the denominators, a is ${formatRational(E_H.a)} and b is ${formatRational(E_H.b)}.`,'The larger denominator is under x², so the major axis is horizontal.'],[`Then c² = a² − b² = 16, so c is ${formatRadical(focalDistance(E_H))}.`,'The focal distance comes from the relation between the two semi-axes.'],[`So e = c/a = ${EC(E_H)}, kept exact.`,'Being less than 1 confirms the curve is an ellipse rather than a hyperbola.']],answer:EC(E_H)},
  {id:'s1052.we2',prompt:`Find the latus rectum of ${EQ(E_H)}.`,steps:[['The latus rectum is the chord through a focus perpendicular to the major axis, so set x equal to the focus coordinate.','Its endpoints are on the curve, so they satisfy the equation.'],['Solving for y gives the half-length as b²/a.','The algebra reduces neatly because the focus coordinate and the relation between a, b and c fit together.'],[`Doubling gives 2b²/a, which here is ${LR(E_H)}.`,'The full chord is twice the half-length, since the major axis bisects it.']],answer:LR(E_H)},
  {id:'s1052.we3',prompt:'Why is the eccentricity of an ellipse always less than 1?',steps:[['c² = a² − b² with b strictly positive, so c² is less than a².','Subtracting a positive quantity leaves something smaller.'],['Both c and a are positive lengths, so c is less than a.','Taking square roots preserves the inequality for positive values.'],['Therefore c/a is less than 1.','If it reached 1 the minor axis would have vanished, and the curve would no longer be an ellipse.']],answer:'Because c is always smaller than a.'}],
 g:[{id:'s1052.g1',prompt:'What is the eccentricity of a circle?',hint:'Where are its foci?',answer:'0.',why:'The foci coincide at the centre, so c is zero and the ratio c/a is zero.'},
  {id:'s1052.g2',prompt:'Find e for x²/25 + y²/16 = 1.',hint:'Subtract the squares to get c.',answer:'3/5.',why:'c² = 25 − 16 = 9 so c is 3, and dividing by a = 5 gives three fifths.'},
  {id:'s1052.g3',prompt:'What is the latus rectum formula for an ellipse?',hint:'Both semi-axes appear in it.',answer:'2b²/a.',why:'Substituting the focus coordinate into the equation gives a half-length of b²/a, and the chord is twice that.'}],
 i:[{id:'s1052.i1',prompt:`Find the latus rectum of ${EQ(E_V)}.`,answer:LR(E_V),why:'The semi-axes are unchanged by the rotation, so 2b²/a gives the same length with the chord now horizontal.'},
  {id:'s1052.i2',prompt:'What does an eccentricity close to 1 tell you?',answer:'The ellipse is very flattened.',why:'c is then nearly as large as a, which forces b to be small, so the minor axis is much shorter than the major one.'},
  {id:'s1052.i3',prompt:'Can an ellipse have eccentricity exactly 1?',answer:'No.',why:'That would need b to be zero, collapsing the ellipse to a segment of the major axis.'},
  {id:'s1052.i4',prompt:'Why is e kept as a fraction rather than a decimal?',answer:'Because the fraction is exact.',why:'A decimal would be a rounded approximation of a number that can be written precisely from the parameters.'}],
 td:[{id:'s1052.td1',prompt:'Eccentricity is a single number. Why is it a more useful description of shape than listing a and b?',reasoning:'Because it describes shape alone, with size divided out. Two ellipses with the same eccentricity are the same shape at different scales, which a and b cannot tell you without comparison. It also makes the family of conics comparable: a circle has eccentricity zero, an ellipse sits between zero and one, and a hyperbola lies above one. One number places a curve within the whole family, which is why it is the parameter the next lessons carry forward.'}],
 summary:`The eccentricity of an ellipse is e = c/a, always less than 1 because c² = a² − b²; for ${EQ(E_H)} it is ${EC(E_H)}. The latus rectum, the focal chord perpendicular to the major axis, has length 2b²/a, here ${LR(E_H)}.`,
 next:'Next you will change one sign and get a very different curve.',
 t:['Compute ellipse eccentricity and latus rectum exactly from a and b.',['The ellipse','c² = a² − b²'],['"exactly" whenever a fraction or radical is left unevaluated'],['Derive the latus rectum rather than quoting 2b²/a; the substitution explains where it comes from.','The e below 1 result links the ellipse to the hyperbola lesson that follows.'],['Ask for e when a = 5 and b = 4.'],['Compute c before anything else, every time.'],['Ask what eccentricity says about the shape of a planetary orbit.']]} as unknown as L),


lesson({ id:'ncert_kemh1_s10_6_hyperbola_lesson', sec:'10.6', title:'Hyperbola', page:188,
 prereq:['ncert_kemh1_s10_5'], assume:['The ellipse','Distance between two points'],
 notIntroduce:[['Eccentricity and latus rectum','ncert_kemh1_s10_6_1']],
 goal:'You will derive the standard equation of a hyperbola from a difference of distances, and see why it has two separate branches.',
 checks:['Derive the ellipse equation from a sum of distances.','State the relation c² = a² − b².'], ifNot:'Revisit the ellipse; the method is the same with a difference in place of a sum.',
 vocab:[['hyperbola','The set of points whose distances from two fixed points have a constant difference.'],
  ['transverse axis','The axis through the two vertices and the foci.'],['conjugate axis','The axis perpendicular to the transverse axis at the centre.'],
  ['branch','One of the two separate curves making up a hyperbola.']],
 expl:['The ellipse fixed the sum of two distances. Change that one word to difference and the curve changes completely.',
  'Take the same two foci and ask for the points whose distances differ by a constant 2a, in magnitude. Writing both distances, setting the difference to 2a and clearing radicals gives x²/a² − y²/b² = 1.',
  'The minus sign is the whole difference between this and the ellipse, and it changes the relation between the parameters too: here c² = a² + b², so c is larger than a rather than smaller.',
  `For ${EQ(H_34)}, a is ${formatRational(H_34.a)}, b is ${formatRational(H_34.b)} and c is ${formatRadical(focalDistance(H_34))}. The foci are at ${foci(H_34).map(formatPoint).join(' and ')} and the vertices at ${vertices(H_34).map(formatPoint).join(' and ')}, so the foci lie beyond the vertices.`,
  `The difference of distances is 2a everywhere on the curve. At the vertex ${formatPoint(vertices(H_34)[1])} the two focal distances differ by ${(focalDifference(H_34, vertices(H_34)[1])).toFixed(0)}, which is twice ${formatRational(H_34.a)}.`,
  'The curve comes in two pieces. Being nearer the first focus by 2a gives one branch; being nearer the second by the same amount gives the other. No point satisfies both, and between the vertices no point satisfies either, so there is a genuine gap. The two branches are never joined, in a drawing or anywhere else.',
  'As with the ellipse, there is a second orientation. Putting the foci on the vertical axis exchanges the roles of the variables and gives y²/a² − x²/b² = 1, with the transverse axis vertical.'],
 rep:['Two separate open curves facing away from each other, with the foci marked beyond the vertices on the transverse axis'],
 visuals:[V_HYPERBOLA],
 we:[{id:'s106.we1',prompt:`Find a, b, c, the vertices and the foci of ${EQ(H_34)}.`,steps:[[`The positive term is in x², so the transverse axis is horizontal, and a is ${formatRational(H_34.a)}.`,'Which variable carries the positive sign decides the orientation, not which denominator is larger.'],[`b is ${formatRational(H_34.b)} from the other denominator, and c² = a² + b² = 25, so c is ${formatRadical(focalDistance(H_34))}.`,'The plus sign here is what makes c larger than a, unlike the ellipse.'],[`So the vertices are ${vertices(H_34).map(formatPoint).join(' and ')} and the foci ${foci(H_34).map(formatPoint).join(' and ')}, with the foci outside the vertices.`,'The curve opens away from the centre past each vertex towards its focus.']],answer:`a = ${formatRational(H_34.a)}, b = ${formatRational(H_34.b)}, c = ${formatRadical(focalDistance(H_34))}.`},
  {id:'s106.we2',prompt:'Why does the hyperbola have two branches while the ellipse has one closed curve?',steps:[['The condition fixes a difference, and a difference can be taken either way round.','Being 2a nearer the first focus and being 2a nearer the second are two distinct conditions.'],['Each gives its own set of points, on opposite sides of the centre.','No point can be nearer to both foci by the same amount.'],['So the solution set falls into two pieces with a gap between the vertices.','The gap is not a drawing artefact; no point there satisfies the condition at all.']],answer:'Because a difference can be taken in two orders, giving two separate sets of points.'},
  {id:'s106.we3',prompt:`Verify the defining condition at the vertex ${formatPoint(vertices(H_34)[1])} of ${EQ(H_34)}.`,steps:[[`Its distances to the foci ${foci(H_34).map(formatPoint).join(' and ')} are 8 and 2.`,'The vertex lies on the transverse axis, so both are measured along it.'],[`Their difference is ${(focalDifference(H_34, vertices(H_34)[1])).toFixed(0)}, which is 2a.`,'The constant difference is twice the semi-transverse axis, which is what fixes a.'],['Every other point of either branch gives the same difference.','That constancy is the definition, and the equation is its coordinate form.']],answer:`The distances differ by ${(focalDifference(H_34, vertices(H_34)[1])).toFixed(0)}, which is 2a.`}],
 g:[{id:'s106.g1',prompt:'What relation connects a, b and c for a hyperbola?',hint:'Is c inside or outside the vertices here?',answer:'c² = a² + b².',why:'Adding rather than subtracting makes c larger than a, which puts the foci beyond the vertices.'},
  {id:'s106.g2',prompt:'In y²/9 − x²/16 = 1, which is the transverse axis?',hint:'Which term is positive?',answer:'The vertical axis.',why:'The positive term is in y², so the curve opens up and down and the vertices lie on the vertical axis.'},
  {id:'s106.g3',prompt:'May the two branches be joined when drawing?',hint:'Is there any point between them?',answer:'No.',why:'No point between the vertices satisfies the condition, so a line drawn across the gap would claim points the curve does not have.'}],
 i:[{id:'s106.i1',prompt:'Find the foci of x²/16 − y²/9 = 1.',answer:'(−5, 0) and (5, 0).',why:'c² = 16 + 9 = 25 so c is 5, and the transverse axis is horizontal because the positive term is in x².'},
  {id:'s106.i2',prompt:'For a hyperbola, is a always larger than b?',answer:'No.',why:'Unlike the ellipse there is no such requirement; the orientation is decided by which term is positive, not by which denominator is larger.'},
  {id:'s106.i3',prompt:'Where do the foci lie relative to the vertices?',answer:'Beyond them.',why:'c is larger than a because c² = a² + b², so each focus is further from the centre than its vertex.'},
  {id:'s106.i4',prompt:'Does the hyperbola meet the conjugate axis?',answer:'No.',why:'Setting the transverse variable to zero gives a negative value for a square, which no real point satisfies.'}],
 td:[{id:'s106.td1',prompt:'The ellipse and hyperbola differ by one sign in the equation and one word in the definition. Why is the resulting difference so large?',reasoning:'Because a sum and a difference constrain in opposite ways. A sum bounds how far a point can stray: if both distances must add to a fixed total, neither can grow without limit, so the curve closes. A difference bounds nothing of the kind — both distances can grow indefinitely while their difference stays fixed, so the curve runs away. The same contrast appeared on the cone: the ellipse came from a plane crossing every generator, the hyperbola from one that escapes to both nappes.'}],
 summary:`A hyperbola is the set of points whose distances from two foci differ by a constant 2a, giving x²/a² − y²/b² = 1 with c² = a² + b². Here ${EQ(H_34)} has foci ${foci(H_34).map(formatPoint).join(' and ')} beyond its vertices, and the curve has two branches that never meet.`,
 next:'Next you will measure this curve the way you measured the ellipse.',
 t:['Derive the hyperbola equation from a difference of distances and identify its branches, axes and foci.',['The ellipse','Distance formula'],['"differ by" rather than "add to", said deliberately against the ellipse'],['Set the two definitions side by side; one word apart is the clearest way to make the sign change mean something.','Insist the branches are never joined when sketching — it is the commonest drawing error in the chapter.'],['Ask which term is positive in a vertical hyperbola.'],['Compute both focal distances at a vertex before any algebra.'],['Ask whether a hyperbola can be as wide as it is tall.']]} as unknown as L),

lesson({ id:'ncert_kemh1_s10_6_1_hyperbola_eccentricity_lesson', sec:'10.6.1', title:'Eccentricity and Latus Rectum of a Hyperbola', page:192,
 prereq:['ncert_kemh1_s10_6'], assume:['The hyperbola and its parameters','Eccentricity of an ellipse'],
 goal:'You will compute the eccentricity and latus rectum of a hyperbola exactly, and see why its eccentricity exceeds 1.',
 checks:['Find a, b and c for a hyperbola.','State the eccentricity of an ellipse.'], ifNot:'Revisit the hyperbola; both quantities come from its a and b.',
 vocab:[['eccentricity of a hyperbola','The ratio c/a, which is always greater than 1.']],
 expl:['Eccentricity is defined the same way as for the ellipse: e = c/a. What changes is the relation behind c.',
  `For a hyperbola c² = a² + b², so c is larger than a and the ratio exceeds 1. For ${EQ(H_34)}, c is ${formatRadical(focalDistance(H_34))} and a is ${formatRational(H_34.a)}, giving e = ${EC(H_34)}.`,
  `Set that against the ellipse: ${EQ(E_H)} has eccentricity ${EC(E_H)}, below 1, and ${EQ(H_34)} has ${EC(H_34)}, above it. The number alone says which curve you are looking at.`,
  'This completes the family. A circle has eccentricity 0, an ellipse lies between 0 and 1, a parabola sits exactly at 1, and a hyperbola is above 1. One parameter orders all four curves that the cone produced.',
  `The latus rectum is again the focal chord perpendicular to the transverse axis, and the same substitution gives the same expression, 2b²/a. For ${EQ(H_34)} that is ${LR(H_34)}.`,
  'The shared formula is worth noticing. Ellipse and hyperbola differ in the relation between a, b and c, not in how the latus rectum is read off, which is one more sign that these are two members of a single family rather than unrelated curves.'],
 rep:['A hyperbola with the latus rectum drawn through one focus, and the ratio c to a marked from centre to focus'],
 visuals:[V_HYPERBOLA],
 we:[{id:'s1061.we1',prompt:`Find the eccentricity of ${EQ(H_34)}.`,steps:[[`a is ${formatRational(H_34.a)} and b is ${formatRational(H_34.b)} from the denominators, with the positive term in x².`,'The positive term identifies the transverse axis and therefore a.'],[`c² = a² + b² = 9 + 16 = 25, so c is ${formatRadical(focalDistance(H_34))}.`,'Adding, not subtracting, which is what pushes c beyond a.'],[`So e = c/a = ${EC(H_34)}, exactly, and being above 1 confirms it is a hyperbola.`,'The value is kept as a fraction rather than rounded.']],answer:EC(H_34)},
  {id:'s1061.we2',prompt:`Find the latus rectum of ${EQ(H_34)}.`,steps:[['Set x to the focus coordinate, since the chord passes through the focus perpendicular to the transverse axis.','Its endpoints lie on the curve, so they satisfy the equation.'],['Solving for y gives the half-length b²/a.','The same algebra as for the ellipse, despite the sign change in the equation.'],[`Doubling gives 2b²/a, here ${LR(H_34)}.`,'The transverse axis bisects the chord, so the full length is twice the half-length.']],answer:LR(H_34)},
  {id:'s1061.we3',prompt:'Why is the eccentricity of a hyperbola always greater than 1?',steps:[['c² = a² + b² with b strictly positive, so c² exceeds a².','Adding a positive quantity gives something larger.'],['Both are positive lengths, so c exceeds a.','Square roots preserve the inequality for positive values.'],['So c/a exceeds 1, which is exactly what distinguishes a hyperbola from an ellipse.','The ellipse subtracts b² and so lands below 1; the parabola sits at the boundary.']],answer:'Because c² = a² + b² makes c larger than a.'}],
 g:[{id:'s1061.g1',prompt:'What is the eccentricity of a parabola?',hint:'The boundary case between the other two.',answer:'1.',why:'It sits between the ellipse below 1 and the hyperbola above it, matching its position as the boundary cut on the cone.'},
  {id:'s1061.g2',prompt:'Find e for x²/16 − y²/9 = 1.',hint:'Add the squares, do not subtract them.',answer:'5/4.',why:'c² = 16 + 9 = 25 so c is 5, and dividing by a = 4 gives five quarters, above 1 as required.'},
  {id:'s1061.g3',prompt:'What is the latus rectum formula for a hyperbola?',hint:'The same substitution at the focus as before.',answer:'2b²/a.',why:'The same expression as the ellipse, because the substitution at the focus works the same way despite the sign change.'}],
 i:[{id:'s1061.i1',prompt:'Order the four conics by eccentricity.',answer:'Circle 0, ellipse between 0 and 1, parabola 1, hyperbola above 1.',why:'The single parameter orders the whole family the cone produced, which is why it is worth defining at all.'},
  {id:'s1061.i2',prompt:'Can a hyperbola have eccentricity exactly 1?',answer:'No.',why:'That would need b to be zero, which collapses the curve rather than leaving a hyperbola.'},
  {id:'s1061.i3',prompt:'What does a very large eccentricity tell you?',answer:'The branches open out widely.',why:'c is then much larger than a, so b is large compared with a and the curve spreads rapidly from its vertices.'},
  {id:'s1061.i4',prompt:'Why do the ellipse and hyperbola share the latus rectum formula?',answer:'Because the substitution at the focus reduces the same way for both.',why:'Only the relation between a, b and c differs, and that relation does not enter the half-length expression.'}],
 td:[{id:'s1061.td1',prompt:'One number — the eccentricity — distinguishes all four conics. Why should a single ratio be able to do that?',reasoning:'Because it measures exactly the thing the cone was varying: the tilt of the cutting plane. A perpendicular cut gives no stretch and eccentricity zero; tilting increases it; at the tilt where the plane becomes parallel to a generator it reaches one, which is the parabola; past that the plane reaches the second nappe and the value exceeds one. The ratio c/a is the algebraic shadow of the geometric angle, which is why one number can order curves that look nothing alike.'}],
 summary:`For a hyperbola e = c/a with c² = a² + b², so the eccentricity always exceeds 1 — for ${EQ(H_34)} it is ${EC(H_34)}, against ${EC(E_H)} for the comparable ellipse. The latus rectum is 2b²/a, here ${LR(H_34)}, the same expression as for the ellipse.`,
 next:'That completes the chapter on conic sections.',
 t:['Compute hyperbola eccentricity and latus rectum exactly and place all four conics on the eccentricity scale.',['The hyperbola','c² = a² + b²'],['"above one" and "below one" as the quick test for which curve'],['End the chapter by ordering all four conics by eccentricity; it ties the algebra back to the cone the chapter opened with.','Keep values exact; the fractions are more informative than decimals here.'],['Ask for e when a = 3 and b = 4.'],['Compute c before anything else, as with the ellipse.'],['Ask what curve has eccentricity exactly 1 and why.']]} as unknown as L),

];
