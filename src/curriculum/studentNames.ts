// v0.51 §3/§5 — Student-facing module names.
//
// THE PROBLEM
//
// `MODULE_LABELS` is an authoring register. Its entries carry the
// information a maintainer needs — build state and textbook location:
//
//   "Numbers & Addition (Class 1 — starter)"
//   "Applications of Integrals (Class 12 · Ch 8)"
//
// Those strings were rendered straight onto chapter cards. A Class 1
// child was reading the word "starter", which describes Pragati's
// content maturity and means nothing to them; and every card repeated
// the class number that already sits in the header.
//
// THE FIX
//
// A separate student-facing register. MODULE_LABELS is untouched —
// teachers and Admin & Research genuinely need "(Class 12 · Ch 8)" to
// locate content in the textbook.
//
// Names here are short, concrete, and describe the mathematics.
// Younger stages get warmer phrasing ("Play with Numbers"); older
// stages get the real mathematical name, because a Class 12 student
// looking for integrals should see "Integrals".

import { MODULE_LABELS, type ModuleId } from '../types';

/**
 * Strip authoring metadata from a label.
 *
 * Removes any trailing parenthetical that contains a class number,
 * chapter reference, or build-state word. Used as the fallback so a
 * module added later never leaks "(Class 9 — starter)" just because
 * nobody added it to the table below.
 */
export function stripInternalMetadata(label: string): string {
  return label
    .replace(/\s*\((?:[^()]*?(?:Class\s*\d+|Ch\s*\d+|starter|prototype|extended|pilot)[^()]*)\)/gi, '')
    .replace(/\s*—\s*(?:starter|prototype|pilot|extension)\b/gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

/** Curated student-facing names. Only modules needing more than a
 *  mechanical strip appear here. */
const STUDENT_MODULE_NAMES: Partial<Record<ModuleId, string>> = {
  // --- Early primary: warm, concrete, few words. ---
  g1_math_starter: 'Play with Numbers',
  g1_math_m2: 'Shapes, Money and Measuring',
  g2_math_starter: 'Tens and Ones',
  g2_math_m2: 'Times Tables and Money',
  g3_math_starter: 'Multiplying and Dividing',
  g3_math_m2: 'Fractions and Bigger Numbers',

  // --- Primary. ---
  g4_math_starter: 'Fractions and Measuring',
  g4_math_m2: 'Big Numbers and Decimals',
  g5_math_starter: 'Decimals and Percentages',
  g5_math_m2: 'Fractions, Shapes and Data',

  // --- Middle: the real mathematical names. ---
  g8_math_starter: 'Rational Numbers and Equations',
  g8_math_m2: 'Mensuration, Data and Expressions',
  g9_math_starter: 'Number Systems and Polynomials',
  g9_math_m2: 'Equations, Triangles and Statistics',

  // --- Secondary: precise topic names; no chapter numbers. ---
  g10_math_starter: 'Real Numbers, Quadratics and Trigonometry',
  g10_math_m2: 'Coordinate Geometry, Sequences and Circles',
  g11_math_starter: 'Sets, Functions and Trigonometry',
  g11_math_m2: 'Complex Numbers, Sequences and Lines',
  g12_math_starter: 'Matrices, Derivatives and Integrals',
  g12_math_m2: 'Determinants, Continuity and Vectors',
};

/**
 * The name a student sees for a module.
 *
 * Curated name if one exists; otherwise the authoring label with its
 * metadata stripped. Never the raw label.
 */
export function studentModuleName(moduleId: ModuleId): string {
  const curated = STUDENT_MODULE_NAMES[moduleId];
  if (curated) return curated;
  return stripInternalMetadata(MODULE_LABELS[moduleId] ?? '');
}

/**
 * The name a student sees for a chapter.
 *
 * Chapter display titles come from the official curriculum record and
 * are already clean ("Fractions", "Prime Time"), but they pass through
 * the same strip so a legacy title cannot bypass the rule.
 */
export function studentChapterTitle(
  displayTitle: string,
  legacyModuleId?: ModuleId | null
): string {
  const stripped = stripInternalMetadata(displayTitle);
  if (stripped.length > 0) return stripped;
  return legacyModuleId ? studentModuleName(legacyModuleId) : 'Chapter';
}
