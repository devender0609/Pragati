// v0.75 §11/§19 — THE TEACHER DESKTOP, DESIGNED AS A DESKTOP.
//
// WHAT WAS WRONG
//
// At 1440 every teacher screen was a centred column roughly 768px wide
// with ~340px of empty slate on each side. The navigation was a row of
// pills in the header that scrolled away, the class selector was a bare
// `<select>` tucked beside it, and the working area had no context
// beside it — so a teacher checking what to assign had to leave the
// screen to see what curriculum existed.
//
// v0.74 said plainly that no teacher screen was redesigned. v0.75 §11
// says that cannot slip again, and §33 makes it an acceptance
// threshold: if Teacher still looks like v0.74, the release is not
// visually successful.
//
// WHAT THIS COMPONENT DOES
//
// It provides the composition, not the content: a persistent left rail
// carrying navigation and class scope, a working area that uses the
// width it is given, and an optional context column for curriculum and
// activity that belongs beside the work rather than under it.
//
// Below `lg` it collapses to exactly what shipped before — the bottom
// nav and a single column — because the phone layout was not the
// problem and rebuilding it would risk a screen that works.
//
// WHY A LAYOUT COMPONENT RATHER THAN CLASSES ON EACH SCREEN
//
// Six teacher screens each choosing their own max-width is how the
// centred column happened in the first place. The composition is
// declared once, here, and a screen opts into it by rendering children
// and an optional `context`.

import type { ReactNode } from 'react';
import { LAYOUT } from '../../design/tokens';
import type { NavItem } from '../../design/primitives/BottomNavigation';

export type TeacherWorkspaceProps<T extends string> = {
  items: NavItem<T>[];
  active: T;
  onSelect: (id: T) => void;
  /** Class scope. Rendered in the rail on desktop, in the header on phones. */
  scopeControl?: ReactNode;
  /** The screen's own heading block. */
  header?: ReactNode;
  /** The working area. */
  children: ReactNode;
  /**
   * Curriculum / activity context that belongs BESIDE the work.
   *
   * Optional by design: a screen with nothing genuinely contextual must
   * not invent a third column to fill space. When absent the working
   * area takes the full width rather than leaving a gap.
   */
  context?: ReactNode;
  /** Secondary tools, kept out of the daily flow. */
  footerTools?: ReactNode;
};

export function TeacherWorkspace<T extends string>({
  items,
  active,
  onSelect,
  scopeControl,
  header,
  children,
  context,
  footerTools,
}: TeacherWorkspaceProps<T>) {
  return (
    <div className={LAYOUT.workspace}>
      {/* ---- Left rail. Desktop only; the phone keeps its bottom nav. ---- */}
      <aside className="hidden lg:sticky lg:top-4 lg:block lg:self-start">
        <nav
          aria-label="Teacher sections"
          className="rounded-2xl bg-white p-2 shadow-card ring-1 ring-slate-200/80"
        >
          <p className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Teacher
          </p>
          <ul className="space-y-0.5">
            {items.map((item) => {
              const isActive = item.id === active;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => onSelect(item.id)}
                    aria-current={isActive ? 'page' : undefined}
                    className={[
                      'flex min-h-[44px] w-full items-center gap-2.5 rounded-xl px-3 text-left text-sm font-semibold transition duration-150',
                      'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
                      isActive
                        ? 'bg-brand-50 text-brand-800 ring-1 ring-brand-200'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
                    ].join(' ')}
                  >
                    <span
                      aria-hidden
                      className={isActive ? 'text-brand-600' : 'text-slate-400'}
                    >
                      {item.icon}
                    </span>
                    {item.label}
                  </button>
                </li>
              );
            })}
          </ul>

          {scopeControl && (
            <div className="mt-2 border-t border-slate-200 px-3 pb-2 pt-3">
              {scopeControl}
            </div>
          )}
        </nav>

        {footerTools && <div className="mt-3">{footerTools}</div>}
      </aside>

      {/* ---- Working area ---- */}
      <div className="min-w-0 space-y-4">
        {header}
        {context ? (
          // §19 — context sits BESIDE the work at xl, not underneath it.
          // Below xl it stacks, because two columns inside a already
          // narrowed main area produces two cramped columns.
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_18rem] xl:items-start">
            <div className="min-w-0 space-y-4">{children}</div>
            <div className="space-y-3 xl:sticky xl:top-4">{context}</div>
          </div>
        ) : (
          <div className="space-y-4">{children}</div>
        )}
      </div>
    </div>
  );
}
