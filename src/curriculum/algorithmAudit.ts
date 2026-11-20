// ===========================================================================
// v0.84.0 checkpoint 40 — AUDITING CLAIMS ABOUT ALGORITHMS.
//
// Checkpoint 39 guarded against inferring likelihood from a count of
// outcomes. This guards against the same shape of error one chapter along:
// inferring general efficiency from one run. "Method A took fewer steps
// here, so it is faster" is arithmetically unimpeachable and says something
// the evidence does not support.
//
// Four things must stay apart, and the audit exists because prose collapses
// them so easily:
//
//   correctness   — does it give the right answer?
//   cost          — how much of WHAT does it take?
//   one input     — what happened in this case?
//   general claim — what holds across inputs?
//
// Like probabilityAudit, this flags for a human and never rewrites, and it
// carries positive fixtures so that honest, carefully scoped comparison
// passes. A validator authors satisfy by hedging everything is no better
// than one they satisfy by overclaiming.
// ===========================================================================

import type { AuthoredSection } from './authoredSection';

export type AlgorithmFinding = {
  where: string;
  claim: string;
  problem: string;
};

/**
 * Wording that scopes a comparison honestly: to an input, to a counting
 * rule, or to the examples actually tried.
 */
const SCOPED = [
  'on this input',
  'for this pair',
  'for these numbers',
  'in this example',
  'in this case',
  'here,',
  'under this counting rule',
  'counting rule',
  'across the examples',
  'in the examples',
  'these examples',
  'for this one pair',
  'does not establish',
  'would not show',
  'cannot conclude',
];

/**
 * Naming the actual numbers scopes a comparison just as well as the phrase
 * "on this input" does — "on 100 and 3, 35 steps against 2" is exactly the
 * honest form the standard asks for, and an audit that flagged it would be
 * teaching authors to write vaguer prose.
 */
const NAMES_AN_INPUT = /\b(on|for)\s+(the\s+pair\s+)?\d+\s+and\s+\d+/i;

/**
 * A sentence that QUESTIONS or REFUTES an overclaim necessarily contains
 * the overclaim's wording. "Does this mean it is always faster?" and "one
 * example cannot show a method is always faster" are the chapter teaching
 * the very distinction this audit enforces, and must not be flagged for
 * quoting the error they correct.
 */
const CHALLENGES = /\?|\b(cannot|does not|do not|would not|never|not yet|no amount|is wrong|unjustified|without|rather than)\b/i;

const isScoped = (context: string): boolean => {
  const lower = context.toLowerCase();
  return SCOPED.some((s) => lower.includes(s)) || NAMES_AN_INPUT.test(context);
};

/** Claims that need evidence beyond a single run. */
const SUSPECT: Array<{ pattern: RegExp; problem: string }> = [
  {
    pattern: /\bfewer steps?,?\s*(so|therefore|hence|which means)\b/i,
    problem: 'moves from a step count to a general conclusion',
  },
  {
    pattern: /\b(is|are) (always|generally) (faster|better|quicker|more efficient)\b/i,
    problem: 'claims behaviour across all inputs',
  },
  {
    pattern: /\bthe (best|fastest|quickest|most efficient|optimal) (algorithm|method|way|procedure)\b/i,
    problem: 'asserts optimality',
  },
  {
    pattern: /\b(faster|quicker|better|more efficient) for (every|all|any) (number|input|pair|case)\b/i,
    problem: 'generalises a comparison to every input',
  },
  {
    pattern: /\bmore efficient\b/i,
    problem: 'uses "more efficient" without naming what is being counted',
  },
  {
    pattern: /\bruns? faster on a computer\b/i,
    problem: 'makes a runtime claim the chapter has no basis for',
  },
];

/** A cost measure named near the claim is what makes "efficient" mean anything. */
const MEASURE = [
  'step',
  'iteration',
  'subtraction',
  'division',
  'comparison',
  'operation',
  'digit',
  'candidate',
  'pass',
  'round',
];

const namesAMeasure = (context: string): boolean =>
  MEASURE.some((m) => context.toLowerCase().includes(m));

function windowsOf(text: string): Array<{ sentence: string; context: string }> {
  const parts = text.split(/(?<=[.!?])\s+/);
  return parts.map((sentence, i) => ({
    sentence,
    context: [parts[i - 1] ?? '', sentence, parts[i + 1] ?? ''].join(' '),
  }));
}

export function auditAlgorithmClaims(section: AuthoredSection): AlgorithmFinding[] {
  const findings: AlgorithmFinding[] = [];
  const blocks: Array<[string, string]> = [
    ['explanation', section.explanation.join(' ')],
    ['summary', section.summary],
    ...section.workedExamples.map(
      (w): [string, string] => [
        `worked example ${w.id}`,
        [w.prompt, ...w.steps.map((s) => `${s.text} ${s.reasoning}`), w.answer].join(' '),
      ]
    ),
    ...section.guidedPractice.map((g): [string, string] => [`guided ${g.id}`, `${g.prompt} ${g.answer} ${g.rationale}`]),
    ...section.independentPractice.map(
      (p): [string, string] => [`independent ${p.id}`, `${p.prompt} ${p.answer} ${p.rationale}`]
    ),
    ...section.reasoningApplication.map((r): [string, string] => [`think deeper ${r.id}`, `${r.prompt} ${r.expectedReasoning}`]),
  ];

  for (const [where, text] of blocks) {
    for (const { sentence, context } of windowsOf(text)) {
      for (const { pattern, problem } of SUSPECT) {
        if (!pattern.test(sentence)) continue;
        // A claim that names its input, its counting rule, or the examples
        // tried is scoped honestly and is not a finding.
        if (isScoped(context)) continue;
        if (CHALLENGES.test(sentence)) continue;
        // "more efficient" alone is only a finding when nothing nearby says
        // efficient in WHAT.
        if (problem.includes('without naming') && namesAMeasure(context)) continue;
        findings.push({ where: `${section.contentArtifactId} / ${where}`, claim: sentence.trim(), problem });
      }
    }
  }
  return findings;
}

/**
 * A comparison of two procedures must put them on the same input, or the
 * student cannot tell whether the difference came from the method or the
 * numbers. Where a lesson states two counts in one sentence, it must also
 * say which input they were measured on.
 */
export function auditComparisonScope(section: AuthoredSection): AlgorithmFinding[] {
  const findings: AlgorithmFinding[] = [];
  const blocks: Array<[string, string]> = [
    ['explanation', section.explanation.join(' ')],
    ...section.workedExamples.map(
      (w): [string, string] => [`worked example ${w.id}`, [...w.steps.map((s) => s.text), w.answer].join(' ')]
    ),
  ];
  for (const [where, text] of blocks) {
    for (const { sentence, context } of windowsOf(text)) {
      // "took 14 ... took 3" — two counts set against each other.
      if (!/\b(\d+)\b[^.]{0,80}?\b(?:while|whereas|against|but|and)\b[^.]{0,60}?\b(\d+)\b/.test(sentence)) continue;
      if (!/\b(step|iteration|subtraction|division|candidate|comparison|pass)/i.test(sentence)) continue;
      if (isScoped(context) || NAMES_AN_INPUT.test(sentence)) continue;
      findings.push({
        where: `${section.contentArtifactId} / ${where}`,
        claim: sentence.trim(),
        problem: 'compares two counts without naming the input they came from',
      });
    }
  }
  return findings;
}

export function auditAlgorithmSection(section: AuthoredSection): AlgorithmFinding[] {
  return [...auditAlgorithmClaims(section), ...auditComparisonScope(section)];
}

// ---------------------------------------------------------------------------
// Trace checking. A lesson's gcd answers must actually be the gcd, and a
// claimed iteration count must be the count the procedure really takes. A
// wrong trace is not a typo in an algorithms lesson: it is the lesson.
// ---------------------------------------------------------------------------

export const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

/** Iterations of Euclid's subtraction form: replace the larger by the difference. */
export function subtractionSteps(a: number, b: number): number {
  let [x, y] = [a, b];
  let steps = 0;
  while (x !== y) {
    if (x > y) x -= y;
    else y -= x;
    steps += 1;
  }
  return steps;
}

/** Divisions performed by Euclid's division form until the remainder is 0. */
export function divisionSteps(a: number, b: number): number {
  let [x, y] = [Math.max(a, b), Math.min(a, b)];
  let steps = 0;
  while (y !== 0) {
    [x, y] = [y, x % y];
    steps += 1;
  }
  return steps;
}

/** Candidates tested by the divisor-list method, trying 1 up to each number. */
export const divisorCandidates = (a: number, b: number): number => a + b;
