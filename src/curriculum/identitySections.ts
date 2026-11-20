// ===========================================================================
// v0.84.0-c10.15 checkpoint 69 — THE LAST THREE CLASS 10 UNITS.
//
// 8.3b: the ratios at 0 and 90 degrees. The crosswalk is explicit that these
// are "motivated, not derived", by a limiting argument. No degenerate
// triangle is drawn, and `rightTriangleRoles` stays acute-only.
//
// 8.4a: PROVE. The Pythagorean identity is proved from a genuine acute right
// triangle, and the secant and cosecant identities are DERIVED from it by
// division, with the denominator condition stated each time.
//
// 8.4b: APPLY. Simple identities proved by algebra, not by checking angles.
//
// Source: NCERT Mathematics, Textbook for Class X (Reprint 2026-27), §8.3
// (folio 121) and §8.4 (folio 128). CBSE constraint: simple identities only.
// ===========================================================================

import type { AuthoredSection } from './authoredSection';
import {
  RATIO_NAMES, justificationAt, ratioAt, standardAngleTable, writtenOf,
} from './specialAngles';

export const IDENTITY_CHAPTER_ID = 'ncert_jemh1_ch08';

const BOOK = 'Mathematics, Textbook for Class X (Reprint 2026-27)';
const SRC = 'https://ncert.nic.in/textbook/pdf/jemh1dd.zip';
const INSPECTED = '2026-10-16';

const source = (sectionNumber: string, exactTitle: string, startPage: number, officialSectionId: string) => ({
  officialChapterId: IDENTITY_CHAPTER_ID, officialSectionId, sectionNumber, exactTitle,
  startPage, textbook: BOOK, sourceReference: SRC, inspectionDate: INSPECTED,
});

const W = (d: 0 | 30 | 45 | 60 | 90, n: typeof RATIO_NAMES[number]) => writtenOf(ratioAt(d, n));

/** The rendered table, built from the canonical data rather than typed. */
export function renderedStandardTable(): string[] {
  return standardAngleTable().map(
    (row) => `${row.degrees}\u00b0: ` + RATIO_NAMES.map((n) => `${n} ${writtenOf(row.values[n])}`).join(', ')
  );
}

const teacher = (objective: string, prereq: string[], lang: string[], notes: string[], checks: string[], support: string[], ext: string[]) => ({
  objective, prerequisiteKnowledge: prereq, modelLanguage: lang, teachingNotes: notes,
  quickChecks: checks, supportForStrugglingLearners: support, extension: ext, materialsNeeded: [],
});

export const C10_SECTION_8_3B: AuthoredSection = {
  contentArtifactId: 'ncert_jemh1_s8_3_boundary_angles_lesson',
  contentArtifactVersion: 1,
  source: source('8.3', 'Trigonometric Ratios of Some Specific Angles', 121, 'ncert_jemh1_s8_3'),
  competencyCandidates: [], competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_jemh1_s8_3'],
    mayAssume: ['The six ratios defined from a right triangle', 'The ratios at 30, 45 and 60 degrees', 'Reciprocal and quotient relations between the ratios'],
    mustNotIntroduce: [{ concept: 'The Pythagorean identity', belongsToSection: 'ncert_jemh1_s8_4' }],
  },
  learningGoal:
    'You will say what the ratios are at 0\u00b0 and 90\u00b0, understand why those values are motivated rather than derived from a triangle, and identify which ratios are NOT DEFINED there.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: ['Name the six ratios and how each is formed from the sides.', 'State sin, cos and tan at 30\u00b0, 45\u00b0 and 60\u00b0.', 'Say what division by zero means.'],
    ifNotReady: 'Revise the earlier sections of this chapter. Everything here rests on the six ratios and on what happens when a denominator is zero.',
  },
  vocabulary: [
    { term: 'not defined', meaning: 'Having no value at all \u2014 what a quotient with zero denominator is. Not a number, large or otherwise.' },
    { term: 'limiting argument', meaning: 'Reasoning about what a quantity approaches as the angle is made smaller or larger, without any triangle at the end point itself.' },
    { term: 'boundary angle', meaning: '0\u00b0 or 90\u00b0 \u2014 the two ends of the range of acute angles, where no right triangle exists.' },
  ],
  explanation: [
    'Every ratio so far has been a ratio of sides of an actual right triangle with an acute angle A. At 0\u00b0 and 90\u00b0 there is no such triangle, so the question has to be approached differently.',
    'Why there is none: a triangle with a 0\u00b0 angle has collapsed onto a line, and a right triangle cannot have a second right angle. So the values at the two ends are MOTIVATED by watching what happens as the angle moves toward them \u2014 not derived from a figure drawn at them.',
    `Toward 0\u00b0. ${justificationAt(0)}`,
    `Toward 90\u00b0. ${justificationAt(90)}`,
    `So the base values are sin 0\u00b0 = ${W(0, 'sin')}, cos 0\u00b0 = ${W(0, 'cos')}, sin 90\u00b0 = ${W(90, 'sin')} and cos 90\u00b0 = ${W(90, 'cos')}.`,
    'The other four ratios follow from these by the relations you already have: tan = sin/cos, cot = cos/sin, sec = 1/cos and cosec = 1/sin. And that is where something new happens.',
    `At 0\u00b0, sin is ${W(0, 'sin')}. Both cot and cosec divide by sin, so both have a zero denominator: cot 0\u00b0 and cosec 0\u00b0 are NOT DEFINED. Meanwhile tan 0\u00b0 = ${W(0, 'tan')} and sec 0\u00b0 = ${W(0, 'sec')}, both perfectly ordinary.`,
    `At 90\u00b0, cos is ${W(90, 'cos')}. Both tan and sec divide by cos, so tan 90\u00b0 and sec 90\u00b0 are NOT DEFINED, while cot 90\u00b0 = ${W(90, 'cot')} and cosec 90\u00b0 = ${W(90, 'cosec')}.`,
    'Be precise about what "not defined" means. A quotient with a zero denominator has NO value. It is not infinity, not a very large number, and certainly not zero. Asking what 1/0 is, is asking what number multiplied by 0 gives 1 \u2014 and no number does. The question has no answer, which is a different thing from having a large one.',
    'Notice also that a ratio can be fine while its reciprocal is not. sin 90\u00b0 = 1 is a perfectly good value, and cosec 90\u00b0 = 1 follows; but cos 90\u00b0 = 0 is also a perfectly good value, and sec 90\u00b0 does not exist. Being zero is a value; having a zero denominator is not.',
    'With the two ends added, the standard table now covers 0\u00b0, 30\u00b0, 45\u00b0, 60\u00b0 and 90\u00b0, and the four gaps in it are exactly the four quotients whose denominator vanishes.',
  ],
  representations: ['The five-angle table with the four undefined entries marked as not defined rather than left blank'],
  visuals: [], visualsById: {},
  workedExamples: [
    {
      id: 's83b.we1',
      prompt: 'Why can the ratios at 0\u00b0 not be read off a right triangle in the usual way?',
      steps: [
        { text: 'The six ratios are defined as ratios of the sides of a right triangle containing the acute angle A.', reasoning: 'Every value so far has come from measuring an actual figure, so the figure has to exist for the definition to apply.' },
        { text: 'As A is made smaller, the side opposite A shortens.', reasoning: 'The opposite side is what the angle opens onto, so closing the angle closes that side.' },
        { text: 'At A = 0\u00b0 the opposite side has no length and the triangle has collapsed onto a line.', reasoning: 'With no height there is no triangle, so there are no three sides to form ratios from.' },
        { text: 'So the values at 0\u00b0 are motivated by what the ratios approach, not derived from a figure at 0\u00b0.', reasoning: 'The limiting argument looks at triangles near 0\u00b0, each of which genuinely exists, rather than at one that does not.' },
      ],
      answer: 'Because at 0\u00b0 the triangle has collapsed and there are no sides to take ratios of.',
    },
    {
      id: 's83b.we2',
      prompt: 'Find all six ratios at 90\u00b0, saying which are not defined and why.',
      steps: [
        { text: `The base values are sin 90\u00b0 = ${W(90, 'sin')} and cos 90\u00b0 = ${W(90, 'cos')}, motivated by the limiting argument.`, reasoning: 'As the angle grows toward 90\u00b0 the opposite side draws level with the hypotenuse while the adjacent side vanishes.' },
        { text: `cosec 90\u00b0 = 1/sin 90\u00b0 = ${W(90, 'cosec')}, since the denominator is 1.`, reasoning: 'A non-zero denominator gives an ordinary value, so this reciprocal presents no difficulty.' },
        { text: `cot 90\u00b0 = cos 90\u00b0 / sin 90\u00b0 = ${W(90, 'cot')}, since the numerator is 0 and the denominator is not.`, reasoning: 'Zero divided by a non-zero number is zero \u2014 a value, and quite different from a zero denominator.' },
        { text: 'tan 90\u00b0 = sin 90\u00b0 / cos 90\u00b0 divides by 0, so it is NOT DEFINED.', reasoning: 'No number multiplied by 0 gives 1, so the quotient has no value at all.' },
        { text: 'sec 90\u00b0 = 1/cos 90\u00b0 divides by 0 as well, so it is also NOT DEFINED.', reasoning: 'The same zero denominator, reached by a different route, with the same consequence.' },
      ],
      answer: `sin ${W(90, 'sin')}, cos ${W(90, 'cos')}, cot ${W(90, 'cot')}, cosec ${W(90, 'cosec')}; tan and sec are not defined.`,
    },
    {
      id: 's83b.we3',
      prompt: 'A student writes tan 90\u00b0 = \u221e. What is wrong?',
      steps: [
        { text: 'tan 90\u00b0 is sin 90\u00b0 divided by cos 90\u00b0, which is 1 divided by 0.', reasoning: 'Identifying the quotient is the first step, since the issue is entirely about its denominator.' },
        { text: 'Asking for 1/0 is asking which number multiplied by 0 gives 1.', reasoning: 'Division is defined as the inverse of multiplication, so this is what the question actually means.' },
        { text: 'Every number multiplied by 0 gives 0, so no number answers it.', reasoning: 'The failure is total rather than a matter of the answer being too large to write down.' },
        { text: 'So tan 90\u00b0 is not defined. Infinity is not a number here and is not the answer.', reasoning: 'Writing \u221e suggests a value exists and is merely enormous, which misdescribes what has happened.' },
      ],
      answer: 'tan 90\u00b0 is not defined \u2014 it has no value, rather than a very large one.',
    },
  ],
  guidedPractice: [
    { id: 's83b.g1', prompt: 'Which two ratios are not defined at 0\u00b0, and why?', hint: 'Which ones divide by sin?', answer: 'cot 0\u00b0 and cosec 0\u00b0.', rationale: `sin 0\u00b0 = ${W(0, 'sin')}, and both cot and cosec have sin in the denominator, so both divide by zero.` },
    { id: 's83b.g2', prompt: `What is cot 90\u00b0?`, hint: 'Which is the numerator and which the denominator?', answer: `${W(90, 'cot')}.`, rationale: 'cot = cos/sin = 0/1 = 0. A zero numerator gives a value; it is a zero denominator that does not.' },
    { id: 's83b.g3', prompt: 'Is sec 0\u00b0 defined?', hint: 'What is cos 0\u00b0?', answer: `Yes, it is ${W(0, 'sec')}.`, rationale: `cos 0\u00b0 = ${W(0, 'cos')}, which is not zero, so 1/cos 0\u00b0 is an ordinary value.` },
  ],
  independentPractice: [
    { id: 's83b.i1', prompt: 'Complete the 0\u00b0 row: sin, cos, tan, cosec, sec, cot.', answer: `${RATIO_NAMES.map((n) => `${n} ${W(0, n)}`).join(', ')}.`, rationale: 'sin and cos come from the limiting argument; the other four follow by the quotient and reciprocal relations, two of which divide by zero.' },
    { id: 's83b.i2', prompt: 'Explain the difference between a ratio being zero and a ratio being not defined.', answer: 'Zero is a value; not defined means there is no value.', rationale: 'cot 90\u00b0 = 0 is an answer. tan 90\u00b0 is not defined, so there is nothing to write down at all.' },
    { id: 's83b.i3', prompt: 'Why can sin 90\u00b0 = 1 while sec 90\u00b0 is not defined?', answer: 'Because sec depends on cos, not sin.', rationale: 'sec 90\u00b0 = 1/cos 90\u00b0 and cos 90\u00b0 = 0. The two ratios are built from different sides, so one being fine says nothing about the other.' },
    { id: 's83b.i4', prompt: 'Is tan 0\u00b0 defined?', answer: `Yes, it is ${W(0, 'tan')}.`, rationale: `tan 0\u00b0 = sin 0\u00b0 / cos 0\u00b0 = 0/1 = 0. The denominator cos 0\u00b0 is 1, so nothing goes wrong.` },
    { id: 's83b.i5', prompt: 'Why is the value of sin 90\u00b0 described as motivated rather than derived?', answer: 'Because no right triangle has a 90\u00b0 acute angle.', rationale: 'The value comes from watching what sin approaches as the angle grows toward 90\u00b0, not from measuring a triangle at 90\u00b0, which does not exist.' },
  ],
  misconceptionIds: [], interactivePractice: [],
  reasoningApplication: [
    {
      id: 's83b.td1',
      prompt: 'Why is 1/0 not "a very large number"?',
      expectedReasoning:
        'Because division asks a precise question: a/b is the number which, multiplied by b, gives a. So 1/0 asks which number multiplied by 0 gives 1 \u2014 and every number multiplied by 0 gives 0, so nothing answers it. The question has no answer at all. Calling it very large comes from watching 1/x grow as x shrinks, but that describes what happens NEAR zero, not AT it, and the growth has no end to settle on. A number that is "large" is still a number you could in principle write; here there is nothing to write.',
    },
    {
      id: 's83b.td2',
      prompt: 'What exactly breaks if we try to use the ordinary side-ratio definition at 0\u00b0, and why is a limiting argument not the same as a proof?',
      expectedReasoning:
        'The definition needs a right triangle containing the acute angle, and at 0\u00b0 the triangle has collapsed onto a line \u2014 the opposite side has length 0 and there is nothing to measure. Trying to form the ratios anyway gives 0 divided by something, or worse, a form with no content. The limiting argument avoids that by looking only at triangles that genuinely exist, at angles near 0\u00b0, and asking what the ratios approach. That tells us which values to ADOPT at the boundary, which is a reasonable convention and makes the table consistent. But it is not a derivation from a figure at 0\u00b0, because no such figure exists, and the source says as much.',
    },
  ],
  summary:
    `At 0\u00b0 and 90\u00b0 there is no right triangle, so the values are MOTIVATED by a limiting argument rather than derived: sin 0\u00b0 = ${W(0, 'sin')}, cos 0\u00b0 = ${W(0, 'cos')}, sin 90\u00b0 = ${W(90, 'sin')}, cos 90\u00b0 = ${W(90, 'cos')}. The other four follow by the usual relations \u2014 and four of them divide by zero: cot 0\u00b0, cosec 0\u00b0, tan 90\u00b0 and sec 90\u00b0 are NOT DEFINED. Not defined means no value exists, not that the value is large: 1/0 asks what times 0 gives 1, and nothing does.`,
  nextStep: 'Next you will prove a relation that holds between sin and cos at every acute angle.',
  teacher: teacher(
    'Students state the boundary values, know they are motivated not derived, and distinguish zero from not defined.',
    ['The six ratios', 'The 30/45/60 values'],
    ['Is there a triangle at 0\u00b0?', 'Zero numerator, or zero denominator?', 'What would 1/0 have to mean?'],
    [
      'Do not draw a triangle at 0\u00b0 or 90\u00b0, even schematically. The whole point is that none exists, and a picture undermines it.',
      'The zero-versus-undefined distinction is the lesson. cot 90\u00b0 = 0 and tan 90\u00b0 undefined, side by side, is the sharpest way to make it.',
      '"Motivated, not derived" is the source\u2019s own position and worth saying to students in those words.',
    ],
    ['Ask which ratios are undefined at 0\u00b0 and why.', 'Ask whether cot 90\u00b0 is zero or undefined.'],
    ['Have the student write each ratio as a quotient and inspect the denominator before giving any value.'],
    ['Ask what happens to tan as the angle climbs from 60\u00b0 toward 90\u00b0.'],
  ),
  reviewStatus: 'authored_draft',
};

export const C10_SECTION_8_4A: AuthoredSection = {
  contentArtifactId: 'ncert_jemh1_s8_4_pythagorean_identity_lesson',
  contentArtifactVersion: 1,
  source: source('8.4', 'Trigonometric Identities', 128, 'ncert_jemh1_s8_4'),
  competencyCandidates: [], competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_jemh1_s8_2'],
    mayAssume: ['The six ratios from a right triangle', 'The Pythagorean theorem', 'Algebra with fractions'],
    mustNotIntroduce: [{ concept: 'Proving given identities', belongsToSection: 'ncert_jemh1_s8_4b' }],
  },
  learningGoal:
    'You will prove that sin\u00b2A + cos\u00b2A = 1 from a right triangle, and derive 1 + tan\u00b2A = sec\u00b2A and 1 + cot\u00b2A = cosec\u00b2A from it by division.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: ['Write sin A, cos A and tan A as ratios of sides.', 'State the Pythagorean theorem.', 'Divide an equation through by a quantity.'],
    ifNotReady: 'Revise the ratio definitions. The proof is the Pythagorean theorem rewritten in terms of them.',
  },
  vocabulary: [
    { term: 'identity', meaning: 'An equation true for EVERY value in its valid range, not just for particular values.' },
    { term: 'Pythagorean identity', meaning: 'sin\u00b2A + cos\u00b2A = 1, the identity that comes from the Pythagorean theorem.' },
    { term: 'reciprocal identity', meaning: 'A relation such as sec A = 1/cos A, holding wherever the denominator is non-zero.' },
  ],
  explanation: [
    'First, notation. sin\u00b2A means (sin A)\u00b2 \u2014 the ratio, squared. It does NOT mean sin(A\u00b2), which is something else entirely. The exponent is written on the name only to avoid writing brackets every time.',
    'Second, what an IDENTITY is. An equation such as sin A = 1/2 is true for particular angles only. An identity is true for EVERY angle in its valid range. Proving one is not solving for A; it is showing the two sides agree always.',
    'Now the theorem. For an acute angle A in a right triangle, sin\u00b2A + cos\u00b2A = 1.',
    'You already know the Pythagorean theorem, and this is not a new version of it. What is new is what happens when you divide that relation by the square of the hypotenuse: a statement about side lengths turns into a statement about ratios, and the ratios are exactly sin and cos.',
    'Take a right triangle with the right angle not at A. Write the side opposite A as o, the side adjacent to A as a, and the hypotenuse as h. By the Pythagorean theorem, o\u00b2 + a\u00b2 = h\u00b2.',
    'Divide both sides by h\u00b2. This is legitimate because h is the hypotenuse of a genuine triangle, so h > 0 and h\u00b2 \u2260 0. That gives o\u00b2/h\u00b2 + a\u00b2/h\u00b2 = 1.',
    'Now recognise the two terms. sin A = o/h, so o\u00b2/h\u00b2 = sin\u00b2A. And cos A = a/h, so a\u00b2/h\u00b2 = cos\u00b2A. Substituting gives sin\u00b2A + cos\u00b2A = 1, which is the identity.',
    'The proof uses an actual triangle, so it establishes the identity for ACUTE A. The source then checks separately that the boundary values from the last lesson satisfy it too: at 0\u00b0, 0\u00b2 + 1\u00b2 = 1, and at 90\u00b0, 1\u00b2 + 0\u00b2 = 1. That is a verification at the ends, not an extension of the triangle proof, and the two should not be confused.',
    'The other two identities are DERIVED from this one, not listed beside it.',
    'Divide sin\u00b2A + cos\u00b2A = 1 through by cos\u00b2A. The three terms become sin\u00b2A/cos\u00b2A + 1 = 1/cos\u00b2A, that is tan\u00b2A + 1 = sec\u00b2A. The division requires cos A \u2260 0, so this holds wherever cos A is not zero \u2014 which for acute A is everywhere, and at 90\u00b0 is precisely where sec is not defined anyway.',
    'Divide the same identity through by sin\u00b2A instead. The terms become 1 + cos\u00b2A/sin\u00b2A = 1/sin\u00b2A, that is 1 + cot\u00b2A = cosec\u00b2A. This one requires sin A \u2260 0, so it holds wherever sin A is not zero \u2014 excluding 0\u00b0, where cot and cosec are not defined.',
    'Each derivation divides by something that must not be zero, and saying which is part of the derivation rather than a footnote.',
  ],
  representations: ['A right triangle labelled with opposite, adjacent and hypotenuse, with the Pythagorean relation beside it'],
  visuals: [], visualsById: {},
  workedExamples: [
    {
      id: 's84a.we1',
      prompt: 'Prove that sin\u00b2A + cos\u00b2A = 1 for an acute angle A.',
      steps: [
        { text: 'GIVEN: a right triangle with acute angle A, side o opposite A, side a adjacent to A, and hypotenuse h. TO PROVE: sin\u00b2A + cos\u00b2A = 1.', reasoning: 'Stating the triangle and the target first makes clear that the identity is the conclusion rather than something available along the way.' },
        { text: 'By the Pythagorean theorem, o\u00b2 + a\u00b2 = h\u00b2.', reasoning: 'The theorem applies because the triangle is right-angled, and it relates exactly the three sides the ratios are built from.' },
        { text: 'Divide both sides of that equation by h\u00b2, which is non-zero because h is the hypotenuse of a genuine triangle and so h > 0.', reasoning: 'Naming what is divided by, and why it cannot be zero, is what makes the step valid rather than merely plausible.' },
        { text: 'This gives o\u00b2/h\u00b2 + a\u00b2/h\u00b2 = h\u00b2/h\u00b2 = 1.', reasoning: 'Every term is divided, not just the left side, and the right side becomes 1 exactly.' },
        { text: 'By definition sin A = o/h, so o\u00b2/h\u00b2 = (o/h)\u00b2 = sin\u00b2A; and cos A = a/h, so a\u00b2/h\u00b2 = cos\u00b2A.', reasoning: 'This is the step that turns a statement about lengths into one about ratios \u2014 the whole content of the proof.' },
        { text: 'Substituting: sin\u00b2A + cos\u00b2A = 1, for every acute angle A.', reasoning: 'Nothing in the argument depended on the particular triangle, so it holds for every acute A rather than for one example.' },
      ],
      answer: 'sin\u00b2A + cos\u00b2A = 1.',
    },
    {
      id: 's84a.we2',
      prompt: 'Derive 1 + tan\u00b2A = sec\u00b2A from the Pythagorean identity.',
      steps: [
        { text: 'Start from sin\u00b2A + cos\u00b2A = 1, now proved.', reasoning: 'The derivation uses an established result rather than assuming the identity it is about to produce.' },
        { text: 'Divide every term by cos\u00b2A, which requires cos A \u2260 0.', reasoning: 'The condition is part of the step: at an angle where cos A = 0 this division would be division by zero and the derivation would fail.' },
        { text: 'The first term becomes sin\u00b2A/cos\u00b2A = (sin A/cos A)\u00b2 = tan\u00b2A.', reasoning: 'tan A is defined as sin A over cos A, so the squared quotient is tan squared.' },
        { text: 'The second becomes cos\u00b2A/cos\u00b2A = 1, and the right side becomes 1/cos\u00b2A = sec\u00b2A.', reasoning: 'sec A is the reciprocal of cos A wherever cos A is non-zero, which is the same condition already imposed.' },
        { text: 'So tan\u00b2A + 1 = sec\u00b2A, that is 1 + tan\u00b2A = sec\u00b2A, wherever cos A \u2260 0.', reasoning: 'The range is stated with the result, since the identity has nothing to say where sec itself is not defined.' },
      ],
      answer: '1 + tan\u00b2A = sec\u00b2A, wherever cos A \u2260 0.',
    },
    {
      id: 's84a.we3',
      prompt: 'Derive 1 + cot\u00b2A = cosec\u00b2A, and state where it holds.',
      steps: [
        { text: 'Again start from sin\u00b2A + cos\u00b2A = 1.', reasoning: 'Both derived identities come from the same proved result, which is why they are consequences rather than separate facts.' },
        { text: 'Divide every term by sin\u00b2A, which requires sin A \u2260 0.', reasoning: 'The denominator has changed, so the condition changes with it \u2014 sin rather than cos must be non-zero this time.' },
        { text: 'The first term becomes sin\u00b2A/sin\u00b2A = 1, and the second becomes cos\u00b2A/sin\u00b2A = cot\u00b2A.', reasoning: 'cot A is cos A over sin A, so the squared quotient is cot squared.' },
        { text: 'The right side becomes 1/sin\u00b2A = cosec\u00b2A.', reasoning: 'cosec A is the reciprocal of sin A wherever sin A is non-zero, matching the condition just imposed.' },
        { text: 'So 1 + cot\u00b2A = cosec\u00b2A, wherever sin A \u2260 0 \u2014 which excludes 0\u00b0, where cot and cosec are not defined.', reasoning: 'The excluded angle is exactly the one where the previous lesson found these ratios undefined, so the two results agree.' },
      ],
      answer: '1 + cot\u00b2A = cosec\u00b2A, wherever sin A \u2260 0.',
    },
  ],
  guidedPractice: [
    { id: 's84a.g1', prompt: 'In the proof, why is dividing by h\u00b2 allowed?', hint: 'What is h?', answer: 'Because h is a hypotenuse, so h > 0 and h\u00b2 \u2260 0.', rationale: 'A genuine triangle has a positive hypotenuse, so the division is by a non-zero quantity.' },
    { id: 's84a.g2', prompt: 'What condition does the derivation of 1 + tan\u00b2A = sec\u00b2A require?', hint: 'What was divided by?', answer: 'cos A \u2260 0.', rationale: 'The step divides every term by cos\u00b2A, which is only valid when cos A is not zero.' },
    { id: 's84a.g3', prompt: 'What does sin\u00b2A mean?', hint: 'Where does the square go?', answer: '(sin A)\u00b2.', rationale: 'The ratio is computed first and then squared. sin(A\u00b2) would square the angle instead, which is a different quantity.' },
  ],
  independentPractice: [
    { id: 's84a.i1', prompt: 'Write out the three steps that turn o\u00b2 + a\u00b2 = h\u00b2 into sin\u00b2A + cos\u00b2A = 1.', answer: 'Divide by h\u00b2; recognise o\u00b2/h\u00b2 as sin\u00b2A and a\u00b2/h\u00b2 as cos\u00b2A; substitute.', rationale: 'The division is what converts lengths into ratios, and the recognition is what names them.' },
    { id: 's84a.i2', prompt: 'A proof says only "divide and the identity follows". What is missing?', answer: 'What is divided, by what, and why that is non-zero.', rationale: 'Without those the step cannot be checked, and the non-zero condition is exactly where such derivations go wrong.' },
    { id: 's84a.i3', prompt: 'Could you derive 1 + tan\u00b2A = sec\u00b2A by dividing by cos\u00b2A at A = 90\u00b0?', answer: 'No.', rationale: 'cos 90\u00b0 = 0, so that would be division by zero. It is also the angle at which sec is not defined, so there is nothing to prove there.' },
    { id: 's84a.i4', prompt: 'Does the triangle proof itself establish the identity at 90\u00b0?', answer: 'No \u2014 it establishes it for acute A.', rationale: 'The proof uses an actual right triangle, which does not exist at 90\u00b0. The boundary values are checked separately against the identity.' },
    { id: 's84a.i5', prompt: 'Why is an identity different from an equation such as sin A = 1/2?', answer: 'An identity holds for every angle in its range; an equation holds for particular ones.', rationale: 'Proving an identity shows the two sides always agree, rather than finding which values make them agree.' },
  ],
  misconceptionIds: [], interactivePractice: [],
  reasoningApplication: [
    {
      id: 's84a.td1',
      prompt: 'The Pythagorean theorem is old news. What exactly is new in the Pythagorean identity?',
      expectedReasoning:
        'The content is the same relation seen from a different place. o\u00b2 + a\u00b2 = h\u00b2 is a statement about three LENGTHS, and it changes if the triangle is scaled. Dividing through by h\u00b2 removes the scale: the terms become o\u00b2/h\u00b2 and a\u00b2/h\u00b2, which are sin\u00b2A and cos\u00b2A, and those depend only on the angle. So the new thing is that a relation about one particular triangle becomes a relation about the ANGLE, true of every triangle containing it. That is also why the identity is useful \u2014 it connects sin and cos without any sides being mentioned.',
    },
    {
      id: 's84a.td2',
      prompt: 'Both derived identities come from dividing the same equation. Why do they carry different conditions?',
      expectedReasoning:
        'Because they divide by different things. Dividing by cos\u00b2A needs cos A \u2260 0, and dividing by sin\u00b2A needs sin A \u2260 0, so each derivation excludes the angle where its own denominator vanishes. The conditions turn out to match the ratios involved: the secant identity mentions sec and tan, which are undefined exactly where cos A = 0, and the cosecant identity mentions cosec and cot, undefined exactly where sin A = 0. So neither condition excludes anything the identity could have said anyway \u2014 but the condition still has to be stated, because the division is what the derivation rests on.',
    },
  ],
  summary:
    `sin\u00b2A means (sin A)\u00b2, and an IDENTITY holds for every angle in its range rather than for particular ones. PROOF: from o\u00b2 + a\u00b2 = h\u00b2, divide by h\u00b2 \u2014 valid since h > 0 \u2014 to get o\u00b2/h\u00b2 + a\u00b2/h\u00b2 = 1, then recognise these as sin\u00b2A and cos\u00b2A. Dividing the identity by cos\u00b2A gives 1 + tan\u00b2A = sec\u00b2A where cos A \u2260 0; dividing by sin\u00b2A gives 1 + cot\u00b2A = cosec\u00b2A where sin A \u2260 0. The triangle proof covers ACUTE A; the boundary values are verified separately.`,
  nextStep: 'Next you will use these three identities to prove others.',
  teacher: teacher(
    'Students prove the Pythagorean identity from the triangle and derive both consequences with their conditions.',
    ['The six ratios', 'Pythagoras'],
    ['Divide by what, and why is it non-zero?', 'Is that a length or a ratio?', 'For every angle, or for some?'],
    [
      'The division by h\u00b2 is the whole proof. Ask what it achieves \u2014 removing the scale \u2014 rather than treating it as a manipulation.',
      'Derive both consequences rather than listing them. The conditions appear naturally in the derivation and are forgotten if the identities are given ready-made.',
      'Keep the acute-triangle proof separate from the boundary check. Students will otherwise think the triangle argument covers 90\u00b0.',
    ],
    ['Ask what sin\u00b2A means.', 'Ask which condition the secant identity needs.'],
    ['Have the student write the Pythagorean relation and the division line separately before substituting any ratio.'],
    ['Ask what dividing by o\u00b2 instead would give.'],
  ),
  reviewStatus: 'authored_draft',
};

export const C10_SECTION_8_4B: AuthoredSection = {
  contentArtifactId: 'ncert_jemh1_s8_4_proving_identities_lesson',
  contentArtifactVersion: 1,
  source: source('8.4', 'Trigonometric Identities', 128, 'ncert_jemh1_s8_4'),
  competencyCandidates: [], competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_jemh1_s8_4'],
    mayAssume: ['The three identities, now proved', 'The quotient and reciprocal relations', 'Algebra with fractions and factorising'],
    mustNotIntroduce: [{ concept: 'Compound-angle and double-angle formulas', belongsToSection: 'outside_current_scope' }],
  },
  learningGoal:
    'You will prove simple trigonometric identities by transforming one side into the other, using the established identities rather than checking particular angles.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: ['State the three identities from the previous lesson.', 'Write tan, cot, sec and cosec in terms of sin and cos.', 'Factorise a difference of two squares.'],
    ifNotReady: 'Revise the previous lesson. Everything here is those three identities applied with ordinary algebra.',
  },
  vocabulary: [
    { term: 'left-hand side', meaning: 'The expression on the left of the identity being proved, usually abbreviated LHS.' },
    { term: 'right-hand side', meaning: 'The expression on the right, abbreviated RHS.' },
  ],
  explanation: [
    'With the three identities proved, the work now is to use them. A proof here is a chain of equalities taking one side of the statement to the other.',
    'The method: start from one side \u2014 usually the more complicated \u2014 and transform it step by step until it becomes the other. Each step must be an equality you can justify, either by ordinary algebra or by one of the established identities.',
    'Write the chain in one direction. Working on both sides at once until they happen to look alike is harder to check, and it is easy to perform an operation on one side that is not reversible. Taking LHS to RHS leaves a chain anyone can follow.',
    'A reliable first move, when nothing else suggests itself: rewrite everything in terms of sin and cos. tan A = sin A/cos A, cot A = cos A/sin A, sec A = 1/cos A and cosec A = 1/sin A. Expressions often simplify once they are in two ingredients rather than six.',
    'Two patterns are worth recognising, because they turn up repeatedly. sec\u00b2A \u2212 tan\u00b2A = 1 and cosec\u00b2A \u2212 cot\u00b2A = 1 are just the two derived identities rearranged. And a difference of two squares factorises as usual: sec\u00b2A \u2212 tan\u00b2A = (sec A + tan A)(sec A \u2212 tan A).',
    'Now a warning about algebra, because trigonometric notation makes one error easier to commit. You cannot cancel a term across an addition. In (sin A + cos A)/sin A, the sin A in the denominator does not cancel the sin A in the numerator: the fraction is (sin A/sin A) + (cos A/sin A) = 1 + cot A. Cancelling only one term of a sum changes the value.',
    'Keep the ranges in mind. These proofs involve tan, sec, cot and cosec, which are not defined at the boundary angles of the last lesson. At Class 10 level the identities are worked with for acute angles, where all six ratios are defined, and that is where these proofs live.',
    'Finally, what counts as a proof. Checking an identity at 30\u00b0, 45\u00b0 and 60\u00b0 and finding it true each time is evidence that it is probably right \u2014 and a good way to catch a mistake \u2014 but it is not a proof. Three angles do not establish a statement about all of them. The proof is the algebraic chain.',
  ],
  representations: ['An identity proved as a vertical chain of equalities, each step annotated with its reason'],
  visuals: [], visualsById: {},
  workedExamples: [
    {
      id: 's84b.we1',
      prompt: 'Prove that (1 \u2212 cos\u00b2A) \u00d7 cosec\u00b2A = 1.',
      steps: [
        { text: 'Start from the LHS: (1 \u2212 cos\u00b2A) \u00d7 cosec\u00b2A.', reasoning: 'The left side is the more complicated one, so there is more to work with there than on the bare 1.' },
        { text: 'From sin\u00b2A + cos\u00b2A = 1, rearranging gives 1 \u2212 cos\u00b2A = sin\u00b2A.', reasoning: 'The Pythagorean identity is used as an established result, rearranged by ordinary algebra.' },
        { text: 'So the LHS becomes sin\u00b2A \u00d7 cosec\u00b2A.', reasoning: 'Substituting an equal quantity keeps the chain a chain of equalities.' },
        { text: 'Since cosec A = 1/sin A, cosec\u00b2A = 1/sin\u00b2A, so this is sin\u00b2A \u00d7 (1/sin\u00b2A).', reasoning: 'The reciprocal relation holds wherever sin A \u2260 0, which is the range these proofs work in.' },
        { text: 'That is 1, which is the RHS.', reasoning: 'The chain has taken the left side to the right side, so the identity is proved.' },
      ],
      answer: 'Proved: (1 \u2212 cos\u00b2A) cosec\u00b2A = 1.',
    },
    {
      id: 's84b.we2',
      prompt: 'Prove that (sec A + tan A)(sec A \u2212 tan A) = 1.',
      steps: [
        { text: 'Start from the LHS and expand the product of the two brackets.', reasoning: 'It is a difference of two squares in disguise, so expanding is the quickest route to a familiar form.' },
        { text: '(sec A + tan A)(sec A \u2212 tan A) = sec\u00b2A \u2212 tan\u00b2A.', reasoning: 'The usual (x + y)(x \u2212 y) = x\u00b2 \u2212 y\u00b2 applies, since sec A and tan A are just quantities.' },
        { text: 'The derived identity 1 + tan\u00b2A = sec\u00b2A rearranges to sec\u00b2A \u2212 tan\u00b2A = 1.', reasoning: 'Moving tan\u00b2A across is ordinary algebra on an identity already established.' },
        { text: 'So the LHS equals 1, which is the RHS.', reasoning: 'One chain of equalities from left to right, with every step justified.' },
      ],
      answer: 'Proved: (sec A + tan A)(sec A \u2212 tan A) = 1.',
    },
    {
      id: 's84b.we3',
      prompt: 'Prove that (1 + cot\u00b2A) sin\u00b2A = 1, and say why checking 30\u00b0, 45\u00b0 and 60\u00b0 would not have been a proof.',
      steps: [
        { text: 'Start from the LHS: (1 + cot\u00b2A) sin\u00b2A.', reasoning: 'The bracket matches the left side of a derived identity, which suggests the first substitution.' },
        { text: 'By the derived identity, 1 + cot\u00b2A = cosec\u00b2A.', reasoning: 'This was derived in the previous lesson by dividing the Pythagorean identity by sin\u00b2A.' },
        { text: 'So the LHS becomes cosec\u00b2A \u00d7 sin\u00b2A = (1/sin\u00b2A) \u00d7 sin\u00b2A = 1, the RHS.', reasoning: 'The reciprocal relation cancels the two factors exactly, wherever sin A \u2260 0.' },
        { text: 'Checking at 30\u00b0, 45\u00b0 and 60\u00b0 would give 1 each time, which is reassuring but not a proof.', reasoning: 'Three angles are three instances; the identity claims something about every angle in the range, which only the algebra establishes.' },
      ],
      answer: 'Proved by algebra; the three angle checks are evidence, not proof.',
    },
  ],
  guidedPractice: [
    { id: 's84b.g1', prompt: 'Prove that cosec\u00b2A \u2212 cot\u00b2A = 1.', hint: 'Which derived identity rearranges to this?', answer: 'It is 1 + cot\u00b2A = cosec\u00b2A rearranged.', rationale: 'Subtracting cot\u00b2A from both sides of the derived identity gives the result directly.' },
    { id: 's84b.g2', prompt: 'Simplify (sin A + cos A)/sin A.', hint: 'Can you cancel sin A?', answer: '1 + cot A.', rationale: 'Split the fraction: sin A/sin A + cos A/sin A = 1 + cot A. Cancelling sin A from only the first term would be invalid.' },
    { id: 's84b.g3', prompt: 'Why prove an identity by transforming one side rather than working on both?', hint: 'What does the reader need to follow?', answer: 'Because it gives one checkable chain of equalities.', rationale: 'Operating on both sides risks a step that is not reversible, and the reader cannot see which direction the argument runs.' },
  ],
  independentPractice: [
    { id: 's84b.i1', prompt: 'Prove that tan A \u00d7 cos A = sin A.', answer: 'tan A \u00d7 cos A = (sin A/cos A) \u00d7 cos A = sin A.', rationale: 'Rewriting tan in terms of sin and cos lets the cos A factors cancel, wherever cos A \u2260 0.' },
    { id: 's84b.i2', prompt: 'Prove that (1 \u2212 sin\u00b2A) sec\u00b2A = 1.', answer: '(1 \u2212 sin\u00b2A) = cos\u00b2A, and cos\u00b2A \u00d7 sec\u00b2A = cos\u00b2A \u00d7 (1/cos\u00b2A) = 1.', rationale: 'The Pythagorean identity supplies the first substitution and the reciprocal relation finishes it.' },
    { id: 's84b.i3', prompt: 'A student cancels sin A in (sin A + 1)/sin A to get 1 + 1. What is wrong?', answer: 'You cannot cancel across an addition.', rationale: 'Splitting gives sin A/sin A + 1/sin A = 1 + cosec A. Only a factor of the WHOLE numerator can be cancelled.' },
    { id: 's84b.i4', prompt: 'Is checking an identity at four angles a proof?', answer: 'No.', rationale: 'It is evidence and a useful error check, but an identity claims something about every angle in its range, which particular values cannot establish.' },
    { id: 's84b.i5', prompt: 'Prove that cot A \u00d7 sin A = cos A.', answer: 'cot A \u00d7 sin A = (cos A/sin A) \u00d7 sin A = cos A.', rationale: 'Writing cot in terms of sin and cos lets the sin A factors cancel, wherever sin A \u2260 0.' },
  ],
  misconceptionIds: [], interactivePractice: [],
  reasoningApplication: [
    {
      id: 's84b.td1',
      prompt: 'Why is checking an identity at several angles not a proof, and what is it good for?',
      expectedReasoning:
        'Because an identity claims the two sides agree at EVERY angle in its range, and any finite number of checks leaves infinitely many unchecked. A statement can hold at 30\u00b0, 45\u00b0 and 60\u00b0 and fail elsewhere, so passing those tests shows only that no counterexample was found among them. What the checks are genuinely good for is the opposite job: a single angle where the two sides disagree DISPROVES the identity immediately, so testing is an efficient way to catch an error before spending effort on an algebraic chain that cannot exist. Evidence and proof do different work, and the algebra is what settles it.',
    },
    {
      id: 's84b.td2',
      prompt: 'Why can sin A not be cancelled in (sin A + cos A)/sin A, when it can in (sin A \u00d7 cos A)/sin A?',
      expectedReasoning:
        'Because cancelling is dividing the whole numerator and the whole denominator by the same quantity, and that only simplifies when the quantity is a FACTOR of the entire numerator. In the product sin A \u00d7 cos A it is a factor, so dividing both parts by sin A leaves cos A. In the sum sin A + cos A it is a term, not a factor \u2014 dividing the whole numerator by sin A affects both terms, giving 1 + cot A, not cos A. Crossing out one occurrence would divide part of the numerator and leave the rest untouched, which is not an operation at all. The rule is ordinary algebra; the trigonometric names just make the terms look like things that can be struck through.',
    },
  ],
  summary:
    `Prove an identity by transforming ONE side into the other, each step justified by algebra or by an established identity \u2014 not by working on both sides until they match. A reliable opening move is to rewrite everything in sin and cos. Two rearrangements recur: sec\u00b2A \u2212 tan\u00b2A = 1 and cosec\u00b2A \u2212 cot\u00b2A = 1. Ordinary algebra still applies: a term cannot be cancelled across an addition. And checking 30\u00b0, 45\u00b0 and 60\u00b0 is evidence that can DISPROVE an identity, never a proof of one.`,
  nextStep: 'This completes the chapter and the Class 10 instructional units.',
  teacher: teacher(
    'Students prove simple identities by a one-directional algebraic chain, using established identities.',
    ['The three identities', 'Algebra with fractions'],
    ['Which side are we starting from?', 'What justifies that step?', 'Factor, or term?'],
    [
      'Insist on one direction. Students who work on both sides produce something that looks like a proof and cannot be checked.',
      'The cancelling-across-addition error is worth a dedicated moment; trigonometric names make it unusually tempting.',
      'Say explicitly that angle checks can disprove but not prove. Students use them as verification and conclude too much.',
    ],
    ['Ask what the first move is when stuck.', 'Ask whether four angle checks settle an identity.'],
    ['Have the student write LHS at the top and annotate each line with its reason before moving on.'],
    ['Ask which identity is hiding in sec\u2074A \u2212 tan\u2074A.'],
  ),
  reviewStatus: 'authored_draft',
};

export const CLASS10_IDENTITY_SECTIONS: AuthoredSection[] = [
  C10_SECTION_8_3B, C10_SECTION_8_4A, C10_SECTION_8_4B,
];
