// v0.44 — Simple breadcrumb component.
//
// Renders a horizontal "Home / Section / Detail" trail with the
// non-terminal entries clickable. Used at the top of Assessment,
// Results, Learn, and per-student teacher views so students and
// teachers always know where they are and how to get back.

import type { ReactNode } from 'react';

export type Crumb = {
  label: ReactNode;
  onClick?: () => void; // omit for the current (last) crumb
};

export function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  if (crumbs.length === 0) return null;
  return (
    <nav
      aria-label="Breadcrumb"
      className="mb-3 flex flex-wrap items-center gap-1 text-xs text-slate-500 sm:text-sm"
    >
      {crumbs.map((c, i) => {
        const isLast = i === crumbs.length - 1;
        return (
          <span key={i} className="flex items-center gap-1">
            {c.onClick && !isLast ? (
              <button
                onClick={c.onClick}
                className="rounded px-1 text-slate-600 hover:bg-slate-100 hover:text-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
              >
                {c.label}
              </button>
            ) : (
              <span
                className={
                  isLast
                    ? 'font-semibold text-slate-900'
                    : 'text-slate-600'
                }
                aria-current={isLast ? 'page' : undefined}
              >
                {c.label}
              </span>
            )}
            {!isLast && (
              <span className="text-slate-300" aria-hidden="true">
                /
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
