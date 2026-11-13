// ===========================================================================
// v0.84.0-c11.19 checkpoint 87 — AN INDUCTIVE ARGUMENT AS A STRUCTURE.
//
// WHAT THIS EXISTS TO PREVENT
//
// An induction proof written as prose can look convincing while missing the
// thing that makes it a proof. The four classic failures are a missing base
// case, assuming P(k+1) instead of P(k), deriving P(k) from P(k) rather than
// P(k+1), and checking a handful of examples without ever proving the step.
// All four read fluently. So the proof is represented as named parts with a
// declared domain, and the validator checks the SHAPE of the argument.
//
// WHAT IT DOES NOT DO
//
// It is not a theorem prover. It does not decide arbitrary symbolic algebra.
// For the authored examples the arithmetic of the base case is checked
// exactly, because that much is decidable and worth checking; the inductive
// step is checked structurally, and its algebra is carried by the authored
// justification like any other worked example.
// ===========================================================================

/** The natural-number range a claim is made over. Never left implicit. */
export type NaturalDomain = {
  /** The first natural number the claim is asserted for. */
  from: number;
  /** How it reads in prose, e.g. "every natural number n ≥ 1". */
  written: string;
};

export function naturalsFrom(from: number, written: string): NaturalDomain {
  if (!Number.isInteger(from)) throw new Error('an induction domain must start at an integer');
  return { from, written };
}

/** One line of an argument: what is claimed, and why it follows. */
export type ProofStep = {
  statement: string;
  /** Why the statement holds. A restatement is not a justification. */
  justification: string;
};

export type InductionProof = {
  id: string;
  /** What P(n) says, in words. */
  claim: string;
  domain: NaturalDomain;
  /**
   * The base case, verified by actual substitution. `leftValue` and
   * `rightValue` are the two sides evaluated at `at`, so the check is
   * arithmetic rather than an assertion that it worked.
   */
  baseCase: {
    at: number;
    leftValue: number;
    rightValue: number;
    steps: ProofStep[];
  };
  /**
   * The hypothesis. It is ASSUMED for one arbitrary k, never proved for all
   * k, and `assumesAbout` records which index it is about so that assuming
   * P(k+1) can be detected.
   */
  hypothesis: {
    assumesAbout: 'k';
    statement: string;
    /** True only if the wording keeps it conditional. */
    conditional: boolean;
  };
  /** The step must start from k and arrive at k+1. */
  inductiveStep: {
    startsFrom: 'k';
    arrivesAt: 'k+1';
    steps: ProofStep[];
  };
  conclusion: {
    statement: string;
    /** The parts the conclusion rests on. Both are required. */
    restsOn: Array<'base_case' | 'inductive_step'>;
  };
};

/**
 * Structural validation. Each check corresponds to a way a written proof can
 * look right and be wrong.
 */
export function validateInductionProof(p: InductionProof): string[] {
  const e: string[] = [];

  // 1. A missing or empty base case.
  if (!p.baseCase || !p.baseCase.steps.length) {
    e.push('the proof has no base case, so nothing anchors the chain');
  } else {
    // The base case must be AT the first number of the declared domain.
    if (p.baseCase.at !== p.domain.from) {
      e.push(`the base case is checked at ${p.baseCase.at} but the claim starts at ${p.domain.from}`);
    }
    // And it must actually hold, by arithmetic rather than assertion.
    if (Math.abs(p.baseCase.leftValue - p.baseCase.rightValue) > 1e-9) {
      e.push(`the base case does not hold: the two sides are ${p.baseCase.leftValue} and ${p.baseCase.rightValue}`);
    }
  }

  // 2. Assuming P(k+1) rather than P(k).
  if (p.hypothesis.assumesAbout !== 'k') {
    e.push('the hypothesis must assume the claim for k, not for k + 1 — assuming what is to be proved');
  }
  // 3. A hypothesis stated as already established for every k.
  if (!p.hypothesis.conditional) {
    e.push('the hypothesis must stay conditional: it is assumed for one arbitrary k, not proved for all k');
  }

  // 4. A step that does not travel from k to k + 1.
  if (p.inductiveStep.startsFrom !== 'k' || p.inductiveStep.arrivesAt !== 'k+1') {
    e.push('the inductive step must start from the hypothesis at k and arrive at k + 1');
  }
  if (!p.inductiveStep.steps.length) {
    e.push('the inductive step has no working, so no implication has been shown');
  }

  // 5. A conclusion that rests on only one of the two obligations.
  for (const needed of ['base_case', 'inductive_step'] as const) {
    if (!p.conclusion.restsOn.includes(needed)) {
      e.push(`the conclusion does not rest on the ${needed.replace('_', ' ')}, so induction does not apply`);
    }
  }

  // 6. Justification that merely restates its own statement.
  for (const [where, steps] of [['base case', p.baseCase?.steps ?? []], ['inductive step', p.inductiveStep.steps]] as const) {
    for (const s of steps) {
      if (!s.justification.trim()) e.push(`a ${where} step has no justification`);
      else if (normalise(s.justification) === normalise(s.statement)) {
        e.push(`a ${where} step restates itself instead of justifying: "${s.statement.slice(0, 48)}"`);
      } else if (THIN.test(s.justification.trim())) {
        e.push(`a ${where} step's justification is an assertion rather than a reason: "${s.justification.slice(0, 48)}"`);
      }
    }
  }
  return e;
}

const normalise = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
/** Wordings that assert rather than explain. */
const THIN = /^(this is true|true|it is true|obviously|clearly|as required|by definition)\.?$/i;

/**
 * Checking examples is NOT induction. A list of verified cases establishes
 * nothing about every natural number, and this names that explicitly so a
 * lesson can show the contrast rather than assert it.
 */
export type ExampleCheck = { at: number; holds: boolean };

export function examplesProveNothing(checks: ExampleCheck[], domain: NaturalDomain): string {
  const n = checks.length;
  const allHold = checks.every((c) => c.holds);
  if (!allHold) return 'one of the checked cases fails, so the claim is false as stated';
  return `all ${n} checked cases hold, but ${domain.written} contains infinitely many values, so checking cases proves nothing about the rest`;
}

/** How a proof reads in a lesson, so no raw structure reaches a student. */
export function describeProofShape(p: InductionProof): string {
  return `The claim is made for ${p.domain.written}. It is checked at ${p.baseCase.at}, assumed at k, and carried from k to k + 1.`;
}

// ---------------------------------------------------------------------------
// The proof layout. Normal semantic HTML rather than a drawn figure: the
// representation requirement is "proof layout; no figure required", and a
// decorative diagram added only to fill a stage would be worse than none.
// ---------------------------------------------------------------------------

export type ProofLayoutSpec = {
  type: 'proof_layout';
  id: string;
  proof: InductionProof;
  altText: string;
  caption: string;
  status: 'verified' | 'unverified';
};

export const proofLayout = (id: string, proof: InductionProof, altText: string): ProofLayoutSpec =>
  ({ type: 'proof_layout', id, proof, altText, caption: altText, status: 'verified' });

export function validateProofLayout(spec: ProofLayoutSpec): string[] {
  const e = validateInductionProof(spec.proof);
  if (!spec.altText.trim()) e.push('altText is required');
  return e;
}
