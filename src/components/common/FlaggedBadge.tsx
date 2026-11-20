import { isItemFlagged } from '../../lib/workflow';

// FlaggedBadge — shown next to an item when it has audit flags or low
// alignment confidence. Doesn't block the item; just makes the warning
// visible. Used in: item review list, alignment review item table,
// assessment preview, teaching-plan recommended items, export summary.
// Extracted from App.tsx in v0.12.
export function FlaggedBadge({
  itemId,
  compact,
}: {
  itemId: string;
  compact?: boolean;
}) {
  if (!isItemFlagged(itemId)) return null;
  if (compact) {
    return (
      <span
        className="inline-flex items-center rounded-full bg-rose-50 px-1.5 py-0.5 text-[10px] font-semibold text-rose-700 ring-1 ring-rose-200"
        title="This item has audit flags or low alignment confidence — teacher review recommended."
      >
        ⚠ Flagged
      </span>
    );
  }
  return (
    <span
      className="inline-flex items-center rounded-full bg-rose-50 px-2 py-0.5 text-xs font-semibold text-rose-700 ring-1 ring-rose-200"
      title="This item has audit flags or low alignment confidence — teacher review recommended."
    >
      ⚠ Flagged · teacher review recommended
    </span>
  );
}
