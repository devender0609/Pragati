// v0.66 §2 — THE PUBLICATION TRANSITION.
//
// Passing review does not publish anything. Someone has to act, and the
// act has to be recorded.
//
// WHY THIS EXISTS RATHER THAN A STATUS SETTER
//
// If content status could be assigned to `published` directly, the
// entire review apparatus becomes advisory: one line of code anywhere
// in the product could put unreviewed material in front of a child. The
// transition is therefore the ONLY route, it refuses unless
// `mayPublishSection()` succeeds, and it records what authorised it.
//
// This is not a CMS. It is one guarded state change plus its receipt.

import { mayPublishSection, publicationPolicyFor } from './publicationGate';
import { reviewRecordFor } from './educatorReview';
import { section74Artifact } from './contentArtifact';
import { REVIEW_BUILD } from './reviewBuild';

export type PublicationRecord = {
  officialSectionId: string;
  contentArtifactId: string;
  contentArtifactVersion: number;
  /** The semantic fingerprint AT THE MOMENT OF PUBLICATION. If the
   *  content later changes, this proves what was actually authorised. */
  contentFingerprint: string;
  /** What the reviewer could see and interact with. */
  reviewBuildId: string;
  publishedAt: string;
  publishedBy: string;
  /** The adjudications that authorised it, by package and item. */
  authorisingAdjudications: Array<{
    packageId: 'A_curriculum' | 'B_demonstration';
    itemId: string;
    outcome: string;
    adjudicatedBy: string;
    adjudicationDate: string;
  }>;
};

export type PublishResult =
  | { ok: true; record: PublicationRecord }
  | { ok: false; blockers: string[] };

/**
 * The published register. Empty, because nothing has been published.
 *
 * Deliberately module-level and append-only in practice: a publication
 * is a historical fact, not a mutable flag.
 */
const PUBLISHED: PublicationRecord[] = [];

export function publishedRecordFor(
  officialSectionId: string
): PublicationRecord | null {
  return (
    PUBLISHED.find((r) => r.officialSectionId === officialSectionId) ?? null
  );
}

export function isSectionPublished(officialSectionId: string): boolean {
  return publishedRecordFor(officialSectionId) !== null;
}

export function publishedSectionCount(): number {
  return PUBLISHED.length;
}

/**
 * Publish a reviewed artifact.
 *
 * Refuses unless every gate passes. The caller cannot supply its own
 * fingerprint or artifact version — both are read from the current
 * content, so a stale or mismatched artifact cannot be published by
 * asserting that it is fine.
 */
export function publishSectionArtifact(args: {
  officialSectionId: string;
  publishedBy: string;
  /** The version the publisher BELIEVES they are publishing. Checked
   *  against the current artifact; a mismatch means the content moved
   *  under them. */
  expectedArtifactVersion: number;
  expectedFingerprint: string;
  now?: () => string;
}): PublishResult {
  const { officialSectionId, publishedBy } = args;

  const gate = mayPublishSection(officialSectionId);
  if (!gate.mayPublish) return { ok: false, blockers: gate.blockers };

  const policy = publicationPolicyFor(officialSectionId);
  if (!policy) {
    return {
      ok: false,
      blockers: [`No publication policy for '${officialSectionId}'.`],
    };
  }

  const artifact = section74Artifact();

  if (artifact.contentArtifactId !== policy.contentArtifactId) {
    return {
      ok: false,
      blockers: [
        `Artifact '${artifact.contentArtifactId}' is not the artifact this section publishes ('${policy.contentArtifactId}').`,
      ],
    };
  }
  if (args.expectedArtifactVersion !== artifact.contentArtifactVersion) {
    return {
      ok: false,
      blockers: [
        `Expected artifact version ${args.expectedArtifactVersion}, current is ${artifact.contentArtifactVersion}. The content changed since publication was prepared.`,
      ],
    };
  }
  if (args.expectedFingerprint !== artifact.contentFingerprint) {
    return {
      ok: false,
      blockers: [
        `Fingerprint mismatch: expected '${args.expectedFingerprint}', current is '${artifact.contentFingerprint}'. Publishing would ship content nobody reviewed.`,
      ],
    };
  }
  if (isSectionPublished(officialSectionId)) {
    return {
      ok: false,
      blockers: [`Section '${officialSectionId}' is already published.`],
    };
  }

  // The receipt: which adjudications authorised this.
  const authorising: PublicationRecord['authorisingAdjudications'] = [];
  for (const [pkg, items] of [
    ['A_curriculum', policy.packageA],
    ['B_demonstration', policy.packageB],
  ] as const) {
    const rec = reviewRecordFor(pkg);
    for (const itemId of items) {
      const adj = rec.adjudications.find((a) => a.itemId === itemId);
      if (adj) {
        authorising.push({
          packageId: pkg,
          itemId,
          outcome: adj.outcome,
          adjudicatedBy: adj.adjudicatedBy,
          adjudicationDate: adj.adjudicationDate,
        });
      }
    }
  }

  const record: PublicationRecord = {
    officialSectionId,
    contentArtifactId: artifact.contentArtifactId,
    contentArtifactVersion: artifact.contentArtifactVersion,
    contentFingerprint: artifact.contentFingerprint,
    reviewBuildId: REVIEW_BUILD.reviewBuildId,
    publishedAt: (args.now ?? (() => new Date().toISOString()))(),
    publishedBy,
    authorisingAdjudications: authorising,
  };

  PUBLISHED.push(record);
  return { ok: true, record };
}

/** Test-only reset. Publication is otherwise append-only. */
export function __resetPublicationsForTest(): void {
  PUBLISHED.length = 0;
}
