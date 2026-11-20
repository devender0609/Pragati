import type { GrowthIndicator } from '../../lib/scoring';
import {
  ASSESSMENT_WINDOW_LABELS,
  type Session,
} from '../../types';

// Prototype change indicator (v0.3+). Compares this session vs the
// student's most-recent prior session on the same skill mode and shows
// accuracy delta, misconception delta, and a hedged composite arrow.
// Confidence pill + reasons surfaced when low. Extracted from App.tsx
// in v0.14.
export function GrowthCard({
  growth,
  session,
}: {
  growth: GrowthIndicator;
  session: Session;
}) {
  const arrow =
    growth.direction === 'up' ? '↑' : growth.direction === 'down' ? '↓' : '→';
  const tone =
    growth.direction === 'up'
      ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
      : growth.direction === 'down'
        ? 'bg-rose-50 text-rose-700 ring-rose-200'
        : 'bg-slate-50 text-slate-700 ring-slate-200';
  const accPct = Math.round(growth.accuracyDelta * 100);
  const misPct = Math.round(growth.misconceptionDelta * 100);
  return (
    <div className="card">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="text-lg font-semibold text-slate-900">
          Prototype change indicator
        </h2>
        <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700 ring-1 ring-amber-200">
          Early signal · not calibrated growth
        </span>
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ${
            growth.confidence === 'low'
              ? 'bg-rose-50 text-rose-700 ring-rose-200'
              : 'bg-slate-50 text-slate-700 ring-slate-200'
          }`}
        >
          Confidence: {growth.confidence}
        </span>
      </div>
      <p className="mt-1 text-sm text-slate-600">
        Comparing this {ASSESSMENT_WINDOW_LABELS[session.window].toLowerCase()}{' '}
        session against {session.studentSnapshot.name}'s most recent prior
        session on the same skill.
      </p>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <DeltaCell
          label="Accuracy change"
          prior={`${Math.round(growth.prevSummary.accuracy * 100)}%`}
          current={`${Math.round(growth.currentSummary.accuracy * 100)}%`}
          deltaText={`${accPct >= 0 ? '+' : '−'}${Math.abs(accPct)} pts`}
          deltaPositive={accPct > 0}
          deltaNegative={accPct < 0}
        />
        <DeltaCell
          label="Misconception change"
          prior={`${Math.round(growth.prevSummary.misconceptionRate * 100)}%`}
          current={`${Math.round(growth.currentSummary.misconceptionRate * 100)}%`}
          deltaText={`${misPct >= 0 ? '+' : '−'}${Math.abs(misPct)} pts`}
          deltaPositive={misPct < 0}
          deltaNegative={misPct > 0}
        />
        <CompositeCell
          arrow={arrow}
          tone={tone}
          direction={growth.direction}
          composite={growth.composite}
        />
      </div>

      <p className={`mt-4 rounded-xl p-3 text-sm ring-1 ${tone}`}>
        {growth.summary}
      </p>

      {growth.confidence === 'low' && growth.confidenceReasons.length > 0 && (
        <ul className="mt-3 list-inside list-disc text-xs text-slate-600">
          {growth.confidenceReasons.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ul>
      )}

      <p className="mt-4 text-xs text-slate-500">
        Headline figures are accuracy change and misconception change between
        the two sessions (compared only against prior attempts on the{' '}
        <span className="font-medium">same skill mode</span>). The "prototype
        change indicator" combines both with the average difficulty attempted
        into a single hedged direction. None of these are a calibrated growth
        measurement — they are an early signal on a small item bank, useful
        for a teacher conversation, not for placement or reporting.
      </p>
    </div>
  );
}

function CompositeCell({
  arrow,
  tone,
  direction,
  composite,
}: {
  arrow: string;
  tone: string;
  direction: 'up' | 'down' | 'flat';
  composite: number;
}) {
  const directionLabel =
    direction === 'up'
      ? 'Early signal: improving'
      : direction === 'down'
        ? 'Early signal: regressing'
        : 'Roughly flat';
  return (
    <div className={`flex flex-col rounded-xl p-4 ring-1 ${tone}`}>
      <div className="text-xs font-medium uppercase tracking-wide opacity-80">
        Prototype change indicator
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-3xl font-bold">{arrow}</span>
        <span className="text-sm font-semibold">{directionLabel}</span>
      </div>
      <div className="mt-1 text-xs opacity-80">
        composite {composite >= 0 ? '+' : '−'}
        {Math.abs(composite).toFixed(2)} (−1…+1)
      </div>
    </div>
  );
}

function DeltaCell({
  label,
  prior,
  current,
  deltaText,
  deltaPositive,
  deltaNegative,
}: {
  label: string;
  prior: string;
  current: string;
  deltaText: string;
  deltaPositive?: boolean;
  deltaNegative?: boolean;
}) {
  const tone = deltaPositive
    ? 'text-emerald-700'
    : deltaNegative
      ? 'text-rose-700'
      : 'text-slate-600';
  return (
    <div className="flex-1 rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
      <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </div>
      <div className="mt-2 flex items-baseline gap-2 text-slate-900">
        <span className="text-base font-semibold text-slate-500">{prior}</span>
        <span className="text-slate-400">→</span>
        <span className="text-xl font-bold">{current}</span>
      </div>
      <div className={`mt-1 text-xs font-semibold ${tone}`}>{deltaText}</div>
    </div>
  );
}
