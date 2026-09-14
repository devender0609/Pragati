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

/** Authored sections of Chapter 3, in the book's order. */
export function numberPlayChapterSections(): AuthoredSection[] {
  // §3.2 onward are not authored yet. §3.2 blocks on a `number_grid`
  // representation; §3.3 and §3.4 block on their own. The list grows in
  // book order and never out of it.
  return [SECTION_3_1];
}
