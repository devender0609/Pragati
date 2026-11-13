// v0.66 §3/§4 — WHAT THE REVIEWER CAN SEE AND TOUCH.
//
// TWO IDENTITIES, NOT ONE
//
// The semantic fingerprint (contentArtifact.ts) covers the mathematics
// and instructional content. It deliberately excludes styling — a CSS
// change must not invalidate a review of whether 3/4 is correct.
//
// But Package B also asks questions that a semantic fingerprint cannot
// possibly cover:
//
//   V5 — "Can you read the labels on a phone?"
//   P1-P4 — the interactive practice behaviour
//
// Those are judgements about the RENDERED experience. If the number-line
// component or its label sizes change, that evidence is stale even
// though every word of content is identical. v0.61 raised those labels
// from 12px to 19px precisely because they were unreadable at 390px —
// a review conducted before that change would have been answering a
// different question.
//
// So the review build is pinned separately, and the reviewer README
// tells the educator how to run THAT build rather than "latest".
//
// SCOPE: the components that render the review experience, plus the
// application version. Not the whole repository — the goal is that a
// materially different rendering invalidates presentation evidence, not
// that every whitespace edit forces re-review.

export type ReviewBuild = {
  applicationVersion: string;
  reviewBuildId: string;
  /** Files whose change can materially alter what the reviewer sees. */
  presentationSurface: string[];
  /** How the educator opens exactly this build. */
  runInstructions: string;
  /** Set when a deployment exists; null means run locally from the
   *  pinned package. Recorded honestly rather than pointing at a
   *  mutable "latest" URL. */
  immutableUrl: string | null;
  builtAt: string;
};

/**
 * The presentation surface for §7.4.
 *
 * Listed explicitly so the set is auditable and reviewable, rather than
 * being an implicit consequence of a directory hash.
 */
export const REVIEW_PRESENTATION_SURFACE = [
  'src/features/learn/MathVisuals.tsx',
  'src/features/learn/LearnSectionView.tsx',
  'src/features/learn/PracticeItemView.tsx',
  'src/features/admin/DemonstrationSectionPreview.tsx',
  'tailwind.config.js',
] as const;

export const REVIEW_BUILD: ReviewBuild = {
  applicationVersion: '0.66.0',
  // Pinned to the packaged release. The educator runs this exact
  // artifact; there is no deployment that could change beneath them.
  reviewBuildId: 'pragati-v0.66.0-review-candidate',
  presentationSurface: [...REVIEW_PRESENTATION_SURFACE],
  runInstructions:
    'Unzip pragati-v0.66.0.zip, run `npm ci` then `npm run build` and `npm run preview`, and open the printed address. This is a fixed copy — it cannot change while you review it.',
  immutableUrl: null,
  builtAt: '2026-08-25',
};

/**
 * Which Package B questions depend on what (§4).
 *
 * Documented so that when content or presentation changes, it is
 * obvious which evidence went stale and which did not.
 */
export const QUESTION_DEPENDENCIES: Record<
  string,
  'semantic' | 'presentation' | 'both'
> = {
  // Mathematics and source fidelity: the words and the numbers.
  M1: 'semantic', M2: 'semantic', M3: 'semantic', M4: 'semantic',
  M5: 'semantic', M6: 'semantic', M7: 'semantic',
  S1: 'semantic', S2: 'semantic', S3: 'semantic',
  // Age appropriateness: mostly wording, but tone is read on screen.
  A1: 'semantic', A2: 'semantic', A3: 'semantic', A4: 'both',
  // Visuals: the semantics AND how they render.
  V1: 'both', V2: 'both', V3: 'both', V4: 'both',
  V5: 'presentation', // "can you read the labels on a phone?"
  V6: 'both',
  // Misconceptions: the wording, except how feedback appears.
  X1: 'semantic', X2: 'semantic', X3: 'semantic', X4: 'semantic',
  X5: 'semantic', X6: 'both',
  // Practice: content and the interaction implementation.
  P1: 'both', P2: 'semantic', P3: 'semantic', P4: 'semantic',
  // Teacher material and opinion.
  T1: 'semantic', T2: 'semantic', T3: 'semantic', T4: 'semantic',
  O1: 'both', O2: 'both', O3: 'both',
};

/** Items whose evidence a presentation change invalidates. */
export function itemsInvalidatedByPresentationChange(): string[] {
  return Object.entries(QUESTION_DEPENDENCIES)
    .filter(([, dep]) => dep === 'presentation' || dep === 'both')
    .map(([id]) => id);
}

/** Items whose evidence a semantic change invalidates. */
export function itemsInvalidatedBySemanticChange(): string[] {
  return Object.entries(QUESTION_DEPENDENCIES)
    .filter(([, dep]) => dep === 'semantic' || dep === 'both')
    .map(([id]) => id);
}
