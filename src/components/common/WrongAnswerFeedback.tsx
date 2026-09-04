// v0.40 — Wrong-answer feedback panel.
//
// Rendered on the Results screen after a session. For each wrong
// response, shows:
//   - the item stem
//   - the student's choice (in red)
//   - the correct answer (in green)
//   - why the wrong choice looked tempting (from misconception code)
//   - what to try next
//   - a "Learn this skill" button that jumps to the skill's Learn view
//
// This closes the assessment → understanding loop: the student never
// leaves the results page confused about why they got something wrong.

import { useMemo } from 'react';
import { ITEMS, type Item, type MCQItem } from '../../data/items';
import {
  STUDENT_MISCONCEPTION_WHY,
  STUDENT_MISCONCEPTION_FIX,
} from '../../lib/studentFeedback';
import type { Response, SkillId } from '../../types';
import { SKILL_LABELS } from '../../types';
import { MathText } from './MathText';

export function WrongAnswerFeedback({
  responses,
  onOpenLesson,
}: {
  responses: Response[];
  onOpenLesson: (skillId: SkillId) => void;
}) {
  const wrongRows = useMemo(() => {
    const out: Array<{
      response: Response;
      item: Item;
      chosenText: string;
      correctText: string;
    }> = [];
    for (const r of responses) {
      if (r.correct) continue;
      const item = ITEMS.find((it) => it.id === r.itemId);
      if (!item) continue;
      let chosenText = '';
      let correctText = '';
      if (item.kind === 'mcq') {
        const mcq = item as MCQItem;
        chosenText = mcq.options[r.chosenIndex]?.text ?? '(no answer)';
        correctText = mcq.options[mcq.correctIndex]?.text ?? '';
      } else {
        chosenText = r.chosenText ?? '(no answer)';
        correctText = item.acceptedAnswers[0] ?? '';
      }
      out.push({ response: r, item, chosenText, correctText });
    }
    return out;
  }, [responses]);

  if (wrongRows.length === 0) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
        <div className="text-sm font-semibold text-emerald-900">
          Every answer was correct — nothing to review here.
        </div>
      </div>
    );
  }

  return (
    <section className="space-y-4">
      <div>
        <h3 className="text-base font-semibold text-slate-900">
          Let's look at what went wrong
        </h3>
        <p className="mt-1 text-xs text-slate-500">
          {wrongRows.length} question{wrongRows.length === 1 ? '' : 's'} to
          review. Understanding a mistake helps more than repeating a
          correct answer.
        </p>
      </div>
      {wrongRows.map(({ response, item, chosenText, correctText }) => {
        const code = response.misconceptionTriggered;
        const why = STUDENT_MISCONCEPTION_WHY[code] || '';
        const fix = STUDENT_MISCONCEPTION_FIX[code] || '';
        return (
          <article
            key={response.itemId}
            className="rounded-2xl border border-slate-200 bg-white p-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
              <span className="font-mono">{item.id}</span>
              <span className="font-semibold uppercase tracking-wide text-rose-700">
                Incorrect
              </span>
            </div>
            <MathText as="p" className="mt-2 text-sm font-semibold text-slate-900">
              {item.stem}
            </MathText>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <div className="rounded-lg border border-rose-200 bg-rose-50 p-3">
                <div className="text-[11px] font-semibold uppercase tracking-wide text-rose-700">
                  Your answer
                </div>
                <MathText as="div" className="mt-1 text-sm text-rose-900">
                  {chosenText}
                </MathText>
              </div>
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3">
                <div className="text-[11px] font-semibold uppercase tracking-wide text-emerald-700">
                  Correct answer
                </div>
                <MathText as="div" className="mt-1 text-sm text-emerald-900">
                  {correctText}
                </MathText>
              </div>
            </div>
            {why && (
              <div className="mt-3 rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
                <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  Why this looked tempting
                </div>
                <p className="mt-1">{why}</p>
              </div>
            )}
            {fix && (
              <div className="mt-2 rounded-lg bg-brand-50 p-3 text-sm text-brand-900 ring-1 ring-brand-200">
                <div className="text-[11px] font-semibold uppercase tracking-wide text-brand-700">
                  What to try
                </div>
                <p className="mt-1">{fix}</p>
              </div>
            )}
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
              <div className="text-xs text-slate-500">
                Skill:{' '}
                <span className="font-medium text-slate-700">
                  {SKILL_LABELS[item.skillId as SkillId] ?? item.skillId}
                </span>
              </div>
              <button
                onClick={() => onOpenLesson(item.skillId as SkillId)}
                className="rounded-lg border border-brand-300 bg-white px-3 py-1.5 text-xs font-semibold text-brand-700 hover:bg-brand-50"
              >
                Learn this skill →
              </button>
            </div>
          </article>
        );
      })}
    </section>
  );
}
