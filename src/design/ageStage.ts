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
