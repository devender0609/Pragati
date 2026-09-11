// v0.77 §9/§10 — REGRESSION TESTS FOR THE AVAILABILITY DEFECT.
//
// Before this release, `sectionEligibility().hasEligibleLearn` was
// `demoReady || legacyLesson`, so an older Pragati skill lesson counted
// as Learn content for an official Ganita Prakash section. Every student
// surface then said "Ready to learn" about Fractions while nothing from
// the current textbook was student-eligible.
//
// These tests exist so that cannot come back quietly. They assert the
// POLICY, not the wording of any one screen, because the wording moved
// once already and the defect survived the move.

import { describe, it, expect } from 'vitest';
import {
  getStudentChapterAvailability,
  officialChapterLearnState,
  sectionEligibility,
  LEARN_STATE_LABEL,
  learnStateCta,
} from '../eligibilityPolicy';
import { class6ChapterCards } from '../studentChapterModel';
import { openableSectionTarget } from '../sectionRouting';

const FRACTIONS = 'ncert_gp_c6_ch07_fractions';

describe('§9 a legacy skill lesson is never official Learn content', () => {
  it('does not let a legacy lesson satisfy section Learn eligibility', () => {
    // §7.2 is mapped to FR.02, which HAS an authored legacy lesson. That
    // is exactly the case that used to return true.
    const e = sectionEligibility('ncert_gp_c6_s7_2');
    expect(e.hasLegacyLesson).toBe(true);
    expect(e.hasEligibleLearn).toBe(false);
  });

  it('still routes the legacy activity, as related practice', () => {
    // The fix removes a false claim, not a capability.
    const t = openableSectionTarget('ncert_gp_c6_s7_2');
    expect(t?.kind).toBe('legacy_skill_lesson');
    expect(t?.provenance).toBe('legacy_skill_content');
  });

  it('does not let a legacy lesson satisfy chapter Learn eligibility', () => {
    const e = getStudentChapterAvailability(FRACTIONS);
    expect(e.hasLegacyLesson).toBe(true);
    expect(e.hasEligibleLearn).toBe(false);
    // The chapter is still open — a student can do the practice.
    expect(e.availability).toBe('available');
  });
});

describe('§10 one policy decides every student state', () => {
  it('puts Fractions in related_practice_available, not ready to learn', () => {
    expect(officialChapterLearnState(FRACTIONS)).toBe(
      'related_practice_available'
    );
  });

  it('never labels a chapter "Ready to learn" without official Learn content', () => {
    for (const c of class6ChapterCards()) {
      const state = officialChapterLearnState(c.officialChapterId);
      if (c.statusLine === LEARN_STATE_LABEL.official_learn_available) {
        expect(
          getStudentChapterAvailability(c.officialChapterId).hasEligibleLearn
        ).toBe(true);
      }
      // Every card's wording comes from the policy, so no screen can
      // hold a stale label after the policy changes.
      expect(c.statusLine).toBe(LEARN_STATE_LABEL[state]);
    }
  });

  it('reserves "being prepared" for chapters that have authored drafts', () => {
    // A chapter with registry sections but nothing written is not being
    // prepared; saying so would be the same false promise in new words.
    const states = class6ChapterCards().map((c) => ({
      title: c.title,
      state: officialChapterLearnState(c.officialChapterId),
    }));
    expect(states.length).toBe(10);
    for (const s of states) {
      expect([
        'official_learn_available',
        'related_practice_available',
        'official_lessons_preparing',
        'nothing_available',
      ]).toContain(s.state);
    }
  });

  it('derives the call to action from the state, never from a screen', () => {
    expect(learnStateCta('related_practice_available', 'Fractions', false)).toBe(
      'Try Fractions practice'
    );
    expect(learnStateCta('official_lessons_preparing', 'Symmetry', false)).toBe(
      'Explore Symmetry'
    );
    expect(learnStateCta('nothing_available', 'Symmetry', false)).toBe(
      'Explore your curriculum'
    );
    expect(learnStateCta('official_learn_available', 'Fractions', false)).toBe(
      'Start learning'
    );
    // §11 — Continue requires real unfinished work, whatever the state.
    expect(learnStateCta('related_practice_available', 'Fractions', true)).toBe(
      'Continue practice'
    );
    expect(learnStateCta('nothing_available', 'Fractions', false)).not.toMatch(
      /Continue/
    );
  });

  it('keeps every student label free of workflow vocabulary', () => {
    for (const label of Object.values(LEARN_STATE_LABEL)) {
      expect(label).not.toMatch(/draft|review|publish|prototype|pilot/i);
    }
  });
});
