// v0.35 — Lesson synthesis for skills without a hand-authored lesson.
//
// The v0.29→v0.33 starter-grade expansion added 200+ skill codes. Most
// don't have hand-authored Lesson records. Rather than crash the Learn
// page or show a "no lesson" placeholder, we synthesise a real lesson
// from the item bank itself:
//   - intro:            2 sentences about the skill area
//   - reteach steps:    the solution text from the easier items
//   - visualExplanation: neutral placeholder (no fake visual)
//   - workedExamples:   the two easiest items with their solutions
//   - commonMistakes:   derived from the misconception codes on
//                        distractors (mapped to plain-English descriptions)
//   - practice:         the remaining item IDs
//   - teacherNote / parentNote: generic templates
//
// Nothing here fabricates CBSE-alignment metadata. The alignment layer
// (getItemAlignment) marks these items `needs_teacher_review` regardless,
// so the honesty guarantees still hold.

import type { Item, MisconceptionCode } from './items';
import { MISCONCEPTION_LABELS } from './items';
import type { Lesson } from './lessons';
import type { SkillId } from '../types';

// Short "why students make this mistake" copy per misconception code.
// Kept here rather than in lessons.ts because these apply to synthesised
// lessons only; real lessons author their own commonMistakes.
const MISCONCEPTION_WHY: Record<string, string> = {
  add_across:
    'Adding numerators and denominators separately, without a common denominator.',
  subtract_across:
    'Subtracting numerators and denominators separately, without a common denominator.',
  incomplete_conversion:
    'Converting only one fraction to a common denominator before the operation.',
  product_not_lcm:
    'Using the product of denominators as the common denominator instead of the LCM.',
  operation_confusion:
    'Applying the wrong operation — for example, addition instead of subtraction, or × instead of ÷.',
  mixed_number_error:
    'Not converting mixed numbers to improper fractions before operating.',
  borrowing_error:
    'Slipping when regrouping across integer / fractional parts.',
  conceptual_gap:
    'A gap in the underlying concept — the answer format doesn\'t match what the question asks for.',
  visual_misread:
    'Mis-reading the visual model (miscounting cells or bars).',
  arithmetic_slip:
    'An arithmetic slip — the method is right, one small step went wrong.',
  form_error:
    'Answer in the wrong form (e.g. mixed vs improper, decimal vs fraction, unit missing).',
  none: 'Correct — no misconception associated.',
};

const MISCONCEPTION_FIX: Record<string, string> = {
  add_across: 'Rewrite both fractions with a common denominator first.',
  subtract_across: 'Rewrite both fractions with a common denominator first.',
  incomplete_conversion: 'Convert EACH fraction to the common denominator before adding or subtracting.',
  product_not_lcm: 'Find the LCM of the denominators, not their product.',
  operation_confusion: 'Underline the operation symbol in the question before starting.',
  mixed_number_error: 'Rewrite every mixed number as an improper fraction first.',
  borrowing_error: 'Show the borrowing step explicitly on paper.',
  conceptual_gap: 'Restate the question in your own words before answering.',
  visual_misread: 'Count the total cells first, then count the shaded cells.',
  arithmetic_slip: 'Slow down. Re-do the arithmetic on paper, one line per step.',
  form_error: 'Check the answer format the question asks for (fraction / decimal / with units).',
  none: '',
};

function synthesiseCommonMistakes(items: Item[]): Lesson['commonMistakes'] {
  const seen = new Map<MisconceptionCode, { pattern: string; example: string; why: string; fix: string }>();
  for (const item of items) {
    if (item.kind === 'mcq') {
      for (let i = 0; i < item.options.length; i++) {
        if (i === item.correctIndex) continue;
        const opt = item.options[i];
        if (opt.misconception === 'none') continue;
        if (seen.has(opt.misconception)) continue;
        seen.set(opt.misconception, {
          pattern: MISCONCEPTION_LABELS[opt.misconception] ?? String(opt.misconception),
          example: `On "${item.stem.slice(0, 80)}${item.stem.length > 80 ? '…' : ''}", a student picks "${opt.text}" instead of the correct answer.`,
          why: MISCONCEPTION_WHY[opt.misconception] ?? 'Common misunderstanding on this skill.',
          fix: MISCONCEPTION_FIX[opt.misconception] ?? 'Re-teach the underlying concept and try again.',
        });
      }
    } else if (item.kind === 'numeric' && item.errorPatterns) {
      for (const ep of item.errorPatterns) {
        if (ep.misconception === 'none' || seen.has(ep.misconception)) continue;
        seen.set(ep.misconception, {
          pattern: MISCONCEPTION_LABELS[ep.misconception] ?? String(ep.misconception),
          example: `On "${item.stem.slice(0, 80)}${item.stem.length > 80 ? '…' : ''}", a student types "${ep.answers[0]}" instead of the correct answer.`,
          why: MISCONCEPTION_WHY[ep.misconception] ?? 'Common misunderstanding on this skill.',
          fix: MISCONCEPTION_FIX[ep.misconception] ?? 'Re-teach the underlying concept and try again.',
        });
      }
    }
    if (seen.size >= 3) break;
  }
  return Array.from(seen.values());
}

function synthesiseWorkedExamples(items: Item[]): Lesson['workedExamples'] {
  // Two easiest items; use the solution string as the step list.
  const easy = [...items]
    .filter((i) => Boolean(i.solution))
    .sort((a, b) => a.difficulty - b.difficulty)
    .slice(0, 2);
  return easy.map((it) => {
    const correctAnswer =
      it.kind === 'mcq'
        ? it.options[it.correctIndex].text
        : (it.acceptedAnswers[0] ?? '');
    // Split solution into sentences (rough) to make numbered steps.
    const rawSteps = it.solution
      .split(/(?<=[.!?])\s+/)
      .map((s) => s.trim())
      .filter(Boolean);
    return {
      problem: it.stem,
      steps: rawSteps.length > 0 ? rawSteps : [it.solution],
      answer: correctAnswer,
    };
  });
}

function synthesiseReteachSteps(items: Item[], skillName: string): string[] {
  const steps: string[] = [];
  steps.push(`Read the question carefully — identify what is being asked about "${skillName}".`);
  // Use up to 3 foundational-item solutions as step hints.
  const foundational = items
    .filter((i) => i.band === 'foundational')
    .slice(0, 3);
  for (const it of foundational) {
    const short = it.solution.split(/(?<=[.!?])\s+/)[0]?.trim();
    if (short) steps.push(short);
  }
  steps.push('Check your final answer against the question — is it in the right form (whole number, fraction, decimal, with units)?');
  return steps;
}

// The public synthesizer. Given a skillId and the items for that skill,
// returns a fully-populated Lesson. Callers can layer authored content
// on top if they later add a `LESSONS[skillId]` entry.
export function synthesizeLesson(
  skillId: SkillId,
  skillName: string,
  items: Item[]
): Lesson {
  const intro = `This skill covers ${skillName}. The practice items below sample the topic; each item is teacher-review-required prototype content. Work through the two worked examples, watch for the listed common mistakes, then try the practice items.`;
  return {
    skillId,
    intro,
    reteach: {
      title: `Reteach — ${skillName}`,
      steps: synthesiseReteachSteps(items, skillName),
    },
    visualExplanation: {
      caption:
        'No hand-authored visual for this skill yet. Read the worked examples below step by step.',
      // Fall back to a minimal placeholder VisualSpec that the renderer
      // knows how to handle. Using an empty bar keeps the type happy
      // without pretending to show a real diagram.
      visual: { kind: 'bars', bars: [{ numerator: 0, denominator: 1, label: '' }] },
      readingSteps: [
        'Read the worked example above.',
        'Cover the "answer" line with your finger and try to reach the answer yourself.',
        'Uncover and check your working step by step.',
      ],
    },
    workedExamples: synthesiseWorkedExamples(items),
    commonMistakes: synthesiseCommonMistakes(items),
    practice: items.slice(0, 5).map((i) => i.id),
    teacherNote:
      'Prototype starter content — no hand-authored teacher note yet. Suggested: work one item on the board, then hand the class a paper worksheet with two items; discuss mistakes.',
    parentNote:
      'Prototype starter content — no hand-authored parent note yet. Suggested: ask your child to explain one worked example aloud, then try one practice item together.',
  };
}
