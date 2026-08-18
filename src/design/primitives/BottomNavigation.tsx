// v0.47 F — Design primitive: bottom / side navigation.
//
// Renders 4-tab bottom nav on mobile and left-aligned pill nav on
// ≥sm. One component drives both breakpoints — no separate mobile
// component to maintain.

import type { ReactNode } from 'react';
import { FOCUS_RING, MOTION } from '../tokens';

export type NavItem<Id extends string> = {
  id: Id;
  label: string;
  icon: ReactNode;
  badge?: number;
};

export function BottomNavigation<Id extends string>({
  items,
  active,
  onSelect,
  disabled = false,
}: {
  items: NavItem<Id>[];
  active: Id;
  onSelect: (id: Id) => void;
  /** v0.49 §2 — set while an assessment is in progress. A disabled tab
   *  is genuinely inert and announced as such; we never render a
   *  control that looks clickable but does nothing. */
  disabled?: boolean;
}) {
  return (
    <>
      {/* Bottom nav — mobile only. */}
      <nav
        role="tablist"
        aria-label="Primary navigation"
        className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 backdrop-blur sm:hidden"
      >
        <div className="mx-auto flex max-w-lg items-stretch justify-around">
          {items.map((item) => {
            const isActive = item.id === active;
            return (
              <button
                key={item.id}
                role="tab"
                aria-selected={isActive}
                disabled={disabled}
                aria-disabled={disabled || undefined}
                onClick={() => onSelect(item.id)}
                className={`flex min-h-[44px] flex-1 flex-col items-center gap-0.5 px-1 py-2 text-[11px] font-medium ${MOTION.fast} ${FOCUS_RING} ${
                  disabled ? 'cursor-not-allowed opacity-40' : ''
                } ${
                  isActive
                    ? 'text-brand-700'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <span
                  className={`relative flex h-6 w-6 items-center justify-center ${
                    isActive ? 'text-brand-700' : 'text-slate-500'
                  }`}
                >
                  {item.icon}
                  {typeof item.badge === 'number' && item.badge > 0 && (
                    <span
                      className="absolute -right-2 -top-1 inline-flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-rose-600 px-1 text-[9px] font-bold text-white"
                      aria-label={`${item.badge} unread`}
                    >
                      {item.badge > 99 ? '99+' : item.badge}
                    </span>
                  )}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
      {/* Spacer to prevent bottom nav from covering the last item. */}
      <div className="h-16 sm:hidden" aria-hidden="true" />
    </>
  );
}

/** Desktop / tablet horizontal nav — sits above content on ≥sm. */
export function DesktopNavigation<Id extends string>({
  items,
  active,
  onSelect,
}: {
  items: NavItem<Id>[];
  active: Id;
  onSelect: (id: Id) => void;
}) {
  return (
    <nav
      role="tablist"
      aria-label="Primary navigation"
      className="hidden flex-wrap gap-1 rounded-xl bg-white p-1 text-sm font-semibold ring-1 ring-slate-200 sm:inline-flex"
    >
      {items.map((item) => {
        const isActive = item.id === active;
        return (
          <button
            key={item.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelect(item.id)}
            className={`inline-flex min-h-[44px] items-center gap-1.5 rounded-lg px-3 py-1.5 ${MOTION.fast} ${FOCUS_RING} ${
              isActive
                ? 'bg-brand-50 text-brand-700 ring-1 ring-brand-200'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <span className="hidden text-brand-500 sm:inline">{item.icon}</span>
            {item.label}
            {typeof item.badge === 'number' && item.badge > 0 && (
              <span className="inline-flex items-center justify-center rounded-full bg-brand-100 px-1.5 py-0.5 text-[10px] font-bold text-brand-700">
                {item.badge}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}
