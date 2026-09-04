import type { NextStepSuggestion } from '../../lib/progression';
import type { SkillId, SkillMode } from '../../types';
import { SkillChip } from './SkillChip';

// "Next Step for You" card surfaced right after the headline on Results.
// Built on the suggestNextStep heuristic: weakest skill in this session if
// any, else the next non-strong skill in curriculum order, else a mastery
// message. Extracted from App.tsx in v0.14.
export function NextStepCard({
  suggestion,
  onOpenLesson,
  onStartAssessment,
}: {
  suggestion: NextStepSuggestion;
  onOpenLesson: (s: SkillId) => void;
  onStartAssessment: (mode: SkillMode) => void;
}) {
  const tone =
    suggestion.kind === 'practice_skill'
      ? 'from-amber-50 to-rose-50 ring-amber-200'
      : suggestion.kind === 'next_skill'
        ? 'from-brand-50 to-violet-50 ring-brand-200'
        : 'from-emerald-50 to-teal-50 ring-emerald-200';
  return (
    <section
      className={`rounded-3xl bg-gradient-to-br p-5 ring-1 sm:p-6 ${tone}`}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-700">
          Next step for you
        </span>
        <SkillChip mode={suggestion.skillId} />
      </div>
      <h2 className="mt-2 text-xl font-bold text-slate-900 sm:text-2xl">
        {suggestion.headline}
      </h2>
      <p className="mt-2 max-w-3xl text-sm text-slate-700">
        {suggestion.detail}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={() => onOpenLesson(suggestion.skillId)}
          className="btn-primary"
        >
          Open the {suggestion.skillId} lesson
        </button>
        <button
          onClick={() => onOpenLesson(suggestion.skillId)}
          className="btn-secondary"
        >
          See {suggestion.skillId} practice questions
        </button>
        <button
          onClick={() => onStartAssessment(suggestion.skillId)}
          className="btn-secondary"
        >
          {suggestion.kind === 'practice_skill'
            ? `Retake ${suggestion.skillId} only`
            : `Take a ${suggestion.skillId} assessment`}
        </button>
      </div>
      {suggestion.perSkillSummary.length > 1 && (
        <div className="mt-4 rounded-xl bg-white/70 p-3 ring-1 ring-slate-200">
          <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
            What you did this session
          </div>
          <ul className="mt-2 grid gap-1 text-xs text-slate-700 sm:grid-cols-2">
            {suggestion.perSkillSummary.map((row) => (
              <li
                key={row.skillId}
                className="flex items-center justify-between rounded-md bg-white px-2 py-1 ring-1 ring-slate-100"
              >
                <span className="font-medium">{row.skillId}</span>
                <span className="text-slate-500">
                  {Math.round(row.accuracy * 100)}% · {row.attempted} item
                  {row.attempted === 1 ? '' : 's'}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
