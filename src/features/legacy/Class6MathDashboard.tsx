// v0.49 §12 — extracted from App.tsx.
//
// Behaviour is unchanged; only the file boundary moved. These are the
// LEGACY Class-6-shaped screens, still reachable from teacher preview
// and first-run compatibility paths. The canonical student journey is
// StudentRouteOutlet + StudentShell.

import { useState, useMemo } from 'react';
import { ITEMS } from '../../data/items';
import { computeSkillProgress } from '../../lib/progression';
import { loadSessions } from '../../lib/storage';
import {
  MODULE_DESCRIPTIONS,
  MODULE_FOR_SKILL,
  MODULE_LABELS,
  MODULES_FOR_GRADE,
  GRADE_LABELS,
  SKILLS_BY_MODULE,
  type Grade,
  type ModuleId,
  type SkillMode,
} from '../../types';
import { MODULE_CHIP_CLASS } from '../../components/common/SkillChip';


// ===========================================================================
// Class 6 Math dashboard — top-level (4 module cards)
// ===========================================================================
export function Class6MathDashboard({
  onOpenModule,
  onStartAssessment,
  onBack,
  onChangeClass,
}: {
  onOpenModule: (m: ModuleId) => void;
  onStartAssessment: (mode: SkillMode) => void;
  onBack: () => void;
  // v0.30: opens the AssessmentPicker so the student can switch to a
  // different class instead of using a hard-coded pill row.
  onChangeClass?: () => void;
}) {
  // v0.23 → v0.30: what was a closed-union pill row is now a persisted
  // preference driven by the AssessmentPicker. This dashboard reads
  // the current selection from the same localStorage key so legacy
  // devices land on the same grade they had last selected.
  const [grade] = useState<Grade>(() => {
    try {
      const g = typeof localStorage !== 'undefined' ? localStorage.getItem('pragati.selected_grade.v1') : null;
      if (
        g === 'class7' ||
        (typeof g === 'string' && /^class(1|2|3|4|5|8|9|10|11|12)$/.test(g))
      ) {
        return g as Grade;
      }
      return 'class6';
    } catch {
      return 'class6';
    }
  });

  const progress = useMemo(
    () => computeSkillProgress(loadSessions(), ITEMS),
    []
  );

  const modulesForThisGrade = MODULES_FOR_GRADE[grade];
  const itemsForThisGrade = useMemo(
    () =>
      ITEMS.filter((it) => modulesForThisGrade.includes(MODULE_FOR_SKILL[it.skillId])),
    [modulesForThisGrade]
  );

  // Per-module aggregate stats for the module cards (only for the
  // selected grade).
  const perModuleStats = useMemo(() => {
    const out = {} as Record<
      ModuleId,
      { totalSkills: number; started: number; strong: number; itemCount: number }
    >;
    for (const m of modulesForThisGrade) {
      const skills = SKILLS_BY_MODULE[m];
      const itemCount = ITEMS.filter((i) => MODULE_FOR_SKILL[i.skillId] === m)
        .length;
      out[m] = {
        totalSkills: skills.length,
        started: skills.filter((s) => progress[s].status !== 'not_started')
          .length,
        strong: skills.filter((s) => progress[s].status === 'strong').length,
        itemCount,
      };
    }
    return out;
  }, [progress, modulesForThisGrade]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <button
          onClick={onBack}
          className="inline-flex min-h-[44px] items-center text-sm font-medium text-slate-500 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        >
          ← Back to home
        </button>
        {/* v0.30: registry-driven "Change class" button replaces the
            closed-union pill row from v0.23–v0.29. The picker now
            handles all 12 grades. */}
        {onChangeClass && (
          <button
            onClick={onChangeClass}
            className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-200"
          >
            {GRADE_LABELS[grade]} · Change class →
          </button>
        )}
      </div>
      <div className="rounded-3xl bg-gradient-to-br from-brand-50 via-white to-violet-50 p-6 ring-1 ring-slate-200 sm:p-8">
        <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
          {GRADE_LABELS[grade]}
        </div>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          {modulesForThisGrade.length} modules, {itemsForThisGrade.length} items, all on this device.
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
          {grade === 'class6'
            ? 'Pick a module to learn or assess one skill at a time, or run a Mixed Class 6 Math Assessment that draws across every module.'
            : `A prototype starter layer for ${GRADE_LABELS[grade]}. All content is CBSE/NCERT-informed prototype copy — teacher review required before pilot use.`}
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          {grade === 'class6' && (
            <button
              onClick={() => onStartAssessment('mixed')}
              className="btn-primary"
            >
              Take the Mixed Class 6 Math Assessment
            </button>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {modulesForThisGrade.map((m) => (
          <ModuleCard
            key={m}
            moduleId={m}
            stats={perModuleStats[m]}
            onOpen={() => onOpenModule(m)}
            onStartAssessment={() =>
              onStartAssessment(`mixed_${m}` as SkillMode)
            }
          />
        ))}
      </div>

      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
        <div className="font-semibold">Reminder</div>
        <p className="mt-1">
          The content here is a prototype, not a published curriculum. Status
          labels come from a rule-based heuristic on a small bank — a useful
          signal, but not a calibrated mastery claim and not an official CBSE
          score.
        </p>
      </div>
    </div>
  );
}

function ModuleCard({
  moduleId,
  stats,
  onOpen,
  onStartAssessment,
}: {
  moduleId: ModuleId;
  stats: {
    totalSkills: number;
    started: number;
    strong: number;
    itemCount: number;
  };
  onOpen: () => void;
  onStartAssessment: () => void;
}) {
  const ringClass = MODULE_CHIP_CLASS[moduleId];
  return (
    <article className="flex flex-col rounded-2xl bg-white p-5 ring-1 ring-slate-200 transition hover:shadow-md sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex flex-col gap-1.5">
          <span
            className={`inline-flex w-fit items-center rounded-full px-2 py-0.5 text-xs font-bold uppercase tracking-wide ring-1 ${ringClass}`}
          >
            {MODULE_LABELS[moduleId]}
          </span>
          <h3 className="text-base font-semibold text-slate-900 sm:text-lg">
            {MODULE_LABELS[moduleId]}
          </h3>
        </div>
        <span className="text-xs text-slate-500">
          {stats.totalSkills} skills · {stats.itemCount} items
        </span>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-slate-600">
        {MODULE_DESCRIPTIONS[moduleId]}
      </p>
      <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-600">
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 ring-1 ring-slate-200">
          <span className="font-semibold text-slate-700">
            {stats.strong}/{stats.totalSkills}
          </span>
          Strong
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 ring-1 ring-slate-200">
          <span className="font-semibold text-slate-700">
            {stats.started}/{stats.totalSkills}
          </span>
          started
        </span>
      </div>
      <div className="mt-auto flex flex-wrap gap-2 pt-4">
        <button onClick={onOpen} className="btn-primary text-sm">
          Open module
        </button>
        <button onClick={onStartAssessment} className="btn-secondary text-sm">
          Take {MODULE_LABELS[moduleId]} assessment
        </button>
      </div>
    </article>
  );
}

// ===========================================================================
// Per-module dashboard — overview of all skills in one module
