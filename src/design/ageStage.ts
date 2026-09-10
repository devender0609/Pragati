// v0.46 Checkpoint 2 — Age-stage themes.
//
// Four stages, each with density, motion, illustration weight, and
// typography defaults. Grade → stage mapping is stable; components
// consume the stage tokens rather than switching on grade directly.

import type { Grade } from '../types';

export type AgeStage = 'early_primary' | 'primary' | 'middle' | 'secondary';

export const AGE_STAGE_FOR_GRADE: Record<Grade, AgeStage> = {
  class1: 'early_primary',
  class2: 'early_primary',
  class3: 'primary',
  class4: 'primary',
  class5: 'primary',
  class6: 'middle',
  class7: 'middle',
  class8: 'middle',
  class9: 'secondary',
  class10: 'secondary',
  class11: 'secondary',
  class12: 'secondary',
};

export const AGE_STAGE_LABEL: Record<AgeStage, string> = {
  early_primary: 'Early Primary',
  primary: 'Primary',
  middle: 'Middle',
  secondary: 'Secondary / Senior Secondary',
};

export type AgeStageTokens = {
  /** Card padding preference. */
  cardPadding: string;
  /** Base body text size class. Larger for early primary. */
  bodyText: string;
  /** Heading (h1) size class. */
  h1: string;
  /** Whether decorative animations are welcome (still respects
   *  prefers-reduced-motion at render time). */
  allowsPlayfulAnimation: boolean;
  /** Whether cartoon-style illustrations are appropriate. Secondary
   *  stages get abstract geometric visuals instead. */
  allowsCartoonIllustration: boolean;
  /** Density hint for dashboards — 'airy' shows fewer, larger cards. */
  density: 'airy' | 'balanced' | 'compact';
  /** Minimum touch-target size class for primary controls. */
  touchTarget: string;
  /** Text tone — 'friendly' uses first-person; 'neutral' is direct. */
  tone: 'friendly' | 'neutral' | 'formal';
};

export const AGE_STAGE_TOKENS: Record<AgeStage, AgeStageTokens> = {
  early_primary: {
    cardPadding: 'p-5 sm:p-6',
    bodyText: 'text-base sm:text-lg',
    h1: 'text-2xl font-bold sm:text-3xl',
    allowsPlayfulAnimation: true,
    allowsCartoonIllustration: true,
    density: 'airy',
    touchTarget: 'min-h-[48px] min-w-[48px]',
    tone: 'friendly',
  },
  primary: {
    cardPadding: 'p-4 sm:p-5',
    bodyText: 'text-sm sm:text-base',
    h1: 'text-xl font-bold sm:text-2xl',
    allowsPlayfulAnimation: true,
    allowsCartoonIllustration: true,
    density: 'balanced',
    touchTarget: 'min-h-[44px] min-w-[44px]',
    tone: 'friendly',
  },
  middle: {
    cardPadding: 'p-4 sm:p-5',
    bodyText: 'text-sm sm:text-base',
    h1: 'text-xl font-semibold sm:text-2xl',
    allowsPlayfulAnimation: true,
    allowsCartoonIllustration: false,
    density: 'balanced',
    touchTarget: 'min-h-[40px] min-w-[40px]',
    tone: 'neutral',
  },
  secondary: {
    cardPadding: 'p-4 sm:p-5',
    bodyText: 'text-sm',
    h1: 'text-lg font-semibold sm:text-xl',
    allowsPlayfulAnimation: false,
    allowsCartoonIllustration: false,
    density: 'compact',
    touchTarget: 'min-h-[36px] min-w-[36px]',
    tone: 'formal',
  },
};

export function ageStageForGrade(grade: Grade): AgeStage {
  return AGE_STAGE_FOR_GRADE[grade];
}

export function tokensForGrade(grade: Grade): AgeStageTokens {
  return AGE_STAGE_TOKENS[ageStageForGrade(grade)];
}

// ---------------------------------------------------------------------------
// v0.50 §9 — Layout composition.
//
// The tokens above describe how things LOOK. These describe what is
// SHOWN. That is the part that was missing: a Class 1 Home and a
// Class 12 Home rendered the same components at slightly different
// font sizes, which is not age-appropriate design.
//
// One design system, stage-based composition — not four products.
// ---------------------------------------------------------------------------

export type StageLayout = {
  /** Chapter cards per row on Learn. Early primary gets big targets. */
  chapterColumns: 1 | 2 | 3;
  /** Show a large chapter illustration rather than a text-first card. */
  showChapterArt: boolean;
  /** Maximum secondary items on Home. Early primary sees ONE action. */
  maxHomeSecondaryItems: number;
  /** Show the concept-by-concept progress list. Overwhelming for the
   *  youngest; expected by the oldest. */
  showConceptProgressList: boolean;
  /** Show a compact numeric progress summary (percentages, counts). */
  showNumericProgress: boolean;
  /** Show exam-preparation framing (chapter readiness, review). */
  showExamReadiness: boolean;
  /** Wrap lesson content in extra visual scaffolding. */
  emphasiseVisualRepresentations: boolean;
  /** Words we are willing to put on a primary button. */
  primaryActionStyle: 'verb_only' | 'short_phrase' | 'descriptive';
};

export const STAGE_LAYOUT: Record<AgeStage, StageLayout> = {
  early_primary: {
    chapterColumns: 1,
    showChapterArt: true,
    maxHomeSecondaryItems: 0,
    showConceptProgressList: false,
    showNumericProgress: false,
    showExamReadiness: false,
    emphasiseVisualRepresentations: true,
    primaryActionStyle: 'verb_only',
  },
  primary: {
    chapterColumns: 2,
    showChapterArt: true,
    maxHomeSecondaryItems: 1,
    showConceptProgressList: false,
    showNumericProgress: false,
    showExamReadiness: false,
    emphasiseVisualRepresentations: true,
    primaryActionStyle: 'short_phrase',
  },
  middle: {
    chapterColumns: 2,
    showChapterArt: false,
    maxHomeSecondaryItems: 2,
    showConceptProgressList: true,
    showNumericProgress: true,
    showExamReadiness: false,
    emphasiseVisualRepresentations: false,
    primaryActionStyle: 'short_phrase',
  },
  secondary: {
    chapterColumns: 3,
    showChapterArt: false,
    maxHomeSecondaryItems: 3,
    showConceptProgressList: true,
    showNumericProgress: true,
    showExamReadiness: true,
    emphasiseVisualRepresentations: false,
    primaryActionStyle: 'descriptive',
  },
};

export function layoutForGrade(grade: Grade): StageLayout {
  return STAGE_LAYOUT[ageStageForGrade(grade)];
}

/** Primary action wording, by stage. A Class 1 button says "Learn";
 *  a Class 12 button says what it will actually do. */
export function primaryActionLabel(
  grade: Grade,
  kind: 'start' | 'continue' | 'practice'
): string {
  const style = layoutForGrade(grade).primaryActionStyle;
  if (style === 'verb_only') {
    return kind === 'practice' ? 'Practise' : 'Learn';
  }
  if (style === 'short_phrase') {
    return kind === 'start'
      ? 'Start learning'
      : kind === 'continue'
        ? 'Continue learning'
        : 'Practise a concept';
  }
  return kind === 'start'
    ? 'Start your first chapter'
    : kind === 'continue'
      ? 'Continue where you left off'
      : 'Practise by concept';
}
