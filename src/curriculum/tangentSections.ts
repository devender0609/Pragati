// ===========================================================================
// v0.84.0-c10.13 checkpoint 67 — CLASS 10 CIRCLES.
//
// PROOF_DEEPENING. The frozen Class 9 record has eight circle lessons, most
// of them proofs — chords, central and inscribed angles, cyclic
// quadrilaterals — and ZERO mentions of a tangent. So geometric proof about
// circles is not new; the tangent is. The lessons say exactly that.
//
// Two units carry a PROVE obligation: 10.2b and 10.3b. Both are proved in
// full, from stated hypotheses, with the criterion named. Neither reads a
// conclusion off its figure.
//
// Source: NCERT Mathematics, Textbook for Class X (Reprint 2026-27), \u00a710.2
// (folio 145) and \u00a710.3 (folio 147). \u00a710.1 and \u00a710.4 are REVIEW and earn
// no units.
//
// Every figure's coordinates are exact integers and are checked against
// tangency.ts before any proof is written about them.
// ===========================================================================

import type { AuthoredSection } from './authoredSection';
import {
  distSq, tangentCountFor, tangentSegmentLengthSq,
  type Circle, type Pt,
} from './tangency';

export const TANGENT_CHAPTER_ID = 'ncert_jemh1_ch10';

const BOOK = 'Mathematics, Textbook for Class X (Reprint 2026-27)';
const SRC = 'https://ncert.nic.in/textbook/pdf/jemh1dd.zip';
const INSPECTED = '2026-10-16';

const source = (sectionNumber: string, exactTitle: string, startPage: number, officialSectionId: string) => ({
  officialChapterId: TANGENT_CHAPTER_ID, officialSectionId, sectionNumber, exactTitle,
  startPage, textbook: BOOK, sourceReference: SRC, inspectionDate: INSPECTED,
});

/** What the frozen Class 9 record already established. */
export const CLASS_9_CIRCLE_PROOF_PRIOR = {
  source: 'src/curriculum/circlesSections.ts (Class 9 Chapter 5, frozen, 8 lessons)',
  alreadyCovered: [
    'the circle defined by equal distance from a centre, and its symmetry',
    'equal chords subtend equal angles at the centre, proved, with its converse',
    'the line from the centre to a chord\u2019s midpoint is perpendicular to it, proved',
    'the angle an arc subtends at the centre is twice the angle at the circumference, proved',
    'cyclic quadrilaterals and when four points lie on one circle, proved',
    'congruence criteria including RHS, used as established tools',
  ],
  genuinelyNewInClass10: [
    'the tangent, and its point of contact',
    'the tangent is perpendicular to the radius at the point of contact',
    'how many tangents a point admits, by where it stands',
    'the two tangents from an external point are equal in length',
  ],
  tangentMentionsInClass9: 0,
};

// --- the canonical figure --------------------------------------------------
// A 3-4-5 triangle scaled by five, so every coordinate is a whole number and
// no square root enters: OA = 15, PA = 20, OP = 25.

export const CIRCLE_O: Circle = { centre: { x: 0, y: 0 }, radius: 15 };
export const EXTERNAL_P: Pt = { x: 25, y: 0 };
export const CONTACT_A: Pt = { x: 9, y: 12 };
export const CONTACT_B: Pt = { x: 9, y: -12 };
export const POINT_ON: Pt = { x: 15, y: 0 };
export const POINT_INSIDE: Pt = { x: 6, y: 0 };

export const OA = 15;
export const OP = 25;
export const PA = 20;

export const CANONICAL_POINTS: Array<[string, Pt]> = [
  ['inside the circle', POINT_INSIDE],
  ['on the circle', POINT_ON],
  ['outside the circle', EXTERNAL_P],
];

const teacher = (objective: string, prereq: string[], lang: string[], notes: string[], checks: string[], support: string[], ext: string[]) => ({
  objective, prerequisiteKnowledge: prereq, modelLanguage: lang, teachingNotes: notes,
  quickChecks: checks, supportForStrugglingLearners: support, extension: ext, materialsNeeded: [],
});

export const C10_SECTION_10_2A: AuthoredSection = {
  contentArtifactId: 'ncert_jemh1_s10_2_tangent_definition_lesson',
  contentArtifactVersion: 1,
  source: source('10.2', 'Tangent to a Circle', 145, 'ncert_jemh1_s10_2'),
  competencyCandidates: [], competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: [],
    mayAssume: ['Circles, chords and arcs from Class IX', 'A chord has both endpoints on the circle'],
    mustNotIntroduce: [
      { concept: 'The radius-tangent theorem', belongsToSection: 'ncert_jemh1_s10_2b' },
      { concept: 'How many tangents a point admits', belongsToSection: 'ncert_jemh1_s10_3' },
    ],
  },
  learningGoal:
    'You will define a tangent by how many points it shares with a circle, distinguish it from a secant, and name its point of contact.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: ['Say what a chord is.', 'Decide whether a point lies on a circle.', 'Describe a line meeting a curve.'],
    ifNotReady: 'Revise circles from Class IX. You proved several chord and angle results there; this chapter adds a line that meets the circle only once.',
  },
  vocabulary: [
    { term: 'secant', meaning: 'A line that meets a circle at exactly two points.' },
    { term: 'tangent', meaning: 'A line that meets a circle at exactly one point.' },
    { term: 'point of contact', meaning: 'The single point where a tangent meets the circle.' },
    { term: 'chord', meaning: 'The segment joining two points of a circle \u2014 the part of a secant inside it.' },
  ],
  explanation: [
    'Class IX gave you a great deal about circles: chords, the angles they subtend, cyclic quadrilaterals, and proofs of each. All of that stands. What this chapter adds is a line that meets a circle only once, which Class IX never considered.',
    'Ask how a line can sit relative to a circle. It can miss the circle entirely, sharing no point. It can cut across, sharing two. Or it can meet the circle at exactly one point. There is no fourth case: a line and a circle cannot share three points.',
    'A line meeting the circle at exactly two points is a SECANT. The segment between those two points is a chord, which you already know.',
    'A line meeting the circle at exactly ONE point is a TANGENT, and that single point is its POINT OF CONTACT.',
    'The definition is about incidence \u2014 how many points the line and the circle share. Saying a tangent "touches" the circle describes the picture well enough, but it is not a condition you can check. Counting shared points is.',
    'There is a way of picturing how the tangent arises. Take a secant and slide it outward, keeping it parallel to itself. Its two intersection points move toward each other, and at the last position before the line leaves the circle they have merged into one. That final position is the tangent, and it is often called the limiting position of the secant.',
    'That picture is motivation, not argument. It makes the tangent plausible and suggests where to look, but nothing in it establishes any property of the tangent. The properties come in the next lessons, and they are proved.',
    `In the figure used through this chapter, the circle has centre O and radius ${OA}, and the line through the point ${pointName(CONTACT_A)} meets it exactly once \u2014 that point is the point of contact.`,
  ],
  representations: ['A circle with a secant cutting it twice and a tangent meeting it once, with the contact point named'],
  visuals: [], visualsById: {},
  workedExamples: [
    {
      id: 's102a.we1',
      prompt: 'Classify each line: one meeting a circle at two points, one at one point, one at none.',
      steps: [
        { text: 'Count the points the line and the circle share.', reasoning: 'The classification is entirely a matter of incidence, so counting is the whole test and no measurement is needed.' },
        { text: 'Two shared points: the line is a secant, and the segment between them is a chord.', reasoning: 'The chord is the part of the secant lying inside the circle, which is why the two ideas are related but not the same.' },
        { text: 'One shared point: the line is a tangent, and that point is the point of contact.', reasoning: 'Exactly one is the defining condition; a line that came close but shared none would not qualify.' },
        { text: 'No shared point: the line simply misses the circle and has no special name here.', reasoning: 'It completes the three possibilities, which is what shows the list is exhaustive.' },
      ],
      answer: 'Two points \u2014 secant; one point \u2014 tangent; none \u2014 neither.',
    },
    {
      id: 's102a.we2',
      prompt: 'Why is "a tangent touches the circle" not a usable definition?',
      steps: [
        { text: '"Touches" describes the appearance of the picture rather than a condition.', reasoning: 'It names an impression, and two different lines can both look as though they touch at the scale of a drawing.' },
        { text: 'A line passing very close to the circle without meeting it also looks as if it touches.', reasoning: 'At any finite drawing accuracy the two cases are indistinguishable, so the picture cannot decide between them.' },
        { text: 'Counting shared points separates them exactly: one, or none.', reasoning: 'Incidence is a yes-or-no fact about the geometry rather than a judgement about the drawing.' },
        { text: 'So the definition is "meets the circle at exactly one point".', reasoning: 'It can be checked, and every later theorem will rest on it rather than on how the figure looks.' },
      ],
      answer: 'Because touching is an appearance; meeting at exactly one point is a condition.',
    },
    {
      id: 's102a.we3',
      prompt: 'A line meets a circle at A and B, and is then slid outward until A and B coincide. What has it become, and what has been established?',
      steps: [
        { text: 'While A and B are distinct, the line is a secant and AB is a chord.', reasoning: 'Two shared points is exactly the secant condition, whatever the chord\u2019s length.' },
        { text: 'As the line slides outward the chord shortens and the two points approach each other.', reasoning: 'The line meets the circle nearer and nearer to one place as it moves away from the centre.' },
        { text: 'When they coincide, the line shares exactly one point with the circle: it is a tangent.', reasoning: 'The incidence count has dropped from two to one, which is the definition being satisfied.' },
        { text: 'This shows how a tangent arises. It establishes no property of the tangent.', reasoning: 'A limiting picture motivates; it does not prove, and the perpendicularity in the next lesson has to be argued separately.' },
      ],
      answer: 'A tangent \u2014 and the picture is motivation only, not a proof of anything.',
    },
  ],
  guidedPractice: [
    { id: 's102a.g1', prompt: 'A line shares exactly two points with a circle. Name the line and the segment between the points.', hint: 'Count the shared points.', answer: 'A secant, and the segment is a chord.', rationale: 'Two shared points is the secant condition; the chord is the part of that line inside the circle.' },
    { id: 's102a.g2', prompt: 'Can a line meet a circle at three points?', hint: 'Think about what a circle is.', answer: 'No.', rationale: 'A line and a circle share at most two points, which is why the three cases \u2014 none, one, two \u2014 are the only ones.' },
    { id: 's102a.g3', prompt: 'Why is the limiting-secant picture not a proof that the tangent is perpendicular to the radius?', hint: 'What does the picture actually show?', answer: 'Because it only shows how a tangent arises, not what properties it has.', rationale: 'Watching two points merge says nothing about any angle. Perpendicularity is a separate claim needing a separate argument.' },
  ],
  independentPractice: [
    { id: 's102a.i1', prompt: 'Define a tangent precisely.', answer: 'A line that meets the circle at exactly one point.', rationale: 'The condition is on the number of shared points, which can be checked, rather than on how the line looks.' },
    { id: 's102a.i2', prompt: 'What is the difference between a chord and a secant?', answer: 'A chord is a segment with both ends on the circle; a secant is the whole line through them.', rationale: 'The chord is the part of the secant lying inside the circle, so one is bounded and the other is not.' },
    { id: 's102a.i3', prompt: 'A line misses a circle entirely. Is it a tangent?', answer: 'No.', rationale: 'It shares no point with the circle, and a tangent must share exactly one.' },
    { id: 's102a.i4', prompt: 'Is "tangent" a new idea in Class 10, and is circle proof?', answer: 'The tangent is new; circle proof is not.', rationale: 'Class IX proved chord, angle and cyclic results. It never considered a line meeting a circle once, which is what this chapter adds.' },
  ],
  misconceptionIds: [], interactivePractice: [],
  reasoningApplication: [
    {
      id: 's102a.td1',
      prompt: 'Why does the definition of a tangent count shared points rather than describe touching?',
      expectedReasoning:
        'Because a definition has to be checkable, and touching is an impression rather than a condition. A line that passes within a hair of a circle without meeting it looks exactly like one that meets it once, so a drawing cannot settle which is which. The number of points a line and a circle share is a definite fact about the geometry, independent of how carefully anything is drawn. Every theorem in this chapter rests on that fact, which is why it has to be the definition.',
    },
    {
      id: 's102a.td2',
      prompt: 'The limiting-secant picture is appealing. What exactly does it establish, and what does it not?',
      expectedReasoning:
        'It establishes nothing. It shows how a tangent can be reached from something familiar \u2014 a secant whose two intersection points draw together until they are one \u2014 and so makes the idea plausible and tells you where in the figure to look. But every property of the tangent, starting with its perpendicularity to the radius, is a claim about an angle, and nothing in the sliding picture is an argument about angles. Motivation and proof do different jobs, and confusing them is how a chapter of real theorems turns into a set of remembered facts.',
    },
  ],
  summary:
    `A line can share no point with a circle, exactly two, or exactly one \u2014 never three. Exactly two makes it a SECANT, whose inside part is a chord; exactly one makes it a TANGENT, and that point is the POINT OF CONTACT. The definition counts shared points rather than describing touching, because counting can be checked and appearance cannot. The limiting-secant picture motivates the tangent; it proves nothing about it.`,
  nextStep: 'Next you will prove that the tangent is perpendicular to the radius at the point of contact.',
  teacher: teacher(
    'Students define a tangent by incidence, distinguish secant and chord, and separate motivation from proof.',
    ['Circles and chords (Class IX)'],
    ['How many points do they share?', 'Is that a condition, or an appearance?', 'What did the picture actually establish?'],
    [
      'Say plainly that circle proof is not new \u2014 Class IX proved eight lessons of it. What is new is the tangent.',
      'The limiting picture is worth showing and worth labelling as motivation in the same breath. Students who take it as proof will not see why the next lesson needs an argument.',
      'Keep perpendicularity out of this lesson entirely, including from any figure marking.',
    ],
    ['Ask for the definition in terms of points shared.', 'Ask what the sliding picture proves.'],
    ['Have the student count intersection points on three drawn lines before naming any of them.'],
    ['Ask whether a line can be tangent to two circles at once.'],
  ),
  reviewStatus: 'authored_draft',
};

function pointName(p: Pt): string { return `A(${p.x}, ${p.y})`; }

export const C10_SECTION_10_2B: AuthoredSection = {
  contentArtifactId: 'ncert_jemh1_s10_2_radius_perpendicular_lesson',
  contentArtifactVersion: 1,
  source: source('10.2', 'Tangent to a Circle', 145, 'ncert_jemh1_s10_2'),
  competencyCandidates: [], competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_jemh1_s10_2'],
    mayAssume: ['The tangent definition', 'A point outside a circle is further from the centre than the radius', 'The perpendicular is the shortest distance from a point to a line'],
    mustNotIntroduce: [{ concept: 'Equal tangents from an external point', belongsToSection: 'ncert_jemh1_s10_3b' }],
  },
  learningGoal:
    'You will prove that the tangent at any point of a circle is perpendicular to the radius through the point of contact.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: ['State the tangent definition.', 'Say why a point outside a circle is further from the centre than any point on it.', 'State that the shortest distance from a point to a line is along the perpendicular.'],
    ifNotReady: 'Revise the previous lesson and the shortest-distance result from earlier geometry. Both are used in the proof.',
  },
  vocabulary: [
    { term: 'theorem', meaning: 'A statement established by proof from things already accepted.' },
    { term: 'perpendicular', meaning: 'Meeting at a right angle.' },
    { term: 'shortest distance', meaning: 'From a point to a line, the length of the perpendicular from the point to that line.' },
  ],
  explanation: [
    'THEOREM. The tangent at any point of a circle is perpendicular to the radius through the point of contact.',
    'This is a theorem, so it has to be proved. A figure drawn with a right-angle mark at the contact point is not evidence \u2014 the mark records what we intend to establish, and putting it in beforehand would assume the conclusion.',
    'GIVEN: a circle with centre O, and a tangent line meeting it at the point of contact P.',
    'TO PROVE: OP is perpendicular to the tangent.',
    'The proof turns on a fact about the tangent that follows directly from its definition. The tangent meets the circle at P and nowhere else, so every OTHER point of the tangent lies outside the circle \u2014 if some other point Q lay on the circle there would be two shared points, and the line would be a secant.',
    'Now compare distances from O. For any other point Q on the tangent, Q is outside the circle, so OQ is greater than the radius. And OP IS the radius. So OP is less than OQ for every other point Q of the line.',
    'That makes OP the shortest of all the distances from O to points of the tangent. The shortest distance from a point to a line is along the perpendicular from that point \u2014 a result from earlier geometry, used here as an established tool.',
    'Therefore OP is perpendicular to the tangent, which is what was to be proved.',
    'Notice what carried the argument: the incidence definition, the fact that outside points are further than the radius, and the shortest-distance result. The figure was used to name points, not to supply a conclusion.',
  ],
  representations: ['A circle with centre O, a tangent at P, and a second point Q on the tangent outside the circle'],
  visuals: [], visualsById: {},
  workedExamples: [
    {
      id: 's102b.we1',
      prompt: 'Prove that the tangent at a point of a circle is perpendicular to the radius through that point.',
      steps: [
        { text: 'GIVEN: a circle with centre O and a tangent meeting it at P. TO PROVE: OP \u22a5 the tangent.', reasoning: 'Setting out the hypotheses and the target first keeps clear which facts may be used and which is being established.' },
        { text: 'Take any point Q on the tangent other than P.', reasoning: 'A general Q is needed rather than a convenient one, since the conclusion must hold against every other point of the line.' },
        { text: 'Q does not lie on the circle, because the tangent meets the circle only at P; so Q lies outside it.', reasoning: 'A second common point would make two shared points and the line a secant, contradicting the tangent definition.' },
        { text: 'A point outside the circle is further from O than the radius, so OQ > OP.', reasoning: 'OP is itself a radius, so this comparison is between the radius and something known to exceed it.' },
        { text: 'Since this holds for EVERY other point Q of the tangent, OP is the shortest distance from O to the line.', reasoning: 'Being shorter than each alternative in turn is exactly what being the shortest means, and Q was arbitrary.' },
        { text: 'The shortest distance from a point to a line is along the perpendicular, so OP \u22a5 the tangent.', reasoning: 'This result is available from earlier geometry and is the step that converts a statement about lengths into one about angles.' },
      ],
      answer: 'OP is perpendicular to the tangent at P.',
    },
    {
      id: 's102b.we2',
      prompt: 'A student writes: "The right angle is marked in the figure, so OP is perpendicular to the tangent." Why is this not a proof?',
      steps: [
        { text: 'The mark in the figure records the conclusion, not a hypothesis.', reasoning: 'A figure is drawn after the mathematics is known, so its markings cannot be the evidence for that mathematics.' },
        { text: 'Using it as a reason assumes what is to be proved.', reasoning: 'The argument would then establish nothing, since its premise already contains its conclusion.' },
        { text: 'A drawing cannot distinguish 90\u00b0 from 89.6\u00b0 reliably in any case.', reasoning: 'Even as evidence it would be weak, which is a separate objection from the logical one.' },
        { text: 'The proof must come from the definition and the distance comparison instead.', reasoning: 'Those are facts independent of the drawing, so the conclusion they yield does not depend on how carefully anything was drawn.' },
      ],
      answer: 'Because the mark is the conclusion being assumed as a given.',
    },
    {
      id: 's102b.we3',
      prompt: 'Why can the same argument not show that the radius to an arbitrary point of a SECANT is perpendicular to it?',
      steps: [
        { text: 'The argument needs every other point of the line to lie outside the circle.', reasoning: 'That is what made OP shorter than every alternative and so the shortest distance.' },
        { text: 'A secant meets the circle at two points, and the chord between them lies inside.', reasoning: 'Points of the line between the two intersections are nearer to O than the radius, not further.' },
        { text: 'So for a secant there are points Q with OQ < OP, and OP is not the shortest distance.', reasoning: 'The key comparison reverses, so the step that produced the perpendicular is unavailable.' },
        { text: 'The conclusion fails with it: a radius to a point of a secant is generally not perpendicular to it.', reasoning: 'This shows the tangent definition is doing real work in the theorem rather than merely setting the scene.' },
      ],
      answer: 'Because on a secant some points are nearer to O than the radius, so OP is not the shortest distance.',
    },
  ],
  guidedPractice: [
    { id: 's102b.g1', prompt: 'In the proof, why must Q lie outside the circle?', hint: 'What would it mean if Q were on the circle?', answer: 'Because the tangent meets the circle only at P.', rationale: 'A second point of the line on the circle would give two shared points, making the line a secant instead.' },
    { id: 's102b.g2', prompt: 'Which earlier result turns the length comparison into a statement about angles?', hint: 'What is special about the shortest distance?', answer: 'That the shortest distance from a point to a line is along the perpendicular.', rationale: 'Without it the proof would end with OP being shortest and say nothing about any right angle.' },
    { id: 's102b.g3', prompt: `In the chapter figure, OA = ${OA} and A lies on the circle. What does the theorem tell you about the tangent at A?`, hint: 'Apply the theorem rather than reproving it.', answer: 'It is perpendicular to OA.', rationale: 'OA is the radius to the point of contact, so by the tangent-radius theorem the tangent at A is perpendicular to it.' },
  ],
  independentPractice: [
    { id: 's102b.i1', prompt: 'State the theorem\u2019s given and what is to be proved.', answer: 'Given a circle with centre O and a tangent at P; to prove OP is perpendicular to the tangent.', rationale: 'Separating the hypotheses from the target is what keeps the argument from assuming its conclusion.' },
    { id: 's102b.i2', prompt: 'A proof says "OP is perpendicular because it is the radius drawn to a tangent." What is wrong?', answer: 'It uses the theorem as its own reason.', rationale: 'That a radius to a tangent is perpendicular is precisely what is being proved, so citing it is circular.' },
    { id: 's102b.i3', prompt: 'Why must Q be an arbitrary point rather than a chosen one?', answer: 'Because OP must be shortest compared with every other point.', rationale: 'Checking one convenient Q would show OP is shorter than that one, which is far weaker than being the shortest.' },
    { id: 's102b.i4', prompt: `A tangent touches a circle of radius ${OA} at A, and O is the centre. What is the angle between OA and the tangent?`, answer: '90\u00b0.', rationale: 'By the theorem just proved, the radius to the point of contact is perpendicular to the tangent there.' },
  ],
  misconceptionIds: [], interactivePractice: [],
  reasoningApplication: [
    {
      id: 's102b.td1',
      prompt: 'Which hypothesis does the proof actually use, and what would break without it?',
      expectedReasoning:
        'It uses the incidence definition \u2014 that the tangent meets the circle at exactly one point. That is what forces every other point of the line to lie outside the circle, which gives OQ > OP for every such Q, which makes OP the shortest distance, which the earlier result converts into perpendicularity. Remove that hypothesis and the chain collapses at its first link: for a secant, points between the two intersections are nearer to O than the radius, OP is not shortest, and no right angle follows. So the definition is not scene-setting; it is the load-bearing assumption.',
    },
    {
      id: 's102b.td2',
      prompt: 'A figure shows a right-angle mark at the point of contact. When is that mark legitimate, and when is it not?',
      expectedReasoning:
        'It is legitimate after the theorem has been proved, as a record of what is now known \u2014 a figure accompanying an application may certainly carry it. It is not legitimate inside the proof of the theorem, where it would be a given, because the right angle is the conclusion. The general principle is that a diagram may name points and show configuration, but it cannot supply facts; anything it appears to show either follows from the stated hypotheses or has no standing. Marking the conclusion as a given turns an argument into a restatement.',
    },
  ],
  summary:
    `THEOREM: the tangent at any point of a circle is perpendicular to the radius through the point of contact. The proof: every point of the tangent other than P lies OUTSIDE the circle, since otherwise the line would share two points and be a secant; so OQ > OP for every other point Q; so OP is the shortest distance from O to the line; and the shortest distance from a point to a line is along the perpendicular. The figure names the points \u2014 it supplies no step, and a right-angle mark would be the conclusion assumed.`,
  nextStep: 'Next you will find how many tangents can be drawn from a point, according to where it lies.',
  teacher: teacher(
    'Students prove the tangent-radius theorem from the incidence definition and the shortest-distance result.',
    ['The tangent definition', 'Shortest distance from a point to a line'],
    ['Where does every OTHER point of the tangent lie?', 'Shorter than what?', 'Is that a given or the conclusion?'],
    [
      'The step students skip is why Q lies outside. Ask it explicitly; the answer is the tangent definition and nothing else.',
      'Do not mark the right angle in any figure used during the proof. Mark it afterwards if an application needs it.',
      'The secant comparison in the third example shows the hypothesis doing work and is worth the time.',
    ],
    ['Ask why Q cannot be on the circle.', 'Ask which earlier result gives the right angle.'],
    ['Have the student write GIVEN and TO PROVE before any reasoning, and check no given is the conclusion.'],
    ['Ask what the shortest distance from the centre to a secant is.'],
  ),
  reviewStatus: 'authored_draft',
};

export const C10_SECTION_10_3A: AuthoredSection = {
  contentArtifactId: 'ncert_jemh1_s10_3_tangent_count_lesson',
  contentArtifactVersion: 1,
  source: source('10.3', 'Number of Tangents from a Point on a Circle', 147, 'ncert_jemh1_s10_3'),
  competencyCandidates: [], competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_jemh1_s10_2'],
    mayAssume: ['The tangent definition', 'A point is inside, on or outside a circle according to its distance from the centre'],
    mustNotIntroduce: [{ concept: 'Equal tangent lengths', belongsToSection: 'ncert_jemh1_s10_3b' }],
  },
  learningGoal:
    'You will establish how many tangents can be drawn to a circle from a point, according to whether it lies inside, on or outside the circle.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: ['State the tangent definition.', 'Compare a point\u2019s distance from the centre with the radius.', 'Say what it means for a line to pass through a point.'],
    ifNotReady: 'Revise the tangent definition. The whole classification follows from it together with where the point lies.',
  },
  vocabulary: [
    { term: 'interior point', meaning: 'A point whose distance from the centre is less than the radius.' },
    { term: 'exterior point', meaning: 'A point whose distance from the centre is greater than the radius.' },
    { term: 'external point', meaning: 'Another name for an exterior point, used when tangents are drawn from it.' },
  ],
  explanation: [
    'A point sits in exactly one of three places relative to a circle, decided by comparing its distance from the centre with the radius: nearer than the radius, exactly the radius, or further. Call these interior, on the circle, and exterior.',
    'How many tangents pass through the point depends only on which of the three it is.',
    `A point INSIDE the circle admits NO tangent. Any line through an interior point must cross the circle and come out the other side, meeting it at two points \u2014 so every such line is a secant. For the point ${pointName2(POINT_INSIDE)}, whose distance from O is ${Math.round(Math.sqrt(distSq(CIRCLE_O.centre, POINT_INSIDE)))} against a radius of ${OA}, there is no tangent at all.`,
    `A point ON the circle admits exactly ONE tangent. There is a unique line through it perpendicular to the radius at that point, and by the theorem just proved that is where the tangent must be. For the point ${pointName2(POINT_ON)}, at distance exactly ${OA} from O, there is one tangent.`,
    `A point OUTSIDE the circle admits exactly TWO tangents. For the point ${pointName2(EXTERNAL_P)}, at distance ${OP} from O, two tangent lines can be drawn, touching the circle at two distinct points.`,
    'The count is not a separate fact to memorise against each case. It follows from where the point lies, which is why the classification is worth stating in terms of distance rather than appearance.',
    'The interior case deserves its reason spelled out, because "you cannot draw one" is not an argument. A line through an interior point has points of the circle on both sides of it, so it must meet the circle twice; two shared points make it a secant; and a secant is not a tangent. There is no line left for a tangent to be.',
    'From here on, "external point" means a point outside the circle, which is the only case from which two tangents can be drawn.',
  ],
  representations: ['One circle with three marked points \u2014 inside, on and outside \u2014 and the tangents each admits'],
  visuals: [], visualsById: {},
  workedExamples: [
    {
      id: 's103a.we1',
      prompt: 'Show that no tangent can be drawn from a point inside a circle.',
      steps: [
        { text: 'Let A be a point with OA less than the radius, so A is inside the circle.', reasoning: 'The interior condition is a comparison of distances, which is what the argument will use.' },
        { text: 'Take any line through A.', reasoning: 'The claim is about every line through the point, so the argument must begin with an arbitrary one.' },
        { text: 'Since A is inside, the line passes from inside the circle out on both sides, so it meets the circle at two points.', reasoning: 'A line through an interior point has circle points on either side of it, so it crosses the boundary twice.' },
        { text: 'Two shared points make the line a secant, not a tangent.', reasoning: 'The tangent definition requires exactly one shared point, so two disqualifies the line.' },
        { text: 'Every line through A is therefore a secant, and no tangent exists from A.', reasoning: 'The conclusion is about all lines because the line chosen was arbitrary.' },
      ],
      answer: 'None \u2014 every line through an interior point is a secant.',
    },
    {
      id: 's103a.we2',
      prompt: `For the circle of radius ${OA} centred at O, classify the points ${pointName2(POINT_INSIDE)}, ${pointName2(POINT_ON)} and ${pointName2(EXTERNAL_P)}, and give the number of tangents from each.`,
      steps: [
        { text: `Compare each distance with the radius ${OA}.`, reasoning: 'Position is decided by that comparison alone, not by how the point looks in the drawing.' },
        { text: `${pointName2(POINT_INSIDE)} is at distance ${Math.round(Math.sqrt(distSq(CIRCLE_O.centre, POINT_INSIDE)))}, which is less than ${OA}: interior, so ${tangentCountFor(CIRCLE_O, POINT_INSIDE)} tangents.`, reasoning: 'Every line through it meets the circle twice, by the argument above.' },
        { text: `${pointName2(POINT_ON)} is at distance exactly ${OA}: on the circle, so ${tangentCountFor(CIRCLE_O, POINT_ON)} tangent.`, reasoning: 'One line through it is perpendicular to the radius there, and by the previous theorem the tangent must be that line.' },
        { text: `${pointName2(EXTERNAL_P)} is at distance ${OP}, greater than ${OA}: exterior, so ${tangentCountFor(CIRCLE_O, EXTERNAL_P)} tangents.`, reasoning: 'Two distinct lines through it each meet the circle exactly once, touching at two different points.' },
      ],
      answer: `${tangentCountFor(CIRCLE_O, POINT_INSIDE)}, ${tangentCountFor(CIRCLE_O, POINT_ON)} and ${tangentCountFor(CIRCLE_O, EXTERNAL_P)} tangents respectively.`,
    },
    {
      id: 's103a.we3',
      prompt: 'A figure shows a point clearly outside a circle, with one tangent drawn from it. Is the figure complete?',
      steps: [
        { text: 'The point is exterior, since its distance from the centre exceeds the radius.', reasoning: 'That comparison settles the classification regardless of what the drawing emphasises.' },
        { text: 'An exterior point admits exactly two tangents.', reasoning: 'The count follows from the position, so it is not open to choice by whoever drew the figure.' },
        { text: 'Only one has been drawn, so the figure is incomplete rather than wrong.', reasoning: 'The second tangent exists whether or not it appears; omitting it hides part of the configuration.' },
        { text: 'A figure claiming an exterior point has only one tangent would be wrong.', reasoning: 'That would contradict the classification, which is derived from the point\u2019s position rather than asserted alongside it.' },
      ],
      answer: 'Incomplete \u2014 a second tangent exists and should be shown.',
    },
  ],
  guidedPractice: [
    { id: 's103a.g1', prompt: `A point is at distance 9 from the centre of a circle of radius ${OA}. How many tangents?`, hint: 'Compare with the radius.', answer: 'None.', rationale: `9 is less than ${OA}, so the point is interior and every line through it is a secant.` },
    { id: 's103a.g2', prompt: `A point is at distance ${OP} from the centre of a circle of radius ${OA}. How many tangents?`, hint: 'Which of the three cases?', answer: 'Two.', rationale: `${OP} exceeds ${OA}, so the point is exterior, and exactly two tangents can be drawn from it.` },
    { id: 's103a.g3', prompt: 'Why does a point on the circle admit exactly one tangent?', hint: 'What does the previous theorem fix?', answer: 'Because the tangent there must be perpendicular to the radius, and only one line through the point is.', rationale: 'The theorem fixes the direction, and a point and a direction determine a single line.' },
  ],
  independentPractice: [
    { id: 's103a.i1', prompt: 'State the three cases and their tangent counts.', answer: 'Interior 0, on the circle 1, exterior 2.', rationale: 'The count is determined by position, which is itself determined by distance from the centre against the radius.' },
    { id: 's103a.i2', prompt: 'Explain why no tangent exists from an interior point, without saying "it is impossible".', answer: 'Every line through it meets the circle twice, so every such line is a secant.', rationale: 'The point lies inside, so any line through it leaves the circle on both sides and shares two points with it.' },
    { id: 's103a.i3', prompt: `The centre O itself is a point. How many tangents pass through it, for a circle of radius ${OA}?`, answer: 'None.', rationale: 'The centre is at distance 0, which is less than the radius, so it is an interior point and every line through it is a secant \u2014 in fact a diameter.' },
    { id: 's103a.i4', prompt: 'A drawing shows a point that looks just outside the circle, with no tangents drawn. What should you check?', answer: 'Its distance from the centre against the radius.', rationale: 'Looking just outside is not a classification. Only the distance comparison decides whether it admits two tangents, one, or none.' },
  ],
  misconceptionIds: [], interactivePractice: [],
  reasoningApplication: [
    {
      id: 's103a.td1',
      prompt: 'Why can no tangent be drawn from a point inside a circle? Give the reason, not the fact.',
      expectedReasoning:
        'Because of what a line through an interior point is forced to do. The point lies nearer to the centre than the radius, so the circle surrounds it; a line through it therefore has circle on both sides and must cross the boundary twice. Two shared points make the line a secant, and the tangent definition demands exactly one. Since the line was arbitrary, every line through the point is a secant and no tangent is left to be drawn. The impossibility is a consequence of the definition, not an observation that nobody has managed it.',
    },
    {
      id: 's103a.td2',
      prompt: 'The tangent count is said to follow from the point\u2019s position. Why does it matter that it is derived rather than listed?',
      expectedReasoning:
        'Because a listed count can disagree with the figure it accompanies and nothing would notice. If the three numbers are simply remembered against three words, a drawing showing an exterior point beside the claim "one tangent" is internally consistent as text. Deriving the count from the distance comparison makes that impossible: the position is a fact about the coordinates, and the count follows from it, so the two cannot drift apart. The same reasoning is why the position itself is defined by distance rather than by how the point looks.',
    },
  ],
  summary:
    `A point lies interior, on, or exterior to a circle according to whether its distance from the centre is less than, equal to, or greater than the radius \u2014 and the number of tangents through it follows: ${tangentCountFor(CIRCLE_O, POINT_INSIDE)}, ${tangentCountFor(CIRCLE_O, POINT_ON)}, ${tangentCountFor(CIRCLE_O, EXTERNAL_P)}. The interior case has a reason, not just an absence: every line through an interior point meets the circle twice and so is a secant. An EXTERNAL point is one outside the circle, the only case admitting two tangents.`,
  nextStep: 'Next you will prove that those two tangents from an external point are equal in length.',
  teacher: teacher(
    'Students classify a point by distance and derive the tangent count from that position.',
    ['The tangent definition', 'The tangent-radius theorem'],
    ['Nearer or further than the radius?', 'What must a line through an inside point do?', 'How many, and why?'],
    [
      'Press for the interior reason. Students say "you cannot" and stop; the argument is that every line through the point is a secant.',
      'Tie the on-circle case back to the previous theorem \u2014 it is what makes the tangent unique there.',
      'Use the distance comparison rather than the picture when classifying, so the habit survives a badly drawn figure.',
    ],
    ['Ask how many tangents pass through the centre.', 'Ask what decides the classification.'],
    ['Have the student write the distance and the radius side by side before naming the case.'],
    ['Ask how the two tangents from an exterior point behave as the point moves toward the circle.'],
  ),
  reviewStatus: 'authored_draft',
};

function pointName2(p: Pt): string { return `(${p.x}, ${p.y})`; }

export const C10_SECTION_10_3B: AuthoredSection = {
  contentArtifactId: 'ncert_jemh1_s10_3_equal_tangents_lesson',
  contentArtifactVersion: 1,
  source: source('10.3', 'Number of Tangents from a Point on a Circle', 147, 'ncert_jemh1_s10_3'),
  competencyCandidates: [], competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_jemh1_s10_3', 'ncert_jemh1_s10_2b'],
    mayAssume: ['The tangent-radius theorem', 'Two tangents exist from an external point', 'The RHS congruence criterion from Class IX'],
    mustNotIntroduce: [{ concept: 'Numerical applications', belongsToSection: 'ncert_jemh1_s10_3c' }],
  },
  learningGoal:
    'You will prove that the lengths of the two tangents drawn from an external point to a circle are equal.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: ['State the tangent-radius theorem.', 'State the RHS congruence criterion.', 'Say which sides correspond in two congruent triangles.'],
    ifNotReady: 'Revise the tangent-radius theorem and congruence from Class IX. This proof uses both as established tools.',
  },
  vocabulary: [
    { term: 'tangent segment', meaning: 'The segment from an external point to its point of contact \u2014 part of the tangent line, not the whole line.' },
    { term: 'congruent', meaning: 'Having the same shape and size, so corresponding sides and angles are equal.' },
    { term: 'RHS', meaning: 'The congruence criterion for right triangles: right angle, hypotenuse and one side.' },
  ],
  explanation: [
    'THEOREM. The lengths of the two tangents drawn from an external point to a circle are equal.',
    'First, what is being measured. A tangent is a LINE and has no length. The TANGENT SEGMENT is the part of it from the external point to the point of contact, and that is what the theorem compares. "The length of the tangent from P" always means that segment.',
    'The figure will look symmetric, and the two segments will look equal. That is not the proof. A picture can be drawn convincingly with segments differing by a little, and symmetry is something to be established rather than observed.',
    'GIVEN: a circle with centre O, an external point P, and the two tangents from P touching the circle at A and B.',
    'TO PROVE: PA = PB.',
    'The proof joins OA, OB and OP, making two triangles OAP and OBP, and shows they are congruent. Congruence itself is not new here \u2014 you established the criteria, RHS among them, in Class IX, and this proof uses RHS as an available tool.',
    'OA = OB, because both are radii of the same circle.',
    'Angle OAP = angle OBP = 90\u00b0, because OA is the radius to the point of contact A and PA lies along the tangent there, so by the tangent-radius theorem they are perpendicular \u2014 and the same argument applies at B. This is the step that makes the previous theorem indispensable; without it the triangles are not known to be right-angled and RHS is unavailable.',
    'OP is common to both triangles.',
    'So in the right triangles OAP and OBP, the right angles are at A and B, the hypotenuses OP are the same segment, and the sides OA and OB are equal. By RHS, triangle OAP is congruent to triangle OBP.',
    'The correspondence is O\u2194O, A\u2194B, P\u2194P, so the side PA corresponds to PB. Corresponding sides of congruent triangles are equal, so PA = PB, as required.',
    'The correspondence matters. Reading off a pair that do not correspond \u2014 PA with OB, say \u2014 would be citing congruence for a conclusion congruence does not give.',
  ],
  representations: ['A circle with centre O, external point P, tangents touching at A and B, and the radii OA, OB joined'],
  visuals: [], visualsById: {},
  workedExamples: [
    {
      id: 's103b.we1',
      prompt: 'Prove that the two tangent segments from an external point are equal.',
      steps: [
        { text: 'GIVEN: circle centre O, external point P, tangents from P touching at A and B. TO PROVE: PA = PB.', reasoning: 'Fixing the hypotheses first makes clear that equality is the target and so may not be used along the way.' },
        { text: 'Join OA, OB and OP.', reasoning: 'The construction creates the two triangles the argument will compare; nothing is assumed about them yet.' },
        { text: 'OA = OB, since both are radii of the same circle.', reasoning: 'Every radius of a circle has the same length, which is the defining property of the circle.' },
        { text: 'OA \u22a5 PA and OB \u22a5 PB, by the tangent-radius theorem applied at A and at B.', reasoning: 'OA is the radius to the point of contact A and PA lies along the tangent there, which is exactly that theorem\u2019s hypothesis; likewise at B.' },
        { text: 'So triangles OAP and OBP are right-angled at A and at B, with OP as the common hypotenuse.', reasoning: 'OP is literally the same segment in both triangles, so its equality needs no argument.' },
        { text: 'By RHS \u2014 right angle, equal hypotenuse OP, equal side OA = OB \u2014 triangle OAP is congruent to triangle OBP.', reasoning: 'All three RHS conditions have been separately established, so the criterion applies rather than being asserted.' },
        { text: 'Under the correspondence O\u2194O, A\u2194B, P\u2194P, side PA corresponds to PB, so PA = PB.', reasoning: 'Corresponding sides of congruent triangles are equal, and naming the correspondence is what makes PA and PB the right pair to compare.' },
      ],
      answer: 'PA = PB.',
    },
    {
      id: 's103b.we2',
      prompt: 'A student writes: "PA = PB because tangents from a point are equal." What is wrong?',
      steps: [
        { text: 'The reason given is the theorem being proved.', reasoning: 'Using a statement to justify itself establishes nothing, however true the statement turns out to be.' },
        { text: 'This is a circular argument.', reasoning: 'The premise already contains the conclusion, so the argument cannot add any support to it.' },
        { text: 'A valid proof must reach PA = PB from things already established.', reasoning: 'Here those are the radii being equal, the tangent-radius theorem, and the RHS criterion \u2014 none of which mentions equal tangents.' },
        { text: 'The congruence of triangles OAP and OBP is what supplies the equality.', reasoning: 'It yields PA = PB as corresponding sides, which is a conclusion drawn from the hypotheses rather than restated from them.' },
      ],
      answer: 'It is circular \u2014 the reason is the theorem itself.',
    },
    {
      id: 's103b.we3',
      prompt: 'Which earlier theorem is essential here, and what would the proof lose without it?',
      steps: [
        { text: 'The tangent-radius theorem is essential.', reasoning: 'It is what establishes the right angles at A and at B, which nothing else in the configuration provides.' },
        { text: 'Without it, triangles OAP and OBP are not known to be right-angled.', reasoning: 'They would be two triangles sharing a side with one more pair of sides equal, which is not enough.' },
        { text: 'RHS would then be unavailable, and no other criterion applies.', reasoning: 'Two sides and a non-included angle do not determine congruence in general, so the argument would stall exactly there.' },
        { text: 'This is why the lesson order is not arbitrary.', reasoning: 'The equal-tangents theorem genuinely depends on the perpendicularity theorem, so it cannot be proved before it.' },
      ],
      answer: 'The tangent-radius theorem \u2014 without it RHS cannot be used and the proof fails.',
    },
  ],
  guidedPractice: [
    { id: 's103b.g1', prompt: 'Which congruence criterion is used, and what are its three conditions here?', hint: 'Right triangles.', answer: 'RHS: right angles at A and B, common hypotenuse OP, equal sides OA = OB.', rationale: 'Each condition is established separately before the criterion is invoked.' },
    { id: 's103b.g2', prompt: 'Why is OP equal in both triangles?', hint: 'Look at the figure.', answer: 'Because it is the same segment.', rationale: 'OP belongs to both triangles, so no argument for its equality is needed \u2014 it is common, not merely equal.' },
    { id: 's103b.g3', prompt: 'Under the congruence, which side corresponds to PA?', hint: 'Follow the vertex correspondence.', answer: 'PB.', rationale: 'The correspondence is O\u2194O, A\u2194B, P\u2194P, so the side from P to A maps to the side from P to B.' },
  ],
  independentPractice: [
    { id: 's103b.i1', prompt: 'Does the theorem say the two tangent LINES are equal?', answer: 'No \u2014 it is about the tangent segments.', rationale: 'A line has no length. The theorem compares the segments from the external point to the two points of contact.' },
    { id: 's103b.i2', prompt: 'A proof cites "PA = OB as corresponding sides". What is wrong?', answer: 'They do not correspond.', rationale: 'Under O\u2194O, A\u2194B, P\u2194P the side PA corresponds to PB, not to OB. Citing a non-corresponding pair proves nothing about them.' },
    { id: 's103b.i3', prompt: 'If PA = PB for two lines through P meeting a circle, does that prove both are tangents?', answer: 'No.', rationale: 'Two secants through P can cut equal segments to the near intersection points without either being tangent. The theorem runs from tangency to equality, not back.' },
    { id: 's103b.i4', prompt: 'Why is the symmetric appearance of the figure not a proof?', answer: 'Because symmetry is what has to be established.', rationale: 'A figure can be drawn with the two segments differing slightly and still look symmetric. The equality follows from congruence, not from the drawing.' },
  ],
  misconceptionIds: [], interactivePractice: [],
  reasoningApplication: [
    {
      id: 's103b.td1',
      prompt: 'Why does the visual symmetry of the figure not prove the two tangent segments equal?',
      expectedReasoning:
        'Because the figure is drawn from the configuration we already believe, so it can only show what was put into it. A drawing accurate to a fraction of a millimetre cannot distinguish two segments differing by less than that, and a slightly inaccurate drawing would look equally symmetric while being unequal. More importantly, symmetry about OP is itself a claim needing justification \u2014 it is close to the theorem rather than independent of it. The congruence argument supplies what the picture cannot: equality derived from the radii, the right angles and RHS, none of which depends on how anything was drawn.',
    },
    {
      id: 's103b.td2',
      prompt: 'If PA = PB, does that alone prove both PA and PB are tangents? What does this tell you about the direction of the theorem?',
      expectedReasoning:
        'No. Equal lengths from P to two points of the circle can occur without tangency \u2014 two secants through P can meet the circle at points equidistant from P, and the chord endpoints nearer P would satisfy PA = PB with neither line touching the circle once. So the equality is a consequence of tangency, not a test for it. The theorem runs one way: tangency gives equality. Reading it backwards would be assuming a converse that has not been proved and is in fact false as stated.',
    },
  ],
  summary:
    `THEOREM: the two tangent SEGMENTS from an external point are equal. The proof joins OA, OB and OP. OA = OB as radii; the angles at A and B are right angles BY THE TANGENT-RADIUS THEOREM, which is what makes the triangles right-angled; OP is common. By RHS, \u0394OAP \u2245 \u0394OBP, and under the correspondence O\u2194O, A\u2194B, P\u2194P the side PA corresponds to PB, so PA = PB. The symmetry of the figure proves nothing, and the theorem does not run backwards.`,
  nextStep: 'Next you will apply both theorems to find unknown lengths and angles.',
  teacher: teacher(
    'Students prove the equal-tangents theorem by RHS congruence, citing the correspondence.',
    ['The tangent-radius theorem', 'RHS congruence (Class IX)'],
    ['Where do the right angles come from?', 'Which sides correspond?', 'Is that a reason, or the thing we are proving?'],
    [
      'The dependence on the previous theorem is the point of the lesson. Ask what would be left without it; the answer is two triangles RHS cannot touch.',
      'Congruence itself is not new \u2014 Class IX established RHS. Use it as a tool rather than re-teaching it.',
      'Write the correspondence out. Students who skip it cite PA = OB often enough to be worth pre-empting.',
    ],
    ['Ask which theorem supplies the right angles.', 'Ask what corresponds to PA.'],
    ['Have the student list the three RHS conditions with its justification beside each before writing the congruence.'],
    ['Ask whether the converse holds, and why not.'],
  ),
  reviewStatus: 'authored_draft',
};

export const C10_SECTION_10_3C: AuthoredSection = {
  contentArtifactId: 'ncert_jemh1_s10_3_applications_lesson',
  contentArtifactVersion: 1,
  source: source('10.3', 'Number of Tangents from a Point on a Circle', 147, 'ncert_jemh1_s10_3'),
  competencyCandidates: [], competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_jemh1_s10_3b'],
    mayAssume: ['Both tangent theorems, now proved', 'The Pythagorean theorem', 'Angle sum of a triangle and of a quadrilateral'],
    mustNotIntroduce: [{ concept: 'Reproving either tangent theorem', belongsToSection: 'already proved' }],
  },
  learningGoal:
    'You will apply the two tangent theorems to find unknown lengths and angles, naming which theorem each step uses.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: ['State both tangent theorems.', 'Use the Pythagorean theorem in a right triangle.', 'Identify the hypotenuse.'],
    ifNotReady: 'Revise the two theorems. They are used here, not reproved.',
  },
  vocabulary: [
    { term: 'hypotenuse', meaning: 'The side opposite the right angle in a right triangle.' },
    { term: 'length of the tangent', meaning: 'The length of the tangent segment from an external point to its point of contact.' },
  ],
  explanation: [
    'Both theorems are now proved, so from here they are used. An application names which theorem it is applying and checks that its hypotheses hold; it does not repeat the proof.',
    'The first theorem turns a tangent into a right angle. Whenever a radius runs to a point of contact, the angle between it and the tangent there is 90\u00b0 \u2014 which usually means a right triangle has appeared and the Pythagorean theorem is available.',
    `Take the circle of radius ${OA} with centre O, an external point P at distance ${OP}, and the tangent touching at A. OA is the radius to the point of contact and PA lies along the tangent, so by the tangent-radius theorem angle OAP is 90\u00b0. Triangle OAP is right-angled at A with hypotenuse OP.`,
    `Then PA\u00b2 = OP\u00b2 \u2212 OA\u00b2 = ${OP}\u00b2 \u2212 ${OA}\u00b2 = ${OP * OP} \u2212 ${OA * OA} = ${tangentSegmentLengthSq(CIRCLE_O, EXTERNAL_P)}, so PA = ${PA}.`,
    'That calculation is worth recognising when it recurs, but it is the Pythagorean theorem applied to a triangle the first theorem produced \u2014 not a separate formula for tangent length. Remembering it as a formula detached from that right angle is how students end up applying it where no tangent exists.',
    `The second theorem gives equal segments. From the same external point the other tangent touches at B, and PB = PA = ${PA} \u2014 by the equal-tangents theorem, not by measuring the figure.`,
    'For angles, the two radii and the two tangent segments form a quadrilateral OAPB whose angles at A and B are right angles. Its four angles total 360\u00b0, so the angle at the centre and the angle at P add to 180\u00b0. That relationship solves most angle questions in this chapter.',
    'The habit to build: say which theorem applies and why its hypotheses hold, then do the arithmetic. "Since it is a tangent, the angle is 90\u00b0" skips the reason; "OA is the radius to the point of contact A and PA lies along the tangent there, so by the tangent-radius theorem OA \u22a5 PA" does not.',
  ],
  representations: ['The quadrilateral OAPB with right angles at A and B, and the right triangle OAP'],
  visuals: [], visualsById: {},
  workedExamples: [
    {
      id: 's103c.we1',
      prompt: `A tangent from an external point P touches a circle of radius ${OA} at A, and OP = ${OP}. Find PA.`,
      steps: [
        { text: 'OA is the radius drawn to the point of contact A, and PA lies along the tangent at A.', reasoning: 'Checking the hypotheses is what licenses the theorem; naming them keeps the step from being an assertion.' },
        { text: 'So by the tangent-radius theorem, OA \u22a5 PA, and triangle OAP is right-angled at A.', reasoning: 'The theorem is applied here rather than reproved, since it was established in its own lesson.' },
        { text: 'OP is opposite the right angle, so it is the hypotenuse.', reasoning: 'Identifying the hypotenuse correctly decides which term is subtracted from which in the next step.' },
        { text: `By the Pythagorean theorem, PA\u00b2 = OP\u00b2 \u2212 OA\u00b2 = ${OP * OP} \u2212 ${OA * OA} = ${tangentSegmentLengthSq(CIRCLE_O, EXTERNAL_P)}.`, reasoning: 'The right angle produced by the first theorem is exactly what makes this available.' },
        { text: `So PA = ${PA}.`, reasoning: `A positive length shorter than the hypotenuse ${OP}, as a leg must be.` },
      ],
      answer: `PA = ${PA}.`,
    },
    {
      id: 's103c.we2',
      prompt: 'The other tangent from P touches the circle at B. Find PB, and say what justifies it.',
      steps: [
        { text: 'P is external, so exactly two tangents can be drawn from it, touching at A and B.', reasoning: 'The count follows from P lying outside the circle, which the distances already established.' },
        { text: 'PA and PB are the two tangent segments from the same external point.', reasoning: 'This is the hypothesis of the equal-tangents theorem, so the theorem applies.' },
        { text: `By that theorem, PB = PA = ${PA}.`, reasoning: 'The equality comes from the proved congruence, not from the figure looking symmetric.' },
        { text: 'No second Pythagorean calculation is needed.', reasoning: 'It would give the same answer, since OB = OA and OP is shared \u2014 which is in effect the congruence the theorem already established.' },
      ],
      answer: `PB = ${PA}, by the equal-tangents theorem.`,
    },
    {
      id: 's103c.we3',
      prompt: 'Two tangents from P touch a circle centred O at A and B, and angle APB = 70\u00b0. Find angle AOB.',
      steps: [
        { text: 'OAPB is a quadrilateral with vertices O, A, P and B.', reasoning: 'The two radii and the two tangent segments close up into a four-sided figure, which is what makes the angle sum usable.' },
        { text: 'Angles OAP and OBP are each 90\u00b0, by the tangent-radius theorem at A and at B.', reasoning: 'OA and OB are radii to the points of contact and PA, PB lie along the tangents there, so the hypotheses hold at both.' },
        { text: 'The angles of a quadrilateral total 360\u00b0, so angle AOB + 70\u00b0 + 90\u00b0 + 90\u00b0 = 360\u00b0.', reasoning: 'All four angles are now known or named, so the sum is a single equation in the unknown.' },
        { text: 'So angle AOB = 360\u00b0 \u2212 250\u00b0 = 110\u00b0.', reasoning: 'The centre angle and the angle at P add to 180\u00b0, which is the relationship this configuration always gives.' },
      ],
      answer: 'Angle AOB = 110\u00b0.',
    },
  ],
  guidedPractice: [
    { id: 's103c.g1', prompt: 'A tangent from P touches a circle of radius 8 at A, with OP = 17. Find PA.', hint: 'Which theorem gives the right angle?', answer: '15.', rationale: 'By the tangent-radius theorem angle OAP is 90\u00b0, so PA\u00b2 = 289 \u2212 64 = 225 and PA = 15.' },
    { id: 's103c.g2', prompt: 'Two tangents from P touch a circle at A and B, and PA = 12. What is PB?', hint: 'Which theorem applies?', answer: '12.', rationale: 'By the equal-tangents theorem the two tangent segments from an external point are equal, so PB = PA = 12.' },
    { id: 's103c.g3', prompt: 'Two tangents from P meet at 60\u00b0. What is the angle at the centre between the radii to the contact points?', hint: 'Use the quadrilateral.', answer: '120\u00b0.', rationale: 'The two right angles account for 180\u00b0, so the remaining two angles total 180\u00b0 and the centre angle is 180\u00b0 \u2212 60\u00b0 = 120\u00b0.' },
  ],
  independentPractice: [
    { id: 's103c.i1', prompt: 'A tangent from P touches a circle of radius 5 at A, with OP = 13. Find PA.', answer: '12.', rationale: 'The tangent-radius theorem gives a right angle at A, so PA\u00b2 = 169 \u2212 25 = 144 and PA = 12.' },
    { id: 's103c.i2', prompt: 'Why is PA\u00b2 = OP\u00b2 \u2212 OA\u00b2 rather than OP\u00b2 + OA\u00b2?', answer: 'Because OP is the hypotenuse.', rationale: 'The right angle is at A, so the side opposite it is OP, and the legs OA and PA satisfy OA\u00b2 + PA\u00b2 = OP\u00b2.' },
    { id: 's103c.i3', prompt: 'A student writes "since it is a tangent, the angle is 90\u00b0". Improve the justification.', answer: 'Name the radius, the point of contact and the theorem.', rationale: '"OA is the radius to the point of contact A and PA lies along the tangent there, so by the tangent-radius theorem OA \u22a5 PA" states the hypotheses that make the theorem apply.' },
    { id: 's103c.i4', prompt: 'Two tangents from P meet at 90\u00b0 on a circle of radius 6. What is OP?', answer: `${Math.round(Math.sqrt(72) * 100) / 100} \u2014 that is 6\u221a2.`, rationale: 'The centre angle is also 90\u00b0, so OAPB is a square of side 6 and OP is its diagonal, 6\u221a2.' },
    { id: 's103c.i5', prompt: 'Should an application repeat the proof of the theorem it uses?', answer: 'No.', rationale: 'The theorem is established. An application states which theorem applies and why its hypotheses hold, then uses the conclusion.' },
  ],
  misconceptionIds: [], interactivePractice: [],
  reasoningApplication: [
    {
      id: 's103c.td1',
      prompt: 'Why should PA\u00b2 = OP\u00b2 \u2212 OA\u00b2 be seen as Pythagoras applied to a triangle rather than as a tangent-length formula?',
      expectedReasoning:
        'Because the subtraction is only valid when there is a right angle at the point of contact, and that right angle comes from the tangent-radius theorem. Remembered as a standalone formula it detaches from its condition, and a student will reach for it whenever a point, a circle and a radius appear \u2014 including where the line is a secant and no right angle exists. Seeing it as Pythagoras in triangle OAP keeps the condition attached: find the right angle first, identify the hypotenuse, then subtract. The formula is the consequence, not the tool.',
    },
    {
      id: 's103c.td2',
      prompt: 'In this configuration the angle at the centre and the angle at the external point always add to 180\u00b0. Why?',
      expectedReasoning:
        'Because OAPB is a quadrilateral whose angles at A and at B are right angles, by the tangent-radius theorem applied at each point of contact. The four angles of any quadrilateral total 360\u00b0, and two of them are 90\u00b0 each, accounting for 180\u00b0. The remaining two \u2014 the angle AOB at the centre and the angle APB at the external point \u2014 must therefore total the other 180\u00b0. The relationship holds for every external point, since the two right angles are guaranteed by the theorem rather than by the particular figure.',
    },
  ],
  summary:
    `Applications use both theorems and reprove neither. The tangent-radius theorem turns a point of contact into a right angle, making triangle OAP right-angled with hypotenuse OP, so PA\u00b2 = OP\u00b2 \u2212 OA\u00b2 \u2014 Pythagoras applied to that triangle, not a formula to remember loose. The equal-tangents theorem gives PB = PA directly. In quadrilateral OAPB the two right angles account for 180\u00b0, so the centre angle and the angle at P always add to 180\u00b0. Each step names its theorem and why the hypotheses hold.`,
  nextStep: 'The chapter summary recapitulates the tangent definition and the two proved theorems.',
  teacher: teacher(
    'Students apply both tangent theorems, naming the theorem and checking its hypotheses before computing.',
    ['Both tangent theorems', 'Pythagoras', 'Angle sums'],
    ['Which theorem, and why does it apply?', 'Where is the right angle?', 'Which side is the hypotenuse?'],
    [
      'Insist on the named justification. "Since it is a tangent" is the habit to break, and it breaks easily if asked for every time.',
      'Do not let the tangent-length expression become a remembered formula; keep it tied to the right triangle.',
      'The quadrilateral relationship covers nearly every angle question here and is worth deriving once in class.',
    ],
    ['Ask which theorem gives the right angle.', 'Ask why the subtraction goes that way round.'],
    ['Have the student mark the right angle and name the theorem before writing any equation.'],
    ['Ask what happens to OP as the angle at P approaches 180\u00b0.'],
  ),
  reviewStatus: 'authored_draft',
};

export const CLASS10_TANGENT_SECTIONS: AuthoredSection[] = [
  C10_SECTION_10_2A, C10_SECTION_10_2B, C10_SECTION_10_3A, C10_SECTION_10_3B, C10_SECTION_10_3C,
];
