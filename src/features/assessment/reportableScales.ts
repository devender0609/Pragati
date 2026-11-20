// v0.54 §8 — Blueprint domains vs reportable subscores.
//
// THE CONFLATION THIS PREVENTS
//
// A domain appears in the blueprint so the test COVERS it. That is a
// content-representation decision, and six domains in a blueprint is
// entirely reasonable.
//
// A subscore is REPORTED to a human, who then acts on it. That requires
// enough items, adequate precision, evidence the domain is dimensionally
// distinct, and evidence the number is interpretable.
//
// These are different bars, and the second is much higher. Left
// implicit, a blueprint domain quietly becomes a reported subscale
// because the data is sitting there — which is how assessments end up
// reporting six numbers that measure one thing.

import type { AssessmentDomainId } from '../../curriculum/competencyFramework';

/** Guarantees content representation during assembly. Nothing more. */
export type BlueprintDomain = {
  domainId: AssessmentDomainId;
  targetShare: number;
  minItems: number;
  maxItems: number;
};

export type ReportabilityEvidence = {
  /** Enough items administered per student in this domain. */
  sufficientInformation: boolean;
  /** Reliability / conditional SEM established for this domain. */
  precisionEstablished: boolean;
  /** Dimensionality evidence that the domain is separable. */
  dimensionalityEstablished: boolean;
  /** Evidence that users can act on the number correctly. */
  interpretabilityEstablished: boolean;
};

export const NO_REPORTABILITY_EVIDENCE: ReportabilityEvidence = {
  sufficientInformation: false,
  precisionEstablished: false,
  dimensionalityEstablished: false,
  interpretabilityEstablished: false,
};

export type ReportableSubscore = {
  domainId: AssessmentDomainId;
  evidence: ReportabilityEvidence;
  /** Only ever true when all four criteria hold. */
  approvedForReporting: boolean;
  approvedBy: string | null;
};

/**
 * Whether a domain may be reported as a subscore.
 *
 * Returns false for every domain today: none of the four criteria can
 * be met without field-test data.
 */
export function mayReportSubscore(s: ReportableSubscore): {
  allowed: boolean;
  missing: string[];
} {
  const missing: string[] = [];
  const e = s.evidence;
  if (!e.sufficientInformation) missing.push('sufficient information per student');
  if (!e.precisionEstablished) missing.push('precision / reliability evidence');
  if (!e.dimensionalityEstablished) missing.push('dimensionality evidence');
  if (!e.interpretabilityEstablished) missing.push('interpretability evidence');
  if (!s.approvedForReporting) missing.push('explicit reporting approval');
  if (!s.approvedBy) missing.push('a named approver');
  return { allowed: missing.length === 0, missing };
}

/**
 * The guard that stops a blueprint domain becoming a scored subscale.
 *
 * Converting requires evidence to be supplied explicitly; there is no
 * path from BlueprintDomain to ReportableSubscore that does not pass
 * through this function.
 */
export function asReportableSubscore(
  domain: BlueprintDomain,
  evidence: ReportabilityEvidence = NO_REPORTABILITY_EVIDENCE,
  approvedBy: string | null = null
): ReportableSubscore {
  const complete =
    evidence.sufficientInformation &&
    evidence.precisionEstablished &&
    evidence.dimensionalityEstablished &&
    evidence.interpretabilityEstablished;
  return {
    domainId: domain.domainId,
    evidence,
    // Approval is never inferred from the presence of evidence alone;
    // a human must also have approved it.
    approvedForReporting: complete && approvedBy !== null,
    approvedBy,
  };
}

/** What a report may currently say about a domain. */
export type DomainReportMode = 'observed_counts_only' | 'scored_subscore';

export function reportModeFor(s: ReportableSubscore): DomainReportMode {
  return mayReportSubscore(s).allowed ? 'scored_subscore' : 'observed_counts_only';
}

/** Every blueprint domain, in its current reporting state. */
export function currentReportingState(
  domains: BlueprintDomain[]
): Array<{ domainId: AssessmentDomainId; mode: DomainReportMode; missing: string[] }> {
  return domains.map((d) => {
    const sub = asReportableSubscore(d);
    const check = mayReportSubscore(sub);
    return { domainId: d.domainId, mode: reportModeFor(sub), missing: check.missing };
  });
}
