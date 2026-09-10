// v0.25: TabBar component extracted from TeacherWorkflowHome.tsx.

export type TabId = 'today' | 'pilot' | 'admin';

export const TAB_LABELS: Record<TabId, string> = {
  today: 'Today',
  pilot: 'Pilot setup',
  admin: 'Admin & validation',
};

export function TabBar({
  tab,
  onSwitch,
  badges,
}: {
  tab: TabId;
  onSwitch: (t: TabId) => void;
  badges: Record<TabId, number>;
}) {
  return (
    <nav
      role="tablist"
      className="inline-flex flex-wrap gap-1 rounded-xl bg-slate-100 p-1 text-sm font-semibold"
    >
      {(Object.keys(TAB_LABELS) as TabId[]).map((t) => {
        const active = t === tab;
        const badge = badges[t];
        return (
          <button
            key={t}
            role="tab"
            aria-selected={active}
            onClick={() => onSwitch(t)}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition ${
              active
                ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {TAB_LABELS[t]}
            {badge > 0 && (
              <span
                className={`inline-flex items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                  active
                    ? 'bg-brand-100 text-brand-700'
                    : 'bg-slate-300 text-slate-700'
                }`}
                aria-label={`${badge} item${badge === 1 ? '' : 's'} needing attention`}
              >
                {badge}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}
