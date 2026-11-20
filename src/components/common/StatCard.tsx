// StatCard — small uppercase-label + colour-customisable value tile used
// across results and dashboards. Differs from MetricCard in that the value
// can be coloured (e.g. emerald for "above target", rose for "below").
// Extracted from App.tsx in v0.13.
export function StatCard({
  label,
  value,
  valueClass,
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
      <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </div>
      <div
        className={`mt-1 inline-block rounded-lg px-2 py-0.5 text-xl font-bold ${
          valueClass ?? 'text-slate-900'
        }`}
      >
        {value}
      </div>
    </div>
  );
}
