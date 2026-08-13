// v0.47 F — Design primitive: chapter card.
//
// The unit repeated across the Learn tab catalogue. Left-hand SVG
// artwork (grade-tinted), title, status badge, primary action.

import type { ReactNode } from 'react';
import { RADIUS, ELEVATION, MOTION, TYPE, FOCUS_RING } from '../tokens';
import { StatusBadge } from './StatusBadge';
import type { DerivedStatus } from '../../curriculum/inventory';

export function ChapterCard({
  title,
  subtitle,
  status,
  statusReasons,
  artwork,
  ctaLabel,
  disabled = false,
  onClick,
}: {
  title: ReactNode;
  subtitle: ReactNode;
  status: DerivedStatus;
  statusReasons?: string[];
  artwork: ReactNode;
  ctaLabel: string;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={typeof title === 'string' ? title : undefined}
      className={`group flex w-full items-center gap-3 bg-white text-left ring-1 ring-slate-200 ${RADIUS.xl} ${ELEVATION.card} p-3 sm:p-4 ${MOTION.base} ${FOCUS_RING} hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-card`}
    >
      <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-50 sm:h-20 sm:w-20">
        {artwork}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <h3 className={`${TYPE.h3} text-slate-900 truncate`}>{title}</h3>
          <StatusBadge status={status} title={statusReasons?.join(' ')} />
        </div>
        <p className="mt-0.5 text-xs text-slate-500 line-clamp-2">
          {subtitle}
        </p>
        <span className="mt-1.5 inline-block text-xs font-semibold text-brand-700 group-hover:underline">
          {ctaLabel} →
        </span>
      </div>
    </button>
  );
}
