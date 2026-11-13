// v0.62 §9/§16 — INTERACTIVE PRACTICE.
//
// The number line is the piece that matters: MIDDLE:C-1.4 is about
// placing numbers on a line, and a student who picks "3/4" from a list
// has not shown they can place 3/4.
//
// ACCESSIBILITY IS NOT AN AFTERTHOUGHT HERE. The interaction is a
// radiogroup of real focusable elements, so arrow keys and a screen
// reader work without a parallel implementation. Hit areas are 44 px
// wide regardless of how close the ticks are drawn — at 8 partitions on
// a 390 px screen the visible ticks are ~40 px apart, which is fine to
// look at and too tight to tap reliably.
//
// Correctness never touches a float: `judge()` compares integers.

import { useState } from 'react';
import {
  judge,
  type AreaModelOption,
  type InstructionalItem,
  type Judgement,
  type Response,
} from '../../curriculum/instructionalInteraction';

/**
 * v0.69 §32 — FEEDBACK.
 *
 * Three visual treatments for three different claims:
 *
 *   correct     the mathematical idea is confirmed, not just the answer
 *   diagnosed   we believe we know WHICH error this was
 *   neutral     the answer is wrong and we are not guessing why
 *
 * Wrong answers are AMBER, never red. A wrong answer in practice is not
 * a failure; it is the moment the teaching happens, and colouring it the
 * colour of a system error teaches a student to fear being wrong.
 *
 * The diagnosed case carries a distinct heading ("About that answer")
 * so a student can tell the difference between "here is a hint" and
 * "here is what I think you did". Colour is never the only cue: each
 * state has an icon AND a label.
 */
function Feedback({ j }: { j: Judgement }) {
  const diagnosed = !j.correct && j.misconceptionRef !== null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`mt-3 flex animate-rise-in gap-2.5 rounded-xl2 border p-3.5 ${
        j.correct
          ? 'border-correct-300 bg-correct-50'
          : 'border-attend-300 bg-attend-50'
      }`}
    >
      <span
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
          j.correct ? 'bg-correct-600' : 'bg-attend-500'
        }`}
        aria-hidden="true"
      >
        {j.correct ? (
          <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4.5 10.5 8.2 14 15.5 6.5" />
          </svg>
        ) : (
          <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round">
            <path d="M10 5.5v5.5" /><circle cx="10" cy="14.5" r="0.9" fill="#fff" stroke="none" />
          </svg>
        )}
      </span>
      <div className="min-w-0">
        <p
          className={`text-xs font-bold uppercase tracking-wide ${
            j.correct ? 'text-correct-700' : 'text-attend-800'
          }`}
        >
          {j.correct
            ? 'That is right'
            : diagnosed
              ? 'About that answer'
              : 'Not quite — try again'}
        </p>
        <p
          className={`mt-1 text-sm leading-relaxed ${
            j.correct ? 'text-correct-900' : 'text-attend-900'
          }`}
        >
          {j.feedback}
        </p>
      </div>
    </div>
  );
}

function NumberLinePicker({
  item,
  onAnswer,
  answered,
  chosen,
}: {
  item: Extract<InstructionalItem, { format: 'select_point_on_number_line' }>;
  onAnswer: (r: Response) => void;
  answered: boolean;
  chosen: number | null;
}) {
  const W = 640;
  const H = 110;
  const PAD = 40;
  const span = W - PAD * 2;
  const ticks = Array.from({ length: item.partitions + 1 }, (_, i) => ({
    i,
    x: PAD + (i / item.partitions) * span,
  }));

  return (
    <div
      role="radiogroup"
      aria-label={item.prompt}
      className="relative mt-3 w-full"
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
        <line
          x1={PAD} y1={54} x2={W - PAD} y2={54}
          className="stroke-slate-800" strokeWidth={2}
        />
        {ticks.map((t) => (
          <line
            key={t.i}
            x1={t.x} y1={44} x2={t.x} y2={64}
            className="stroke-slate-700" strokeWidth={1.5}
          />
        ))}
        <text x={PAD} y={86} textAnchor="middle" fontSize={19} className="fill-slate-600">
          {item.min.numerator / item.min.denominator}
        </text>
        <text x={W - PAD} y={86} textAnchor="middle" fontSize={19} className="fill-slate-600">
          {item.max.numerator / item.max.denominator}
        </text>
        {chosen !== null && (
          <circle
            cx={PAD + (chosen / item.partitions) * span}
            cy={54}
            r={9}
            className="fill-rose-600"
          />
        )}
      </svg>

      {/* Real buttons over the ticks. 44 px targets even where the
          drawn ticks are closer together. */}
      <div className="absolute inset-0">
        {ticks.map((t) => (
          <button
            key={t.i}
            type="button"
            role="radio"
            aria-checked={chosen === t.i}
            aria-label={`Position ${t.i} of ${item.partitions}`}
            disabled={answered}
            onClick={() => onAnswer({ kind: 'tick', tickIndex: t.i })}
            className="absolute top-1/2 h-11 w-11 -translate-x-1/2 -translate-y-1/2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            style={{ left: `${(t.x / W) * 100}%` }}
          />
        ))}
      </div>
    </div>
  );
}

function StripPicker({
  item,
  onAnswer,
  answered,
  chosen,
}: {
  item: Extract<InstructionalItem, { format: 'fraction_strip_selection' }>;
  onAnswer: (r: Response) => void;
  answered: boolean;
  chosen: number | null;
}) {
  return (
    <div role="radiogroup" aria-label={item.prompt} className="mt-3 space-y-2">
      {item.strips.map((s, i) => (
        <button
          key={i}
          type="button"
          role="radio"
          aria-checked={chosen === i}
          aria-label={`${s.shadedCount} of ${s.denominator} parts shaded`}
          disabled={answered}
          onClick={() => onAnswer({ kind: 'strip', stripIndex: i })}
          className={`flex min-h-11 w-full items-center gap-1 rounded-lg border p-2 ${
            chosen === i ? 'border-brand-500 bg-brand-50' : 'border-slate-300'
          }`}
        >
          {Array.from({ length: s.denominator }, (_, c) => (
            <span
              key={c}
              className={`h-7 flex-1 border border-slate-600 ${
                c < s.shadedCount ? 'bg-sky-400' : 'bg-white'
              }`}
            />
          ))}
        </button>
      ))}
    </div>
  );
}

/**
 * v0.68 §6 — AREA MODEL PICKER.
 *
 * Renders each option as a rectangle whose parts have their AUTHORED
 * widths. That is the whole reason this format exists: an unequal
 * partition must LOOK unequal, and a strip — one denominator, equal
 * cells by construction — cannot show one.
 *
 * Widths are converted to percentages for layout only. Correctness is
 * decided in `judge()` by exact integer arithmetic and never touches
 * these numbers.
 */
function RegionPicker({
  item,
  onAnswer,
  answered,
  chosenId,
}: {
  item: Extract<InstructionalItem, { format: 'area_model_selection' }>;
  onAnswer: (r: Response) => void;
  answered: boolean;
  chosenId: string | null;
}) {
  const widthPercent = (o: AreaModelOption, i: number) =>
    (o.partWidths[i].numerator / o.partWidths[i].denominator) * 100;

  // §26 — keyboard support. `role="radio"` in a `radiogroup` promises
  // arrow-key navigation, and browsers do not provide it for buttons.
  // Without this the format was reachable by Tab and unusable by anyone
  // navigating a radio group the way a screen reader teaches them to.
  const move = (from: number, delta: number) => {
    const next = (from + delta + item.options.length) % item.options.length;
    const el = document.getElementById(`${item.itemId}-opt-${item.options[next].id}`);
    el?.focus();
  };

  return (
    <div role="radiogroup" aria-label={item.prompt} className="mt-3 space-y-2.5">
      {item.options.map((o, idx) => (
        <button
          key={o.id}
          id={`${item.itemId}-opt-${o.id}`}
          type="button"
          role="radio"
          aria-checked={chosenId === o.id}
          // §26 — describes the PARTITION, exactly as a sighted student
          // sees it. It does not say which option is correct. Withholding
          // it would not make the item fairer; it would make the diagram
          // sighted-only, and the diagram is the item.
          aria-label={o.altText}
          disabled={answered}
          tabIndex={answered ? -1 : chosenId === null ? (idx === 0 ? 0 : -1) : chosenId === o.id ? 0 : -1}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
              e.preventDefault();
              move(idx, 1);
            }
            if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
              e.preventDefault();
              move(idx, -1);
            }
          }}
          onClick={() => onAnswer({ kind: 'region', optionId: o.id })}
          className={`flex w-full items-stretch rounded-xl2 border-2 p-2.5 transition disabled:cursor-default ${
            chosenId === o.id
              ? 'border-brand-500 bg-brand-50'
              : 'border-slate-200 bg-white hover:border-brand-300'
          } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2`}
        >
          {/*
            §27 — the diagram must be readable, so it is 56px tall
            rather than 32. At 32px on a 390px screen, telling a 1/2 part
            from a 1/6 part was a squint, and a diagram that cannot be
            read is worse than none because it looks like it worked.

            §26 — the only visual difference between options is the
            geometry. Every option uses the same border weight, the same
            shade fill and the same background. Nothing about an option's
            styling hints at whether it is correct.
          */}
          <span className="flex h-14 w-full overflow-hidden rounded-lg" aria-hidden="true">
            {o.partWidths.map((_, i) => (
              <span
                key={i}
                className={`h-full border-2 border-slate-700 ${
                  o.shadedIndices.includes(i) ? 'bg-progress-400' : 'bg-white'
                }`}
                style={{ width: `${widthPercent(o, i)}%` }}
              />
            ))}
          </span>
        </button>
      ))}
    </div>
  );
}

function NumericEntry({
  onAnswer,
  answered,
}: {
  onAnswer: (r: Response) => void;
  answered: boolean;
}) {
  const [num, setNum] = useState('');
  const [den, setDen] = useState('');
  const ready = num.trim() !== '' && den.trim() !== '';

  return (
    <div className="mt-3 flex items-center gap-2">
      <div className="flex flex-col items-center">
        <input
          inputMode="numeric"
          aria-label="Numerator"
          value={num}
          disabled={answered}
          onChange={(e) => setNum(e.target.value.replace(/\D/g, ''))}
          className="h-11 w-16 rounded-lg border border-slate-300 text-center text-lg"
        />
        <span className="my-1 h-px w-12 bg-slate-800" />
        <input
          inputMode="numeric"
          aria-label="Denominator"
          value={den}
          disabled={answered}
          onChange={(e) => setDen(e.target.value.replace(/\D/g, ''))}
          className="h-11 w-16 rounded-lg border border-slate-300 text-center text-lg"
        />
      </div>
      <button
        type="button"
        disabled={!ready || answered}
        onClick={() =>
          onAnswer({
            kind: 'fraction',
            // Integers straight from the input. Never parsed as a float.
            value: { numerator: Number(num), denominator: Number(den) },
          })
        }
        className="min-h-11 rounded-lg bg-slate-900 px-4 text-sm font-medium text-white disabled:opacity-40"
      >
        Check
      </button>
    </div>
  );
}

export function PracticeItemView({ item }: { item: InstructionalItem }) {
  const [judgement, setJudgement] = useState<Judgement | null>(null);
  const [chosen, setChosen] = useState<number | null>(null);
  const [chosenId, setChosenId] = useState<string | null>(null);

  const answer = (r: Response) => {
    if (r.kind === 'tick') setChosen(r.tickIndex);
    if (r.kind === 'strip') setChosen(r.stripIndex);
    if (r.kind === 'region') setChosenId(r.optionId);
    setJudgement(judge(item, r));
  };

  return (
    <div className="rounded-lg border border-slate-200 p-4">
      <p className="text-sm font-medium text-slate-900">{item.prompt}</p>

      {item.format === 'select_point_on_number_line' && (
        <NumberLinePicker
          item={item}
          onAnswer={answer}
          answered={judgement !== null}
          chosen={chosen}
        />
      )}
      {item.format === 'fraction_strip_selection' && (
        <StripPicker
          item={item}
          onAnswer={answer}
          answered={judgement !== null}
          chosen={chosen}
        />
      )}
      {item.format === 'area_model_selection' && (
        <RegionPicker
          item={item}
          onAnswer={answer}
          answered={judgement !== null}
          chosenId={chosenId}
        />
      )}
      {item.format === 'numeric_entry' && (
        <NumericEntry
          onAnswer={answer}
          answered={judgement !== null}
        />
      )}
      {item.format === 'multiple_choice' && (
        <div role="radiogroup" aria-label={item.prompt} className="mt-3 space-y-2">
          {item.choices.map((c) => (
            <button
              key={c.id}
              type="button"
              role="radio"
              aria-checked={false}
              disabled={judgement !== null}
              onClick={() => answer({ kind: 'choice', choiceId: c.id })}
              className="min-h-11 w-full rounded-lg border border-slate-300 px-3 text-left text-sm"
            >
              {c.text}
            </button>
          ))}
        </div>
      )}

      {judgement && <Feedback j={judgement} />}
    </div>
  );
}
