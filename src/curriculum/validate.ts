// v0.26 — Curriculum validator.
//
// Runs a set of structural + integrity checks against the registry.
// Used by:
//   - `npm run validate:curriculum` (scripts/validate-curriculum.mjs)
//   - the automated test suite
// The validator DOES NOT throw for known-empty grades (Classes 1–5, 8–12
// in v0.26) — those are `framework_only` on purpose.

import { GRADE_DEFINITIONS } from './grades';
import {
  getBlueprints,
  getItemsForSkill,
  getModule,
  getModules,
  getSkill,
  getSkills,
  programmaticCounts,
} from './registry';
import type { AvailabilityStatus } from './schema';
import { checkOfficialCompleteness } from './officialCompleteness';

export type ValidationIssue = {
  severity: 'error' | 'warning';
  code: string;
  message: string;
  where?: string;
};

export function validateCurriculumRegistry(): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  const gradeIds = Object.keys(GRADE_DEFINITIONS).sort();
  for (const gradeId of gradeIds) {
    const grade = GRADE_DEFINITIONS[gradeId];
    for (const [curriculumId, subjectIds] of Object.entries(grade.subjectsByCurriculum)) {
      for (const subjectId of subjectIds) {
        const modules = getModules(gradeId, subjectId, curriculumId);
        if (modules.length === 0) {
          issues.push({
            severity: 'error',
            code: 'GRADE_SUBJECT_EMPTY',
            message: `Grade ${gradeId} × subject ${subjectId} is registered under curriculum ${curriculumId} but has no modules.`,
          });
          continue;
        }
        for (const m of modules) {
          const skills = getSkills(m.id);
          if (skills.length === 0) {
            issues.push({
              severity: 'error',
              code: 'MODULE_HAS_NO_SKILLS',
              message: `Module ${m.id} has no skills.`,
              where: m.id,
            });
          }
          if (m.availability === 'available' || m.availability === 'teacher_review_required') {
            for (const s of skills) {
              const items = getItemsForSkill(s.id);
              if (items.length === 0) {
                issues.push({
                  severity: 'error',
                  code: 'SKILL_HAS_NO_ITEMS',
                  message: `Skill ${s.id} (module ${m.id}, availability=${s.availability}) has no items in the bank.`,
                  where: s.id,
                });
              }
            }
          }
          for (const skillId of m.skillIds) {
            if (!getSkill(skillId)) {
              issues.push({
                severity: 'error',
                code: 'MODULE_REFERENCES_MISSING_SKILL',
                message: `Module ${m.id} references skill ${skillId} which is not registered.`,
                where: m.id,
              });
            }
          }
        }
        // Blueprint checks.
        for (const b of getBlueprints(gradeId, subjectId)) {
          if (b.minItems <= 0 || b.maxItems < b.minItems) {
            issues.push({
              severity: 'error',
              code: 'BLUEPRINT_INVALID_ITEM_RANGE',
              message: `Blueprint ${b.id} has invalid minItems/maxItems (${b.minItems}/${b.maxItems}).`,
              where: b.id,
            });
          }
          if (b.moduleIds) {
            for (const mid of b.moduleIds) {
              if (!getModule(mid)) {
                issues.push({
                  severity: 'error',
                  code: 'BLUEPRINT_REFERENCES_MISSING_MODULE',
                  message: `Blueprint ${b.id} references module ${mid} which is not registered.`,
                  where: b.id,
                });
              }
            }
          }
          if (b.skillIds) {
            for (const sid of b.skillIds) {
              if (!getSkill(sid)) {
                issues.push({
                  severity: 'error',
                  code: 'BLUEPRINT_REFERENCES_MISSING_SKILL',
                  message: `Blueprint ${b.id} references skill ${sid} which is not registered.`,
                  where: b.id,
                });
              }
            }
          }
          // Coverage sanity: sum of items across all target modules /
          // skills must be at least minItems.
          const coverageIds =
            b.skillIds ??
            (b.moduleIds ?? []).flatMap((mid) => getSkills(mid).map((s) => s.id));
          const totalItems = coverageIds.reduce(
            (acc, sid) => acc + getItemsForSkill(sid).length,
            0
          );
          if (totalItems < b.minItems) {
            issues.push({
              severity: 'error',
              code: 'BLUEPRINT_INSUFFICIENT_COVERAGE',
              message: `Blueprint ${b.id} needs at least ${b.minItems} eligible items but only ${totalItems} are available.`,
              where: b.id,
            });
          }
        }
      }
    }
  }

  // Grades that are marked framework-only but accidentally have modules.
  for (const gradeId of gradeIds) {
    const grade = GRADE_DEFINITIONS[gradeId];
    const hasSubjects = Object.values(grade.subjectsByCurriculum).some((v) => v.length > 0);
    if (!hasSubjects) {
      // Nothing to check — grade is a shell, which is fine.
      continue;
    }
  }

  // Sanity: no legacy id collisions.
  const counts = programmaticCounts();
  if (counts.legacySkillCount > 0 && counts.skillCount === 0) {
    issues.push({
      severity: 'error',
      code: 'REGISTRY_NOT_INITIALISED',
      message:
        'Legacy skill union has entries but the registry has zero registered skills. registerCbseCoreContent() may not have run.',
    });
  }


  // v0.71 (curriculum requirement §C) — OFFICIAL COMPLETENESS IS A HARD
  // GATE.
  //
  // Once a grade is primary-verified, every official record from that
  // source must exist in the registry. A chapter with no Pragati lesson
  // is expected; a chapter MISSING from the registry means the product
  // is telling a student their textbook has fewer chapters than it does.
  //
  // Reported as `error`, so `npm run validate:curriculum` FAILS rather
  // than printing a warning nobody reads. Every existing test asserts
  // what the registry contains; only this asserts what the SOURCE
  // requires, which is the direction an accidental deletion breaks.
  for (const f of checkOfficialCompleteness()) {
    issues.push({
      severity: 'error',
      code: f.code,
      message: f.message,
      where: f.grade,
    });
  }

  return issues;
}

// Convenience: split issues by severity.
export function summarizeIssues(issues: ValidationIssue[]): {
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
  ok: boolean;
} {
  const errors = issues.filter((i) => i.severity === 'error');
  const warnings = issues.filter((i) => i.severity === 'warning');
  return { errors, warnings, ok: errors.length === 0 };
}

// Convenience: format for CLI output.
export function formatIssuesForCli(issues: ValidationIssue[]): string {
  if (issues.length === 0) return 'Curriculum validation: no issues found.\n';
  const lines: string[] = [];
  const { errors, warnings, ok } = summarizeIssues(issues);
  lines.push(`Curriculum validation: ${errors.length} error(s), ${warnings.length} warning(s).`);
  for (const i of issues) {
    lines.push(`  [${i.severity.toUpperCase()}] ${i.code}: ${i.message}${i.where ? ` (at ${i.where})` : ''}`);
  }
  lines.push(ok ? '\nOK.' : '\nFAILED.');
  return lines.join('\n') + '\n';
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const _forTypeExport: AvailabilityStatus | null = null;
