// v0.56 §2 — The evidence gate.
//
// THE HOLE THIS CLOSES
//
// v0.55's `mayFreezeFramework()` checked reviewers and nothing else. Two
// approving experts could therefore have frozen a framework whose two
// biggest structural questions rested on sources nobody had opened.
//
// That is a real failure mode, not a theoretical one: expert reviewers
// would have been asked to rule on the Rational Number domain and the
// treatment of Computational Thinking WITHOUT the national assessment
// framework in front of them. Their approval would have been sincere
// and uninformed, and the system would have recorded it as settled.
//
// So approval now requires BOTH gates. Neither substitutes for the
// other, and the tests prove it in both directions.

import { FRAMEWORK_DECISIONS } from './frameworkFreezeCandidate';
import {
  mayFreezeFramework,
  type DecisionReview,
  type Adjudication,
} from '../features/teacher/reviewAdjudication';

export type EvidenceStatus =
  | 'insufficient'
  | 'sufficient_for_expert_review'
  | 'sufficient_for_pilot_freeze';

export type HumanReviewStatus =
  | 'not_started'
  | 'under_review'
  | 'adjudication_pending'
  | 'approved';

export type FrameworkStatus =
  | 'blocked_by_evidence'
  | 'awaiting_human_review'
  | 'under_review'
  | 'adjudication_pending'
  | 'approved_for_pilot';

/**
 * Required evidence, with a reason for each.
 *
 * NOT every conceivable source is mandatory — that would block forever.
 * The test is whether a source could plausibly CHANGE a structural
 * decision that the pilot framework depends on.
 */
/**
 * v0.57 §9 — a structured inspection record.
 *
 * v0.56 gated on `inspected: boolean`. Flipping one character opened
 * the gate, with no record of who looked at what. Inspection is now a
 * record that must carry its own evidence, and `sourceInspected()`
 * derives the boolean from it. A bare `inspected: true` cannot open
 * the gate — a test proves it.
 */
export type SourceInspectionRecord = {
  sourceId: string;
  organization: string;
  title: string;
  officialUrl: string;
  version: string;
  documentIdentifier: string | null;
  inspectionDate: string;
  inspectedBy: string;
  pagesOrSectionsReviewed: string[];
  evidenceRecordsCreated: number;
  sourceArtifactReference: string | null;
  inspectionStatus: 'complete' | 'partial' | 'failed';
};

/** A record only counts when it carries real evidence of inspection. */
export function isValidInspection(r: SourceInspectionRecord): boolean {
  return (
    r.inspectionStatus === 'complete' &&
    r.inspectedBy.trim().length > 0 &&
    /^\d{4}-\d{2}-\d{2}$/.test(r.inspectionDate) &&
    r.pagesOrSectionsReviewed.length > 0 &&
    r.evidenceRecordsCreated > 0 &&
    r.officialUrl.trim().length > 0
  );
}

export function inspectionErrors(r: SourceInspectionRecord): string[] {
  const e: string[] = [];
  if (r.inspectionStatus !== 'complete') e.push(`status is '${r.inspectionStatus}'`);
  if (!r.inspectedBy.trim()) e.push('no inspectedBy');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(r.inspectionDate)) e.push('no valid inspectionDate');
  if (r.pagesOrSectionsReviewed.length === 0) e.push('no pages or sections recorded');
  if (r.evidenceRecordsCreated === 0) e.push('no evidence records created');
  if (!r.officialUrl.trim()) e.push('no official URL');
  return e;
}

export type RequiredSource = {
  id: string;
  title: string;
  requiredFor: 'expert_review' | 'pilot_freeze';
  why: string;
  /** @deprecated Derived from inspection records. Retained only so
   *  tests can construct hypothetical states; it is IGNORED by the
   *  gate unless a valid record backs it. */
  inspected: boolean;
};

/** The inspection records that actually exist. */
export const SOURCE_INSPECTIONS: SourceInspectionRecord[] = [
  {
    sourceId: 'cbse_class_ix',
    organization: 'CBSE',
    title: 'Curriculum 2026-27, Mathematics Class IX',
    officialUrl:
      'https://cbseacademic.nic.in/web_material/CurriculumMain27/SecPart1/Maths_SecP1IX_2026-27.pdf',
    version: '2026-27',
    documentIdentifier: null,
    inspectionDate: '2026-08-18',
    inspectedBy: 'Automated review (Claude)',
    pagesOrSectionsReviewed: ['Curricular Goals and Competencies section (CG-1..CG-11)'],
    evidenceRecordsCreated: 2,
    sourceArtifactReference: null,
    inspectionStatus: 'complete',
  },
  {
    sourceId: 'cbse_ctai',
    organization: 'CBSE',
    title: 'Computational Thinking and Artificial Intelligence, Classes 3-8',
    officialUrl:
      'https://cbseacademic.nic.in/web_material/CurriculumMain27/CTAI_Pri_2026-27.pdf',
    version: '2026-27',
    documentIdentifier: null,
    inspectionDate: '2026-08-19',
    inspectedBy: 'Automated review (Claude)',
    pagesOrSectionsReviewed: ['Sections 2, 2.1, 3.1, 4, 6, 7, 9.2, 10.1, 10.2, 10.2.2'],
    evidenceRecordsCreated: 4,
    sourceArtifactReference: null,
    inspectionStatus: 'complete',
  },
];

/** Whether a required source has been genuinely inspected. */
export function sourceInspected(
  sourceId: string,
  records: SourceInspectionRecord[] = SOURCE_INSPECTIONS
): boolean {
  const r = records.find((x) => x.sourceId === sourceId);
  return r ? isValidInspection(r) : false;
}

export const REQUIRED_EVIDENCE: RequiredSource[] = [
  {
    id: 'cbse_class_ix',
    title: 'CBSE Curriculum 2026-27, Mathematics Class IX',
    requiredFor: 'expert_review',
    why: 'Supplies the curricular-goal structure the domain proposal is built on.',
    inspected: true,
  },
  {
    id: 'cbse_ctai',
    title: 'CBSE Computational Thinking & AI, Classes 3-8',
    requiredFor: 'expert_review',
    why: 'The only direct evidence on how CT should be represented.',
    inspected: true,
  },
  {
    id: 'parakh',
    title: 'PARAKH Assessment Framework',
    requiredFor: 'pilot_freeze',
    why: 'The national assessment framework. It is the strongest authority on assessment design and reporting, and could restructure the reporting domains or contradict the process-tag treatment of problem solving. Freezing a pilot assessment framework without it means the structure may have to be rebuilt after items are written.',
    inspected: false,
  },
  {
    id: 'ncf_se_2023',
    title: 'NCF-SE 2023 (Mathematics learning standards)',
    requiredFor: 'pilot_freeze',
    why: 'All current curricular-goal evidence is second-hand via a CBSE reproduction. The Rational Number decision turns on whether NCF-SE genuinely places rational numbers inside CG-1, which has not been read directly.',
    inspected: false,
  },
  {
    id: 'ganita_prakash_g6',
    title: 'NCERT Ganita Prakash Grade 6',
    requiredFor: 'expert_review',
    why: 'Needed to confirm chapter placement for the pilot strand. Currently secondary-corroborated only.',
    inspected: false,
  },
];

export type EvidenceGateResult = {
  status: EvidenceStatus;
  missingForExpertReview: string[];
  missingForPilotFreeze: string[];
  /** Decisions that cannot be settled without the missing sources. */
  blockedDecisions: string[];
  reason: string;
};

/**
 * Evaluate evidence completeness.
 *
 * A deferred decision whose evidence cells are all null is
 * `blockedDecisions` — it may be *discussed* by reviewers, but it may
 * not be *resolved* into the pilot framework.
 */
export function evaluateFrameworkEvidenceGate(
  sources: RequiredSource[] = REQUIRED_EVIDENCE,
  records: SourceInspectionRecord[] = SOURCE_INSPECTIONS
): EvidenceGateResult {
  // §9 — inspection is derived from records. The `inspected` boolean on
  // RequiredSource is deliberately NOT consulted.
  const isInspected = (s: RequiredSource) => sourceInspected(s.id, records);

  const missingForExpertReview = sources
    .filter((s) => s.requiredFor === 'expert_review' && !isInspected(s))
    .map((s) => s.title);
  const missingForPilotFreeze = sources
    .filter((s) => s.requiredFor === 'pilot_freeze' && !isInspected(s))
    .map((s) => s.title);

  // A deferred structural decision is blocked while the national
  // sources that could settle it remain unread.
  //
  // Gating on SOURCE INSPECTION rather than on the matrix's evidence
  // cells matters: those cells are filled in as part of reading a
  // document, so gating on them would keep the decision blocked even
  // after the source had been read and the cell populated — the gate
  // would never open.
  const nationalSourcesUnread =
    !sourceInspected('parakh', records) || !sourceInspected('ncf_se_2023', records);

  const blockedDecisions = nationalSourcesUnread
    ? FRAMEWORK_DECISIONS.filter((d) => d.recommendedAction === 'defer').map(
        (d) => d.construct
      )
    : [];

  let status: EvidenceStatus = 'sufficient_for_pilot_freeze';
  let reason = 'All required evidence has been inspected.';

  if (missingForPilotFreeze.length > 0 || blockedDecisions.length > 0) {
    status = 'sufficient_for_expert_review';
    reason = `Enough evidence to consult experts, but not to freeze a pilot framework. Missing: ${[...missingForPilotFreeze].join('; ') || 'none'}. Unresolvable decisions: ${blockedDecisions.join('; ') || 'none'}.`;
  }
  if (missingForExpertReview.length > 0) {
    status = 'insufficient';
    reason = `Insufficient for expert review. Missing: ${missingForExpertReview.join('; ')}.`;
  }

  return {
    status,
    missingForExpertReview,
    missingForPilotFreeze,
    blockedDecisions,
    reason,
  };
}

export type FrameworkGateResult = {
  frameworkStatus: FrameworkStatus;
  evidence: EvidenceGateResult;
  humanReview: HumanReviewStatus;
  blockers: string[];
};

/**
 * The combined gate. BOTH must pass.
 *
 * Evaluation order matters: evidence is checked first, so a framework
 * with unread mandatory sources reports `blocked_by_evidence` even when
 * every reviewer has approved. That is the point — it makes the real
 * blocker visible instead of showing a green human-review state.
 */
export function evaluateFrameworkGate(args: {
  reviews: DecisionReview[];
  adjudications: Adjudication[];
  frameworkVersion: string;
  sources?: RequiredSource[];
  records?: SourceInspectionRecord[];
}): FrameworkGateResult {
  const { reviews, adjudications, frameworkVersion, sources, records } = args;
  const evidence = evaluateFrameworkEvidenceGate(sources, records);

  const decisionIds = FRAMEWORK_DECISIONS.filter((d) => d.humanReviewRequired).map(
    (d) => d.construct
  );
  const human = mayFreezeFramework({
    decisionIds,
    reviews,
    adjudications,
    frameworkVersion,
  });

  const humanReview: HumanReviewStatus = human.allowed
    ? 'approved'
    : reviews.length === 0
      ? 'not_started'
      : adjudications.length > 0
        ? 'adjudication_pending'
        : 'under_review';

  const blockers: string[] = [];
  if (evidence.status !== 'sufficient_for_pilot_freeze') {
    blockers.push(evidence.reason);
  }
  if (!human.allowed) blockers.push(...human.blockers);

  // Evidence outranks human approval when reporting the status.
  let frameworkStatus: FrameworkStatus;
  if (evidence.status !== 'sufficient_for_pilot_freeze') {
    frameworkStatus = 'blocked_by_evidence';
  } else if (humanReview === 'not_started') {
    frameworkStatus = 'awaiting_human_review';
  } else if (humanReview === 'under_review') {
    frameworkStatus = 'under_review';
  } else if (humanReview === 'adjudication_pending') {
    frameworkStatus = 'adjudication_pending';
  } else {
    frameworkStatus = 'approved_for_pilot';
  }

  return { frameworkStatus, evidence, humanReview, blockers };
}
