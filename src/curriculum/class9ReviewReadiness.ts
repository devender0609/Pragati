// ===========================================================================
// v0.84.0-review.1 checkpoint 48 — IS THIS LESSON READY FOR A PERSON?
//
// Review-ready means exactly one thing: a reviewer could begin without an
// engineer in the room. It does NOT mean reviewed, sent, or approved, and
// nothing here changes a lifecycle state.
//
// The ten checks below are the ones that, if missing, would stall a real
// reviewer — not a tidy-looking list.
// ===========================================================================

import { allAuthoredSections } from './authoredSections';
import { authoredLearnCatalogueForReview } from './authoredLearnCatalogue';
import {
  class9ReviewCandidates,
  questionsForArtifact,
  type ArtifactReviewCandidate,
} from './artifactReview';
import { CLASS9_REVIEW_BUILD } from './class9ReviewBuild';

export type ReadinessCheckId =
  | 'artifact_identity'
  | 'semantic_fingerprint'
  | 'provenance_fingerprint'
  | 'review_code'
  | 'question_set'
  | 'rendered_preview'
  | 'source_context'
  | 'submission_path'
  | 'import_path'
  | 'build_identity';

export type ArtifactReadiness = {
  contentArtifactId: string;
  reviewCode: string;
  ready: boolean;
  failed: ReadinessCheckId[];
  /** Unchanged by readiness. Freezing a candidate reviews nothing. */
  lifecycleStatus: string;
};

export function class9ReviewReadiness(): ArtifactReadiness[] {
  const candidates = class9ReviewCandidates(CLASS9_REVIEW_BUILD.reviewBuildId);
  const sections = new Map(allAuthoredSections().map((s) => [s.contentArtifactId, s] as const));
  const catalogue = authoredLearnCatalogueForReview('class9');
  const codes = new Map<string, number>();
  for (const c of candidates) codes.set(c.reviewCode, (codes.get(c.reviewCode) ?? 0) + 1);

  return candidates.map((c) => {
    const section = sections.get(c.contentArtifactId);
    const failed: ReadinessCheckId[] = [];

    if (!section || !c.contentArtifactId || c.contentArtifactVersion < 1) failed.push('artifact_identity');
    if (!/^[0-9a-f]{8,}$/.test(c.semanticFingerprint)) failed.push('semantic_fingerprint');
    if (!/^[0-9a-f]{8,}$/.test(c.provenanceFingerprint)) failed.push('provenance_fingerprint');
    // A code must exist and belong to exactly one candidate.
    if (!c.reviewCode || (codes.get(c.reviewCode) ?? 0) !== 1) failed.push('review_code');
    if (section && questionsForArtifact(section).length < 10) failed.push('question_set');
    // Rendered preview: the lesson must be reachable in the review catalogue
    // through the same renderer the product uses.
    if (!catalogue.chapters.some((ch) => ch.lessons.some((l) => l.contentArtifactId === c.contentArtifactId))) {
      failed.push('rendered_preview');
    }
    if (!c.sourceDescription || c.sourceDescription.length < 30) failed.push('source_context');
    // Submission and import exist as a schema and a validator the reviewer's
    // response will be checked against.
    if (c.questions.length === 0) failed.push('submission_path');
    if (!c.instrumentVersion) failed.push('import_path');
    if (!c.reviewBuildId) failed.push('build_identity');

    return {
      contentArtifactId: c.contentArtifactId,
      reviewCode: c.reviewCode,
      ready: failed.length === 0,
      failed,
      lifecycleStatus: c.lifecycleStatus,
    };
  });
}

export type ChapterReviewPackage = {
  officialChapterId: string;
  chapterNumber: number;
  chapterTitle: string;
  lessonCount: number;
  lessons: Array<{
    position: number;
    lessonTitle: string;
    reviewCode: string;
    contentArtifactId: string;
    contentArtifactVersion: number;
    sourceDescription: string;
    questionCount: number;
    ready: boolean;
    status: string;
  }>;
};

/**
 * Chapter-level indexes, so a reviewer can work a chapter at a time rather
 * than through 92 loose files. The response itself stays artifact-scoped.
 */
export function class9ChapterReviewPackages(): ChapterReviewPackage[] {
  const candidates = class9ReviewCandidates(CLASS9_REVIEW_BUILD.reviewBuildId);
  const readiness = new Map(class9ReviewReadiness().map((r) => [r.contentArtifactId, r] as const));
  const catalogue = authoredLearnCatalogueForReview('class9');

  return catalogue.chapters.map((ch) => {
    const lessons = ch.lessons.map((l) => {
      const c = candidates.find((x) => x.contentArtifactId === l.contentArtifactId)!;
      return {
        position: l.position,
        lessonTitle: l.title,
        reviewCode: c.reviewCode,
        contentArtifactId: c.contentArtifactId,
        contentArtifactVersion: c.contentArtifactVersion,
        sourceDescription: c.sourceDescription,
        questionCount: c.questionCount,
        ready: readiness.get(l.contentArtifactId)?.ready ?? false,
        status: c.lifecycleStatus,
      };
    });
    return {
      officialChapterId: ch.officialChapterId,
      chapterNumber: ch.number,
      chapterTitle: ch.title,
      lessonCount: lessons.length,
      lessons,
    };
  });
}

/**
 * The recommended order to send chapters for review, by where a defect
 * would be most costly to find late. Risk is read from the artifacts, not
 * asserted: a chapter scores for novel mathematics with no prior-class
 * counterpart, for claim-heavy reasoning, for unusual provenance, and for
 * representation the reviewer must judge visually.
 */
export function class9ReviewRiskOrder(): Array<{ chapterNumber: number; title: string; score: number; why: string[] }> {
  const NOVEL = new Set([7, 11]);          // no Class 8 counterpart
  const UNUSUAL_PROVENANCE = new Set([9, 3]); // segment-backed; contextual merge
  const REPRESENTATION = new Set([10, 5, 6, 12, 14, 1]);

  return class9ChapterReviewPackages()
    .map((ch) => {
      const why: string[] = [];
      let score = 0;
      if (NOVEL.has(ch.chapterNumber)) { score += 3; why.push('new mathematics with no prior-class counterpart'); }
      if (UNUSUAL_PROVENANCE.has(ch.chapterNumber)) { score += 2; why.push('unusual provenance a reviewer must check'); }
      if (REPRESENTATION.has(ch.chapterNumber)) { score += 1; why.push('representation the reviewer judges visually'); }
      if (ch.lessons.some((l) => l.contentArtifactVersion > 1)) { score += 1; why.push('contains a revised artifact'); }
      if (why.length === 0) why.push('ordinary production chapter');
      return { chapterNumber: ch.chapterNumber, title: ch.chapterTitle, score, why };
    })
    .sort((a, b) => b.score - a.score || a.chapterNumber - b.chapterNumber);
}

/**
 * A pilot batch to test the instrument and the import path before asking
 * anyone to review 92. Deliberately risk-diverse rather than simply the
 * riskiest: the point is to exercise every kind of artifact once.
 */
export function class9PilotBatch(): ArtifactReviewCandidate[] {
  const candidates = class9ReviewCandidates(CLASS9_REVIEW_BUILD.reviewBuildId);
  const pick = (id: string) => candidates.find((c) => c.contentArtifactId === id);
  return [
    'ncert_iemh1_s7_2_theoretical_lesson',   // probability: the equiprobability claim
    'ncert_iemh2_s11_3_euclid_lesson',       // algorithms: the efficiency claim
    'ncert_iemh2_ch09_seg1_lesson',          // segment-backed provenance
    'ncert_iemh1_s3_2_lesson',               // contextual merge, version 2
    'ncert_iemh1_s5_6_lesson',               // circle geometry and proof
    'ncert_iemh2_s10_2_choose_lesson',       // data display comparison
    'ncert_iemh2_s14_1_lesson',              // solids through planar representation
    'ncert_iemh1_s3_5_proof_lesson',         // contradiction proof
  ]
    .map(pick)
    .filter((c): c is ArtifactReviewCandidate => !!c);
}
