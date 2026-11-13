// ===========================================================================
// v0.84.0 checkpoint 38 — CLASS 9 CHAPTER 8: EXPLORING SEQUENCES.
//
// Patterns are not new in Class 9 — Class 8 and Part I chapter 2 both found
// nth terms. What this chapter adds is formal language (sequence, term,
// position), the explicit-versus-recursive distinction, and the named
// families AP and GP with their derived nth terms.
//
// No new representation. A sequence table is an ordinary lesson table, not
// a statistical display: the Chapter 10 DataSet models categories compared
// across series, which is not what a position-and-value list is.
//
// One split (§8.6, into the algebra and the visual comparison).
// ===========================================================================

import type { AuthoredSection } from './authoredSection';
import type { GeometryFigureSpec } from './visualSpecification';

export const SEQUENCES_CHAPTER_ID = 'ncert_iemh1_ch08';

const BOOK = 'Ganita Manjari, Textbook of Mathematics for Grade 9 (Part I)';
const SRC = 'https://ncert.nic.in/textbook/pdf/iemh1dd.zip';
const INSPECTED = '2026-10-07';

const source = (
  sectionNumber: string,
  exactTitle: string,
  startPage: number,
  officialSectionId: string
) => ({
  officialChapterId: SEQUENCES_CHAPTER_ID,
  officialSectionId,
  sectionNumber,
  exactTitle,
  startPage,
  textbook: BOOK,
  sourceReference: SRC,
  inspectionDate: INSPECTED,
});

const P = (id: string, x: number, y: number, label: string) => ({ id, x, y, label });

// AP against GP, plotted: equal steps versus a steepening curve.
const F_AP_GP: GeometryFigureSpec = {
  type: 'geometry_figure',
  purpose: 'compare_cases',
  status: 'concept_specific',
  points: [
    P('o', 30, 170, 'O'), P('xr', 210, 170, 'n'), P('yt', 30, 20, 'value'),
    P('a1', 60, 150, 'A₁'), P('a2', 90, 130, 'A₂'), P('a3', 120, 110, 'A₃'), P('a4', 150, 90, 'AP'),
    P('g1', 60, 160, 'G₁'), P('g2', 90, 150, 'G₂'), P('g3', 120, 130, 'G₃'), P('g4', 152, 86, 'GP'),
  ],
  segments: [
    { from: 'o', to: 'xr' },
    { from: 'o', to: 'yt' },
    { from: 'a1', to: 'a4', mark: 'dashed' },
    { from: 'g1', to: 'g2' },
    { from: 'g2', to: 'g3' },
    { from: 'g3', to: 'g4' },
  ],
  caption: 'An AP rises by equal steps; a GP starts slower and then overtakes.',
  altText:
    'Axes with position n across and term value up. The dashed AP path rises in equal steps and is a straight line. The solid GP path starts below it, rises slowly at first, then steepens sharply and meets the AP path at the fourth position, after which it would climb far above.',
};

export const SECTION_8_1: AuthoredSection = {
  contentArtifactId: 'ncert_iemh1_s8_1_lesson',
  contentArtifactVersion: 1,
  source: source('8.1', 'Introduction to Sequences', 1, 'ncert_iemh1_s8_1'),
  competencyCandidates: [],
  competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: [],
    mayAssume: ['Finding the nth term of a pattern from Part I chapter 2', 'Reading a table', 'Class 8 pattern work'],
    mustNotIntroduce: [{ concept: 'Explicit rules', belongsToSection: 'ncert_iemh1_s8_2' }, { concept: 'Recursive rules', belongsToSection: 'ncert_iemh1_s8_3' }],
  },
  learningGoal:
    'You will define a sequence as an ordered list and refer to a term by its position, and decide when listed terms do not determine what comes next.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: ['Find the nth term of a pattern with a constant difference.', 'Read a value from a table by its position.', 'Describe a pattern in words.'],
    ifNotReady: 'You have found nth terms before; this chapter gives that work its language.',
  },
  vocabulary: [
    { term: 'sequence', meaning: 'An ordered list of numbers.' },
    { term: 'term', meaning: 'One entry of the sequence.' },
    { term: 'position', meaning: 'The counting number saying where a term sits, written n.' },
  ],
  explanation: [
    'You have been finding rules for patterns since Class 8, and again with linear patterns in Part I. What this chapter adds is the vocabulary to talk about them precisely.',
    'A sequence is an ordered list of numbers. The order is part of what it is: 2, 4, 6 and 6, 4, 2 are different sequences made of the same numbers. Each entry is a term, and the position n says where it sits — the first term, the second term, and so on.',
    'Sequences appear everywhere once named. Petal counts on flowers, the days in successive months, the balance of a savings account growing each year. Writing them as ordered lists is what lets the same tools apply to all of them.',
    'Now a caution that this chapter takes seriously. Given 2, 4, 6, 8, most people say 10 — and the rule add 2 does give that. But 2, 4, 6, 8 is also the start of other rules, and nothing in four terms rules those out. Finitely many terms never determine the continuation by themselves.',
    'So a sequence is properly given by a rule, not by a handful of terms and a hope. Asking "what comes next" is really asking "which rule did you intend", and the rest of this chapter is about stating rules precisely enough that the question has one answer.',
  ],
  representations: ['An ordered list with its positions written above its terms', 'Two different rules agreeing on the first four terms and parting afterwards'],
  visuals: [],
  visualsById: {  },
  workedExamples: [
    {
      id: 's81.we1',
      prompt: 'Write the first four terms of the sequence whose nth term is 3n + 1.',
      steps: [
        { text: 'Substitute n = 1: 3 times 1 plus 1 = 4.', reasoning: 'The position is the input, and the rule turns it into the term.' },
        { text: 'Then n = 2, 3, 4 give 7, 10 and 13.', reasoning: 'Each position produces exactly one term, in order.' },
        { text: 'Write them as an ordered list.', reasoning: 'The order carries the positions, which is what makes it a sequence.' },
      ],
      answer: '4, 7, 10, 13.',
    },
    {
      id: 's81.we2',
      prompt: 'Are 5, 10, 15 and 15, 10, 5 the same sequence?',
      steps: [
        { text: 'They contain the same three numbers.', reasoning: 'As collections they are identical.' },
        { text: 'But the first term differs: 5 in one and 15 in the other.', reasoning: 'A term is identified by its position, so position 1 must match.' },
        { text: 'Order is part of what a sequence is.', reasoning: 'Two sequences are the same only when every position carries the same term.' },
      ],
      answer: 'No. Same numbers, different order, so different sequences.',
    },
    {
      id: 's81.we3',
      prompt: 'Someone writes 1, 2, 4 and asks for the next term. Why is there more than one defensible answer?',
      steps: [
        { text: 'Doubling gives 8, since each term is twice the one before.', reasoning: 'One rule fits all three terms.' },
        { text: 'Adding one more each time gives 7: the gaps are 1, then 2, then 3.', reasoning: 'A different rule fits the same three terms.' },
        { text: 'Both agree on 1, 2, 4 and disagree afterwards.', reasoning: 'Three terms are not enough to separate them.' },
      ],
      answer: 'Both 8 and 7 are defensible; three terms do not determine the rule.',
    },
  ],
  misconceptionIds: [],
  guidedPractice: [
    {
      id: 's81.g1',
      prompt: 'What is the third term of the sequence 7, 11, 15, 19?',
      hint: 'Count positions from one.',
      answer: '15',
      rationale: 'Position three carries the term 15.',
    },
    {
      id: 's81.g2',
      prompt: 'Write the first three terms of the sequence with nth term 5n − 2.',
      hint: 'Substitute n = 1, 2, 3.',
      answer: '3, 8, 13',
      rationale: 'Each position gives one term.',
    },
    {
      id: 's81.g3',
      prompt: 'Do four given terms always determine the next one?',
      hint: 'Could two rules agree on four terms?',
      answer: 'No.',
      rationale: 'Finitely many terms never pin down a rule by themselves.',
    },
  ],
  independentPractice: [
    {
      id: 's81.i1',
      prompt: 'Write the first five terms of the sequence with nth term n squared.',
      answer: '1, 4, 9, 16, 25.',
      rationale: 'Squaring each position.',
    },
    {
      id: 's81.i2',
      prompt: 'Give two different rules that both begin 3, 6.',
      answer: 'Doubling gives 3, 6, 12; adding 3 gives 3, 6, 9.',
      rationale: 'Two terms are far from enough to distinguish rules.',
    },
    {
      id: 's81.i3',
      prompt: 'Explain why order matters in a sequence.',
      answer: 'Because a term is identified by its position.',
      rationale: 'Changing the order changes which term sits where.',
    },
  ],
  reasoningApplication: [
    {
      id: 's81.r1',
      prompt: 'A puzzle asks for "the next number" in a sequence and marks one answer correct. Explain what the puzzle is really assuming, and whether the marking is mathematically justified.',
      expectedReasoning:
        'It assumes a particular intended rule, usually the simplest one the setter had in mind, and treats that as the answer. Mathematically a different rule fitting the given terms is equally valid, so the marking is a convention about simplicity rather than a deduction. A strong answer defends an unexpected answer that fits the given terms.',
    },
  ],
  interactivePractice: [],
  summary:
    'A sequence is an ordered list, with each term identified by its position. Finitely many terms never determine what comes next, so a sequence is properly given by a rule rather than by examples.',
  nextStep:
    'Next you will state a rule that gives any term directly from its position.',
  teacher: {
    objective: 'Students define sequences and recognise that listed terms underdetermine a rule.',
    prerequisiteKnowledge: ['Nth terms from earlier work', 'Tables'],
    modelLanguage: ['Which position is that?', 'Could another rule fit these terms?'],
    teachingNotes: [
      'Do not open as though patterns are new. Students have found nth terms twice before; this chapter names what they were doing.',
      'The underdetermination point is worth real time — it is what separates mathematics from a puzzle page.',
    ],
    quickChecks: ['Term or position?', 'Is one answer the only defensible one?'],
    supportForStrugglingLearners: [
      'Write positions above terms in every list.',
      'Ask for a second rule fitting the same opening terms.',
    ],
    extension: ['Ask for two rules agreeing on five terms and differing on the sixth.'],
    materialsNeeded: ['Exercise book'],
  },
  reviewStatus: 'authored_draft',
};

export const SECTION_8_2: AuthoredSection = {
  contentArtifactId: 'ncert_iemh1_s8_2_lesson',
  contentArtifactVersion: 1,
  source: source('8.2', 'Explicit Rule for a Sequence', 3, 'ncert_iemh1_s8_2'),
  competencyCandidates: [],
  competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_iemh1_s8_1'],
    mayAssume: ['Sequences, terms and positions', 'Evaluating an expression', 'Solving a simple equation'],
    mustNotIntroduce: [{ concept: 'Recursive rules', belongsToSection: 'ncert_iemh1_s8_3' }, { concept: 'Arithmetic progressions', belongsToSection: 'ncert_iemh1_s8_4' }],
  },
  learningGoal:
    'You will give a sequence by an explicit rule in n, use it to find any term directly, and decide whether a given number is a term.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: ['Substitute a value into an expression.', 'Solve an equation such as 4n + 1 = 33.', 'Say what the position n means.'],
    ifNotReady: 'Make sure substitution is fluent; an explicit rule is substitution with the position as input.',
  },
  vocabulary: [
    { term: 'explicit rule', meaning: 'A rule giving the term directly from its position, written u_n.' },
    { term: 'u_n', meaning: 'Standard notation for the term at position n.' },
  ],
  explanation: [
    'An explicit rule says what the term at position n is, in terms of n alone. Write u_n = 4n + 1 and the sequence is fixed: 5, 9, 13, 17, and so on.',
    'The advantage is directness. To find the hundredth term you substitute n = 100 and get 401, without producing the ninety-nine terms before it. A rule that needed its predecessors would make that a long job.',
    'The rule also answers membership questions. Is 61 a term of this sequence? Set 4n + 1 = 61, which gives n = 15 — a whole number, so yes, 61 is the fifteenth term. Try 62 and you get n = 15.25, which is not a position, so 62 is not a term at all.',
    'That is worth pausing on. Positions are counting numbers, so a non-whole answer is not a near miss but a definite no. The equation has a solution; the sequence does not have that term.',
    'Explicit rules are not limited to linear expressions. The rule u_n = n squared gives 1, 4, 9, 16, and u_n = 2 to the power n gives 2, 4, 8, 16. In every case the position goes in and the term comes out.',
  ],
  representations: ['A rule with positions substituted to produce the first terms', 'The membership question solved as an equation in n'],
  visuals: [],
  visualsById: {  },
  workedExamples: [
    {
      id: 's82.we1',
      prompt: 'For u_n = 6n − 2, find the first three terms and the twentieth.',
      steps: [
        { text: 'Substitute n = 1, 2, 3: 4, 10, 16.', reasoning: 'The position is the input to the rule.' },
        { text: 'For the twentieth, substitute n = 20 directly.', reasoning: 'No earlier terms are needed, which is the point of an explicit rule.' },
        { text: '6 times 20 minus 2 is 118.', reasoning: 'One substitution reaches any position.' },
      ],
      answer: '4, 10, 16, and the twentieth term is 118.',
    },
    {
      id: 's82.we2',
      prompt: 'Is 95 a term of the sequence u_n = 6n − 2?',
      steps: [
        { text: 'Set 6n − 2 = 95.', reasoning: 'Membership means some position produces that value.' },
        { text: 'So 6n = 97 and n = 97/6, which is not a whole number.', reasoning: 'Solving gives the only position that could work.' },
        { text: 'Positions must be counting numbers.', reasoning: 'A fractional position does not exist, so no term equals 95.' },
      ],
      answer: 'No. The equation gives a fractional position, so 95 is not a term.',
    },
    {
      id: 's82.we3',
      prompt: 'Is 118 a term, and if so which?',
      steps: [
        { text: 'Set 6n − 2 = 118, so 6n = 120.', reasoning: 'Same method, different target value.' },
        { text: 'That gives n = 20, a whole number.', reasoning: 'A valid position, so the value does occur.' },
        { text: 'So 118 is the twentieth term.', reasoning: 'The position answers both whether and where.' },
      ],
      answer: 'Yes, it is the twentieth term.',
    },
  ],
  misconceptionIds: [],
  guidedPractice: [
    {
      id: 's82.g1',
      prompt: 'For u_n = 3n + 4, find the fifth term.',
      hint: 'Substitute n = 5.',
      answer: '19',
      rationale: 'Fifteen plus four.',
    },
    {
      id: 's82.g2',
      prompt: 'Is 20 a term of u_n = 3n + 4?',
      hint: 'Solve 3n + 4 = 20.',
      answer: 'No.',
      rationale: 'n would be 16/3, which is not a whole number.',
    },
    {
      id: 's82.g3',
      prompt: 'Why can you find the hundredth term without the ninety-ninth?',
      hint: 'What does the rule take as input?',
      answer: 'Because the rule uses only the position.',
      rationale: 'Nothing earlier is needed.',
    },
  ],
  independentPractice: [
    {
      id: 's82.i1',
      prompt: 'For u_n = n squared + 1, write the first four terms.',
      answer: '2, 5, 10, 17.',
      rationale: 'Squaring the position and adding one.',
    },
    {
      id: 's82.i2',
      prompt: 'Is 50 a term of u_n = 7n + 1? If so, which?',
      answer: 'Yes, the seventh term.',
      rationale: '7n = 49 gives n = 7.',
    },
    {
      id: 's82.i3',
      prompt: 'Explain why a fractional answer to the membership equation means the number is not a term.',
      answer: 'Because positions are counting numbers.',
      rationale: 'There is no term at position 15.25.',
    },
  ],
  reasoningApplication: [
    {
      id: 's82.r1',
      prompt: 'Two explicit rules produce the same first three terms. Must they produce the same sequence? Explain, and say what would settle it.',
      expectedReasoning:
        'No — agreeing at three positions does not make two expressions equal, and they may part at the fourth. What settles it is comparing the rules themselves rather than their outputs, since equal rules give equal terms everywhere. A strong answer connects this to the underdetermination of the previous lesson.',
    },
  ],
  interactivePractice: [],
  summary:
    'An explicit rule gives u_n directly from the position n, so any term is one substitution away, and membership is decided by solving for n and checking it is a counting number.',
  nextStep:
    'Next you will meet rules that build each term from the ones before it.',
  teacher: {
    objective: 'Students use explicit rules and decide membership by solving for the position.',
    prerequisiteKnowledge: ['Substitution', 'Solving equations'],
    modelLanguage: ['What is n here?', 'Is that position a counting number?'],
    teachingNotes: [
      'The membership question is where the position-must-be-whole idea bites. Give one that fails as well as one that works.',
      'Introduce u_n notation here but keep it light; the idea is the input-output, not the symbol.',
    ],
    quickChecks: ['Which position?', 'Whole number or not?'],
    supportForStrugglingLearners: [
      'Write the substitution out before computing.',
      'Lay membership questions out as an equation to solve.',
    ],
    extension: ['Ask for the smallest term of u_n = 4n + 1 above 500.'],
    materialsNeeded: ['Exercise book'],
  },
  reviewStatus: 'authored_draft',
};

export const SECTION_8_3: AuthoredSection = {
  contentArtifactId: 'ncert_iemh1_s8_3_lesson',
  contentArtifactVersion: 1,
  source: source('8.3', 'Recursive Rule for a Sequence', 5, 'ncert_iemh1_s8_3'),
  competencyCandidates: [],
  competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_iemh1_s8_2'],
    mayAssume: ['Explicit rules', 'Sequences and positions', 'Substitution'],
    mustNotIntroduce: [{ concept: 'Arithmetic progressions', belongsToSection: 'ncert_iemh1_s8_4' }, { concept: 'Geometric progressions', belongsToSection: 'ncert_iemh1_s8_6' }],
  },
  learningGoal:
    'You will give a sequence by a recursive rule built from earlier terms, and compare what recursive and explicit descriptions each make easy.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: ['Use an explicit rule to find a term.', 'Add and multiply accurately in a chain.', 'Say what a starting value is.'],
    ifNotReady: 'Make sure explicit rules are secure; this lesson contrasts a second kind of rule with them.',
  },
  vocabulary: [
    { term: 'recursive rule', meaning: 'A rule giving each term from one or more earlier terms.' },
    { term: 'starting value', meaning: 'The term or terms the recursion needs before it can begin.' },
  ],
  explanation: [
    'A rule can describe how to get from one term to the next instead of giving the term directly. Start at 3 and each term is the previous one plus 5: that gives 3, 8, 13, 18. This is a recursive rule.',
    'A recursive rule is incomplete without its starting value. The instruction add 5 describes infinitely many sequences until you say where to begin, which is why the first term must be stated as part of the rule rather than read off a list.',
    'Rules can look further back than one term. A rule where each term is the sum of the two before it, starting 1 and 1, gives 1, 1, 2, 3, 5, 8 — and one that sums the three before it, starting 1, 1, 2, gives 1, 1, 2, 4, 7, 13. The more terms a rule looks back at, the more starting values it needs.',
    'The trade-off between the two kinds is the point of this lesson. A recursive rule often states how a situation actually works — a balance grows by interest on what is already there — and it is easy to continue step by step. But reaching the hundredth term means computing all ninety-nine before it.',
    'An explicit rule is the reverse: it may be harder to spot from a situation, and it reaches any term at once. Neither is better in general. For some sequences, such as the sum-of-the-two-before one, a simple recursive rule exists and no simple explicit rule does.',
  ],
  representations: ['A recursive rule with its starting value, generating the first terms', 'The same sequence described both ways, with the cost of each'],
  visuals: [],
  visualsById: {  },
  workedExamples: [
    {
      id: 's83.we1',
      prompt: 'A sequence starts at 4 and each term is the previous one plus 7. Write the first five terms.',
      steps: [
        { text: 'The first term is given as 4.', reasoning: 'A recursive rule cannot start without it.' },
        { text: 'Each next term adds 7 to the one before.', reasoning: 'Applying the rule once gets one step forward.' },
        { text: 'So 4, 11, 18, 25, 32.', reasoning: 'Each term depends on the one immediately before it.' },
      ],
      answer: '4, 11, 18, 25, 32.',
    },
    {
      id: 's83.we2',
      prompt: 'Each term is the sum of the two before it, starting 2 and 3. Write six terms.',
      steps: [
        { text: 'Two starting values are needed, since the rule looks two terms back.', reasoning: 'A rule reaching back k terms needs k starting values.' },
        { text: 'The third is 2 + 3 = 5; the fourth is 3 + 5 = 8.', reasoning: 'Each new term uses the two most recent ones.' },
        { text: 'Continuing gives 13 and 21.', reasoning: 'The pattern grows quickly because each term carries both predecessors.' },
      ],
      answer: '2, 3, 5, 8, 13, 21.',
    },
    {
      id: 's83.we3',
      prompt: 'Which description would you use to find the fiftieth term of "start at 4, add 7"?',
      steps: [
        { text: 'Recursively it would take forty-nine additions.', reasoning: 'Each step advances only one position.' },
        { text: 'The pattern is 4, then 4 + 7, then 4 + 2 times 7, so the nth term is 4 + (n − 1) times 7.', reasoning: 'Writing out the structure converts the recursion into an explicit rule.' },
        { text: 'Substituting n = 50 gives 4 + 343 = 347.', reasoning: 'One substitution replaces forty-nine steps.' },
      ],
      answer: 'The explicit rule: 347, in one step rather than forty-nine.',
    },
  ],
  misconceptionIds: [],
  guidedPractice: [
    {
      id: 's83.g1',
      prompt: 'A sequence starts at 10 and each term is the previous one minus 3. Write four terms.',
      hint: 'Subtract each time.',
      answer: '10, 7, 4, 1',
      rationale: 'Each term is three less than the one before.',
    },
    {
      id: 's83.g2',
      prompt: 'Why must a recursive rule state its first term?',
      hint: 'Does "add 5" say where to begin?',
      answer: 'Because the rule alone does not say where to start.',
      rationale: 'Many sequences obey the same step rule.',
    },
    {
      id: 's83.g3',
      prompt: 'How many starting values does a rule summing the three previous terms need?',
      hint: 'How far back does it look?',
      answer: 'Three.',
      rationale: 'It cannot begin until three terms exist.',
    },
  ],
  independentPractice: [
    {
      id: 's83.i1',
      prompt: 'Start at 1, each term double the previous. Write five terms.',
      answer: '1, 2, 4, 8, 16.',
      rationale: 'Each step multiplies by two.',
    },
    {
      id: 's83.i2',
      prompt: 'Give a recursive rule for 5, 9, 13, 17.',
      answer: 'Start at 5; each term is the previous plus 4.',
      rationale: 'The step is constant, and the starting value is stated.',
    },
    {
      id: 's83.i3',
      prompt: 'Explain one advantage of each kind of rule.',
      answer: 'Recursive often matches how a situation works; explicit reaches any term at once.',
      rationale: 'They answer different questions easily.',
    },
  ],
  reasoningApplication: [
    {
      id: 's83.r1',
      prompt: 'A savings balance grows each year by interest on the amount already there. Explain why a recursive description fits that situation naturally, and what you would gain by also finding an explicit rule.',
      expectedReasoning:
        'The recursion mirrors the mechanism — next year’s balance is computed from this year’s — so it is the honest model. An explicit rule would give the balance after thirty years without stepping through all thirty. A strong answer treats the two as complementary rather than ranking them.',
    },
  ],
  interactivePractice: [],
  summary:
    'A recursive rule builds each term from earlier ones and needs as many starting values as it looks back. It often matches how a situation works and is easy to continue, while an explicit rule reaches any position at once.',
  nextStep:
    'Next you will name the family where the recursive step is always the same addition.',
  teacher: {
    objective: 'Students use recursive rules and compare them with explicit ones.',
    prerequisiteKnowledge: ['Explicit rules', 'Arithmetic chains'],
    modelLanguage: ['What is the starting value?', 'How far back does the rule look?'],
    teachingNotes: [
      'The missing-starting-value error is immediate and instructive. Ask for a rule without one and show how many sequences fit.',
      'Keep the comparison balanced; students otherwise decide explicit is simply better.',
    ],
    quickChecks: ['How many starting values?', 'Which description suits this question?'],
    supportForStrugglingLearners: [
      'Compute terms in a column, writing the rule beside each step.',
      'State the starting value on its own line.',
    ],
    extension: ['Ask whether the sum-of-two-before sequence has a simple explicit rule.'],
    materialsNeeded: ['Exercise book'],
  },
  reviewStatus: 'authored_draft',
};

export const SECTION_8_4: AuthoredSection = {
  contentArtifactId: 'ncert_iemh1_s8_4_lesson',
  contentArtifactVersion: 1,
  source: source('8.4', 'Arithmetic Progressions', 7, 'ncert_iemh1_s8_4'),
  competencyCandidates: [],
  competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_iemh1_s8_3'],
    mayAssume: ['Explicit and recursive rules', 'Constant differences from Part I chapter 2', 'Algebraic simplification'],
    mustNotIntroduce: [{ concept: 'Summing an arithmetic progression', belongsToSection: 'ncert_iemh1_s8_5' }, { concept: 'Geometric progressions', belongsToSection: 'ncert_iemh1_s8_6' }],
  },
  learningGoal:
    'You will name an arithmetic progression by its constant difference and derive its nth term as a + (n − 1)d.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: ['Find the difference between consecutive terms.', 'Write both an explicit and a recursive rule.', 'Simplify an expression such as 1 + (n − 1)4.'],
    ifNotReady: 'Make sure constant differences are familiar; this lesson names that family and derives its rule.',
  },
  vocabulary: [
    { term: 'arithmetic progression', meaning: 'A sequence where consecutive terms differ by a constant.' },
    { term: 'common difference', meaning: 'That constant, written d.' },
    { term: 'first term', meaning: 'The term at position one, written a.' },
  ],
  explanation: [
    'A sequence where each term exceeds the previous one by the same amount is an arithmetic progression, or AP. The constant is the common difference d, and the first term is a. Those two numbers determine the whole sequence.',
    'Derive the nth term by writing the terms without simplifying. With a = 1 and d = 4: the first is 1, the second is 1 + 4, the third is 1 + 2 times 4, the fourth is 1 + 3 times 4. The pattern in the multiplier is the point — it is always one less than the position.',
    'So the nth term is a + (n − 1)d. The (n − 1) is not a decoration: it counts the steps taken, and there are n − 1 steps from the first term to the nth, not n. Writing n instead is the standard error here, and it shifts every answer by one d.',
    'The recursive description sits alongside it: start at a, and each term is the previous plus d. Both describe the same sequence, and this chapter is the first place you have both forms for a named family.',
    'The difference may be negative, which makes the terms fall: a = 50 with d = −6 gives 50, 44, 38. It may be zero, giving a constant sequence. Nothing in the derivation assumed d was positive.',
  ],
  representations: ['Terms written unsimplified so the multiplier pattern is visible', 'The step count n − 1 marked on a run of terms'],
  visuals: [],
  visualsById: {  },
  workedExamples: [
    {
      id: 's84.we1',
      prompt: 'An AP has first term 7 and common difference 5. Find its twelfth term.',
      steps: [
        { text: 'Identify a = 7 and d = 5.', reasoning: 'These two numbers determine the whole AP.' },
        { text: 'The nth term is a + (n − 1)d, so the twelfth uses 11 steps.', reasoning: 'There are eleven steps from the first term to the twelfth, not twelve.' },
        { text: '7 + 11 times 5 = 7 + 55 = 62.', reasoning: 'Substituting into the derived rule.' },
      ],
      answer: '62.',
    },
    {
      id: 's84.we2',
      prompt: 'An AP is 3, 10, 17, 24. Find its nth term and its fiftieth term.',
      steps: [
        { text: 'The common difference is 10 − 3 = 7, constant across the terms.', reasoning: 'Checking more than one gap confirms it really is an AP.' },
        { text: 'With a = 3 and d = 7, the nth term is 3 + (n − 1)7.', reasoning: 'Substituting into the general rule.' },
        { text: 'Simplify to 7n − 4.', reasoning: 'Expanding gives 3 + 7n − 7, which tidies.' },
        { text: 'At n = 50: 350 − 4 = 346.', reasoning: 'One substitution reaches the fiftieth term.' },
      ],
      answer: 'nth term 7n − 4; the fiftieth term is 346.',
    },
    {
      id: 's84.we3',
      prompt: 'An AP has first term 5 and twentieth term 81. Find the common difference.',
      steps: [
        { text: 'From the first to the twentieth is nineteen steps.', reasoning: 'The step count is one less than the position, which is where (n − 1) comes from.' },
        { text: 'So 5 + 19d = 81, giving 19d = 76.', reasoning: 'Setting the rule equal to the known term.' },
        { text: 'Therefore d = 4.', reasoning: 'Dividing by the number of steps.' },
      ],
      answer: 'The common difference is 4.',
    },
  ],
  misconceptionIds: [],
  guidedPractice: [
    {
      id: 's84.g1',
      prompt: 'An AP has a = 2 and d = 6. Find the tenth term.',
      hint: 'Nine steps from the first.',
      answer: '56',
      rationale: 'Two plus fifty-four.',
    },
    {
      id: 's84.g2',
      prompt: 'Why is it (n − 1)d and not nd?',
      hint: 'How many steps from term one to term n?',
      answer: 'Because there are n − 1 steps to the nth term.',
      rationale: 'Using n would add one extra difference.',
    },
    {
      id: 's84.g3',
      prompt: 'An AP is 20, 17, 14. What is d?',
      hint: 'Are the terms rising or falling?',
      answer: '−3',
      rationale: 'A falling AP has a negative common difference.',
    },
  ],
  independentPractice: [
    {
      id: 's84.i1',
      prompt: 'Find the nth term of the AP 4, 11, 18, 25.',
      answer: '7n − 3.',
      rationale: 'a = 4 and d = 7.',
    },
    {
      id: 's84.i2',
      prompt: 'An AP has a = 100 and d = −7. Find its fifteenth term.',
      answer: '2.',
      rationale: '100 minus 98.',
    },
    {
      id: 's84.i3',
      prompt: 'Explain why two numbers are enough to determine an entire AP.',
      answer: 'Because every term is the first plus a whole number of equal steps.',
      rationale: 'a fixes the start and d fixes every step.',
    },
  ],
  reasoningApplication: [
    {
      id: 's84.r1',
      prompt: 'An AP has a negative common difference. Explain what eventually happens to its terms, and whether every AP with d negative must at some point go below zero.',
      expectedReasoning:
        'The terms fall by a fixed amount forever, so however large a is they eventually pass below zero and keep going. A strong answer argues from the unbounded accumulation of equal steps rather than from an example, and notes the contrast with a GP of ratio between zero and one, which falls without ever reaching zero.',
    },
  ],
  interactivePractice: [],
  summary:
    'An arithmetic progression is fixed by its first term a and common difference d, with nth term a + (n − 1)d — the n − 1 counting the steps taken rather than the terms. The difference may be negative or zero.',
  nextStep:
    'Next you will add up the terms of such a progression rather than finding one of them.',
  teacher: {
    objective: 'Students derive and apply the AP nth term.',
    prerequisiteKnowledge: ['Constant differences', 'Algebraic simplification'],
    modelLanguage: ['How many steps to that term?', 'Is the difference really constant?'],
    teachingNotes: [
      'Write the terms unsimplified before deriving. The multiplier pattern is what makes (n − 1) obvious rather than arbitrary.',
      'The off-by-one error is the chapter’s commonest; make the step count a spoken check.',
    ],
    quickChecks: ['a and d here?', 'How many steps, not how many terms?'],
    supportForStrugglingLearners: [
      'Write the terms as a, a + d, a + 2d before any formula.',
      'Count steps on a drawn number line.',
    ],
    extension: ['Ask which term of 7, 11, 15 first exceeds 200.'],
    materialsNeeded: ['Exercise book'],
  },
  reviewStatus: 'authored_draft',
};

export const SECTION_8_5: AuthoredSection = {
  contentArtifactId: 'ncert_iemh1_s8_5_lesson',
  contentArtifactVersion: 1,
  source: source('8.5', 'Sum of the First n Natural Numbers', 10, 'ncert_iemh1_s8_5'),
  competencyCandidates: [],
  competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_iemh1_s8_4'],
    mayAssume: ['Arithmetic progressions and their nth term', 'Adding a list of numbers', 'Algebraic rearrangement'],
    mustNotIntroduce: [{ concept: 'Geometric progressions', belongsToSection: 'ncert_iemh1_s8_6' }],
  },
  learningGoal:
    'You will derive the sum of the first n natural numbers by pairing from the two ends, and extend the method to any arithmetic progression.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: ['Find the nth term of an AP.', 'Multiply and divide accurately.', 'Add a short list of numbers.'],
    ifNotReady: 'Make sure the AP nth term is secure; the sum uses the first and last terms.',
  },
  vocabulary: [
    { term: 'sum of a progression', meaning: 'The total of its first n terms.' },
    { term: 'pairing', meaning: 'Matching the first term with the last, the second with the second last, and so on.' },
  ],
  explanation: [
    'Adding 1 + 2 + 3 + ... + 100 term by term is tedious and error-prone. Pairing makes it immediate.',
    'Pair the first with the last: 1 + 100 = 101. The second with the second last: 2 + 99 = 101. Every pair totals the same, because moving one step up from one end and one step down from the other leaves the sum unchanged. There are 50 such pairs, so the total is 50 times 101 = 5050.',
    'In general, the sum of the first n natural numbers is n(n + 1)/2. The halving is there because pairing uses each term once across n/2 pairs, and the formula is written to work whether n is odd or even.',
    'The same pairing works for any AP, because what made it work was equal steps rather than anything about the numbers 1, 2, 3. Pair first with last in any AP and every pair totals a + l, where l is the last term. So the sum of n terms is n(a + l)/2 — the number of terms times the average of the first and last.',
    'That reading is worth keeping: the sum is n times the average of the two ends. An AP is balanced about its middle, which is why its average is the average of its extremes, and why nothing in between needs adding.',
  ],
  representations: ['The terms written forwards and backwards, paired into equal totals', 'A general AP paired the same way, each pair totalling a + l'],
  visuals: [],
  visualsById: {  },
  workedExamples: [
    {
      id: 's85.we1',
      prompt: 'Find 1 + 2 + 3 + ... + 60.',
      steps: [
        { text: 'Pair the first with the last: 1 + 60 = 61.', reasoning: 'Every such pair has the same total, since one end rises as the other falls.' },
        { text: 'There are 60 terms, so 30 pairs.', reasoning: 'Each pair uses two terms, so sixty terms give thirty pairs.' },
        { text: 'The total is 30 times 61 = 1830.', reasoning: 'Which is the formula n(n+1)/2 with n = 60.' },
      ],
      answer: '1830.',
    },
    {
      id: 's85.we2',
      prompt: 'Find the sum of the first 20 terms of the AP 5, 9, 13, ...',
      steps: [
        { text: 'The common difference is 4, so the twentieth term is 5 + 19 times 4 = 81.', reasoning: 'The last term is needed before pairing can be used.' },
        { text: 'Pair first with last: 5 + 81 = 86, the same for every pair.', reasoning: 'Equal steps are what make the pair totals equal.' },
        { text: 'The sum is 20 times 86 divided by 2.', reasoning: 'Twenty terms give ten pairs, which the formula writes as n(a + l)/2.' },
        { text: 'That is 860.', reasoning: 'Twenty terms make ten pairs, each totalling 86.' },
      ],
      answer: '860.',
    },
    {
      id: 's85.we3',
      prompt: 'Why does the pairing argument work for any AP, not only for 1, 2, 3, ...?',
      steps: [
        { text: 'Moving one term in from the start adds d; moving one term in from the end subtracts d.', reasoning: 'The two changes are equal in size and opposite in sign.' },
        { text: 'So each pair total is unchanged from the first pair.', reasoning: 'The cancellation depends only on the steps being equal.' },
        { text: 'Nothing about the particular values was used.', reasoning: 'Which is why the method generalises to every AP.' },
      ],
      answer: 'Because equal steps make the gain at one end cancel the loss at the other.',
    },
  ],
  misconceptionIds: [],
  guidedPractice: [
    {
      id: 's85.g1',
      prompt: 'Find 1 + 2 + ... + 40.',
      hint: 'Use n(n+1)/2.',
      answer: '820',
      rationale: 'Forty times forty-one over two.',
    },
    {
      id: 's85.g2',
      prompt: 'An AP has first term 3, last term 99 and 25 terms. Find its sum.',
      hint: 'Number of terms times the average of the ends.',
      answer: '1275',
      rationale: 'Twenty-five times 102 over two.',
    },
    {
      id: 's85.g3',
      prompt: 'Why is the sum half of n times (a + l)?',
      hint: 'How many pairs do n terms make?',
      answer: 'Because n terms give n/2 pairs.',
      rationale: 'Each pair totals a + l.',
    },
  ],
  independentPractice: [
    {
      id: 's85.i1',
      prompt: 'Find the sum of the first 100 odd numbers, 1 + 3 + ... + 199.',
      answer: '10000.',
      rationale: 'One hundred terms, pairs totalling 200.',
    },
    {
      id: 's85.i2',
      prompt: 'Find the sum of the first 15 terms of the AP 8, 12, 16, ...',
      answer: '540.',
      rationale: 'The fifteenth term is 64; fifteen times 72 over two.',
    },
    {
      id: 's85.i3',
      prompt: 'Explain the sum as "number of terms times the average of the ends".',
      answer: 'Because an AP is balanced about its middle, so its average is the average of its extremes.',
      rationale: 'That average times the count gives the total.',
    },
  ],
  reasoningApplication: [
    {
      id: 's85.r1',
      prompt: 'The sum of the first n natural numbers is n(n + 1)/2, which is never a fraction even though it is divided by two. Explain why the division always comes out whole.',
      expectedReasoning:
        'Of n and n + 1 one is always even, so their product is even and halving leaves a whole number. A strong answer argues from consecutive integers rather than checking cases, and connects it to the pairing: either the terms pair exactly, or one middle term is left whose value is the average.',
    },
  ],
  interactivePractice: [],
  summary:
    'Pairing the first term with the last gives equal totals, so the first n natural numbers sum to n(n + 1)/2 and any AP of n terms sums to n(a + l)/2 — the number of terms times the average of the two ends.',
  nextStep:
    'Next you will meet the family where each step multiplies rather than adds.',
  teacher: {
    objective: 'Students derive the AP sum by pairing and apply it.',
    prerequisiteKnowledge: ['AP nth term', 'Arithmetic'],
    modelLanguage: ['What do the two ends add to?', 'How many pairs?'],
    teachingNotes: [
      'Write the sum forwards and backwards on two lines and add columns; the equal totals become visible rather than asserted.',
      'The "average of the ends times the count" reading is the one students retain; give it explicitly.',
    ],
    quickChecks: ['What is the last term?', 'How many pairs do these terms make?'],
    supportForStrugglingLearners: [
      'Do a short case such as 1 to 10 by hand and by pairing, and compare.',
      'Find the last term before attempting any sum.',
    ],
    extension: ['Ask for the sum of the first n even numbers, derived rather than recalled.'],
    materialsNeeded: ['Exercise book'],
  },
  reviewStatus: 'authored_draft',
};

export const SECTION_8_6_ALGEBRA: AuthoredSection = {
  contentArtifactId: 'ncert_iemh1_s8_6_algebra_lesson',
  contentArtifactVersion: 1,
  source: source('8.6', 'Geometric Progressions', 13, 'ncert_iemh1_s8_6'),
  competencyCandidates: [],
  competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_iemh1_s8_4'],
    mayAssume: ['Arithmetic progressions and their nth term', 'Powers of a number', 'Explicit and recursive rules'],
    mustNotIntroduce: [{ concept: 'Seeing a GP: fractals and growth', belongsToSection: 'ncert_iemh1_s8_6' }],
  },
  learningGoal:
    'You will name a geometric progression by its constant ratio and derive its nth term as a times r to the power n − 1.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: ['Find the nth term of an AP.', 'Compute a power such as 3 to the fourth.', 'Divide one term by the previous one.'],
    ifNotReady: 'Make sure powers are comfortable; a GP’s rule is a power of the ratio.',
  },
  vocabulary: [
    { term: 'geometric progression', meaning: 'A sequence where each term is a constant multiple of the one before.' },
    { term: 'common ratio', meaning: 'That constant, written r, found by dividing any term by the one before it.' },
  ],
  explanation: [
    'An AP adds the same amount each step. A geometric progression multiplies by the same amount each step. The sequence 3, 6, 12, 24 doubles every time, so it is a GP with common ratio 2.',
    'Find the ratio by dividing, not subtracting: 6 divided by 3 is 2, and 12 divided by 6 is 2. If those quotients are not equal the sequence is not a GP, just as unequal differences rule out an AP.',
    'Derive the nth term the same way as for the AP, by not simplifying. With a = 3 and r = 2: the first term is 3, the second is 3 times 2, the third is 3 times 2 squared, the fourth is 3 times 2 cubed. The exponent is one less than the position, for the same reason the AP multiplier was — it counts steps.',
    'So the nth term is a times r to the power n − 1. The recursive description sits beside it: start at a and multiply by r each time.',
    'The ratio need not exceed one. With r = 1/2 the terms halve: 80, 40, 20, 10, falling towards zero without ever reaching it. A negative ratio makes the signs alternate. The derivation assumed none of these were excluded, so the rule covers them all.',
  ],
  representations: ['Terms written as a, ar, ar squared so the exponent pattern shows', 'A GP with ratio one half, falling but never reaching zero'],
  visuals: [],
  visualsById: {  },
  workedExamples: [
    {
      id: 's86a.we1',
      prompt: 'A GP has first term 5 and common ratio 3. Find its sixth term.',
      steps: [
        { text: 'Identify a = 5 and r = 3.', reasoning: 'These two numbers determine the whole GP.' },
        { text: 'The nth term is a times r to the power n − 1, so the sixth uses the fifth power.', reasoning: 'Five steps separate the first term from the sixth.' },
        { text: '3 to the fifth is 243, and 5 times 243 is 1215.', reasoning: 'Substituting into the derived rule.' },
      ],
      answer: '1215.',
    },
    {
      id: 's86a.we2',
      prompt: 'Is 2, 6, 18, 54 a GP, and what is its nth term?',
      steps: [
        { text: 'Divide consecutive terms: 6/2 = 3, 18/6 = 3, 54/18 = 3.', reasoning: 'Equal quotients are the test for a GP, as equal differences are for an AP.' },
        { text: 'So a = 2 and r = 3.', reasoning: 'The first term and the constant ratio.' },
        { text: 'The nth term is 2 times 3 to the power n − 1.', reasoning: 'Substituting into the general rule.' },
      ],
      answer: 'Yes, a GP; nth term 2 times 3 to the power n − 1.',
    },
    {
      id: 's86a.we3',
      prompt: 'A GP has first term 64 and ratio one half. Write five terms and describe their behaviour.',
      steps: [
        { text: 'Each term is half the one before: 64, 32, 16, 8, 4.', reasoning: 'Multiplying by a ratio below one makes the terms fall.' },
        { text: 'The terms keep halving and stay positive.', reasoning: 'Halving a positive number never produces zero or a negative.' },
        { text: 'They approach zero without ever reaching it.', reasoning: 'Each term is half the previous, so there is always something left.' },
      ],
      answer: '64, 32, 16, 8, 4 — falling towards zero but never arriving.',
    },
  ],
  misconceptionIds: [],
  guidedPractice: [
    {
      id: 's86a.g1',
      prompt: 'A GP has a = 2 and r = 5. Find the fourth term.',
      hint: 'Three steps, so r cubed.',
      answer: '250',
      rationale: 'Two times 125.',
    },
    {
      id: 's86a.g2',
      prompt: 'Is 4, 8, 16, 30 a GP?',
      hint: 'Divide each by the one before.',
      answer: 'No.',
      rationale: 'The last quotient is 30/16, not 2.',
    },
    {
      id: 's86a.g3',
      prompt: 'Why is the exponent n − 1 rather than n?',
      hint: 'How many multiplications reach the nth term?',
      answer: 'Because n − 1 steps reach the nth term.',
      rationale: 'The same step count as in the AP rule.',
    },
  ],
  independentPractice: [
    {
      id: 's86a.i1',
      prompt: 'Find the nth term of the GP 7, 21, 63.',
      answer: '7 times 3 to the power n − 1.',
      rationale: 'a = 7 and r = 3.',
    },
    {
      id: 's86a.i2',
      prompt: 'A GP has a = 81 and r = 1/3. Find the fifth term.',
      answer: '1.',
      rationale: 'Eighty-one divided by three four times.',
    },
    {
      id: 's86a.i3',
      prompt: 'Explain how to tell a GP from an AP given four terms.',
      answer: 'Differences constant means AP; quotients constant means GP.',
      rationale: 'Test both before deciding.',
    },
  ],
  reasoningApplication: [
    {
      id: 's86a.r1',
      prompt: 'A GP has ratio between zero and one. Explain why its terms never reach zero, and contrast that with an AP of negative common difference.',
      expectedReasoning:
        'Each term is a fixed fraction of the previous one, so something always remains however many steps are taken, while an AP subtracts a fixed amount that eventually exhausts any starting value and goes negative. A strong answer locates the difference in multiplying versus subtracting rather than in the particular numbers.',
    },
  ],
  interactivePractice: [],
  summary:
    'A geometric progression multiplies by a constant ratio r each step, so its nth term is a times r to the power n − 1, with the exponent counting steps. The ratio may be a fraction, making terms fall towards zero without reaching it.',
  nextStep:
    'Next you will see a GP appear in a geometric construction and compare its growth with an AP’s.',
  teacher: {
    objective: 'Students derive and apply the GP nth term.',
    prerequisiteKnowledge: ['Powers', 'AP nth term'],
    modelLanguage: ['Divide or subtract to test?', 'How many steps to that term?'],
    teachingNotes: [
      'Test both differences and quotients on every new sequence until the habit sticks.',
      'The exponent n − 1 mirrors the AP multiplier; naming that parallel saves re-teaching the off-by-one.',
    ],
    quickChecks: ['AP or GP — how do you know?', 'Which power of r?'],
    supportForStrugglingLearners: [
      'Write terms as a, ar, ar squared before any formula.',
      'Tabulate differences and quotients side by side.',
    ],
    extension: ['Ask for a GP whose terms are all whole numbers with a fractional ratio.'],
    materialsNeeded: ['Calculator'],
  },
  reviewStatus: 'authored_draft',
};

export const SECTION_8_6_VISUAL: AuthoredSection = {
  contentArtifactId: 'ncert_iemh1_s8_6_visual_lesson',
  contentArtifactVersion: 1,
  source: source('8.6', 'Geometric Progressions', 13, 'ncert_iemh1_s8_6'),
  competencyCandidates: [],
  competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_iemh1_s8_6'],
    mayAssume: ['The GP nth term', 'Area of a triangle', 'Class 8 work with the Sierpinski construction'],
    mustNotIntroduce: [],
  },
  learningGoal:
    'You will read a geometric progression out of a repeated geometric construction, and compare how an AP and a GP grow.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: ['Find the nth term of a GP.', 'Find the nth term of an AP.', 'Say what happens to a triangle cut into four congruent parts.'],
    ifNotReady: 'Make sure both nth-term rules are secure; this lesson uses them rather than deriving them.',
  },
  vocabulary: [
    { term: 'stage', meaning: 'One round of a repeated construction.' },
    { term: 'growth', meaning: 'How quickly the terms of a sequence increase as the position advances.' },
  ],
  explanation: [
    'Take a triangle and cut it into four congruent triangles by joining the midpoints of its sides — the result from the quadrilaterals chapter. Remove the middle one and repeat on each of the three that remain. This is the Sierpinski construction, which you met in Class 8.',
    'Count the remaining triangles at each stage: 1, then 3, then 9, then 27. Each stage triples the count, so the counts form a GP with a = 1 and r = 3, and the nth stage has 3 to the power n − 1 triangles. The construction is the situation; the GP is its description.',
    'Their areas form a GP too, going the other way. Each small triangle is a quarter of the one it came from, so the areas are a quarter each stage: ratio one quarter, falling towards zero. Two GPs come out of one construction, one rising and one falling.',
    'Now compare an AP and a GP directly. Take 2, 4, 6, 8 against 2, 4, 8, 16. They agree at the first two positions, and the GP is behind at the third — then it overtakes and never looks back. By the tenth position the AP is at 20 and the GP at 1024.',
    'Plotted against position, the AP’s points lie on a straight line, since equal steps give equal rises. The GP’s curve starts flatter and then climbs steeply. That difference in shape is the useful thing to remember: adding a fixed amount and multiplying by a fixed amount behave quite differently in the long run, however close they look at first.',
  ],
  representations: ['The Sierpinski stages with the triangle count at each', 'An AP and a GP plotted against position, straight line against curve'],
  visuals: [F_AP_GP],
  visualsById: { F_AP_GP },
  workedExamples: [
    {
      id: 's86b.we1',
      prompt: 'How many triangles remain at the sixth stage of the construction?',
      steps: [
        { text: 'The counts are 1, 3, 9, 27 — a GP with a = 1 and r = 3.', reasoning: 'Each stage replaces every triangle by three, so the count triples.' },
        { text: 'The sixth stage uses five steps, so 3 to the fifth.', reasoning: 'The exponent counts steps, as in the general rule.' },
        { text: 'That is 243 triangles.', reasoning: 'The first term is one, so the count is just the power of three.' },
      ],
      answer: '243.',
    },
    {
      id: 's86b.we2',
      prompt: 'Compare the tenth terms of the AP 2, 4, 6, ... and the GP 2, 4, 8, ...',
      steps: [
        { text: 'The AP has a = 2 and d = 2, so its tenth term is 2 + 9 times 2 = 20.', reasoning: 'Nine steps of two from the first term.' },
        { text: 'The GP has a = 2 and r = 2, so its tenth term is 2 times 2 to the ninth.', reasoning: 'Nine multiplications by two.' },
        { text: 'That is 1024, more than fifty times the AP’s term.', reasoning: 'The gap widens at every further position.' },
      ],
      answer: 'AP 20, GP 1024 — and they began identically.',
      visualRef: 'F_AP_GP',
    },
    {
      id: 's86b.we3',
      prompt: 'What happens to the total area remaining as the construction continues?',
      steps: [
        { text: 'At each stage three triangles remain out of four, each a quarter of the previous size.', reasoning: 'So the remaining area is three quarters of what it was.' },
        { text: 'The areas form a GP with ratio three quarters.', reasoning: 'A ratio below one, so the terms fall.' },
        { text: 'The remaining area approaches zero without ever reaching it.', reasoning: 'Each stage leaves three quarters of something positive.' },
      ],
      answer: 'It falls towards zero, as a GP of ratio three quarters.',
    },
  ],
  misconceptionIds: [],
  guidedPractice: [
    {
      id: 's86b.g1',
      prompt: 'How many triangles at the fourth stage?',
      hint: 'Three steps from the first.',
      answer: '27',
      rationale: 'One times three cubed.',
    },
    {
      id: 's86b.g2',
      prompt: 'Which grows faster in the long run, an AP or a GP with ratio above one?',
      hint: 'What happens at the tenth position?',
      answer: 'The GP.',
      rationale: 'Multiplying outpaces adding eventually, however slow the start.',
    },
    {
      id: 's86b.g3',
      prompt: 'What shape do the plotted points of an AP make?',
      hint: 'Equal steps give what?',
      answer: 'A straight line.',
      rationale: 'Equal rises for equal steps across.',
    },
  ],
  independentPractice: [
    {
      id: 's86b.i1',
      prompt: 'A GP of ratio 2 starts at 1. Which position first exceeds 1000?',
      answer: 'The eleventh, at 1024.',
      rationale: 'Two to the tenth is 1024.',
    },
    {
      id: 's86b.i2',
      prompt: 'Write the first four terms of the triangle-count GP and its nth term.',
      answer: '1, 3, 9, 27; 3 to the power n − 1.',
      rationale: 'Each stage triples the count.',
    },
    {
      id: 's86b.i3',
      prompt: 'Explain why an AP and a GP can look similar at first.',
      answer: 'Because they may agree at the opening positions before the multiplying takes effect.',
      rationale: 'The divergence grows with position.',
    },
  ],
  reasoningApplication: [
    {
      id: 's86b.r1',
      prompt: 'One construction produced two geometric progressions, one rising and one falling. Explain how that is possible, and what quantity each one counts.',
      expectedReasoning:
        'Each stage triples the number of pieces while quartering each piece’s area, so the count rises by ratio three and the individual area falls by ratio one quarter. A strong answer sees that the two describe different quantities of the same process, and notices the remaining total area is a third GP of ratio three quarters.',
    },
  ],
  interactivePractice: [],
  summary:
    'A repeated construction produces geometric progressions: the Sierpinski triangle counts form a GP of ratio three while the piece areas form one of ratio a quarter. Plotted against position an AP is a straight line and a GP curves upward, overtaking any AP eventually.',
  nextStep:
    'That completes the chapter: sequences named, described two ways, and the two main families derived.',
  teacher: {
    objective: 'Students read GPs out of a construction and compare AP with GP growth.',
    prerequisiteKnowledge: ['GP nth term', 'AP nth term', 'Triangle areas'],
    modelLanguage: ['Which quantity is this GP counting?', 'Straight or curving?'],
    teachingNotes: [
      'Build two or three Sierpinski stages on paper; the tripling is then counted rather than asserted.',
      'The AP-versus-GP comparison lands best as a table to the tenth position, where the gap is startling.',
    ],
    quickChecks: ['What is the ratio here?', 'Which overtakes, and when?'],
    supportForStrugglingLearners: [
      'Tabulate stage, count and area side by side.',
      'Plot both sequences on one grid against position.',
    ],
    extension: ['Ask at which position a GP of ratio 1.1 overtakes an AP of difference 10.'],
    materialsNeeded: ['Paper triangles', 'Squared paper'],
  },
  reviewStatus: 'authored_draft',
};

/** Chapter 8, in the book's order. Seven lessons from six sections, with
 *  §8.6 split into the algebraic rule and the visual comparison. */
export function sequencesChapterSections(): AuthoredSection[] {
  return [
    SECTION_8_1,
    SECTION_8_2,
    SECTION_8_3,
    SECTION_8_4,
    SECTION_8_5,
    SECTION_8_6_ALGEBRA,
    SECTION_8_6_VISUAL,
  ];
}
