// v0.44 — Empty-state card.
//
// A friendly card shown when a list has nothing in it yet — student
// with no sessions, teacher classroom with no roster, picker with
// no student selected, etc. Every empty state now has one place
// per app: a headline, one line of context, and a primary action.

import type { ReactNode } from 'react';

export function EmptyState({
  title,
  message,
  icon,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  tone = 'neutral',
}: {
  title: string;
  message: ReactNode;
  icon?: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  tone?: 'neutral' | 'positive' | 'warning';
}) {
  const toneClass =
    tone === 'positive'
      ? 'border-emerald-200 bg-emerald-50'
      : tone === 'warning'
      ? 'border-amber-200 bg-amber-50'
      : 'border-slate-200 bg-slate-50';
  return (
    <div
      className={`rounded-2xl border ${toneClass} p-6 text-center sm:p-8`}
    >
      {icon && (
        <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-slate-200 text-lg">
          {icon}
        </div>
      )}
      <h2 className="text-base font-semibold text-slate-900 sm:text-lg">
        {title}
      </h2>
      <div className="mx-auto mt-1 max-w-md text-sm text-slate-600">
        {message}
      </div>
      {(onAction || onSecondaryAction) && (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          {actionLabel && onAction && (
            <button onClick={onAction} className="btn-primary">
              {actionLabel}
            </button>
          )}
          {secondaryActionLabel && onSecondaryAction && (
            <button
              onClick={onSecondaryAction}
              className="btn-secondary"
            >
              {secondaryActionLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
