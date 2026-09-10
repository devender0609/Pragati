// v0.47 F — Design primitive: page header.
//
// One consistent header per screen. Renders eyebrow · title ·
// subtitle · optional trailing action. Consumed by StudentShell
// tabs, ChapterLandingPage, CurriculumCoverageView, etc.

import type { ReactNode } from 'react';
import { TYPE } from '../tokens';

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  trailing,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  trailing?: ReactNode;
}) {
  return (
    <header className="mb-4 flex flex-wrap items-start justify-between gap-3">
      <div className="min-w-0 flex-1">
        {eyebrow && <div className={TYPE.eyebrow}>{eyebrow}</div>}
        <h1 className={`${TYPE.h1} mt-1 text-slate-900`}>{title}</h1>
        {subtitle && (
          <p className="mt-1 max-w-3xl text-sm text-slate-600">{subtitle}</p>
        )}
      </div>
      {trailing && <div className="shrink-0">{trailing}</div>}
    </header>
  );
}
