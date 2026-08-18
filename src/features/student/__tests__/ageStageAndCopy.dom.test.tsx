// v0.50 §5 + §6 + §9 + §18 — student copy and age-stage composition.

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StudentShell, friendlySessionLabel } from '../StudentShell';
import { Footer } from '../../../components/Footer';
import {
  layoutForGrade,
  primaryActionLabel,
  ageStageForGrade,
} from '../../../design/ageStage';
import { STUDENT_STATUS_LABEL, DERIVED_STATUS_LABEL } from '../../../curriculum/inventory';
import type { Grade } from '../../../types';

const noop = () => {};

function renderShell(grade: Grade, tab: 'home' | 'learn' | 'practice' | 'progress' = 'home') {
  return render(
    <StudentShell
      activeTab={tab}
      onSwitchTab={noop}
      openChapterId={null}
      onOpenChapter={noop}
      studentGrade={grade}
      studentName="Ada"
      studentId="stu-ada"
      onLaunchLesson={noop}
      onLaunchConceptPractice={noop}
      onLaunchMixedChapterPractice={noop}
      onLaunchChapterCheck={noop}
    />
  );
}

// §5 — vocabulary that must never appear on a student screen.
const DEV_JARGON =
  /prototype|pre-pilot|calibrat|ready for review|shell only|implementation status|blueprint|verification/i;

describe('§5 student screens carry no development jargon', () => {
  for (const grade of ['class1', 'class6', 'class12'] as Grade[]) {
    for (const tab of ['home', 'learn', 'practice', 'progress'] as const) {
      it(`${grade} ${tab} is clean`, () => {
        const { container } = renderShell(grade, tab);
        expect(container.textContent ?? '').not.toMatch(DEV_JARGON);
      });
    }
  }

  it('the student footer renders nothing at all', () => {
    const { container } = render(<Footer appMode="student" />);
    expect(container.textContent ?? '').toBe('');
  });

  it('the teacher footer still carries the ethical limitation', () => {
    render(<Footer appMode="teacher" />);
    expect(screen.getByText(/not a calibrated assessment/i)).toBeTruthy();
  });

  it('student status labels describe what a child can do', () => {
    expect(STUDENT_STATUS_LABEL.prototype_ready_review).toBe('Ready to learn');
    expect(STUDENT_STATUS_LABEL.no_content).toBe('Coming soon');
    for (const v of Object.values(STUDENT_STATUS_LABEL)) {
      expect(v).not.toMatch(DEV_JARGON);
    }
  });

  it('the authoring vocabulary is preserved for teacher surfaces', () => {
    // Must NOT be quietly renamed — teachers rely on the build state.
    expect(DERIVED_STATUS_LABEL.prototype_ready_review).toBe(
      'Prototype — ready for review'
    );
  });
});

describe('§6 Progress uses friendly concept names, never codes', () => {
  it('names a single-skill session by its concept', () => {
    expect(
      friendlySessionLabel({ skillId: 'FR.02', sampledSkillIds: ['FR.02'] })
    ).toBe('Represent fractions visually');
  });

  it('names a mixed session by its chapter', () => {
    const label = friendlySessionLabel({
      skillId: 'mixed_fractions',
      sampledSkillIds: ['FR.02', 'FR.03'],
      chapterModuleId: 'fractions',
      sessionPurpose: 'practice',
    });
    expect(label).toMatch(/mixed practice/i);
    expect(label).not.toMatch(/FR\.\d{2}/);
  });

  it('distinguishes a chapter check', () => {
    expect(
      friendlySessionLabel({
        skillId: 'mixed_fractions',
        sampledSkillIds: ['FR.02', 'FR.03'],
        chapterModuleId: 'fractions',
        sessionPurpose: 'chapter_check',
      })
    ).toMatch(/chapter check/i);
  });

  it('handles legacy sessions with no sampled skills', () => {
    const label = friendlySessionLabel({ skillId: 'mixed_decimals' });
    expect(label).toMatch(/mixed practice/i);
    expect(label).not.toMatch(/mixed_/);
  });

  it('never emits a raw skill code for any known skill', () => {
    for (const raw of ['FR.02', 'FR.05', 'mixed_fractions']) {
      expect(friendlySessionLabel({ skillId: raw })).not.toMatch(/^[A-Z]{2}\.\d{2}$/);
    }
  });
});

describe('§9 age stages are genuinely different, not just resized', () => {
  it('maps grades to the four stages', () => {
    expect(ageStageForGrade('class1')).toBe('early_primary');
    expect(ageStageForGrade('class4')).toBe('primary');
    expect(ageStageForGrade('class7')).toBe('middle');
    expect(ageStageForGrade('class11')).toBe('secondary');
  });

  it('early primary shows fewer choices than secondary', () => {
    const early = layoutForGrade('class1');
    const senior = layoutForGrade('class12');
    expect(early.chapterColumns).toBeLessThan(senior.chapterColumns);
    expect(early.maxHomeSecondaryItems).toBeLessThan(senior.maxHomeSecondaryItems);
  });

  it('early primary gets chapter art; secondary gets density instead', () => {
    expect(layoutForGrade('class1').showChapterArt).toBe(true);
    expect(layoutForGrade('class12').showChapterArt).toBe(false);
  });

  it('concept lists and numeric progress are withheld from the youngest', () => {
    expect(layoutForGrade('class1').showConceptProgressList).toBe(false);
    expect(layoutForGrade('class1').showNumericProgress).toBe(false);
    expect(layoutForGrade('class8').showConceptProgressList).toBe(true);
  });

  it('exam framing appears only at secondary', () => {
    for (const g of ['class1', 'class5', 'class8'] as Grade[]) {
      expect(layoutForGrade(g).showExamReadiness).toBe(false);
    }
    expect(layoutForGrade('class10').showExamReadiness).toBe(true);
  });

  it('primary action wording adapts to the stage', () => {
    expect(primaryActionLabel('class1', 'start')).toBe('Learn');
    expect(primaryActionLabel('class6', 'start')).toBe('Start learning');
    expect(primaryActionLabel('class12', 'continue')).toBe(
      'Continue where you left off'
    );
  });

  it('the rendered Learn grid differs between Class 1 and Class 12', () => {
    const { container: c1, unmount } = renderShell('class1', 'learn');
    const early = c1.querySelector('.grid')?.className ?? '';
    unmount();
    const { container: c12 } = renderShell('class12', 'learn');
    const senior = c12.querySelector('.grid')?.className ?? '';
    expect(early).not.toBe(senior);
    expect(early).toContain('grid-cols-1');
    expect(senior).toContain('lg:grid-cols-3');
  });
});

describe('§5 status labels never contradict the action offered', () => {
  it('a chapter that cannot be opened does not claim practice is available', () => {
    const { container } = renderShell('class1', 'learn');
    const cards = Array.from(container.querySelectorAll('button')).filter((b) =>
      /See status|Open/.test(b.textContent ?? '')
    );
    expect(cards.length).toBeGreaterThan(0);
    for (const card of cards) {
      const text = card.textContent ?? '';
      if (/See status/.test(text)) {
        // Not launchable → must not advertise availability.
        expect(text).not.toMatch(/Practice available|Lessons available|Ready to learn/);
        expect(text).toMatch(/Coming soon/);
      }
    }
  });
});
