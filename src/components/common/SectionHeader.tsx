// SectionHeader — consistent h-section heading + optional subtitle used
// across teacher views. Extracted from App.tsx in v0.13.
export function SectionHeader({
  title,
  subtitle,
  rightSlot,
}: {
  title: string;
  subtitle?: string;
  rightSlot?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="h-section">{title}</h2>
        {subtitle && (
          <p className="mt-1 text-sm text-slate-600">{subtitle}</p>
        )}
      </div>
      {rightSlot && <div className="flex flex-wrap gap-2">{rightSlot}</div>}
    </div>
  );
}
