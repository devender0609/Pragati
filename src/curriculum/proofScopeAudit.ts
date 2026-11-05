// ===========================================================================
// v0.84.0-c10.3 checkpoint 57 — DID A TEXTBOOK PROOF LEAK INTO A LESSON THAT
// IS NOT MEANT TO CARRY ONE?
//
// The NCERT book proves the AAA, SSS and SAS similarity criteria. The CBSE
// 2026-27 curriculum asks only that they be STATED. An author working from
// the textbook will drift into proving them, because the proof is right
// there and it is good mathematics.
//
// The hard part is that a word ban on "prove" would be useless and wrong. A
// §6.4 lesson SHOULD say "prove that these two triangles are similar" —
// that is applying the criterion, which is exactly what the scope asks for.
// It may also say "we use this criterion without proving it", which is an
// honest statement of scope.
//
// What it must not do is prove THE CRITERION. So the audit looks at what the
// proof verb takes as its object: a named criterion, or a particular pair of
// triangles. That distinction is the whole check.
// ===========================================================================

import type { AuthoredSection } from './authoredSection';

export type ProofScopeExpectation =
  | 'PROVE'
  | 'STATE_WITHOUT_PROOF'
  | 'DERIVE'
  | 'APPLY'
  | 'UNDERSTAND'
  | 'REVIEW';

export type ProofScopeFinding = {
  where: string;
  text: string;
  reason: string;
};

const CRITERION = '(?:AAA|AA|SSS|SAS|ASA|RHS)(?:\\s+(?:similarity\\s+)?criterion)?';

/** Proving the criterion itself — the thing a STATE_WITHOUT_PROOF unit must not do. */
const PROVES_THE_CRITERION = [
  new RegExp(`\\b(?:prove|proving|proof of|establish|derive|deduce)\\b[^.]{0,30}\\b${CRITERION}\\b`, 'i'),
  new RegExp(`\\b${CRITERION}\\b[^.]{0,40}\\b(?:is proved|can be proved|we prove|is established|is derived)\\b`, 'i'),
  /\bwhy\b[^.]{0,30}\b(?:AAA|AA|SSS|SAS)\b[^.]{0,20}\b(?:works|holds|is true|must be true)\b/i,
  /\bproof of the (?:criterion|criteria|theorem)\b/i,
];

/** Honest statements of scope, which must never be flagged. */
const SCOPE_ACKNOWLEDGEMENT = [
  /\bwithout prov(?:ing|e|ed)\b/i,
  /\bwe (?:do not|will not|shall not) prove\b/i,
  /\bnot prov(?:ed|en) here\b/i,
  /\btake(?:n)? (?:this|it|them) as given\b/i,
  /\bstated without proof\b/i,
  /\baccept(?:ed)? (?:this|it|them) (?:here|as)\b/i,
  /\bbeyond (?:this|the) (?:lesson|course|scope)\b/i,
];

/** Applying a criterion to a particular pair — legitimate and expected. */
const APPLIES_TO_AN_INSTANCE =
  /\b(?:prove|show|justify|explain)\b[^.]{0,60}\b(?:these|the|two|triangles?|\u0394|that\s+\u0394?[A-Z]{3})\b[^.]{0,40}\b(?:are|is)\s+similar\b/i;

function sentences(text: string): string[] {
  return text.split(/(?<=[.?!])\s+/).filter((s) => s.trim().length > 0);
}

/**
 * Audit one lesson against the proof expectation its decomposition records.
 *
 * For STATE_WITHOUT_PROOF the finding is proof-of-criterion instruction.
 * For PROVE the finding is the opposite failure: a lesson that claims the
 * obligation but never carries a proof.
 */
export function auditProofScope(
  section: AuthoredSection,
  expectation: ProofScopeExpectation
): ProofScopeFinding[] {
  const findings: ProofScopeFinding[] = [];
  const blocks: Array<[string, string]> = [
    ['learning goal', section.learningGoal],
    ['explanation', section.explanation.join(' ')],
    ['summary', section.summary],
    ...section.workedExamples.map((w): [string, string] => [
      `worked ${w.id}`,
      [w.prompt, ...w.steps.map((s) => `${s.text} ${s.reasoning}`), w.answer].join(' '),
    ]),
    ...section.guidedPractice.map((g): [string, string] => [`guided ${g.id}`, `${g.prompt} ${g.rationale}`]),
    ...section.independentPractice.map((p): [string, string] => [`independent ${p.id}`, `${p.prompt} ${p.rationale}`]),
    ...section.reasoningApplication.map((r): [string, string] => [`think deeper ${r.id}`, `${r.prompt} ${r.expectedReasoning}`]),
  ];

  if (expectation === 'STATE_WITHOUT_PROOF') {
    for (const [where, text] of blocks) {
      for (const sentence of sentences(text)) {
        if (SCOPE_ACKNOWLEDGEMENT.some((r) => r.test(sentence))) continue;
        if (APPLIES_TO_AN_INSTANCE.test(sentence)) continue;
        const hit = PROVES_THE_CRITERION.find((r) => r.test(sentence));
        if (hit) {
          findings.push({
            where,
            text: sentence.trim().slice(0, 160),
            reason: 'proves or derives the criterion itself, which the current CBSE scope states without proof',
          });
        }
      }
    }
  }

  if (expectation === 'PROVE') {
    const body = [section.learningGoal, ...section.explanation, section.summary].join(' ');
    const hasProofLanguage = /\bprov(?:e|ing|ed|es)\b|\bproof\b/i.test(body);
    if (!hasProofLanguage) {
      findings.push({ where: 'lesson', text: '', reason: 'carries a PROVE obligation but never proves anything' });
    }
    // A proof needs a chain, not an assertion. The worked examples are where
    // the chain lives, so at least one must read as one.
    const chained = section.workedExamples.some((w) => w.steps.length >= 4);
    if (!chained) {
      findings.push({ where: 'worked examples', text: '', reason: 'no worked example carries a proof chain of at least four steps' });
    }
    // "It can be shown" is the characteristic way a proof obligation is
    // quietly dropped.
    for (const [where, text] of blocks) {
      for (const sentence of sentences(text)) {
        if (/\bit can be shown\b|\bwe omit the proof\b|\bthe proof is beyond\b/i.test(sentence)) {
          findings.push({ where, text: sentence.trim().slice(0, 160), reason: 'defers a proof the unit is required to give' });
        }
      }
    }
  }

  return findings;
}
