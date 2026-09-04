// v0.67 §2/§3/§5 — AUTHORED DRAFTS: §7.1, §7.2, §7.3, §7.5.
//
// Sequenced against the textbook, not against Pragati's old module. The
// old `fractions` module jumped straight to representation and
// operations; Ganita Prakash spends three sections building the idea of
// a fractional unit from SHARING before naming a/b, and does not reach
// the number line until §7.4.
//
// Every section records what it may assume and what it must not
// introduce. §7.1–§7.3 therefore contain no number lines: that
// representation belongs to §7.4 and using it early would teach the
// chapter out of order.
//
// STATUS: authored_draft. Nobody has reviewed any of this.

import type { AuthoredSection } from './authoredSection';
import type { NumberLineSpec, FractionStripSpec, FractionAreaModelSpec } from './visualSpecification';
import type { InstructionalItem } from './instructionalInteraction';

const f = (n: number, d: number) => ({ numerator: n, denominator: d });

const SRC = 'https://ncert.nic.in/textbook/pdf/fegp1dd.zip';
const BOOK = 'Ganita Prakash, Grade 6 (NCERT, Reprint 2026-27)';
const CH = 'ncert_gp_c6_ch07_fractions';
const INSPECTED = '2026-08-24';

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
// §7.1 — Fractional Units and Equal Shares (p. 151)
// ===========================================================================

const S71_STRIPS: FractionStripSpec = {
  type: 'fraction_strip',
  purpose: 'compare_quantities',
  status: 'concept_specific',
  strips: [
    { denominator: 2, shadedCount: 1, label: '1/2' },
    { denominator: 3, shadedCount: 1, label: '1/3' },
    { denominator: 5, shadedCount: 1, label: '1/5' },
    { denominator: 9, shadedCount: 1, label: '1/9' },
  ],
  // These are NOT equal — the whole point is that they shrink.
  assertsEquivalence: false,
  caption: 'One share each, when the same roti is shared among more people.',
  altText:
    'Four strips of the same length divided into 2, 3, 5 and 9 equal parts. One part is shaded in each, and the shaded part gets visibly smaller as the number of parts increases.',
};

const S71_UNEQUAL: FractionAreaModelSpec = {
  type: 'fraction_area_model',
  purpose: 'expose_misconception',
  status: 'concept_specific',
  shape: 'rectangle',
  partitions: 4,
  shadedParts: 1,
  caption: 'Fourths only if all four parts are the same size.',
  altText:
    'A rectangle divided into four equal parts with one shaded, showing one-fourth.',
};

// v0.68 §5 — INTERACTION DECISION FOR §7.1: YES, ONE ITEM.
//
// The question asked was the one §5 sets: does an interactive response
// evidence something static practice cannot? Here it does. Guided item
// s71.g3 asks "a ribbon is cut into 3 pieces, one much longer — is each
// piece 1/3?" and accepts the word "No". A student can answer "No"
// having learnt that ribbon questions are trick questions.
//
// Selecting the correctly partitioned region from three candidates, one
// of which is unequally divided and one of which is equal but wrongly
// counted, requires reading the partition itself. That is why this uses
// `area_model_selection` and not the existing strip format: a strip is
// built from one denominator and literally cannot render unequal parts.
const S71_PRACTICE: InstructionalItem[] = [
  {
    itemId: 's71.p1',
    use: 'instructional_practice',
    officialSectionId: 'ncert_gp_c6_s7_1',
    format: 'area_model_selection',
    prompt: 'Which picture shows one-fourth shaded?',
    targetValue: f(1, 4),
    requiresEqualParts: true,
    options: [
      {
        id: 'a',
        partWidths: [f(1, 4), f(1, 4), f(1, 4), f(1, 4)],
        shadedIndices: [0],
        altText: 'A rectangle in four equal parts with one part shaded.',
      },
      {
        id: 'b',
        // Four parts, one shaded, but the parts are NOT equal. This is
        // the unequal-parts error and nothing else: the count is right,
        // so the only thing the student can have missed is equality.
        partWidths: [f(1, 2), f(1, 6), f(1, 6), f(1, 6)],
        shadedIndices: [0],
        altText:
          'A rectangle in four parts, one much wider than the other three, with the widest part shaded.',
        misconceptionId: 'unequal_parts',
      },
      {
        id: 'c',
        // Equal parts, wrong count. Could be a miscount, a misread of
        // the prompt, or a slip — so no diagnosis.
        partWidths: [f(1, 4), f(1, 4), f(1, 4), f(1, 4)],
        shadedIndices: [0, 1],
        altText: 'A rectangle in four equal parts with two parts shaded.',
      },
    ],
    correctFeedback:
      'Yes. Four equal parts, one shaded — that is one-fourth.',
    neutralIncorrectFeedback:
      'Check two things: are all the parts the same size, and how many are shaded?',
  },
];

export const SECTION_7_1: AuthoredSection = {
  contentArtifactId: 'ncert_gp_c6_s7_1_lesson',
  contentArtifactVersion: 1,
  source: source('7.1', 'Fractional Units and Equal Shares', 151, 'ncert_gp_c6_s7_1'),

  competencyCandidates: [
    {
      id: 'MIDDLE:C-1.6',
      justification:
        'The section builds fractions from equal sharing in daily-life contexts (roti, rice, juice), which is the applied sense C-1.6 names.',
    },
  ],
  competencyMappingStatus: 'competency_proposed',

  sequence: {
    prerequisiteSectionIds: [],
    mayAssume: [
      'Whole numbers and division as sharing',
      'The idea of cutting something into pieces',
    ],
    mustNotIntroduce: [
      { concept: 'Fractions on a number line', belongsToSection: 'ncert_gp_c6_s7_4' },
      { concept: 'Mixed fractions', belongsToSection: 'ncert_gp_c6_s7_5' },
      { concept: 'Equivalent fractions', belongsToSection: 'ncert_gp_c6_s7_6' },
      { concept: 'Adding fractions', belongsToSection: 'ncert_gp_c6_s7_8' },
    ],
  },

  learningGoal:
    'You will understand what a fractional unit is, and why sharing among more people gives each person less.',

  priorKnowledgeCheck: {
    prompt: 'Before you start, can you do these?',
    checks: [
      'Share 12 sweets equally among 4 friends.',
      'Cut a shape into equal parts.',
      'Say what "equal" means when you split something.',
    ],
    ifNotReady:
      'Try sharing real objects — counters, paper strips — into equal groups first.',
  },

  vocabulary: [
    { term: 'fractional unit', meaning: 'One part when a whole is cut into equal parts. Also called a unit fraction.' },
    { term: 'equal share', meaning: 'Each person gets exactly the same amount.' },
    { term: 'whole', meaning: 'The one thing being shared or divided.' },
  ],

  explanation: [
    'Suppose one roti is shared equally among 5 children. Each child gets one share out of 5 equal shares. We write that share as 1/5.',
    'Now share the same roti among 9 children instead. Each child still gets one share — but out of 9 equal shares. We write it as 1/9.',
    'Which child got more? The one sharing with 5 people. Sharing with more people means each share is smaller.',
    'So 1/9 is LESS than 1/5, even though 9 is a bigger number than 5. The bottom number tells you how many people are sharing, not how much you get.',
    'When one whole is divided into equal parts, each part is called a fractional unit. 1/2, 1/3, 1/4, 1/5, 1/100 are all fractional units.',
    'One thing matters every time: the parts must be exactly equal. If one piece is bigger than another, they are not fourths at all.',
  ],

  representations: [
    'Equal shares of one object (roti, chapati, cake)',
    'Strips of the same length cut into different numbers of equal parts',
  ],

  visuals: [S71_STRIPS, S71_UNEQUAL],
  visualsById: { S71_STRIPS, S71_UNEQUAL },

  workedExamples: [
    {
      id: 's71.we1',
      // v0.68 §9 audit — REWRITTEN. The original read "Three guavas
      // together weigh 1 kg. They are about the same size." and then
      // divided by three. Similar size does not give equal weight, so
      // the example taught that an eyeballed resemblance licenses an
      // exact fractional model. Since §7.1's whole point is that the
      // parts must be EXACTLY equal, the example contradicted its own
      // section. The premise is now a stated equal division.
      prompt: 'One kilogram of guavas is divided equally into 3 bags. What does each bag weigh?',
      steps: [
        { text: '1 kg is being shared equally among 3 bags.', reasoning: 'The whole here is 1 kg, and it splits into 3 equal parts.' },
        { text: 'Each bag holds one of those 3 equal parts.', reasoning: 'One part out of three equal parts is written 1/3.' },
        { text: 'So each bag weighs 1/3 kg.', reasoning: 'The fractional unit is 1/3 because the whole was cut into 3 equal parts.' },
      ],
      answer: '1/3 kg.',
      visualRef: 'S71_STRIPS',
    },
    {
      id: 's71.we2',
      prompt: 'Which is greater: 1/5 or 1/9?',
      steps: [
        { text: 'Imagine one roti shared among 5 children, then among 9 children.', reasoning: 'Same whole both times, so the shares can be compared fairly.' },
        { text: 'With 9 children, each share must be smaller than with 5.', reasoning: 'The same roti is being split into more pieces, so each piece is smaller.' },
        { text: 'So 1/5 is greater than 1/9.', reasoning: 'A bigger bottom number means smaller pieces, not a bigger fraction.' },
      ],
      answer: '1/5 is greater.',
      visualRef: 'S71_STRIPS',
    },
    {
      id: 's71.we3',
      prompt: 'A shopkeeper packs 1 kg of rice into 4 packets of equal weight. What does each packet weigh?',
      steps: [
        { text: 'The whole is 1 kg and it is split into 4 equal packets.', reasoning: 'Equal weight is stated, so these really are fourths.' },
        { text: 'Each packet is 1 out of 4 equal parts.', reasoning: 'That is the fractional unit 1/4.' },
      ],
      answer: '1/4 kg.',
    },
  ],

  misconceptionIds: ['more_parts_means_bigger', 'unequal_parts_still_count', 'parts_count_vs_part_size'],

  guidedPractice: [
    {
      id: 's71.g1',
      // v0.69 §30 — one of five cake contexts in §7.1-7.2. Measurement
      // gives the same mathematics and a different setting.
      prompt: 'One litre of milk is shared equally among 8 glasses. How much is in each glass?',
      hint: 'How many equal parts is the litre divided into?',
      answer: '1/8 of a litre.',
      rationale: 'Eight equal shares, so each one is the fractional unit 1/8.',
    },
    {
      id: 's71.g2',
      prompt: 'Which share is bigger: 1/6 of a roti or 1/10 of the same roti?',
      hint: 'Which one is being shared among more people?',
      answer: '1/6.',
      rationale: 'Ten shares means smaller pieces than six shares of the same roti.',
      visualRef: 'S71_STRIPS',
    },
    {
      id: 's71.g3',
      prompt: 'A ribbon is cut into 3 pieces, but one piece is much longer. Is each piece 1/3?',
      hint: 'What must be true about the parts before we can call them thirds?',
      answer: 'No.',
      rationale: 'Thirds must be exactly equal. Unequal pieces are not fractional units.',
    },
  ],

  independentPractice: [
    { id: 's71.i1', prompt: 'One watermelon is shared equally among 7 people. What is each share?', answer: '1/7', rationale: 'Seven equal shares of one whole.' },
    { id: 's71.i2', prompt: 'Which is greater, 1/3 or 1/8?', answer: '1/3', rationale: 'Fewer shares means each share is larger.' },
    { id: 's71.i3', prompt: 'Four friends share 1 litre of juice equally. How much does each get?', answer: '1/4 litre', rationale: 'One litre split into four equal parts.' },
    { id: 's71.i4', prompt: 'Order these from smallest to largest: 1/2, 1/7, 1/4.', answer: '1/7, 1/4, 1/2', rationale: 'The larger the bottom number, the smaller each unit.' },
    { id: 's71.i5', prompt: 'Is 1/100 bigger or smaller than 1/200?', answer: 'Bigger', rationale: 'Sharing among 100 gives more each than sharing among 200.' },
  ],

  reasoningApplication: [
    {
      id: 's71.r1',
      prompt: 'Arvin says 1/9 must be bigger than 1/5 because 9 is bigger than 5. What would you say to him?',
      expectedReasoning:
        'The bottom number counts how many people share, not how much each gets. More sharers means smaller shares, so 1/9 is smaller.',
    },
    {
      id: 's71.r2',
      prompt: 'Two rotis are different sizes. Is half of the small one the same as half of the big one? Explain.',
      expectedReasoning:
        'No — the whole is different. Fractions can only be compared when they are of the same whole.',
    },
  ],

  interactivePractice: S71_PRACTICE,

  summary:
    'A fractional unit is one part of a whole cut into equal parts. More parts means each part is smaller. The parts must be exactly equal.',
  nextStep: 'Next: what happens when you take more than one of those parts.',

  teacher: {
    objective:
      'Students understand a fractional unit as an equal share, and that unit fractions get smaller as the denominator grows.',
    prerequisiteKnowledge: ['Equal sharing', 'Whole-number division'],
    modelLanguage: [
      '"One roti shared among five children — each child gets one-fifth."',
      '"More people sharing, smaller share each."',
    ],
    teachingNotes: [
      'The textbook opens with Beni and Arvin arguing about 1/5 and 1/9. Use that dialogue — the misconception is the entry point, not an afterthought.',
      'Insist on the word "equal" every time. A student who accepts unequal parts as thirds will carry that error into every later section.',
      'Do NOT introduce the number line here. That is §7.4, and it needs the idea of a fraction as a length, which this section has not built yet.',
    ],
    quickChecks: [
      'Which is more, 1/4 or 1/6? How do you know?',
      'Show me one-third of this strip. How do you know the parts are equal?',
    ],
    supportForStrugglingLearners: [
      'Use folded paper strips — folding guarantees equal parts without measuring.',
      'Act out the sharing with real counters before writing any symbol.',
    ],
    extension: [
      'What is the biggest fractional unit? Is there a smallest one?',
    ],
    materialsNeeded: ['Paper strips', 'Counters or beads'],
  },

  reviewStatus: 'authored_draft',
};

// ===========================================================================
// §7.2 — Fractional Units as Parts of a Whole (p. 154)
// ===========================================================================

const S72_AREA: FractionAreaModelSpec = {
  type: 'fraction_area_model',
  purpose: 'introduce_concept',
  status: 'concept_specific',
  shape: 'rectangle',
  partitions: 8,
  shadedParts: 3,
  caption: 'Three of the eight equal parts are shaded: 3/8.',
  altText:
    'A rectangle divided into eight equal parts with three of them shaded, showing three-eighths.',
};

const S72_CIRCLE: FractionAreaModelSpec = {
  type: 'fraction_area_model',
  purpose: 'reveal_structure',
  status: 'concept_specific',
  shape: 'circle',
  partitions: 4,
  shadedParts: 3,
  caption: 'Three-fourths, shown as parts of a circle.',
  altText:
    'A circle divided into four equal sectors with three shaded, showing three-fourths.',
};

// v0.68 §5 — INTERACTION DECISION FOR §7.2: YES, ONE ITEM.
//
// §7.2 teaches that a/b is a COUNT of fractional units. Reading 3/8 off
// a given diagram is what the static items already do. Going the other
// way — being told 3/8 and finding the region that shows it — is the
// direction the section's own worked example never tests, and it fails
// differently: a student who has learnt "top number, count the shaded"
// as a procedure cannot apply it in reverse without the meaning.
const S72_PRACTICE: InstructionalItem[] = [
  {
    itemId: 's72.p1',
    use: 'instructional_practice',
    officialSectionId: 'ncert_gp_c6_s7_2',
    format: 'area_model_selection',
    prompt: 'Which picture shows 3/8 shaded?',
    targetValue: f(3, 8),
    requiresEqualParts: true,
    options: [
      {
        id: 'a',
        partWidths: Array.from({ length: 8 }, () => f(1, 8)),
        shadedIndices: [0, 1, 2],
        altText: 'A rectangle in eight equal parts with three shaded.',
      },
      {
        id: 'b',
        // Eight equal parts, but eight shaded minus three left blank —
        // the numerator and denominator read the wrong way round. Not
        // safely diagnosable: five shaded out of eight is also just a
        // miscount, so this gets neutral guidance.
        partWidths: Array.from({ length: 8 }, () => f(1, 8)),
        shadedIndices: [0, 1, 2, 3, 4],
        altText: 'A rectangle in eight equal parts with five shaded.',
      },
      {
        id: 'c',
        // Three shaded out of three: the student has taken the top
        // number as the number of parts.
        partWidths: [f(1, 3), f(1, 3), f(1, 3)],
        shadedIndices: [0, 1, 2],
        altText: 'A rectangle in three equal parts with all three shaded.',
      },
    ],
    correctFeedback:
      'Yes. Eight equal parts make eighths, and three of them are shaded.',
    neutralIncorrectFeedback:
      'The bottom number says how many equal parts the whole is cut into. The top number says how many to shade.',
  },
];

export const SECTION_7_2: AuthoredSection = {
  contentArtifactId: 'ncert_gp_c6_s7_2_lesson',
  contentArtifactVersion: 1,
  source: source('7.2', 'Fractional Units as Parts of a Whole', 154, 'ncert_gp_c6_s7_2'),

  competencyCandidates: [
    {
      id: 'MIDDLE:C-1.6',
      justification:
        'Naming a/b as a count of fractional units is the foundation of applying fractions, which C-1.6 names.',
    },
  ],
  competencyMappingStatus: 'competency_proposed',

  sequence: {
    prerequisiteSectionIds: ['ncert_gp_c6_s7_1'],
    mayAssume: [
      'A fractional unit is one equal part of a whole',
      'More parts means each part is smaller',
    ],
    mustNotIntroduce: [
      { concept: 'Fractions on a number line', belongsToSection: 'ncert_gp_c6_s7_4' },
      { concept: 'Mixed fractions', belongsToSection: 'ncert_gp_c6_s7_5' },
      { concept: 'Equivalent fractions', belongsToSection: 'ncert_gp_c6_s7_6' },
      { concept: 'Comparing unlike fractions', belongsToSection: 'ncert_gp_c6_s7_7' },
    ],
  },

  learningGoal:
    'You will be able to name a fraction like 3/8, and say what each number tells you.',

  priorKnowledgeCheck: {
    prompt: 'From the last part, can you do these?',
    checks: [
      'Say what 1/5 means.',
      'Explain why 1/9 is smaller than 1/5.',
      'Check whether parts of a shape are equal.',
    ],
    ifNotReady: 'Go back to Fractional Units and Equal Shares first.',
  },

  vocabulary: [
    { term: 'numerator', meaning: 'The top number. It counts how many parts you have.' },
    { term: 'denominator', meaning: 'The bottom number. It tells you how many equal parts the whole was cut into.' },
  ],

  explanation: [
    'In the last part you met fractional units like 1/8 — one part of a whole cut into 8 equal pieces.',
    'Now take more than one of those pieces. If you take 3 of the 8 equal pieces, you have three-eighths, written 3/8.',
    'So a fraction is really a COUNT of fractional units. 3/8 means "three lots of 1/8".',
    'The bottom number, the denominator, tells you how many equal parts the whole was cut into. It fixes the SIZE of each part.',
    'The top number, the numerator, counts how many of those parts you have taken.',
    'This works for any shape, as long as the parts are equal — a strip, a rectangle, a circle. What matters is how much of the whole is covered, not what the whole looks like.',
  ],

  representations: [
    'Parts of a rectangle',
    'Parts of a circle',
    'Counting fractional units',
  ],

  visuals: [S72_AREA, S72_CIRCLE],
  visualsById: { S72_AREA, S72_CIRCLE },

  workedExamples: [
    {
      id: 's72.we1',
      prompt: 'A rectangle is cut into 8 equal parts and 3 are shaded. What fraction is shaded?',
      steps: [
        { text: 'The whole is cut into 8 equal parts, so each part is 1/8.', reasoning: 'The denominator comes from how many equal parts the whole was cut into.' },
        { text: 'Three of those parts are shaded.', reasoning: 'The numerator counts the parts we have.' },
        { text: 'So 3/8 is shaded.', reasoning: 'Three lots of one-eighth.' },
      ],
      answer: '3/8',
      visualRef: 'S72_AREA',
    },
    {
      id: 's72.we2',
      prompt: 'What does 5/6 mean?',
      steps: [
        { text: 'The bottom number 6 says the whole was cut into 6 equal parts.', reasoning: 'That fixes the size of each part as 1/6.' },
        { text: 'The top number 5 says we have 5 of them.', reasoning: 'The numerator counts the parts.' },
        { text: 'So 5/6 means five lots of one-sixth.', reasoning: 'A fraction is a count of fractional units.' },
      ],
      answer: 'Five of the six equal parts of one whole.',
    },
    {
      id: 's72.we3',
      // v0.68 §9 audit — PROMPT REWRITTEN. The original asked whether
      // the coloured circle was "the same amount as" 3 of 4 parts of a
      // rectangle. If the two shapes are different sizes the answer is
      // no, and the old answer covered itself with "of their own
      // whole" while the prompt still said "the same amount". The
      // question now asks what fraction each shows, which is the thing
      // §7.2 actually teaches, and the same-whole caveat is stated
      // rather than dodged.
      prompt: 'A circle is cut into 4 equal sectors and 3 are coloured. A rectangle is cut into 4 equal parts and 3 are shaded. What fraction does each one show?',
      steps: [
        { text: 'Both wholes are cut into 4 equal parts.', reasoning: 'Same denominator, so each part is one-fourth of its own whole.' },
        { text: 'Both have 3 parts coloured.', reasoning: 'Same numerator.' },
        { text: 'Each one shows 3/4 of its own whole, even though the shapes differ.', reasoning: 'The fraction describes how much of the whole is covered, not the shape.' },
        { text: 'This does not mean the two coloured amounts are equal in size.', reasoning: 'If the circle and the rectangle are different sizes, 3/4 of each is a different amount.' },
      ],
      answer: 'Each shows 3/4 of its own whole.',
      visualRef: 'S72_CIRCLE',
    },
  ],

  misconceptionIds: ['unequal_parts_still_count', 'parts_count_vs_part_size', 'whole_not_the_same'],

  guidedPractice: [
    {
      id: 's72.g1',
      prompt: 'A strip is cut into 5 equal parts and 2 are shaded. Write the fraction.',
      hint: 'Which number tells you how many parts the whole was cut into?',
      answer: '2/5',
      rationale: 'Five equal parts gives the denominator; two shaded gives the numerator.',
      visualRef: 'S72_AREA',
    },
    {
      id: 's72.g2',
      prompt: 'In the fraction 7/10, what does the 10 tell you?',
      hint: 'Is it a count of what you have, or a size?',
      answer: 'The whole was cut into 10 equal parts.',
      rationale: 'The denominator fixes the size of each part, it does not count them.',
    },
    {
      id: 's72.g3',
      // v0.69 §30 — kept as food, since unequal cutting is the point and
      // a cut object shows it best; changed from cake to reduce repetition.
      prompt: 'A watermelon is cut into 6 pieces, but they are not all the same size. Two are eaten. Is 2/6 eaten?',
      hint: 'What has to be true before we can write a fraction?',
      answer: 'No.',
      rationale: 'The parts must be equal. Unequal pieces cannot be named as sixths.',
    },
  ],

  independentPractice: [
    { id: 's72.i1', prompt: 'A shape is cut into 9 equal parts and 4 are shaded. Write the fraction.', answer: '4/9', rationale: 'Four of nine equal parts.' },
    { id: 's72.i2', prompt: 'What does 2/7 mean in words?', answer: 'Two of the seven equal parts of a whole.', rationale: 'Two lots of one-seventh.' },
    { id: 's72.i3', prompt: 'Which number in 5/8 tells you the size of each part?', answer: 'The 8.', rationale: 'The denominator fixes part size.' },
    { id: 's72.i4', prompt: 'Draw or describe a whole where 3/5 is shaded.', answer: 'Five equal parts, three shaded.', rationale: 'Denominator sets the partition; numerator sets the shading.' },
    // v0.69 §30 — was a pizza. Replaced with a context an Indian Grade 6
    // student certainly shares out, and one that carries the same
    // mathematics with no loss.
    { id: 's72.i5', prompt: 'A roti is torn into 8 equal pieces and all 8 are eaten. What fraction is eaten?', answer: '8/8, which is the whole.', rationale: 'All eight of the eight parts.' },
  ],

  reasoningApplication: [
    {
      id: 's72.r1',
      // v0.69 §30 — the same-whole argument needs two objects of
      // DIFFERENT size, which is why this one keeps a food context.
      // Changed to a shared sweet rather than a branded chocolate bar.
      prompt: 'Two children each say they ate 1/2 of a laddoo, but one ate more than the other. How is that possible?',
      expectedReasoning:
        'Their laddoos were different sizes. A fraction only tells you how much of ITS OWN whole was taken.',
    },
  ],

  interactivePractice: S72_PRACTICE,

  summary:
    'A fraction counts fractional units. The bottom number sets how big each part is; the top number counts how many you have.',
  nextStep: 'Next: using these parts to measure things.',

  teacher: {
    objective:
      'Students read and write a/b as a count of fractional units, and can say what each number contributes.',
    prerequisiteKnowledge: ['Fractional units (§7.1)', 'Equal partitioning'],
    modelLanguage: [
      '"Three lots of one-eighth."',
      '"The bottom number tells us the size; the top number counts them."',
    ],
    teachingNotes: [
      'Build a/b from repeated 1/b rather than presenting it as new notation. Students who see 3/8 as "three one-eighths" cope far better with §7.8 addition later.',
      'Vary the shape but keep the whole the same size at first. Changing both shape and size at once makes it impossible to see what the fraction describes.',
      'Do not compare unlike fractions yet — that is §7.7.',
    ],
    quickChecks: [
      'What does the bottom number of 4/9 tell you?',
      'Show me 2/3 of this strip.',
    ],
    supportForStrugglingLearners: [
      'Have the student say the fraction as "three one-eighths" aloud before writing it.',
      'Use pre-partitioned strips so attention stays on counting, not cutting.',
    ],
    extension: ['What does 8/8 mean? What about 0/8?'],
    materialsNeeded: ['Pre-partitioned strips', 'Circle fraction pieces'],
  },

  reviewStatus: 'authored_draft',
};

// ===========================================================================
// §7.3 — Measuring Using Fractional Units (p. 156)
// ===========================================================================

const S73_MEASURE: FractionStripSpec = {
  type: 'fraction_strip',
  purpose: 'model_operation',
  status: 'concept_specific',
  strips: [
    { denominator: 4, shadedCount: 3, label: '3/4 unit' },
    { denominator: 4, shadedCount: 4, label: '1 unit' },
  ],
  assertsEquivalence: false,
  caption: 'A length measured in quarter-units.',
  altText:
    'Two strips of equal total length divided into four equal parts each. The first has three parts shaded, the second has all four shaded.',
};

// v0.68 §5 — INTERACTION DECISION FOR §7.3: YES, ONE ITEM.
//
// §7.3 is about MEASURING: how many fractional units fit along a
// length. The static items ask a student to convert "5 quarter-units"
// into 5/4, which is arithmetic on words. Picking the strip whose
// shading actually reaches the stated length makes the student read a
// quantity off a picture, which is the thing being taught.
//
// Deliberately `fraction_strip_selection`, an EXISTING format, and
// deliberately not a number line: the number line belongs to §7.4 and
// using it here would teach the chapter out of order. §7.3's whole job
// is to build the length idea that §7.4 then puts on a line.
const S73_PRACTICE: InstructionalItem[] = [
  {
    itemId: 's73.p1',
    use: 'instructional_practice',
    officialSectionId: 'ncert_gp_c6_s7_3',
    format: 'fraction_strip_selection',
    prompt: 'Each strip is one unit long. Which one shows 5 eighth-units?',
    strips: [
      { denominator: 8, shadedCount: 3 },
      { denominator: 8, shadedCount: 5 },
      { denominator: 8, shadedCount: 8 },
    ],
    targetValue: f(5, 8),
    correctFeedback: 'Yes. Five of the eight equal parts, measured from the left end.',
    neutralIncorrectFeedback:
      'The unit is cut into 8 equal parts. Count 5 of them along the strip.',
  },
];

export const SECTION_7_3: AuthoredSection = {
  contentArtifactId: 'ncert_gp_c6_s7_3_lesson',
  contentArtifactVersion: 1,
  source: source('7.3', 'Measuring Using Fractional Units', 156, 'ncert_gp_c6_s7_3'),

  competencyCandidates: [
    {
      id: 'MIDDLE:C-1.6',
      justification:
        'Measuring with fractional units is the daily-life application of fractions that C-1.6 names.',
    },
  ],
  competencyMappingStatus: 'competency_proposed',

  sequence: {
    prerequisiteSectionIds: ['ncert_gp_c6_s7_1', 'ncert_gp_c6_s7_2'],
    mayAssume: [
      'Reading and writing a/b',
      'Fractional units and equal parts',
    ],
    mustNotIntroduce: [
      { concept: 'Marking fractions on a number line', belongsToSection: 'ncert_gp_c6_s7_4' },
      { concept: 'Mixed fractions', belongsToSection: 'ncert_gp_c6_s7_5' },
      { concept: 'Adding fractions', belongsToSection: 'ncert_gp_c6_s7_8' },
    ],
  },

  learningGoal:
    'You will be able to measure a length using a fractional unit, and say the result as a fraction.',

  priorKnowledgeCheck: {
    prompt: 'From the last parts, can you do these?',
    checks: ['Write a fraction for a shaded shape.', 'Explain what the bottom number means.'],
    ifNotReady: 'Go back to Fractional Units as Parts of a Whole.',
  },

  vocabulary: [
    { term: 'unit of measure', meaning: 'The length you are counting with.' },
    { term: 'fractional unit of measure', meaning: 'A part of the unit, such as half a unit or a quarter of a unit.' },
  ],

  explanation: [
    'When you measure with a ruler, you count how many units fit along the thing you are measuring.',
    'But most lengths do not fit a whole number of units. A stick might be longer than 2 units and shorter than 3.',
    'So we use a smaller unit. Cut the unit into 4 equal parts, and measure in quarter-units instead.',
    'If a length is exactly 3 of those quarter-units, we say it is 3/4 of a unit.',
    'The smaller the fractional unit, the more precisely you can measure. Eighths measure more finely than fourths.',
    // v0.68 §7 — split. One 33-word sentence carried the section's
    // whole conceptual move; it is now two.
    'This is the same idea as before: a fraction is a count of fractional units.',
    'What has changed is the whole. Here it is a unit of length, not a roti or a shape.',
  ],

  representations: [
    'Strips laid against a length',
    'Counting fractional units along a measure',
  ],

  visuals: [S73_MEASURE],
  visualsById: { S73_MEASURE },

  workedExamples: [
    {
      id: 's73.we1',
      prompt: 'A ribbon is measured with quarter-units and exactly 3 of them fit. How long is it?',
      steps: [
        { text: 'Each measuring piece is one quarter of a unit, so it is 1/4.', reasoning: 'The unit was cut into 4 equal parts.' },
        { text: 'Three of them fit along the ribbon.', reasoning: 'Count the fractional units, exactly as in §7.2.' },
        { text: 'So the ribbon is 3/4 of a unit.', reasoning: 'Three lots of one-fourth.' },
      ],
      answer: '3/4 of a unit.',
      visualRef: 'S73_MEASURE',
    },
    {
      id: 's73.we2',
      prompt: 'A pencil measures 5 half-units. How long is it in units?',
      steps: [
        { text: 'Each piece is 1/2 of a unit.', reasoning: 'The unit was cut into 2 equal parts.' },
        { text: 'Five of them fit.', reasoning: 'Five lots of one-half is 5/2.' },
        { text: 'That is longer than 2 whole units, because 4 halves already make 2.', reasoning: 'A fraction can be more than one whole when the numerator passes the denominator.' },
      ],
      answer: '5/2 of a unit.',
    },
    {
      id: 's73.we3',
      prompt: 'Why might you measure in eighths instead of halves?',
      steps: [
        { text: 'Halves are big, so most lengths will not fit exactly.', reasoning: 'A coarse unit leaves a leftover you cannot name.' },
        { text: 'Eighths are smaller, so more lengths fit exactly.', reasoning: 'Smaller fractional units measure more precisely.' },
      ],
      answer: 'Because eighths measure more precisely than halves.',
    },
  ],

  misconceptionIds: ['parts_count_vs_part_size', 'unequal_parts_still_count'],

  guidedPractice: [
    {
      id: 's73.g1',
      prompt: 'A stick is exactly 5 quarter-units long. Write that as a fraction of a unit.',
      hint: 'How many quarter-units make one whole unit?',
      answer: '5/4 of a unit.',
      rationale: 'Five lots of 1/4. Four of them already make one whole.',
    },
    {
      id: 's73.g2',
      prompt: 'Which measures more precisely: sixths of a unit, or halves?',
      hint: 'Which pieces are smaller?',
      answer: 'Sixths.',
      rationale: 'Smaller fractional units leave a smaller leftover.',
    },
    {
      id: 's73.g3',
      prompt: 'A rope is 7 eighth-units long. Is it longer or shorter than one unit?',
      hint: 'How many eighths make one whole unit?',
      answer: 'Shorter.',
      rationale: 'Eight eighths make one unit, and 7 is fewer than 8.',
    },
  ],

  independentPractice: [
    { id: 's73.i1', prompt: 'A tape is 3 half-units long. Write it as a fraction of a unit.', answer: '3/2', rationale: 'Three lots of one-half.' },
    { id: 's73.i2', prompt: 'A wire is 9 tenth-units long. Is it longer or shorter than a unit?', answer: 'Shorter', rationale: 'Ten tenths make one unit; nine is fewer.' },
    { id: 's73.i3', prompt: 'How many quarter-units make 2 whole units?', answer: '8', rationale: 'Four quarters per unit, twice over.' },
    { id: 's73.i4', prompt: 'A length is 6 sixth-units. How many units is that?', answer: '1 unit', rationale: 'Six sixths make exactly one whole.' },
    // v0.68 §8 audit — REPLACED. The original asked a student to compare
    // 3/4 with 5/8, which needs equivalent fractions (§7.6) and unlike
    // comparison (§7.7). Neither has been taught at §7.3. The keyword
    // sequence validator missed it because the item names no forbidden
    // phrase; the boundary table catches it.
    { id: 's73.i5', prompt: 'How many eighth-units make one unit?', answer: '8', rationale: 'Eight equal parts of the unit make the whole unit.' },
  ],

  reasoningApplication: [
    {
      id: 's73.r1',
      prompt: 'A carpenter measures a plank as 7 quarter-units. Another says it is "nearly 2 units". Are they both right?',
      expectedReasoning:
        'Yes. 8 quarter-units make 2 units, so 7 quarter-units is one quarter short of 2 — nearly 2 units.',
    },
  ],

  interactivePractice: S73_PRACTICE,

  summary:
    'To measure something that does not fit whole units, count fractional units instead. Smaller units measure more precisely.',
  nextStep: 'Next: showing these lengths on a number line.',

  teacher: {
    objective:
      'Students measure lengths in fractional units and express the result as a fraction of a unit.',
    prerequisiteKnowledge: ['Fractional units (§7.1)', 'Naming a/b (§7.2)'],
    modelLanguage: ['"How many quarter-units fit along it?"'],
    teachingNotes: [
      'This section bridges the area/sharing idea of §7.1–§7.2 to the LENGTH idea that §7.4 needs. Students who skip it often struggle to see why a fraction belongs on a line at all.',
      'Fractions greater than one appear naturally here (5 half-units). Let students write 5/2 and resist naming it 2½ — that is §7.5.',
      'Do not draw a number line yet.',
    ],
    quickChecks: ['How many eighth-units make one unit?', 'Is 5/4 more or less than one unit?'],
    supportForStrugglingLearners: [
      'Give physical strips cut to the fractional unit so the counting is concrete.',
    ],
    extension: ['What is the smallest fractional unit you could usefully measure with?'],
    materialsNeeded: ['Paper strips cut into halves, fourths and eighths'],
  },

  reviewStatus: 'authored_draft',
};

// ===========================================================================
// §7.5 — Mixed Fractions (p. 165)
// ===========================================================================

const S75_LINE: NumberLineSpec = {
  type: 'number_line',
  purpose: 'reveal_structure',
  status: 'concept_specific',
  min: { numerator: 0, denominator: 1 },
  max: { numerator: 3, denominator: 1 },
  partitions: 12,
  labelTicks: false,
  markedPoints: [
    { value: { numerator: 7, denominator: 4 }, label: '7/4', emphasis: 'primary' },
    { value: { numerator: 1, denominator: 1 }, label: '1', emphasis: 'muted' },
  ],
  orientation: 'horizontal',
  caption: 'Seven fourths is one whole and three fourths more.',
  altText:
    'A number line from 0 to 3 divided into quarters. The point seven-fourths is marked, lying between 1 and 2.',
};

// v0.68 §5 — INTERACTION DECISION FOR §7.5: YES, TWO ITEMS.
//
// §7.5 is where `mixed_number_is_multiplication` lives, and until now
// the chapter documented that misconception and never tested for it.
//
// The interesting finding from §6: a NEW "mixed_fraction_match" format
// was considered and rejected. Free numeric entry diagnoses this error
// BETTER than any matching interface, because a student who enters 6/4
// for 2¾ has PRODUCED the multiplication, not merely recognised it in a
// list of options. 6 over 4 comes from 2 × 3 and carries the untouched
// denominator; no other method reaches it. That makes it a
// `diagnosticValue` on an existing format rather than a new one.
const S75_PRACTICE: InstructionalItem[] = [
  {
    itemId: 's75.p1',
    use: 'instructional_practice',
    officialSectionId: 'ncert_gp_c6_s7_5',
    format: 'numeric_entry',
    prompt: 'Write 2\u00be as an improper fraction.',
    correctValue: f(11, 4),
    // NOT equivalent-accepting: 22/8 is the same number but this item
    // is about converting wholes into fourths, so the fourths matter.
    acceptEquivalent: false,
    // v0.69 §24/§25 — DIAGNOSIS WITHDRAWN.
    //
    // v0.68 attached `mixed_number_is_multiplication` to 6/4, arguing
    // that only 2 x 3 with the denominator carried unchanged reaches it.
    // Re-checking against §24's test — "could a student type this for
    // another plausible reason?" — the argument fails: 2 + 4 = 6 also
    // reaches 6/4, by adding the whole number to the DENOMINATOR and
    // writing it on top. That is a different error with different
    // teaching, and a student who made it would be told they had
    // multiplied, which they had not.
    //
    // Alternative numbers were tried and every one collided too: for
    // 2⅔ the multiplication route (4/3) collides with whole-plus-
    // numerator; for 3¼ the multiplication route (3/4) collides with
    // reading the whole as a numerator.
    //
    // So the response gets neutral corrective guidance, and
    // `mixed_number_is_multiplication` stays documented but undiagnosed.
    // A wrong diagnosis is worse than none. If §7.5 is to detect this
    // error it needs an option that states its own reasoning, the way
    // §7.7's does — not a bare value.
    diagnosticValues: [],
    correctFeedback:
      'Correct. Two wholes are 8 fourths, and 3 more fourths makes 11/4.',
    neutralIncorrectFeedback:
      'Start with the wholes. Each whole is 4 fourths, so 2 wholes are 8 fourths. Now add the 3 fourths.',
  },
  {
    itemId: 's75.p2',
    use: 'instructional_practice',
    officialSectionId: 'ncert_gp_c6_s7_5',
    format: 'select_point_on_number_line',
    prompt: 'This line runs from 0 to 3. Tap where 7/4 belongs.',
    min: f(0, 1),
    max: f(3, 1),
    partitions: 12,
    correctTickIndex: 7,
    labelTicks: false,
    correctFeedback:
      'Yes. Four fourths reach 1, and three more fourths land between 1 and 2.',
    neutralIncorrectFeedback:
      'Each space is one fourth. Count 7 of them from 0 — you will pass 1.',
  },
];

export const SECTION_7_5: AuthoredSection = {
  contentArtifactId: 'ncert_gp_c6_s7_5_lesson',
  contentArtifactVersion: 1,
  source: source('7.5', 'Mixed Fractions', 165, 'ncert_gp_c6_s7_5'),

  competencyCandidates: [
    {
      id: 'MIDDLE:C-1.4',
      justification:
        'Mixed fractions are a way of naming a rational number, and the section places them on the number line — the visualisation C-1.4 names.',
    },
  ],
  competencyMappingStatus: 'competency_proposed',

  sequence: {
    prerequisiteSectionIds: ['ncert_gp_c6_s7_2', 'ncert_gp_c6_s7_3', 'ncert_gp_c6_s7_4'],
    mayAssume: [
      'Naming a/b as a count of fractional units',
      'Fractions can be greater than 1',
      'Marking a fraction on a number line (§7.4)',
    ],
    mustNotIntroduce: [
      { concept: 'Equivalent fractions', belongsToSection: 'ncert_gp_c6_s7_6' },
      { concept: 'Comparing unlike fractions', belongsToSection: 'ncert_gp_c6_s7_7' },
      { concept: 'Adding fractions', belongsToSection: 'ncert_gp_c6_s7_8' },
    ],
  },

  learningGoal:
    'You will be able to write a fraction greater than 1 as a mixed fraction, and read it correctly.',

  priorKnowledgeCheck: {
    prompt: 'Before you start, can you do these?',
    checks: [
      'Mark 5/4 on a number line.',
      'Say how many fourths make one whole.',
    ],
    ifNotReady: 'Go back to Marking Fraction Lengths on the Number Line.',
  },

  vocabulary: [
    { term: 'mixed fraction', meaning: 'A whole number and a fraction written together, like 1¾.' },
    { term: 'improper fraction', meaning: 'A fraction whose top number is bigger than its bottom number, like 7/4.' },
  ],

  explanation: [
    'You already know a fraction can be more than one whole. 7/4 means seven lots of one-fourth.',
    'Four of those fourths make one whole. That leaves three more fourths.',
    'So 7/4 is one whole and three-fourths. We write that as 1¾ and read it as "one and three-fourths".',
    'The word AND matters. 1¾ does not mean 1 times 3/4 — it means one whole PLUS three-fourths.',
    'Both names are correct. 7/4 and 1¾ are the same amount and sit at the same place on a number line. One is easier for counting parts; the other makes the size obvious at a glance.',
    'To find the mixed fraction, ask how many wholes fit, then what is left over.',
  ],

  representations: [
    'Number line showing the point between whole numbers',
    'Counting how many fractional units make a whole',
  ],

  visuals: [S75_LINE],
  visualsById: { S75_LINE },

  workedExamples: [
    {
      id: 's75.we1',
      prompt: 'Write 7/4 as a mixed fraction.',
      steps: [
        { text: 'Four fourths make one whole.', reasoning: 'The denominator tells you how many parts make a whole.' },
        { text: 'From 7 fourths, take away 4 to make one whole. Three fourths are left.', reasoning: 'Count out the wholes first, then see what remains.' },
        { text: 'So 7/4 = 1¾, read "one and three-fourths".', reasoning: 'One whole and three-fourths more.' },
      ],
      answer: '1¾',
      visualRef: 'S75_LINE',
    },
    {
      id: 's75.we2',
      prompt: 'Write 11/3 as a mixed fraction.',
      steps: [
        { text: 'Three thirds make one whole.', reasoning: 'The denominator is 3.' },
        { text: '11 thirds contains 3 wholes, using 9 thirds.', reasoning: 'Three wholes need 3 x 3 = 9 thirds.' },
        { text: 'That leaves 2 thirds.', reasoning: '11 - 9 = 2.' },
        { text: 'So 11/3 = 3⅔.', reasoning: 'Three wholes and two-thirds more.' },
      ],
      answer: '3⅔',
    },
    {
      id: 's75.we3',
      prompt: 'Write 2⅕ as an improper fraction.',
      steps: [
        { text: 'Each whole is 5 fifths, so 2 wholes are 10 fifths.', reasoning: 'Going the other way: convert the wholes into fractional units.' },
        { text: 'Add the 1 fifth that is already there.', reasoning: '10 fifths and 1 more fifth.' },
        { text: 'So 2⅕ = 11/5.', reasoning: 'Eleven lots of one-fifth.' },
      ],
      answer: '11/5',
    },
    {
      id: 's75.we4',
      prompt: 'Ravi writes 2¾ = 6/4 because 2 x 3 = 6. Is he right?',
      steps: [
        { text: 'He has multiplied 2 by the 3, but the two parts are ADDED, not multiplied.', reasoning: '2¾ means 2 whole ones and three-fourths more.' },
        { text: 'Two wholes are 8 fourths, plus 3 more fourths.', reasoning: 'Each whole is four fourths.' },
        { text: 'So 2¾ = 11/4, not 6/4.', reasoning: 'And 6/4 is less than 2, so his answer could not be right.' },
      ],
      answer: 'No. 2¾ = 11/4.',
    },
  ],

  misconceptionIds: ['mixed_number_is_multiplication', 'parts_count_vs_part_size'],

  guidedPractice: [
    {
      id: 's75.g1',
      prompt: 'Write 9/4 as a mixed fraction.',
      hint: 'How many fourths make one whole?',
      answer: '2¼',
      rationale: 'Eight fourths make two wholes, leaving one fourth.',
    },
    {
      id: 's75.g2',
      prompt: 'Write 3½ as an improper fraction.',
      hint: 'How many halves are in each whole?',
      answer: '7/2',
      rationale: 'Three wholes are 6 halves, plus one more half.',
    },
    {
      id: 's75.g3',
      prompt: 'Between which two whole numbers does 13/5 lie?',
      hint: 'How many fifths make one whole? Two wholes?',
      answer: 'Between 2 and 3.',
      rationale: '10 fifths make 2 wholes, and 15 would make 3.',
      visualRef: 'S75_LINE',
    },
  ],

  independentPractice: [
    { id: 's75.i1', prompt: 'Write 5/2 as a mixed fraction.', answer: '2½', rationale: 'Four halves make two wholes, leaving one half.' },
    { id: 's75.i2', prompt: 'Write 4⅓ as an improper fraction.', answer: '13/3', rationale: 'Four wholes are 12 thirds, plus one more.' },
    { id: 's75.i3', prompt: 'Write 17/6 as a mixed fraction.', answer: '2⅚', rationale: 'Twelve sixths make two wholes, leaving five sixths.' },
    // v0.68 §8 audit — RATIONALE REWRITTEN. The original justified the
    // answer by comparing 1/4 with 1/2, which is unlike-fraction
    // comparison (§7.7). Staying in fourths uses only §7.5's own idea.
    { id: 's75.i4', prompt: 'Which is greater, 9/4 or 2½?', answer: '2½', rationale: '2½ is 10 fourths and 9/4 is 9 fourths, so 2½ is greater.' },
    { id: 's75.i5', prompt: 'A jug holds 7/2 litres. Say that as a mixed fraction.', answer: '3½ litres', rationale: 'Six halves make three litres, leaving one half.' },
  ],

  reasoningApplication: [
    {
      id: 's75.r1',
      prompt: 'A recipe needs 5/4 cups of flour. Would you rather see it written as 5/4 or 1¼? Explain when each is more useful.',
      expectedReasoning:
        '1¼ makes the amount easy to picture. 5/4 is easier if you are measuring with a quarter-cup scoop, because it says exactly how many scoops.',
    },
  ],

  interactivePractice: S75_PRACTICE,

  summary:
    'A fraction greater than 1 can be written as wholes plus a leftover fraction. 7/4 and 1¾ are the same amount.',
  nextStep: 'Next: different names for the same amount.',

  teacher: {
    objective:
      'Students convert between improper and mixed fractions and read mixed fractions correctly.',
    prerequisiteKnowledge: ['Fractions greater than 1 (§7.3, §7.4)', 'Number line (§7.4)'],
    modelLanguage: ['"One AND three-fourths." Always say the "and".'],
    teachingNotes: [
      'Read every mixed fraction aloud with "and". The multiplication misreading (2¾ as 2 x ¾) is common and almost never survives being said correctly.',
      'Use the number line from §7.4 rather than a new representation — the point is that the SAME place has two names.',
      'Do not simplify anything here. Equivalent fractions are §7.6.',
    ],
    quickChecks: ['How many fourths in one whole?', 'Between which whole numbers is 11/3?'],
    supportForStrugglingLearners: [
      'Count fractional units aloud past the whole: "one fourth, two fourths, three fourths, one whole, one and one fourth..."',
    ],
    extension: ['Is 8/4 a mixed fraction? Why not?'],
    materialsNeeded: ['Number line strips marked in fourths'],
  },

  reviewStatus: 'authored_draft',
};
