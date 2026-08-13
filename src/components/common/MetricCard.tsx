// MetricCard — small uppercase-label + bold-number tile used across teacher
// dashboards (Class6MathDashboard, AssignmentsView, PilotReportView, etc.).
// Pure presentation, no behavior. Extracted from App.tsx in v0.12.
export function MetricCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-white p-4 ring-1 ring-slate-200">
      <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </div>
      <div className="mt-1 text-2xl font-bold text-slate-900">{value}</div>
    </div>
  );
}
