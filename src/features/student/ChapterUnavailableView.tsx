// v0.47 A — Chapter-not-yet-available page.
//
// Rendered when a student taps a chapter card that isn't ready.
// Truthful, not a dead end, not an empty assessment.

import { Card } from '../../design/primitives/Card';
import { PageHeader } from '../../design/primitives/PageHeader';
import { SecondaryButton } from '../../design/primitives/SecondaryButton';
import { StatusBadge } from '../../design/primitives/StatusBadge';
import type { DerivedStatus } from '../../curriculum/inventory';
import { ArtPlaceholder } from '../../design/primitives/ChapterArt';

export function ChapterUnavailableView({
  chapterTitle,
  status,
  reasons,
  onBack,
}: {
  chapterTitle: string;
  status: DerivedStatus;
  reasons: string[];
  onBack: () => void;
}) {
  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="Chapter status"
        title={chapterTitle}
        subtitle="This chapter isn't ready yet. Here's what's missing."
        trailing={<StatusBadge status={status} title={reasons.join(' ')} />}
      />

      <Card>
        <div className="flex flex-wrap items-start gap-4">
          <div className="h-14 w-14 shrink-0 rounded-lg bg-slate-50 text-slate-500 flex items-center justify-center">
            <ArtPlaceholder />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-semibold text-slate-900">
              Why it's not ready
            </h3>
            <ul className="mt-2 list-disc pl-5 text-sm text-slate-700 space-y-1">
              {reasons.length === 0 ? (
                <li>No mapped Pragati content for this chapter yet.</li>
              ) : (
                reasons.map((r, i) => <li key={i}>{r}</li>)
              )}
            </ul>
            <p className="mt-3 text-xs text-slate-500">
              Pragati only launches a chapter for practice when it has enough
              hand-authored lessons, worked examples, and items. Empty
              chapters cannot be started — that's a safety rule, not a bug.
            </p>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <SecondaryButton onClick={onBack}>← Back to chapters</SecondaryButton>
        </div>
      </Card>
    </div>
  );
}
