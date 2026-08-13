// v0.40 — Student-facing misconception copy + per-item feedback rows.
//
// Every wrong MCQ answer already carries a misconception code (via
// items.ts option.misconception). Previously these codes only fed the
// teacher-facing rollup. v0.40 threads them into the results view so
// the student sees WHY their choice was wrong and can jump to the
// relevant Learn view.
//
// Copy language is deliberately student-friendly (Grade 4-8 reading
// level, no jargon). The teacher-facing MISCONCEPTION_NEXT_STEP
// in items.ts stays as-is.

import type { MisconceptionCode } from '../data/items';

// One-line "why this choice looks tempting but is wrong".
export const STUDENT_MISCONCEPTION_WHY: Record<MisconceptionCode, string> = {
  add_across:
    'This answer adds the top numbers and adds the bottom numbers, but that is not how fraction addition works.',
  subtract_across:
    'This answer subtracts the tops and subtracts the bottoms — but fractions with different bottoms need a common denominator first.',
  incomplete_conversion:
    'You converted one fraction to the new denominator but forgot to scale the other. Both fractions have to change.',
  product_not_lcm:
    'You used the product of the two denominators instead of the smallest common multiple. It still works, but the numbers get big and hide the answer.',
  operation_confusion:
    'The question asked for a different operation (add / subtract / multiply / divide) than the one you used.',
  mixed_number_error:
    'The whole-number part and the fraction part need to be handled together. Try converting the mixed number to an improper fraction first.',
  borrowing_error:
    'When the fraction on top is smaller than the one below, borrow 1 from the whole-number part before subtracting.',
  conceptual_gap:
    'This answer doesn\'t match what the question is really asking. Re-read the question in your own words.',
  arithmetic_slip:
    'The method is right, but a small arithmetic step went wrong. Redo it slowly on paper.',
  form_error:
    'The value is close, but the format is off (fraction vs decimal, mixed vs improper, missing units).',
  visual_misread:
    'The picture was counted wrong. Count the total parts first, then the shaded parts.',
  none: '',
};

// A short "what to do next" prompt for the student (not the teacher).
export const STUDENT_MISCONCEPTION_FIX: Record<MisconceptionCode, string> = {
  add_across: 'Rewrite both fractions with the same denominator, then add only the tops.',
  subtract_across: 'Rewrite both fractions with the same denominator, then subtract only the tops.',
  incomplete_conversion: 'Multiply BOTH the top and bottom of each fraction by the same number.',
  product_not_lcm: 'Find the least common multiple of the two denominators.',
  operation_confusion: 'Underline the operation word in the question, then start again.',
  mixed_number_error: 'Turn every mixed number into an improper fraction first.',
  borrowing_error: 'Show the borrow step on paper before subtracting.',
  conceptual_gap: 'Re-read the question aloud and highlight what is being asked.',
  arithmetic_slip: 'Redo the calculation on paper, one step per line.',
  form_error: 'Check whether the answer should be a fraction, decimal, or include units.',
  visual_misread: 'Count total cells, then count shaded cells, then form the fraction.',
  none: '',
};

// Compact display object per wrong-response row. Correct rows get no copy.
export type WrongAnswerFeedback = {
  itemId: string;
  skillId: string;
  code: MisconceptionCode;
  stem: string;
  chosenText: string;
  correctText: string;
  why: string;
  fix: string;
};
