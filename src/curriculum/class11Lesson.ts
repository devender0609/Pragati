// ===========================================================================
// v0.84.0-c11.9 checkpoint 80 — the shared Class 11 lesson constructor.
//
// Checkpoint 79 wrote this inside the Sets module. Chapter 3 needs the same
// scaffolding, so it moves here rather than being copied: one place that
// knows how a Class 11 lesson is assembled, for every chapter that follows.
// ===========================================================================

import type { AuthoredSection } from './authoredSection';

export type TeacherArgs = [string, string[], string[], string[], string[], string[], string[]];

export const teacher = (
  objective: string, prerequisiteKnowledge: string[], modelLanguage: string[],
  teachingNotes: string[], quickChecks: string[],
  supportForStrugglingLearners: string[], extension: string[]
) => ({
  objective, prerequisiteKnowledge, modelLanguage, teachingNotes, quickChecks,
  supportForStrugglingLearners, extension, materialsNeeded: [] as string[],
});

export const lessonBase = {
  contentArtifactVersion: 1 as const,
  competencyCandidates: [], competencyMappingStatus: 'competency_mapping_pending' as const,
  visuals: [], visualsById: {}, misconceptionIds: [], interactivePractice: [],
  reviewStatus: 'authored_draft' as const,
};

export type SourceFactory = (sec: string, title: string, page: number) => AuthoredSection['source'];

export type L = {
  id: string; sec: string; title: string; page: number; goal: string;
  checks: string[]; ifNot: string; vocab: Array<[string, string]>;
  expl: string[]; rep: string[]; visuals?: Array<Record<string, unknown>>;
  we: Array<{ id: string; prompt: string; steps: Array<[string, string]>; answer: string }>;
  g: Array<{ id: string; prompt: string; hint: string; answer: string; why: string }>;
  i: Array<{ id: string; prompt: string; answer: string; why: string }>;
  td: Array<{ id: string; prompt: string; reasoning: string }>;
  summary: string; next: string; prereq?: string[]; assume: string[];
  fragmentId?: string; cbseEntry?: string;
  notIntroduce?: Array<[string, string]>; t: Parameters<typeof teacher>;
};
export const makeLesson = (
  l: L,
  source: SourceFactory,
  fragmentSource?: (sec: string, title: string, page: number, fragmentId: string) => AuthoredSection['source'],
  cbseSource?: (title: string, page: number, entry: string) => AuthoredSection['source']
): AuthoredSection => ({
  ...lessonBase,
  contentArtifactId: l.id,
  source: l.cbseEntry && cbseSource ? cbseSource(l.title, l.page, l.cbseEntry)
    : l.fragmentId && fragmentSource ? fragmentSource(l.sec, l.title, l.page, l.fragmentId)
    : source(l.sec, l.title, l.page),
  sequence: {
    prerequisiteSectionIds: l.prereq ?? [],
    mayAssume: l.assume,
    mustNotIntroduce: (l.notIntroduce ?? []).map(([concept, belongsToSection]) => ({ concept, belongsToSection })),
  },
  learningGoal: l.goal,
  priorKnowledgeCheck: { prompt: 'Before you start, check that you can:', checks: l.checks, ifNotReady: l.ifNot },
  vocabulary: l.vocab.map(([term, meaning]) => ({ term, meaning })),
  explanation: l.expl,
  representations: l.rep,
  visuals: (l.visuals ?? []) as unknown as AuthoredSection['visuals'],
  visualsById: Object.fromEntries((l.visuals ?? []).map((v) => [v.id, v])) as unknown as AuthoredSection['visualsById'],
  workedExamples: l.we.map((w) => ({ id: w.id, prompt: w.prompt, answer: w.answer,
    steps: w.steps.map(([text, reasoning]) => ({ text, reasoning })) })),
  guidedPractice: l.g.map((x) => ({ id: x.id, prompt: x.prompt, hint: x.hint, answer: x.answer, rationale: x.why })),
  independentPractice: l.i.map((x) => ({ id: x.id, prompt: x.prompt, answer: x.answer, rationale: x.why })),
  reasoningApplication: l.td.map((x) => ({ id: x.id, prompt: x.prompt, expectedReasoning: x.reasoning })),
  summary: l.summary, nextStep: l.next, teacher: teacher(...l.t),
});

