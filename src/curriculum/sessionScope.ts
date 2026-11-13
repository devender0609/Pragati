// v0.29 — Session scope helpers.
//
// Turns a legacy or v0.26+ Session into a normalised AssessmentScope
// (curriculum + grade + subject + skill/module) so the growth-comparison
// UI and any future report can refuse to compare sessions that assessed
// different things.
//
// Rules:
//   - Prefer the v0.26+ curriculum fields on the Session record.
//   - Fall back to the legacy SkillMode string (`session.skillId`) via
//     migrateLegacySkillMode() — that path is already covered by the
//     v0.26 migration tests.
//   - Return undefined if we cannot infer anything (very old
//     malformed records) so callers can render a warning instead of
//     silently comparing incompatible sessions.

import type { Session } from '../types';
import { migrateLegacySkillMode, type AssessmentScope } from './migrations';
import { scopesAreComparable } from './migrations';

export function scopeFromSession(session: Session): AssessmentScope | undefined {
  // v0.26+ path — curriculum context stamped at session start.
  if (session.curriculumId && session.gradeId && session.subjectId) {
    const scope: AssessmentScope = {
      curriculumId: session.curriculumId,
      gradeId: session.gradeId,
      subjectId: session.subjectId,
      blueprintId: session.blueprintId,
      // We infer moduleId / singleSkillId / crossModule from the legacy
      // SkillMode when possible so growth comparison can still detect
      // "same single skill" vs "cross-module diagnostic".
    };
    const legacyDerived = migrateLegacySkillMode(
      session.skillId as unknown as string,
      session.gradeId as string
    );
    if (legacyDerived) {
      scope.singleSkillId = legacyDerived.singleSkillId;
      scope.moduleId = legacyDerived.moduleId;
      scope.crossModule = legacyDerived.crossModule;
    }
    return scope;
  }
  // Legacy path — derive everything from the SkillMode string.
  return migrateLegacySkillMode(session.skillId as unknown as string);
}

// Public convenience: are two sessions safe to compare for growth?
export function areSessionsComparable(a: Session, b: Session): boolean {
  const sa = scopeFromSession(a);
  const sb = scopeFromSession(b);
  if (!sa || !sb) return false;
  return scopesAreComparable(sa, sb);
}

// Human-readable reason why two sessions are NOT comparable (for the
// growth card's "Growth comparison unavailable" copy).
export function comparabilityReason(a: Session, b: Session): string | null {
  const sa = scopeFromSession(a);
  const sb = scopeFromSession(b);
  if (!sa || !sb) return 'One of the sessions has no scope information.';
  if (sa.curriculumId !== sb.curriculumId)
    return `Different curriculums (${sa.curriculumId} vs ${sb.curriculumId}).`;
  if (sa.gradeId !== sb.gradeId)
    return `Different grades (${sa.gradeId} vs ${sb.gradeId}).`;
  if (sa.subjectId !== sb.subjectId)
    return `Different subjects (${sa.subjectId} vs ${sb.subjectId}).`;
  if (sa.singleSkillId && sb.singleSkillId && sa.singleSkillId !== sb.singleSkillId) {
    return `Different skills (${sa.singleSkillId} vs ${sb.singleSkillId}).`;
  }
  if (sa.moduleId && sb.moduleId && sa.moduleId !== sb.moduleId) {
    return `Different modules (${sa.moduleId} vs ${sb.moduleId}).`;
  }
  if (Boolean(sa.crossModule) !== Boolean(sb.crossModule)) {
    return 'One session is cross-module and the other is scoped to a specific skill or module.';
  }
  return null;
}
