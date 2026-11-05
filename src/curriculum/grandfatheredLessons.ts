// v0.64 §13 — GRANDFATHERING IS TEMPORARY, AND MUST SAY SO.
//
// v0.63 introduced a defensible rule: a legacy lesson stays visible to
// students if the current textbook still places that topic at this
// grade. It kept Class 6 from going dark while nothing was reviewed.
//
// The danger is that the rule quietly becomes permanent. "The topic
// still exists in Class 6, therefore the old lesson is valid" is not a
// curriculum claim anyone checked — it only says the lesson is not
// obviously misplaced. Whether it teaches what §7.6 actually teaches is
// unexamined.
//
// So every grandfathered lesson now carries a migration status, and an
// Admin report lists what is still awaiting section verification.
// Nothing is mass-mapped: the default is the weakest state.

import { SKILLS_BY_MODULE, SKILL_LABELS, type ModuleId } from '../types';
import { LESSONS } from '../data/lessons';
import { isClass6Core } from './legacyDisposition';
import { alignmentForSkill } from './itemAlignment';
import { STATIC_MAPPING } from './contentMapping';

export type SectionVerificationStatus =
  /** Nobody has checked this lesson against an official section. */
  | 'not_section_verified'
  /** A maintainer proposes a section; no educator has confirmed it. */
  | 'section_candidate'
  /** An educator has confirmed the lesson matches the official section. */
  | 'section_verified';

export type GrandfatheredLesson = {
  skillId: string;
  conceptName: string;
  moduleId: ModuleId;
  officialChapterId: string | null;
  candidateSectionId: string | null;
  status: SectionVerificationStatus;
};

/**
 * Every legacy Class 6 lesson currently reaching students, with how far
 * its curriculum verification has actually got.
 *
 * Derived, never stored: the status follows from the alignment record,
 * so it cannot drift from it.
 */
export function grandfatheredClass6Lessons(): GrandfatheredLesson[] {
  const out: GrandfatheredLesson[] = [];

  for (const [moduleId, skills] of Object.entries(SKILLS_BY_MODULE)) {
    if (!isClass6Core(moduleId)) continue; // displaced modules are hidden already

    const chapter =
      STATIC_MAPPING.find((m) =>
        m.legacyModuleIds.includes(moduleId as ModuleId)
      )?.officialChapterId ?? null;

    for (const skillId of skills as string[]) {
      if (!(LESSONS as Record<string, unknown>)[skillId]) continue;

      const a = alignmentForSkill(skillId);
      const status: SectionVerificationStatus =
        a.alignmentReviewStatus === 'educator_reviewed'
          ? 'section_verified'
          : a.alignmentStatus === 'exact_section_candidate'
            ? 'section_candidate'
            : 'not_section_verified';

      out.push({
        skillId,
        conceptName:
          (SKILL_LABELS as Record<string, string>)[skillId] ?? skillId,
        moduleId: moduleId as ModuleId,
        officialChapterId: chapter,
        candidateSectionId: a.officialSectionId,
        status,
      });
    }
  }
  return out;
}

export type GrandfatheringReport = {
  total: number;
  notSectionVerified: number;
  sectionCandidate: number;
  sectionVerified: number;
  /** The honest headline for Admin. */
  summary: string;
};

export function grandfatheringReport(): GrandfatheringReport {
  const rows = grandfatheredClass6Lessons();
  const n = (s: SectionVerificationStatus) =>
    rows.filter((r) => r.status === s).length;

  const verified = n('section_verified');
  return {
    total: rows.length,
    notSectionVerified: n('not_section_verified'),
    sectionCandidate: n('section_candidate'),
    sectionVerified: verified,
    summary:
      verified === rows.length
        ? `All ${rows.length} lessons have been checked against an official section.`
        : `${rows.length - verified} of ${rows.length} Class 6 lessons reaching students have NOT been checked against an official section. They are shown because the topic is still taught at this grade, which is not the same as confirming the lesson matches the official part of the chapter.`,
  };
}
