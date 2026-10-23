// v0.67 §4/§16 — THE REUSABLE INSTRUCTIONAL SECTION SCHEMA.
//
// §7.4 was authored as a one-off object shape. This generalises it so
// the other eight sections — and eventually other chapters — are
// authored against one model.
//
// A NOTE ON WHY §7.4 IS NOT MIGRATED INTO THIS FILE
//
// The frozen review candidate S74-v1-A1A3FF (HISTORICAL; current
// S74-v1-DFC56A) is identified by a
// fingerprint over its exact serialised content. Restructuring it into
// this schema would change that serialisation and therefore the
// fingerprint, invalidating a review that may already be underway.
// §7.4 keeps its original shape; `section74AsAuthored()` projects it
// into this model READ-ONLY so the chapter tooling can treat all nine
// uniformly. Migration belongs in a later version, as a deliberate new
// artifact version.
//
// QUALITY REQUIREMENTS, NOT A RIGID TEMPLATE
//
// Counts deliberately vary. §7.9 is a history section and needs no
// number-line interaction; §7.8 needs several worked examples because
// like and unlike denominators are different problems. The validators
// in `sectionValidators.ts` check that what exists is complete and
// correct, not that every section looks the same.

import type { DataSet, DataDisplaySpec } from './dataDisplaySpecification';
import type { VisualSpec } from './visualSpecification';
import type { InstructionalItem } from './instructionalInteraction';
import type { StagedCompetencyId } from './ncfStages';

/**
 * v0.84.0 checkpoint 41 — WHAT A LESSON IS SOURCED FROM.
 *
 * Until now every authored lesson came from a numbered official section,
 * and the schema said so. Chapter 9 of Part II prints no numbered headings
 * at all: its mathematics is real and verified, it simply has no section
 * numbers. The two options were to invent one or to let provenance say what
 * the lesson actually comes from.
 *
 * So provenance now names its KIND. Omitting `sourceKind` means
 * `official_section`, which is why none of the 94 existing artifacts
 * changed. A segment-backed lesson declares `source_segment`, names the
 * canonical Pragati source segments it is built from, and leaves
 * `officialSectionId` and `sectionNumber` empty — the validator requires
 * them empty, so a fabricated section id cannot slip in beside the
 * segments.
 *
 * This is general rather than a Chapter 9 field: any future chapter whose
 * instructional material is not carved into numbered sections takes the
 * same path.
 */
export type ArtifactSourceKind = 'official_section' | 'source_segment';

export type SectionSourceEvidence = {
  officialChapterId: string;
  /** Absent means 'official_section' — the path every prior lesson uses. */
  sourceKind?: ArtifactSourceKind;
  /** The official section, or '' for a segment-backed lesson. */
  officialSectionId: string;
  /**
   * Canonical Pragati source segments, for a segment-backed lesson only.
   * Never official section ids wearing a segment's name.
   */
  sourceSegmentIds?: string[];
  /**
   * How the source place is described where the chapter prints no section
   * number — e.g. 'pages 1-2 of the chapter'. Never a fabricated number.
   */
  sourceLabel?: string;
  /**
   * v0.84.0 checkpoint 33 — MERGED UNITS NEED BOTH SECTIONS NAMED.
   *
   * A lesson built from more than one official section used to record only
   * the first, so the second vanished from artifact provenance: the
   * decomposition knew §5.1 and §5.2 were merged, and the authored lesson
   * said §5.1. Any additional official sections the lesson covers are
   * listed here, and a merged lesson without them fails validation.
   */
  additionalOfficialSectionIds?: string[];
  sectionNumber: string;
  exactTitle: string;
  startPage: number;
  textbook: string;
  sourceReference: string;
  inspectionDate: string;
};

/** What a student must already know, and what must NOT appear yet. */
export type SequenceRules = {
  /** Sections whose content may be assumed. */
  prerequisiteSectionIds: string[];
  /** Concepts a student can be expected to have. */
  mayAssume: string[];
  /**
   * Concepts belonging to LATER sections. Authoring them here would
   * teach the chapter out of order — the defect §8 of the v0.61 spec
   * warned about, where an existing item bank tempts you to introduce
   * mixed numbers before §7.5.
   */
  mustNotIntroduce: Array<{ concept: string; belongsToSection: string }>;
};

export type WorkedExample = {
  id: string;
  prompt: string;
  steps: Array<{ text: string; reasoning: string }>;
  answer: string;
  visualRef?: string;
};

export type GuidedItem = {
  id: string;
  prompt: string;
  /** Guided practice always scaffolds. Without a hint it is just
   *  independent practice under another heading. */
  hint: string;
  answer: string;
  /** Why the answer is right — shown after the attempt. */
  rationale: string;
  visualRef?: string;
};

export type IndependentItem = {
  id: string;
  prompt: string;
  answer: string;
  rationale: string;
};

export type ReasoningItem = {
  id: string;
  prompt: string;
  expectedReasoning: string;
};

export type TeacherNotes = {
  objective: string;
  prerequisiteKnowledge: string[];
  modelLanguage: string[];
  teachingNotes: string[];
  quickChecks: string[];
  supportForStrugglingLearners: string[];
  extension: string[];
  materialsNeeded: string[];
};

export type SectionReviewStatus =
  | 'authored_draft'
  | 'educator_reviewed'
  | 'published';

/**
 * v0.84.0 checkpoint 43 — why an artifact moved past version 1.
 *
 * An authored artifact that has already passed alignment must not change
 * silently: a later reader needs to know the version they are looking at
 * is not the one that was audited, and why it changed. One entry per
 * version beyond the first.
 */
export type ArtifactRevision = {
  version: number;
  at: string;
  reason: string;
  changed: string[];
};

export type AuthoredSection = {
  // --- identity -----------------------------------------------------
  contentArtifactId: string;
  contentArtifactVersion: number;
  /** Present once the artifact has been revised past version 1. */
  revisionHistory?: ArtifactRevision[];
  source: SectionSourceEvidence;

  // --- curriculum ---------------------------------------------------
  /** Stage-qualified. Proposed by a maintainer, never asserted as
   *  reviewed — see `competencyMappingStatus`. */
  competencyCandidates: Array<{
    id: StagedCompetencyId;
    justification: string;
  }>;
  competencyMappingStatus: 'competency_mapping_pending' | 'competency_proposed';
  sequence: SequenceRules;

  // --- student content ----------------------------------------------
  learningGoal: string;
  priorKnowledgeCheck: { prompt: string; checks: string[]; ifNotReady: string };
  vocabulary: Array<{ term: string; meaning: string }>;
  explanation: string[];
  representations: string[];
  visuals: VisualSpec[];
  /**
   * v0.84.0 checkpoint 37 — datasets a lesson displays, by id.
   *
   * Displays reference these rather than carrying their own numbers, so
   * two displays compared in one lesson are provably the same data.
   */
  dataSets?: Record<string, DataSet>;
  dataDisplays?: DataDisplaySpec[];
  visualsById: Record<string, VisualSpec>;
  workedExamples: WorkedExample[];
  misconceptionIds: string[];
  guidedPractice: GuidedItem[];
  independentPractice: IndependentItem[];
  reasoningApplication: ReasoningItem[];
  /** Section-specific interactive practice, aligned by official ID. */
  interactivePractice: InstructionalItem[];
  summary: string;
  nextStep: string;

  // --- teacher ------------------------------------------------------
  teacher: TeacherNotes;

  // --- status -------------------------------------------------------
  reviewStatus: SectionReviewStatus;
};

/** Every authored section starts here and moves only on evidence. */
export const DEFAULT_REVIEW_STATUS: SectionReviewStatus = 'authored_draft';

/** v0.84.0 checkpoint 41 — provenance kind, defaulting to the legacy path. */
export function artifactSourceKind(source: SectionSourceEvidence): ArtifactSourceKind {
  return source.sourceKind ?? 'official_section';
}

/**
 * The id to quote when reporting on an artifact. Section-backed lessons
 * answer with their section, segment-backed ones with their segments, so
 * neither has to borrow the other's identity.
 */
export function artifactSourceId(source: SectionSourceEvidence): string {
  return artifactSourceKind(source) === 'source_segment'
    ? (source.sourceSegmentIds ?? []).join('+')
    : source.officialSectionId;
}
