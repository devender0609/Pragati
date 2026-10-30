// ===========================================================================
// v0.84.0-c10.12 checkpoint 66 — CLASS 10 AREAS RELATED TO CIRCLES.
//
// PROCEDURAL_EXTENSION. The source model records it as such, and the frozen
// Class 9 record backs it: Chapter 6 derived arc length as the angle's share
// of the circumference (s6_4) and sector area as the angle's share of the
// disc (s6_10_sector). So arc length and sector area are RE-derived here,
// not introduced. What Class 10 adds is the segment, the subtraction that
// defines it, and combined figures.
//
// Every region is a CircleRegion, and every area is computed from it. The
// segment is never given an area of its own.
//
// Source: NCERT Mathematics, Textbook for Class X (Reprint 2026-27), §11.1
// (folio 154). §11.2 is REVIEW and earns no unit. Scope constraint: segment
// problems restricted to central angles 60, 90 and 120.
// ===========================================================================

import type { AuthoredSection } from './authoredSection';
import {
  arcLength, areaValue, centreTriangleArea, circumference, discArea,
  formatArea, majorSegmentArea, minorSegmentArea, sectorArea,
  type CircleRegion,
} from './circleRegion';

export const CIRCLE_AREA_CHAPTER_ID = 'ncert_jemh1_ch11';

const BOOK = 'Mathematics, Textbook for Class X (Reprint 2026-27)';
const SRC = 'https://ncert.nic.in/textbook/pdf/jemh1dd.zip';
const INSPECTED = '2026-10-16';

const source = () => ({
  officialChapterId: CIRCLE_AREA_CHAPTER_ID,
  officialSectionId: 'ncert_jemh1_s11_1',
  sectionNumber: '11.1',
  exactTitle: 'Areas of Sector and Segment of a Circle',
  startPage: 154, textbook: BOOK, sourceReference: SRC, inspectionDate: INSPECTED,
});

/** What the frozen Class 9 record already established. */
export const CLASS_9_CIRCLE_PRIOR = {
  source: 'src/curriculum/perimeterAreaSections.ts (Class 9 Chapter 6, frozen)',
  alreadyCovered: [
    'the circumference of a circle and what \u03c0 means (s6_2, s6_3)',
    'the length of an arc as the share of the circumference its central angle determines (s6_4)',
    'the area of a disc, derived by rearranging thin sectors (s6_10_disc)',
    'the area of a sector as the share of the disc its angle determines, distinguished from its bounding arc (s6_10_sector)',
  ],
  genuinelyNewInClass10: [
    'the circular segment, the region between a chord and its arc',
    'segment area obtained by subtracting the centre triangle from the sector',
    'the major segment as the rest of the disc',
    'areas and perimeters of figures combining circles with other plane shapes',
  ],
};

const region = (id: string, kind: CircleRegion['kind'], theta: number, label: string,
  composedOf?: CircleRegion['composedOf']): CircleRegion => ({ id, kind, theta, label, composedOf });

export const R_SECTOR_60 = region('sector60', 'sector', 60, 'the sector with a 60\u00b0 central angle');
export const R_SECTOR_90 = region('sector90', 'sector', 90, 'the quadrant');
export const R_SECTOR_120 = region('sector120', 'sector', 120, 'the sector with a 120\u00b0 central angle');
export const R_TRIANGLE_60 = region('tri60', 'triangle', 60, 'the equilateral triangle on the chord');
export const R_TRIANGLE_90 = region('tri90', 'triangle', 90, 'the right-angled triangle on the chord');
export const R_TRIANGLE_120 = region('tri120', 'triangle', 120, 'the isosceles triangle on the chord');
export const R_MINOR_60 = region('minor60', 'minor_segment', 60, 'the minor segment cut off by the chord', ['sector', 'triangle']);
export const R_MINOR_90 = region('minor90', 'minor_segment', 90, 'the minor segment of the quadrant', ['sector', 'triangle']);
export const R_MINOR_120 = region('minor120', 'minor_segment', 120, 'the minor segment cut off by the chord', ['sector', 'triangle']);
export const R_MAJOR_90 = region('major90', 'major_segment', 90, 'the major segment, the rest of the disc', ['disc', 'minor_segment']);
export const R_MAJOR_120 = region('major120', 'major_segment', 120, 'the major segment, the rest of the disc', ['disc', 'minor_segment']);
export const R_DISC = region('disc', 'disc', 360, 'the whole disc');

export const CANONICAL_REGIONS = [
  R_SECTOR_60, R_SECTOR_90, R_SECTOR_120, R_TRIANGLE_60, R_TRIANGLE_90, R_TRIANGLE_120,
  R_MINOR_60, R_MINOR_90, R_MINOR_120, R_MAJOR_90, R_MAJOR_120, R_DISC,
];

/** Radii used in the authored examples. */
export const R14 = 14;
export const R7 = 7;
export const R6 = 6;

const n2 = (v: number) => Number(v.toFixed(2));
const A = (a: ReturnType<typeof sectorArea>, r: number) => n2(areaValue(a, r));

const teacher = (objective: string, prereq: string[], lang: string[], notes: string[], checks: string[], support: string[], ext: string[]) => ({
  objective, prerequisiteKnowledge: prereq, modelLanguage: lang, teachingNotes: notes,
  quickChecks: checks, supportForStrugglingLearners: support, extension: ext, materialsNeeded: [],
});

export const C10_SECTION_11_1A: AuthoredSection = {
  contentArtifactId: 'ncert_jemh1_s11_1_sector_lesson',
  contentArtifactVersion: 1,
  source: source(),
  competencyCandidates: [], competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: [],
    mayAssume: ['Circumference and \u03c0 from Class IX', 'Arc length as the angle\u2019s share of the circumference, from Class IX', 'Sector area as the angle\u2019s share of the disc, from Class IX'],
    mustNotIntroduce: [
      { concept: 'The segment and the subtraction defining it', belongsToSection: 'ncert_jemh1_s11_1b' },
      { concept: 'Combined figures', belongsToSection: 'ncert_jemh1_s11_1c' },
    ],
  },
  learningGoal:
    'You will re-derive the arc length and the area of a sector as the \u03b8/360 share of the circle, and see that both come from the same fraction.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: ['Write the circumference and the area of a circle of radius r.', 'Express an angle as a fraction of 360\u00b0.', 'Multiply a fraction by an expression.'],
    ifNotReady: 'Revise circles from Class IX. You derived both of these results there; this lesson sets them side by side.',
  },
  vocabulary: [
    { term: 'central angle', meaning: 'The angle \u03b8 at the centre between the two radii bounding a sector, measured in degrees.' },
    { term: 'sector', meaning: 'The region bounded by two radii and the arc between them.' },
    { term: 'arc', meaning: 'The part of the circle between the two points where the radii meet it.' },
    { term: 'radius', meaning: 'The distance r from the centre to any point of the circle.' },
  ],
  explanation: [
    'You derived the length of an arc and the area of a sector in Class IX. This lesson re-derives both together, because the segment work that follows depends on getting the same \u03b8 into both.',
    'A SECTOR is the region bounded by two radii and the arc between them. It is determined by the centre, the radius r and the CENTRAL ANGLE \u03b8 between the two radii \u2014 not by how the region looks, and the angle used in any formula has to be that central angle.',
    'The whole circle corresponds to 360\u00b0 at the centre. A central angle of \u03b8 takes the fraction \u03b8/360 of that turn, and both the boundary and the region are shared out in exactly that proportion.',
    'For the arc: the whole circumference is 2\u03c0r, so the arc cut off by \u03b8 has length (\u03b8/360) \u00d7 2\u03c0r.',
    'For the area: the whole disc is \u03c0r\u00b2, so the sector has area (\u03b8/360) \u00d7 \u03c0r\u00b2.',
    'The two results are not separate facts to remember. They are the same fraction \u03b8/360 applied to two different totals, which is why arc divided by circumference and sector area divided by disc area both come out as \u03b8/360.',
    `A check: with r = ${R14} and \u03b8 = 90\u00b0, the fraction is a quarter. The circumference ${n2(circumference(R14))} gives an arc of ${n2(arcLength(90, R14))}, and the disc area ${A(discArea(), R14)} gives a sector area of ${A(sectorArea(90), R14)} \u2014 each exactly a quarter of its total.`,
    'All the angles here are in DEGREES, because \u03b8/360 only makes sense that way. A figure marked 60\u00b0 feeds \u03b8 = 60 into the formulas, never anything else.',
  ],
  representations: ['A circle with two radii, the central angle marked, and the sector and its arc named separately'],
  visuals: [], visualsById: {},
  workedExamples: [
    {
      id: 's111a.we1',
      prompt: 'Derive the length of the arc of a sector with central angle \u03b8 in a circle of radius r.',
      steps: [
        { text: 'A full turn at the centre is 360\u00b0 and corresponds to the whole circumference 2\u03c0r.', reasoning: 'The whole boundary and the whole turn correspond, which is what lets a part of one measure a part of the other.' },
        { text: 'The central angle \u03b8 is the fraction \u03b8/360 of that turn.', reasoning: 'Dividing the angle by the whole turn gives the share, which is a pure number with no units attached.' },
        { text: 'The arc takes the same share of the circumference: (\u03b8/360) \u00d7 2\u03c0r.', reasoning: 'Equal angles at the centre cut off equal arcs, so the arc length is proportional to the angle rather than merely increasing with it.' },
        { text: `With \u03b8 = 90 and r = ${R14}: (90/360) \u00d7 2\u03c0 \u00d7 ${R14} = ${n2(arcLength(90, R14))}.`, reasoning: `A quarter of the circumference ${n2(circumference(R14))}, which is what a quarter turn should give.` },
      ],
      answer: 'Arc length = (\u03b8/360) \u00d7 2\u03c0r.',
    },
    {
      id: 's111a.we2',
      prompt: 'Derive the area of that sector.',
      steps: [
        { text: 'The whole disc has area \u03c0r\u00b2 and corresponds to the full 360\u00b0.', reasoning: 'The same correspondence as before, now between the turn and the region rather than the boundary.' },
        { text: 'The sector takes the fraction \u03b8/360 of the disc.', reasoning: 'The same share, because the sector is cut by the same two radii that cut the angle.' },
        { text: 'So the sector area is (\u03b8/360) \u00d7 \u03c0r\u00b2.', reasoning: 'The derivation is identical in shape to the arc one; only the total being shared has changed.' },
        { text: `With \u03b8 = 60 and r = ${R6}: (60/360) \u00d7 \u03c0 \u00d7 ${R6}\u00b2 = ${formatArea(sectorArea(60))} \u00d7 ${R6}\u00b2 = ${A(sectorArea(60), R6)}.`, reasoning: `A sixth of the disc area ${A(discArea(), R6)}, since 60\u00b0 is a sixth of a full turn.` },
      ],
      answer: 'Sector area = (\u03b8/360) \u00d7 \u03c0r\u00b2.',
    },
    {
      id: 's111a.we3',
      prompt: `A sector of a circle of radius ${R7} has central angle 120\u00b0. Find its arc length and area, and check both against the whole circle.`,
      steps: [
        { text: '120/360 = 1/3, so this sector is a third of the circle.', reasoning: 'Reducing the fraction first makes both checks at the end immediate.' },
        { text: `Arc length = (1/3) \u00d7 2\u03c0 \u00d7 ${R7} = ${n2(arcLength(120, R7))}.`, reasoning: `A third of the circumference ${n2(circumference(R7))}, as the share requires.` },
        { text: `Area = (1/3) \u00d7 \u03c0 \u00d7 ${R7}\u00b2 = ${A(sectorArea(120), R7)}.`, reasoning: `A third of the disc area ${A(discArea(), R7)}, computed from the same fraction.` },
        { text: 'Both ratios come to 1/3, which is \u03b8/360.', reasoning: 'The agreement is the point: one fraction governs the boundary and the region together.' },
      ],
      answer: `Arc ${n2(arcLength(120, R7))} and area ${A(sectorArea(120), R7)}.`,
    },
  ],
  guidedPractice: [
    { id: 's111a.g1', prompt: `Find the arc length of a 90\u00b0 sector in a circle of radius ${R6}.`, hint: 'What fraction of the circumference?', answer: `${n2(arcLength(90, R6))}.`, rationale: `90/360 = 1/4, and a quarter of the circumference ${n2(circumference(R6))} is ${n2(arcLength(90, R6))}.` },
    { id: 's111a.g2', prompt: `Find the area of a 60\u00b0 sector in a circle of radius ${R14}.`, hint: 'A sixth of the disc.', answer: `${A(sectorArea(60), R14)}.`, rationale: `60/360 = 1/6, and a sixth of the disc area ${A(discArea(), R14)} is ${A(sectorArea(60), R14)}.` },
    { id: 's111a.g3', prompt: 'Why do arc length and sector area use the same fraction?', hint: 'What does the central angle divide?', answer: 'Because the same two radii cut both the boundary and the region.', rationale: 'The angle \u03b8 is \u03b8/360 of the full turn, and both the circumference and the disc are shared out in that proportion.' },
  ],
  independentPractice: [
    { id: 's111a.i1', prompt: `Find the area of a 120\u00b0 sector in a circle of radius ${R6}.`, answer: `${A(sectorArea(120), R6)}.`, rationale: `120/360 = 1/3, so the area is a third of ${A(discArea(), R6)}.` },
    { id: 's111a.i2', prompt: 'A figure marks the central angle as 60\u00b0 but the working uses 120/360. What has gone wrong?', answer: 'The formula is using an angle the figure does not have.', rationale: 'The \u03b8 in the formula must be the central angle the figure marks, or the answer describes a different sector from the one drawn.' },
    { id: 's111a.i3', prompt: `A sector has arc length exactly half the circumference. What is its central angle?`, answer: '180\u00b0.', rationale: 'The share \u03b8/360 equals 1/2, so \u03b8 = 180. The angle is recovered from the fraction just as the fraction was found from the angle.' },
    { id: 's111a.i4', prompt: 'Can a sector area ever exceed the area of its circle?', answer: 'No.', rationale: '\u03b8/360 is at most 1, since \u03b8 cannot exceed a full turn, so the share of the disc is at most the whole disc.' },
  ],
  misconceptionIds: [], interactivePractice: [],
  reasoningApplication: [
    {
      id: 's111a.td1',
      prompt: 'Why does the area of a sector scale directly with its central angle?',
      expectedReasoning:
        'Because the sector is the share of the disc that the angle cuts out, and the share is \u03b8/360 \u2014 a quantity directly proportional to \u03b8. Doubling the angle doubles the fraction, so it doubles the area, for the same reason that it doubles the arc. Nothing else in the formula depends on \u03b8: r is fixed by the circle, and \u03c0r\u00b2 is the fixed total being divided up. This is worth noticing now, because the segment in the next lesson does NOT behave this way.',
    },
    {
      id: 's111a.td2',
      prompt: 'A sector and its arc share the same two endpoints and the same angle. Why are their measurements different kinds of quantity?',
      expectedReasoning:
        'The arc is part of the boundary, so it is a LENGTH and is measured against the circumference; the sector is part of the interior, so it is an AREA and is measured against the disc. The same fraction \u03b8/360 governs both, but it is applied to different totals \u2014 2\u03c0r in one case and \u03c0r\u00b2 in the other \u2014 so the results carry different units and cannot be compared with each other. What they share is the proportion, not the quantity.',
    },
  ],
  summary:
    `A sector is bounded by two radii and their arc, and is determined by r and the CENTRAL angle \u03b8 in degrees. The angle takes the fraction \u03b8/360 of the full turn, and that one fraction governs both: arc length = (\u03b8/360) \u00d7 2\u03c0r and sector area = (\u03b8/360) \u00d7 \u03c0r\u00b2. Both were derived in Class IX; setting them side by side matters because the segment work ahead needs the same \u03b8 in both.`,
  nextStep: 'Next you will remove a triangle from a sector to find the region left between a chord and its arc.',
  teacher: teacher(
    'Students re-derive arc length and sector area from the \u03b8/360 share and keep the central angle consistent.',
    ['Circumference and disc area (Class IX)', 'Arc length and sector area (Class IX)'],
    ['What fraction of the turn?', 'Is that the CENTRAL angle?', 'Same fraction, different total.'],
    [
      'This is re-derivation, not introduction. Students met both results in Class IX, so the time belongs on the shared fraction rather than on either formula alone.',
      'Insist on degrees. \u03b8/360 is meaningless otherwise, and the chapter has no occasion for radians.',
      'The proportionality noted in Think deeper sets up the segment lesson, where it fails.',
    ],
    ['Ask what fraction a 120\u00b0 sector is.', 'Ask why both formulas share \u03b8/360.'],
    ['Have the student reduce \u03b8/360 to a simple fraction before substituting anything.'],
    ['Ask what central angle gives a sector of exactly one eighth of the disc.'],
  ),
  reviewStatus: 'authored_draft',
};

export const C10_SECTION_11_1B: AuthoredSection = {
  contentArtifactId: 'ncert_jemh1_s11_1_segment_lesson',
  contentArtifactVersion: 1,
  source: source(),
  competencyCandidates: [], competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_jemh1_s11_1'],
    mayAssume: ['Sector area as the \u03b8/360 share', 'The ratios of 30\u00b0, 45\u00b0 and 60\u00b0 derived in Chapter 8', 'Area of a triangle'],
    mustNotIntroduce: [{ concept: 'Combined figures', belongsToSection: 'ncert_jemh1_s11_1c' }],
  },
  learningGoal:
    'You will find the area of a segment by subtracting the centre triangle from the sector, for central angles of 60\u00b0, 90\u00b0 and 120\u00b0.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: ['Find the area of a sector from r and \u03b8.', 'Find the area of an equilateral triangle of side r.', 'Recall sin 60\u00b0 and cos 60\u00b0.'],
    ifNotReady: 'Revise the previous lesson and the special angles from Chapter 8. Both are needed here.',
  },
  vocabulary: [
    { term: 'chord', meaning: 'The straight line joining the two points where the radii meet the circle.' },
    { term: 'segment', meaning: 'The region between a chord and its arc \u2014 the sector with the centre triangle removed.' },
    { term: 'minor segment', meaning: 'The smaller of the two regions a chord divides the disc into.' },
    { term: 'major segment', meaning: 'The larger of the two \u2014 the rest of the disc.' },
  ],
  explanation: [
    'A sector and a segment can share the same arc and still be different regions, and the difference is exactly one triangle.',
    'Join the two points where the radii meet the circle. That straight line is the CHORD. The SECTOR is bounded by the two radii and the arc; the SEGMENT is bounded by the chord and the same arc. The sector includes the triangle between the chord and the centre; the segment does not.',
    'So the segment is what is left when that triangle is taken away:',
    'segment area = sector area \u2212 area of the triangle formed by the centre and the two ends of the chord.',
    'This is why a segment cannot be found from \u03b8/360 \u00d7 \u03c0r\u00b2 alone. That expression gives the sector, which is too big by the triangle every time the chord does not pass through the centre.',
    'The triangle itself is found from the geometry, not from a new formula. For a 60\u00b0 angle the two radii and the chord are all equal, so the triangle is equilateral of side r and its area is (\u221a3/4)r\u00b2. For 90\u00b0 the two radii are perpendicular, so the triangle is right-angled with legs r and its area is \u00bdr\u00b2.',
    'For 120\u00b0, drop the perpendicular from the centre to the chord. It splits the triangle into two 30-60-90 triangles, so half the chord is r sin 60\u00b0 = (\u221a3/2)r and the height is r cos 60\u00b0 = r/2. The area is \u00bd \u00d7 \u221a3r \u00d7 r/2 = (\u221a3/4)r\u00b2 \u2014 the same as the 60\u00b0 triangle, though the two triangles are different shapes.',
    `Putting it together for \u03b8 = 60: the sector is ${formatArea(sectorArea(60))}r\u00b2 and the triangle is ${formatArea(centreTriangleArea(60))}r\u00b2, so the minor segment is ${formatArea(minorSegmentArea(60))} times r\u00b2. The \u03c0 and the \u221a3 do not combine, so the exact answer keeps both.`,
    `Once the minor segment is known, the MAJOR segment \u2014 the rest of the disc \u2014 follows by subtracting it from \u03c0r\u00b2, not by a separate calculation. For \u03b8 = 90 the minor segment is ${formatArea(minorSegmentArea(90))} times r\u00b2 and the major segment is ${formatArea(majorSegmentArea(90))} times r\u00b2, and the two add back to \u03c0r\u00b2.`,
  ],
  representations: ['A sector with its centre triangle outlined, and the segment left over named separately'],
  visuals: [], visualsById: {},
  workedExamples: [
    {
      id: 's111b.we1',
      prompt: `A chord of a circle of radius ${R14} subtends 90\u00b0 at the centre. Find the area of the minor segment.`,
      steps: [
        { text: `r = ${R14} and \u03b8 = 90\u00b0, the angle the figure marks at the centre.`, reasoning: 'The angle used in the arithmetic has to be the one the figure asserts, or the answer belongs to a different region.' },
        { text: `Sector area = (90/360) \u00d7 \u03c0 \u00d7 ${R14}\u00b2 = ${formatArea(sectorArea(90))} \u00d7 ${R14}\u00b2 = ${A(sectorArea(90), R14)}.`, reasoning: 'A quarter of the disc, by the share derived in the previous lesson.' },
        { text: `The two radii are perpendicular, so the triangle is right-angled with legs ${R14}: area = \u00bd \u00d7 ${R14} \u00d7 ${R14} = ${A(centreTriangleArea(90), R14)}.`, reasoning: 'The 90\u00b0 central angle IS the angle between the legs, so the elementary triangle formula applies with no extra work.' },
        { text: `Segment = sector \u2212 triangle = ${A(sectorArea(90), R14)} \u2212 ${A(centreTriangleArea(90), R14)} = ${A(minorSegmentArea(90), R14)}.`, reasoning: 'The region remaining between the chord and the arc, with the triangle removed exactly once.' },
        { text: `Exactly, this is ${formatArea(minorSegmentArea(90))} times r\u00b2.`, reasoning: 'Keeping the exact form shows the \u03c0 and the rational part separately, which a decimal hides.' },
      ],
      answer: `${A(minorSegmentArea(90), R14)}, exactly (${formatArea(minorSegmentArea(90))})r\u00b2.`,
    },
    {
      id: 's111b.we2',
      prompt: `A chord of a circle of radius ${R6} subtends 60\u00b0 at the centre. Find the minor segment.`,
      steps: [
        { text: `Sector area = (60/360) \u00d7 \u03c0 \u00d7 ${R6}\u00b2 = ${A(sectorArea(60), R6)}.`, reasoning: 'A sixth of the disc, since 60\u00b0 is a sixth of a full turn.' },
        { text: 'The two radii are equal and the angle between them is 60\u00b0, so the third angle pair is also 60\u00b0 and the triangle is equilateral of side r.', reasoning: 'An isosceles triangle with a 60\u00b0 apex has two 60\u00b0 base angles, so all three sides are equal \u2014 this is derived, not read off the picture.' },
        { text: `Its area is (\u221a3/4) \u00d7 ${R6}\u00b2 = ${A(centreTriangleArea(60), R6)}.`, reasoning: 'The standard equilateral-triangle area with side r, which follows from its own height.' },
        { text: `Segment = ${A(sectorArea(60), R6)} \u2212 ${A(centreTriangleArea(60), R6)} = ${A(minorSegmentArea(60), R6)}.`, reasoning: `Exactly ${formatArea(minorSegmentArea(60))} times r\u00b2 \u2014 a small region, because at 60\u00b0 the triangle fills most of the sector.` },
      ],
      answer: `${A(minorSegmentArea(60), R6)}, exactly (${formatArea(minorSegmentArea(60))})r\u00b2.`,
    },
    {
      id: 's111b.we3',
      prompt: `A chord of a circle of radius ${R7} subtends 120\u00b0 at the centre. Find both segments.`,
      steps: [
        { text: `Sector area = (120/360) \u00d7 \u03c0 \u00d7 ${R7}\u00b2 = ${A(sectorArea(120), R7)}.`, reasoning: 'A third of the disc, by the same share as always.' },
        { text: 'Drop the perpendicular from the centre to the chord; it splits the triangle into two 30-60-90 triangles.', reasoning: 'The perpendicular from the centre bisects the chord and the 120\u00b0 angle, leaving two congruent right triangles with 60\u00b0 at the centre.' },
        { text: `Half the chord is r sin 60\u00b0 = (\u221a3/2)r and the height is r cos 60\u00b0 = r/2, so the triangle area is \u00bd \u00d7 \u221a3r \u00d7 r/2 = (\u221a3/4)r\u00b2 = ${A(centreTriangleArea(120), R7)}.`, reasoning: 'The ratios come from Chapter 8\u2019s special angles, so no general area formula is needed.' },
        { text: `Minor segment = ${A(sectorArea(120), R7)} \u2212 ${A(centreTriangleArea(120), R7)} = ${A(minorSegmentArea(120), R7)}.`, reasoning: 'The region between the chord and the shorter arc, with the triangle taken off once.' },
        { text: `Major segment = disc \u2212 minor segment = ${A(discArea(), R7)} \u2212 ${A(minorSegmentArea(120), R7)} = ${A(majorSegmentArea(120), R7)}.`, reasoning: 'Derived from the minor segment rather than computed separately, so the two necessarily add back to the disc.' },
      ],
      answer: `Minor ${A(minorSegmentArea(120), R7)}, major ${A(majorSegmentArea(120), R7)}.`,
    },
  ],
  guidedPractice: [
    { id: 's111b.g1', prompt: `A chord of a circle of radius ${R6} subtends 90\u00b0. Find the minor segment.`, hint: 'Sector minus triangle.', answer: `${A(minorSegmentArea(90), R6)}.`, rationale: `Sector ${A(sectorArea(90), R6)} minus the right triangle ${A(centreTriangleArea(90), R6)}.` },
    { id: 's111b.g2', prompt: 'Why is the segment area not (\u03b8/360) \u00d7 \u03c0r\u00b2?', hint: 'What does that expression include?', answer: 'Because that gives the sector, which still contains the triangle.', rationale: 'The sector is bounded by two radii; the segment is bounded by the chord. The difference between them is exactly the centre triangle.' },
    { id: 's111b.g3', prompt: `For radius ${R7} and \u03b8 = 120\u00b0, a student answers ${A(sectorArea(120), R7)} for the segment. What was missed?`, hint: 'Compare with the sector.', answer: 'The triangle was not subtracted.', rationale: `That is the sector area. Removing the triangle ${A(centreTriangleArea(120), R7)} gives the segment ${A(minorSegmentArea(120), R7)}.` },
  ],
  independentPractice: [
    { id: 's111b.i1', prompt: `A chord of a circle of radius ${R14} subtends 60\u00b0. Find the minor segment.`, answer: `${A(minorSegmentArea(60), R14)}.`, rationale: `Sector ${A(sectorArea(60), R14)} minus the equilateral triangle ${A(centreTriangleArea(60), R14)}.` },
    { id: 's111b.i2', prompt: `For radius ${R14} and \u03b8 = 90\u00b0, find the major segment.`, answer: `${A(majorSegmentArea(90), R14)}.`, rationale: `The disc ${A(discArea(), R14)} minus the minor segment ${A(minorSegmentArea(90), R14)}. The two add back to the disc exactly.` },
    { id: 's111b.i3', prompt: 'Two students\u2019 answers for one segment differ by exactly the area of the triangle. What happened?', answer: 'One computed the sector and stopped.', rationale: 'The segment is the sector less the triangle, so forgetting the subtraction leaves a difference of precisely the triangle area.' },
    { id: 's111b.i4', prompt: 'A student writes segment = triangle \u2212 sector. What is wrong, and how would you notice?', answer: 'The subtraction is the wrong way round, and the answer comes out negative.', rationale: 'The triangle sits inside the sector, so it is the smaller region. A negative area is impossible, which makes this error self-announcing.' },
    { id: 's111b.i5', prompt: 'Why do the 60\u00b0 and 120\u00b0 triangles have the same area for a given r?', answer: 'Because both work out to (\u221a3/4)r\u00b2.', rationale: 'The 60\u00b0 triangle is equilateral; the 120\u00b0 one is short and wide. Different shapes, but the same area \u2014 which is why each has to be derived rather than guessed from the picture.' },
  ],
  misconceptionIds: [], interactivePractice: [],
  reasoningApplication: [
    {
      id: 's111b.td1',
      prompt: 'If \u03b8 doubles, the sector area doubles. Does the segment area double? Explain.',
      expectedReasoning:
        'No. The sector is \u03b8/360 of the disc, so it is directly proportional to \u03b8 and doubling \u03b8 doubles it. The segment is that sector MINUS a triangle, and the triangle does not scale with \u03b8 in the same way \u2014 going from 60\u00b0 to 120\u00b0 doubles the sector but leaves the triangle area unchanged at (\u221a3/4)r\u00b2, so the segment grows by more than double. Subtracting a quantity that follows a different rule destroys the proportionality the sector had. This is the clearest sign that the segment is a derived region rather than a scaled one.',
    },
    {
      id: 's111b.td2',
      prompt: 'A sector and a segment can share the same arc. Why are they still different regions, and what exactly distinguishes them?',
      expectedReasoning:
        'They share the arc but not the rest of the boundary. The sector is closed off by the two radii running back to the centre; the segment is closed off by the chord joining the arc\u2019s endpoints directly. The region between those two boundaries is the triangle formed by the centre and the two endpoints, which the sector contains and the segment does not. So the arc they share says nothing about their size, and the difference between them is always exactly that triangle \u2014 which is why the whole calculation is a single subtraction.',
    },
  ],
  summary:
    `The sector is bounded by two radii and the arc; the SEGMENT is bounded by the chord and the same arc. The difference between them is the triangle joining the centre to the chord\u2019s ends, so segment = sector \u2212 triangle. The triangle is derived from the geometry: equilateral at 60\u00b0, right-angled at 90\u00b0, and at 120\u00b0 split by the perpendicular into two 30-60-90 triangles \u2014 giving (\u221a3/4)r\u00b2, \u00bdr\u00b2 and (\u221a3/4)r\u00b2. The major segment follows as the disc less the minor one, so the two always rebuild \u03c0r\u00b2.`,
  nextStep: 'Next you will handle figures where a circle part is combined with other plane shapes.',
  teacher: teacher(
    'Students compute a segment as sector minus triangle and derive the triangle from the geometry of each allowed angle.',
    ['Sector area', 'Special angles from Chapter 8'],
    ['Which region is bounded by the chord?', 'What is left when the triangle goes?', 'Could that answer be negative?'],
    [
      'Draw the triangle inside the sector before any arithmetic. Students who see the subtraction cannot forget it; students who meet it as a formula do.',
      'The 120\u00b0 case needs the perpendicular construction. Resist the general \u00bd ab sin C formula \u2014 this source does not use it here, and the construction is what the Chapter 8 prerequisite is for.',
      'The equal 60\u00b0 and 120\u00b0 triangle areas surprise students and are worth the detour; it shows why each must be derived.',
    ],
    ['Ask what the segment is missing compared with the sector.', 'Ask what a negative answer would mean.'],
    ['Have the student shade the triangle and the segment in two different ways before writing any numbers.'],
    ['Ask what happens to the segment when \u03b8 reaches 180\u00b0.'],
  ),
  reviewStatus: 'authored_draft',
};

export const C10_SECTION_11_1C: AuthoredSection = {
  contentArtifactId: 'ncert_jemh1_s11_1_combined_lesson',
  contentArtifactVersion: 1,
  source: source(),
  competencyCandidates: [], competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_jemh1_s11_1b'],
    mayAssume: ['Sector and segment areas', 'Areas of squares, rectangles and triangles'],
    mustNotIntroduce: [{ concept: 'Surface areas of solids', belongsToSection: 'ncert_jemh1_ch12' }],
  },
  learningGoal:
    'You will find areas and perimeters of figures that combine parts of circles with other plane shapes, by deciding what to add and what to remove.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: ['Find a sector area from r and \u03b8.', 'Find the area of a square and a rectangle.', 'Say which parts of a boundary are straight and which are curved.'],
    ifNotReady: 'Revise the two previous lessons. Combined figures are built from regions you can already measure.',
  },
  vocabulary: [
    { term: 'combined figure', meaning: 'A region built from circle parts together with straight-sided shapes.' },
    { term: 'perimeter', meaning: 'The total length round the boundary, counting only the edges the region actually has.' },
  ],
  explanation: [
    'A combined figure is measured by breaking it into regions you can already handle and deciding, for each, whether it is being added or removed.',
    'The method is always the same. Name the parts, find each area, then combine with the right signs. Nothing new is needed beyond that \u2014 only care about which parts belong.',
    `A square of side ${R14} with a quarter circle of radius ${R14} cut from one corner has area ${n2(R14 * R14)} \u2212 ${A(sectorArea(90), R14)} = ${n2(R14 * R14 - areaValue(sectorArea(90), R14))}. The quarter circle is removed, so it is subtracted.`,
    `The same square with four quarter circles of radius ${R14 / 2} removed at the corners loses four quarters \u2014 one whole circle of that radius \u2014 giving ${n2(R14 * R14)} \u2212 ${n2(areaValue(discArea(), R14 / 2))} = ${n2(R14 * R14 - areaValue(discArea(), R14 / 2))}. Noticing that four quarters make a whole circle saves four separate calculations.`,
    'Perimeter needs separate care, and it is where combined figures catch people out. The perimeter counts only the edges the region actually has, so when a piece is cut away the boundary loses the straight edges that went with it and gains the curved edge that replaced them.',
    `For the square with the corner quarter removed, the boundary is two full sides of ${R14}, nothing along the two cut sides, and the arc of ${n2(arcLength(90, R14))} \u2014 a total of ${n2(2 * R14 + arcLength(90, R14))}, not the square\u2019s perimeter plus the arc.`,
    'So an area subtraction and a perimeter subtraction are different operations. Removing a region always reduces the area, but it can increase the perimeter, and the only reliable method is to trace the boundary and count what is actually there.',
    'All of this stays in the plane. These are regions with area and perimeter, not surfaces of solids.',
  ],
  representations: ['A square with a quarter circle removed, with the remaining boundary traced'],
  visuals: [], visualsById: {},
  workedExamples: [
    {
      id: 's111c.we1',
      prompt: `A square of side ${R14} has a quarter circle of radius ${R14} removed from one corner. Find the area remaining.`,
      steps: [
        { text: `The square has area ${R14} \u00d7 ${R14} = ${n2(R14 * R14)}.`, reasoning: 'The whole region before anything is taken away, which is what the subtraction will act on.' },
        { text: `The quarter circle has central angle 90\u00b0 and radius ${R14}, so its area is ${A(sectorArea(90), R14)}.`, reasoning: 'A quarter of the disc, by the \u03b8/360 share, with the corner of the square serving as the centre.' },
        { text: 'The quarter is removed, so it is subtracted.', reasoning: 'Deciding add or remove for each part is the whole method; the arithmetic follows from it.' },
        { text: `Remaining area = ${n2(R14 * R14)} \u2212 ${A(sectorArea(90), R14)} = ${n2(R14 * R14 - areaValue(sectorArea(90), R14))}.`, reasoning: `Less than the square and positive, which both make sense for a region with a piece cut out.` },
      ],
      answer: `${n2(R14 * R14 - areaValue(sectorArea(90), R14))}.`,
    },
    {
      id: 's111c.we2',
      prompt: 'Find the perimeter of that remaining region.',
      steps: [
        { text: 'Trace the boundary rather than adjusting the square\u2019s perimeter.', reasoning: 'The region has changed shape, so which edges exist has to be read off the figure directly.' },
        { text: `Two sides of the square are untouched: ${R14} + ${R14} = ${n2(2 * R14)}.`, reasoning: 'The cut only reached the two sides meeting at the chosen corner, leaving the opposite two whole.' },
        { text: 'The two cut sides contribute nothing, because the quarter circle reached the full side length.', reasoning: `The radius equals the side ${R14}, so the arc meets each of those sides exactly at its far end.` },
        { text: `The arc contributes (90/360) \u00d7 2\u03c0 \u00d7 ${R14} = ${n2(arcLength(90, R14))}.`, reasoning: 'The curved edge replaces the two straight ones that were removed.' },
        { text: `Perimeter = ${n2(2 * R14)} + ${n2(arcLength(90, R14))} = ${n2(2 * R14 + arcLength(90, R14))}.`, reasoning: `Compared with the square\u2019s own perimeter of ${n2(4 * R14)}, the cut has barely changed the boundary while removing a quarter of the area.` },
      ],
      answer: `${n2(2 * R14 + arcLength(90, R14))}.`,
    },
    {
      id: 's111c.we3',
      prompt: `A square of side ${R14} has a quarter circle of radius ${R14 / 2} removed at each of its four corners. Find the area remaining.`,
      steps: [
        { text: `Each quarter circle has radius ${R14 / 2}, and there are four of them.`, reasoning: 'The four corners each contribute a 90\u00b0 sector of the same radius, so the parts are identical.' },
        { text: `Four quarters of equal radius make one whole circle: area \u03c0 \u00d7 ${R14 / 2}\u00b2 = ${n2(areaValue(discArea(), R14 / 2))}.`, reasoning: 'Four lots of 90\u00b0 is 360\u00b0, so the removed pieces assemble into a complete disc and one calculation replaces four.' },
        { text: `Remaining area = ${n2(R14 * R14)} \u2212 ${n2(areaValue(discArea(), R14 / 2))} = ${n2(R14 * R14 - areaValue(discArea(), R14 / 2))}.`, reasoning: 'The whole square less the whole circle, with every removed piece accounted for exactly once.' },
      ],
      answer: `${n2(R14 * R14 - areaValue(discArea(), R14 / 2))}.`,
    },
  ],
  guidedPractice: [
    { id: 's111c.g1', prompt: `A square of side ${R6} has a quarter circle of radius ${R6} removed from a corner. Find the remaining area.`, hint: 'Square minus quarter circle.', answer: `${n2(R6 * R6 - areaValue(sectorArea(90), R6))}.`, rationale: `${n2(R6 * R6)} \u2212 ${A(sectorArea(90), R6)} = ${n2(R6 * R6 - areaValue(sectorArea(90), R6))}.` },
    { id: 's111c.g2', prompt: 'When a piece is cut from a figure, does the perimeter always decrease?', hint: 'What replaces the removed edges?', answer: 'No \u2014 it can increase.', rationale: 'The straight edges removed are replaced by a curved edge, which may be longer. Area always decreases; perimeter must be traced.' },
    { id: 's111c.g3', prompt: `Four quarter circles of radius ${R6 / 2} are removed from the corners of a square. What single shape do they make?`, hint: 'Add the angles.', answer: 'One whole circle.', rationale: 'Four 90\u00b0 sectors of the same radius total 360\u00b0, so they assemble into a complete disc.' },
  ],
  independentPractice: [
    { id: 's111c.i1', prompt: `A square of side ${R14} has a semicircle of radius ${R14 / 2} drawn inside on one side. Find the combined area of square and semicircle if the semicircle sits outside the square.`, answer: `${n2(R14 * R14 + areaValue(discArea(), R14 / 2) / 2)}.`, rationale: `The semicircle is half a disc of radius ${R14 / 2}, that is ${n2(areaValue(discArea(), R14 / 2) / 2)}. It is added, not removed, because it lies outside the square.` },
    { id: 's111c.i2', prompt: 'Why must the perimeter of a combined figure be traced rather than adjusted?', answer: 'Because removing a region changes which edges exist, not just their total.', rationale: 'Straight edges disappear and a curved one appears, so the new boundary has to be read off the figure.' },
    { id: 's111c.i3', prompt: `In the square with one corner quarter removed, is the perimeter larger or smaller than the square\u2019s ${n2(4 * R14)}?`, answer: `Smaller \u2014 it is ${n2(2 * R14 + arcLength(90, R14))}.`, rationale: `The arc ${n2(arcLength(90, R14))} is shorter than the two straight sides ${n2(2 * R14)} it replaced, so the boundary shortens even though it curves.` },
    { id: 's111c.i4', prompt: 'How do you decide whether a part is added or subtracted?', answer: 'By whether it belongs to the region being measured.', rationale: 'A piece inside the region is added; a piece cut away is subtracted. Naming each part before computing anything keeps the signs right.' },
  ],
  misconceptionIds: [], interactivePractice: [],
  reasoningApplication: [
    {
      id: 's111c.td1',
      prompt: 'Removing a piece from a figure always reduces its area. Why does the same not hold for perimeter?',
      expectedReasoning:
        'Because area and boundary behave differently under a cut. Area is additive over regions, so taking a region away necessarily leaves less. The perimeter is not a sum over regions at all \u2014 it is the length of the boundary, and a cut deletes part of the old boundary while creating a new edge where the cut ran. Whether the total grows or shrinks depends on how the new edge compares with the old ones, which varies. So the area change can be computed by subtraction, while the perimeter has to be traced.',
    },
    {
      id: 's111c.td2',
      prompt: 'Four quarter circles of equal radius are removed from a square\u2019s corners. Why can they be treated as one circle, and when would that shortcut fail?',
      expectedReasoning:
        'Because the four central angles total 360\u00b0 and the radii are all equal, so the four sectors are exactly the pieces of one disc of that radius \u2014 the areas add to \u03c0r\u00b2 regardless of where they sit. The shortcut depends on both conditions. If the corner radii differed, the sectors would come from different circles and could not be combined; and if the angles did not total 360\u00b0 they would not make a whole disc. It also applies only to AREA: the four arcs do form a full circumference, but the straight edges removed at each corner still have to be handled by tracing.',
    },
  ],
  summary:
    `Break a combined figure into regions you can measure, then decide for each whether it is added or removed. A square of side ${R14} less a quarter circle of the same radius leaves ${n2(R14 * R14 - areaValue(sectorArea(90), R14))}, and four corner quarters of radius ${R14 / 2} remove one whole circle. Perimeter is different: trace the boundary, because a cut deletes straight edges and adds a curved one \u2014 the cut square\u2019s boundary is ${n2(2 * R14 + arcLength(90, R14))}, not the square\u2019s ${n2(4 * R14)} plus the arc.`,
  nextStep: 'The chapter summary recapitulates the arc, sector and segment formulas.',
  teacher: teacher(
    'Students measure combined plane figures by naming parts and deciding add or remove, and trace perimeters.',
    ['Sector and segment areas', 'Areas of straight-sided shapes'],
    ['Is that part in, or out?', 'Trace the boundary \u2014 what is actually there?', 'Four quarters of what?'],
    [
      'The perimeter is the real content here. Students compute these areas easily and then add the arc to the full square perimeter without thinking.',
      'The four-corner figure rewards noticing before calculating, which is worth making explicit as a habit.',
      'Keep this planar. The subtraction resembles Chapter 12\u2019s surface work, but these are regions, not solids.',
    ],
    ['Ask whether a cut can lengthen a boundary.', 'Ask what four corner quarters assemble into.'],
    ['Have the student trace the boundary with a finger and list each edge before adding anything.'],
    ['Ask what radius would make the four corner circles meet.'],
  ),
  reviewStatus: 'authored_draft',
};

export const CLASS10_CIRCLE_AREA_SECTIONS: AuthoredSection[] = [
  C10_SECTION_11_1A, C10_SECTION_11_1B, C10_SECTION_11_1C,
];
