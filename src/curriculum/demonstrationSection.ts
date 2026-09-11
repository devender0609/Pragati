// v0.61 §12 — THE DEMONSTRATION SECTION.
//
// Ganita Prakash Grade 6, Chapter 7 Fractions,
// Section 7.4 "Marking Fraction Lengths on the Number Line" (p. 160).
//
// WHY THIS SECTION
//
// 1. It is a genuine gap. Pragati's `fractions` module has 104 items
//    and 7 lessons and NO coverage of 7.4.
// 2. It realises a NAMED Middle Stage competency — C-1.4 explicitly
//    says "visualises them on the number line". This is not an
//    inferred mapping.
// 3. It is inherently visual, so it forces the visual specification
//    system to be built rather than deferred.
// 4. It is small enough to complete properly. The objective is to
//    prove the standard, not to cover the chapter.
//
// STATUS: authored_draft. NOT published, NOT student-ready.
// No educator has reviewed this. `v061DemonstrationSection.test.ts`
// asserts it cannot be marked published.

import type { StagedCompetencyId } from './ncfStages';
import type { NumberLineSpec, FractionStripSpec } from './visualSpecification';
import { emptyUnitStatus, type UnitContentStatus } from './contentStatus';

const f = (numerator: number, denominator: number) => ({
  numerator,
  denominator,
});

// ---------------------------------------------------------------------------
// Source and mapping
// ---------------------------------------------------------------------------

export const DEMO_SECTION_SOURCE = {
  officialSectionId: 'ncert_gp_c6_s7_4',
  officialChapterId: 'ncert_gp_c6_ch07_fractions',
  chapterNumber: 7,
  chapterTitle: 'Fractions',
  sectionNumber: '7.4',
  exactTitle: 'Marking Fraction Lengths on the Number Line',
  startPage: 160,
  textbook: 'Ganita Prakash, Grade 6 (NCERT, Reprint 2026-27)',
  sourceReference: 'https://ncert.nic.in/textbook/pdf/fegp1dd.zip',
  chapterFile: 'fegp107.pdf',
  inspectionDate: '2026-08-24',
  evidenceProvenance: 'primary_source_verified' as const,
} as const;

export const DEMO_SECTION_COMPETENCIES: Array<{
  id: StagedCompetencyId;
  text: string;
  justification: string;
}> = [
  {
    id: 'MIDDLE:C-1.4',
    text: 'Explores and understands sets of numbers — whole numbers, fractions, integers, rational numbers, real numbers — and their properties, and visualises them on the number line',
    justification:
      'Direct: the competency names the number line explicitly, and this section is its Grade 6 realisation for fractions. Among the least interpretive mappings available.',
  },
  {
    id: 'MIDDLE:C-1.6',
    text: 'Explores and applies fractions (both as ratios and in decimal form) in daily-life situations',
    justification:
      'Supporting: the section treats a fraction as a LENGTH, which is the measurement sense underpinning ratio use. Weaker than C-1.4 and offered for educator confirmation, not asserted.',
  },
];

/** Every mapping above is a maintainer's proposal. */
export const DEMO_SECTION_MAPPING_STATUS = 'competency_proposed' as const;

// ---------------------------------------------------------------------------
// Visuals — specifications, not assets
// ---------------------------------------------------------------------------

/** V1: the unit interval divided into fourths, with 3/4 marked. */
export const V1_UNIT_INTERVAL_FOURTHS: NumberLineSpec = {
  type: 'number_line',
  purpose: 'introduce_concept',
  status: 'concept_specific',
  min: f(0, 1),
  max: f(1, 1),
  partitions: 4,
  labelTicks: true,
  markedPoints: [{ value: f(3, 4), label: '3/4', emphasis: 'primary' }],
  highlightFrom: f(0, 1),
  highlightTo: f(3, 4),
  orientation: 'horizontal',
  caption: 'Three-fourths, shown as a length from 0.',
  altText:
    'A number line from 0 to 1 divided into four equal parts. The point three-fourths is marked, and the length from 0 to that point is shaded.',
};

/** V2: the equivalence tier — 1/2 and 2/4 at the SAME point.
 *  This is what a static picture cannot argue and a specification can:
 *  both marks are computed from the same position function. */
export const V2_EQUIVALENCE: NumberLineSpec = {
  type: 'number_line',
  purpose: 'show_equivalence',
  status: 'concept_specific',
  min: f(0, 1),
  max: f(1, 1),
  partitions: 2,
  labelTicks: true,
  markedPoints: [{ value: f(1, 2), label: '1/2', emphasis: 'primary' }],
  equivalenceTier: {
    partitions: 4,
    markedPoints: [{ value: f(2, 4), label: '2/4', emphasis: 'secondary' }],
  },
  orientation: 'horizontal',
  caption: 'One-half and two-fourths are the same point on the line.',
  altText:
    'A number line from 0 to 1. Above it, halves are marked and one-half is labelled. Below it, fourths are marked and two-fourths is labelled at exactly the same position.',
};

/** V3: beyond 1 — where the "fractions are less than one" misconception
 *  breaks. 5/4 is marked on a 0-to-2 line. */
export const V3_BEYOND_ONE: NumberLineSpec = {
  type: 'number_line',
  purpose: 'expose_misconception',
  status: 'concept_specific',
  min: f(0, 1),
  max: f(2, 1),
  partitions: 8,
  labelTicks: true,
  markedPoints: [
    { value: f(5, 4), label: '5/4', emphasis: 'primary' },
    { value: f(1, 1), label: '1', emphasis: 'muted' },
  ],
  highlightFrom: f(0, 1),
  highlightTo: f(5, 4),
  orientation: 'horizontal',
  caption: 'Five-fourths is a real length, and it is longer than 1.',
  altText:
    'A number line from 0 to 2 divided into eighths. Both 1 and five-fourths are marked, with five-fourths to the right of 1.',
};

/** V4: fraction strips, connecting area and length representations.
 *
 *  v0.61 §7 — each strip now states its own denominator and shaded
 *  count, so 1/2, 2/4 and 4/8 are unambiguous, and `assertsEquivalence`
 *  makes the diagram's claim checkable arithmetically. */
export const V4_STRIPS: FractionStripSpec = {
  type: 'fraction_strip',
  purpose: 'show_equivalence',
  status: 'concept_specific',
  strips: [
    { denominator: 2, shadedCount: 1, label: '1/2' },
    { denominator: 4, shadedCount: 2, label: '2/4' },
    { denominator: 8, shadedCount: 4, label: '4/8' },
  ],
  assertsEquivalence: true,
  caption: 'The same length, cut into different numbers of equal parts.',
  altText:
    'Three stacked strips of equal total length, divided into 2, 4 and 8 equal parts. One half, two fourths and four eighths are shaded, all reaching the same point.',
};

export const DEMO_SECTION_VISUALS = [
  V1_UNIT_INTERVAL_FOURTHS,
  V2_EQUIVALENCE,
  V3_BEYOND_ONE,
  V4_STRIPS,
];

// ---------------------------------------------------------------------------
// Student-facing content
// ---------------------------------------------------------------------------

export type WorkedExample = {
  id: string;
  prompt: string;
  steps: Array<{ text: string; reasoning: string }>;
  answer: string;
  /** Which visual supports it, if any. */
  visualRef?: string;
};

export type MisconceptionRecord = {
  id: string;
  misconception: string;
  whyItHappens: string;
  studentFeedback: string;
  teacherNote: string;
};

export const DEMO_SECTION_STUDENT = {
  learningGoal:
    'You will be able to mark a fraction on a number line, and explain why it sits where it does.',

  prerequisiteCheck: {
    prompt: 'Before we start, can you do these?',
    checks: [
      'Split a shape into equal parts and name one part (like one-fourth).',
      'Read a number line with whole numbers on it.',
      'Say what the bottom number of a fraction tells you.',
    ],
    ifNotReady:
      'Go back to "Represent fractions visually" first. It builds what this section needs.',
  },

  explanation: [
    'A fraction is not only a piece of a shape. It is also a LENGTH.',
    'Think about walking from 0 to 1. If you split that walk into 4 equal steps, each step is one-fourth. After 3 steps you have walked three-fourths.',
    'That is what marking a fraction on a number line means: you are showing how far along you have gone.',
    'The bottom number tells you how many equal parts to cut the distance from 0 to 1 into. The top number tells you how many of those parts to count.',
  ],

  representations: [
    'A length along a line (this section)',
    'A shaded part of a shape (from section 7.2)',
    'An equal share of something (from section 7.1)',
  ],

  workedExamples: [
    {
      id: 'WE1',
      prompt: 'Mark 3/4 on a number line from 0 to 1.',
      steps: [
        {
          text: 'The bottom number is 4, so cut 0 to 1 into 4 equal parts.',
          reasoning:
            'The denominator always tells you how many equal parts the whole is cut into.',
        },
        {
          text: 'Count 3 parts from 0.',
          reasoning: 'The numerator tells you how many parts to count.',
        },
        {
          text: 'Mark that point. It is 3/4.',
          reasoning:
            'The mark shows the END of a length of 3 fourths, measured from 0.',
        },
      ],
      answer: 'The third tick after 0, one tick before 1.',
      visualRef: 'V1_UNIT_INTERVAL_FOURTHS',
    },
    {
      id: 'WE2',
      prompt: 'Where does 1/2 sit? And where does 2/4 sit?',
      steps: [
        {
          text: 'For 1/2, cut 0 to 1 into 2 equal parts and count 1.',
          reasoning: 'Halves means two equal parts.',
        },
        {
          text: 'For 2/4, cut 0 to 1 into 4 equal parts and count 2.',
          reasoning: 'Fourths means four equal parts.',
        },
        {
          text: 'Both marks land on the same point.',
          reasoning:
            'Two fourths of a distance is the same distance as one half of it. The names differ; the LENGTH does not.',
        },
      ],
      answer: 'Both sit exactly halfway between 0 and 1.',
      visualRef: 'V2_EQUIVALENCE',
    },
    {
      id: 'WE3',
      prompt: 'Mark 5/4 on a number line from 0 to 2.',
      steps: [
        {
          text: 'Cut each whole into 4 equal parts. So 0 to 1 has 4 parts, and 1 to 2 has 4 more.',
          reasoning:
            'The size of one-fourth does not change just because we went past 1.',
        },
        {
          text: 'Count 5 fourths from 0.',
          reasoning: 'Four fourths gets you to 1. One more fourth goes past it.',
        },
        {
          text: 'The mark is one-fourth past 1.',
          reasoning:
            'A fraction can be more than 1. It just means a length longer than one whole.',
        },
      ],
      answer: 'One tick past 1, when the line is cut into fourths.',
      visualRef: 'V3_BEYOND_ONE',
    },
    {
      // v0.61 §8 — rewritten. The earlier version had Aarav reach the
      // RIGHT answer by faulty reasoning, which made the worked example
      // argue against a conclusion it also affirmed. The misconception
      // is cleaner and far more common in this form: whole-number
      // thinking applied to denominators.
      id: 'WE4',
      prompt:
        'Aarav says 1/4 is greater than 1/3, because 4 is greater than 3. Is he correct?',
      steps: [
        {
          text: 'Both fractions start from the same whole: the distance from 0 to 1.',
          reasoning:
            'Fractions can only be compared when the whole is the same. Here it is.',
        },
        {
          text: 'Cut that distance into 3 equal parts on one line, and into 4 equal parts on another.',
          reasoning:
            'Each fraction here is ONE part, so the question is really which part is bigger.',
        },
        {
          text: 'The more equal parts you cut the same whole into, the smaller each part must be.',
          reasoning:
            'The total length has not changed. Sharing it between more parts leaves less for each one.',
        },
        {
          text: 'So one part out of 4 is shorter than one part out of 3. That means 1/4 is LESS than 1/3.',
          reasoning:
            'Aarav is not correct. A bigger bottom number makes the pieces smaller, not the fraction bigger.',
        },
      ],
      answer:
        'No. 1/4 is less than 1/3, because cutting the same whole into more parts makes each part smaller.',
      visualRef: 'V4_STRIPS',
    },
    {
      id: 'WE5',
      prompt:
        'A number line from 0 to 1 has 6 equal parts. What fraction is the 4th tick?',
      steps: [
        {
          text: 'Six equal parts means each one is one-sixth.',
          reasoning: 'The number of parts gives the denominator.',
        },
        {
          text: 'The 4th tick is 4 parts from 0, so it is 4/6.',
          reasoning: 'Count the parts, not the ticks including zero.',
        },
        {
          text: 'You could also call it 2/3.',
          reasoning:
            'Cutting into 3 parts instead of 6 lands on the same point — the same length with a different name.',
        },
      ],
      answer: '4/6, which is the same point as 2/3.',
    },
  ] as WorkedExample[],

  misconceptions: [
    {
      id: 'M1',
      misconception: 'Counting ticks instead of counting spaces.',
      whyItHappens:
        'Students count the mark at 0 as the first one, so every fraction lands one tick too far left.',
      studentFeedback:
        'Careful — count the SPACES you move, not the marks. Starting at 0 is not a move yet.',
      teacherNote:
        'The most common error in this section. Ask the student to walk it out physically before correcting the notation.',
    },
    {
      id: 'M2',
      misconception: 'Believing every fraction must be less than 1.',
      whyItHappens:
        'All earlier work used fractions of one shape, so the whole was always the limit.',
      studentFeedback:
        'A fraction can go past 1. 5/4 just means five parts, each one-fourth long — and four of them already make 1.',
      teacherNote:
        'Section 7.5 (Mixed Fractions) depends on this being fixed first.',
    },
    {
      id: 'M3',
      misconception: 'Drawing unequal parts and treating them as fractions.',
      whyItHappens:
        'Freehand division produces uneven gaps and the student reads position rather than length.',
      studentFeedback:
        'The parts have to be exactly equal, or the fraction is not what it says it is.',
      teacherNote:
        'Worth catching early — it silently invalidates every later number-line argument.',
    },
    {
      id: 'M4',
      misconception:
        'Thinking a bigger denominator makes a bigger fraction (so 1/4 > 1/3).',
      whyItHappens:
        'Whole-number intuition applied to the bottom number: 4 is more than 3, so the fraction looks larger.',
      studentFeedback:
        'More parts means each part is smaller. Look at the strips: eighths are thinner than fourths.',
      teacherNote: 'Addressed directly by WE4; expect it to recur in 7.7.',
    },
  ] as MisconceptionRecord[],

  guidedPractice: [
    {
      prompt: 'A line from 0 to 1 is cut into 5 equal parts. Mark 2/5.',
      hint: 'How many spaces do you move from 0?',
      answer: 'The 2nd tick after 0.',
    },
    {
      prompt: 'Mark 3/6 and 1/2 on the same line. What do you notice?',
      hint: 'Try cutting into 6 parts, then check where halfway is.',
      answer: 'They land on the same point.',
    },
    {
      prompt: 'A line from 0 to 2 is cut into thirds. Mark 4/3.',
      hint: 'Three thirds makes 1. How much further is one more third?',
      answer: 'One third past 1.',
    },
  ],

  independentPractice: [
    { prompt: 'Mark 1/4 on a line from 0 to 1.', answer: 'First tick of four.' },
    { prompt: 'Mark 5/8 on a line from 0 to 1.', answer: 'Fifth tick of eight.' },
    { prompt: 'Mark 7/4 on a line from 0 to 2.', answer: 'Three fourths past 1.' },
    { prompt: 'Which is further from 0: 2/3 or 3/5?', answer: '2/3.' },
    {
      prompt: 'A tick sits exactly halfway between 0 and 1 on a line cut into eighths. Which fraction is it?',
      answer: '4/8, the same point as 1/2.',
    },
  ],

  reasoningApplication: [
    {
      prompt:
        'Meera marked 2/3 on a line from 0 to 1 by putting it two ticks from the RIGHT end. Is she correct? Explain how you know.',
      expectedReasoning:
        'Counting from the right gives 1/3, not 2/3. Fractions on a number line are measured as a length FROM 0.',
    },
    {
      prompt:
        'A rope is 3/4 of a metre long. On a metre-long number line, where does the end of the rope sit? Would a rope of 6/8 m end at a different place?',
      expectedReasoning:
        'Both end at the same point, because 3/4 and 6/8 are the same length. This connects the number line to real measurement.',
    },
  ],

  summary:
    'A fraction shows a length from 0. The bottom number says how many equal parts to cut into; the top number says how many to count. Different names can point at the same place.',

  nextStep:
    'Next: Mixed Fractions (section 7.5) — what to call a length that goes past 1.',
};

// ---------------------------------------------------------------------------
// Teacher-facing content
// ---------------------------------------------------------------------------

export const DEMO_SECTION_TEACHER = {
  officialReference:
    'Ganita Prakash Grade 6, Chapter 7 Fractions, Section 7.4 (p. 160)',
  competencyMapping: DEMO_SECTION_COMPETENCIES,
  competencyMappingStatus: DEMO_SECTION_MAPPING_STATUS,

  prerequisiteKnowledge: [
    'Equal partitioning of a whole (7.1, 7.2)',
    'Reading a number line with whole numbers',
    'Meaning of numerator and denominator',
  ],

  teachingNotes: [
    'Lead with LENGTH, not with shading. Students arrive from 7.1–7.2 thinking of fractions as parts of shapes; the number line asks them to think of a fraction as a distance, and that shift is the actual content of this section.',
    'Have students walk or step out the partition physically before drawing it. The counting-ticks error (M1) almost never survives being walked.',
    'Do not introduce mixed numbers here. 5/4 should stay as 5/4 — naming it 1¼ is section 7.5 and short-circuits the reasoning this section is building.',
    'Equal parts must be exact. A freehand line with uneven gaps teaches the wrong thing invisibly; use folded paper strips or squared paper.',
  ],

  likelyMisconceptions: DEMO_SECTION_STUDENT.misconceptions,

  questioningPrompts: [
    'How many equal parts did you cut it into? How do you know they are equal?',
    'Show me the LENGTH of 3/4, not just the point. Where does it start?',
    'Can two different fractions sit on the same spot? Why?',
    'What happens if we keep counting past 1?',
  ],

  supportForStrugglingLearners: [
    'Use folded paper strips before any drawn line — the fold guarantees equal parts.',
    'Stay within 0 to 1 until the counting is secure, then extend.',
    'Let the student say the fraction aloud as "three of the four parts" before writing 3/4.',
  ],

  extension: [
    'Ask for a fraction between 1/2 and 3/4, and how they would find one. This leads naturally into 7.7 (Comparing Fractions).',
    'Ask how many different names one point can have. Connects to 7.6 (Equivalent Fractions).',
  ],

  answerRationales: DEMO_SECTION_STUDENT.workedExamples.map((w) => ({
    id: w.id,
    answer: w.answer,
    rationale: w.steps.map((s) => s.reasoning).join(' '),
  })),
};

// ---------------------------------------------------------------------------
// Status — deliberately NOT published
// ---------------------------------------------------------------------------

/**
 * v0.61 §12 — the honest status of this section.
 *
 * Lesson, worked examples and visuals are authored and concept-specific.
 * NOTHING is reviewed. No educator has seen it. It is not student-ready
 * and it is not a complete unit, and the axes say so individually
 * rather than being summarised into one optimistic flag.
 */
export function demonstrationSectionStatus(): UnitContentStatus {
  const s = emptyUnitStatus(DEMO_SECTION_SOURCE.officialSectionId);
  s.officialCurriculum = 'mapped';
  s.lesson = 'authored_draft';
  s.workedExamples = 'draft';
  s.visuals = 'concept_specific';
  s.guidedPractice = 'draft';
  s.independentPractice = 'draft';
  s.mixedApplicationPractice = 'draft';
  s.teacherResources = 'draft';
  // No blueprint exists for this section.
  s.unitCheck = 'unavailable';
  return s;
}
