// v0.54 §1 + §3 + §4 — Evidence provenance.
//
// WHY THIS EXISTS
//
// v0.53 wrote claims like "NCF-SE does not separate Rational Numbers"
// while NCF-SE itself had never been read. The claim came from the CBSE
// Class IX curriculum, which REPRODUCES the NCF-SE goal structure. That
// is good evidence — but it is an official derivative, not the source,
// and the difference matters when someone later asks "where does this
// come from?"
//
// Every claim now carries one of five provenance levels, and the level
// is part of the claim rather than a footnote.

export type ProvenanceLevel =
  /** The primary document itself was opened and read. */
  | 'directly_inspected_primary'
  /** An official body's reproduction of a primary source, read in full.
   *  Strong, but the source itself remains unverified. */
  | 'official_derivative'
  /** Non-official sources that agree. Never sufficient for a
   *  curriculum-placement claim. */
  | 'secondary_corroboration'
  /** Follows from mathematics. A sound basis for ordering; not a
   *  curriculum claim of any kind. */
  | 'mathematical_inference'
  /** A qualified human's judgement, recorded as such. */
  | 'expert_judgement';

export const PROVENANCE_STRENGTH: Record<ProvenanceLevel, number> = {
  directly_inspected_primary: 5,
  official_derivative: 4,
  expert_judgement: 3,
  secondary_corroboration: 2,
  mathematical_inference: 1,
};

export type ProvenancedClaim = {
  claim: string;
  provenance: ProvenanceLevel;
  sourceTitle: string;
  sourceOrganization: string;
  sourceVersion: string;
  location: string;
  dateInspected: string;
  /** Present when the claim is about a document not directly read. */
  reproducedFrom?: string;
};

/**
 * A claim may only be phrased as a direct statement about a document
 * when that document was directly inspected. Otherwise it must be
 * attributed to the derivative.
 */
export function mayAssertAboutSource(c: ProvenancedClaim): boolean {
  return c.provenance === 'directly_inspected_primary';
}

/** Rewrites an over-strong claim into an accurately attributed one. */
export function attributedClaim(c: ProvenancedClaim): string {
  if (mayAssertAboutSource(c)) return c.claim;
  if (c.provenance === 'official_derivative') {
    return `${c.sourceTitle} (${c.sourceOrganization}, ${c.sourceVersion}) states: ${c.claim}`;
  }
  if (c.provenance === 'secondary_corroboration') {
    return `Secondary sources report, without primary confirmation: ${c.claim}`;
  }
  if (c.provenance === 'mathematical_inference') {
    return `Inferred from mathematical structure, not from any curriculum document: ${c.claim}`;
  }
  return `Expert judgement: ${c.claim}`;
}

// ---------------------------------------------------------------------------
// The corrected claim register
// ---------------------------------------------------------------------------

export const FRAMEWORK_CLAIMS: ProvenancedClaim[] = [
  {
    // v0.53 asserted this as a fact about NCF-SE. It is not; it is a
    // fact about the CBSE document that reproduces NCF-SE.
    claim:
      'Rational numbers are placed within the number curricular goal (CG-1) alongside natural, whole, integer, irrational and real numbers, with no separate goal.',
    provenance: 'official_derivative',
    sourceTitle: 'Curriculum 2026-27, Mathematics Class IX',
    sourceOrganization: 'CBSE',
    sourceVersion: '2026-27',
    location: 'Curricular Goals and Competencies section, CG-1',
    dateInspected: '2026-08-18',
    reproducedFrom: 'NCF-SE 2023 (not directly inspected)',
  },
  {
    claim:
      'Computational Thinking is integrated across school subjects, including beyond Mathematics, as a cross-cutting theme.',
    provenance: 'directly_inspected_primary',
    sourceTitle: 'Computational Thinking and Artificial Intelligence, Classes 3-8 Curriculum',
    sourceOrganization: 'CBSE',
    sourceVersion: '2026-27',
    location: 'Section 2, Summary',
    dateInspected: '2026-08-19',
  },
  {
    // v0.54 §7 — a genuinely new and consequential finding.
    claim:
      'NCERT has developed competency-based Learning Outcomes at the Elementary Stage for Classes I to VIII, including Mathematics at both primary and upper-primary stages.',
    provenance: 'directly_inspected_primary',
    sourceTitle: 'Learning Outcomes at the Secondary Stage',
    sourceOrganization: 'NCERT',
    sourceVersion: 'First Edition, December 2019, ISBN 978-93-5292-201-7',
    location: 'Preamble, p. vii',
    dateInspected: '2026-08-19',
  },
  {
    // The nuance that changes how the Learning Outcomes may be used.
    claim:
      'The curricular expectations in the NCERT Learning Outcomes documents derive from NCF 2005, not from NCF-SE 2023.',
    provenance: 'directly_inspected_primary',
    sourceTitle: 'Learning Outcomes at the Secondary Stage',
    sourceOrganization: 'NCERT',
    sourceVersion: 'First Edition, December 2019',
    location: 'Salient Features, p. ix',
    dateInspected: '2026-08-19',
  },
];

/** §4 — audit helper. Any claim phrased as a direct assertion about a
 *  document that was not directly inspected is an error. */
export function overstatedClaims(claims: ProvenancedClaim[]): ProvenancedClaim[] {
  return claims.filter(
    (c) => c.reproducedFrom !== undefined && mayAssertAboutSource(c)
  );
}

// ---------------------------------------------------------------------------
// §1 — Design recommendations are not findings
// ---------------------------------------------------------------------------

export type RecommendationStatus =
  /** A reasoned proposal awaiting evidence and expert review. */
  | 'provisional_design_recommendation'
  /** Reviewed by qualified experts and adopted. */
  | 'expert_endorsed'
  /** Supported by empirical evidence from Pragati data. */
  | 'empirically_supported';

export type DesignRecommendation = {
  id: string;
  recommendation: string;
  status: RecommendationStatus;
  supportedBy: string[];
  /** What would have to happen before the status could change. */
  pendingEvidence: string[];
  /** Options deliberately kept open. v0.53 read as if the question were
   *  closed; it is not. */
  alternativesRetained: string[];
};

export const DESIGN_RECOMMENDATIONS: DesignRecommendation[] = [
  {
    id: 'ct_as_process_tag',
    recommendation:
      'Treat Computational Thinking as an item-level process tag rather than a Mathematics content reporting domain.',
    // NOT "settled". v0.53 overstated this.
    status: 'provisional_design_recommendation',
    supportedBy: [
      'CBSE CT&AI Curriculum 2026-27 describes CT as a cross-cutting theme spanning subjects.',
      'Its stated assessment methods are projects, journals and observation.',
    ],
    pendingEvidence: [
      'PARAKH assessment framework review.',
      'Review by Indian Mathematics educators.',
      'Empirical dimensionality evidence once field-test data exists.',
    ],
    alternativesRetained: [
      'A future CT indicator reported alongside Mathematics domains.',
      'A separate CT instrument.',
      'CT as a reported domain if dimensionality evidence supports it.',
    ],
  },
  {
    id: 'rational_number_separate_domain',
    recommendation:
      'Report Fractions & Rational Number Reasoning as a domain distinct from Number Sense.',
    status: 'provisional_design_recommendation',
    supportedBy: [
      'Long developmental progression and persistent difficulty make it instructionally actionable.',
    ],
    pendingEvidence: [
      'Expert review.',
      'Dimensionality evidence showing the two are empirically separable.',
    ],
    alternativesRetained: [
      'Fold into Number Sense as a strand, matching the official goal structure.',
    ],
  },
];

export function recommendation(id: string): DesignRecommendation | null {
  return DESIGN_RECOMMENDATIONS.find((r) => r.id === id) ?? null;
}

/**
 * §1 — selected-response items CAN carry some CT evidence.
 *
 * v0.53's wording implied they never could. Decomposition and pattern
 * recognition are observable in a well-designed selected-response item;
 * what a short form cannot do is support a REPORTED CT score.
 */
export const CT_EVIDENCE_POSITION =
  'Selected-response Mathematics items can provide partial evidence of computational-thinking processes such as decomposition and pattern recognition, and items are tagged accordingly. What a short interim form cannot currently support is a reported Computational Thinking score. These are different claims, and only the second is refused.';

// ---------------------------------------------------------------------------
// §3 — Cross-stage continuum, corrected
// ---------------------------------------------------------------------------

export const CROSS_STAGE_CONTINUUM_CLAIM =
  'Rational Number reasoning is currently the strongest candidate for a cross-stage pilot continuum, based on available curriculum evidence and mathematical progression. Official foundational and preparatory placement remains incomplete: no primary Mathematics-content source has been inspected for those stages.';
