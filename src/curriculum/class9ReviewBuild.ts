// ===========================================================================
// v0.84.0-review.1 checkpoint 48 — WHAT THE CLASS 9 REVIEWER SAW.
//
// The existing REVIEW_BUILD is pinned to v0.66.0 and lists five files, none
// of which include the data displays, the authored student route or the
// review surface Class 9 reviewers will actually use. A reviewer answering
// "are the charts readable on a phone?" against that build would be judging
// a presentation the pin does not cover.
//
// So Class 9 gets its own pinned presentation surface. The point is not to
// hash the repository — a whitespace edit must not force 92 re-reviews. It
// is to invalidate RENDERED evidence when the rendering materially changes.
// Semantic and provenance judgements are unaffected by this pin; they have
// their own fingerprints.
// ===========================================================================

import { fnv1a } from './contentArtifact';

export type Class9ReviewBuild = {
  applicationVersion: string;
  reviewBuildId: string;
  presentationSurface: string[];
  runInstructions: string;
  /** Null until an immutable deployment exists. Never a mutable "latest". */
  immutableUrl: string | null;
  builtAt: string;
};

/**
 * Files whose change can materially alter what a Class 9 reviewer sees.
 * Listed explicitly so the set is auditable, rather than implied by a
 * directory hash.
 */
export const CLASS9_PRESENTATION_SURFACE = [
  // The renderer every lesson goes through.
  'src/features/learn/LearnSectionView.tsx',
  'src/features/learn/learnSectionContent.ts',
  // Representation added across Class 9.
  'src/features/learn/MathVisuals.tsx',
  'src/features/learn/DataDisplayFigure.tsx',
  'src/features/learn/PracticeItemView.tsx',
  // The surfaces a reviewer reaches the lesson through.
  'src/features/student/AuthoredLearn.tsx',
  'src/features/admin/ChapterReviewPreview.tsx',
  // Typography and theme, which decide readability at 360px.
  'tailwind.config.js',
  'src/index.css',
] as const;

export const CLASS9_REVIEW_BUILD: Class9ReviewBuild = {
  applicationVersion: '0.84.0-review.1',
  reviewBuildId: `C9RB-${fnv1a(
    ['0.84.0-review.1', ...CLASS9_PRESENTATION_SURFACE].join('|')
  ).slice(0, 8).toUpperCase()}`,
  presentationSurface: [...CLASS9_PRESENTATION_SURFACE],
  runInstructions:
    'Extract the packaged review source, run `npm ci`, create .env.local containing VITE_ENABLE_AUTHORED_LEARN_PREVIEW=true, then `npm run build` and `npm run preview`. Review the lessons in that build, not in a later one.',
  immutableUrl: null,
  builtAt: '2026-10-14',
};
