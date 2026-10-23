import { useMemo, useState } from 'react';
import { ITEMS } from '../data/items';
import {
  buildItemQualityById,
  flagCounts,
  FLAG_LABELS,
  type ItemQualityFlag,
} from '../lib/itemQuality';
import {
  buildReviewPriorityById,
  priorityCounts,
  REVIEW_PRIORITY_CLASSES,
  REVIEW_PRIORITY_LABELS,
  topPriorityItems,
  type ReviewPriority,
} from '../lib/reviewPriority';
import {
  getItemReview,
  loadItemReviews,
  loadSessions,
  newItemReview,
  reviewStatusCounts,
  saveItemReview,
} from '../lib/storage';
import {
  MODULE_FOR_SKILL,
  MODULE_IDS_ORDERED,
  MODULE_LABELS,
  type DifficultyRating,
  type ItemReview,
  type ItemReviewStatus,
  type ModuleId,
  type YesNo,
  type YesNoNa,
} from '../types';
import { Field } from './common/Field';
import { FlaggedBadge } from './common/FlaggedBadge';
import { SkillChip } from './common/SkillChip';
import { VisualRenderer } from './common/VisualRenderer';
import { MathText } from './common/MathText';
import {
  approveItem,
  unapproveItem,
  useIsApproved,
} from '../lib/itemApprovals';

// Item Review (v0.8) — list of all 304 items with status filter, module
// filter, quality-flag filter, and free-text search; opens an in-place
// review form. Extracted from App.tsx in v0.14. Behavior unchanged.
export function ItemReviewView({
  currentItemId,
  onSelectItem,
  onBackToList,
  onBack,
  onSaved,
}: {
  currentItemId: string | null;
  onSelectItem: (id: string) => void;
  onBackToList: () => void;
  onBack: () => void;
  onSaved: () => void;
}) {
  const [statusFilter, setStatusFilter] = useState<'all' | ItemReviewStatus>(
    'all'
  );
  const [moduleFilter, setModuleFilter] = useState<'all' | ModuleId>('all');
  const [flagFilter, setFlagFilter] = useState<'all' | ItemQualityFlag>('all');
  // v0.25 — priority filter. 'all' shows every item; 'high'/'medium'/'low'
  // restrict by bucket; 'next10' shows the top 10 highest-priority items
  // globally (quick "what to look at next").
  const [priorityFilter, setPriorityFilter] = useState<
    'all' | ReviewPriority | 'next10'
  >('all');
  const [search, setSearch] = useState('');

  // Reload reviews + recompute quality whenever the list view re-mounts.
  const reviews = useMemo(() => loadItemReviews(), []);
  const reviewsById = useMemo(
    () => new Map(reviews.map((r) => [r.itemId, r])),
    [reviews]
  );
  const sessionsForQuality = useMemo(() => loadSessions(), [reviews]);
  const qualityById = useMemo(
    () => buildItemQualityById(sessionsForQuality, reviews, ITEMS),
    [reviews, sessionsForQuality]
  );
  // v0.25 — per-item priority summary + counts + top-10 IDs.
  const priorityById = useMemo(
    () => buildReviewPriorityById(sessionsForQuality, reviews, ITEMS),
    [reviews, sessionsForQuality]
  );
  const priorityTally = useMemo(
    () => priorityCounts(Object.values(priorityById)),
    [priorityById]
  );
  const next10Ids = useMemo(
    () =>
      new Set(topPriorityItems(ITEMS, priorityById, 10).map((it) => it.id)),
    [priorityById]
  );

  if (currentItemId) {
    return (
      <ItemReviewForm
        itemId={currentItemId}
        onCancel={onBackToList}
        onSaved={() => {
          onSaved();
          onBackToList();
        }}
      />
    );
  }

  const filteredItems = ITEMS.filter((it) => {
    const review = reviewsById.get(it.id);
    const status: ItemReviewStatus = review?.status ?? 'not_reviewed';
    if (statusFilter !== 'all' && status !== statusFilter) return false;
    if (
      moduleFilter !== 'all' &&
      MODULE_FOR_SKILL[it.skillId] !== moduleFilter
    ) {
      return false;
    }
    if (flagFilter !== 'all') {
      const q = qualityById[it.id];
      if (!q || !q.flags.includes(flagFilter)) return false;
    }
    // v0.25 — priority filter.
    if (priorityFilter !== 'all') {
      if (priorityFilter === 'next10') {
        if (!next10Ids.has(it.id)) return false;
      } else {
        const p = priorityById[it.id];
        if (!p || p.priority !== priorityFilter) return false;
      }
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      if (
        !it.id.toLowerCase().includes(q) &&
        !it.stem.toLowerCase().includes(q)
      ) {
        return false;
      }
    }
    return true;
  });

  const counts = reviewStatusCounts(reviews);
  const allFlagCounts = flagCounts(Object.values(qualityById));

  // v0.25 — sort filtered items so the most urgent show up first.
  // For 'next10' and per-priority filters, ordering by priority+score is
  // meaningful. For other filters, item bank order is preserved by the
  // stable sort.
  const priorityRank: Record<ReviewPriority, number> = {
    high: 2,
    medium: 1,
    low: 0,
  };
  const sortedFilteredItems = [...filteredItems].sort((a, b) => {
    const pa = priorityById[a.id];
    const pb = priorityById[b.id];
    if (!pa || !pb) return 0;
    if (priorityRank[pa.priority] !== priorityRank[pb.priority]) {
      return priorityRank[pb.priority] - priorityRank[pa.priority];
    }
    if (pa.score !== pb.score) return pb.score - pa.score;
    return a.id.localeCompare(b.id);
  });

  return (
    <div className="space-y-6">
      <div>
        <button
          onClick={onBack}
          className="inline-flex min-h-[44px] items-center text-sm font-medium text-slate-500 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        >
          ← Teacher dashboard
        </button>
      </div>

      <div className="rounded-3xl bg-gradient-to-br from-slate-50 via-white to-brand-50 p-6 ring-1 ring-slate-200 sm:p-8">
        <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Quality control · Item review
        </div>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Walk the bank, item by item.
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
          For each item: verify the correct answer, flag wording or visual
          issues, mark the difficulty, and add comments. Reviews are stored
          on this device and appear in the JSON export.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <ReviewStatusTile
            label="Approved"
            value={counts.approved}
            total={ITEMS.length}
            tone="emerald"
          />
          <ReviewStatusTile
            label="Needs revision"
            value={counts.needs_revision}
            total={ITEMS.length}
            tone="rose"
          />
          <ReviewStatusTile
            label="Not reviewed"
            value={counts.not_reviewed}
            total={ITEMS.length}
            tone="slate"
          />
        </div>
      </div>

      <div className="card">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Search items">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Item ID or stem text"
              className="form-input"
            />
          </Field>
          <Field label="Filter by status">
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as 'all' | ItemReviewStatus)
              }
              className="form-input"
            >
              <option value="all">All statuses</option>
              <option value="not_reviewed">Not reviewed</option>
              <option value="needs_revision">Needs revision</option>
              <option value="approved">Approved</option>
            </select>
          </Field>
          <Field label="Filter by module">
            <select
              value={moduleFilter}
              onChange={(e) =>
                setModuleFilter(e.target.value as 'all' | ModuleId)
              }
              className="form-input"
            >
              <option value="all">All modules</option>
              {MODULE_IDS_ORDERED.map((m) => (
                <option key={m} value={m}>
                  {MODULE_LABELS[m]}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Filter by quality flag">
            <select
              value={flagFilter}
              onChange={(e) =>
                setFlagFilter(e.target.value as 'all' | ItemQualityFlag)
              }
              className="form-input"
            >
              <option value="all">No flag filter</option>
              {(Object.keys(allFlagCounts) as ItemQualityFlag[]).map((f) => (
                <option key={f} value={f}>
                  {FLAG_LABELS[f]} ({allFlagCounts[f]})
                </option>
              ))}
            </select>
          </Field>
          <Field label="Filter by review priority">
            <select
              value={priorityFilter}
              onChange={(e) =>
                setPriorityFilter(
                  e.target.value as 'all' | ReviewPriority | 'next10'
                )
              }
              className="form-input"
            >
              <option value="all">
                All priorities (H {priorityTally.high} / M {priorityTally.medium} / L {priorityTally.low})
              </option>
              <option value="next10">Review next 10 priority items</option>
              <option value="high">
                High priority only ({priorityTally.high})
              </option>
              <option value="medium">
                Medium priority only ({priorityTally.medium})
              </option>
              <option value="low">
                Low priority only ({priorityTally.low})
              </option>
            </select>
          </Field>
        </div>
        <div className="mt-3 text-xs text-slate-500">
          Showing {sortedFilteredItems.length} of {ITEMS.length} items.{' '}
          {priorityFilter === 'next10' && (
            <span className="ml-1 text-slate-400">
              · "Next 10" is computed globally across the bank by priority
              score, not by the other filters.
            </span>
          )}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs font-medium uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-3 py-2">Item</th>
              <th className="px-3 py-2">Skill</th>
              <th className="px-3 py-2">Priority</th>
              <th className="px-3 py-2">Diff.</th>
              <th className="px-3 py-2">Attempts</th>
              <th className="px-3 py-2">Accuracy</th>
              <th className="px-3 py-2">Flags</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sortedFilteredItems.map((it) => {
              const review = reviewsById.get(it.id);
              const status: ItemReviewStatus =
                review?.status ?? 'not_reviewed';
              const q = qualityById[it.id];
              const p = priorityById[it.id];
              return (
                <tr
                  key={it.id}
                  className="cursor-pointer hover:bg-slate-50"
                  onClick={() => onSelectItem(it.id)}
                >
                  <td className="px-3 py-3 font-medium text-slate-900">
                    <div className="flex items-center gap-2">
                      <span>{it.id}</span>
                      <FlaggedBadge itemId={it.id} compact />
                    </div>
                    <div className="mt-0.5 max-w-xs truncate text-xs text-slate-500">
                      {it.stem}
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <SkillChip mode={it.skillId} />
                  </td>
                  <td className="px-3 py-3">
                    {p && (
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ${REVIEW_PRIORITY_CLASSES[p.priority]}`}
                        title={
                          p.reasons.length > 0
                            ? p.reasons.join(' · ')
                            : REVIEW_PRIORITY_LABELS[p.priority]
                        }
                      >
                        {REVIEW_PRIORITY_LABELS[p.priority]}
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-3 text-slate-700">{it.difficulty}</td>
                  <td className="px-3 py-3 text-slate-700">
                    {q?.attempts ?? 0}
                  </td>
                  <td className="px-3 py-3 text-slate-700">
                    {q && q.attempts > 0
                      ? `${Math.round(q.accuracy * 100)}%`
                      : '—'}
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex flex-wrap gap-1">
                      {q?.flags.map((f) => (
                        <span
                          key={f}
                          className="inline-flex items-center rounded-full bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700 ring-1 ring-amber-200"
                          title={FLAG_LABELS[f]}
                        >
                          {FLAG_LABELS[f]}
                        </span>
                      ))}
                      {(!q || q.flags.length === 0) && (
                        <span className="text-xs text-slate-400">—</span>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <ReviewStatusPill status={status} />
                  </td>
                  <td className="px-3 py-3 text-right">
                    <span className="text-brand-700">Open →</span>
                  </td>
                </tr>
              );
            })}
            {sortedFilteredItems.length === 0 && (
              <tr>
                <td
                  colSpan={9}
                  className="px-3 py-8 text-center text-sm text-slate-500"
                >
                  No items match the current filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ReviewStatusTile({
  label,
  value,
  total,
  tone,
}: {
  label: string;
  value: number;
  total: number;
  tone: 'emerald' | 'rose' | 'slate';
}) {
  const ring =
    tone === 'emerald'
      ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
      : tone === 'rose'
        ? 'border-rose-200 bg-rose-50 text-rose-900'
        : 'border-slate-200 bg-slate-50 text-slate-900';
  return (
    <div className={`rounded-2xl border p-4 ${ring}`}>
      <div className="text-xs font-semibold uppercase tracking-wide opacity-80">
        {label}
      </div>
      <div className="mt-1 flex items-baseline gap-2">
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-xs opacity-70">of {total}</div>
      </div>
    </div>
  );
}

function ReviewStatusPill({ status }: { status: ItemReviewStatus }) {
  const tone =
    status === 'approved'
      ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
      : status === 'needs_revision'
        ? 'bg-rose-50 text-rose-700 ring-rose-200'
        : 'bg-slate-100 text-slate-600 ring-slate-200';
  const label =
    status === 'approved'
      ? 'Approved'
      : status === 'needs_revision'
        ? 'Needs revision'
        : 'Not reviewed';
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ring-1 ${tone}`}
    >
      {label}
    </span>
  );
}

function ItemReviewForm({
  itemId,
  onCancel,
  onSaved,
}: {
  itemId: string;
  onCancel: () => void;
  onSaved: () => void;
}) {
  const item = useMemo(() => ITEMS.find((it) => it.id === itemId), [itemId]);
  const existing = useMemo(
    () => getItemReview(itemId) ?? newItemReview(itemId),
    [itemId]
  );
  const [status, setStatus] = useState<ItemReviewStatus>(existing.status);
  const [correctAnswerVerified, setCorrectAnswerVerified] = useState<
    YesNo | null
  >(existing.correctAnswerVerified);
  const [wordingClear, setWordingClear] = useState<YesNo | null>(
    existing.wordingClear
  );
  const [gradeAppropriate, setGradeAppropriate] = useState<YesNo | null>(
    existing.gradeAppropriate
  );
  const [visualHelpful, setVisualHelpful] = useState<YesNoNa | null>(
    existing.visualHelpful
  );
  const [difficultyRating, setDifficultyRating] =
    useState<DifficultyRating | null>(existing.difficultyRating);
  const [ambiguityConcern, setAmbiguityConcern] = useState<YesNo | null>(
    existing.ambiguityConcern
  );
  const [comments, setComments] = useState(existing.comments);
  const [reviewerName, setReviewerName] = useState(
    existing.reviewerName ?? ''
  );

  if (!item) {
    return (
      <div className="card text-center">
        <div className="text-lg font-semibold text-slate-900">
          Item not found
        </div>
        <p className="mt-2 text-sm text-slate-600">
          That item may have been removed from the bank.
        </p>
        <button onClick={onCancel} className="btn-secondary mt-4">
          Back
        </button>
      </div>
    );
  }

  const handleSave = (newStatus: ItemReviewStatus) => {
    const review: ItemReview = {
      itemId: item.id,
      status: newStatus,
      correctAnswerVerified,
      wordingClear,
      gradeAppropriate,
      visualHelpful,
      difficultyRating,
      ambiguityConcern,
      comments,
      reviewerName: reviewerName.trim() || undefined,
      reviewedAt: Date.now(),
    };
    saveItemReview(review);
    onSaved();
  };

  return (
    <div className="space-y-6">
      <div>
        <button
          onClick={onCancel}
          className="inline-flex min-h-[44px] items-center text-sm font-medium text-slate-500 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        >
          ← Item review list
        </button>
      </div>

      <div className="card">
        <div className="flex flex-wrap items-center gap-2">
          <SkillChip mode={item.skillId} />
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {item.id} · seed difficulty {item.difficulty} · {item.band}
          </span>
          <ReviewStatusPill status={status} />
        </div>
        <MathText as="p" className="mt-3 text-base font-semibold text-slate-900">
          {item.stem}
        </MathText>
        {item.visual && (
          <div className="mt-3">
            <VisualRenderer visual={item.visual} />
          </div>
        )}
        {item.kind === 'mcq' && (
          <ol className="mt-3 grid gap-1.5 text-sm text-slate-700 sm:grid-cols-2">
            {item.options.map((o, i) => (
              <li
                key={i}
                className={`rounded-lg px-3 py-2 ring-1 ${
                  i === item.correctIndex
                    ? 'bg-emerald-50 ring-emerald-200'
                    : 'bg-slate-50 ring-slate-200'
                }`}
              >
                <span className="font-semibold text-slate-500">
                  {String.fromCharCode(65 + i)}.
                </span>{' '}
                {o.text}
                {i === item.correctIndex && (
                  <span className="ml-2 text-xs font-semibold text-emerald-700">
                    correct
                  </span>
                )}
              </li>
            ))}
          </ol>
        )}
        {item.kind === 'numeric' && (
          <div className="mt-3 text-xs text-slate-500">
            Numeric entry · canonical answer:{' '}
            <span className="font-semibold text-slate-700">
              {item.acceptedAnswers[0]}
            </span>{' '}
            · {item.inputHint}
          </div>
        )}
        <div className="mt-3 rounded-lg bg-white p-3 text-sm text-slate-700 ring-1 ring-slate-200">
          <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Worked solution
          </div>
          <MathText as="p" className="mt-1">{item.solution}</MathText>
        </div>
      </div>

      {/* v0.43 — one-click Approve / Unapprove. This is the durable
          teacher-review signal that upgrades the module's effective
          availability status once ≥ 75% of items are approved. */}
      <ApproveItemPanel itemId={item.id} />

      <div className="card space-y-5">
        <ReviewYesNoRow
          label="Is the correct answer verified?"
          value={correctAnswerVerified}
          onChange={setCorrectAnswerVerified}
        />
        <ReviewYesNoRow
          label="Is the wording clear and unambiguous?"
          value={wordingClear}
          onChange={setWordingClear}
        />
        <ReviewYesNoRow
          label="Is the item grade-appropriate (Class 6)?"
          value={gradeAppropriate}
          onChange={setGradeAppropriate}
        />
        <ReviewYesNoNaRow
          label="Is the visual helpful?"
          value={visualHelpful}
          onChange={setVisualHelpful}
        />
        <ReviewDifficultyRow
          label="Difficulty rating"
          value={difficultyRating}
          onChange={setDifficultyRating}
        />
        <ReviewYesNoRow
          label="Any ambiguity / multiple-correct concern?"
          value={ambiguityConcern}
          onChange={setAmbiguityConcern}
        />

        <Field label="Comments">
          <textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Wording fix suggestion, alternative phrasing, language note…"
            className="form-input min-h-[100px]"
          />
        </Field>

        <Field label="Reviewer name (optional)">
          <input
            value={reviewerName}
            onChange={(e) => setReviewerName(e.target.value)}
            placeholder="e.g., Ms. Sharma"
            className="form-input"
          />
        </Field>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => {
            setStatus('approved');
            handleSave('approved');
          }}
          className="btn-primary"
        >
          Save & mark Approved
        </button>
        <button
          onClick={() => {
            setStatus('needs_revision');
            handleSave('needs_revision');
          }}
          className="inline-flex items-center justify-center rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-rose-700 sm:px-5"
        >
          Save & flag Needs revision
        </button>
        <button onClick={() => handleSave(status)} className="btn-secondary">
          Save as draft
        </button>
        <button onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
      </div>
    </div>
  );
}

function ReviewYesNoRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: YesNo | null;
  onChange: (v: YesNo | null) => void;
}) {
  return (
    <div>
      <div className="text-sm font-medium text-slate-700">{label}</div>
      <div className="mt-1.5 flex flex-wrap gap-2">
        {(['yes', 'no'] as YesNo[]).map((v) => (
          <button
            key={v}
            onClick={() => onChange(v === value ? null : v)}
            className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${
              value === v
                ? 'bg-brand-50 text-brand-700 ring-brand-200'
                : 'bg-white text-slate-600 ring-slate-200 hover:bg-slate-50'
            }`}
          >
            {v === 'yes' ? 'Yes' : 'No'}
          </button>
        ))}
      </div>
    </div>
  );
}

function ReviewYesNoNaRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: YesNoNa | null;
  onChange: (v: YesNoNa | null) => void;
}) {
  const labels: Record<YesNoNa, string> = { yes: 'Yes', no: 'No', na: 'N/A' };
  return (
    <div>
      <div className="text-sm font-medium text-slate-700">{label}</div>
      <div className="mt-1.5 flex flex-wrap gap-2">
        {(['yes', 'no', 'na'] as YesNoNa[]).map((v) => (
          <button
            key={v}
            onClick={() => onChange(v === value ? null : v)}
            className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${
              value === v
                ? 'bg-brand-50 text-brand-700 ring-brand-200'
                : 'bg-white text-slate-600 ring-slate-200 hover:bg-slate-50'
            }`}
          >
            {labels[v]}
          </button>
        ))}
      </div>
    </div>
  );
}

function ReviewDifficultyRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: DifficultyRating | null;
  onChange: (v: DifficultyRating | null) => void;
}) {
  const labels: Record<DifficultyRating, string> = {
    too_easy: 'Too easy',
    right_level: 'Right level',
    too_hard: 'Too hard',
  };
  return (
    <div>
      <div className="text-sm font-medium text-slate-700">{label}</div>
      <div className="mt-1.5 flex flex-wrap gap-2">
        {(['too_easy', 'right_level', 'too_hard'] as DifficultyRating[]).map(
          (v) => (
            <button
              key={v}
              onClick={() => onChange(v === value ? null : v)}
              className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${
                value === v
                  ? 'bg-brand-50 text-brand-700 ring-brand-200'
                  : 'bg-white text-slate-600 ring-slate-200 hover:bg-slate-50'
              }`}
            >
              {labels[v]}
            </button>
          )
        )}
      </div>
    </div>
  );
}

// v0.43 — one-click Approve toggle. Persists to localStorage via
// itemApprovals; module effective status upgrades to `available`
// once ≥ 75% of the module's items are approved.
function ApproveItemPanel({ itemId }: { itemId: string }) {
  const approved = useIsApproved(itemId);
  return (
    <div
      className={`rounded-2xl border p-4 sm:p-5 transition ${
        approved
          ? 'border-emerald-200 bg-emerald-50'
          : 'border-slate-200 bg-white'
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Teacher approval
          </div>
          <div className="mt-1 text-sm text-slate-700">
            {approved
              ? 'Approved — this item counts toward the module\'s effective availability status.'
              : 'Not yet approved. Once you\'ve walked the item and it\'s ready for pilot use, approve it here.'}
          </div>
        </div>
        <button
          onClick={() =>
            approved ? unapproveItem(itemId) : approveItem(itemId)
          }
          className={`btn-primary ${
            approved
              ? 'bg-emerald-600 hover:bg-emerald-700'
              : ''
          }`}
        >
          {approved ? 'Approved ✓ (click to un-approve)' : 'Approve this item'}
        </button>
      </div>
    </div>
  );
}
