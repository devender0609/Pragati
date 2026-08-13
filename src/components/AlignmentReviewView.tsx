import { useMemo, useState } from 'react';
import { ITEMS } from '../data/items';
import {
  SKILL_ALIGNMENT,
  buildItemAlignments,
  buildSkillAlignmentSummary,
  skillsForModule,
  type SkillAlignmentSummary,
} from '../data/alignment';
import {
  ALIGNMENT_CONFIDENCE_COLOR,
  ALIGNMENT_CONFIDENCE_LABELS,
  AUDIT_FLAG_DESCRIPTIONS,
  AUDIT_FLAG_LABELS,
  COGNITIVE_DEMAND_LABELS,
  MODULE_FOR_SKILL,
  MODULE_IDS_ORDERED,
  MODULE_LABELS,
  type AlignmentConfidence,
  type AuditFlag,
  type ModuleId,
  type SkillId,
} from '../types';
import { Field } from './common/Field';
import { FlaggedBadge } from './common/FlaggedBadge';
import { MODULE_CHIP_CLASS, SkillChip } from './common/SkillChip';

// Alignment review (v0.10). Per-skill chapter references, learning
// outcomes, competency statements, plus item-level alignment confidence
// and audit flags. Extracted from App.tsx in v0.14. Behavior unchanged.
export function AlignmentReviewView({
  onBack,
  onOpenItem,
  onOpenLesson,
}: {
  onBack: () => void;
  onOpenItem: (id: string) => void;
  onOpenLesson: (s: SkillId) => void;
}) {
  const [confidenceFilter, setConfidenceFilter] = useState<
    'all' | AlignmentConfidence
  >('all');
  const [auditFilter, setAuditFilter] = useState<'all' | AuditFlag>('all');
  const [moduleFilter, setModuleFilter] = useState<'all' | ModuleId>('all');
  const [search, setSearch] = useState('');
  const [openSkill, setOpenSkill] = useState<SkillId | null>(null);

  const summary = useMemo(() => buildSkillAlignmentSummary(ITEMS), []);
  const itemAlignments = useMemo(() => buildItemAlignments(ITEMS), []);

  // Aggregate counts across the whole bank.
  const totals = useMemo(() => {
    const out = {
      itemCount: ITEMS.length,
      byConfidence: { high: 0, medium: 0, needs_teacher_review: 0 } as Record<
        AlignmentConfidence,
        number
      >,
      byAuditFlag: {
        grade_level_mismatch: 0,
        wording_too_complex: 0,
        possible_ambiguity: 0,
        cross_skill_contamination: 0,
        needs_cbse_teacher_review: 0,
        parser_limitation: 0,
      } as Record<AuditFlag, number>,
    };
    for (const id in itemAlignments) {
      const a = itemAlignments[id];
      out.byConfidence[a.alignmentConfidence] += 1;
      for (const f of a.auditFlags) out.byAuditFlag[f] += 1;
    }
    return out;
  }, [itemAlignments]);

  const filteredItems = ITEMS.filter((it) => {
    const a = itemAlignments[it.id];
    if (
      moduleFilter !== 'all' &&
      MODULE_FOR_SKILL[it.skillId] !== moduleFilter
    ) {
      return false;
    }
    if (
      confidenceFilter !== 'all' &&
      a.alignmentConfidence !== confidenceFilter
    ) {
      return false;
    }
    if (auditFilter !== 'all' && !a.auditFlags.includes(auditFilter)) {
      return false;
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      if (
        !it.id.toLowerCase().includes(q) &&
        !it.stem.toLowerCase().includes(q) &&
        !it.skillId.toLowerCase().includes(q)
      ) {
        return false;
      }
    }
    return true;
  });

  // For the per-module table view.
  const orderedModules = MODULE_IDS_ORDERED;

  return (
    <div className="space-y-6">
      <div>
        <button
          onClick={onBack}
          className="text-sm font-medium text-slate-500 hover:text-slate-700"
        >
          ← Teacher dashboard
        </button>
      </div>

      <section className="rounded-3xl bg-gradient-to-br from-violet-50 via-white to-brand-50 p-6 ring-1 ring-violet-200 sm:p-8">
        <div className="text-xs font-medium uppercase tracking-wide text-violet-700">
          CBSE/NCERT-informed prototype · mapped to draft skill framework
        </div>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Alignment review
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
          The chapter references, learning outcomes, and competency
          statements below are this prototype's reading of the public NCF /
          NCERT / Ganita Prakash Class 6 framework. They are NOT an official
          CBSE alignment and have NOT been endorsed by CBSE or NCERT. A
          teacher review is required before pilot use.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <ConfidenceTile
            label="High confidence"
            value={totals.byConfidence.high}
            total={totals.itemCount}
            tone="emerald"
          />
          <ConfidenceTile
            label="Medium confidence"
            value={totals.byConfidence.medium}
            total={totals.itemCount}
            tone="amber"
          />
          <ConfidenceTile
            label="Needs teacher review"
            value={totals.byConfidence.needs_teacher_review}
            total={totals.itemCount}
            tone="rose"
          />
        </div>
      </section>

      <section className="card">
        <h2 className="h-section">Modules &amp; skills</h2>
        <p className="mt-1 text-sm text-slate-600">
          Click a skill row to expand the details. Item-level filters below.
        </p>
        <div className="mt-4 space-y-5">
          {orderedModules.map((m) => {
            const skills = skillsForModule(m);
            const moduleItems = ITEMS.filter(
              (it) => MODULE_FOR_SKILL[it.skillId] === m
            ).length;
            const moduleNeedsReview = skills.reduce(
              (acc, s) =>
                acc + summary[s.skillId].byConfidence.needs_teacher_review,
              0
            );
            const moduleMedium = skills.reduce(
              (acc, s) => acc + summary[s.skillId].byConfidence.medium,
              0
            );
            return (
              <div
                key={m}
                className="rounded-2xl bg-white p-4 ring-1 ring-slate-200 sm:p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-bold uppercase tracking-wide ring-1 ${MODULE_CHIP_CLASS[m]}`}
                    >
                      {MODULE_LABELS[m]}
                    </span>
                    <span className="text-sm text-slate-500">
                      {skills.length} skills · {moduleItems} items
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1 text-xs text-slate-600">
                    {moduleMedium > 0 && (
                      <span className="rounded-full bg-amber-50 px-2 py-0.5 ring-1 ring-amber-200">
                        {moduleMedium} medium
                      </span>
                    )}
                    {moduleNeedsReview > 0 && (
                      <span className="rounded-full bg-rose-50 px-2 py-0.5 ring-1 ring-rose-200">
                        {moduleNeedsReview} need review
                      </span>
                    )}
                  </div>
                </div>
                <div className="mt-3 space-y-2">
                  {skills.map((s) => {
                    const sum = summary[s.skillId];
                    const expanded = openSkill === s.skillId;
                    return (
                      <div
                        key={s.skillId}
                        className="rounded-xl bg-slate-50 ring-1 ring-slate-200"
                      >
                        <button
                          onClick={() =>
                            setOpenSkill(expanded ? null : s.skillId)
                          }
                          className="flex w-full flex-wrap items-center justify-between gap-2 px-3 py-3 text-left"
                        >
                          <div className="flex flex-wrap items-center gap-2">
                            <SkillChip mode={s.skillId} />
                            <span className="text-sm font-semibold text-slate-900">
                              {s.skillName}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                            <span>{sum.itemCount} items</span>
                            <span className="text-slate-400">·</span>
                            <span className="font-semibold text-slate-700">
                              {COGNITIVE_DEMAND_LABELS[s.cognitiveFocus]}
                            </span>
                            {sum.byConfidence.medium > 0 && (
                              <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700">
                                {sum.byConfidence.medium} medium
                              </span>
                            )}
                            {sum.byConfidence.needs_teacher_review > 0 && (
                              <span className="rounded-full bg-rose-100 px-1.5 py-0.5 text-[10px] font-semibold text-rose-700">
                                {sum.byConfidence.needs_teacher_review} review
                              </span>
                            )}
                            <span className="text-slate-400">
                              {expanded ? '▾' : '▸'}
                            </span>
                          </div>
                        </button>
                        {expanded && (
                          <div className="border-t border-slate-200 bg-white p-4 text-sm">
                            <SkillAlignmentBlock skillId={s.skillId} />
                            <div className="mt-3 flex flex-wrap gap-2">
                              <button
                                onClick={() => onOpenLesson(s.skillId)}
                                className="btn-secondary text-xs"
                              >
                                Open Learn page
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="card">
        <h2 className="h-section">Item-level filters</h2>
        <p className="mt-1 text-sm text-slate-600">
          Drill into items by alignment confidence, audit flag, module, or
          free-text search. Click any row to open the item review form.
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Search">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Item ID, stem, or skill"
              className="form-input"
            />
          </Field>
          <Field label="Alignment confidence">
            <select
              value={confidenceFilter}
              onChange={(e) =>
                setConfidenceFilter(
                  e.target.value as 'all' | AlignmentConfidence
                )
              }
              className="form-input"
            >
              <option value="all">All confidence levels</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="needs_teacher_review">Needs teacher review</option>
            </select>
          </Field>
          <Field label="Audit flag">
            <select
              value={auditFilter}
              onChange={(e) =>
                setAuditFilter(e.target.value as 'all' | AuditFlag)
              }
              className="form-input"
            >
              <option value="all">All flags</option>
              {(Object.keys(AUDIT_FLAG_LABELS) as AuditFlag[]).map((f) => (
                <option key={f} value={f}>
                  {AUDIT_FLAG_LABELS[f]} ({totals.byAuditFlag[f]})
                </option>
              ))}
            </select>
          </Field>
          <Field label="Module">
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
        </div>
        <div className="mt-3 text-xs text-slate-500">
          Showing {filteredItems.length} of {ITEMS.length} items.
        </div>
        <div className="mt-3 overflow-hidden rounded-2xl ring-1 ring-slate-200">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs font-medium uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-3 py-2">Item</th>
                <th className="px-3 py-2">Skill</th>
                <th className="px-3 py-2">Cognitive demand</th>
                <th className="px-3 py-2">Alignment</th>
                <th className="px-3 py-2">Audit flags</th>
                <th className="px-3 py-2"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredItems.map((it) => {
                const a = itemAlignments[it.id];
                return (
                  <tr
                    key={it.id}
                    className="cursor-pointer hover:bg-slate-50"
                    onClick={() => onOpenItem(it.id)}
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
                    <td className="px-3 py-3 text-slate-700">
                      {COGNITIVE_DEMAND_LABELS[a.cognitiveDemand]}
                    </td>
                    <td className="px-3 py-3">
                      <ConfidencePill confidence={a.alignmentConfidence} />
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex flex-wrap gap-1">
                        {a.auditFlags.length === 0 && (
                          <span className="text-xs text-slate-400">—</span>
                        )}
                        {a.auditFlags.map((f) => (
                          <span
                            key={f}
                            className="inline-flex items-center rounded-full bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700 ring-1 ring-amber-200"
                            title={AUDIT_FLAG_DESCRIPTIONS[f]}
                          >
                            {AUDIT_FLAG_LABELS[f]}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-3 py-3 text-right">
                      <span className="text-brand-700">Open →</span>
                    </td>
                  </tr>
                );
              })}
              {filteredItems.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-3 py-8 text-center text-sm text-slate-500"
                  >
                    No items match the current filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <p className="text-xs text-slate-500">
        This page is the prototype's mapping of items to a draft skill
        framework. It is not an official CBSE / NCERT alignment and is not a
        teacher-validated mapping. A CBSE Class 6 maths teacher should review
        every "medium" or "needs teacher review" item before any pilot use.
      </p>
    </div>
  );
}

function ConfidenceTile({
  label,
  value,
  total,
  tone,
}: {
  label: string;
  value: number;
  total: number;
  tone: 'emerald' | 'amber' | 'rose';
}) {
  const ring =
    tone === 'emerald'
      ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
      : tone === 'amber'
        ? 'border-amber-200 bg-amber-50 text-amber-900'
        : 'border-rose-200 bg-rose-50 text-rose-900';
  return (
    <div className={`rounded-2xl border p-4 ${ring}`}>
      <div className="text-xs font-semibold uppercase tracking-wide opacity-80">
        {label}
      </div>
      <div className="mt-1 flex items-baseline gap-2">
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-xs opacity-70">of {total} items</div>
      </div>
    </div>
  );
}

function ConfidencePill({ confidence }: { confidence: AlignmentConfidence }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ring-1 ${ALIGNMENT_CONFIDENCE_COLOR[confidence]}`}
    >
      {ALIGNMENT_CONFIDENCE_LABELS[confidence]}
    </span>
  );
}

function SkillAlignmentBlock({ skillId }: { skillId: SkillId }) {
  const a = SKILL_ALIGNMENT[skillId];
  const sum = useMemo(
    () => buildSkillAlignmentSummary(ITEMS)[skillId],
    [skillId]
  );
  // v0.34 — starter skills (G1.01 … G12.30) don't have hand-authored
  // alignment records. Render a "no alignment yet" fallback so the
  // Alignment Review page doesn't crash when a teacher browses to
  // one of those skills.
  if (!a) {
    return (
      <div className="space-y-3 text-sm text-slate-700">
        <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
          Prototype starter content — no hand-authored alignment record
          for this skill yet. Items are marked{' '}
          <em>needs teacher review</em>. Author a{' '}
          <code>SkillAlignment</code> entry in{' '}
          <code>src/data/alignment.ts</code> to fill this in.
        </p>
        {sum && <SkillSummaryRow summary={sum} />}
      </div>
    );
  }
  return (
    <div className="space-y-3 text-sm text-slate-700">
      <div>
        <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Chapter reference
        </div>
        <p className="mt-0.5">{a.chapterReference}</p>
      </div>
      <div>
        <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Learning outcome
        </div>
        <p className="mt-0.5">{a.learningOutcome}</p>
      </div>
      <div>
        <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Competency statement
        </div>
        <p className="mt-0.5">{a.competencyStatement}</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Cognitive focus
          </div>
          <p className="mt-0.5">{COGNITIVE_DEMAND_LABELS[a.cognitiveFocus]}</p>
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Prerequisite skills
          </div>
          <div className="mt-0.5 flex flex-wrap gap-1">
            {a.prerequisiteSkills.length === 0 ? (
              <span className="text-xs text-slate-400">None</span>
            ) : (
              a.prerequisiteSkills.map((p) => <SkillChip key={p} mode={p} />)
            )}
          </div>
        </div>
      </div>
      {sum && <SkillSummaryRow summary={sum} />}
    </div>
  );
}

function SkillSummaryRow({ summary }: { summary: SkillAlignmentSummary }) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        Item alignment breakdown
      </div>
      <div className="mt-1 flex flex-wrap gap-2 text-xs">
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 ring-1 ring-slate-200">
          <span className="font-semibold text-slate-700">
            {summary.itemCount}
          </span>{' '}
          items
        </span>
        {(['high', 'medium', 'needs_teacher_review'] as AlignmentConfidence[]).map(
          (c) => (
            <span
              key={c}
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 ring-1 ${ALIGNMENT_CONFIDENCE_COLOR[c]}`}
            >
              <span className="font-semibold">{summary.byConfidence[c]}</span>{' '}
              {ALIGNMENT_CONFIDENCE_LABELS[c]}
            </span>
          )
        )}
      </div>
      {Object.entries(summary.byAuditFlag).some(([, v]) => v > 0) && (
        <div className="mt-2 flex flex-wrap gap-1 text-xs">
          {(Object.entries(summary.byAuditFlag) as [AuditFlag, number][])
            .filter(([, v]) => v > 0)
            .map(([f, v]) => (
              <span
                key={f}
                className="inline-flex items-center rounded-full bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700 ring-1 ring-amber-200"
                title={AUDIT_FLAG_DESCRIPTIONS[f]}
              >
                {AUDIT_FLAG_LABELS[f]} · {v}
              </span>
            ))}
        </div>
      )}
    </div>
  );
}
