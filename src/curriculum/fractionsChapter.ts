// v0.67 — THE FRACTIONS CHAPTER REGISTRY.
//
// All nine official sections in textbook order. Eight are authored
// against the reusable schema; §7.4 is projected read-only from its
// frozen artifact so chapter tooling can treat all nine uniformly
// WITHOUT changing the serialisation its fingerprint depends on.

import type { AuthoredSection } from './authoredSection';
import { SECTION_7_1, SECTION_7_2, SECTION_7_3, SECTION_7_5 } from './fractionsSectionsA';
import { SECTION_7_6, SECTION_7_7, SECTION_7_8, SECTION_7_9 } from './fractionsSectionsB';
import {
  DEMO_SECTION_SOURCE,
  DEMO_SECTION_STUDENT,
  DEMO_SECTION_TEACHER,
  DEMO_SECTION_VISUALS,
  V1_UNIT_INTERVAL_FOURTHS,
  V2_EQUIVALENCE,
  V3_BEYOND_ONE,
  V4_STRIPS,
} from './demonstrationSection';
import { SECTION_7_4_PRACTICE } from './fractionsPracticeItems';
import { SECTION_7_4_ARTIFACT_VERSION } from './contentArtifact';

/**
 * §7.4 in the authored shape — a PROJECTION, not a rewrite.
 *
 * Reading from the frozen objects rather than restructuring them means
 * the fingerprint of review candidate S74-v1-A1A3FF is untouched. The
 * cost is that a few fields (vocabulary, quickChecks) are thinner here
 * than in a natively authored section, because the original shape had
 * no place for them. That is honest: §7.4 was authored before the
 * schema existed, and inventing content to fill the gaps would change
 * what the educator is reviewing.
 */
export function section74AsAuthored(): AuthoredSection {
  return {
    contentArtifactId: 'ncert_gp_c6_s7_4_lesson',
    contentArtifactVersion: SECTION_7_4_ARTIFACT_VERSION,
    source: {
      officialChapterId: DEMO_SECTION_SOURCE.officialChapterId,
      officialSectionId: DEMO_SECTION_SOURCE.officialSectionId,
      sectionNumber: DEMO_SECTION_SOURCE.sectionNumber,
      exactTitle: DEMO_SECTION_SOURCE.exactTitle,
      startPage: DEMO_SECTION_SOURCE.startPage,
      textbook: DEMO_SECTION_SOURCE.textbook,
      sourceReference: DEMO_SECTION_SOURCE.sourceReference,
      inspectionDate: DEMO_SECTION_SOURCE.inspectionDate,
    },
    competencyCandidates: DEMO_SECTION_TEACHER.competencyMapping.map((c) => ({
      id: c.id,
      justification: c.justification,
    })),
    competencyMappingStatus: 'competency_proposed',
    sequence: {
      prerequisiteSectionIds: ['ncert_gp_c6_s7_1', 'ncert_gp_c6_s7_2', 'ncert_gp_c6_s7_3'],
      mayAssume: DEMO_SECTION_STUDENT.prerequisiteCheck.checks,
      mustNotIntroduce: [
        { concept: 'Mixed fractions', belongsToSection: 'ncert_gp_c6_s7_5' },
        { concept: 'Comparing unlike fractions', belongsToSection: 'ncert_gp_c6_s7_7' },
      ],
    },
    learningGoal: DEMO_SECTION_STUDENT.learningGoal,
    priorKnowledgeCheck: DEMO_SECTION_STUDENT.prerequisiteCheck,
    vocabulary: [],
    explanation: DEMO_SECTION_STUDENT.explanation,
    representations: DEMO_SECTION_STUDENT.representations,
    visuals: DEMO_SECTION_VISUALS,
    visualsById: {
      V1_UNIT_INTERVAL_FOURTHS,
      V2_EQUIVALENCE,
      V3_BEYOND_ONE,
      V4_STRIPS,
    },
    workedExamples: DEMO_SECTION_STUDENT.workedExamples.map((w) => ({
      id: w.id,
      prompt: w.prompt,
      steps: w.steps,
      answer: w.answer,
      ...(w.visualRef ? { visualRef: w.visualRef } : {}),
    })),
    misconceptionIds: DEMO_SECTION_STUDENT.misconceptions.map((m) => m.id),
    guidedPractice: DEMO_SECTION_STUDENT.guidedPractice.map((g, i) => ({
      id: `s74.g${i + 1}`,
      prompt: g.prompt,
      hint: g.hint,
      answer: g.answer,
      rationale: g.answer,
    })),
    independentPractice: DEMO_SECTION_STUDENT.independentPractice.map((p, i) => ({
      id: `s74.i${i + 1}`,
      prompt: p.prompt,
      answer: p.answer,
      rationale: p.answer,
    })),
    reasoningApplication: DEMO_SECTION_STUDENT.reasoningApplication.map((r, i) => ({
      id: `s74.r${i + 1}`,
      prompt: r.prompt,
      expectedReasoning: r.expectedReasoning,
    })),
    interactivePractice: SECTION_7_4_PRACTICE,
    summary: DEMO_SECTION_STUDENT.summary,
    nextStep: DEMO_SECTION_STUDENT.nextStep,
    teacher: {
      objective: DEMO_SECTION_TEACHER.officialReference,
      prerequisiteKnowledge: DEMO_SECTION_TEACHER.prerequisiteKnowledge,
      modelLanguage: [],
      teachingNotes: DEMO_SECTION_TEACHER.teachingNotes,
      quickChecks: DEMO_SECTION_TEACHER.questioningPrompts,
      supportForStrugglingLearners:
        DEMO_SECTION_TEACHER.supportForStrugglingLearners,
      extension: DEMO_SECTION_TEACHER.extension,
      materialsNeeded: [],
    },
    reviewStatus: 'authored_draft',
  };
}

/** All nine, in the book's order. */
export function fractionsChapterSections(): AuthoredSection[] {
  return [
    SECTION_7_1,
    SECTION_7_2,
    SECTION_7_3,
    section74AsAuthored(),
    SECTION_7_5,
    SECTION_7_6,
    SECTION_7_7,
    SECTION_7_8,
    SECTION_7_9,
  ];
}

export function authoredSectionById(
  officialSectionId: string
): AuthoredSection | null {
  return (
    fractionsChapterSections().find(
      (s) => s.source.officialSectionId === officialSectionId
    ) ?? null
  );
}

export type ChapterCounts = {
  officialSections: number;
  authoredDrafts: number;
  educatorReviewed: number;
  published: number;
  workedExamples: number;
  guidedPracticeItems: number;
  independentPracticeItems: number;
  reasoningItems: number;
  interactiveItems: number;
  visuals: number;
  interactiveByFormat: Record<string, number>;
  visualsByType: Record<string, number>;
};

export function fractionsChapterCounts(): ChapterCounts {
  const secs = fractionsChapterSections();
  const byFormat: Record<string, number> = {};
  const byType: Record<string, number> = {};

  for (const s of secs) {
    for (const i of s.interactivePractice) {
      byFormat[i.format] = (byFormat[i.format] ?? 0) + 1;
    }
    for (const v of s.visuals) {
      byType[v.type] = (byType[v.type] ?? 0) + 1;
    }
  }

  const sum = (fn: (s: AuthoredSection) => number) =>
    secs.reduce((n, s) => n + fn(s), 0);

  return {
    officialSections: 9,
    authoredDrafts: secs.filter((s) => s.reviewStatus === 'authored_draft').length,
    educatorReviewed: secs.filter((s) => s.reviewStatus === 'educator_reviewed').length,
    published: secs.filter((s) => s.reviewStatus === 'published').length,
    workedExamples: sum((s) => s.workedExamples.length),
    guidedPracticeItems: sum((s) => s.guidedPractice.length),
    independentPracticeItems: sum((s) => s.independentPractice.length),
    reasoningItems: sum((s) => s.reasoningApplication.length),
    interactiveItems: sum((s) => s.interactivePractice.length),
    visuals: sum((s) => s.visuals.length),
    interactiveByFormat: byFormat,
    visualsByType: byType,
  };
}
