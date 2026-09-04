// v0.67 §4/§16 — THE REUSABLE INSTRUCTIONAL SECTION SCHEMA.
//
// §7.4 was authored as a one-off object shape. This generalises it so
// the other eight sections — and eventually other chapters — are
// authored against one model.
//
// A NOTE ON WHY §7.4 IS NOT MIGRATED INTO THIS FILE
//
// The frozen review candidate S74-v1-A1A3FF is identified by a
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

import type { VisualSpec } from './visualSpecification';
import type { InstructionalItem } from './instructionalInteraction';
import type { StagedCompetencyId } from './ncfStages';

export type SectionSourceEvidence = {
  officialChapterId: string;
  officialSectionId: string;
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

export type AuthoredSection = {
  // --- identity -----------------------------------------------------
  contentArtifactId: string;
  contentArtifactVersion: number;
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
