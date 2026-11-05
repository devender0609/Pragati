// ===========================================================================
// v0.84.0 checkpoint 39 — AUDITING PROBABILITY CLAIMS.
//
// A probability lesson can be numerically perfect and mathematically false.
// "There are two outcomes, so each has probability one half" computes
// correctly and teaches something untrue, and no existing validator in this
// repository would notice, because nothing is wrong with the arithmetic.
//
// This audits the PROSE for the assumption that makes a claim true. It does
// not prove anything: it flags a claim that looks like it assumes equal
// likelihood without establishing it, so a human can look. Flagging for
// review is the design, not rewriting.
//
// It is a test-side audit, not a schema addition. No authored artifact
// gained a field for this.
// ===========================================================================

import type { AuthoredSection } from './authoredSection';

export type ProbabilityFinding = {
  where: string;
  claim: string;
  problem: string;
};

/** Text that establishes equal likelihood rather than assuming it. */
const FAIRNESS = [
  'fair',
  'equally likely',
  'equally probable',
  'unbiased',
  'each outcome has the same chance because',
  'symmetric and balanced',
  'well shuffled',
  'thoroughly mixed',
];

const establishesFairness = (context: string): boolean =>
  FAIRNESS.some((f) => context.toLowerCase().includes(f));

/**
 * v0.84.0-c10.11 checkpoint 65 — a sentence that QUOTES a misconception in
 * order to reject it is not the misconception.
 *
 * Every checkpoint that has built a phrase audit has then flagged its own
 * lesson's correction: checkpoint 58 on real roots, 60 on alt text, 62 on
 * proof structure, 63 on no-real-zeroes, 64 on novelty. The pattern is now
 * predictable enough to handle once, here, rather than discovering it again.
 *
 * "It would be wrong to say there are two outcomes, so each has probability
 * one half" must pass. The bare assertion must still fail.
 */
const REJECTS_THE_CLAIM = [
  /\bit would be wrong\b/i,
  /\bwrong to (?:say|think|assume|conclude)\b/i,
  /\bcannot (?:say|conclude|assume)\b/i,
  /\bdoes not follow\b/i,
  /\bwhy (?:this|that) is wrong\b/i,
  /\ba student (?:says|claims|thinks|argues)\b/i,
  /\btempting(?:ly)? (?:to|but)\b/i,
  /\bthis reasoning (?:is|fails)\b/i,
  /\bnot because\b/i,
  /\bmistake\b/i,
];

const rejectsTheClaim = (sentence: string): boolean =>
  REJECTS_THE_CLAIM.some((r) => r.test(sentence));

/**
 * Claims that are only true under an equiprobability assumption. Each is
 * matched against its own sentence plus the one before it, because that is
 * where a careful author states the assumption.
 */
const SUSPECT: Array<{ pattern: RegExp; problem: string; unless?: RegExp }> = [
  // v0.84.0-c10.11 checkpoint 65 — Class 10 additions. The Class 9
  // detectors above are untouched; these sit alongside them.
  {
    pattern: /\b(?:sums?|totals?) (?:from )?(?:2 ?(?:-|to|\u2013) ?12|two to twelve)[^.]{0,40}\bequally likely\b/i,
    problem: 'treats dice sums as equally likely elementary outcomes, which they are not',
  },
  {
    // A sentence that contrasts "impossible" with "unlikely" is defining the
    // difference, which is the opposite of conflating them.
    pattern: /\bthere is no chance\b|\bcannot (?:possibly )?happen\b(?![^.]{0,40}probability 0)/i,
    problem: 'calls an event impossible where a small positive probability may be meant',
    unless: /\bunlikely\b|\bimpossible\b[^.]{0,80}\bnot\b|\btwo words\b|\bonly one of them\b|\bdefined by\b/i,
  },
  {
    pattern: /\bcomplementary because (?:they are |it is )?(?:disjoint|different|opposite)\b/i,
    problem: 'calls two events complementary without requiring that they cover the sample space',
  },
  {
    pattern: /\b(?:certain|sure) to happen\b(?![^.]{0,60}(?:probability 1|every outcome|whole sample space))/i,
    problem: 'asserts certainty without tying it to the whole sample space',
  },
  {
    // v0.84.0-c10.11 checkpoint 65 — narrowed, NOT weakened. The original
    // fired on any consequence drawn after a count, including "6 of the 36
    // outcomes, so it leaves most of them out", which draws no probability
    // conclusion at all. The inference this exists to catch ends in a
    // probability, so the conclusion clause now has to contain one.
    pattern: /\b(two|three|four|five|six|\d+)\s+(possible\s+)?outcomes?,?\s+(so|therefore|hence)\b[^.]{0,80}(probabilit|chance|likel|\b\d+\/\d+\b|one half|each)/i,
    problem: 'infers probabilities from the number of outcomes alone',
  },
  {
    pattern: /random(ness)?\s+means?\s+(that\s+)?(every|each|all)\b/i,
    problem: 'defines randomness as uniformity, which is false',
  },
  {
    pattern: /\ball (the )?(possible )?outcomes have (an )?equal (chance|probability)\b/i,
    problem: 'asserts equal likelihood as a general property of outcomes',
  },
  {
    pattern: /\bsince there are \w+ outcomes\b/i,
    problem: 'uses the count of outcomes as the reason for a probability',
  },
  {
    pattern: /\bprobability of (heads|tails|a six|each face) is (1\/2|1\/6|0\.5)\b/i,
    problem: 'states a physical object\u2019s probability without a fairness qualifier',
  },
];

/** Sentences, with one sentence of lead-in kept for context. */
function sentencesWithContext(text: string): Array<{ sentence: string; context: string }> {
  const parts = text.split(/(?<=[.!?])\s+/);
  return parts.map((sentence, i) => ({
    sentence,
    context: [parts[i - 1] ?? '', sentence, parts[i + 1] ?? ''].join(' '),
  }));
}

export function auditProbabilityLanguage(section: AuthoredSection): ProbabilityFinding[] {
  const findings: ProbabilityFinding[] = [];
  const blocks: Array<[string, string]> = [
    ['explanation', section.explanation.join(' ')],
    ['summary', section.summary],
    ...section.workedExamples.map(
      (w): [string, string] =>
        [`worked example ${w.id}`, [w.prompt, ...w.steps.map((s) => `${s.text} ${s.reasoning}`), w.answer].join(' ')]
    ),
    ...section.guidedPractice.map((g): [string, string] => [`guided ${g.id}`, `${g.prompt} ${g.rationale}`]),
    ...section.independentPractice.map((p): [string, string] => [`independent ${p.id}`, `${p.prompt} ${p.rationale}`]),
  ];

  for (const [where, text] of blocks) {
    for (const { sentence, context } of sentencesWithContext(text)) {
      for (const { pattern, problem, unless } of SUSPECT) {
        if (!pattern.test(sentence)) continue;
        if (unless && unless.test(sentence)) continue;
        if (establishesFairness(context)) continue;
        if (rejectsTheClaim(sentence)) continue;
        findings.push({ where: `${section.contentArtifactId} / ${where}`, claim: sentence.trim(), problem });
      }
    }
  }
  return findings;
}

/**
 * Every probability written as a fraction, decimal or percentage must lie in
 * [0, 1]. A value outside it is not a style problem; it is false.
 */
export function auditProbabilityValues(section: AuthoredSection): ProbabilityFinding[] {
  const findings: ProbabilityFinding[] = [];
  const text = [
    section.explanation.join(' '),
    section.summary,
    ...section.workedExamples.flatMap((w) => [w.answer, ...w.steps.map((s) => s.text)]),
    ...section.independentPractice.map((p) => p.answer),
    ...section.guidedPractice.map((g) => g.answer),
  ].join(' ');

  // A lesson may legitimately DISCUSS an impossible value — "a probability
  // of 7/4 is an error" is correct teaching, not a defect. The audit skips a
  // value whose own sentence marks it as invalid, which is what keeps this
  // from becoming a word ban that rejects honest explanation.
  const discussedAsError = (sentence: string) =>
    /\b(is an error|cannot be|is impossible|not between|exceeds|out of range|something .{0,20}wrong|must be redone|no probability)\b/i.test(
      sentence
    );
  // A window rather than a sentence split: decimal points inside the values
  // being discussed ("\u22120.2") break naive sentence detection, and losing
  // the clause that marks the value as an error is exactly the failure that
  // would turn this audit into a word ban.
  const windowAround = (index: number) =>
    text.slice(Math.max(0, index - 200), Math.min(text.length, index + 200));

  // "probability ... 7/4" and similar.
  for (const m of text.matchAll(/probability[^.]{0,60}?(\d+)\s*\/\s*(\d+)/gi)) {
    const [num, den] = [Number(m[1]), Number(m[2])];
    if (discussedAsError(windowAround(m.index ?? 0))) continue;
    if (den === 0 || num > den) {
      findings.push({
        where: section.contentArtifactId,
        claim: m[0].trim(),
        problem: `probability ${num}/${den} is not between 0 and 1`,
      });
    }
  }
  for (const m of text.matchAll(/probability[^.]{0,60}?(\d{1,3}(?:\.\d+)?)\s?%/gi)) {
    const pct = Number(m[1]);
    if (discussedAsError(windowAround(m.index ?? 0))) continue;
    if (pct > 100) {
      findings.push({
        where: section.contentArtifactId,
        claim: m[0].trim(),
        problem: `probability ${pct}% exceeds 100%`,
      });
    }
  }
  return findings;
}

/**
 * Where a lesson states counts and then a fraction — "4 of the 10 ... 4/10"
 * — the two must agree. A denominator that does not match the stated total
 * is the commonest silent error in a probability worked example.
 */
export function auditCountsAgainstFractions(section: AuthoredSection): ProbabilityFinding[] {
  const findings: ProbabilityFinding[] = [];
  const blocks = section.workedExamples.flatMap((w) =>
    w.steps.map((s): [string, string] => [`${section.contentArtifactId} / ${w.id}`, `${s.text} ${s.reasoning}`])
  );
  for (const [where, text] of blocks) {
    const m = /(\d+)\s+of\s+the\s+(\d+)[^.]{0,80}?(\d+)\s*\/\s*(\d+)/i.exec(text);
    if (!m) continue;
    const [a, b, n, d] = [Number(m[1]), Number(m[2]), Number(m[3]), Number(m[4])];
    if (a !== n || b !== d) {
      findings.push({
        where,
        claim: m[0].trim(),
        problem: `states ${a} of ${b} but writes ${n}/${d}`,
      });
    }
  }
  return findings;
}

export function auditProbabilitySection(section: AuthoredSection): ProbabilityFinding[] {
  return [
    ...auditProbabilityLanguage(section),
    ...auditProbabilityValues(section),
    ...auditCountsAgainstFractions(section),
  ];
}
