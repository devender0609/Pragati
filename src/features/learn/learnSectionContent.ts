// ===========================================================================
// v0.84.0 checkpoint 35 — ONE MAPPING FROM AUTHORED SECTION TO LESSON.
//
// `ChapterReviewPreview` built this object inline, which meant the only way
// to render an authored lesson through the real student components was to
// render the reviewer screen around it. Checkpoint 34 left the per-lesson
// student walkthrough unverified partly for that reason.
//
// Extracting it changes no behaviour: the reviewer preview now calls this
// and so can a route harness, so what the harness exercises is the same
// object the product renders rather than a copy that can drift.
// ===========================================================================

import type { AuthoredSection } from '../../curriculum/authoredSection';
import type { LearnSectionContent } from './LearnSectionView';
import { misconceptionsForSection } from '../../curriculum/fractionsMisconceptions';
import { artifactSourceKind } from '../../curriculum/authoredSection';

export function learnContentFor(section: AuthoredSection): LearnSectionContent {
  // v0.84.0-rc.2 checkpoint 45 — SOURCE-KIND SAFETY.
  //
  // Checkpoint 41 added segment-backed lessons, whose `officialSectionId`
  // is deliberately empty. Looking misconceptions up by that empty string
  // would query a key no section owns, and printing it as a reference
  // would show the student " · " where a section number should be.
  //
  // So both are decided by source kind. The official-section path is
  // untouched; the segment path uses the chapter's own title, which is
  // what the book actually prints, and invents no section number.
  const segmentBacked = artifactSourceKind(section.source) === 'source_segment';
  const misconceptions = segmentBacked
    ? []
    : misconceptionsForSection(section.source.officialSectionId);
  return {
    officialReference: segmentBacked
      ? section.source.exactTitle
      : `${section.source.sectionNumber} · ${section.source.exactTitle}`,
    learningGoal: section.learningGoal,
    prerequisiteCheck: section.priorKnowledgeCheck,
    explanation: section.explanation,
    visuals: section.visuals,
    dataSets: section.dataSets,
    dataDisplays: section.dataDisplays,
    workedExamples: section.workedExamples,
    misconceptions: misconceptions.map((m) => ({
      id: m.id,
      misconception: m.description,
      studentFeedback: m.feedback,
    })),
    guidedPractice: section.guidedPractice,
    independentPractice: section.independentPractice,
    reasoningApplication: section.reasoningApplication,
    summary: section.summary,
    nextStep: section.nextStep,
  };
}

/** The locked student sequence, in order. */
export const STUDENT_LESSON_STAGES = [
  'Learn the idea',
  'See it',
  'Worked examples',
  'Try it',
  'Think deeper',
] as const;
