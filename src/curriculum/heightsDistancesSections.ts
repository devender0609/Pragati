// ===========================================================================
// v0.84.0-c10.7 checkpoint 61 — CLASS 10 HEIGHTS AND DISTANCES.
//
// The trigonometry here is Chapter 8's, unchanged: every ratio is read from
// STANDARD_ANGLE_RATIOS rather than retyped. What is new is the modelling,
// and that is where this chapter goes wrong — a correct tan 60 applied to
// the wrong vertical gives a tidy number and a false answer.
//
// So every lesson works from an `Observation`, and every figure and quoted
// number is derived from it. Whether the eye height enters the answer is a
// property of what the problem asks, not a habit.
//
// Source: NCERT Mathematics, Textbook for Class X (Reprint 2026-27), §9.1
// (folio 133). CBSE 041/241 2026-27 limits this to at most two right
// triangles, with angles of elevation and depression only 30, 45 and 60.
// ===========================================================================

import type { AuthoredSection } from './authoredSection';
import type { GeometryFigureSpec } from './visualSpecification';
import {
  exactRise, round2, tanOf, totalHeight, triangleOf, verticalRise,
  type Observation,
} from './observationModel';

export const HEIGHTS_CHAPTER_ID = 'ncert_jemh1_ch09';

const BOOK = 'Mathematics, Textbook for Class X (Reprint 2026-27)';
const SRC = 'https://ncert.nic.in/textbook/pdf/jemh1dd.zip';
const INSPECTED = '2026-10-16';

const source = () => ({
  officialChapterId: HEIGHTS_CHAPTER_ID,
  officialSectionId: 'ncert_jemh1_s9_1',
  sectionNumber: '9.1',
  exactTitle: 'Heights and Distances',
  startPage: 133,
  textbook: BOOK,
  sourceReference: SRC,
  inspectionDate: INSPECTED,
});

// --- the canonical observations -------------------------------------------

/** Ground-level elevation: the eye height is zero and does NOT enter. */
export const O_GROUND: Observation = {
  id: 'pole_from_ground', observer: 'a student standing at ground level',
  target: 'the top of a flagpole', eyeHeightM: 0, horizontalDistanceM: 30,
  angleDegrees: 30, direction: 'elevation', targetQuantity: 'total_height', unit: 'm',
};

/** Elevation from eye level: the eye height DOES enter. */
export const O_EYE: Observation = {
  id: 'tower_from_eye', observer: 'a surveyor whose eye is 1.5 m above the ground',
  target: 'the top of a water tower', eyeHeightM: 1.5, horizontalDistanceM: 24,
  angleDegrees: 45, direction: 'elevation', targetQuantity: 'total_height', unit: 'm',
};

/** The same observation, asking only for the rise: eye height does not enter. */
export const O_RISE_ONLY: Observation = {
  ...O_EYE, id: 'tower_rise_only', targetQuantity: 'rise_above_eye',
};

/** Depression from a height: the observer is above the target. */
export const O_DEPRESSION: Observation = {
  id: 'boat_from_lighthouse', observer: 'a keeper at the top of a 60 m lighthouse',
  target: 'a boat on the water', eyeHeightM: 60, horizontalDistanceM: 60,
  angleDegrees: 45, direction: 'depression', targetQuantity: 'horizontal_distance', unit: 'm',
};

/** Two triangles sharing the vertical — the limit of the prescribed scope. */
export const O_NEAR: Observation = {
  id: 'chimney_near', observer: 'an observer at ground level',
  target: 'the top of a chimney', eyeHeightM: 0, horizontalDistanceM: 20,
  angleDegrees: 60, direction: 'elevation', targetQuantity: 'total_height', unit: 'm',
};

export const CANONICAL_OBSERVATIONS = [O_GROUND, O_EYE, O_RISE_ONLY, O_DEPRESSION, O_NEAR];

const n = (v: number) => String(round2(v));

/**
 * The right triangle an observation denotes, as a geometry figure, so the
 * checkpoint-55 validators check the angle and the side roles. Coordinates
 * come from `triangleOf`, never from an author.
 */
function figureFor(o: Observation, caption: string, altText: string): GeometryFigureSpec {
  const t = triangleOf(o);
  const pts = [
    { id: 'eye', x: t.eye.x, y: t.eye.y, label: o.eyeHeightM > 0 ? 'E (eye)' : 'O' },
    { id: 'foot', x: t.horizontalFoot.x, y: t.horizontalFoot.y, label: 'H' },
    { id: 'sight', x: t.sightEnd.x, y: t.sightEnd.y, label: 'T' },
  ];
  return {
    type: 'geometry_figure',
    purpose: 'show_definition',
    status: 'concept_specific',
    exactGeometry: true,
    points: pts,
    segments: [
      { from: 'eye', to: 'foot', label: `${o.horizontalDistanceM} m`, mark: 'arrow' },
      { from: 'foot', to: 'sight', label: `${n(verticalRise(o))} m` },
      { from: 'eye', to: 'sight', label: 'line of sight' },
    ],
    angleMarks: [
      { at: 'eye', from: 'foot', to: 'sight', label: `${o.angleDegrees}\u00b0` },
      { at: 'foot', from: 'eye', to: 'sight', right: true },
    ],
    rightTriangleRoles: [{ referenceVertex: 'eye', rightAngleVertex: 'foot', thirdVertex: 'sight', referenceLabel: 'the observer' }],
    caption,
    altText,
  };
}

export const F_GROUND = figureFor(O_GROUND,
  'An elevation measured at ground level.',
  `A right triangle. The observer stands at O on the ground, and the horizontal segment from O to H measures ${O_GROUND.horizontalDistanceM} metres along the ground to the foot of the flagpole. The vertical segment from H up to T is the pole, and the line of sight runs from O to T. The angle of elevation of ${O_GROUND.angleDegrees} degrees is marked at O, between the horizontal and the line of sight. Because the observation is made at ground level, the vertical side of the triangle is the whole height of the pole, ${n(verticalRise(O_GROUND))} metres.`);

export const F_EYE = figureFor(O_EYE,
  'An elevation measured from eye level, above the ground.',
  `A right triangle sitting above the ground. The observer's eye is at E, ${O_EYE.eyeHeightM} metres above the ground, and the horizontal segment from E to H measures ${O_EYE.horizontalDistanceM} metres, level with the eye. The vertical segment from H up to T is the part of the tower ABOVE eye level, ${n(verticalRise(O_EYE))} metres, and the line of sight runs from E to T. The angle of elevation of ${O_EYE.angleDegrees} degrees is marked at E, between the horizontal and the line of sight. The triangle does not contain the ${O_EYE.eyeHeightM} metres below the eye, so the tower's full height is ${n(totalHeight(O_EYE))} metres.`);

export const F_DEPRESSION = figureFor(O_DEPRESSION,
  'A depression measured from the top of a lighthouse.',
  `A right triangle. The keeper's eye is at E, at the top of the lighthouse ${O_DEPRESSION.eyeHeightM} metres above the water, and a horizontal segment runs from E out to H, level with the eye. The line of sight runs downward from E to the boat at T. The angle of depression of ${O_DEPRESSION.angleDegrees} degrees is marked at E, between that horizontal and the line of sight, not at the boat. The vertical drop from the horizontal to the boat is ${n(verticalRise(O_DEPRESSION))} metres and the horizontal distance to the boat is ${O_DEPRESSION.horizontalDistanceM} metres.`);

export const CANONICAL_FIGURES = [F_GROUND, F_EYE, F_DEPRESSION];

const teacher = (objective: string, prereq: string[], lang: string[], notes: string[], checks: string[], support: string[], ext: string[]) => ({
  objective, prerequisiteKnowledge: prereq, modelLanguage: lang, teachingNotes: notes,
  quickChecks: checks, supportForStrugglingLearners: support, extension: ext, materialsNeeded: [],
});

export const C10_SECTION_9_1A: AuthoredSection = {
  contentArtifactId: 'ncert_jemh1_s9_1_setup_lesson',
  contentArtifactVersion: 1,
  source: source(),
  competencyCandidates: [], competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_jemh1_s8_3'],
    mayAssume: ['The six trigonometric ratios relative to a chosen angle', 'The exact ratios for 30, 45 and 60 degrees'],
    mustNotIntroduce: [{ concept: 'Solving for an unknown height', belongsToSection: 'ncert_jemh1_s9_1b' }],
  },
  learningGoal:
    'You will turn a described observation into the correct right triangle, naming the horizontal reference, the line of sight, and the angle of elevation or depression before any calculation.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: [
      'Name the side opposite a chosen angle in a right triangle.',
      'State tan 30, tan 45 and tan 60 exactly.',
      'Say which side of a right triangle is the hypotenuse.',
    ],
    ifNotReady: 'Revise Chapter 8. This chapter changes nothing about the ratios; it changes what you apply them to.',
  },
  vocabulary: [
    { term: 'line of sight', meaning: 'The straight line from the observer\u2019s eye to the point being observed. It is the hypotenuse of the triangle, never the ground distance.' },
    { term: 'horizontal', meaning: 'The level line drawn through the observer\u2019s eye. Both angles in this chapter are measured from it.' },
    { term: 'angle of elevation', meaning: 'The angle at the observer, from the horizontal UPWARD to the line of sight.' },
    { term: 'angle of depression', meaning: 'The angle at the observer, from the horizontal DOWNWARD to the line of sight.' },
    { term: 'observer', meaning: 'The person or instrument making the observation. Both angles are measured at the observer, not at the object.' },
  ],
  explanation: [
    'The trigonometry in this chapter is the trigonometry you already have. What is new is getting from a described situation to the right triangle, and that is where the work is \u2014 a correct tan 60 applied to the wrong vertical gives a tidy number and a false answer.',
    'Start with the observer. Draw a horizontal line through the observer\u2019s eye. Every angle in this chapter is measured from that line, and the line passes through the EYE, not through the object and not along the ground unless the eye happens to be on the ground.',
    'The line of sight runs from the eye to the point being observed. If it goes up from the horizontal, the angle between them is the angle of elevation; if it goes down, the angle of depression. Both sit at the observer.',
    'That last point is worth dwelling on. A diagram often shows the angle of depression marked down at the boat or the car, because there is more room there. It does not belong there: the observer is the one looking, and the angle describes how far the gaze has dropped from level.',
    'Now the triangle. Its right angle is where the vertical meets the horizontal, the line of sight is the hypotenuse, and the two legs are the horizontal distance and the vertical difference. Confusing the hypotenuse with the horizontal distance is the second common error, and it makes every ratio wrong.',
    `The vertical leg deserves care. When the observer stands at ground level, as in the flagpole figure, the vertical leg IS the pole's full height, ${n(verticalRise(O_GROUND))} metres. When the eye is ${O_EYE.eyeHeightM} metres above the ground, as in the tower figure, the vertical leg is only the part of the tower above eye level, ${n(verticalRise(O_EYE))} metres, and the tower is taller than that.`,
    'So the sequence is: find the observer, draw the horizontal through the eye, draw the line of sight, mark the angle between them, identify which vertical the triangle actually contains, and only then look for a ratio. Deciding comes before calculating.',
  ],
  representations: ['Right triangles with the observer, the horizontal reference and the line of sight marked'],
  visuals: [F_GROUND, F_EYE, F_DEPRESSION],
  visualsById: { F_GROUND, F_EYE, F_DEPRESSION },
  workedExamples: [
    {
      id: 's91a.we1',
      prompt: `A student at ground level stands ${O_GROUND.horizontalDistanceM} m from a flagpole and looks up at its top. Identify every part of the triangle.`,
      steps: [
        { text: 'The observer is the student, and the horizontal through the eye runs along the ground.', reasoning: 'The eye is at ground level here, so the horizontal reference and the ground line happen to coincide \u2014 which is a special case, not the general rule.' },
        { text: 'The line of sight runs from the student to the top of the pole; it is the hypotenuse.', reasoning: 'It is the longest side, joining the two ends of the observation, and it is never the quantity a ground measurement gives you.' },
        { text: `The horizontal leg is the ${O_GROUND.horizontalDistanceM} m along the ground, and the vertical leg is the pole.`, reasoning: 'The right angle is at the foot of the pole, where the vertical meets the horizontal.' },
        { text: `The angle of elevation of ${O_GROUND.angleDegrees}\u00b0 is marked at the student, between the horizontal and the line of sight.`, reasoning: 'Marking it at the top of the pole would describe a different angle, since the two lines meeting there are not the horizontal and the line of sight.' },
        { text: 'Because the eye is on the ground, the vertical leg is the pole\u2019s whole height.', reasoning: 'Nothing of the pole lies below the horizontal reference, so no part of it is left outside the triangle.' },
      ],
      answer: 'Hypotenuse: the line of sight. Legs: the ground distance and the pole. Angle of elevation at the student.',
      visualRef: 'F_GROUND',
    },
    {
      id: 's91a.we2',
      prompt: `A surveyor whose eye is ${O_EYE.eyeHeightM} m above the ground stands ${O_EYE.horizontalDistanceM} m from a water tower. What does the triangle's vertical leg represent?`,
      steps: [
        { text: `The horizontal through the eye is ${O_EYE.eyeHeightM} m above the ground, not on it.`, reasoning: 'The reference line follows the observer upward, so the whole triangle sits above the ground by that amount.' },
        { text: 'The vertical leg runs from that horizontal up to the top of the tower.', reasoning: 'It starts where the horizontal crosses the tower, which is above the tower\u2019s base.' },
        { text: `So the vertical leg is the tower's height ABOVE eye level, not its full height.`, reasoning: `The lowest ${O_EYE.eyeHeightM} m of the tower lies below the horizontal and is simply not part of this triangle.` },
        { text: `The tower's full height would be that leg plus the ${O_EYE.eyeHeightM} m of eye height.`, reasoning: 'Both are measured from the same ground, so they stack \u2014 but this addition is a consequence of the geometry, not a rule to apply everywhere.' },
      ],
      answer: 'The vertical leg is the height above eye level; the full height needs the eye height added.',
      visualRef: 'F_EYE',
    },
    {
      id: 's91a.we3',
      prompt: `A lighthouse keeper ${O_DEPRESSION.eyeHeightM} m above the water sights a boat. Where does the angle of depression belong, and why not at the boat?`,
      steps: [
        { text: 'Draw the horizontal through the keeper\u2019s eye, out over the water.', reasoning: 'The reference is level with the observer, which is why it hangs in the air rather than running along the water.' },
        { text: `The line of sight drops from the eye to the boat, and the ${O_DEPRESSION.angleDegrees}\u00b0 angle between them is at the keeper.`, reasoning: 'The angle describes how far the keeper\u2019s gaze has fallen below level, which is a fact about the keeper\u2019s looking.' },
        { text: 'At the boat, the two lines meeting are the line of sight and the water, which is a different pair.', reasoning: 'That angle happens to be equal, for a reason taken up in a later lesson, but equal is not the same as being the angle of depression.' },
        { text: 'Marking it at the boat would also lose the horizontal reference entirely.', reasoning: 'Without the observer\u2019s horizontal in the figure there is nothing for the angle to be measured from, and the definition stops meaning anything.' },
      ],
      answer: 'At the keeper, between the keeper\u2019s horizontal and the line of sight.',
      visualRef: 'F_DEPRESSION',
    },
  ],
  guidedPractice: [
    { id: 's91a.g1', prompt: 'In a heights-and-distances triangle, which side is the line of sight?', hint: 'Which side joins the eye to the object?', answer: 'The hypotenuse.', rationale: 'It runs from the observer\u2019s eye to the point observed, opposite the right angle. The ground distance is a leg, and the two are different lengths.' },
    { id: 's91a.g2', prompt: 'An observer\u2019s eye is 1.4 m above the ground and the triangle\u2019s vertical leg is 12 m. How tall is the object?', hint: 'What does the leg measure from?', answer: '13.4 m.', rationale: 'The leg measures from eye level upward, so the 1.4 m below the eye must be added. Both are measured from the same ground.' },
    { id: 's91a.g3', prompt: 'A problem asks how far a tower rises above the observer\u2019s eye. Does the eye height enter the answer?', hint: 'Read what is being asked.', answer: 'No.', rationale: 'That quantity is exactly the triangle\u2019s vertical leg. Adding the eye height would answer a different question \u2014 the full height.' },
  ],
  independentPractice: [
    { id: 's91a.i1', prompt: 'Where is the angle of elevation measured, and from which line?', answer: 'At the observer, from the horizontal through the eye.', rationale: 'Measuring from the vertical, or from a horizontal through the object, would give a different angle entirely.' },
    { id: 's91a.i2', prompt: 'A student says the horizontal distance to a tree is 25 m and the line of sight is also 25 m. What is wrong?', answer: 'The hypotenuse must be longer than either leg.', rationale: 'They can only be equal if the vertical leg is zero, which would mean the observer is looking level and there is no angle at all.' },
    { id: 's91a.i3', prompt: 'An observation is made from a window 5 m up, looking down at a car. Which angle is involved and where is it marked?', answer: 'An angle of depression, marked at the window.', rationale: 'The line of sight falls below the observer\u2019s horizontal, and the angle is measured at the observer as always.' },
    { id: 's91a.i4', prompt: 'Why is drawing a horizontal line through the observer the first step?', answer: 'Because both angles in this chapter are defined relative to it.', rationale: 'Without it there is no reference, and an angle measured from the ground or from the vertical would be a different number.' },
  ],
  misconceptionIds: [], interactivePractice: [],
  reasoningApplication: [
    {
      id: 's91a.td1',
      prompt: 'A student adds the observer\u2019s eye height in every problem. Explain why that is wrong, and give the rule that actually applies.',
      expectedReasoning:
        'The eye height enters only when the triangle\u2019s vertical leg stops short of the ground and the question asks for the full height from the ground. If the observer stands at ground level there is nothing below the horizontal to add. If the question asks how far the object rises above eye level, the leg already IS the answer and adding would overstate it. The rule is to model the vertical quantities first: decide what the leg measures and what the question wants, and only then see whether they differ.',
    },
    {
      id: 's91a.td2',
      prompt: 'Which measurement is the hypotenuse \u2014 the distance along the ground, or the line of sight? What goes wrong if they are swapped?',
      expectedReasoning:
        'The line of sight is the hypotenuse, because it is opposite the right angle at the foot of the vertical. The ground distance is a leg. Swapping them puts the longest side where a leg belongs, so a ratio such as tangent, which compares the two legs, would be computed with a side that is not a leg. The resulting height would be too small, and nothing in the arithmetic would reveal it.',
    },
  ],
  summary:
    `Draw the horizontal through the observer\u2019s eye first; both angles are measured from it, and both are measured AT the observer. The line of sight is the hypotenuse, never the ground distance. The triangle\u2019s vertical leg is the full object height only when the eye is at ground level \u2014 from ${O_EYE.eyeHeightM} m up it is the height above eye level, and the ${O_EYE.eyeHeightM} m must be added separately if the question wants the whole thing.`,
  nextStep: 'Next you will put a ratio to that triangle and solve for the unknown.',
  teacher: teacher(
    'Students construct the correct right triangle from a described observation, before any calculation.',
    ['Trigonometric ratios relative to a chosen angle', 'Exact values for 30, 45 and 60 degrees'],
    ['Where is the observer? Draw the horizontal there.', 'Does the triangle contain the whole object, or only part of it?', 'The line of sight is the hypotenuse.'],
    [
      'Keep every calculation out of this lesson. Students who are allowed to compute will compute, and the modelling decision is the thing being taught.',
      'The ground-level and eye-level figures should be met together. On either one alone students form a rule, and the rule is wrong half the time.',
      'The depression angle drawn at the boat is worth showing and rejecting; it is common in printed diagrams because there is more room there.',
    ],
    ['Ask where the angle of depression is measured.', 'Ask when the eye height does NOT enter.'],
    ['Have the student draw and label the horizontal before anything else is added to the figure.'],
    ['Ask what the triangle looks like if the observer lies on the ground.'],
  ),
  reviewStatus: 'authored_draft',
};

export const C10_SECTION_9_1B: AuthoredSection = {
  contentArtifactId: 'ncert_jemh1_s9_1_one_triangle_lesson',
  contentArtifactVersion: 1,
  source: source(),
  competencyCandidates: [], competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_jemh1_s9_1'],
    mayAssume: ['Setting up the observation triangle', 'Exact ratios for 30, 45 and 60 degrees'],
    mustNotIntroduce: [{ concept: 'Problems using two right triangles', belongsToSection: 'ncert_jemh1_s9_1c' }],
  },
  learningGoal:
    'You will solve a one-triangle heights-and-distances problem by choosing the ratio from the sides you know and want, and adjusting for eye height only when the geometry requires it.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: ['Draw the observation triangle and mark the angle at the observer.', 'State tan 30, tan 45 and tan 60 exactly.', 'Say which leg is opposite a chosen angle.'],
    ifNotReady: 'Go back to the previous lesson. Choosing a ratio before the triangle is drawn is how this chapter goes wrong.',
  },
  vocabulary: [
    { term: 'exact value', meaning: 'An answer left in surd form, such as 10\u221a3 m, rather than rounded.' },
    { term: 'approximate value', meaning: 'A rounded decimal, written with \u2248 rather than = so the rounding is visible.' },
    { term: 'vertical rise', meaning: 'The triangle\u2019s vertical leg \u2014 the height gained from the observer\u2019s horizontal, which may be less than the object\u2019s height.' },
  ],
  explanation: [
    'With the triangle drawn, the ratio is chosen by what you know and what you want \u2014 not by habit. List the three sides, mark which are known, mark which is wanted, and take the ratio connecting them.',
    'Tangent appears often because the two legs are the horizontal distance and the vertical rise, and those are usually what a problem gives and asks for. That is a consequence of the situations, not a rule: if a problem gives the line of sight, the hypotenuse is involved and sine or cosine is what connects it to a leg.',
    `Take the flagpole. The observer is at ground level ${O_GROUND.horizontalDistanceM} m away, the angle of elevation is ${O_GROUND.angleDegrees}\u00b0, and the height is wanted. The height is opposite the angle and the ${O_GROUND.horizontalDistanceM} m is adjacent, so tangent connects them: tan ${O_GROUND.angleDegrees}\u00b0 = height / ${O_GROUND.horizontalDistanceM}.`,
    `Using the exact value tan ${O_GROUND.angleDegrees}\u00b0 = ${tanOf(O_GROUND.angleDegrees).exact} gives a height of ${exactRise(O_GROUND)} m exactly, which is about ${n(verticalRise(O_GROUND))} m. The exact form and the rounded one are different kinds of answer, and the sign between them differs too: write = for the exact value and \u2248 for the approximation.`,
    `Now the tower, where the eye is ${O_EYE.eyeHeightM} m up. The same reasoning gives a vertical rise of ${n(verticalRise(O_EYE))} m \u2014 but that is the height above EYE level. The tower stands on the same ground the eye is measured from, so its full height is ${n(verticalRise(O_EYE))} + ${O_EYE.eyeHeightM} = ${n(totalHeight(O_EYE))} m.`,
    `Whether that last step happens depends on the question. Asked how far the tower rises above the surveyor's eye, the answer is ${n(verticalRise(O_EYE))} m and nothing is added. Asked for the tower's height, it is ${n(totalHeight(O_EYE))} m. The same triangle, two different questions, two different answers.`,
    'Finally the units. Every length in a problem must be in the same unit before any ratio is formed, and the answer carries that unit. A height written as a bare number is not an answer.',
  ],
  representations: ['The observation triangle with the known and unknown sides marked'],
  visuals: [F_GROUND, F_EYE],
  visualsById: { F_GROUND, F_EYE },
  workedExamples: [
    {
      id: 's91b.we1',
      prompt: `A student at ground level is ${O_GROUND.horizontalDistanceM} m from a flagpole and the angle of elevation of its top is ${O_GROUND.angleDegrees}\u00b0. Find the pole's height.`,
      steps: [
        { text: 'The target is the pole\u2019s height, which is the triangle\u2019s vertical leg.', reasoning: 'The eye is at ground level, so nothing of the pole lies below the horizontal and the leg is the whole height.' },
        { text: `Relative to the ${O_GROUND.angleDegrees}\u00b0 angle at the student, the height is opposite and the ${O_GROUND.horizontalDistanceM} m is adjacent.`, reasoning: 'Naming the roles relative to the chosen angle is what selects the ratio; the roles change if a different angle is chosen.' },
        { text: `Opposite over adjacent is tangent, so tan ${O_GROUND.angleDegrees}\u00b0 = h / ${O_GROUND.horizontalDistanceM}.`, reasoning: 'The ratio follows from the sides involved, not from the chapter \u2014 a problem giving the line of sight would need sine or cosine instead.' },
        { text: `tan ${O_GROUND.angleDegrees}\u00b0 = ${tanOf(O_GROUND.angleDegrees).exact}, so h = ${O_GROUND.horizontalDistanceM} \u00d7 ${tanOf(O_GROUND.angleDegrees).exact} = ${exactRise(O_GROUND)} m.`, reasoning: `The value comes from the standard-angle table; ${O_GROUND.horizontalDistanceM}/\u221a3 rationalises to ${exactRise(O_GROUND)}, which keeps the surd out of the denominator.` },
        { text: `So the pole is ${exactRise(O_GROUND)} m, which is about ${n(verticalRise(O_GROUND))} m.`, reasoning: 'The exact form is the answer and the decimal is a reading of it, which is why the second is written with \u2248 and carries the unit.' },
      ],
      answer: `${exactRise(O_GROUND)} m, approximately ${n(verticalRise(O_GROUND))} m.`,
      visualRef: 'F_GROUND',
    },
    {
      id: 's91b.we2',
      prompt: `A surveyor whose eye is ${O_EYE.eyeHeightM} m above the ground stands ${O_EYE.horizontalDistanceM} m from a water tower, and the angle of elevation of its top is ${O_EYE.angleDegrees}\u00b0. Find the tower's height.`,
      steps: [
        { text: `The triangle sits ${O_EYE.eyeHeightM} m above the ground, so its vertical leg is not the whole tower.`, reasoning: 'Deciding this before calculating is what separates this problem from the previous one, which otherwise looks identical.' },
        { text: `tan ${O_EYE.angleDegrees}\u00b0 = rise / ${O_EYE.horizontalDistanceM}, and tan ${O_EYE.angleDegrees}\u00b0 = ${tanOf(O_EYE.angleDegrees).exact}.`, reasoning: 'The rise is opposite the angle at the eye and the horizontal distance is adjacent, so tangent connects them.' },
        { text: `So the rise is ${n(verticalRise(O_EYE))} m \u2014 the part of the tower above eye level.`, reasoning: 'This number is correct and is not yet the answer, which is exactly the trap this chapter sets.' },
        { text: `The question asks for the tower's height, and the tower stands on the ground the eye height is measured from, so add: ${n(verticalRise(O_EYE))} + ${O_EYE.eyeHeightM} = ${n(totalHeight(O_EYE))} m.`, reasoning: 'The two pieces stack because they share a ground reference; if they were measured from different levels they could not simply be added.' },
      ],
      answer: `${n(totalHeight(O_EYE))} m.`,
      visualRef: 'F_EYE',
    },
    {
      id: 's91b.we3',
      prompt: `For the same surveyor and tower, how far does the tower rise above the surveyor's eye? Compare with the previous answer.`,
      steps: [
        { text: 'This question asks for the triangle\u2019s vertical leg itself.', reasoning: 'Reading what is wanted before calculating is the whole difference between this problem and the last one.' },
        { text: `That is the ${n(verticalRise(O_EYE))} m already found.`, reasoning: 'No new trigonometry is needed; the same triangle answers both questions.' },
        { text: `Adding the ${O_EYE.eyeHeightM} m here would be wrong, giving ${n(totalHeight(O_EYE))} m \u2014 the answer to a different question.`, reasoning: 'The eye height belongs to the distance from the ground to the eye, which this question does not ask about at all.' },
        { text: `The two answers differ by exactly ${O_EYE.eyeHeightM} m.`, reasoning: 'A discrepancy of exactly the eye height between two students is the signature of this modelling choice rather than an arithmetic slip.' },
      ],
      answer: `${n(verticalRise(O_EYE))} m \u2014 the eye height does not enter this one.`,
      visualRef: 'F_EYE',
    },
  ],
  guidedPractice: [
    { id: 's91b.g1', prompt: `An observer at ground level is 20 m from a chimney and the angle of elevation is 60\u00b0. Find its height exactly.`, hint: 'Which sides are opposite and adjacent?', answer: `${exactRise(O_NEAR)} m, about ${n(verticalRise(O_NEAR))} m.`, rationale: `tan 60\u00b0 = ${tanOf(60).exact}, so the height is 20\u221a3 m. The eye is on the ground, so nothing is added.` },
    { id: 's91b.g2', prompt: 'Two students compute a tower\u2019s height and their answers differ by exactly 1.5 m. What probably differs?', hint: 'What is 1.5 m in this situation?', answer: 'One added the observer\u2019s eye height and the other did not.', rationale: 'A difference equal to the eye height points at the modelling decision rather than at arithmetic, since no ratio error would produce exactly that gap.' },
    { id: 's91b.g3', prompt: 'A problem gives the line of sight as 50 m and the angle of elevation as 30\u00b0, and asks for the height. Which ratio?', hint: 'Which sides are involved now?', answer: 'Sine.', rationale: 'The height is opposite the angle and the line of sight is the hypotenuse, and opposite over hypotenuse is sine. Tangent would need the horizontal distance, which was not given.' },
  ],
  independentPractice: [
    { id: 's91b.i1', prompt: 'An observer at ground level is 45 m from a tower; the angle of elevation is 30\u00b0. Find the height exactly.', answer: '15\u221a3 m, about 25.98 m.', rationale: 'tan 30\u00b0 = 1/\u221a3, so the height is 45/\u221a3 = 15\u221a3 m. Nothing is added, since the eye is on the ground.' },
    { id: 's91b.i2', prompt: 'An observer whose eye is 1.6 m up measures a vertical rise of 28 m to a tower\u2019s top. How tall is the tower?', answer: '29.6 m.', rationale: 'The 28 m is the rise above eye level, so the 1.6 m below the eye must be added. Reporting 28 m would answer a different question.' },
    { id: 's91b.i3', prompt: 'Why should 24 m and 1.5 m not be added if one is measured from the ground and the other from a rooftop?', answer: 'Because they are measured from different references.', rationale: 'Lengths stack only when they share a starting level. Adding across different references produces a number that measures nothing.' },
    { id: 's91b.i4', prompt: 'Write 20\u221a3 m as an approximation and say which sign each form takes.', answer: '20\u221a3 m \u2248 34.64 m; the exact form takes = and the decimal takes \u2248.', rationale: 'Writing = before a rounded decimal claims an equality that is not true, since 20\u221a3 is irrational.' },
  ],
  misconceptionIds: [], interactivePractice: [],
  reasoningApplication: [
    {
      id: 's91b.td1',
      prompt: 'Is it true that heights-and-distances problems always use tangent? Answer by saying what decides the ratio.',
      expectedReasoning:
        'No. The ratio is decided by which sides are known and which is wanted. Tangent appears often because problems usually give a horizontal distance and ask for a vertical height, and those are the two legs. But a problem giving the line of sight involves the hypotenuse, so sine connects it to the opposite side and cosine to the adjacent one. Reaching for tangent by habit would mean having no side to put in the denominator, or using the hypotenuse as though it were a leg.',
    },
    {
      id: 's91b.td2',
      prompt: 'If the observer walks further from the object without changing anything else, what happens to the angle of elevation, and why?',
      expectedReasoning:
        'It decreases. The vertical rise from the observer\u2019s eye to the top is unchanged, while the horizontal distance grows, so the tangent of the angle \u2014 rise over distance \u2014 gets smaller, and a smaller tangent means a smaller acute angle. Geometrically the line of sight flattens towards the horizontal as the observer retreats. The object has not changed; only the angle it subtends from where the observer now stands.',
    },
  ],
  summary:
    `Choose the ratio from the sides you know and the side you want, never by habit \u2014 tangent is common because the legs are usually involved, but a given line of sight calls for sine or cosine. Use the exact standard-angle values, write = for the exact answer and \u2248 for the rounded one, and keep the unit. Add the eye height only when the triangle starts above the ground AND the question asks for the full height: the same tower is ${n(verticalRise(O_EYE))} m above eye level and ${n(totalHeight(O_EYE))} m tall.`,
  nextStep: 'Next you will handle a situation that needs two triangles.',
  teacher: teacher(
    'Students solve a one-triangle problem, selecting the ratio from the model and adjusting for eye height only when required.',
    ['The observation triangle', 'Exact standard-angle values'],
    ['Which sides do you know, and which do you want?', 'Is that the leg, or the whole object?', 'Exact gets =, rounded gets \u2248.'],
    [
      'The second and third worked examples use ONE triangle and give two different answers. That pairing is the lesson; either alone teaches a rule that is wrong half the time.',
      'A difference of exactly the eye height between two students is diagnostic, and saying so gives them a self-check.',
      'The sine case in guided practice exists so tangent does not become automatic.',
    ],
    ['Ask what decides the ratio.', 'Ask when the eye height is NOT added.'],
    ['Have the student write the target quantity in words before choosing any ratio.'],
    ['Ask what happens to the angle as the observer walks away.'],
  ),
  reviewStatus: 'authored_draft',
};

/**
 * A two-triangle situation: one chimney seen from two points on the same
 * line, sharing the vertical. This is the limit of the prescribed scope.
 */
export const TWO_TRIANGLE = {
  id: 'chimney_two_points',
  near: O_NEAR,
  /** The far observation, same chimney, same ground. */
  farAngle: 30 as const,
  /** Derived: distance from the chimney at which the angle is 30 degrees. */
  get farDistance(): number {
    // Exactly three times the near distance, since tan 60 / tan 30 = 3.
    // Computing it as h / tan 30 loses that in binary, because \u221a3 \u00d7 \u221a3
    // is not exactly 3 in floating point, and the figure's coordinates
    // would then carry the error.
    return round2(verticalRise(O_NEAR) / tanOf(30).value);
  },
  get walkBack(): number {
    return round2(this.farDistance - O_NEAR.horizontalDistanceM);
  },
};

const F_TWO: GeometryFigureSpec = {
  type: 'geometry_figure',
  purpose: 'compare_cases',
  status: 'concept_specific',
  exactGeometry: true,
  points: [
    { id: 'far', x: 0, y: 0, label: 'A' },
    { id: 'near', x: round2(TWO_TRIANGLE.walkBack), y: 0, label: 'B' },
    { id: 'foot', x: round2(TWO_TRIANGLE.farDistance), y: 0, label: 'F' },
    { id: 'top', x: round2(TWO_TRIANGLE.farDistance), y: round2(verticalRise(O_NEAR)), label: 'T' },
  ],
  segments: [
    { from: 'far', to: 'foot', label: `${round2(TWO_TRIANGLE.farDistance)} m` },
    // B lies on AF, but the nearer triangle's adjacent leg must be drawn in
    // its own right for the role claim at B to be checkable.
    { from: 'near', to: 'foot', label: `${O_NEAR.horizontalDistanceM} m` },
    { from: 'foot', to: 'top', label: 'h' },
    { from: 'far', to: 'top' },
    { from: 'near', to: 'top' },
  ],
  angleMarks: [
    { at: 'far', from: 'foot', to: 'top', label: '30\u00b0' },
    { at: 'near', from: 'foot', to: 'top', label: '60\u00b0' },
    { at: 'foot', from: 'far', to: 'top', right: true },
  ],
  rightTriangleRoles: [
    { referenceVertex: 'far', rightAngleVertex: 'foot', thirdVertex: 'top', referenceLabel: 'A' },
    { referenceVertex: 'near', rightAngleVertex: 'foot', thirdVertex: 'top', referenceLabel: 'B' },
  ],
  caption: 'One chimney, two observation points on the same line.',
  altText:
    `Two right triangles sharing the vertical chimney FT and sharing the horizontal ground line, with a line of sight drawn from each observation point to the top. The observer stands first at A, where the angle of elevation of the top T is 30 degrees, and then walks to B, nearer the chimney, where the angle is 60 degrees. Both observations are made at ground level. The distance from A to the foot F is about ${round2(TWO_TRIANGLE.farDistance)} metres and from B to F is ${O_NEAR.horizontalDistanceM} metres, so the walk from A to B is about ${round2(TWO_TRIANGLE.walkBack)} metres. The chimney FT is about ${n(verticalRise(O_NEAR))} metres tall and is the side both triangles have in common.`,
};

export const C10_SECTION_9_1C: AuthoredSection = {
  contentArtifactId: 'ncert_jemh1_s9_1_two_triangles_lesson',
  contentArtifactVersion: 1,
  source: source(),
  competencyCandidates: [], competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_jemh1_s9_1'],
    mayAssume: ['Solving a one-triangle observation', 'Exact standard-angle values', 'Solving a simple pair of equations'],
    mustNotIntroduce: [{ concept: 'Problems using three or more right triangles', belongsToSection: 'outside_current_cbse_scope' }],
  },
  learningGoal:
    'You will solve a problem in which two observations of the same object give two right triangles sharing a side, and explain why an angle of depression can equal the matching angle of elevation.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: ['Solve a one-triangle observation problem.', 'Say which side two triangles have in common from a figure.', 'Solve a simple equation with the unknown on both sides.'],
    ifNotReady: 'Revise the previous lesson. Two triangles are two applications of the same reasoning, not a new method.',
  },
  vocabulary: [
    { term: 'shared side', meaning: 'A side belonging to both triangles \u2014 usually the object\u2019s vertical, which is the same whichever point it is viewed from.' },
    { term: 'transversal', meaning: 'A line crossing two others. The line of sight crosses the two horizontals, which is why elevation and depression come out equal.' },
    { term: 'alternate angles', meaning: 'The equal pair formed on opposite sides of a transversal crossing two parallel lines.' },
  ],
  explanation: [
    'Some situations give two observations of the same object \u2014 from two points, or of two objects from one point. Each observation is its own right triangle, and the two are linked because they share something: usually the object\u2019s vertical, which does not change with where you stand.',
    'The current scope allows at most two right triangles, so the method is to set each one up separately and then use what they share.',
    `Take a chimney seen from two points on the same straight line. From the nearer point B the angle of elevation is 60\u00b0, and from the further point A it is 30\u00b0. The chimney FT is the shared side: it is the same height in both triangles, which is what connects them.`,
    `If the chimney is h and B is ${O_NEAR.horizontalDistanceM} m from the foot, then tan 60\u00b0 = h / ${O_NEAR.horizontalDistanceM}, so h = ${exactRise(O_NEAR)} m. The second triangle then gives the distance from A: tan 30\u00b0 = h / AF, so AF = h\u221a3, about ${round2(TWO_TRIANGLE.farDistance)} m. The walk from A to B is the difference, about ${round2(TWO_TRIANGLE.walkBack)} m.`,
    'Notice that the two equations were not an arbitrary algebra system. Each came from a triangle in the figure, and the link between them was the shared side rather than a choice made on paper.',
    'The second idea in this lesson is why an angle of depression often equals the matching angle of elevation. The observer\u2019s horizontal and the ground are both level, so they are parallel. The line of sight crosses both, acting as a transversal, and the angle of depression at the observer and the angle of elevation at the object are alternate angles between those parallels.',
    'That is why they are equal \u2014 a consequence of parallel lines, not a coincidence and not a rule to memorise. It is also why the equality fails if the two reference lines are not parallel, which is worth remembering before transferring the fact to a situation where the ground slopes.',
  ],
  representations: ['Two right triangles sharing a vertical, with both angles marked at ground level'],
  visuals: [F_TWO, F_DEPRESSION],
  visualsById: { F_TWO, F_DEPRESSION },
  workedExamples: [
    {
      id: 's91c.we1',
      prompt: `From a point B at ground level the angle of elevation of a chimney's top is 60\u00b0, and B is ${O_NEAR.horizontalDistanceM} m from the foot. Find the chimney's height.`,
      steps: [
        { text: 'The observation is at ground level, so the triangle\u2019s vertical leg is the whole chimney.', reasoning: 'Nothing of the chimney lies below the horizontal, so no adjustment will be needed at the end.' },
        { text: `Relative to the 60\u00b0 angle at B, the height is opposite and the ${O_NEAR.horizontalDistanceM} m is adjacent, so tan 60\u00b0 = h / ${O_NEAR.horizontalDistanceM}.`, reasoning: 'The roles are read relative to the chosen angle, which is what selects tangent here.' },
        { text: `tan 60\u00b0 = ${tanOf(60).exact}, so h = ${O_NEAR.horizontalDistanceM}\u221a3 m.`, reasoning: 'The value is the canonical one from the standard-angle table, so this lesson cannot disagree with Chapter 8.' },
        { text: `So the chimney is ${exactRise(O_NEAR)} m, about ${n(verticalRise(O_NEAR))} m.`, reasoning: 'The exact form is kept because it will be substituted into the second triangle, where rounding now would spoil the later answer.' },
      ],
      answer: `${exactRise(O_NEAR)} m, approximately ${n(verticalRise(O_NEAR))} m.`,
      visualRef: 'F_TWO',
    },
    {
      id: 's91c.we2',
      prompt: 'From a further point A on the same line the angle of elevation is 30\u00b0. How far did the observer walk from A to B?',
      steps: [
        { text: 'The chimney is the shared side: the same h appears in both triangles.', reasoning: 'Its height does not depend on where it is viewed from, which is exactly what links the two observations.' },
        { text: `In triangle AFT, tan 30\u00b0 = h / AF, so AF = h / tan 30\u00b0 = h\u221a3.`, reasoning: 'Dividing by 1/\u221a3 multiplies by \u221a3, so the further distance is \u221a3 times the height.' },
        { text: `Substituting h = ${exactRise(O_NEAR)} gives AF = ${O_NEAR.horizontalDistanceM} \u00d7 3 = ${round2(TWO_TRIANGLE.farDistance)} m.`, reasoning: '\u221a3 \u00d7 \u221a3 = 3, so the surds cancel exactly and the distance is a whole number \u2014 which the rounded height would have hidden.' },
        { text: `The walk is AF \u2212 BF = ${round2(TWO_TRIANGLE.farDistance)} \u2212 ${O_NEAR.horizontalDistanceM} = ${round2(TWO_TRIANGLE.walkBack)} m.`, reasoning: 'Both distances are measured from the same foot F along the same line, so subtracting them gives the distance between the two observation points.' },
      ],
      answer: `${round2(TWO_TRIANGLE.walkBack)} m.`,
      visualRef: 'F_TWO',
    },
    {
      id: 's91c.we3',
      prompt: `A keeper ${O_DEPRESSION.eyeHeightM} m above the water sights a boat at an angle of depression of ${O_DEPRESSION.angleDegrees}\u00b0. Find the boat's distance from the lighthouse, and explain why the angle of elevation from the boat is the same.`,
      steps: [
        { text: 'The angle of depression is at the keeper, between the keeper\u2019s horizontal and the line of sight.', reasoning: 'Placing it at the boat would be a different angle, formed by the line of sight and the water rather than by the line of sight and the keeper\u2019s horizontal.' },
        { text: `The vertical drop is the full ${O_DEPRESSION.eyeHeightM} m, and tan ${O_DEPRESSION.angleDegrees}\u00b0 = ${O_DEPRESSION.eyeHeightM} / d.`, reasoning: 'The drop is opposite the angle at the keeper and the horizontal distance is adjacent, so tangent connects them.' },
        { text: `tan ${O_DEPRESSION.angleDegrees}\u00b0 = ${tanOf(O_DEPRESSION.angleDegrees).exact}, so d = ${O_DEPRESSION.horizontalDistanceM} m.`, reasoning: 'With a tangent of 1 the two legs are equal, so the boat is as far out as the lighthouse is tall.' },
        { text: 'The keeper\u2019s horizontal and the water are both level, so they are parallel, and the line of sight is a transversal.', reasoning: 'This is the geometric fact doing the work; without parallel references the two angles need not agree.' },
        { text: 'The angle of depression and the angle of elevation from the boat are alternate angles between those parallels, so they are equal.', reasoning: 'The equality is a consequence of the parallel lines rather than a rule about elevation and depression, which is why it would fail over sloping ground.' },
      ],
      answer: `${O_DEPRESSION.horizontalDistanceM} m; the angles are equal as alternate angles between two parallel horizontals.`,
      visualRef: 'F_DEPRESSION',
    },
  ],
  guidedPractice: [
    { id: 's91c.g1', prompt: 'Two observations of one tower from different points: what do the two triangles share?', hint: 'What does not change when you move?', answer: 'The tower\u2019s vertical side.', rationale: 'Its height is the same from either point, which is what lets one triangle\u2019s result be substituted into the other.' },
    { id: 's91c.g2', prompt: 'Why is the angle of depression equal to the angle of elevation in the lighthouse figure?', hint: 'Which two lines are parallel?', answer: 'Because the two horizontals are parallel and the line of sight is a transversal, making them alternate angles.', rationale: 'The equality rests on the parallel references, not on anything special about elevation and depression.' },
    { id: 's91c.g3', prompt: 'In the chimney problem, why keep the height as 20\u221a3 rather than 34.64 before finding AF?', hint: 'What happens to \u221a3 \u00d7 \u221a3?', answer: 'Because the surds cancel exactly, giving 60 m.', rationale: 'Rounding first would give about 60.0 m with an error carried forward, hiding that the answer is exact.' },
  ],
  independentPractice: [
    { id: 's91c.i1', prompt: 'From a point 15 m from a pole the elevation is 45\u00b0. How tall is the pole, observed at ground level?', answer: '15 m.', rationale: 'tan 45\u00b0 = 1, so the height equals the horizontal distance. The eye is on the ground, so nothing is added.' },
    { id: 's91c.i2', prompt: 'An observer at ground level sees a 30 m tower at an elevation of 30\u00b0. How far away is the observer?', answer: '30\u221a3 m, about 51.96 m.', rationale: 'tan 30\u00b0 = 30 / d gives d = 30\u221a3. Note the height is given and the distance is wanted, so the ratio is used the other way round.' },
    { id: 's91c.i3', prompt: 'Would the angle of depression still equal the angle of elevation if the ground sloped?', answer: 'No.', rationale: 'The equality needs the observer\u2019s horizontal and the reference at the object to be parallel. A sloping ground is not parallel to the horizontal, so the alternate-angle argument fails.' },
    { id: 's91c.i4', prompt: 'A problem would need three right triangles. Is it within the current scope?', answer: 'No \u2014 at most two are prescribed.', rationale: 'The current curriculum limits heights-and-distances problems to two right triangles, so a three-triangle situation is outside what is being assessed.' },
  ],
  misconceptionIds: [], interactivePractice: [],
  reasoningApplication: [
    {
      id: 's91c.td1',
      prompt: 'Why must the horizontal reference be drawn through the observer, rather than along the ground, when the observer is not at ground level?',
      expectedReasoning:
        'Because both angles are defined as the turn of the gaze away from level, and the gaze starts at the eye. A horizontal drawn along the ground would be a different line, and the angle between it and the line of sight would be a different number \u2014 the angle at the object rather than at the observer. When the observer happens to be at ground level the two lines coincide, which is why the distinction can go unnoticed until a problem puts the eye on a cliff or a rooftop.',
    },
    {
      id: 's91c.td2',
      prompt: 'Two observations gave two equations in the same unknown height. Explain why this is not simply an algebra exercise.',
      expectedReasoning:
        'Each equation came from a triangle that exists in the figure, and the quantity they share \u2014 the object\u2019s vertical \u2014 is shared because it is physically the same side, not because the same letter was written twice. If the two observations were of different objects, or from points not on one straight line, the equations would not be linked in that way and solving them together would produce a number describing nothing. The geometry licenses the algebra, so the figure has to be settled first.',
    },
  ],
  summary:
    `Two observations give two right triangles, linked by the side they share \u2014 usually the object\u2019s vertical, which does not change with the viewing point. Solve one triangle, substitute the shared quantity into the other, and keep exact values until the end, since surds often cancel. An angle of depression equals the matching angle of elevation because the two horizontals are parallel and the line of sight is a transversal, making them alternate angles \u2014 not as a rule in its own right. The current scope allows at most two triangles.`,
  nextStep: 'The rest of the chapter applies these models to further situations.',
  teacher: teacher(
    'Students solve a two-triangle observation and justify the elevation-depression equality from parallel lines.',
    ['One-triangle observations', 'Alternate angles between parallels'],
    ['What do the two triangles share?', 'Which two lines are parallel here?', 'Keep the surd until the end.'],
    [
      'The shared side is the idea. Students who treat the two equations as an algebra system detached from the figure will link the wrong quantities when the situation changes.',
      'Deriving the elevation-depression equality from alternate angles connects this chapter to Chapter 6 and stops it being a memorised rule \u2014 and the sloping-ground question shows why the derivation matters.',
      'Keeping 20\u221a3 rather than 34.64 pays off visibly when \u221a3 \u00d7 \u221a3 gives a whole number.',
    ],
    ['Ask which side the two triangles have in common.', 'Ask why the two angles are equal.'],
    ['Have the student mark the shared side on the figure before writing either equation.'],
    ['Ask what changes if the second observation is made from a rooftop rather than the ground.'],
  ),
  reviewStatus: 'authored_draft',
};

export const CLASS10_HEIGHTS_DISTANCES_SECTIONS: AuthoredSection[] = [
  C10_SECTION_9_1A, C10_SECTION_9_1B, C10_SECTION_9_1C,
];

export const CANONICAL_HD_FIGURES = [F_GROUND, F_EYE, F_DEPRESSION, F_TWO];
