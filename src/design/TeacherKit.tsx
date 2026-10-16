// ===========================================================================
// v0.78 §6/§25 — THE TEACHER KIT.
//
// Same brand as the Student Studio, different register. The student
// product is expressive because a twelve-year-old has to want to open
// it; a teacher opens this between two lessons with a class waiting, and
// what they need is to find the thing and act on it.
//
// So the Teacher register is:
//
//   ink type on paper, as Student — but no dark studio fields. The
//   dark canvas is where mathematics is manipulated at working size,
//   and Teacher does not manipulate mathematics, it manages teaching.
//   Borrowing the field here would be Student Studio pasted into a
//   dashboard, which §6 names as the failure to avoid.
//
//   Anek for headings, Inter for everything else, exactly as Student.
//
//   colour carries meaning only. Learn / practice / attention / progress
//   keep their student semantics so a teacher and a student reading the
//   same chapter see the same hue. Nothing is coloured for interest.
//
//   density is higher and ornament is lower. No artwork at hero scale,
//   no lattice, no gradient. A teacher screen that draws attention to
//   itself is a teacher screen getting in the way.
//
// These five components came out of the six screens rather than being
// designed ahead of them, which is why there are five and not fifteen.
// ===========================================================================

import type { ReactNode } from 'react';

/**
 * The heading of a teacher destination.
 *
 * No eyebrow slot — the same reason the student product dropped it in
 * v0.76. A tracked all-caps label above every heading is the commonest
 * tell of template design, and Teacher had one on every card.
 */
export function TeacherPageHeader({
  title,
  detail,
  scope,
  action,
}: {
  title: string;
  detail?: string;
  /** Which class these numbers describe. Stated, never assumed. */
  scope?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
      <div className="min-w-0">
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink-900 lg:text-3xl">
          {title}
        </h1>
        {detail ? (
          <p className="mt-2 max-w-[68ch] text-sm leading-relaxed text-ink-500">
            {detail}
          </p>
        ) : null}
        {scope ? (
          <p className="mt-2 text-sm text-ink-400">
            Showing: <span className="font-semibold text-ink-700">{scope}</span>
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

/**
 * A working panel. White on paper, one hairline, no shadow stack.
 *
 * `tone` tints the header strip only, so a screen can group panels by
 * meaning without turning into six coloured boxes.
 */
export function TeacherPanel({
  title,
  detail,
  tone = 'neutral',
  action,
  children,
  className = '',
}: {
  title?: string;
  detail?: string;
  tone?: 'neutral' | 'learn' | 'practice' | 'attention' | 'progress';
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  const bar: Record<string, string> = {
    neutral: 'text-ink-900',
    learn: 'text-learn-800',
    practice: 'text-practice-800',
    attention: 'text-attend-800',
    progress: 'text-progress-800',
  };
  return (
    <section
      className={`rounded-2xl bg-white p-5 ring-1 ring-ink-100 sm:p-6 ${className}`}
    >
      {title ? (
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
          <h2 className={`font-display text-lg font-bold ${bar[tone]}`}>
            {title}
          </h2>
          {action}
        </div>
      ) : null}
      {detail ? (
        <p className="mt-1.5 max-w-[72ch] text-sm leading-relaxed text-ink-500">
          {detail}
        </p>
      ) : null}
      <div className={title || detail ? 'mt-4' : ''}>{children}</div>
    </section>
  );
}

/**
 * What a teacher does when there is nothing yet.
 *
 * §9/§19 — a dashboard of zeros tells a teacher five times that there is
 * nothing and offers nothing to do about it. Emptiness is a workflow
 * state: it has obvious next steps, and this component's whole job is to
 * make those the largest thing on the screen.
 */
export function TeacherEmptyState({
  title,
  detail,
  actions,
}: {
  title: string;
  detail: string;
  actions: Array<{ label: string; onClick: () => void; primary?: boolean }>;
}) {
  return (
    <div className="rounded-2xl bg-paper-200/70 p-6 sm:p-8">
      <h2 className="font-display text-xl font-bold text-ink-900">{title}</h2>
      <p className="mt-2 max-w-[62ch] leading-relaxed text-ink-500">{detail}</p>
      <div className="mt-5 flex flex-wrap gap-3">
        {actions.map((a) => (
          <button
            key={a.label}
            type="button"
            onClick={a.onClick}
            className={`tap rounded-full px-5 py-2.5 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 ${
              a.primary
                ? 'bg-ink-900 text-white hover:bg-ink-800'
                : 'bg-white text-ink-800 ring-1 ring-ink-200 hover:bg-paper-100'
            }`}
          >
            {a.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * A counted fact.
 *
 * Deliberately not a "metric card": three bordered boxes carrying three
 * integers is the shape that made every teacher screen look like a
 * dashboard about nothing. A number and what it counts, set inline.
 */
export function TeacherStat({
  value,
  label,
  hint,
}: {
  value: number | string;
  label: string;
  hint?: string;
}) {
  return (
    <div className="min-w-[8rem]">
      <p className="num font-display text-3xl font-extrabold leading-none text-ink-900">
        {value}
      </p>
      <p className="mt-1.5 text-sm font-semibold text-ink-700">{label}</p>
      {hint ? <p className="mt-0.5 text-xs text-ink-400">{hint}</p> : null}
    </div>
  );
}

/**
 * One line of "what kind of thing is this, and can I use it".
 *
 * The four kinds are not interchangeable and §12 forbids drawing them as
 * four equal choices when one of them is unavailable. `available` is the
 * only thing that changes weight; the rest is the same row.
 */
export function AvailabilityRow({
  title,
  detail,
  available,
  count,
  action,
}: {
  title: string;
  detail: string;
  available: boolean;
  count?: string;
  action?: ReactNode;
}) {
  return (
    <div
      className={`border-t border-ink-100 py-4 first:border-t-0 first:pt-0 ${
        available ? '' : 'opacity-70'
      }`}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <p
          className={`font-display text-base font-bold ${
            available ? 'text-ink-900' : 'text-ink-500'
          }`}
        >
          {title}
        </p>
        <p className="num text-sm text-ink-400">{count ?? (available ? '' : 'none available')}</p>
      </div>
      <p className="mt-1 max-w-[72ch] text-sm leading-relaxed text-ink-500">
        {detail}
      </p>
      {action ? <div className="mt-3">{action}</div> : null}
    </div>
  );
}
