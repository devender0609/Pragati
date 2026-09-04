// v0.67 §2/§3/§5/§8 — AUTHORED DRAFTS: §7.6, §7.7, §7.8, §7.9.
//
// These four carry the chapter's interactive practice, because the
// mathematics genuinely needs it: equivalence and comparison are
// judgements about relative size, and a four-option text list lets a
// student guess without ever looking at the quantities.
//
// New interaction formats are added ONLY where they change what the
// item can evidence:
//   equivalence_selection — pick the strip equal to a target
//   comparison_selection  — pick the larger of two, having seen both
//
// No drag-and-drop. It would demo well and evidence nothing extra.
//
// STATUS: authored_draft throughout.

import type { AuthoredSection } from './authoredSection';
import type { FractionStripSpec, FractionAreaModelSpec, NumberLineSpec } from './visualSpecification';
import type { InstructionalItem } from './instructionalInteraction';

const SRC = 'https://ncert.nic.in/textbook/pdf/fegp1dd.zip';
const BOOK = 'Ganita Prakash, Grade 6 (NCERT, Reprint 2026-27)';
const CH = 'ncert_gp_c6_ch07_fractions';
const INSPECTED = '2026-08-24';
const f = (n: number, d: number) => ({ numerator: n, denominator: d });

const source = (
  sectionNumber: string,
  exactTitle: string,
  startPage: number,
  officialSectionId: string
) => ({
  officialChapterId: CH,
  officialSectionId,
  sectionNumber,
  exactTitle,
  startPage,
  textbook: BOOK,
  sourceReference: SRC,
  inspectionDate: INSPECTED,
});

// ===========================================================================
// §7.6 — Equivalent Fractions (p. 169)
// ===========================================================================

const S76_STRIPS: FractionStripSpec = {
  type: 'fraction_strip',
  purpose: 'show_equivalence',
  status: 'concept_specific',
  strips: [
    { denominator: 3, shadedCount: 2, label: '2/3' },
    { denominator: 6, shadedCount: 4, label: '4/6' },
    { denominator: 9, shadedCount: 6, label: '6/9' },
  ],
  assertsEquivalence: true,
  caption: 'The same amount, cut three different ways.',
  altText:
    'Three strips of equal length divided into 3, 6 and 9 equal parts. Two, four and six parts are shaded, and all three shaded regions end at the same point.',
};

const S76_AREA: FractionAreaModelSpec = {
  type: 'fraction_area_model',
  purpose: 'show_equivalence',
  status: 'concept_specific',
  shape: 'rectangle',
  partitions: 6,
  shadedParts: 4,
  caption: 'Four of six equal parts — the same as two of three.',
  altText:
    'A rectangle divided into six equal parts with four shaded, showing four-sixths.',
};

const S76_PRACTICE: InstructionalItem[] = [
  {
    itemId: 's76.p1',
    use: 'instructional_practice',
    officialSectionId: 'ncert_gp_c6_s7_6',
    format: 'fraction_strip_selection',
    prompt: 'Which strip shows the same amount as 2/3?',
    strips: [
      { denominator: 6, shadedCount: 3 },
      { denominator: 6, shadedCount: 4 },
      // v0.68 §4 audit — was 5/9. Changed to 2/9, which keeps the
      // NUMERATOR of the target and changes only the denominator, so
      // the distractor now tests the actual idea instead of offering an
      // unrelated wrong number. Strip selection cannot carry a
      // misconception tag (the format reports which strip, not why), so
      // this remains neutral by design.
      { denominator: 9, shadedCount: 2 },
    ],
    targetValue: f(2, 3),
    correctFeedback: 'Yes. 4/6 covers exactly the same amount as 2/3.',
    neutralIncorrectFeedback:
      'Compare where the shading ends, not how many pieces there are.',
  },
  {
    itemId: 's76.p2',
    use: 'instructional_practice',
    officialSectionId: 'ncert_gp_c6_s7_6',
    format: 'numeric_entry',
    prompt: 'Write a fraction with denominator 8 that equals 1/2.',
    correctValue: f(4, 8),
    acceptEquivalent: false,
    correctFeedback: 'Correct. Cutting each half into four gives 4/8.',
    neutralIncorrectFeedback:
      'How many eighths cover the same amount as one half?',
  },
  {
    itemId: 's76.p3',
    use: 'instructional_practice',
    officialSectionId: 'ncert_gp_c6_s7_6',
    format: 'multiple_choice',
    prompt: 'Why is 3/6 the same amount as 1/2?',
    choices: [
      { id: 'a', text: 'Each half was cut into 3 equal pieces, so 1 half became 3 sixths', misconceptionId: null },
      { id: 'b', text: 'Because 3 and 6 are both bigger than 1 and 2', misconceptionId: 'bigger_denominator_bigger_fraction' },
      // v0.68 §4 audit — "They are not the same amount" is a REJECTION
      // of equivalence, which is exactly what
      // equivalent_means_identical_picture predicts. But a student may
      // also simply not have worked it out, or have miscounted. The
      // option gives no reason, so no reason may be inferred. Neutral.
      { id: 'c', text: 'They are not the same amount', misconceptionId: null },
      { id: 'd', text: 'Because 6 minus 3 equals 3', misconceptionId: null },
    ],
    correctChoiceId: 'a',
    correctFeedback:
      'Yes. Cutting every part into the same number of smaller pieces does not change how much is covered.',
    neutralIncorrectFeedback:
      'Look at how much of the whole is shaded, not at the size of the numbers.',
  },
];

export const SECTION_7_6: AuthoredSection = {
  contentArtifactId: 'ncert_gp_c6_s7_6_lesson',
  contentArtifactVersion: 1,
  source: source('7.6', 'Equivalent Fractions', 169, 'ncert_gp_c6_s7_6'),

  competencyCandidates: [
    {
      id: 'MIDDLE:C-1.6',
      justification:
        'Recognising the same quantity under different names is core to applying fractions, which C-1.6 names.',
    },
  ],
  competencyMappingStatus: 'competency_proposed',

  sequence: {
    prerequisiteSectionIds: ['ncert_gp_c6_s7_2', 'ncert_gp_c6_s7_4'],
    mayAssume: ['Naming a/b', 'Fractions as lengths on a number line'],
    mustNotIntroduce: [
      { concept: 'Comparing unlike fractions', belongsToSection: 'ncert_gp_c6_s7_7' },
      { concept: 'Adding fractions', belongsToSection: 'ncert_gp_c6_s7_8' },
    ],
  },

  learningGoal:
    'You will be able to find different fractions that name exactly the same amount.',

  priorKnowledgeCheck: {
    prompt: 'Before you start, can you do these?',
    checks: ['Write a fraction for a shaded shape.', 'Mark 1/2 on a number line.'],
    ifNotReady: 'Go back to Fractional Units as Parts of a Whole.',
  },

  vocabulary: [
    { term: 'equivalent fractions', meaning: 'Different fractions that name the same amount.' },
  ],

  explanation: [
    'Take a strip and shade one half. Now cut every part into two smaller pieces.',
    'You have not changed how much is shaded — you have only cut it differently. But now the shading is 2 of 4 pieces, so the same amount is called 2/4.',
    'Cut each piece again and it becomes 4/8. Still the same amount.',
    'Fractions like 1/2, 2/4 and 4/8 are called equivalent fractions. They are different names for one amount.',
    // v0.68 §7 — split from one 30-word sentence.
    'This is why the number of shaded pieces can change while the amount does not.',
    'As the pieces get more numerous, they also get smaller. The two changes cancel out.',
    'To find an equivalent fraction, multiply the top and bottom by the SAME number. Cutting every part into 3 turns 2/3 into 6/9.',
    // v0.69 §28 — the §7.6 audit found the chapter's one real
    // procedure-without-a-reason. Everything above builds the cutting
    // argument, and then the rule "multiply top and bottom" arrives
    // asserted, with the link between the two left for the student to
    // supply. A section that spends six paragraphs earning an idea
    // should not hand over the rule as if it were unrelated.
    'Why the SAME number? Cutting every part into 3 makes 3 times as many parts in the whole, and 3 times as many of the parts you took. Both numbers grow by 3 because the same cut did both.',
  ],

  representations: [
    'Strips cut into different numbers of equal parts',
    'Area models of the same whole',
  ],

  visuals: [S76_STRIPS, S76_AREA],
  visualsById: { S76_STRIPS, S76_AREA },

  workedExamples: [
    {
      id: 's76.we1',
      prompt: 'Show that 2/3 and 4/6 are the same amount.',
      steps: [
        { text: 'Start with a strip in 3 equal parts, 2 shaded.', reasoning: 'That is 2/3.' },
        { text: 'Cut each of the 3 parts into 2, giving 6 parts. The shaded region now covers 4 of them.', reasoning: 'Cutting does not move the boundary of the shading.' },
        { text: 'Same amount, new name: 4/6.', reasoning: 'Both top and bottom doubled.' },
      ],
      answer: 'They are equivalent: 2/3 = 4/6.',
      visualRef: 'S76_STRIPS',
    },
    {
      id: 's76.we2',
      prompt: 'Find a fraction equal to 3/4 with denominator 12.',
      steps: [
        { text: 'To turn 4 parts into 12, cut each part into 3.', reasoning: '4 x 3 = 12.' },
        { text: 'Each shaded part also becomes 3, so 3 shaded parts become 9.', reasoning: 'Multiply top and bottom by the same number.' },
        { text: 'So 3/4 = 9/12.', reasoning: 'The amount is unchanged; only the naming is finer.' },
      ],
      answer: '9/12',
    },
    {
      id: 's76.we3',
      prompt: 'Meera says 2/4 and 3/6 must be different because one has 2 pieces shaded and the other has 3. Is she right?',
      steps: [
        { text: 'Both are one half of their whole.', reasoning: '2 out of 4 and 3 out of 6 each cover half.' },
        { text: 'The 3 pieces are smaller than the 2 pieces.', reasoning: 'Sixths are smaller than fourths.' },
        { text: 'More pieces of a smaller size can cover the same amount.', reasoning: 'The count alone does not tell you the amount.' },
      ],
      answer: 'No — both are one half.',
      visualRef: 'S76_AREA',
    },
  ],

  misconceptionIds: [
    'equivalent_means_identical_picture',
    'different_shape_cannot_be_equal',
    'parts_count_vs_part_size',
  ],

  guidedPractice: [
    {
      id: 's76.g1',
      prompt: 'Write a fraction equal to 1/3 with denominator 9.',
      hint: 'What do you multiply 3 by to get 9? Do the same to the top.',
      answer: '3/9',
      rationale: 'Multiply top and bottom by 3.',
    },
    {
      id: 's76.g2',
      prompt: 'Are 2/5 and 4/10 the same amount?',
      hint: 'Try cutting each fifth into two.',
      answer: 'Yes.',
      rationale: 'Doubling top and bottom gives the same amount with finer parts.',
      visualRef: 'S76_STRIPS',
    },
    {
      id: 's76.g3',
      prompt: 'Fill in the blank: 3/5 = ?/15',
      hint: '5 becomes 15 by multiplying by 3.',
      answer: '9/15',
      rationale: 'Multiply both parts by 3.',
    },
  ],

  independentPractice: [
    { id: 's76.i1', prompt: 'Write two fractions equal to 1/4.', answer: '2/8 and 3/12 (others possible)', rationale: 'Multiply top and bottom by the same number.' },
    // v0.68 §10 audit — RATIONALE REWRITTEN. The original read "Ten
    // halves-of-fifths", which is not a phrase that means anything.
    { id: 's76.i2', prompt: 'Is 5/10 equal to 1/2?', answer: 'Yes', rationale: 'Cutting each half into 5 gives 10 parts, and the half now covers 5 of them.' },
    { id: 's76.i3', prompt: 'Complete: 2/7 = ?/21', answer: '6/21', rationale: 'Both multiplied by 3.' },
    { id: 's76.i4', prompt: 'Is 3/4 equal to 6/9? Explain.', answer: 'No', rationale: '3/4 would need 6/8; 6/9 is a different amount.' },
    { id: 's76.i5', prompt: 'A cake is cut into 12 equal pieces. How many pieces are the same as 1/3 of the cake?', answer: '4 pieces', rationale: '1/3 = 4/12.' },
  ],

  reasoningApplication: [
    {
      id: 's76.r1',
      prompt: 'Why does multiplying the top and bottom by the same number NOT change the amount, when multiplying only the top does?',
      expectedReasoning:
        'Multiplying both means cutting every part into smaller pieces — more pieces, each smaller, same total. Multiplying only the top takes more pieces of the same size, which is genuinely more.',
    },
  ],

  interactivePractice: S76_PRACTICE,

  summary:
    'Equivalent fractions name the same amount with different-sized parts. Multiply top and bottom by the same number to find one.',
  nextStep: 'Next: deciding which of two fractions is larger.',

  teacher: {
    objective: 'Students generate and recognise equivalent fractions and explain why the amount is unchanged.',
    prerequisiteKnowledge: ['Naming a/b (§7.2)', 'Number line (§7.4)'],
    modelLanguage: ['"Same amount, smaller pieces, more of them."'],
    teachingNotes: [
      'Cut, do not redraw. Students who watch one strip being subdivided see that the boundary never moves; students shown two finished diagrams have to take it on trust.',
      'Keep the whole identical at first. Mixing shape and size at the same time hides the argument.',
      'Resist "cancelling" language. Simplification as a procedure comes later; here the point is why the amount is unchanged.',
    ],
    quickChecks: ['Give me another name for 1/2.', 'Why is 4/6 the same as 2/3?'],
    supportForStrugglingLearners: [
      'Fold a paper strip in half, then in half again, and count the pieces after each fold.',
    ],
    extension: ['How many fractions are equal to 1/2? Can you name a very unusual one?'],
    materialsNeeded: ['Paper strips', 'Coloured pencils'],
  },

  reviewStatus: 'authored_draft',
};

// ===========================================================================
// §7.7 — Comparing Fractions (p. 174)
// ===========================================================================

const S77_SAME_DEN: FractionStripSpec = {
  type: 'fraction_strip',
  purpose: 'compare_quantities',
  status: 'concept_specific',
  strips: [
    { denominator: 8, shadedCount: 5, label: '5/8' },
    { denominator: 8, shadedCount: 3, label: '3/8' },
  ],
  assertsEquivalence: false,
  caption: 'Same size parts — just count them.',
  altText:
    'Two strips of equal length each divided into eight equal parts. The first has five shaded, the second three.',
};

const S77_SAME_NUM: FractionStripSpec = {
  type: 'fraction_strip',
  purpose: 'compare_quantities',
  status: 'concept_specific',
  strips: [
    { denominator: 3, shadedCount: 2, label: '2/3' },
    { denominator: 5, shadedCount: 2, label: '2/5' },
  ],
  assertsEquivalence: false,
  caption: 'Same number of parts, but thirds are bigger than fifths.',
  altText:
    'Two strips of equal length. The first is divided into three parts with two shaded; the second into five parts with two shaded. The first shaded region is longer.',
};

const S77_PRACTICE: InstructionalItem[] = [
  {
    itemId: 's77.p1',
    use: 'instructional_practice',
    officialSectionId: 'ncert_gp_c6_s7_7',
    format: 'multiple_choice',
    prompt: 'Which is greater, 2/3 or 2/5?',
    choices: [
      { id: 'a', text: '2/3, because thirds are bigger than fifths', misconceptionId: null },
      { id: 'b', text: '2/5, because 5 is bigger than 3', misconceptionId: 'bigger_denominator_bigger_fraction' },
      // v0.68 §2/§3 — FIXED. v0.67 identified this as
      // compare_numerators_only, could not express the ID, and shipped
      // null. The chapter reference now carries it. The option states
      // its own reasoning ("both have 2 on top"), which is what makes
      // the inference safe rather than a guess about intent.
      {
        id: 'c',
        text: 'They are equal, because both have 2 on top',
        misconceptionId: null,
        chapterMisconceptionId: 'compare_numerators_only',
      },
      { id: 'd', text: 'You cannot tell', misconceptionId: null },
    ],
    correctChoiceId: 'a',
    correctFeedback:
      'Yes. Same number of parts, but each third is bigger than each fifth.',
    neutralIncorrectFeedback:
      'Both have 2 parts. The question is which parts are bigger.',
  },
  {
    itemId: 's77.p2',
    use: 'instructional_practice',
    officialSectionId: 'ncert_gp_c6_s7_7',
    format: 'fraction_strip_selection',
    prompt: 'Which strip shows the largest amount?',
    strips: [
      { denominator: 4, shadedCount: 1 },
      { denominator: 4, shadedCount: 3 },
      { denominator: 4, shadedCount: 2 },
    ],
    targetValue: f(3, 4),
    correctFeedback: 'Correct — with the same size parts, more parts means more.',
    neutralIncorrectFeedback:
      'All three strips have fourths. Which has the most of them?',
  },
  {
    itemId: 's77.p3',
    use: 'instructional_practice',
    officialSectionId: 'ncert_gp_c6_s7_7',
    format: 'numeric_entry',
    prompt: 'Rewrite 2/3 with denominator 12 so it can be compared with 7/12.',
    correctValue: f(8, 12),
    acceptEquivalent: false,
    correctFeedback: 'Yes. 8/12 is greater than 7/12, so 2/3 is greater.',
    neutralIncorrectFeedback:
      'Multiply top and bottom by the same number to reach twelfths.',
  },
];

export const SECTION_7_7: AuthoredSection = {
  contentArtifactId: 'ncert_gp_c6_s7_7_lesson',
  contentArtifactVersion: 1,
  source: source('7.7', 'Comparing Fractions', 174, 'ncert_gp_c6_s7_7'),

  competencyCandidates: [
    {
      id: 'MIDDLE:C-1.4',
      justification:
        'Ordering fractions is a property of the set of rational numbers, which C-1.4 names.',
    },
  ],
  competencyMappingStatus: 'competency_proposed',

  sequence: {
    prerequisiteSectionIds: ['ncert_gp_c6_s7_1', 'ncert_gp_c6_s7_6'],
    mayAssume: [
      'Unit fractions get smaller as the denominator grows (§7.1)',
      'Equivalent fractions (§7.6)',
    ],
    mustNotIntroduce: [
      { concept: 'Adding and subtracting fractions', belongsToSection: 'ncert_gp_c6_s7_8' },
    ],
  },

  learningGoal:
    'You will be able to decide which of two fractions is greater, and explain how you know.',

  priorKnowledgeCheck: {
    prompt: 'Before you start, can you do these?',
    checks: ['Say why 1/8 is smaller than 1/5.', 'Find a fraction equal to 2/3 with denominator 6.'],
    ifNotReady: 'Go back to Equivalent Fractions.',
  },

  vocabulary: [
    { term: 'greater than (>)', meaning: 'Covers more of the whole.' },
    { term: 'common denominator', meaning: 'The same bottom number, so the parts are the same size.' },
  ],

  explanation: [
    'Comparing fractions is easy when the parts are the same size. 5/8 and 3/8 are both made of eighths, so just count: 5 eighths is more than 3 eighths.',
    'It is also easy when the COUNT is the same. 2/3 and 2/5 both take 2 parts — but thirds are bigger than fifths, so 2/3 is more.',
    'The hard case is when neither matches, like 2/3 and 7/12. Then make the parts the same size first.',
    'Rewrite 2/3 as 8/12 using equivalent fractions. Now both are twelfths, and 8 twelfths is more than 7 twelfths.',
    'One warning that applies every time: the two fractions must be of the SAME whole. Half of a small roti is not half of a large one.',
  ],

  representations: [
    'Strips with the same denominator',
    'Strips with the same numerator',
    'Rewriting to a common denominator',
  ],

  visuals: [S77_SAME_DEN, S77_SAME_NUM],
  visualsById: { S77_SAME_DEN, S77_SAME_NUM },

  workedExamples: [
    {
      id: 's77.we1',
      prompt: 'Which is greater, 5/8 or 3/8?',
      steps: [
        { text: 'Both are made of eighths, so the parts are the same size.', reasoning: 'Same denominator means directly comparable.' },
        { text: 'Five parts is more than three parts.', reasoning: 'With equal-size parts, count decides.' },
      ],
      answer: '5/8',
      visualRef: 'S77_SAME_DEN',
    },
    {
      id: 's77.we2',
      prompt: 'Which is greater, 2/3 or 2/5?',
      steps: [
        { text: 'Both take 2 parts, so counting will not decide it.', reasoning: 'Same numerator.' },
        { text: 'Thirds are bigger than fifths, because the whole is cut into fewer pieces.', reasoning: 'This is the §7.1 idea about unit fractions.' },
        { text: 'Two bigger parts beat two smaller parts, so 2/3 is greater.', reasoning: 'Same count, larger pieces.' },
      ],
      answer: '2/3',
      visualRef: 'S77_SAME_NUM',
    },
    {
      id: 's77.we3',
      prompt: 'Which is greater, 2/3 or 7/12?',
      steps: [
        { text: 'The parts are different sizes, so make them match.', reasoning: 'Neither the count nor the size matches yet.' },
        { text: 'Rewrite 2/3 as twelfths: multiply top and bottom by 4 to get 8/12.', reasoning: 'Equivalent fractions from §7.6.' },
        { text: 'Now compare 8/12 with 7/12. Eight twelfths is more.', reasoning: 'Same-size parts, so count decides.' },
      ],
      answer: '2/3 is greater.',
    },
    {
      id: 's77.we4',
      prompt: 'Sara says 3/8 is greater than 2/3 because 8 is bigger than 3. What is wrong?',
      steps: [
        { text: 'A bigger bottom number means SMALLER parts, not a bigger fraction.', reasoning: 'From §7.1: more pieces, smaller each.' },
        { text: 'Check by rewriting both in twenty-fourths: 3/8 = 9/24 and 2/3 = 16/24.', reasoning: 'A common denominator settles it.' },
        { text: '16 twenty-fourths is more than 9, so 2/3 is greater.', reasoning: 'Sara compared the wrong numbers.' },
      ],
      answer: 'She is wrong. 2/3 is greater.',
    },
  ],

  misconceptionIds: [
    'more_parts_means_bigger',
    'compare_numerators_only',
    'whole_not_the_same',
  ],

  guidedPractice: [
    {
      id: 's77.g1',
      prompt: 'Which is greater, 4/9 or 7/9?',
      hint: 'Are the parts the same size?',
      answer: '7/9',
      rationale: 'Same denominator, so more parts means more.',
      visualRef: 'S77_SAME_DEN',
    },
    {
      id: 's77.g2',
      prompt: 'Which is greater, 3/4 or 3/7?',
      hint: 'The counts match. Which parts are bigger?',
      answer: '3/4',
      rationale: 'Fourths are bigger than sevenths.',
      visualRef: 'S77_SAME_NUM',
    },
    {
      id: 's77.g3',
      prompt: 'Which is greater, 1/2 or 3/8?',
      hint: 'Rewrite 1/2 as eighths first.',
      answer: '1/2',
      rationale: '1/2 = 4/8, which is more than 3/8.',
    },
  ],

  independentPractice: [
    { id: 's77.i1', prompt: 'Which is greater, 5/6 or 5/9?', answer: '5/6', rationale: 'Same count, sixths are bigger.' },
    { id: 's77.i2', prompt: 'Which is greater, 2/5 or 3/5?', answer: '3/5', rationale: 'Same parts, more of them.' },
    { id: 's77.i3', prompt: 'Which is greater, 3/4 or 5/8?', answer: '3/4', rationale: '3/4 = 6/8 > 5/8.' },
    { id: 's77.i4', prompt: 'Put in order, smallest first: 1/2, 2/5, 3/4.', answer: '2/5, 1/2, 3/4', rationale: 'In twentieths: 8/20, 10/20, 15/20.' },
    { id: 's77.i5', prompt: 'Which is greater, 7/10 or 2/3? Show how you decided.', answer: '7/10', rationale: 'In thirtieths: 21/30 vs 20/30.' },
  ],

  reasoningApplication: [
    {
      id: 's77.r1',
      // v0.68 §11 audit — REWRITTEN. Three defects in the original.
      // (1) The prompt was ungrammatical: "explain how you know X is
      // less than Y is FALSE or TRUE". (2) It said "without finding a
      // common denominator" and then the expected reasoning found one.
      // (3) The reasoning used 4.5 and 5.5 — decimals, which Ganita
      // Prakash Grade 6 does not contain at all (there is no decimals
      // chapter in the current book). The task now asks for the
      // landmark comparison it was reaching for, with numbers that
      // settle by that method alone.
      prompt: 'Is 4/9 or 5/8 closer to one half? Explain without rewriting either fraction.',
      expectedReasoning:
        'Half of 9 is between 4 and 5, so 4/9 is a little less than one half. Half of 8 is 4, so 5/8 is more than one half by a whole eighth. 4/9 falls short by less than one ninth, so 4/9 is closer. Comparing each fraction against one half is enough; no common denominator is needed.',
    },
    {
      id: 's77.r2',
      prompt: 'Ali ate 1/2 of his roti and Bina ate 1/3 of hers. Bina says she ate more. Could she be right?',
      expectedReasoning:
        'Yes, if her roti was much bigger. Fractions only compare directly when the whole is the same.',
    },
  ],

  interactivePractice: S77_PRACTICE,

  summary:
    'Same denominator: count the parts. Same numerator: compare part sizes. Otherwise rewrite to a common denominator first.',
  nextStep: 'Next: adding and subtracting fractions.',

  teacher: {
    objective: 'Students compare fractions using same-denominator, same-numerator and common-denominator reasoning.',
    prerequisiteKnowledge: ['Unit fractions (§7.1)', 'Equivalent fractions (§7.6)'],
    modelLanguage: ['"Same size parts — count them." "Same count — which parts are bigger?"'],
    teachingNotes: [
      'Teach the two easy cases before the general method. Students who go straight to common denominators lose the size intuition and cannot check whether their answer is sensible.',
      'The same-numerator case (2/3 vs 2/5) is where the "bigger denominator" error is most visible. Do not skip it.',
      'State "of the same whole" every time. It is the hidden assumption in every comparison task.',
    ],
    quickChecks: ['Which is bigger, 3/5 or 3/8? Why?', 'How would you compare 2/3 and 5/8?'],
    supportForStrugglingLearners: [
      'Compare against 1/2 as a landmark before attempting a common denominator.',
    ],
    extension: ['Find a fraction between 1/2 and 3/5.'],
    materialsNeeded: ['Fraction strips in halves, thirds, fourths, fifths, eighths'],
  },

  reviewStatus: 'authored_draft',
};

// ===========================================================================
// §7.8 — Addition and Subtraction of Fractions (p. 178)
// ===========================================================================

const S78_LIKE: FractionStripSpec = {
  type: 'fraction_strip',
  purpose: 'model_operation',
  status: 'concept_specific',
  strips: [
    { denominator: 5, shadedCount: 2, label: '2/5' },
    { denominator: 5, shadedCount: 1, label: '1/5' },
    { denominator: 5, shadedCount: 3, label: '3/5 total' },
  ],
  assertsEquivalence: false,
  caption: 'Two fifths and one more fifth make three fifths.',
  altText:
    'Three strips divided into five equal parts. The first has two shaded, the second one, and the third three.',
};

const S78_LINE: NumberLineSpec = {
  type: 'number_line',
  purpose: 'model_operation',
  status: 'concept_specific',
  min: f(0, 1),
  max: f(1, 1),
  partitions: 6,
  labelTicks: true,
  markedPoints: [{ value: f(5, 6), label: '5/6', emphasis: 'primary' }],
  highlightFrom: f(0, 1),
  highlightTo: f(5, 6),
  orientation: 'horizontal',
  caption: 'One half plus one third, once both are sixths.',
  altText:
    'A number line from 0 to 1 divided into sixths, with five-sixths marked and the length from 0 shaded.',
};

const S78_PRACTICE: InstructionalItem[] = [
  {
    itemId: 's78.p1',
    use: 'instructional_practice',
    officialSectionId: 'ncert_gp_c6_s7_8',
    format: 'numeric_entry',
    prompt: 'Work out 2/7 + 3/7.',
    correctValue: f(5, 7),
    acceptEquivalent: true,
    correctFeedback: 'Yes. Same size parts, so add how many: 2 sevenths and 3 sevenths.',
    neutralIncorrectFeedback:
      'The parts are already the same size. Add the counts, keep the sevenths.',
  },
  {
    itemId: 's78.p2',
    use: 'instructional_practice',
    officialSectionId: 'ncert_gp_c6_s7_8',
    format: 'multiple_choice',
    prompt: 'What is 1/4 + 1/4?',
    choices: [
      { id: 'a', text: '2/4', misconceptionId: null },
      // v0.68 §2/§3 — FIXED. 2/8 is reachable only by adding numerators
      // and denominators separately; no other method produces it from
      // 1/4 + 1/4. v0.67 knew this and had no way to say it.
      {
        id: 'b',
        text: '2/8',
        misconceptionId: null,
        chapterMisconceptionId: 'add_numerators_and_denominators',
      },
      // 1/8 is NOT diagnosable. It could be halving the answer, adding
      // the denominators and then the numerators wrongly, or a slip.
      { id: 'c', text: '1/8', misconceptionId: null },
      // v0.68 §4 audit — REWORDED. The original read "1/2 is impossible
      // here", which is mathematically false: 1/2 IS the answer in
      // lowest terms, so the only wholly wrong thing about the option
      // was its own claim, and a student choosing it may have been
      // right for the wrong reason. Replaced with a genuinely wrong
      // value that no documented misconception uniquely explains.
      { id: 'd', text: '4/4', misconceptionId: null },
    ],
    correctChoiceId: 'a',
    correctFeedback:
      'Correct. Two fourths — which is also one half.',
    neutralIncorrectFeedback:
      'The parts stay fourths. Only the number of them changes.',
  },
  {
    itemId: 's78.p3',
    use: 'instructional_practice',
    officialSectionId: 'ncert_gp_c6_s7_8',
    format: 'numeric_entry',
    prompt: 'Work out 1/2 + 1/3.',
    correctValue: f(5, 6),
    acceptEquivalent: true,
    // v0.68 §3 — 2/5 is the canonical added-denominators answer for
    // this exact sum and is reachable no other way. Matched on the
    // exact pair, not by equivalence: 4/10 is the same number but is
    // not evidence of the same method.
    diagnosticValues: [
      {
        value: f(2, 5),
        chapterMisconceptionId: 'add_numerators_and_denominators',
        whyUnique:
          'Only adding 1+1 over 2+3 gives 2/5. Every correct route to a common denominator gives sixths.',
      },
    ],
    correctFeedback: 'Yes. Both become sixths: 3/6 and 2/6 make 5/6.',
    neutralIncorrectFeedback:
      'The parts are different sizes. Make them match before adding.',
  },
  {
    itemId: 's78.p4',
    use: 'instructional_practice',
    officialSectionId: 'ncert_gp_c6_s7_8',
    format: 'select_point_on_number_line',
    prompt: 'Tap where 1/2 + 1/3 lands.',
    min: f(0, 1),
    max: f(1, 1),
    partitions: 6,
    correctTickIndex: 5,
    labelTicks: false,
    correctFeedback: 'Correct — five sixths.',
    neutralIncorrectFeedback:
      'Turn both into sixths, then count the sixths from 0.',
  },
];

export const SECTION_7_8: AuthoredSection = {
  contentArtifactId: 'ncert_gp_c6_s7_8_lesson',
  contentArtifactVersion: 1,
  source: source('7.8', 'Addition and Subtraction of Fractions', 178, 'ncert_gp_c6_s7_8'),

  competencyCandidates: [
    {
      id: 'MIDDLE:C-1.6',
      justification:
        'Operating on fractions in daily-life situations is the applied competency C-1.6 names.',
    },
  ],
  competencyMappingStatus: 'competency_proposed',

  sequence: {
    prerequisiteSectionIds: ['ncert_gp_c6_s7_2', 'ncert_gp_c6_s7_6', 'ncert_gp_c6_s7_7'],
    mayAssume: [
      'A fraction is a count of fractional units (§7.2)',
      'Equivalent fractions (§7.6)',
      'Common denominators (§7.7)',
    ],
    mustNotIntroduce: [
      { concept: 'Multiplication and division of fractions', belongsToSection: 'grade_7_ch8' },
    ],
  },

  learningGoal:
    'You will be able to add and subtract fractions, including when the parts are different sizes.',

  priorKnowledgeCheck: {
    prompt: 'Before you start, can you do these?',
    checks: ['Rewrite 1/2 as sixths.', 'Say which is bigger, 3/8 or 1/2.'],
    ifNotReady: 'Go back to Equivalent Fractions and Comparing Fractions.',
  },

  vocabulary: [
    { term: 'like fractions', meaning: 'Fractions with the same denominator — the parts are the same size.' },
    { term: 'unlike fractions', meaning: 'Fractions with different denominators.' },
  ],

  explanation: [
    'A fraction counts fractional units. 2/5 means two fifths — two pieces, each one-fifth.',
    'So adding is just counting more pieces of the same size. 2/5 + 1/5 = 3/5. Two fifths and one more fifth make three fifths.',
    'Notice the bottom number does NOT change. You are not making the pieces smaller, only taking more of them.',
    'A common mistake is to add the bottom numbers too, giving 3/10. Check it: 1/4 + 1/4 would then be 2/8, which is smaller than the 1/4 you started with. Adding cannot make things smaller.',
    'When the parts are different sizes, you cannot count them together yet. 1/2 + 1/3 is not 2 of anything.',
    'So make the parts match first, using equivalent fractions: 1/2 = 3/6 and 1/3 = 2/6. Now both are sixths, and 3 sixths plus 2 sixths is 5 sixths.',
    'Subtraction works the same way: make the parts match, then take away the count.',
  ],

  representations: [
    'Strips joined end to end',
    'Number line showing the total length',
    'Rewriting to a common denominator',
  ],

  visuals: [S78_LIKE, S78_LINE],
  visualsById: { S78_LIKE, S78_LINE },

  workedExamples: [
    {
      id: 's78.we1',
      prompt: 'Work out 2/5 + 1/5.',
      steps: [
        { text: 'Both are fifths, so the parts are already the same size.', reasoning: 'Like fractions can be counted together directly.' },
        { text: 'Two fifths and one more fifth is three fifths.', reasoning: 'Add the counts only.' },
        { text: 'The answer is 3/5 — still fifths.', reasoning: 'The size of the parts has not changed.' },
      ],
      answer: '3/5',
      visualRef: 'S78_LIKE',
    },
    {
      id: 's78.we2',
      prompt: 'Work out 1/2 + 1/3.',
      steps: [
        { text: 'Halves and thirds are different sizes, so they cannot be counted together yet.', reasoning: 'Unlike fractions must be rewritten first.' },
        { text: 'Rewrite both as sixths: 1/2 = 3/6 and 1/3 = 2/6.', reasoning: 'Sixths work because both 2 and 3 divide into 6.' },
        { text: 'Now add the counts: 3 sixths and 2 sixths is 5 sixths.', reasoning: 'Same size parts at last.' },
      ],
      answer: '5/6',
      visualRef: 'S78_LINE',
    },
    {
      id: 's78.we3',
      prompt: 'Work out 5/6 − 1/3.',
      steps: [
        { text: 'Rewrite 1/3 as sixths: 1/3 = 2/6.', reasoning: 'Make the parts the same size before subtracting.' },
        { text: 'Take 2 sixths away from 5 sixths.', reasoning: 'Now the counts can be subtracted.' },
        { text: 'That leaves 3/6, which is also 1/2.', reasoning: 'Both names are correct.' },
      ],
      answer: '3/6, or 1/2',
    },
    {
      id: 's78.we4',
      prompt: 'Ravi writes 1/4 + 1/4 = 2/8. Show him why that cannot be right.',
      steps: [
        { text: 'He added the bottom numbers as well as the top ones.', reasoning: 'The denominator is a size, not a count — it should not change.' },
        { text: '2/8 is the same as 1/4 — the amount he started with.', reasoning: 'Adding something cannot leave you where you began.' },
        { text: 'The parts stay fourths, so the answer is 2/4, which is one half.', reasoning: 'Two pieces, each a fourth.' },
      ],
      answer: '2/4, which is 1/2.',
    },
    {
      id: 's78.we5',
      prompt: 'Asha drinks 1/4 litre of milk in the morning and 3/8 litre in the evening. How much in total?',
      steps: [
        { text: 'Fourths and eighths are different sizes.', reasoning: 'Rewrite to a common denominator.' },
        { text: '1/4 = 2/8.', reasoning: 'Multiply top and bottom by 2.' },
        { text: '2/8 + 3/8 = 5/8 litre.', reasoning: 'Same size parts, add the counts.' },
      ],
      answer: '5/8 litre',
    },
  ],

  misconceptionIds: [
    'add_numerators_and_denominators',
    'parts_count_vs_part_size',
    'whole_not_the_same',
  ],

  guidedPractice: [
    {
      id: 's78.g1',
      prompt: 'Work out 3/8 + 2/8.',
      hint: 'Are the parts already the same size?',
      answer: '5/8',
      rationale: 'Like fractions: add the counts, keep the eighths.',
      visualRef: 'S78_LIKE',
    },
    {
      id: 's78.g2',
      prompt: 'Work out 1/3 + 1/6.',
      hint: 'Rewrite 1/3 as sixths first.',
      answer: '3/6, or 1/2',
      rationale: '2/6 + 1/6 = 3/6.',
    },
    {
      id: 's78.g3',
      prompt: 'Work out 3/4 − 1/2.',
      hint: 'Make both into fourths.',
      answer: '1/4',
      rationale: '1/2 = 2/4, and 3/4 − 2/4 = 1/4.',
    },
  ],

  independentPractice: [
    { id: 's78.i1', prompt: 'Work out 4/9 + 2/9.', answer: '6/9', rationale: 'Like fractions; add the counts.' },
    { id: 's78.i2', prompt: 'Work out 1/2 + 1/4.', answer: '3/4', rationale: '2/4 + 1/4.' },
    { id: 's78.i3', prompt: 'Work out 7/10 − 3/10.', answer: '4/10', rationale: 'Same parts; subtract the counts.' },
    { id: 's78.i4', prompt: 'Work out 2/3 − 1/6.', answer: '3/6, or 1/2', rationale: '4/6 − 1/6.' },
    { id: 's78.i5', prompt: 'A tin holds 3/4 litre. If 1/8 litre is poured out, how much is left?', answer: '5/8 litre', rationale: '6/8 − 1/8.' },
    { id: 's78.i6', prompt: 'Work out 5/6 + 1/6. What do you notice about the answer?', answer: '6/6, which is one whole', rationale: 'Six sixths make a whole.' },
  ],

  reasoningApplication: [
    {
      id: 's78.r1',
      prompt: 'Why can you add 2/7 and 3/7 straight away, but not 1/2 and 1/3?',
      expectedReasoning:
        'Sevenths are all the same size, so the counts can be added. Halves and thirds are different sizes, so "one of each" is not a count of anything until the parts are made equal.',
    },
    {
      id: 's78.r2',
      prompt: 'A student adds two fractions and gets an answer smaller than one of them. What must have gone wrong?',
      expectedReasoning:
        'Adding cannot reduce the amount. They have probably added the denominators as well, which makes the parts smaller instead of taking more of them.',
    },
  ],

  interactivePractice: S78_PRACTICE,

  summary:
    'Add and subtract fractions by counting parts of the same size. If the parts differ, rewrite them to a common denominator first.',
  nextStep: 'Next: where fractions came from.',

  teacher: {
    objective: 'Students add and subtract like and unlike fractions and explain why denominators are not added.',
    prerequisiteKnowledge: ['Equivalent fractions (§7.6)', 'Common denominators (§7.7)'],
    modelLanguage: ['"Same size parts? Then just count them."'],
    teachingNotes: [
      'Use 1/4 + 1/4 as the diagnostic. The wrong method gives 2/8, which equals one of the addends — students can see for themselves that it cannot be right, which is far stronger than being told the rule.',
      'Say "the bottom number is a size, not a count" whenever the error appears.',
      'Do not simplify answers as a requirement. 3/6 and 1/2 are both correct; insisting on lowest terms here adds a second thing to get wrong.',
      'Multiplication of fractions is Grade 7 Chapter 8. Do not preview it.',
    ],
    quickChecks: ['What is 2/9 + 4/9?', 'Why can we not add 1/2 and 1/5 straight away?'],
    supportForStrugglingLearners: [
      'Join physical strips end to end before writing the calculation.',
      'Say the answer in words — "five sixths" — before writing symbols.',
    ],
    extension: ['Find two fractions that add to exactly 1, where the denominators differ.'],
    materialsNeeded: ['Fraction strips', 'Number line marked in sixths'],
  },

  reviewStatus: 'authored_draft',
};

// ===========================================================================
// §7.9 — A Pinch of History (p. 185)
// ===========================================================================

export const SECTION_7_9: AuthoredSection = {
  contentArtifactId: 'ncert_gp_c6_s7_9_lesson',
  contentArtifactVersion: 1,
  source: source('7.9', 'A Pinch of History', 185, 'ncert_gp_c6_s7_9'),

  competencyCandidates: [
    {
      id: 'MIDDLE:C-9.1',
      justification:
        'The section is about how fraction ideas developed in different civilisations — exactly what C-9.1 names.',
    },
    {
      id: 'MIDDLE:C-9.2',
      justification:
        'It names Indian mathematicians and the Sulba-sutras, which C-9.2 names specifically.',
    },
  ],
  competencyMappingStatus: 'competency_proposed',

  sequence: {
    prerequisiteSectionIds: ['ncert_gp_c6_s7_8'],
    mayAssume: ['All fraction notation and operations from this chapter'],
    mustNotIntroduce: [],
  },

  learningGoal:
    'You will learn where fraction notation and methods came from, and that mathematics was built by people over time.',

  priorKnowledgeCheck: {
    prompt: 'You are ready if you can:',
    checks: ['Write and read a fraction.', 'Add two fractions.'],
    ifNotReady: 'Work through the earlier parts of this chapter first.',
  },

  vocabulary: [
    { term: 'Sulba-sutras', meaning: 'Ancient Indian texts, from Vedic times, containing rules of geometry and arithmetic.' },
  ],

  explanation: [
    'Fractions are older than the way we write them. People needed to share and measure long before anyone drew a line between two numbers.',
    'In India, fractions were used and written about very early. The Sulba-sutras, from Vedic times, show that rules for working with fractions were already known.',
    'Indian mathematicians were among the first to set out general rules for calculating with fractions — including addition, subtraction, multiplication and even division.',
    'The way we write a fraction, with one number above another, developed over centuries and in several places. The horizontal line we use came later than the idea itself.',
    'This matters for a reason beyond history: it shows that mathematics was not handed down finished. People invented notation because they needed it, argued about it, and improved it.',
  ],

  representations: ['Historical notation compared with modern notation'],

  visuals: [],
  visualsById: {},

  workedExamples: [
    {
      id: 's79.we1',
      prompt: 'Why might people have needed fractions before they had a way to write them?',
      steps: [
        { text: 'People shared food, land and cloth long before formal notation existed.', reasoning: 'Sharing creates parts of a whole whether or not you can write them down.' },
        { text: 'They also measured things that did not fit whole units.', reasoning: 'Exactly the problem §7.3 describes.' },
        { text: 'So the IDEA came first, and the notation was invented to record it.', reasoning: 'Notation follows need.' },
      ],
      answer: 'Because sharing and measuring create fractions whether or not you can write them.',
    },
    // v0.75 §22 — the second worked example the completeness gate asked
    // for.
    //
    // §7.9 is a history section, and the temptation was to add a
    // fraction computation to make the count. That would have been the
    // §7.9 failure mode in miniature: satisfying a counter with content
    // the section does not teach. The reasoning this section DOES teach
    // is how to read a claim about the past, so the example walks that
    // instead — and its steps are as explicit as any arithmetic one.
    {
      id: 's79.we2',
      prompt:
        'Someone says: "Indians invented fractions." Is that a fair thing to say?',
      steps: [
        {
          text: 'Separate the idea from the notation. These are two different claims.',
          reasoning:
            'The section shows the idea and the way of writing it have different histories.',
        },
        {
          text: 'The IDEA of a part of a whole appears wherever people share or measure.',
          reasoning:
            'No single civilisation could invent it, because the need arises everywhere.',
        },
        {
          text: 'The RULES for calculating with fractions were set out early in India — the Sulba-sutras record them.',
          reasoning: 'That part of the claim is supported by the source.',
        },
        {
          text: 'So a fairer sentence names what was contributed rather than claiming the whole.',
          reasoning:
            'Precision matters more than pride: the real contribution is impressive without overstating it.',
        },
      ],
      answer:
        'Not quite. Indian mathematicians were among the first to write down general RULES for calculating with fractions, but the idea of a fraction is older and arose in many places.',
    },
  ],

  misconceptionIds: [],

  guidedPractice: [
    {
      id: 's79.g1',
      prompt: 'Name one ancient Indian source that shows fractions were already in use.',
      hint: 'It is a set of texts about geometry and arithmetic from Vedic times.',
      answer: 'The Sulba-sutras.',
      rationale: 'They contain rules for working with fractions.',
    },
    {
      id: 's79.g2',
      prompt: 'Did the way we WRITE fractions come before or after people used them?',
      hint: 'Which comes first, the need or the symbol?',
      answer: 'After.',
      rationale: 'People shared and measured long before the notation existed.',
    },
  ],

  independentPractice: [
    { id: 's79.i1', prompt: 'Give one everyday situation from long ago that would need fractions.', answer: 'Sharing food or land equally (others possible).', rationale: 'Equal sharing produces fractional parts.' },
    { id: 's79.i2', prompt: 'What does the Sulba-sutras tell us about fractions in India?', answer: 'That rules for working with fractions were known in Vedic times.', rationale: 'The texts record such rules.' },
    // v0.75 §22 — the third independent item. Asks the student to apply
    // the section's actual lesson (notation is a choice, not a law)
    // rather than to recall a date or a name.
    {
      id: 's79.i3',
      prompt:
        'The horizontal line in a fraction came later than fractions themselves. What does that tell you about mathematical notation in general?',
      answer:
        'That notation is invented by people to record an idea, and could have been written another way (others possible).',
      rationale:
        'The section shows notation developing over centuries and in several places, so it is a choice that was made rather than a rule that was found.',
    },
  ],

  reasoningApplication: [
    {
      id: 's79.r1',
      prompt: 'Mathematics is sometimes described as "discovered" and sometimes as "invented". Thinking about fraction notation, which word fits better, and why?',
      expectedReasoning:
        'The IDEA of a part of a whole seems discovered — sharing produces it whether or not anyone writes it. But the NOTATION was invented: different civilisations wrote it differently, and our way is one choice among several that worked.',
    },
  ],

  interactivePractice: [],

  summary:
    'Fractions were used and written about in India from very early times. Notation was invented to record ideas people already needed.',
  nextStep: 'You have reached the end of the Fractions chapter.',

  teacher: {
    objective:
      'Students appreciate that fraction ideas and notation developed over time, including significant Indian contributions.',
    prerequisiteKnowledge: ['The rest of Chapter 7'],
    modelLanguage: ['"People needed this before they could write it."'],
    teachingNotes: [
      'This section realises a first-class NCF-SE curricular goal (Middle CG-9), not decoration. Treat it as content, not as a filler page.',
      'Resist turning it into a list of names and dates to memorise. The point is that notation was invented by people solving problems.',
      'There is no interactive practice here, deliberately — the learning is discussion, and a multiple-choice quiz on dates would misrepresent what the section teaches.',
    ],
    quickChecks: ['Why did people need fractions before they had symbols for them?'],
    supportForStrugglingLearners: [
      'Ask students to invent their own way of writing "three of five equal parts" before showing the standard notation.',
    ],
    extension: [
      'Find out how one other civilisation wrote fractions, and compare it with ours.',
    ],
    materialsNeeded: [],
  },

  reviewStatus: 'authored_draft',
};
