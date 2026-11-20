// v0.52 §7 + §8 + §12 + §13 + §19 — evidence, review, accommodation,
// language, and configuration versioning.
//
// A COMMON THEME
//
// Each of these replaces a bare string or boolean with a record that
// carries its provenance. `reviewedBy: ['Dr Sharma']` cannot answer
// what was reviewed, against which version, or whether the reviewer
// approved. A status that cannot be interrogated is a status that gets
// asserted rather than earned.


// ===========================================================================
// §7 — Specification evidence
// ===========================================================================

export type EvidenceType =
  | 'curriculum_framework'
  | 'textbook'
  | 'learning_outcomes_document'
  | 'assessment_framework'
  | 'research_literature'
  | 'expert_judgement';

/**
 * A traceable evidence record.
 *
 * v0.51 accepted `sourceEvidence: string[]` — free text, often a bare
 * URL. A URL says where someone looked, not what they found or whether
 * it supported the claim. These fields exist so a reviewer can check
 * the claim without repeating the search.
 */
export type SpecificationEvidenceRecord = {
  evidenceType: EvidenceType;
  sourceTitle: string;
  sourceOrganization: string;
  /** Edition, reprint year, or version. */
  sourceVersion: string;
  /** Chapter, section, page, or outcome code. "Page 47", not "the book". */
  location: string;
  curriculumReference: string | null;
  competencyReference: string | null;
  /** What this source actually supports. The claim being made, in
   *  words, so a reviewer can agree or disagree with it. */
  evidenceClaim: string;
  verifiedBy: string;
  verifiedAt: string;
  /** True only if the verifier inspected the primary source itself. */
  primarySourceInspected: boolean;
};

export function validateEvidenceRecord(e: SpecificationEvidenceRecord): string[] {
  const errs: string[] = [];
  const req: Array<[keyof SpecificationEvidenceRecord, string]> = [
    ['sourceTitle', 'sourceTitle'],
    ['sourceOrganization', 'sourceOrganization'],
    ['sourceVersion', 'sourceVersion'],
    ['location', 'location'],
    ['evidenceClaim', 'evidenceClaim'],
    ['verifiedBy', 'verifiedBy'],
    ['verifiedAt', 'verifiedAt'],
  ];
  for (const [k, name] of req) {
    if (!String(e[k] ?? '').trim()) errs.push(`evidence record is missing ${name}`);
  }
  // A bare URL is not evidence — it records a location, not a finding.
  if (/^https?:\/\/\S+$/.test(e.evidenceClaim.trim())) {
    errs.push(
      'evidenceClaim is a bare URL; state what the source says that supports the claim'
    );
  }
  return errs;
}

// ===========================================================================
// §8 — Structured review records
// ===========================================================================

export type ReviewerRole =
  | 'mathematics_educator'
  | 'curriculum_expert'
  | 'assessment_specialist'
  | 'language_specialist'
  | 'accessibility_specialist'
  | 'practising_teacher';

export type ReviewType =
  | 'mathematical_accuracy'
  | 'competency_alignment'
  | 'language_clarity'
  | 'bias_fairness'
  | 'accessibility'
  | 'holistic';

export type ReviewDecision = 'approve' | 'approve_with_changes' | 'revise' | 'reject';

export type ReviewJudgement = 'pass' | 'concerns' | 'fail' | 'not_assessed';

export type ReviewRecord = {
  reviewerId: string;
  reviewerName: string;
  reviewerRole: ReviewerRole;
  expertise: string;
  reviewType: ReviewType;
  /** Which version was reviewed. A review of v1 says nothing about v3. */
  versionReviewed: string;
  reviewDate: string;
  decision: ReviewDecision;
  mathematicalAccuracy: ReviewJudgement;
  competencyAlignment: ReviewJudgement;
  languageClarity: ReviewJudgement;
  biasFairness: ReviewJudgement;
  accessibility: ReviewJudgement;
  comments: string;
};

/** Roles that can constitute an EXPERT review of mathematical content.
 *  A practising teacher's review is valuable and is not this. */
const EXPERT_ROLES: ReviewerRole[] = [
  'mathematics_educator',
  'curriculum_expert',
  'assessment_specialist',
];

/**
 * Whether a review history genuinely supports "expert reviewed".
 *
 * v0.51 accepted one name in an array. The bar here: at least two
 * independent expert reviewers, both approving, both having reviewed
 * THIS version, with no failed judgement.
 */
export function qualifiesAsExpertReviewed(
  reviews: ReviewRecord[],
  currentVersion: string
): { qualifies: boolean; reasons: string[] } {
  const reasons: string[] = [];
  const relevant = reviews.filter((r) => r.versionReviewed === currentVersion);

  if (relevant.length === 0) {
    reasons.push(`No review records for the current version '${currentVersion}'.`);
  }
  const experts = relevant.filter((r) => EXPERT_ROLES.includes(r.reviewerRole));
  const distinct = new Set(experts.map((r) => r.reviewerId));
  if (distinct.size < 2) {
    reasons.push(
      `Expert review requires at least 2 independent expert reviewers; found ${distinct.size}.`
    );
  }
  const approving = experts.filter(
    (r) => r.decision === 'approve' || r.decision === 'approve_with_changes'
  );
  if (approving.length < 2) {
    reasons.push('At least 2 expert reviewers must have approved.');
  }
  const failed = relevant.filter((r) =>
    [r.mathematicalAccuracy, r.competencyAlignment, r.biasFairness].includes('fail')
  );
  if (failed.length > 0) {
    reasons.push('One or more reviewers recorded a failing judgement.');
  }
  return { qualifies: reasons.length === 0, reasons };
}

// ===========================================================================
// §12 — Accessibility and accommodation
// ===========================================================================

/**
 * Accommodations are not uniformly "incomparable".
 *
 * v0.51 said an accommodated sitting "may not be comparable", full
 * stop. That is both over- and under-cautious: magnification removes a
 * barrier without touching the mathematics, whereas reading a
 * reading-comprehension item aloud may change what is measured. The
 * distinction depends on the item's construct, so it is recorded per
 * accommodation rather than assumed.
 */
export type SupportCategory =
  /** Available to everyone, always. Not an accommodation. */
  | 'universal_feature'
  /** Available on request; expected not to change the construct. */
  | 'designated_support'
  /** For identified need; intended to preserve the construct. */
  | 'accommodation'
  /** May change what is measured. Recorded, and results flagged. */
  | 'modification';

export type ComparabilityStatus =
  | 'expected_comparable'
  | 'requires_evidence'
  | 'potentially_non_comparable';

export type AccessibilitySupport = {
  id: string;
  label: string;
  category: SupportCategory;
  /** The barrier this removes. */
  intendedBarrier: string;
  /** Honest note on whether it could touch the construct. */
  possibleConstructImpact: string;
  comparability: ComparabilityStatus;
  rationale: string;
};

export const ACCESSIBILITY_SUPPORTS: AccessibilitySupport[] = [
  {
    id: 'magnification',
    label: 'Magnification',
    category: 'universal_feature',
    intendedBarrier: 'Visual acuity; small text or diagrams.',
    possibleConstructImpact:
      'None expected. Size is not part of any mathematics construct here.',
    comparability: 'expected_comparable',
    rationale:
      'Available to every student at all times, so it is a design feature rather than an accommodation.',
  },
  {
    id: 'high_contrast',
    label: 'High contrast',
    category: 'universal_feature',
    intendedBarrier: 'Low contrast sensitivity; screen glare.',
    possibleConstructImpact: 'None expected.',
    comparability: 'expected_comparable',
    rationale: 'Presentation change only.',
  },
  {
    id: 'keyboard_navigation',
    label: 'Keyboard navigation',
    category: 'universal_feature',
    intendedBarrier: 'Motor difficulty using a pointer.',
    possibleConstructImpact: 'None expected.',
    comparability: 'expected_comparable',
    rationale: 'Input method only.',
  },
  {
    id: 'extended_time',
    label: 'Extended time',
    category: 'accommodation',
    intendedBarrier:
      'Processing speed, motor speed, or anxiety unrelated to mathematical competency.',
    possibleConstructImpact:
      'Low for a power test. Would matter if speed were part of the construct — it is not in this design, but that is a design decision, not a finding.',
    comparability: 'requires_evidence',
    rationale:
      'Widely used and generally accepted, but comparability for THIS instrument is an empirical question until field-test data exists.',
  },
  {
    id: 'text_to_speech',
    label: 'Read aloud',
    category: 'accommodation',
    intendedBarrier: 'Decoding difficulty in a test of mathematics, not reading.',
    possibleConstructImpact:
      'Depends on the item. For a symbolic computation item, none. For a multi-step word problem, reading the stem aloud may remove part of what the item elicits.',
    comparability: 'requires_evidence',
    rationale:
      'Must be evaluated per item construct. Specifications record language load precisely so this can be judged.',
  },
  {
    id: 'bilingual_support',
    label: 'Bilingual support',
    category: 'designated_support',
    intendedBarrier:
      'Instruction language differs from the language of greatest fluency.',
    possibleConstructImpact:
      'Should not change the mathematics, but a translated form is a different form and must be shown equivalent, not assumed so.',
    comparability: 'requires_evidence',
    rationale:
      'Language equivalence is established by DIF analysis, not by translation quality alone. See §13.',
  },
  {
    id: 'calculator_when_prohibited',
    label: 'Calculator where the item prohibits one',
    category: 'modification',
    intendedBarrier: 'Computation difficulty.',
    possibleConstructImpact:
      'High. When an item is measuring computational fluency, a calculator measures something else.',
    comparability: 'potentially_non_comparable',
    rationale:
      'Recorded and flagged. Results from a modified administration are reported separately.',
  },
];

export function supportById(id: string): AccessibilitySupport | null {
  return ACCESSIBILITY_SUPPORTS.find((s) => s.id === id) ?? null;
}

/** The overall comparability of an administration: the most cautious
 *  status among the supports used. */
export function administrationComparability(
  supportIds: string[]
): ComparabilityStatus {
  const order: ComparabilityStatus[] = [
    'expected_comparable',
    'requires_evidence',
    'potentially_non_comparable',
  ];
  let worst = 0;
  for (const id of supportIds) {
    const s = supportById(id);
    if (!s) continue;
    worst = Math.max(worst, order.indexOf(s.comparability));
  }
  return order[worst];
}

// ===========================================================================
// §13 — Multilingual item architecture
// ===========================================================================

export type LanguageCode = 'en' | 'hi';

export type TranslationStatus =
  | 'not_started'
  | 'translated'
  | 'independently_reviewed'
  | 'adjudicated'
  | 'field_test_ready';

/**
 * An item family: one measurement intent, several language forms.
 *
 * The critical modelling decision is that each variant carries its OWN
 * field-test and DIF status. Translating the words does not make two
 * forms equivalent — equivalence is an empirical finding about how
 * students respond, and it is established per language.
 */
export type ItemLanguageVariant = {
  itemId: string;
  language: LanguageCode;
  translationStatus: TranslationStatus;
  translator: string | null;
  independentReviewer: string | null;
  adjudicator: string | null;
  equivalenceReviewCompleted: boolean;
  mathematicalTerminologyReviewCompleted: boolean;
  readingLoadReviewCompleted: boolean;
  /** Per language. A form field-tested in English is NOT field-tested
   *  in Hindi. */
  fieldTestStatus: 'not_tested' | 'in_field_test' | 'field_tested';
  difStatus: 'not_analysed' | 'analysed_clear' | 'analysed_flagged';
};

export type ItemFamily = {
  itemFamilyId: string;
  competencyId: string;
  specificationId: string;
  sourceLanguage: LanguageCode;
  variants: ItemLanguageVariant[];
};

/** Whether a language variant may enter a field test in that language. */
export function variantFieldTestEligible(
  v: ItemLanguageVariant
): { eligible: boolean; reasons: string[] } {
  const reasons: string[] = [];
  if (v.translationStatus !== 'adjudicated' && v.translationStatus !== 'field_test_ready') {
    reasons.push(`Translation status is '${v.translationStatus}'; adjudication is required.`);
  }
  if (!v.independentReviewer) reasons.push('No independent translation reviewer recorded.');
  if (!v.equivalenceReviewCompleted) reasons.push('Equivalence review not completed.');
  if (!v.mathematicalTerminologyReviewCompleted) {
    reasons.push('Mathematical terminology review not completed.');
  }
  if (!v.readingLoadReviewCompleted) reasons.push('Reading-load review not completed.');
  return { eligible: reasons.length === 0, reasons };
}

/** Language forms are never pooled as one measurement record. */
export function variantsAreDistinctRecords(family: ItemFamily): boolean {
  const ids = family.variants.map((v) => v.itemId);
  return new Set(ids).size === ids.length;
}

// ===========================================================================
// §19 — Versioned configuration snapshot
// ===========================================================================

/**
 * Everything needed to interpret an administration after the code has
 * moved on.
 *
 * Without this, a session recorded today becomes uninterpretable the
 * first time the blueprint or framework changes — and a longitudinal
 * assessment whose past data cannot be interpreted has no longitudinal
 * claim.
 */
export type AssessmentConfigurationSnapshot = {
  assessmentSpecificationId: string;
  assessmentSpecificationVersion: string;
  blueprintVersion: string;
  competencyFrameworkVersion: string;
  itemBankVersion: string;
  routerId: string;
  routerVersion: string;
  scoringVersion: string;
  reportingVersion: string;
  language: LanguageCode;
  curriculumMappingVersion: string;
  administrationRulesVersion: string;
  /** Null until a calibration exists. */
  calibrationVersion: string | null;
  capturedAt: number;
};

export const CURRENT_VERSIONS = {
  competencyFrameworkVersion: 'draft-2026-08',
  itemBankVersion: 'v0.52',
  routerId: 'heuristic_v1',
  routerVersion: 'v1',
  scoringVersion: 'dichotomous-v1',
  reportingVersion: 'observed-counts-v1',
  curriculumMappingVersion: 'v0.52',
  administrationRulesVersion: 'growth-rules-v1',
} as const;

export function captureConfiguration(args: {
  assessmentSpecificationId: string;
  assessmentSpecificationVersion: string;
  blueprintVersion: string;
  language: LanguageCode;
  now?: number;
}): AssessmentConfigurationSnapshot {
  return {
    assessmentSpecificationId: args.assessmentSpecificationId,
    assessmentSpecificationVersion: args.assessmentSpecificationVersion,
    blueprintVersion: args.blueprintVersion,
    language: args.language,
    calibrationVersion: null,
    capturedAt: args.now ?? Date.now(),
    ...CURRENT_VERSIONS,
  };
}

/** A snapshot must be complete: a missing version is an uninterpretable
 *  session later. */
export function validateConfigurationSnapshot(
  s: AssessmentConfigurationSnapshot
): string[] {
  const required: Array<keyof AssessmentConfigurationSnapshot> = [
    'assessmentSpecificationId', 'assessmentSpecificationVersion',
    'blueprintVersion', 'competencyFrameworkVersion', 'itemBankVersion',
    'routerId', 'routerVersion', 'scoringVersion', 'reportingVersion',
    'language', 'curriculumMappingVersion', 'administrationRulesVersion',
  ];
  return required
    .filter((k) => !String(s[k] ?? '').trim())
    .map((k) => `configuration snapshot is missing ${String(k)}`);
}

// ===========================================================================
// §18 — Response-quality metadata
// ===========================================================================

/**
 * Recorded, never acted upon.
 *
 * These fields exist so that thresholds can eventually be STUDIED. No
 * rapid-guessing cutoff is applied, because any cutoff chosen now would
 * be arbitrary, and invalidating a child's results on an arbitrary rule
 * is worse than keeping messy data.
 */
export type ResponseQualityMetadata = {
  itemId: string;
  responseTimeMs: number;
  /** Gaps long enough to suggest the student left the device. */
  interruptionCount: number;
  longestInterruptionMs: number;
  omitted: boolean;
  resumeEventCount: number;
};

export type AdministrationQualityMetadata = {
  totalTimeMs: number;
  itemMetadata: ResponseQualityMetadata[];
  deviceUserAgent: string | null;
  connectivityInterruptions: number;
  proctorIrregularityFlags: string[];
  /** Deliberately absent: any validity verdict. */
};

/** Summary statistics only. Explicitly returns no verdict. */
export function summariseResponseQuality(m: AdministrationQualityMetadata): {
  itemCount: number;
  medianResponseTimeMs: number | null;
  omittedCount: number;
  totalInterruptions: number;
  verdict: 'no_automated_verdict';
  note: string;
} {
  const times = m.itemMetadata
    .filter((i) => !i.omitted)
    .map((i) => i.responseTimeMs)
    .sort((a, b) => a - b);
  const median =
    times.length === 0
      ? null
      : times.length % 2 === 1
        ? times[(times.length - 1) / 2]
        : (times[times.length / 2 - 1] + times[times.length / 2]) / 2;
  return {
    itemCount: m.itemMetadata.length,
    medianResponseTimeMs: median,
    omittedCount: m.itemMetadata.filter((i) => i.omitted).length,
    totalInterruptions: m.itemMetadata.reduce((a, i) => a + i.interruptionCount, 0),
    verdict: 'no_automated_verdict',
    note: 'Response-quality data is recorded for future empirical study. Pragati applies no rapid-guessing threshold and invalidates no administration, because no such threshold has been established for this instrument or population.',
  };
}
