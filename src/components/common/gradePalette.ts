// v0.37 — Per-grade color palette.
//
// Every module and skill chip previously fell back to a uniform slate
// palette once it left the Class 6 / Class 7 handcrafted set. That made
// Classes 1-5 and 8-12 look identical on every dashboard, chip, and
// session progress bar. v0.37 retires that uniformity: each grade gets
// a distinct hue from a coherent rainbow across the primary → senior
// secondary spectrum.
//
// Design intent:
//   - Primary grades (1-5) use warm hues (rose → emerald) — playful.
//   - Middle school (6-8) uses cool blue/teal — the "reviewed core".
//   - Secondary (9-12) uses cool → purple/pink — "senior" feel.
//   - All tokens use Tailwind's 50 / 700 / 200 / 500 shades so contrast
//     stays consistent.

import type { Grade, ModuleId } from '../../types';
import { MODULE_GRADE } from '../../types';

export type GradeColor = {
  /** Full class string for a chip: `bg-<c>-50 text-<c>-700 ring-<c>-200`. */
  chip: string;
  /** Solid tailwind accent color used for lines and progress dots (e.g. `bg-rose-500`). */
  accent: string;
  /** Light background for section headers. */
  header: string;
  /** Text color for callouts and dashboard headings. */
  text: string;
  /** Light border used for cards inside a grade section. */
  border: string;
};

export const GRADE_COLORS: Record<Grade, GradeColor> = {
  class1: {
    chip: 'bg-rose-50 text-rose-700 ring-rose-200',
    accent: 'bg-rose-500', header: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200',
  },
  class2: {
    chip: 'bg-orange-50 text-orange-700 ring-orange-200',
    accent: 'bg-orange-500', header: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200',
  },
  class3: {
    chip: 'bg-amber-50 text-amber-700 ring-amber-200',
    accent: 'bg-amber-500', header: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200',
  },
  class4: {
    chip: 'bg-lime-50 text-lime-700 ring-lime-200',
    accent: 'bg-lime-500', header: 'bg-lime-50', text: 'text-lime-700', border: 'border-lime-200',
  },
  class5: {
    chip: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    accent: 'bg-emerald-500', header: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200',
  },
  class6: {
    chip: 'bg-teal-50 text-teal-700 ring-teal-200',
    accent: 'bg-teal-500', header: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200',
  },
  class7: {
    chip: 'bg-cyan-50 text-cyan-700 ring-cyan-200',
    accent: 'bg-cyan-500', header: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200',
  },
  class8: {
    chip: 'bg-sky-50 text-sky-700 ring-sky-200',
    accent: 'bg-sky-500', header: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200',
  },
  class9: {
    chip: 'bg-blue-50 text-blue-700 ring-blue-200',
    accent: 'bg-blue-500', header: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200',
  },
  class10: {
    chip: 'bg-indigo-50 text-indigo-700 ring-indigo-200',
    accent: 'bg-indigo-500', header: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200',
  },
  class11: {
    chip: 'bg-violet-50 text-violet-700 ring-violet-200',
    accent: 'bg-violet-500', header: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200',
  },
  class12: {
    chip: 'bg-fuchsia-50 text-fuchsia-700 ring-fuchsia-200',
    accent: 'bg-fuchsia-500', header: 'bg-fuchsia-50', text: 'text-fuchsia-700', border: 'border-fuchsia-200',
  },
};

export const GRADE_SHORT_LABEL: Record<Grade, string> = {
  class1: 'Class 1', class2: 'Class 2', class3: 'Class 3', class4: 'Class 4',
  class5: 'Class 5', class6: 'Class 6', class7: 'Class 7', class8: 'Class 8',
  class9: 'Class 9', class10: 'Class 10', class11: 'Class 11', class12: 'Class 12',
};

/** Lookup grade color for a given moduleId — used to override the flat slate palette. */
export function gradeColorForModule(moduleId: ModuleId): GradeColor {
  const grade = MODULE_GRADE[moduleId];
  return GRADE_COLORS[grade];
}

/** All grade colors in order — used for the legend on the teacher-side palette guide. */
export function orderedGradeColors(): Array<{ grade: Grade; color: GradeColor }> {
  return (
    ['class1', 'class2', 'class3', 'class4', 'class5', 'class6',
     'class7', 'class8', 'class9', 'class10', 'class11', 'class12'] as Grade[]
  ).map((g) => ({ grade: g, color: GRADE_COLORS[g] }));
}
