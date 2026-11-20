// ===========================================================================
// v0.79 §1/§2 — AUTHORED DRAFT: NUMBER PLAY §3.1.
//
// SEQUENCING, RECHECKED AGAINST THE SOURCE (§1 of the brief)
//
// The verified Class 6 registry gives Chapter 3's sections as:
//   3.1  Numbers can Tell us Things            p. 55
//   3.2  Supercells                            p. 56
//   3.3  Patterns of Numbers on the Number Line p. 59
//   3.4  Playing with Digits                   p. 60
//
// So the recommendation to start at 3.1 holds, and the textbook's own
// order is followed.
//
// A CORRECTION TO MY OWN RECOMMENDATION
//
// I previously said §3.1 and §3.2 should come first because "the
// existing lattice and chapter artwork already draw number-grid and
// supercell reasoning". That conflated two different systems. The
// chapter ARTWORK draws a decorative grid; the instructional
// `VisualSpec` union supports only number lines, fraction strips and
// fraction area models. There is no grid representation for teaching.
//
// §3.1 does not need one — it is about reading meaning out of numbers in
// context, and its representations are lists and comparisons in words.
// §3.2 Supercells does: a supercell is a cell larger than its
// neighbours, which is unteachable without a grid of numbers. So §3.2
// is NOT authored here. It waits on a `number_grid` VisualSpec and its
// renderer, which is a representation change and belongs in its own
// release rather than being smuggled into a content one.
//
// WHAT THIS DRAFT CLAIMS, AND WHAT IT DOES NOT
//
// The section number, exact title and page come from the primary-source
// verified registry. The mathematics is authored to that title. It does
// NOT reproduce the textbook's own activities or dialogue: Pragati has
// the verified contents structure for this chapter, not a page-level
// reading of its exercises. The teacher notes say so explicitly and ask
// the teacher to open the book's own opening activity alongside this.
//
// STATUS: authored_draft. Nobody has reviewed any of it.
// ===========================================================================

import type { AuthoredSection } from './authoredSection';
import type { NumberGridSpec, NumberLineSpec } from './visualSpecification';
import {
  SECTION_3_1_PRACTICE,
  SECTION_3_2_PRACTICE,
  SECTION_3_3_PRACTICE,
} from './numberPlayPracticeItems';

import { officialStartPage } from './officialSections';

const SRC = 'https://ncert.nic.in/textbook/pdf/fegp1dd.zip';
const BOOK = 'Ganita Prakash, Grade 6 (NCERT, Reprint 2026-27)';
const CH = 'ncert_gp_c6_ch03_number_play';
const INSPECTED = '2026-08-24';

// v0.83.1 §C — the start page is READ FROM THE OFFICIAL REGISTRY, not
// repeated here. Two copies of the same page number is how 43 Class 6
// pages drifted from the printed book in the first place; the argument
// is kept only so the call sites still read like the contents page, and
// `officialStartPage` is what is recorded.
const source = (
  sectionNumber: string,
  exactTitle: string,
  _startPageAsWritten: number,
  officialSectionId: string
) => ({
  officialChapterId: CH,
  officialSectionId,
  sectionNumber,
  exactTitle,
  startPage: officialStartPage(officialSectionId),
  textbook: BOOK,
  sourceReference: SRC,
  inspectionDate: INSPECTED,
});

// ===========================================================================
// NUMBER PLAY — Chapter 3 of Ganita Prakash, Grade 6.
//
// v0.82.1 — §3.1 AND §3.3 REWRITTEN AGAINST THE PRIMARY PAGES.
//
// The chapter PDF was read on 2026-09-17. It showed that §3.1 and §3.3
// had been authored from their titles plus a plausible reading, and
// taught mathematics the source does not teach. Both are rewritten
// here. §3.2 survived the audit and is unchanged apart from labelling
// its one enrichment honestly.
//
// The verdicts live in `numberPlayAlignment.ts`, which is the record a
// reviewer reads. This file is the content.
//
// WHAT THE REWRITE COST, WORTH STATING ONCE
//
// §3.1's real mathematics — each position reporting how many of its
// ADJACENT neighbours are taller — is the direct precursor to §3.2's
// supercells: same line, same notion of neighbour, same special case at
// the ends. Authoring from the title missed a structure the chapter had
// put in plain sight, and two sections had to be thrown away to find
// it. Read the pages first.
// ===========================================================================


const HEIGHTS_ROW: NumberGridSpec = {
  type: 'number_grid',
  purpose: 'introduce_concept',
  status: 'concept_specific',
  neighbourhood: 'horizontal',
  rows: [[{ value: 30 }, { value: 52 }, { value: 41 }, { value: 60 }, { value: 35 }]],
  caption:
    'Heights in centimetres. Each position reports how many of the positions NEXT TO it are taller.',
  altText:
    'A row of five heights in centimetres: 30, 52, 41, 60, 35. The 30 at the left end has one neighbour, 52, which is taller, so it reports 1. The 52 has neighbours 30 and 41, both shorter, so it reports 0. The 41 has neighbours 52 and 60, both taller, so it reports 2. The 60 has neighbours 41 and 35, both shorter, so it reports 0. The 35 at the right end has one neighbour, 60, which is taller, so it reports 1. The code for the row is 1, 0, 2, 0, 1.',
};

const ENDS_ROW: NumberGridSpec = {
  type: 'number_grid',
  purpose: 'expose_misconception',
  status: 'concept_specific',
  neighbourhood: 'horizontal',
  rows: [[{ value: 60 }, { value: 50 }, { value: 40 }, { value: 30 }]],
  caption: 'Arranged tallest to shortest. Watch what the two ends report.',
  altText:
    'A row of four heights in centimetres, descending: 60, 50, 40, 30. The 60 at the left end has one neighbour, 50, which is shorter, so it reports 0. Each of the other three has exactly one taller neighbour, the one to its left, so they each report 1. The code is 0, 1, 1, 1. Neither end reports 2, because an end position has only one neighbour.',
};


export const SECTION_3_1: AuthoredSection = {
  contentArtifactId: 'ncert_gp_c6_s3_1_lesson',
  // Bumped: this is not an edit of the v0.79 draft, it is a different
  // lesson. A reviewer comparing versions should see a new artifact.
  contentArtifactVersion: 2,
  source: source('3.1', 'Numbers can Tell us Things', 55, 'ncert_gp_c6_s3_1'),

  competencyCandidates: [
    {
      id: 'MIDDLE:C-1.1',
      justification:
        'Reasoning about which sequences of neighbour-counts can occur is number sense applied to structure. Proposed by a maintainer and not reviewed.',
    },
  ],
  competencyMappingStatus: 'competency_proposed',

  sequence: {
    prerequisiteSectionIds: [],
    mayAssume: [
      'Comparing two whole numbers',
      'The words taller, shorter, next to',
      'Counting a small collection',
    ],
    mustNotIntroduce: [
      { concept: 'Supercells and larger-than-all-neighbours', belongsToSection: 'ncert_gp_c6_s3_2' },
      { concept: 'Number line placement', belongsToSection: 'ncert_gp_c6_s3_3' },
      { concept: 'Digit sums and digit patterns', belongsToSection: 'ncert_gp_c6_s3_4' },
    ],
  },

  learningGoal:
    'You will work out what a number is reporting about an arrangement, and decide whether a proposed row of numbers could happen at all.',

  priorKnowledgeCheck: {
    prompt: 'Before you start, can you do these?',
    checks: [
      'Say which is taller: something 142 cm or something 138 cm.',
      'In a line of five people, who is standing next to the person at the very end?',
      'Count how many of three objects are taller than a fourth one.',
    ],
    ifNotReady:
      'Line up five objects of different heights and point at the neighbours of each one before counting anything.',
  },

  vocabulary: [
    { term: 'neighbour', meaning: 'A position directly next to this one in the line.' },
    {
      term: 'end position',
      meaning: 'The first or last position in a line. It has only one neighbour.',
    },
    { term: 'code', meaning: 'A number that reports something, rather than counting the objects themselves.' },
  ],

  explanation: [
    'Stand six plants of different heights in a row. Now give each plant a number — but not its height.',
    'Each plant reports how many of the plants standing NEXT TO IT are taller than it is.',
    'A plant in the middle has two neighbours, one on each side. So its number can be 0, 1 or 2.',
    'A plant at either end has only one neighbour, so its number can only be 0 or 1. It can never say 2, because there is no second plant beside it to be taller.',
    'Read that again, because it is the useful part: the number is not a height and it is not a position. It reports a relationship between a plant and the plants beside it.',
    'That means the same row of numbers can come from more than one arrangement, and some rows of numbers cannot come from any arrangement at all.',
    'Try 2, 2, 2, 2. Could that happen? The first plant is at an end and has one neighbour, so it cannot say 2. The row is impossible before you check anything else.',
    'Now try 0, 1, 2, 1, 0 with five plants of different heights. Work along the line and see whether you can build it. Deciding which codes are possible is the real work of this section.',
  ],

  representations: [
    'A row of positions, each showing a height',
    'The code underneath each position: how many adjacent neighbours are taller',
  ],

  visuals: [HEIGHTS_ROW, ENDS_ROW],
  visualsById: { heights_row: HEIGHTS_ROW, ends_row: ENDS_ROW },

  workedExamples: [
    {
      id: 's31.we1',
      prompt:
        'Five plants stand in a row with heights 30, 52, 41, 60, 35 cm. What number does the 41 cm plant report?',
      steps: [
        {
          text: 'Find its neighbours: the 52 cm plant on one side and the 60 cm plant on the other.',
          reasoning: 'Only the plants directly beside it count — not every taller plant in the row.',
        },
        {
          text: 'Is 52 taller than 41? Yes. Is 60 taller than 41? Yes.',
          reasoning: 'Compare it with each neighbour separately.',
        },
        { text: 'Both neighbours are taller, so it reports 2.', reasoning: 'The code is the COUNT of taller neighbours.' },
      ],
      answer: '2',
    },
    {
      id: 's31.we2',
      prompt: 'In the same row, what does the 30 cm plant at the end report?',
      steps: [
        {
          text: 'It is at the end, so it has one neighbour: the 52 cm plant.',
          reasoning: 'An end position has only one neighbour, whatever the heights are.',
        },
        { text: '52 is taller than 30, so that is one taller neighbour.', reasoning: 'Count only the neighbour it has.' },
        { text: 'It reports 1.', reasoning: 'An end position can only ever report 0 or 1.' },
      ],
      answer: '1',
    },
    {
      id: 's31.we3',
      prompt: 'Could a row of five plants report 1, 1, 1, 1, 1?',
      steps: [
        {
          text: 'Look at the tallest plant in the whole row.',
          reasoning: 'Start from the thing you can be certain about.',
        },
        {
          text: 'No plant beside it can be taller than it, because it is the tallest.',
          reasoning: 'So the tallest plant must report 0.',
        },
        { text: 'The row has no 0 in it, so it is impossible.', reasoning: 'One forced value rules the whole row out.' },
      ],
      answer: 'No — the tallest plant always reports 0.',
    },
  ],

  misconceptionIds: [
    'counts_all_taller_not_adjacent',
    'counts_shorter_neighbours',
    'end_position_given_two_neighbours',
    'reads_code_as_height',
  ],

  guidedPractice: [
    {
      id: 's31.g1',
      prompt: 'Heights 20, 45, 30 cm. What does the 45 cm plant report?',
      hint: 'Are either of its neighbours taller than it?',
      answer: '0',
      rationale: 'Both neighbours are shorter, so it has no taller neighbour to count.',
    },
    {
      id: 's31.g2',
      prompt: 'Can a plant at the end of a row ever report 2?',
      hint: 'How many neighbours does an end position have?',
      answer: 'No.',
      rationale: 'It has one neighbour, so the largest number it can report is 1.',
    },
    {
      id: 's31.g3',
      prompt: 'Heights 15, 40, 25, 55 cm. Write the code for the whole row.',
      hint: 'Do one position at a time, and remember the two ends.',
      answer: '1, 0, 2, 0',
      rationale:
        'Each position counts only its own neighbours, and the two ends each have one.',
    },
  ],

  independentPractice: [
    {
      id: 's31.i1',
      prompt: 'Heights 12, 30, 22. What code does the row report?',
      answer: '1, 0, 1',
      rationale: 'The middle plant is tallest, so it reports 0; each end has one taller neighbour.',
    },
    {
      id: 's31.i2',
      prompt: 'Could a row of four plants report 2, 0, 0, 1?',
      answer: 'No.',
      rationale: 'The first position is an end and has one neighbour, so it cannot report 2.',
    },
    {
      id: 's31.i3',
      prompt: 'In any row, what does the tallest plant always report?',
      answer: '0',
      rationale: 'Nothing beside it can be taller than it.',
    },
    {
      id: 's31.i4',
      prompt: 'Heights 60, 50, 40, 30 — arranged tallest to shortest. Write the code.',
      answer: '0, 1, 1, 1',
      rationale:
        'Each plant after the first has exactly one taller neighbour, the one before it.',
    },
    {
      id: 's31.i5',
      prompt: 'Give two different arrangements of three plants that both report 1, 0, 1.',
      answer: 'Any two rows whose middle plant is tallest, e.g. 10, 50, 20 and 30, 90, 40.',
      rationale: 'The code reports a relationship, so many different heights produce it.',
    },
  ],

  reasoningApplication: [
    {
      id: 's31.r1',
      prompt:
        'With five plants of different heights, what is the largest number of positions that can report 2? Explain why you cannot do better.',
      expectedReasoning:
        'Two. A position reporting 2 must be shorter than both neighbours, and two such positions cannot sit next to each other; the ends are excluded, leaving three middle positions of which only alternate ones can qualify.',
    },
    {
      id: 's31.r2',
      prompt:
        'Is 0, 1, 2, 1, 0 possible with five plants of different heights? Build it or show why not.',
      expectedReasoning:
        'Yes — for example 50, 40, 20, 45, 55: each end is taller than its single neighbour, and the middle plant is shorter than both of its own.',
    },
  ],

  interactivePractice: SECTION_3_1_PRACTICE,

  summary:
    'These numbers are not heights. Each one reports how many of the positions NEXT TO it are taller. End positions have one neighbour, the tallest always reports 0, and some codes cannot happen at all.',
  nextStep:
    'Next: numbers written in a table, where a cell is marked when it beats every neighbour.',

  teacher: {
    objective:
      'Students decode a neighbour-count, and argue about which codes can and cannot occur.',
    prerequisiteKnowledge: ['Comparing two numbers', 'Identifying who is next to whom in a line'],
    modelLanguage: [
      '"Who is standing next to you? Only those two count."',
      '"What must the tallest one say? Why must it?"',
    ],
    teachingNotes: [
      'The primary pages (55-56) were read on 2026-09-17 and this lesson teaches their mathematics: each position reports how many ADJACENT neighbours are taller, and the work is deciding which sequences can occur. Pragati uses plants rather than the book\u2019s children so the examples are original; run the book\u2019s own activity alongside it.',
      'Do the lining-up physically before anything is written down. Students who only see numbers start counting every taller object in the row instead of the two beside them.',
      'The two forced facts carry the whole section: an end position has one neighbour, and the tallest reports 0. Most impossibility arguments come straight from one of them.',
      'This is the direct precursor to supercells in \u00a73.2 \u2014 same line, same neighbours, same special case at the ends. Say so when you get there.',
      'Do not introduce supercells, number lines or digit patterns here.',
    ],
    quickChecks: [
      'What can a plant at the end never say?',
      'What does the tallest plant always say?',
    ],
    supportForStrugglingLearners: [
      'Cover everything except the position being counted and its neighbours.',
      'Have students physically stand in a line and point at their own neighbours before saying a number.',
    ],
    extension: [
      'With six plants, which codes are impossible? Find a rule for spotting one at a glance.',
    ],
    materialsNeeded: ['Objects of clearly different heights', 'Space to line up'],
  },

  reviewStatus: 'authored_draft',
};


// ===========================================================================
// §3.2 — SUPERCELLS
//
// v0.79 could not author this section: a supercell is a cell larger than
// every one of its neighbours, and adjacency cannot be expressed in a
// number line, a strip or an area model. v0.80 added the `number_grid`
// spec, so it can be authored now — and it is authored in the book's
// order, immediately after §3.1, rather than skipping to §3.3 because a
// number line already existed.
//
// TWO DECISIONS WORTH STATING
//
// 1. The definition is STRICT. A supercell is greater than each
//    neighbour, so a tie produces no supercell. That case is taught
//    explicitly here, because it is the one students get wrong by
//    scanning for "the big one" instead of comparing.
//
// 2. Adjacency is declared per visual. §3.2 opens on a single row, where
//    neighbours are unambiguously left and right, and only then moves to
//    a rectangular grid where "does the cell above count?" is a real
//    question a student should be asked rather than have answered for
//    them silently.
//
// The visuals never store which cells are supercells. `supercellsFor()`
// derives them and the validator recomputes every assertion, so a
// caption and a grid cannot drift apart.
// ===========================================================================

const ROW_OF_SIX: NumberGridSpec = {
  type: 'number_grid',
  purpose: 'introduce_concept',
  status: 'concept_specific',
  neighbourhood: 'horizontal',
  rows: [
    [
      { value: 626 },
      { value: 4188 },
      { value: 5353 },
      { value: 2126 },
      { value: 1552 },
      { value: 1555 },
    ],
  ],
  assertsSupercellsAt: [[0, 2], [0, 5]],
  caption:
    'In a single row, a cell’s neighbours are the cells to its left and right.',
  altText:
    'A row of six numbers: 626, 4188, 5353, 2126, 1552, 1555. 5353 is larger than both of its neighbours, and 1555 is larger than the neighbour on its left and has no neighbour on its right.',
};

const TIE_ROW: NumberGridSpec = {
  type: 'number_grid',
  purpose: 'expose_misconception',
  status: 'concept_specific',
  neighbourhood: 'horizontal',
  rows: [[{ value: 340 }, { value: 910 }, { value: 910 }, { value: 275 }]],
  // Deliberately asserts NONE. Neither 910 beats the other, so neither
  // is a supercell — and the validator proves that rather than trusting
  // this comment.
  assertsSupercellsAt: [],
  caption: 'Two equal neighbours: neither is larger than the other.',
  altText:
    'A row of four numbers: 340, 910, 910, 275. Neither 910 is a supercell, because a supercell must be larger than every neighbour and 910 is not larger than 910.',
};

const GRID_OF_NINE: NumberGridSpec = {
  type: 'number_grid',
  purpose: 'reveal_structure',
  status: 'concept_specific',
  neighbourhood: 'orthogonal',
  rows: [
    [{ value: 210 }, { value: 640 }, { value: 155 }],
    [{ value: 480 }, { value: 905 }, { value: 320 }],
    [{ value: 175 }, { value: 260 }, { value: 118 }],
  ],
  assertsSupercellsAt: [[1, 1]],
  caption:
    'In a grid, decide first which cells count as neighbours. Here: up, down, left and right.',
  altText:
    'A three by three grid. The centre cell, 905, is larger than the four cells directly above, below, left and right of it, so it is the only supercell under this rule.',
};

export const SECTION_3_2: AuthoredSection = {
  contentArtifactId: 'ncert_gp_c6_s3_2_lesson',
  contentArtifactVersion: 1,
  source: source('3.2', 'Supercells', 56, 'ncert_gp_c6_s3_2'),

  competencyCandidates: [
    {
      id: 'MIDDLE:C-1.1',
      justification:
        'Comparing multi-digit whole numbers in a structured layout is number sense. Proposed by a maintainer and not reviewed.',
    },
  ],
  competencyMappingStatus: 'competency_proposed',

  sequence: {
    prerequisiteSectionIds: ['ncert_gp_c6_s3_1'],
    mayAssume: [
      'A number means something only when you know what it counts (§3.1)',
      'Comparing two whole numbers',
      'Reading numbers up to five digits',
    ],
    mustNotIntroduce: [
      { concept: 'Number line patterns', belongsToSection: 'ncert_gp_c6_s3_3' },
      { concept: 'Digit and place-value patterns', belongsToSection: 'ncert_gp_c6_s3_4' },
    ],
  },

  learningGoal:
    'You will find supercells in a row and in a grid, and you will be able to say why a cell is not a supercell.',

  priorKnowledgeCheck: {
    prompt: 'Before you start, can you do these?',
    checks: [
      'Say which is larger: 4188 or 5353.',
      'In the row 12, 40, 31, which numbers sit next to 40?',
      'Finish: "A number tells you something only when you know what it ___."',
    ],
    ifNotReady:
      'Practise comparing four-digit numbers by looking at the leftmost digit first, and go back over §3.1.',
  },

  vocabulary: [
    {
      term: 'neighbour',
      meaning:
        'A cell touching this one, under the rule you have agreed. In a row, the cells left and right.',
    },
    {
      term: 'supercell',
      meaning: 'A cell whose number is larger than every one of its neighbours.',
    },
  ],

  explanation: [
    'Write some numbers in a row of boxes. Each box is a cell.',
    'A cell’s neighbours are the cells next to it. In a row, that means the one on its left and the one on its right. A cell at the end of the row has only one neighbour.',
    'A cell is a supercell when its number is larger than every one of its neighbours. Every one — not most of them.',
    'Look at 626, 4188, 5353, 2126, 1552, 1555. Is 4188 a supercell? It beats 626 on its left, but 5353 on its right is larger. So no.',
    'Is 5353 a supercell? It beats 4188 and it beats 2126. Yes.',
    'Now a trap. In the row 340, 910, 910, 275, is either 910 a supercell? Each one has a neighbour that is equal to it, not smaller. Larger means larger, so neither is a supercell.',
    'When the numbers are in a grid rather than a row, you must decide first what counts as a neighbour. If neighbours are the cells directly above, below, left and right, then a cell in the middle has four of them and a corner cell has two.',
    'The rule never changes: larger than every neighbour. What changes is which cells are neighbours — so say the rule out loud before you start hunting.',
  ],

  representations: [
    'A row of cells, where neighbours are left and right',
    'A rectangular grid, where the neighbour rule is stated before use',
  ],

  visuals: [ROW_OF_SIX, TIE_ROW, GRID_OF_NINE],
  visualsById: {
    row_of_six: ROW_OF_SIX,
    tie_row: TIE_ROW,
    grid_of_nine: GRID_OF_NINE,
  },

  workedExamples: [
    {
      id: 's32.we1',
      prompt: 'In the row 626, 4188, 5353, 2126, 1552, 1555, which cells are supercells?',
      steps: [
        {
          text: 'Check 626: its only neighbour is 4188, which is larger.',
          reasoning: 'An end cell has one neighbour, and 626 does not beat it.',
        },
        {
          text: 'Check 4188: it beats 626 but loses to 5353.',
          reasoning: 'Losing to even one neighbour is enough to rule it out.',
        },
        {
          text: 'Check 5353: it beats 4188 and 2126.',
          reasoning: 'Larger than every neighbour, so it is a supercell.',
        },
        {
          text: 'Check 1555: its only neighbour is 1552, and 1555 is larger.',
          reasoning: 'An end cell can be a supercell — it just has fewer neighbours to beat.',
        },
      ],
      answer: '5353 and 1555.',
    },
    {
      id: 's32.we2',
      prompt: 'In the row 340, 910, 910, 275, is either 910 a supercell?',
      steps: [
        {
          text: 'Take the first 910. Its neighbours are 340 and 910.',
          reasoning: 'List the neighbours before comparing.',
        },
        {
          text: 'It beats 340, but it does not beat 910 — they are equal.',
          reasoning: 'Equal is not larger, and the definition says larger than every neighbour.',
        },
        {
          text: 'The same argument applies to the second 910.',
          reasoning: 'Ties rule out both cells, not just one of them.',
        },
      ],
      answer: 'Neither. A tie means no supercell.',
    },
    {
      id: 's32.we3',
      prompt:
        'In the grid with rows (210, 640, 155), (480, 905, 320), (175, 260, 118), taking neighbours as up, down, left and right, which cells are supercells?',
      steps: [
        {
          text: 'State the neighbour rule first: up, down, left, right.',
          reasoning: 'In a grid the answer depends on the rule, so the rule comes first.',
        },
        {
          text: 'Check 640: neighbours are 210, 155 and 905. It loses to 905.',
          reasoning: 'The cell below it is larger, so it is out.',
        },
        {
          text: 'Check 905: neighbours are 640, 175 wait — no. Its neighbours are 640 above, 260 below, 480 left and 320 right.',
          reasoning:
            'Corner cells are not neighbours under this rule. Listing them carefully is the whole task.',
        },
        {
          text: '905 beats 640, 260, 480 and 320.',
          reasoning: 'Larger than all four, so it is a supercell.',
        },
      ],
      answer: 'Only 905.',
    },
  ],

  misconceptionIds: [
    'supercell_needs_only_one_bigger_neighbour',
    'tie_counts_as_larger',
    'neighbourhood_assumed_not_stated',
    'largest_in_the_row_is_the_only_supercell',
  ],

  guidedPractice: [
    {
      id: 's32.g1',
      prompt: 'In the row 12, 45, 45, 9, find every supercell.',
      hint: 'What happens when two neighbours are equal?',
      answer: 'None.',
      rationale: 'Each 45 has an equal neighbour, and equal is not larger.',
    },
    {
      id: 's32.g2',
      prompt: 'In the row 88, 12, 90, 7, find every supercell.',
      hint: 'Check the end cells too.',
      answer: '88 and 90.',
      rationale:
        '88 beats its only neighbour 12; 90 beats 12 and 7. End cells count.',
    },
    {
      id: 's32.g3',
      prompt:
        'Someone finds a supercell in a grid without saying which cells are neighbours. Why is that a problem?',
      hint: 'Would the answer change if diagonals counted?',
      answer: 'Because the answer depends on the rule.',
      rationale:
        'A cell can be a supercell under one neighbour rule and not under another, so the rule must be stated.',
    },
  ],

  independentPractice: [
    {
      id: 's32.i1',
      prompt: 'Row: 5, 9, 4. Which cells are supercells?',
      answer: '9',
      rationale: '9 beats both 5 and 4.',
    },
    {
      id: 's32.i2',
      prompt: 'Row: 700, 700. Which cells are supercells?',
      answer: 'None.',
      rationale: 'Each is equal to its only neighbour, and equal is not larger.',
    },
    {
      id: 's32.i3',
      prompt: 'Row: 31, 12, 28, 6. Which cells are supercells?',
      answer: '31 and 28',
      rationale: '31 beats 12; 28 beats 12 and 6.',
    },
    {
      id: 's32.i4',
      prompt:
        'Can two cells that sit next to each other both be supercells? Explain.',
      answer: 'No.',
      rationale:
        'Each would have to be larger than the other, which is impossible.',
    },
    {
      id: 's32.i5',
      prompt:
        'A row has six cells and exactly one supercell. Where could it be? Give two possibilities.',
      answer: 'Any position, including either end.',
      rationale:
        'Being at an end means fewer neighbours to beat, not that it cannot be a supercell.',
    },
  ],

  reasoningApplication: [
    {
      id: 's32.r1',
      prompt:
        'Arrange the numbers 1 to 6 in a row so that there are exactly two supercells. Then explain why your arrangement works.',
      expectedReasoning:
        'Two peaks separated by a lower cell, e.g. 2, 6, 1, 5, 3, 4 — 6 and 5 each beat both neighbours, and no two supercells are adjacent because each would have to beat the other.',
    },
    {
      id: 's32.r2',
      prompt:
        'A classmate says "the biggest number in the row is always a supercell." Is that true? Is the reverse true — is every supercell the biggest number in the row?',
      expectedReasoning:
        'The first is true when no neighbour ties it: the largest beats everything, so it beats its neighbours. The second is false — a small number can still beat both of its own neighbours.',
    },
  ],

  interactivePractice: SECTION_3_2_PRACTICE,

  summary:
    'A supercell is larger than every one of its neighbours. Ties do not count, end cells can qualify, and in a grid you must say which cells are neighbours before you start.',
  nextStep:
    'Next: what patterns appear when numbers are placed along a number line.',

  teacher: {
    objective:
      'Students apply a strict definition — larger than EVERY neighbour — and state the neighbour rule before answering.',
    prerequisiteKnowledge: [
      'Comparing multi-digit numbers',
      '§3.1: a number means something only with what it counts',
    ],
    modelLanguage: [
      '"List its neighbours first. Now, does it beat every one of them?"',
      '"Equal is not larger."',
    ],
    teachingNotes: [
      'The primary pages (57-59) were read on 2026-09-17 and this lesson matches the section: larger than every adjacent cell, end cells qualifying, a single row before a grid, and left/right/top/bottom adjacency are all source-explicit. The tie case is Pragati enrichment - the source tables use distinct numbers - so teach it as an extension of the definition rather than as the book emphasis.',
      'The tie case is the one worth slowing down on. Students scan for "the big one" and stop comparing; a tie forces them back to the definition.',
      'When you move to a grid, ask the class what should count as a neighbour BEFORE you tell them. The question is mathematically real and the discussion is the lesson.',
      'Do not introduce number-line patterns or digit patterns here — §3.3 and §3.4 own those.',
    ],
    quickChecks: [
      'Row: 4, 4. Any supercells? Why not?',
      'Can a cell at the end of a row be a supercell?',
    ],
    supportForStrugglingLearners: [
      'Cover every cell except the one being tested and its neighbours, then compare just those.',
      'Say the comparison out loud: "Is 4188 bigger than 626? Yes. Bigger than 5353? No. So not a supercell."',
    ],
    extension: [
      'Arrange 1 to 9 in a three-by-three grid with exactly one supercell, then with as many as you can.',
    ],
    materialsNeeded: ['Squared paper', 'Number cards'],
  },

  reviewStatus: 'authored_draft',
};


// ===========================================================================
// §3.3 — PATTERNS OF NUMBERS ON THE NUMBER LINE
//
// Authored on the EXISTING `NumberLineSpec`. This section was already
// drawable in v0.79 and was deliberately left until now, because §3.2
// comes before it in the book and a chapter must not grow in the order
// its representations happen to arrive.
//
// The number line here is a whole-number line, not the fractional one
// §7.4 uses. `ExactFraction` with denominator 1 is how this spec states
// a whole number, so the same renderer serves both without a second
// representation — the right reuse, as against inventing a parallel
// integer line that would then drift.
// ===========================================================================

const whole = (n: number) => ({ numerator: n, denominator: 1 });

// ===========================================================================
// §3.3 — PATTERNS OF NUMBERS ON THE NUMBER LINE (pp. 59-60)
//
// REWRITTEN. The v0.81 draft taught constant-versus-doubling steps and
// widening gaps; the pages contain no geometric sequence at all. What
// the source actually does is place four- and five-digit numbers on a
// 1000-10,000 line, then read lines at OTHER SCALES — 2010 to 2020,
// 9996 to 9997, 15,077 to 15,083, 86,705 to 87,705 — identifying the
// marked numbers and labelling the rest.
//
// So the mathematics is: work out what one interval is worth on THIS
// line, then place or read a number. The trap is assuming every line
// starts at zero and steps by one.
//
// Pragati's windows are original; the source's exact exercise numbers
// are not reproduced. `NumberLineSpec` needed no extension — `min` and
// `max` are exact fractions, so a window from 86,000 to 88,000 is
// expressible with denominator 1 exactly as a 0-to-1 line is.
// ===========================================================================

const THOUSANDS_LINE: NumberLineSpec = {
  type: 'number_line',
  purpose: 'introduce_concept',
  status: 'concept_specific',
  min: whole(1000),
  max: whole(10000),
  partitions: 9,
  labelTicks: true,
  markedPoints: [
    { value: whole(2000), label: '2000' },
    { value: whole(6000), label: '6000' },
  ],
  orientation: 'horizontal',
  caption: 'This line does not start at 0, and each interval is 1000.',
  altText:
    'A number line running from 1000 on the left to 10,000 on the right, divided into nine equal intervals, so each interval is 1000. Ticks at 2000 and 6000 are labelled.',
};

const TIGHT_WINDOW: NumberLineSpec = {
  type: 'number_line',
  purpose: 'reveal_structure',
  status: 'concept_specific',
  min: whole(15070),
  max: whole(15080),
  partitions: 10,
  labelTicks: true,
  markedPoints: [{ value: whole(15073), label: '15,073' }],
  orientation: 'horizontal',
  caption: 'A window ten wide, around a five-digit number. Each interval is 1.',
  altText:
    'A number line from 15,070 to 15,080 divided into ten equal intervals, so each interval is 1. The tick at 15,073 is labelled.',
};

const UNLABELLED_WINDOW: NumberLineSpec = {
  type: 'number_line',
  purpose: 'expose_misconception',
  status: 'concept_specific',
  min: whole(86000),
  max: whole(88000),
  partitions: 8,
  labelTicks: false,
  markedPoints: [
    { value: whole(86000), label: '86,000' },
    { value: whole(88000), label: '88,000' },
  ],
  orientation: 'horizontal',
  caption: 'Only the two ends are labelled. What is one interval worth here?',
  altText:
    'A number line with 86,000 at the left end and 88,000 at the right end, divided into eight equal intervals. No other tick is labelled. The span is 2000 across eight intervals, so each interval is 250.',
};

export const SECTION_3_3: AuthoredSection = {
  contentArtifactId: 'ncert_gp_c6_s3_3_lesson',
  contentArtifactVersion: 2,
  source: source(
    '3.3',
    'Patterns of Numbers on the Number Line',
    59,
    'ncert_gp_c6_s3_3'
  ),

  competencyCandidates: [
    {
      id: 'MIDDLE:C-1.1',
      justification:
        'Placing and reading large whole numbers on a scaled line is number sense. Proposed by a maintainer and not reviewed.',
    },
  ],
  competencyMappingStatus: 'competency_proposed',

  sequence: {
    prerequisiteSectionIds: ['ncert_gp_c6_s3_1', 'ncert_gp_c6_s3_2'],
    mayAssume: [
      'Reading and comparing four- and five-digit numbers',
      'Counting on in steps',
      'That a number line shows larger numbers further right',
    ],
    mustNotIntroduce: [
      { concept: 'Digit sums and digit patterns', belongsToSection: 'ncert_gp_c6_s3_4' },
      { concept: 'Fractions on the number line', belongsToSection: 'ncert_gp_c6_s7_4' },
    ],
  },

  learningGoal:
    'You will work out what one interval is worth on a number line, and use that to place or read large numbers — including on lines that do not start at zero.',

  priorKnowledgeCheck: {
    prompt: 'Before you start, can you do these?',
    checks: [
      'Say which is larger: 15,073 or 15,037.',
      'Count on in 250s from 1000.',
      'Work out 2000 shared equally into 8 parts.',
    ],
    ifNotReady:
      'Practise reading five-digit numbers aloud, and dividing a span into equal steps.',
  },

  vocabulary: [
    { term: 'scale', meaning: 'What one interval on the line is worth.' },
    { term: 'interval', meaning: 'The gap between two ticks.' },
    { term: 'window', meaning: 'The part of the number line being shown, from its left end to its right end.' },
  ],

  explanation: [
    'A number line does not have to start at 0, and its ticks do not have to go up by 1. Before you read anything from a line, work out what it is showing.',
    'Two questions, always in this order. Where does this window start and end? And how many intervals is that span cut into?',
    'Take a line from 1000 to 10,000 cut into nine intervals. The span is 9000, shared into 9, so each interval is worth 1000.',
    'Now take a line from 15,070 to 15,080 cut into ten intervals. Same picture, completely different scale: the span is 10, so each interval is worth 1. Only the labels tell you which line you are looking at.',
    'This is where mistakes happen. A line drawn the same width can be worth 1000 a step or 1 a step, so the picture alone never tells you. Read the ends first.',
    'Once you know the scale, placing a number is counting. On the 1000-to-10,000 line, 3600 sits between the ticks for 3000 and 4000, a bit past halfway.',
    'And reading works the same way backwards: if only the two ends are labelled, divide the span by the number of intervals to find what one step is worth, then count along.',
  ],

  representations: [
    'A number line whose window and scale must be read before anything else',
    'Lines at several different scales, including one with unlabelled ticks',
  ],

  visuals: [THOUSANDS_LINE, TIGHT_WINDOW, UNLABELLED_WINDOW],
  visualsById: {
    thousands_line: THOUSANDS_LINE,
    tight_window: TIGHT_WINDOW,
    unlabelled_window: UNLABELLED_WINDOW,
  },

  workedExamples: [
    {
      id: 's33.we1',
      prompt: 'A line runs from 1000 to 10,000 with nine equal intervals. What is one interval worth?',
      steps: [
        { text: 'The span is 10,000 - 1000 = 9000.', reasoning: 'Read both ends before anything else.' },
        { text: 'There are nine intervals, so 9000 divided by 9.', reasoning: 'Equal intervals share the span equally.' },
        { text: 'Each interval is worth 1000.', reasoning: 'Now every tick can be labelled by counting on in 1000s.' },
      ],
      answer: '1000',
    },
    {
      id: 's33.we2',
      prompt: 'Where does 3600 go on that line?',
      steps: [
        { text: 'Ticks run 1000, 2000, 3000, and so on.', reasoning: 'Using the scale worked out above.' },
        { text: '3600 is between 3000 and 4000.', reasoning: 'It is larger than one tick and smaller than the next.' },
        { text: 'It sits a little past halfway between them.', reasoning: '600 out of the 1000 in that interval.' },
      ],
      answer: 'Between the 3000 and 4000 ticks, slightly past the middle.',
    },
    {
      id: 's33.we3',
      prompt:
        'A line has 86,000 at one end and 88,000 at the other, with eight equal intervals and no other labels. What number sits three intervals to the right of 86,000?',
      steps: [
        { text: 'Span is 88,000 - 86,000 = 2000.', reasoning: 'Both ends are given, so the span is known.' },
        { text: '2000 shared into 8 intervals is 250 each.', reasoning: 'This is the step, and it is not a round thousand.' },
        { text: 'Three intervals of 250 to the right of 86,000 is 86,750.', reasoning: 'Count on from the left end, one interval at a time.' },
      ],
      answer: '86,750',
    },
  ],

  misconceptionIds: [
    'assumes_line_starts_at_zero',
    'assumes_ticks_step_by_one',
    'ignores_scale_reads_picture',
    'places_by_digit_appearance',
  ],

  guidedPractice: [
    {
      id: 's33.g1',
      prompt: 'A line runs 2000 to 2010 with ten intervals. What is one interval worth?',
      hint: 'Span first, then share it.',
      answer: '1',
      rationale: 'The span is 10 and there are ten intervals.',
    },
    {
      id: 's33.g2',
      prompt: 'A line runs 0 to 100,000 with ten intervals. What is one interval worth?',
      hint: 'Same method, much bigger span.',
      answer: '10,000',
      rationale: 'The method does not change when the numbers get large.',
    },
    {
      id: 's33.g3',
      prompt: 'Two lines are drawn the same width. Can you tell from the picture which shows larger numbers?',
      hint: 'What is the only thing that tells you the scale?',
      answer: 'No — you must read the labels at the ends.',
      rationale: 'The drawing carries no information about scale on its own.',
    },
  ],

  independentPractice: [
    {
      id: 's33.i1',
      prompt: 'A line runs 9990 to 10,000 in ten intervals. What number sits four intervals to the right of 9990?',
      answer: '9994',
      rationale: 'Each interval is 1, so four intervals to the right of 9990.',
    },
    {
      id: 's33.i2',
      prompt: 'A line runs 1000 to 10,000 in nine intervals. Between which ticks does 8400 sit?',
      answer: 'Between 8000 and 9000',
      rationale: 'Each interval is 1000, and 8400 falls inside that one.',
    },
    {
      id: 's33.i3',
      prompt: 'A line runs 15,070 to 15,080 in ten intervals. How many intervals to the right of 15,070 does 15,077 sit?',
      answer: 'Seven',
      rationale: 'Each interval is 1, so 15,077 is seven intervals along from 15,070.',
    },
    {
      id: 's33.i4',
      prompt: 'Of 2754, 1050 and 9590, which sits furthest right on a 1000-to-10,000 line?',
      answer: '9590',
      rationale: 'Furthest right means largest.',
    },
    {
      id: 's33.i5',
      prompt: 'A line runs 40,000 to 44,000 in eight intervals. What is one interval worth?',
      answer: '500',
      rationale: 'A span of 4000 shared into eight is 500.',
    },
  ],

  reasoningApplication: [
    {
      id: 's33.r1',
      prompt:
        'Two number lines are drawn the same length. One runs 0 to 10; the other runs 86,000 to 88,000. A classmate says the second must be longer because its numbers are bigger. What would you say?',
      expectedReasoning:
        'The drawn length says nothing about the numbers. What differs is the scale: one interval is worth 1 on the first line and 250 on the second.',
    },
    {
      id: 's33.r2',
      prompt:
        'Draw a number line where 9996 and 9997 are far apart on the page. What window and scale did you choose, and why does it work?',
      expectedReasoning:
        'A narrow window such as 9995 to 10,000 with five intervals of 1. Shrinking the span while keeping the drawn length spreads consecutive numbers out.',
    },
  ],

  interactivePractice: SECTION_3_3_PRACTICE,

  summary:
    'Read the two ends first, then work out what one interval is worth. A number line need not start at zero, and ticks need not go up by one — the scale is the only thing that tells you what the picture means.',
  nextStep:
    'Next: looking inside numbers at their digits, rather than at where they sit.',

  teacher: {
    objective:
      'Students determine the scale of a line before reading or placing anything on it.',
    prerequisiteKnowledge: ['Reading four- and five-digit numbers', 'Sharing a span into equal steps'],
    modelLanguage: [
      '"Where does this line start and end? How many intervals?"',
      '"What is one step worth here?"',
    ],
    teachingNotes: [
      'The primary pages (59-60) were read on 2026-09-17 and this lesson teaches their mathematics: placing large numbers on a 1000-to-10,000 line and reading lines at other scales, including tight five-digit windows. Pragati\u2019s windows are original; run the book\u2019s own number lines alongside them.',
      'Draw two lines of identical width with wildly different scales before saying anything. That single image does most of the teaching.',
      'The unlabelled window with a step of 250 is the one worth time. Students expect round thousands and have to divide to find out otherwise.',
      'Do not teach digit sums or digit patterns here \u2014 \u00a73.4 owns those. Keep the line to whole numbers; fractional positions belong to Chapter 7.',
    ],
    quickChecks: [
      'A line runs 500 to 600 in ten intervals. What is one step?',
      'Does every number line start at 0?',
    ],
    supportForStrugglingLearners: [
      'Write the span and the number of intervals down before dividing.',
      'Label every tick in pencil before placing anything.',
    ],
    extension: [
      'Find a window and scale that puts 9996 and 9997 a whole hand-width apart.',
    ],
    materialsNeeded: ['Ruler', 'Squared paper'],
  },

  reviewStatus: 'authored_draft',
};


/** Authored sections of Chapter 3, in the book's order. */
export function numberPlayChapterSections(): AuthoredSection[] {
  // v0.82.1 §C — §3.4 is deliberately not authored yet, and the reason
  // recorded here until now was wrong. It said §3.4 "blocks on a
  // place-value representation that does not exist"; the primary pages
  // (60-61) show the section works with digit LENGTHS, digit SUMS and
  // digit-occurrence counts, where position is largely irrelevant —
  // 68, 176 and 545 share a digit sum precisely because place does not
  // matter. `PlaceValueSpec` would represent a different idea.
  //
  // What §3.4 actually needs has not been decided. See
  // SECTION_3_4_REPRESENTATION_FINDING in numberPlayAlignment.ts.
  return [SECTION_3_1, SECTION_3_2, SECTION_3_3];
}
