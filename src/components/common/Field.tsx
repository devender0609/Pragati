// Field — label + optional required marker + child input. Used by
// StartForm, AssignmentForm helper sections, PilotSetupView, and item
// review forms. Extracted from App.tsx in v0.14.
export function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">
        {label}
        {required && <span className="ml-0.5 text-rose-500">*</span>}
      </span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
