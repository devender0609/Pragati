// v0.70 §27 — WHAT A STUDENT ACTUALLY GETS WHEN THEY TAP A SECTION.
//
// THE DEFECT THIS EXISTS TO CLOSE
//
// The Fractions chapter journey offered four parts as available and
// routed none of them. `onOpenSection` in App.tsx matched a single
// hard-coded id — §7.4 — which is `not_available_yet` and so could
// never be tapped. §7.2, §7.5, §7.6 and §7.8 rendered "Learn →" and did
// nothing.
//
// It survived three releases because every test asserted what the list
// SHOWED, never what a tap DID. The v0.70 route-verified screenshot
// harness found it in its first successful walk of the chapter.
//
// THE SECOND, LARGER PROBLEM
//
// Fixing the routing exposes the honesty question §27 actually asks.
// `hasEligibleLearn` is true when a LEGACY SKILL LESSON exists for a
// mapped skill — `LESSONS['FR.02']` and friends, authored against the
// old 14-chapter book, keyed by Pragati's internal skill codes, never
// section-verified against Ganita Prakash and never educator-reviewed.
//
// That content is real and usable. It is NOT an official-section
// lesson, and calling it "Ready to learn" tells a student that Pragati
// teaches §7.2 of their textbook when what it actually has is a legacy
// lesson about a related skill.
//
// So this module returns BOTH the route and its provenance, and the UI
// labels the provenance rather than hiding it.

import { sectionEligibility } from './eligibilityPolicy';
import { LESSONS } from '../data/lessons';

export type SectionTargetKind =
  /** The frozen §7.4 interactive practice set. Currently unreachable —
   *  §7.4 is unpublished — but routed so it works the moment it is. */
  | 'section_74_practice'
  /** A legacy skill lesson, authored before the official-section model.
   *  Real content; not an official-section artifact. */
  | 'legacy_skill_lesson';

export type SectionTarget = {
  officialSectionId: string;
  kind: SectionTargetKind;
  /** Set for `legacy_skill_lesson`. */
  skillId: string | null;
  /**
   * How a student-facing label should describe this.
   *
   * `official_section_content` is deliberately unused today: no section
   * has it. The value exists so the distinction is representable, and
   * so a future authored section is not quietly labelled the same way
   * as a grandfathered one.
   */
  provenance: 'official_section_content' | 'legacy_skill_content';
};

/**
 * Where tapping a section should go, or null if nowhere.
 *
 * Returning null is a correct outcome, not a failure: it means the
 * section has no content behind it, and the chapter journey renders it
 * as upcoming rather than as a tappable dead end.
 */
export function openableSectionTarget(
  officialSectionId: string
): SectionTarget | null {
  const e = sectionEligibility(officialSectionId);

  if (officialSectionId === 'ncert_gp_c6_s7_4') {
    // The frozen artifact. Gated by the same eligibility policy as
    // everything else — this does not smuggle unpublished content into
    // the student product, it just means the route exists when the
    // gate opens.
    return e.hasEligibleLearn || e.hasEligiblePractice
      ? {
          officialSectionId,
          kind: 'section_74_practice',
          skillId: null,
          provenance: 'official_section_content',
        }
      : null;
  }

  if (!e.hasEligibleLearn) return null;

  // The first aligned skill that actually has a lesson. `alignedSkillIds`
  // is exact alignment only; ambiguous multi-section skills are never
  // used, which is why a section mapped only to FR.08 stays unavailable.
  const skillId = e.alignedSkillIds.find(
    (s) => Boolean((LESSONS as Record<string, unknown>)[s])
  );
  if (!skillId) return null;

  return {
    officialSectionId,
    kind: 'legacy_skill_lesson',
    skillId,
    provenance: 'legacy_skill_content',
  };
}

/** True when a tap on this section leads somewhere. */
export function sectionIsOpenable(officialSectionId: string): boolean {
  return openableSectionTarget(officialSectionId) !== null;
}

// ---------------------------------------------------------------------------
// v0.71 §9 — STUDENT-FACING NAMES FOR LEGACY PRACTICE
// ---------------------------------------------------------------------------

/**
 * A plain name for a legacy skill activity.
 *
 * §3 forbids internal codes on any student surface, and "FR.02" is the
 * clearest possible example of one. These names describe what the
 * activity is ABOUT without claiming it is the official section's
 * lesson — which it is not.
 *
 * Keyed on the skill id rather than derived from `SKILL_LABELS`, because
 * those labels were written for a teacher-facing item bank and read like
 * catalogue entries ("Represent fractions visually"). A student needs a
 * name, not a taxonomy entry.
 */
const LEGACY_PRACTICE_NAMES: Record<string, string> = {
  'FR.02': 'Fractions as parts of a whole',
  'FR.03': 'Equivalent fractions',
  'FR.04': 'Mixed fractions',
  'FR.05': 'Adding and subtracting fractions',
  'FR.06': 'Adding and subtracting fractions',
  'FR.07': 'Adding and subtracting fractions',
};

export function legacyPracticeName(skillId: string): string {
  return LEGACY_PRACTICE_NAMES[skillId] ?? 'Fractions practice';
}

export type RelatedPracticeActivity = {
  officialSectionId: string;
  sectionNumber: string;
  /** Plain student-facing name. Never a skill code. */
  name: string;
  skillId: string;
};

/**
 * The legacy activities available for a chapter, as a SEPARATE list.
 *
 * §9 — these must not sit inside the official chapter journey. The
 * journey means "the sequence of the current textbook"; interleaving
 * older Pragati skill lessons into it tells a student that Pragati
 * teaches §7.2 of Ganita Prakash, when what exists is related practice
 * authored against a superseded book and never educator-reviewed.
 */
export function relatedPracticeForChapter(
  sections: Array<{ officialSectionId: string; sectionNumber: string }>
): RelatedPracticeActivity[] {
  const out: RelatedPracticeActivity[] = [];
  const seen = new Set<string>();
  for (const s of sections) {
    const t = openableSectionTarget(s.officialSectionId);
    if (!t || t.kind !== 'legacy_skill_lesson' || !t.skillId) continue;
    const name = legacyPracticeName(t.skillId);
    // Three §7.8 skills share one name; offer the activity once.
    if (seen.has(name)) continue;
    seen.add(name);
    out.push({
      officialSectionId: s.officialSectionId,
      sectionNumber: s.sectionNumber,
      name,
      skillId: t.skillId,
    });
  }
  return out;
}
