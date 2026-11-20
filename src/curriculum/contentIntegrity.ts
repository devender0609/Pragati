// v0.39 — Content integrity checks over the item bank.
//
// The Class 6 bank was hand-authored and hand-reviewed by v0.11.
// The v0.29 → v0.36 rollout added 1,000+ prototype items across
// Classes 1-5 and 8-12. This module runs mechanical integrity
// checks over the whole bank so the teacher-side review has a real
// starting point.
//
// Checks (all pure functions over `ITEMS`):
//   1. detectDuplicateStems       — same stem authored twice.
//   2. checkDifficultyDistribution — every module has at least one
//      foundational, one core, and one advanced item.
//   3. detectMissingSolutions     — item without a `.solution` string.
//   4. detectShortSolutions       — solution length below a threshold
//      (probably not enough working shown). Advisory only.
//   5. detectMcqDuplicateOptions   — an MCQ where two option texts
//      are identical (choice collapses to 3).
//   6. detectMcqMissingMisconception — an MCQ whose distractors don't
//      map to a misconception code.
//
// Every function is deterministic and pure — no I/O — so tests can
// exercise them directly against the exported `runContentIntegrity()`
// aggregator.

import { ITEMS, type Item, type MCQItem } from '../data/items';
import type { ModuleId, SkillId } from '../types';
import { SKILLS_BY_MODULE, MODULE_IDS_ORDERED } from '../types';

export type IntegrityIssue = {
  severity: 'error' | 'warning' | 'info';
  category:
    | 'duplicate_stem'
    | 'difficulty_gap'
    | 'missing_solution'
    | 'short_solution'
    | 'mcq_duplicate_option'
    | 'mcq_missing_misconception';
  itemId?: string;
  moduleId?: ModuleId;
  skillId?: SkillId;
  message: string;
};

// --- 1. Duplicate stems (case-insensitive, whitespace-collapsed). ---
function normStem(s: string): string {
  return s.toLowerCase().replace(/\s+/g, ' ').trim();
}

export function detectDuplicateStems(items: Item[] = ITEMS): IntegrityIssue[] {
  const seen = new Map<string, string[]>();
  for (const it of items) {
    const key = normStem(it.stem);
    if (!key) continue;
    if (!seen.has(key)) seen.set(key, []);
    seen.get(key)!.push(it.id);
  }
  const issues: IntegrityIssue[] = [];
  for (const [key, ids] of seen) {
    if (ids.length > 1) {
      issues.push({
        severity: 'warning',
        category: 'duplicate_stem',
        message: `Stem "${key.slice(0, 60)}${key.length > 60 ? '…' : ''}" appears in ${ids.length} items: ${ids.join(', ')}`,
      });
    }
  }
  return issues;
}

// --- 2. Difficulty distribution per module. ---
export function checkDifficultyDistribution(items: Item[] = ITEMS): IntegrityIssue[] {
  const issues: IntegrityIssue[] = [];
  for (const moduleId of MODULE_IDS_ORDERED) {
    const skillIds = new Set<SkillId>(SKILLS_BY_MODULE[moduleId] ?? []);
    const moduleItems = items.filter((it) => skillIds.has(it.skillId as SkillId));
    if (moduleItems.length === 0) continue;
    const bands = new Set(moduleItems.map((it) => it.band));
    for (const need of ['foundational', 'core', 'advanced'] as const) {
      if (!bands.has(need)) {
        issues.push({
          severity: need === 'foundational' ? 'error' : 'warning',
          category: 'difficulty_gap',
          moduleId,
          message: `Module "${moduleId}" has no "${need}"-band items (bands present: ${Array.from(bands).join(', ') || 'none'}).`,
        });
      }
    }
  }
  return issues;
}

// --- 3. Missing solutions. ---
export function detectMissingSolutions(items: Item[] = ITEMS): IntegrityIssue[] {
  return items
    .filter((it) => !it.solution || it.solution.trim().length === 0)
    .map((it) => ({
      severity: 'error' as const,
      category: 'missing_solution' as const,
      itemId: it.id,
      skillId: it.skillId as SkillId,
      message: `Item "${it.id}" has no solution string.`,
    }));
}

// --- 4. Short solutions (< 20 chars is probably too terse). ---
export function detectShortSolutions(
  items: Item[] = ITEMS,
  threshold = 20
): IntegrityIssue[] {
  return items
    .filter((it) => it.solution && it.solution.trim().length > 0 && it.solution.trim().length < threshold)
    .map((it) => ({
      severity: 'info' as const,
      category: 'short_solution' as const,
      itemId: it.id,
      skillId: it.skillId as SkillId,
      message: `Item "${it.id}" has a very short solution (${it.solution.trim().length} chars). Consider expanding.`,
    }));
}

// --- 5. Duplicate MCQ options within a single item. ---
export function detectMcqDuplicateOptions(items: Item[] = ITEMS): IntegrityIssue[] {
  const issues: IntegrityIssue[] = [];
  for (const it of items) {
    if (it.kind !== 'mcq') continue;
    const mcq = it as MCQItem;
    const texts = mcq.options.map((o) => o.text.trim().toLowerCase());
    const uniq = new Set(texts);
    if (uniq.size < texts.length) {
      issues.push({
        severity: 'error',
        category: 'mcq_duplicate_option',
        itemId: it.id,
        skillId: it.skillId as SkillId,
        message: `Item "${it.id}" has duplicate MCQ option text.`,
      });
    }
  }
  return issues;
}

// --- 6. MCQ distractors with no misconception code. ---
export function detectMcqMissingMisconception(items: Item[] = ITEMS): IntegrityIssue[] {
  const issues: IntegrityIssue[] = [];
  for (const it of items) {
    if (it.kind !== 'mcq') continue;
    const mcq = it as MCQItem;
    const distractorsWithoutCode = mcq.options.filter((o, i) =>
      i !== mcq.correctIndex && (!o.misconception || o.misconception === 'none')
    );
    if (distractorsWithoutCode.length > 0) {
      issues.push({
        severity: 'warning',
        category: 'mcq_missing_misconception',
        itemId: it.id,
        skillId: it.skillId as SkillId,
        message: `Item "${it.id}" has ${distractorsWithoutCode.length} distractor(s) with no misconception code — diagnostic rollup will bucket them as generic errors.`,
      });
    }
  }
  return issues;
}

// --- Aggregate report. ---
export type IntegrityReport = {
  issues: IntegrityIssue[];
  countsBySeverity: { error: number; warning: number; info: number };
  countsByCategory: Record<IntegrityIssue['category'], number>;
  totalItems: number;
};

export function runContentIntegrity(items: Item[] = ITEMS): IntegrityReport {
  const issues = [
    ...detectDuplicateStems(items),
    ...checkDifficultyDistribution(items),
    ...detectMissingSolutions(items),
    ...detectShortSolutions(items),
    ...detectMcqDuplicateOptions(items),
    ...detectMcqMissingMisconception(items),
  ];
  const countsBySeverity = { error: 0, warning: 0, info: 0 };
  const countsByCategory: Record<IntegrityIssue['category'], number> = {
    duplicate_stem: 0, difficulty_gap: 0, missing_solution: 0,
    short_solution: 0, mcq_duplicate_option: 0, mcq_missing_misconception: 0,
  };
  for (const issue of issues) {
    countsBySeverity[issue.severity]++;
    countsByCategory[issue.category]++;
  }
  return { issues, countsBySeverity, countsByCategory, totalItems: items.length };
}
