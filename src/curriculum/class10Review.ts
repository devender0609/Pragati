// ===========================================================================
// v0.84.0-c10.16 checkpoint 70 — CLASS 10 REVIEW READINESS.
//
// Class 9's review architecture was already artifact-level: identity from
// `contentArtifactId` plus version plus semantic fingerprint, never the
// section number. Class 10 needs that more, not less — it has split
// sections, proof and application units inside one section, and a
// contextual record (§1.1) that is deliberately not a lesson.
//
// So nothing is forked. `artifactReview.ts` became grade-aware, Class 9
// calls it with its own prefix and instrument and gets byte-identical codes,
// and this module supplies the Class 10 half: its presentation surface, its
// instrument version, the adaptive questions its mathematics needs, and the
// readiness checks.
//
// Freezing a candidate reviews nothing. Every artifact stays
// `authored_draft`, and the lifecycle stays 0/0/0/0.
// ===========================================================================

import {
  artifactProvenanceFingerprint, artifactSemanticFingerprint,
  artifactReviewCodeFor, reviewCandidatesForGrade,
  type ArtifactReviewCandidate, type ArtifactReviewQuestion,
} from './artifactReview';
import type { AuthoredSection } from './authoredSection';
import { allAuthoredSections } from './authoredSections';
import { authoredLearnCatalogueForReview } from './authoredLearnCatalogue';
import { fnv1a } from './contentArtifact';

export const CLASS10_INSTRUMENT_VERSION = 1;
export const SOURCE_PROVENANCE_VERSION_C10 = 1;
export const CLASS10_GRADE_PREFIX = 'C10';

/**
 * Files whose change can materially alter what a Class 10 reviewer sees.
 * Listed explicitly rather than hashed by directory, so the set is
 * auditable — and it is larger than Class 9's because Class 10 added seven
 * renderers of its own.
 */
export const CLASS10_PRESENTATION_SURFACE = [
  // The renderer every lesson goes through.
  'src/features/learn/LearnSectionView.tsx',
  'src/features/learn/learnSectionContent.ts',
  // Representation inherited from Class 9.
  'src/features/learn/MathVisuals.tsx',
  'src/features/learn/DataDisplayFigure.tsx',
  'src/features/learn/PracticeItemView.tsx',
  // Representation added across the Class 10 waves.
  'src/features/learn/GroupedTableFigure.tsx',
  'src/features/learn/LinearSystemGraph.tsx',
  'src/features/learn/PolynomialGraph.tsx',
  'src/features/learn/CompositeSolidFigure.tsx',
  // The surfaces a reviewer reaches the lesson through.
  'src/features/student/AuthoredLearn.tsx',
  'src/features/admin/ChapterReviewPreview.tsx',
  // Typography and theme, which decide readability at 360px.
  'tailwind.config.js',
  'src/index.css',
] as const;

export type Class10ReviewBuild = {
  applicationVersion: string;
  reviewBuildId: string;
  presentationSurface: string[];
  runInstructions: string;
  /** Null until an immutable deployment exists. Never a mutable "latest". */
  immutableUrl: string | null;
  builtAt: string;
};

export const CLASS10_REVIEW_BUILD: Class10ReviewBuild = {
  applicationVersion: '0.84.0-c10.16',
  reviewBuildId: `C10RB-${fnv1a(
    ['0.84.0-c10.16', ...CLASS10_PRESENTATION_SURFACE].join('|')
  ).slice(0, 8).toUpperCase()}`,
  presentationSurface: [...CLASS10_PRESENTATION_SURFACE],
  runInstructions:
    'Extract the packaged review source, run `npm ci`, create .env.local containing VITE_ENABLE_AUTHORED_LEARN_PREVIEW=true, then `npm run build` and `npm run preview`. Review the lessons in that build, not in a later one.',
  immutableUrl: null,
  builtAt: '2026-10-23',
};

// ---------------------------------------------------------------------------
// The Class 10 instrument: the shared core, plus what this lesson needs.
// ---------------------------------------------------------------------------

const CORE_C10: ArtifactReviewQuestion[] = [
  { id: 'M1', area: 'mathematics', prompt: 'Is every mathematical statement in this lesson correct?', appliesBecause: 'Asked of every lesson.', presentationDependent: false },
  { id: 'M2', area: 'mathematics', prompt: 'Does each worked example\u2019s reasoning justify its step, rather than restating it?', appliesBecause: 'Asked of every lesson.', presentationDependent: false },
  { id: 'M3', area: 'mathematics', prompt: 'Are the answers and the feedback given to students mathematically right?', appliesBecause: 'Asked of every lesson.', presentationDependent: false },
  { id: 'S1', area: 'source_fidelity', prompt: 'Does the lesson stay inside what the current NCERT section teaches, without importing material the 2026-27 edition removed?', appliesBecause: 'Asked of every lesson.', presentationDependent: false },
  { id: 'S2', area: 'source_fidelity', prompt: 'Does the lesson respect the depth the CBSE 2026-27 curriculum sets for this section \u2014 neither less nor more?', appliesBecause: 'Asked of every lesson.', presentationDependent: false },
  { id: 'I1', area: 'instruction', prompt: 'Would a Class 10 student following this lesson understand the idea?', appliesBecause: 'Asked of every lesson.', presentationDependent: false },
  { id: 'I2', area: 'instruction', prompt: 'Does it build on what comes before and prepare what comes after, without treating prior knowledge as new?', appliesBecause: 'Asked of every lesson.', presentationDependent: false },
  { id: 'I3', area: 'instruction', prompt: 'Is the practice worth doing \u2014 does it test the idea rather than the arithmetic alone?', appliesBecause: 'Asked of every lesson.', presentationDependent: false },
  { id: 'I4', area: 'instruction', prompt: 'Does the Think deeper task ask for reasoning a strong student could not answer by recall?', appliesBecause: 'Asked of every lesson.', presentationDependent: false },
  { id: 'T1', area: 'teacher_material', prompt: 'Are the teacher notes accurate and genuinely useful to someone teaching this?', appliesBecause: 'Asked of every lesson.', presentationDependent: false },
];

/** Which adaptive question sets apply, decided from the artifact's content. */
type Rule = {
  id: string;
  applies: (s: AuthoredSection) => boolean;
  questions: ArtifactReviewQuestion[];
};

const text = (s: AuthoredSection) =>
  [s.learningGoal, s.summary, ...s.explanation,
   ...s.workedExamples.flatMap((w) => [w.prompt, w.answer, ...w.steps.map((x) => `${x.text} ${x.reasoning}`)]),
   ...s.guidedPractice.map((g) => `${g.prompt} ${g.answer} ${g.rationale}`),
   ...s.independentPractice.map((p) => `${p.prompt} ${p.answer} ${p.rationale}`),
   ...s.reasoningApplication.map((r) => `${r.prompt} ${r.expectedReasoning}`)].join(' ');

const q = (id: string, area: ArtifactReviewQuestion['area'], prompt: string, because: string, pres = false): ArtifactReviewQuestion =>
  ({ id, area, prompt, appliesBecause: because, presentationDependent: pres });

export const CLASS10_ADAPTIVE_RULES: Rule[] = [
  {
    id: 'proof',
    applies: (s) => /GIVEN/.test(text(s)) && /TO PROVE/.test(text(s)),
    questions: [
      q('P1', 'mathematics', 'Is the proof logically complete \u2014 does every step follow from what precedes it?', 'This lesson carries a proof with stated hypotheses.'),
      q('P2', 'mathematics', 'Are the hypotheses used, and is nothing assumed that the proof is supposed to establish?', 'This lesson carries a proof with stated hypotheses.'),
      q('P3', 'source_fidelity', 'Does the proof reach the depth this section requires, rather than a sketch or an observation?', 'This unit\u2019s recorded proof expectation is PROVE.'),
    ],
  },
  {
    id: 'state_without_proof',
    applies: (s) => /stated without proof|without proof|not proved here/i.test(text(s)),
    questions: [
      q('W1', 'source_fidelity', 'The current curriculum states this result without proving it. Does the lesson respect that, rather than quietly turning into a proof lesson?', 'This lesson handles a result the current scope states without proof.'),
    ],
  },
  {
    id: 'trigonometry',
    applies: (s) => /\bsin\b|\bcos\b|\btan\b|trigonometric/i.test(text(s)),
    questions: [
      q('G1', 'mathematics', 'Are the ratio values, the angles they belong to, and any claim about a ratio being undefined all correct?', 'This lesson works with trigonometric ratios.'),
      q('G2', 'mathematics', 'Where a quantity is not defined, is it described as having no value rather than an infinite one?', 'This lesson works with trigonometric ratios.'),
    ],
  },
  {
    id: 'grouped_statistics',
    applies: (s) => /class mark|grouped|assumed mean|step[- ]deviation|modal class|median class/i.test(text(s)),
    questions: [
      q('D1', 'mathematics', 'Do the different methods shown give the same answer on the same data, and is the table\u2019s arithmetic right?', 'This lesson uses grouped data.', true),
    ],
  },
  {
    id: 'linear_system',
    applies: (s) => /pair of linear equations|intersecting|coincident|parallel lines/i.test(text(s)),
    questions: [
      q('L1', 'mathematics', 'Does the graph shown describe the same system the algebra classifies?', 'This lesson compares a graph with an algebraic classification.', true),
    ],
  },
  {
    id: 'polynomial_graph',
    applies: (s) => /x-intercept|zeroes of|zero of the polynomial/i.test(text(s)),
    questions: [
      q('Z1', 'mathematics', 'Do the zeroes stated and the points where the curve meets the x-axis agree?', 'This lesson relates zeroes to a graph.', true),
      q('Z2', 'mathematics', 'Is the y-intercept kept distinct from the zeroes?', 'This lesson relates zeroes to a graph.'),
    ],
  },
  {
    id: 'probability',
    applies: (s) => /equally likely|sample space|favourable outcome/i.test(text(s)),
    questions: [
      q('B1', 'mathematics', 'Is the equal-likelihood assumption established before favourable-over-total is used, rather than inferred from the number of outcomes?', 'This lesson computes probabilities.'),
      q('B2', 'mathematics', 'Are the elementary outcomes as fine as the experiment actually distinguishes?', 'This lesson computes probabilities.'),
    ],
  },
  {
    id: 'composite_solid',
    applies: (s) => /composite|joined|hemisphere|frustum|surface area of the combination/i.test(text(s)),
    questions: [
      q('C1', 'mathematics', 'Are the internal joined faces excluded from the exposed surface, and the exposed ones all counted once?', 'This lesson measures a composite solid.', true),
    ],
  },
  {
    id: 'coordinate',
    applies: (s) => /section formula|internal division|distance formula|midpoint/i.test(text(s)),
    questions: [
      q('K1', 'mathematics', 'Do the ratio weights fall on the endpoints the stated ratio requires, and does the computed point lie where it should?', 'This lesson uses coordinate formulas.'),
    ],
  },
  {
    id: 'circle_region',
    applies: (s) => /segment|sector|arc length|central angle/i.test(text(s)),
    questions: [
      q('R1', 'mathematics', 'Is the region named the one actually measured \u2014 sector, segment or triangle \u2014 and is any subtraction between them the right way round?', 'This lesson measures parts of a circle.', true),
    ],
  },
  {
    id: 'figures',
    applies: (s) => (s.visuals ?? []).length > 0,
    questions: [
      q('V1', 'presentation', 'Does each figure show the mathematics correctly, with nothing in it that would mislead?', 'This lesson contains figures.', true),
      q('V2', 'presentation', 'Are the figures readable on a phone, with labels large enough to use?', 'This lesson contains figures.', true),
    ],
  },
  {
    id: 'feedback',
    applies: (s) => s.guidedPractice.some((g) => (g.rationale ?? '').trim().length > 0),
    questions: [
      q('X1', 'misconceptions', 'Where a student goes wrong, does the feedback point at the mathematical mistake rather than merely marking it wrong?', 'This lesson gives feedback on guided practice.'),
    ],
  },
];

export function questionsForClass10Artifact(s: AuthoredSection): ArtifactReviewQuestion[] {
  const qs = [...CORE_C10];
  for (const rule of CLASS10_ADAPTIVE_RULES) {
    if (rule.applies(s)) qs.push(...rule.questions);
  }
  return qs;
}

export function adaptiveRulesApplying(s: AuthoredSection): string[] {
  return CLASS10_ADAPTIVE_RULES.filter((r) => r.applies(s)).map((r) => r.id);
}

// ---------------------------------------------------------------------------
// Candidates, readiness, chapter packages.
// ---------------------------------------------------------------------------

export function class10ReviewCandidates(
  reviewBuildId: string = CLASS10_REVIEW_BUILD.reviewBuildId
): ArtifactReviewCandidate[] {
  return reviewCandidatesForGrade({
    grade: 'class10',
    chapterIdPrefix: 'ncert_jemh',
    gradePrefix: CLASS10_GRADE_PREFIX,
    instrumentVersion: CLASS10_INSTRUMENT_VERSION,
    provenanceVersion: SOURCE_PROVENANCE_VERSION_C10,
    reviewBuildId,
    questions: questionsForClass10Artifact,
  });
}

export type ReadinessCheckId =
  | 'artifact_identity'
  | 'semantic_fingerprint'
  | 'provenance_fingerprint'
  | 'review_code'
  | 'question_set'
  | 'review_build'
  | 'rendered_preview'
  | 'source_context'
  | 'response_export'
  | 'response_import';

export const CLASS10_READINESS_CHECKS: ReadinessCheckId[] = [
  'artifact_identity', 'semantic_fingerprint', 'provenance_fingerprint',
  'review_code', 'question_set', 'review_build', 'rendered_preview',
  'source_context', 'response_export', 'response_import',
];

export type ArtifactReadiness = {
  reviewCode: string;
  contentArtifactId: string;
  chapterNumber: number;
  passed: ReadinessCheckId[];
  failed: ReadinessCheckId[];
  reviewReady: boolean;
};

export function class10ReviewReadiness(): ArtifactReadiness[] {
  const candidates = class10ReviewCandidates();
  const authored = new Map(
    allAuthoredSections()
      .filter((s) => s.source.officialChapterId.startsWith('ncert_jemh'))
      .map((s) => [s.contentArtifactId, s] as const)
  );
  return candidates.map((c) => {
    const s = authored.get(c.contentArtifactId);
    const passed: ReadinessCheckId[] = [];
    const failed: ReadinessCheckId[] = [];
    const check = (id: ReadinessCheckId, ok: boolean) => (ok ? passed : failed).push(id);
    check('artifact_identity', !!s && c.contentArtifactVersion === s.contentArtifactVersion);
    check('semantic_fingerprint', !!s && c.semanticFingerprint === artifactSemanticFingerprint(s));
    check('provenance_fingerprint', !!s && c.provenanceFingerprint === artifactProvenanceFingerprint(s));
    check('review_code', c.reviewCode.startsWith(`${CLASS10_GRADE_PREFIX}-`) && c.reviewCode.length > 12);
    check('question_set', c.questionCount >= CORE_C10.length && c.questions.length === c.questionCount);
    check('review_build', c.reviewBuildId === CLASS10_REVIEW_BUILD.reviewBuildId);
    check('rendered_preview', !!s && s.explanation.length > 0 && s.workedExamples.length > 0);
    check('source_context', c.sourceDescription.length > 0 && c.chapterNumber > 0);
    check('response_export', c.reviewCode.length > 0 && c.instrumentVersion === CLASS10_INSTRUMENT_VERSION);
    check('response_import', c.semanticFingerprint.length > 0 && c.provenanceFingerprint.length > 0);
    return {
      reviewCode: c.reviewCode,
      contentArtifactId: c.contentArtifactId,
      chapterNumber: c.chapterNumber,
      passed, failed,
      reviewReady: failed.length === 0,
    };
  });
}

export type ChapterReviewPackage = {
  chapterNumber: number;
  chapterTitle: string;
  lessonCount: number;
  lessons: Array<{
    reviewCode: string;
    lessonTitle: string;
    contentArtifactVersion: number;
    sourceDescription: string;
    questionCount: number;
    adaptiveRules: string[];
    lifecycleStatus: string;
  }>;
};

export function class10ChapterReviewPackages(): ChapterReviewPackage[] {
  const candidates = class10ReviewCandidates();
  const authored = new Map(
    allAuthoredSections().map((s) => [s.contentArtifactId, s] as const)
  );
  const byChapter = new Map<number, ArtifactReviewCandidate[]>();
  for (const c of candidates) {
    const list = byChapter.get(c.chapterNumber) ?? [];
    list.push(c);
    byChapter.set(c.chapterNumber, list);
  }
  return [...byChapter.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([chapterNumber, list]) => ({
      chapterNumber,
      chapterTitle: list[0].chapterTitle,
      lessonCount: list.length,
      lessons: list.map((c) => ({
        reviewCode: c.reviewCode,
        lessonTitle: c.lessonTitle,
        contentArtifactVersion: c.contentArtifactVersion,
        sourceDescription: c.sourceDescription,
        questionCount: c.questionCount,
        adaptiveRules: adaptiveRulesApplying(authored.get(c.contentArtifactId)!),
        lifecycleStatus: c.lifecycleStatus,
      })),
    }));
}

/**
 * A risk-diverse pilot. Chosen to exercise the machinery across different
 * mathematics rather than to collect the hardest lessons, and deliberately
 * spread across chapters.
 */
export const CLASS10_PILOT_TARGETS: Array<{ artifactId: string; why: string }> = [
  { artifactId: 'ncert_jemh1_s8_3_boundary_angles_lesson', why: 'boundary-angle values and undefined ratios' },
  { artifactId: 'ncert_jemh1_s8_4_pythagorean_identity_lesson', why: 'a PROVE unit with two derived identities' },
  { artifactId: 'ncert_jemh1_s13_2_assumed_mean_lesson', why: 'grouped statistics with methods that must agree' },
  { artifactId: 'ncert_jemh1_s3_2_graphical_lesson', why: 'graph and algebra must classify the same system' },
  { artifactId: 'ncert_jemh1_s2_2_counting_zeroes_lesson', why: 'zeroes against x-intercepts, including the repeated case' },
  { artifactId: 'ncert_jemh1_s14_1_classical_definition_lesson', why: 'the equal-likelihood assumption' },
  { artifactId: 'ncert_jemh1_s10_3_equal_tangents_lesson', why: 'a tangent proof depending on an earlier theorem' },
  { artifactId: 'ncert_jemh1_s11_1_segment_lesson', why: 'a region derived by subtraction' },
  { artifactId: 'ncert_jemh1_s7_3_section_formula_lesson', why: 'section weights and exact coordinates' },
  { artifactId: 'ncert_jemh1_s6_4_aaa_lesson', why: 'similarity criteria stated without proof' },
];

export function class10PilotBatch(): ArtifactReviewCandidate[] {
  const byId = new Map(class10ReviewCandidates().map((c) => [c.contentArtifactId, c] as const));
  return CLASS10_PILOT_TARGETS
    .map((t) => byId.get(t.artifactId))
    .filter((c): c is ArtifactReviewCandidate => !!c);
}

/** What a reviewer is asked to do, in total. */
export function class10InstrumentLoad(): {
  coreQuestions: number;
  artifacts: number;
  totalResponses: number;
  averagePerArtifact: number;
  maxPerArtifact: number;
  minPerArtifact: number;
} {
  const cs = class10ReviewCandidates();
  const counts = cs.map((c) => c.questionCount);
  const total = counts.reduce((a, b) => a + b, 0);
  return {
    coreQuestions: CORE_C10.length,
    artifacts: cs.length,
    totalResponses: total,
    averagePerArtifact: Math.round((total / cs.length) * 10) / 10,
    maxPerArtifact: Math.max(...counts),
    minPerArtifact: Math.min(...counts),
  };
}

/** The catalogue is the route surface; readiness must agree with it. */
export function class10RouteCount(): number {
  return authoredLearnCatalogueForReview('class10').lessonCount;
}

export { artifactReviewCodeFor };
