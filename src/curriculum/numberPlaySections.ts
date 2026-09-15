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
import type { NumberGridSpec } from './visualSpecification';

const SRC = 'https://ncert.nic.in/textbook/pdf/fegp1dd.zip';
const BOOK = 'Ganita Prakash, Grade 6 (NCERT, Reprint 2026-27)';
const CH = 'ncert_gp_c6_ch03_number_play';
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

export const SECTION_3_1: AuthoredSection = {
  contentArtifactId: 'ncert_gp_c6_s3_1_lesson',
  contentArtifactVersion: 1,
  source: source('3.1', 'Numbers can Tell us Things', 55, 'ncert_gp_c6_s3_1'),

  competencyCandidates: [
    {
      id: 'MIDDLE:C-1.1',
      justification:
        'The section uses numbers to describe and compare real collections, which is the number-sense strand C-1.1 names. Proposed by a maintainer and not reviewed.',
    },
  ],
  competencyMappingStatus: 'competency_proposed',

  sequence: {
    prerequisiteSectionIds: [],
    mayAssume: [
      'Counting a collection accurately',
      'Reading and writing whole numbers',
      'The words more, less and the same',
    ],
    mustNotIntroduce: [
      // Each of these belongs to a later section of this chapter, and
      // reaching for one here teaches the chapter out of order.
      { concept: 'Supercells and neighbour comparison', belongsToSection: 'ncert_gp_c6_s3_2' },
      { concept: 'Number line patterns', belongsToSection: 'ncert_gp_c6_s3_3' },
      { concept: 'Digit and place-value patterns', belongsToSection: 'ncert_gp_c6_s3_4' },
    ],
  },

  learningGoal:
    'You will see that a number only means something when you know what it counts — and that comparing two numbers is comparing two situations, not two digits.',

  priorKnowledgeCheck: {
    prompt: 'Before you start, can you do these?',
    checks: [
      'Count how many windows are in this room.',
      'Say which is more: 34 or 43.',
      'Finish this sentence: "There are 12 ___ in my bag."',
    ],
    ifNotReady:
      'Count real collections around you and say the full sentence out loud each time — the number and the thing it counts.',
  },

  vocabulary: [
    {
      term: 'count',
      meaning: 'How many of something there are.',
    },
    {
      term: 'compare',
      meaning: 'To decide which is more, which is less, or whether they are the same.',
    },
    {
      term: 'collection',
      meaning: 'The group of things being counted.',
    },
  ],

  explanation: [
    'Say the number 12 out loud. On its own, it tells you almost nothing. Twelve what?',
    'Now try: 12 students. 12 rupees. 12 mistakes. Same number, three completely different pieces of news.',
    'So a number carries information only when you know what it counts. In mathematics we keep the thing attached: not "12", but "12 students".',
    'Once you know what is being counted, a number can tell you something. If a bus has 40 seats and 44 people want to travel, the two numbers together tell you that four people will have to stand.',
    'Numbers also let you compare. 18 is more than 11 — but whether that is good news depends entirely on what is being counted. More runs scored is good. More mistakes is not. More days absent is not.',
    'Be careful with one thing: two counts can only be compared fairly if they come from situations you can fairly compare. If one class has 20 students and another has 50, saying "the second class had more absences" does not yet tell you which class attended better.',
  ],

  representations: [
    'A number written with the thing it counts, in a full sentence',
    'Two counts side by side, with what each one counts stated',
  ],

  // §3.1 needs no diagram. Its whole point is that the meaning lives in
  // the words attached to the number, and a picture here would quietly
  // do the work the student is supposed to do. Empty on purpose, not by
  // omission.
  visuals: [],
  visualsById: {},

  workedExamples: [
    {
      id: 's31.we1',
      prompt:
        'A cricket scoreboard says 7. What extra information do you need before this number means anything?',
      steps: [
        {
          text: 'Ask what the 7 counts.',
          reasoning: 'A number with no noun attached carries no information.',
        },
        {
          text: '7 could be runs, wickets, overs, or players.',
          reasoning:
            'Each reading tells a completely different story about the match, so the number alone cannot settle it.',
        },
        {
          text: 'You need the label: "7 wickets" or "7 runs".',
          reasoning: 'The number plus what it counts is the smallest piece of real information.',
        },
      ],
      answer: 'What the 7 counts.',
    },
    {
      id: 's31.we2',
      prompt:
        'Asha made 3 mistakes in her test. Bhavna made 8. Who did better on mistakes?',
      steps: [
        {
          text: 'Work out what is being counted: mistakes.',
          reasoning: 'Before comparing, name the quantity.',
        },
        {
          text: 'Decide whether more is better or worse here.',
          reasoning: 'For mistakes, fewer is better — which is the opposite of runs or marks.',
        },
        {
          text: '3 is fewer than 8, so Asha made fewer mistakes.',
          reasoning: 'The smaller number is the better result because of what it counts.',
        },
      ],
      answer: 'Asha — she made fewer mistakes.',
    },
    {
      id: 's31.we3',
      prompt:
        'Class A has 20 students and 4 were absent. Class B has 50 students and 6 were absent. Someone says "Class B had more absences, so Class B attended worse." Is that settled?',
      steps: [
        {
          text: '6 is indeed more than 4.',
          reasoning: 'The raw counts are what they are.',
        },
        {
          text: 'But the two classes are different sizes.',
          reasoning:
            'A count of absences from 50 students and from 20 students are not directly comparable.',
        },
        {
          text: 'So the claim is not settled by these two numbers alone.',
          reasoning:
            'To compare fairly you would need to take the class sizes into account.',
        },
      ],
      answer: 'No — the classes are different sizes, so the raw counts do not settle it.',
    },
  ],

  misconceptionIds: [
    'bigger_number_always_better',
    'number_without_its_unit',
    'compares_across_different_wholes',
    'reads_position_as_value',
  ],

  guidedPractice: [
    {
      id: 's31.g1',
      prompt: 'A sign says 250. Write two different things it could be counting.',
      hint: 'Where might you see a number like this?',
      answer: 'Any two sensible readings, e.g. 250 rupees; 250 kilometres.',
      rationale:
        'The number is the same both times; the meaning is entirely in what it counts.',
    },
    {
      id: 's31.g2',
      prompt:
        'Farhan scored 15 marks. Gauri made 15 spelling mistakes. Both got 15. Did they get the same news?',
      hint: 'Is more marks good? Is more mistakes good?',
      answer: 'No.',
      rationale:
        'The same number means good news in one case and bad in the other, because it counts different things.',
    },
    {
      id: 's31.g3',
      prompt:
        'A list reads: Chetan 42, Diya 39, Ishita 51. Chetan is written first. Does that mean Chetan has the most?',
      hint: 'Read the numbers, not the order.',
      answer: 'No — Ishita has the most.',
      rationale:
        'Position in a list says nothing about size. Only the numbers do.',
    },
  ],

  independentPractice: [
    {
      id: 's31.i1',
      prompt: 'Write what each number counts: "Our school has 8." Finish the sentence sensibly.',
      answer: 'Any sensible noun, e.g. "8 classrooms".',
      rationale: 'A number needs the thing it counts before it says anything.',
    },
    {
      id: 's31.i2',
      prompt: 'Which is better news: 2 absences or 9 absences?',
      answer: '2 absences',
      rationale: 'Fewer absences is better, so here the smaller number is the better result.',
    },
    {
      id: 's31.i3',
      prompt: 'Which is better news: 2 goals scored or 9 goals scored?',
      answer: '9 goals',
      rationale: 'For goals, more is better — the opposite of absences.',
    },
    {
      id: 's31.i4',
      prompt:
        'A bus has 40 seats. 36 passengers board. What do these two numbers together tell you?',
      answer: '4 seats are empty.',
      rationale: 'Two counts about the same situation can tell you something neither says alone.',
    },
    {
      id: 's31.i5',
      prompt:
        'Team A won 7 of 10 matches. Team B won 9 of 20 matches. Does Team B have the better record because 9 is more than 7?',
      answer: 'No.',
      rationale:
        'The two teams played different numbers of matches, so the raw wins do not settle it.',
    },
  ],

  reasoningApplication: [
    {
      id: 's31.r1',
      prompt:
        'Harsh says "a bigger number is always better." Give him one example where that is true and one where it is false, and explain what makes the difference.',
      expectedReasoning:
        'More marks is better; more mistakes is worse. What decides it is what the number counts, not the number itself.',
    },
    {
      id: 's31.r2',
      prompt:
        'Two shops both say "we sold 30 today". What would you need to ask before deciding which shop had the better day?',
      expectedReasoning:
        'What was sold, and how big each shop is. Thirty of a cheap item in a large shop and thirty of an expensive item in a small one are not the same day.',
    },
  ],

  // No section-specific interactive items yet. The interaction engine
  // aligns items by official section ID, and authoring items for §3.1
  // before the chapter's item bank exists would create practice with no
  // bank behind it.
  interactivePractice: [],

  summary:
    'A number tells you something only when you know what it counts. Comparing two numbers means comparing two situations — and whether "more" is good depends entirely on what is being counted.',
  nextStep:
    'Next: what happens when you line numbers up in a grid and compare each one with its neighbours.',

  teacher: {
    objective:
      'Students attach a quantity to every number they say, and treat a comparison as a comparison of situations rather than of digits.',
    prerequisiteKnowledge: ['Counting a collection', 'Reading whole numbers', 'More / less / same'],
    modelLanguage: [
      '"Twelve what?"',
      '"More runs is good news. More mistakes is not. What is this number counting?"',
    ],
    teachingNotes: [
      'Open with the textbook\'s own activity for this section. Pragati has the verified contents structure for Chapter 3 but not a page-level reading of its exercises, so this draft teaches the idea the section names rather than reproducing the book\'s tasks. Use both.',
      'The habit to build is saying the noun aloud every single time. It costs nothing here and it is what makes §3.2 and §3.4 readable later.',
      'Do NOT introduce supercells, the number line or digit patterns. Each belongs to a later section of this chapter and arrives with its own representation.',
      'The different-sized-groups example is the seed of proportional reasoning. Let students argue about it; do not resolve it into a fraction or a percentage here — they have not met either in this chapter.',
    ],
    quickChecks: [
      'I say "seventeen". What do you need to ask me?',
      'Give me a number where bigger is worse.',
    ],
    supportForStrugglingLearners: [
      'Count real objects in the room and always say the full sentence: "There are 9 desks."',
      'Sort statements into "more is better" and "more is worse" before comparing any numbers.',
    ],
    extension: [
      'Find a number in a newspaper headline. What does it count, and would a bigger one be better or worse?',
    ],
    materialsNeeded: ['Everyday objects to count', 'A newspaper or a price list'],
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

  interactivePractice: [],

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
      'Open with the textbook’s own supercell activity. Pragati has the verified contents structure for Chapter 3 but not a page-level reading of its exercises, so this draft teaches the idea the section names rather than reproducing the book’s tasks.',
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

/** Authored sections of Chapter 3, in the book's order. */
export function numberPlayChapterSections(): AuthoredSection[] {
  // §3.3 and §3.4 are not authored yet. §3.4 blocks on a place-value
  // representation that does not exist. The list grows in book order and
  // never out of it.
  return [SECTION_3_1, SECTION_3_2];
}
