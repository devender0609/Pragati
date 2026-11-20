import { useState } from 'react';
import {
  getSessionFeedback,
  saveSessionFeedback,
} from '../../lib/storage';
import type {
  PicturesHelped,
  SessionFeedback,
  SessionFeedbackDifficulty,
} from '../../types';
import { Field } from './Field';

// Session feedback (v0.8) — student-facing strip on Results. Captures
// perceived difficulty + whether pictures helped + free-text "confusing
// questions" and "hardest part". Saves locally and re-renders a summary
// once submitted, with an "Edit feedback" affordance. Extracted from
// App.tsx in v0.14.
export function SessionFeedbackCard({ sessionId }: { sessionId: string }) {
  const [existing, setExisting] = useState<SessionFeedback | null>(() =>
    getSessionFeedback(sessionId)
  );
  const [difficulty, setDifficulty] =
    useState<SessionFeedbackDifficulty | null>(existing?.difficulty ?? null);
  const [picturesHelped, setPicturesHelped] = useState<PicturesHelped | null>(
    existing?.picturesHelped ?? null
  );
  const [confusing, setConfusing] = useState(
    existing?.confusingQuestions ?? ''
  );
  const [hardest, setHardest] = useState(existing?.hardestPart ?? '');

  const submit = () => {
    if (!difficulty || !picturesHelped) return;
    const fb: SessionFeedback = {
      sessionId,
      difficulty,
      picturesHelped,
      confusingQuestions: confusing,
      hardestPart: hardest,
      submittedAt: Date.now(),
    };
    saveSessionFeedback(fb);
    setExisting(fb);
  };

  if (
    existing &&
    existing.submittedAt > 0 &&
    difficulty === existing.difficulty
  ) {
    return (
      <section className="rounded-2xl bg-white p-5 ring-1 ring-emerald-200 sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
            Feedback saved · thank you
          </span>
        </div>
        <div className="mt-2 grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
          <div>
            <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Difficulty
            </span>
            <div className="mt-0.5 font-semibold">{existing.difficulty}</div>
          </div>
          <div>
            <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Pictures helped
            </span>
            <div className="mt-0.5 font-semibold">
              {existing.picturesHelped}
            </div>
          </div>
          {existing.confusingQuestions && (
            <div className="sm:col-span-2">
              <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Confusing questions
              </span>
              <p className="mt-0.5">{existing.confusingQuestions}</p>
            </div>
          )}
          {existing.hardestPart && (
            <div className="sm:col-span-2">
              <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Hardest part
              </span>
              <p className="mt-0.5">{existing.hardestPart}</p>
            </div>
          )}
        </div>
        <button
          onClick={() => setExisting(null)}
          className="mt-3 text-xs font-semibold text-brand-700 hover:underline"
        >
          Edit feedback
        </button>
      </section>
    );
  }

  return (
    <section className="rounded-2xl bg-white p-5 ring-1 ring-slate-200 sm:p-6">
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        Feedback (optional)
      </div>
      <h2 className="mt-1 text-base font-semibold text-slate-900 sm:text-lg">
        Tell us how the assessment went.
      </h2>
      <p className="mt-1 text-sm text-slate-600">
        Your answers stay on this device and help the teacher review the
        items.
      </p>

      <div className="mt-4 space-y-4">
        <div>
          <div className="text-sm font-medium text-slate-700">
            Was the assessment easy, okay, or hard?
          </div>
          <div className="mt-1.5 flex flex-wrap gap-2">
            {(['easy', 'okay', 'hard'] as SessionFeedbackDifficulty[]).map(
              (d) => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ring-1 ${
                    difficulty === d
                      ? 'bg-brand-50 text-brand-700 ring-brand-200'
                      : 'bg-white text-slate-600 ring-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {d}
                </button>
              )
            )}
          </div>
        </div>

        <div>
          <div className="text-sm font-medium text-slate-700">
            Did the pictures help?
          </div>
          <div className="mt-1.5 flex flex-wrap gap-2">
            {(
              [
                { v: 'yes', l: 'Yes' },
                { v: 'mixed', l: 'Mixed' },
                { v: 'no', l: 'No' },
                { v: 'na', l: 'No pictures' },
              ] as { v: PicturesHelped; l: string }[]
            ).map(({ v, l }) => (
              <button
                key={v}
                onClick={() => setPicturesHelped(v)}
                className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${
                  picturesHelped === v
                    ? 'bg-brand-50 text-brand-700 ring-brand-200'
                    : 'bg-white text-slate-600 ring-slate-200 hover:bg-slate-50'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        <Field label="Were any questions confusing? (optional)">
          <textarea
            value={confusing}
            onChange={(e) => setConfusing(e.target.value)}
            placeholder="e.g., the wording in question 3 was tricky"
            className="form-input min-h-[60px]"
          />
        </Field>

        <Field label="What was the hardest part? (optional)">
          <textarea
            value={hardest}
            onChange={(e) => setHardest(e.target.value)}
            placeholder="e.g., subtracting mixed numbers when borrowing was needed"
            className="form-input min-h-[60px]"
          />
        </Field>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={submit}
          disabled={!difficulty || !picturesHelped}
          className="btn-primary"
        >
          Save feedback
        </button>
      </div>
    </section>
  );
}
