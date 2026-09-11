// v0.55 §18 — Product positioning, single source of truth.
//
// Used by the README and any About screen so the description cannot
// drift into claims the evidence does not support.

export const PRODUCT_POSITIONING = {
  // v0.56 §18 — the v0.55 wording could read as though an adaptive
  // assessment already existed. It does not.
  shortDescription:
    'Pragati is a Mathematics learning and practice platform for Indian schools, with an adaptive assessment system under development.',
  // "aligned to Indian curriculum" overclaimed: most grade mappings
  // are unverified.
  longDescription:
    'Pragati provides Mathematics lessons, practice, and teacher tools mapped to recorded Indian curriculum sources, with verification status tracked per chapter. A formal assessment component is in framework development: no questions have been written for it, none have been trialled with students, and it reports no scores.',
  mayClaim: [
    'Lessons and practice for Indian school Mathematics.',
    'Teacher tools for class-level practice evidence.',
    'Curriculum mapping with recorded sources and per-chapter verification status.',
    'An assessment framework under development, with published limitations.',
  ],
  mayNotClaim: [
    'A validated Growth assessment.',
    'An Indian MAP, or equivalence with any commercial assessment.',
    'Nationally normed results.',
    'Measurement of true growth.',
    'Psychometrically calibrated scores.',
    'Prediction of board-exam outcomes.',
    'Mastery or proficiency classification.',
  ],
} as const;

/** Terms that must not appear in positioning copy. */
export const FORBIDDEN_POSITIONING_TERMS = [
  'validated growth',
  'nationally normed',
  'psychometrically calibrated',
  'measures true growth',
  'predicts board',
  'indian map',
  'rit',
  'percentile',
  'mastery',
] as const;
