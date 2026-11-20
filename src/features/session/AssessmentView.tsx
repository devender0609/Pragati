// v0.48 §10 — Assessment / McqOptions / NumericEntry.
//
// Extracted from App.tsx to reduce the top-level file. Behaviour
// unchanged; only the import path moved. Imports were audited to
// keep this file self-contained.

import { useEffect, useState } from 'react';
import type {
  AssessmentWindow,
  SkillMode,
} from '../../types';
import { ASSESSMENT_WINDOW_LABELS, moduleForSkillMode } from '../../types';
import type { Item, MCQItem, NumericItem } from '../../data/items';
import { SkillChip, GradeBadge } from '../../components/common/SkillChip';
import { FlaggedBadge } from '../../components/common/FlaggedBadge';
import { VisualRenderer } from '../../components/common/VisualRenderer';
import { MathText } from '../../components/common/MathText';
import { gradeColorForModule } from '../../components/common/gradePalette';
import { lessonFor } from '../../data/lessons';
import {
  SESSION_PURPOSE_BLURBS,
  SESSION_PURPOSE_LABELS,
  type SessionPurpose,
} from './sessionPurpose';

export function Assessment({
  item,
  selected,
  onSelect,
  numericInput,
  onNumericChange,
  onSubmit,
  submitting,
  progress,
  total,
  studentName,
  window,
  skillMode,
  purpose,
  showHint = false,
}: {
  item: Item;
  selected: number | null;
  onSelect: (i: number) => void;
  numericInput: string;
  onNumericChange: (s: string) => void;
  onSubmit: () => void;
  submitting: boolean;
  progress: number;
  total: number;
  studentName: string;
  window: AssessmentWindow;
  skillMode: SkillMode;
  /** v0.49 §3 — what kind of session this is. Shown to the student so
   *  a check is never mistaken for a practice run. */
  purpose?: SessionPurpose;
  /** v0.49 §3 — instructional hints are available in practice and
   *  suppressed in a chapter check. A check that hands the method over
   *  before the answer does not measure what it claims to. */
  showHint?: boolean;
}) {
  const pct = Math.min(100, Math.round((progress / total) * 100));

  // The hint is revealed on demand and resets on every new item, so it
  // never carries over from the previous question.
  const [hintOpen, setHintOpen] = useState(false);
  useEffect(() => setHintOpen(false), [item.id]);
  const hintText = showHint
    ? lessonFor(item.skillId).reteach.steps[0] ?? null
    : null;

  // Whether the submit button should be enabled.
  const canSubmit =
    !submitting &&
    (item.kind === 'mcq'
      ? selected !== null
      : numericInput.trim().length > 0);

  // v0.44 — keyboard shortcuts: 1–4 select MCQ options, Enter submits.
  // Skipped for numeric-entry items (numeric input already handles Enter
  // itself; digit keys are needed for the answer).
  useEffect(() => {
    if (item.kind !== 'mcq') return;
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA')) return;
      if (e.key === '1') { e.preventDefault(); onSelect(0); }
      else if (e.key === '2') { e.preventDefault(); onSelect(1); }
      else if (e.key === '3') { e.preventDefault(); onSelect(2); }
      else if (e.key === '4') { e.preventDefault(); onSelect(3); }
      else if (e.key === 'Enter' && canSubmit) { e.preventDefault(); onSubmit(); }
    };
    globalThis.window.addEventListener('keydown', onKey);
    return () => globalThis.window.removeEventListener('keydown', onKey);
  }, [item.kind, onSelect, onSubmit, canSubmit]);

  // v0.37 — grade-tinted progress accent + dot-per-item rail so
  // students see each question in the session at a glance.
  const moduleForBar = moduleForSkillMode(skillMode);
  const gradeColor = moduleForBar ? gradeColorForModule(moduleForBar) : null;
  const accentClass = gradeColor?.accent ?? 'bg-brand-600';
  const answered = progress - 1; // items already submitted

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-white px-4 py-3 shadow-sm ring-1 ring-slate-200">
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-700">
          <span className="font-semibold text-slate-900">{studentName}</span>
          <span className="text-slate-400">·</span>
          <span>
            {purpose
              ? SESSION_PURPOSE_LABELS[purpose]
              : `${ASSESSMENT_WINDOW_LABELS[window]} session`}
          </span>
          {moduleForBar && <GradeBadge moduleId={moduleForBar} />}
          <SkillChip mode={skillMode} />
        </div>
        <div className="text-right">
          <div className="text-xs text-slate-500">
            Question {progress} of up to {total}
          </div>
          {item.kind === 'mcq' && (
            <div className="mt-0.5 hidden text-[10px] text-slate-400 sm:block">
              Tip: press 1–4 to select · Enter to submit
            </div>
          )}
        </div>
      </div>

      {purpose && (
        <p className="text-xs text-slate-500">
          {SESSION_PURPOSE_BLURBS[purpose]}
        </p>
      )}

      <div>
        <div className="flex items-center justify-between text-xs font-medium text-slate-500">
          <span>Progress</span>
          <span>{pct}%</span>
        </div>
        <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-200">
          <div
            className={`h-full rounded-full ${accentClass} transition-all`}
            style={{ width: `${pct}%` }}
          />
        </div>
        {/* Dot rail — one dot per item slot, filled for answered items. */}
        <div className="mt-2 flex flex-wrap gap-1">
          {Array.from({ length: total }).map((_, i) => (
            <span
              key={i}
              aria-label={
                i < answered ? `Item ${i + 1} answered` :
                i === answered ? `Item ${i + 1} — current` :
                `Item ${i + 1} — upcoming`
              }
              className={`inline-block h-2 w-2 rounded-full transition-colors ${
                i < answered
                  ? accentClass
                  : i === answered
                  ? `${accentClass} ring-2 ring-offset-1 ring-slate-300 animate-pulse`
                  : 'bg-slate-200'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="card">
        <div className="flex flex-wrap items-center gap-2">
          {/* v0.49 §14 — the raw skill code, the seed difficulty, and the
              cognitive-demand tag are authoring metadata. They are useful
              to a teacher previewing an item and meaningless (or
              discouraging) to a student mid-question, so they are shown
              only outside the student session. */}
          {!purpose && (
            <>
              <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
                {item.skillId}
              </span>
              <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
                Difficulty (seed): {item.difficulty}/10
              </span>
              <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
                {item.cognitiveType}
              </span>
            </>
          )}
          {item.kind === 'numeric' && (
            <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700 ring-1 ring-amber-200">
              Type your answer
            </span>
          )}
          <FlaggedBadge itemId={item.id} compact />
        </div>

        {item.visual && (
          <div className="mt-6">
            <VisualRenderer visual={item.visual} />
          </div>
        )}

        <MathText
          as="p"
          className="mt-4 text-lg font-semibold leading-relaxed text-slate-900 sm:mt-6 sm:text-xl md:text-2xl"
        >
          {item.stem}
        </MathText>

        {item.kind === 'mcq' ? (
          <McqOptions
            item={item}
            selected={selected}
            onSelect={onSelect}
            disabled={submitting}
          />
        ) : (
          <NumericEntry
            item={item}
            value={numericInput}
            onChange={onNumericChange}
            onSubmit={onSubmit}
            disabled={submitting}
          />
        )}

        {/* §3 — instructional hint. Rendered ONLY when the session
             purpose allows it, so a chapter check has no route to a
             method reminder before the answer is submitted. */}
        {hintText && (
          <div className="mt-6">
            {hintOpen ? (
              <div className="rounded-xl bg-brand-50 p-3 text-sm text-slate-700 ring-1 ring-brand-100">
                <div className="text-xs font-semibold uppercase tracking-wider text-brand-700">
                  Hint
                </div>
                <p className="mt-1">{hintText}</p>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setHintOpen(true)}
                className="min-h-[44px] rounded-lg bg-white px-4 py-2 text-sm font-semibold text-brand-700 ring-1 ring-brand-200 hover:bg-brand-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
              >
                Need a hint?
              </button>
            )}
          </div>
        )}

        <div className="mt-8 flex items-center justify-end">
          <button
            onClick={onSubmit}
            disabled={!canSubmit}
            className="btn-primary"
          >
            {submitting ? 'Saving…' : 'Submit answer'}
          </button>
        </div>
      </div>
    </div>
  );
}

function McqOptions({
  item,
  selected,
  onSelect,
  disabled,
}: {
  item: MCQItem;
  selected: number | null;
  onSelect: (i: number) => void;
  disabled: boolean;
}) {
  return (
    <div className="mt-7 space-y-3">
      {item.options.map((opt, i) => {
        const letter = String.fromCharCode(65 + i);
        const isSelected = selected === i;
        return (
          <button
            key={i}
            onClick={() => onSelect(i)}
            disabled={disabled}
            className={`flex w-full items-start gap-3 sm:gap-4 rounded-xl border-2 p-3 sm:p-4 text-left transition ${
              isSelected
                ? 'border-brand-600 bg-brand-50'
                : 'border-slate-200 bg-white hover:border-brand-300 hover:bg-slate-50'
            } disabled:cursor-not-allowed disabled:opacity-60`}
          >
            <span
              aria-label={`Option ${letter} (keyboard shortcut ${i + 1})`}
              title={`Press ${i + 1}`}
              className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                isSelected
                  ? 'bg-brand-600 text-white'
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              {letter}
            </span>
            <MathText as="span" className="text-base text-slate-900">
              {opt.text}
            </MathText>
          </button>
        );
      })}
    </div>
  );
}

function NumericEntry({
  item,
  value,
  onChange,
  onSubmit,
  disabled,
}: {
  item: NumericItem;
  value: string;
  onChange: (s: string) => void;
  onSubmit: () => void;
  disabled: boolean;
}) {
  return (
    <div className="mt-7">
      <label className="block text-sm font-medium text-slate-700">
        Your answer
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && value.trim().length > 0 && !disabled) {
            e.preventDefault();
            onSubmit();
          }
        }}
        placeholder={item.inputHint}
        disabled={disabled}
        className="form-input mt-1.5 max-w-sm text-lg disabled:opacity-60"
        inputMode="text"
        autoFocus
      />
      <p className="mt-2 text-xs text-slate-500">{item.inputHint}</p>
    </div>
  );
}
