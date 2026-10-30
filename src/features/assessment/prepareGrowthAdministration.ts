// v0.57 §2-§7 — The authoritative formal-assessment pipeline.
//
// THE PROBLEM THIS FIXES
//
// v0.56 had two paths to a Growth form. The tested one ran items
// through `evaluateGrowthItemEligibility()` and the `AssessmentAssembler`.
// The one the product actually used was `buildGrowthPool()`, which
// checked `use`, checked a specification ID existed, checked the count,
// and returned `secure.slice(0, n)`.
//
// So every safeguard the test suite proved was real applied to a code
// path no teacher could reach. A `growth_field_test` item with a DRAFT
// specification, no expert review, and no accessibility review would
// have passed the production check and failed the tested one.
//
// This module is now the ONLY way a formal form is prepared. There is
// no second, weaker path.

import type { Grade } from '../../types';
import {
  evaluateGrowthItemEligibility,
  contextSupported,
  type GrowthContext,
  type GrowthItemRecord,
} from './growthEligibility';
import type { ItemExposureRecord } from './itemUse';
import type { SpecLookup } from './itemSpecification';
import {
  assembleAssessment,
  PILOT_ADMINISTRATION_V1,
  type AssemblyCandidate,
  type AssemblyResult,
  type PilotAdministrationSpecification,
} from './assessmentAssembler';
import { captureConfiguration, type AssessmentConfigurationSnapshot } from './assessmentGovernance';
import {
  authorizePilotFramework,
  mayAdministerSpecification,
  TEACHER_FRAMEWORK_NOT_READY,
  type PilotFrameworkAuthorization,
  type SpecificationUse,
} from './pilotFrameworkAuthorization';
import { CURRENT_REVIEWS, CURRENT_ADJUDICATIONS } from '../teacher/reviewAdjudication';

/** Everything the assembler needs that the item record does not carry. */
export type GrowthItemMetadata = {
  itemId: string;
  domainId: AssemblyCandidate['domainId'];
  competencyId: string;
  format: AssemblyCandidate['format'];
  cognitiveDemand: AssemblyCandidate['cognitiveDemand'];
  difficulty: number;
  gradeRange: { from: Grade; to: Grade };
  language: string;
  enemyItemIds: string[];
};

export type RejectedItem = { itemId: string; reasons: string[] };

export type GrowthPreparationResult = {
  /** True only when a complete, blueprint-satisfying form exists. */
  ready: boolean;
  context: GrowthContext;
  /** The assembled form. Null whenever `ready` is false. */
  form: AssemblyCandidate[] | null;
  coverage: AssemblyResult extends { coverage: infer C } ? C : never;
  /** Every item refused, with every reason. */
  rejected: RejectedItem[];
  /** Blueprint constraints the bank could not satisfy. */
  unmetConstraints: string[];
  /** One sentence for a teacher. No diagnostics. */
  teacherMessage: string;
  /** Precise blockers for Admin & Research. */
  adminBlockers: string[];
  configuration: AssessmentConfigurationSnapshot;
  /** v0.58 §2 — the upstream framework decision. */
  authorization: PilotFrameworkAuthorization;
};

export const TEACHER_NOT_READY_MESSAGE =
  'Enough reviewed questions have not yet been prepared to build a balanced pilot form.';

/**
 * Prepare a formal Growth administration.
 *
 * Order matters. Eligibility runs BEFORE assembly, so an ineligible
 * item can never contribute to satisfying a domain minimum — otherwise
 * a blueprint could be "satisfied" by items that may not be
 * administered.
 */
export function prepareGrowthAdministration(args: {
  context: GrowthContext;
  records: GrowthItemRecord[];
  metadata: Record<string, GrowthItemMetadata>;
  lookup: SpecLookup;
  grade: Grade;
  language?: string;
  exposureLog?: Record<string, ItemExposureRecord>;
  spec?: PilotAdministrationSpecification;
  requiredCompetencyIds?: string[];
  now?: number;
  /** §2 — injected so tests can supply an authorized framework without
   *  writing fake evidence into production data. */
  authorization?: PilotFrameworkAuthorization;
  /** §3 — 'simulation' skips the specification-approval gate. */
  specificationUse?: SpecificationUse;
}): GrowthPreparationResult {
  const {
    context, records, metadata, lookup, grade,
    language = 'en', exposureLog = {},
    spec = PILOT_ADMINISTRATION_V1,
    requiredCompetencyIds = [], now,
    specificationUse = 'field_test_administration',
    authorization = authorizePilotFramework({
      reviews: CURRENT_REVIEWS,
      adjudications: CURRENT_ADJUDICATIONS,
      frameworkVersion: 'v0.58-candidate',
    }),
  } = args;

  const configuration = captureConfiguration({
    assessmentSpecificationId: spec.specificationId,
    assessmentSpecificationVersion: spec.version,
    blueprintVersion: spec.version,
    language: language === 'hi' ? 'hi' : 'en',
    now,
  });

  const emptyCoverage = spec.domainWeights.map((w) => ({
    domainId: w.domainId,
    targetItems: Math.round(w.targetShare * spec.targetLength),
    assembledItems: 0,
    minItems: w.minItems,
    satisfied: false,
  }));

  const fail = (
    teacherMessage: string,
    blockers: string[]
  ): GrowthPreparationResult => ({
    ready: false, context, form: null,
    coverage: emptyCoverage as never,
    rejected: [], unmetConstraints: blockers,
    teacherMessage, adminBlockers: blockers,
    configuration, authorization,
  });

  // --- Gate -2: is the pilot framework approved? -----------------------
  //
  // FIRST, deliberately. Items are tagged to domains the framework
  // defines; assembling a form before those domains are agreed produces
  // a correct form against an unagreed blueprint.
  if (!authorization.authorized) {
    return fail(TEACHER_FRAMEWORK_NOT_READY, [
      `Framework status: ${authorization.frameworkStatus}.`,
      ...authorization.adminBlockers,
    ]);
  }

  // --- Gate -1: may this specification be administered? ----------------
  const specGate = mayAdministerSpecification(spec, specificationUse);
  if (!specGate.allowed) {
    return fail(TEACHER_NOT_READY_MESSAGE, [specGate.reason]);
  }

  // --- Gate -0.5: does the specification cover this grade? -------------
  //
  // §6 — BOTH must hold: the specification permits the grade, and the
  // item permits it. Item grade ranges alone are not sufficient.
  if (!spec.intendedGrades.includes(grade)) {
    return fail(
      `This assessment has not been designed for Class ${grade.replace('class', '')}.`,
      [
        `Grade '${grade}' is not in the specification's intendedGrades (${spec.intendedGrades.join(', ')}).`,
      ]
    );
  }

  // --- Gate 0: is this context supported at all? ----------------------
  const supported = contextSupported(context);
  if (!supported.supported) {
    return {
      ready: false, context, form: null,
      coverage: emptyCoverage as never,
      rejected: [], unmetConstraints: [supported.reason],
      teacherMessage: TEACHER_NOT_READY_MESSAGE,
      adminBlockers: [supported.reason],
      configuration, authorization,
    };
  }

  // --- Gate 1: item eligibility --------------------------------------
  const eligible: GrowthItemRecord[] = [];
  const rejected: RejectedItem[] = [];
  for (const record of records) {
    const verdict = evaluateGrowthItemEligibility({
      record, context, lookup, exposure: exposureLog[record.itemId],
    });
    if (verdict.eligible) eligible.push(record);
    else rejected.push({ itemId: record.itemId, reasons: verdict.reasons });
  }

  // --- Gate 2: metadata completeness ---------------------------------
  const candidates: AssemblyCandidate[] = [];
  for (const record of eligible) {
    const meta = metadata[record.itemId];
    if (!meta) {
      rejected.push({
        itemId: record.itemId,
        reasons: ['No assembly metadata (domain, competency, format, difficulty) recorded.'],
      });
      continue;
    }
    candidates.push({
      itemId: meta.itemId,
      domainId: meta.domainId,
      competencyId: meta.competencyId,
      format: meta.format,
      cognitiveDemand: meta.cognitiveDemand,
      difficulty: meta.difficulty,
      gradeRange: meta.gradeRange,
      language: meta.language,
      enemyItemIds: meta.enemyItemIds,
      exposureCount: exposureLog[meta.itemId]?.growthAdministrations ?? 0,
    });
  }

  // --- Gate 3: blueprint assembly ------------------------------------
  const assembly = assembleAssessment({
    spec, candidates, grade, language, requiredCompetencyIds,
  });

  const adminBlockers: string[] = [];
  if (rejected.length > 0) {
    adminBlockers.push(
      `${rejected.length} item(s) failed the eligibility gate.`
    );
  }

  if (!assembly.ok) {
    adminBlockers.push(...assembly.unmetConstraints);
    return {
      ready: false, context, form: null,
      coverage: assembly.coverage as never,
      rejected, unmetConstraints: assembly.unmetConstraints,
      teacherMessage: TEACHER_NOT_READY_MESSAGE,
      adminBlockers,
      configuration, authorization,
    };
  }

  return {
    ready: true, context,
    form: assembly.items,
    coverage: assembly.coverage as never,
    rejected, unmetConstraints: [],
    teacherMessage: 'A pilot field-test form can be assembled for this class.',
    adminBlockers,
    configuration, authorization,
  };
}

/**
 * Aggregate blockers for Admin & Research.
 *
 * Counts WHY items were refused rather than listing item IDs, so the
 * summary stays useful as the bank grows.
 */
export function summariseBlockers(result: GrowthPreparationResult): string[] {
  const out: string[] = [];
  if (result.rejected.length === 0 && result.form === null) {
    out.push('0 formal Growth items authored.');
  }
  const buckets = new Map<string, number>();
  for (const r of result.rejected) {
    for (const reason of r.reasons) {
      const key = reason.includes('expert review')
        ? 'items awaiting expert review'
        : reason.includes('Accessibility')
          ? 'items awaiting accessibility review'
          : reason.includes('fieldTestEligible')
            ? 'specifications not field-test eligible'
            : reason.includes('Mathematical content')
              ? 'items awaiting mathematical content review'
              : 'items blocked for other reasons';
      buckets.set(key, (buckets.get(key) ?? 0) + 1);
    }
  }
  for (const [k, n] of buckets) out.push(`${n} ${k}.`);
  out.push(...result.unmetConstraints);
  return out;
}
