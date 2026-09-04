// v0.59 §7 + §8 + §10 + §14 — The formal field-test item screen.
//
// A SEPARATE SCREEN, ON PURPOSE.
//
// The ordinary Assessment view carries hint disclosure, purpose blurbs,
// and instructional affordances. Reusing it and hiding buttons would
// mean every future change to that component risks leaking
// instructional behaviour into a secure sitting. This screen simply has
// no such code to disable.
//
// It renders ONLY the item whose ID `currentItemId()` returns, resolved
// against the authorized bank. There is no path here that picks an
// item, reassembles a form, or reveals correctness.

import { useState } from 'react';
import { Card } from '../../design/primitives/Card';
import { PrimaryButton } from '../../design/primitives/PrimaryButton';
import { SecondaryButton } from '../../design/primitives/SecondaryButton';
import { currentItemId, type FormalSessionState } from './formalSessionRunner';

export type FormalItemContent = {
  stem: string;
  choices: string[];
};

export function FormalSittingView({
  state,
  content,
  studentName,
  onSubmit,
  onPause,
  onAbandon,
}: {
  state: FormalSessionState;
  /** Resolver for the authorized bank. Returns null when the ID is not
   *  available, which is a hard stop rather than a silent skip. */
  content: (itemId: string) => FormalItemContent | null;
  studentName: string;
  onSubmit: (args: { itemId: string; value: number | null; omitted: boolean; elapsedMs: number }) => void;
  onPause: () => void;
  onAbandon: () => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const [startedAt] = useState(() => Date.now());
  const [confirmAbandon, setConfirmAbandon] = useState(false);

  const itemId = currentItemId(state);
  const total = state.formItemIdsInOrder.length;
  const position = state.currentIndex + 1;

  if (!itemId) {
    return (
      <Card>
        <p className="text-sm text-slate-700">
          All questions are done. One moment…
        </p>
      </Card>
    );
  }

  const item = content(itemId);
  if (!item) {
    // Refuse rather than substitute. A missing authorized item is a
    // real fault; skipping it would silently shorten the form.
    return (
      <Card>
        <h2 className="text-sm font-semibold text-slate-900">
          This question could not be opened
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Please tell your teacher. Your answers so far are saved.
        </p>
        <div className="mt-3">
          <SecondaryButton onClick={onPause}>Back to Home</SecondaryButton>
        </div>
      </Card>
    );
  }

  const submit = (omitted: boolean) => {
    onSubmit({
      itemId,
      value: omitted ? null : selected,
      omitted,
      elapsedMs: Date.now() - startedAt,
    });
    setSelected(null);
  };

  return (
    <div className="space-y-4">
      {/* Calm and plain. No score, no streak, no encouragement that
          implies performance. */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm text-slate-600">
          {studentName} · Question {position} of {total}
        </div>
        <SecondaryButton onClick={onPause}>Pause</SecondaryButton>
      </div>

      <div
        className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={position}
        aria-label={`Question ${position} of ${total}`}
      >
        <div
          className="h-full rounded-full bg-brand-500"
          style={{ width: `${(position / total) * 100}%` }}
        />
      </div>

      <Card>
        <p className="text-base font-medium text-slate-900">{item.stem}</p>
        <ul className="mt-4 space-y-2">
          {item.choices.map((choice, i) => (
            <li key={i}>
              <button
                onClick={() => setSelected(i)}
                aria-pressed={selected === i}
                className={`flex min-h-[44px] w-full items-center rounded-xl px-4 py-3 text-left text-sm ring-1 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 ${
                  selected === i
                    ? 'bg-brand-50 text-brand-900 ring-brand-300'
                    : 'bg-white text-slate-800 ring-slate-200 hover:bg-slate-50'
                }`}
              >
                {choice}
              </button>
            </li>
          ))}
        </ul>
      </Card>

      {/* No "check answer", no feedback, no try-again. Submit moves on. */}
      <div className="flex flex-wrap items-center gap-2">
        <PrimaryButton onClick={() => submit(false)}>
          {position === total ? 'Finish' : 'Next question'}
        </PrimaryButton>
        <SecondaryButton onClick={() => submit(true)}>Skip</SecondaryButton>
        <button
          onClick={() => setConfirmAbandon(true)}
          className="inline-flex min-h-[44px] items-center text-sm text-slate-500 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        >
          Stop for good
        </button>
      </div>

      {confirmAbandon && (
        <Card>
          <p className="text-sm text-slate-800">
            Stop this check for good? You will not be able to come back to it.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <PrimaryButton onClick={onAbandon}>Yes, stop</PrimaryButton>
            <SecondaryButton onClick={() => setConfirmAbandon(false)}>
              Keep going
            </SecondaryButton>
          </div>
        </Card>
      )}
    </div>
  );
}
