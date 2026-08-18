// v0.50 §13 + §18 — accessibility assertions over the real UI.
//
// The v0.49 screenshot review checked overflow only. These assertions
// run against rendered DOM, so a regression fails CI rather than
// waiting for someone to notice it in a screenshot.

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StudentShell } from '../StudentShell';
import { TeacherShell } from '../../teacher/TeacherShell';
import { TeacherResourcesBody } from '../../teacher/TeacherResourcesBody';
import { ConceptChooser } from '../ConceptChooser';
import type { Grade } from '../../../types';

const noop = () => {};

function studentShell(grade: Grade, tab: 'home' | 'learn' | 'practice' | 'progress') {
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

const teacherProps = {
  activeTab: 'resources' as const,
  onSwitchTab: noop,
  onOpenOverviewSummary: noop,
  onOpenClasses: noop,
  onOpenAssign: noop,
  onOpenInsights: noop,
  onOpenResources: noop,
  onOpenPilotSetup: noop,
  onOpenItemReview: noop,
  onOpenAlignmentReview: noop,
  onOpenCurriculumCoverage: noop,
  onOpenExports: noop,
};

/** Tailwind min-height classes we accept as an adequate touch target. */
const TARGET_OK = /min-h-\[(4[4-9]|[5-9]\d)px\]|min-h-11|min-h-12|py-2\.5|py-3|btn-primary|btn-secondary/;

describe('§13 interactive controls are adequately sized', () => {
  for (const tab of ['home', 'learn', 'practice', 'progress'] as const) {
    it(`student ${tab}: every button declares a touch target or is a nav tab`, () => {
      const { container } = studentShell('class6', tab);
      const buttons = Array.from(container.querySelectorAll('button'));
      expect(buttons.length).toBeGreaterThan(0);
      const undersized = buttons.filter((b) => {
        const cls = b.className;
        // Nav tabs carry their own min-h in the primitive.
        if (b.getAttribute('role') === 'tab') return false;
        return !TARGET_OK.test(cls);
      });
      expect(
        undersized.map((b) => (b.textContent ?? '').trim().slice(0, 30))
      ).toEqual([]);
    });
  }

  it('teacher grade-selector buttons are large enough', () => {
    const { container } = render(
      <TeacherShell {...teacherProps}>
        <TeacherResourcesBody onOpenChapter={noop} />
      </TeacherShell>
    );
    const gradeButtons = Array.from(container.querySelectorAll('button')).filter(
      (b) => /^Class \d+$/.test((b.textContent ?? '').trim())
    );
    expect(gradeButtons.length).toBeGreaterThan(0);
    for (const b of gradeButtons) {
      expect(b.className).toMatch(TARGET_OK);
    }
  });
});

describe('§13 focus visibility and keyboard reachability', () => {
  it('student primary controls declare a focus-visible style', () => {
    const { container } = studentShell('class6', 'practice');
    const buttons = Array.from(container.querySelectorAll('button')).filter(
      (b) => b.getAttribute('role') !== 'tab'
    );
    const unfocusable = buttons.filter(
      (b) => !/focus-visible:|btn-primary|btn-secondary/.test(b.className)
    );
    expect(unfocusable.map((b) => (b.textContent ?? '').trim())).toEqual([]);
  });

  it('no interactive control is removed from the tab order', () => {
    const { container } = studentShell('class6', 'learn');
    for (const b of Array.from(container.querySelectorAll('button'))) {
      expect(b.getAttribute('tabindex')).not.toBe('-1');
    }
  });
});

describe('§13 status is never carried by colour alone', () => {
  it('chapter cards state their status in text', () => {
    studentShell('class6', 'learn');
    // The badge text is the status; colour only reinforces it.
    const badges = screen.getAllByText(
      /Ready to learn|Practice available|Lessons available|Coming soon/
    );
    expect(badges.length).toBeGreaterThan(0);
  });

  it('concept chooser states New / Practised / Review in words', () => {
    render(
      <ConceptChooser
        chapterTitle="Fractions"
        skillIds={['FR.02', 'FR.03']}
        studentId="stu-ada"
        onChoose={noop}
        onBack={noop}
      />
    );
    expect(screen.getAllByText(/New|Practised|Review recommended/).length)
      .toBeGreaterThan(0);
  });
});

describe('§13 semantics and labelling', () => {
  it('the primary navigation is a labelled tablist', () => {
    studentShell('class6', 'home');
    const navs = screen.getAllByRole('tablist');
    expect(navs.length).toBeGreaterThan(0);
    for (const n of navs) {
      expect(n.getAttribute('aria-label')).toBeTruthy();
    }
  });

  it('disabled navigation is announced, not just dimmed', () => {
    render(
      <StudentShell
        activeTab="home"
        onSwitchTab={noop}
        openChapterId={null}
        onOpenChapter={noop}
        studentGrade="class6"
        studentName="Ada"
        studentId="stu-ada"
        onLaunchLesson={noop}
        onLaunchConceptPractice={noop}
        onLaunchMixedChapterPractice={noop}
        onLaunchChapterCheck={noop}
        sessionChild={<div>Q1</div>}
        sessionLocked
        onExitSession={noop}
      />
    );
    for (const tab of screen.getAllByRole('tab')) {
      expect(tab.getAttribute('aria-disabled')).toBe('true');
      expect(tab).toBeDisabled();
    }
  });

  it('headings follow a logical order on each student tab', () => {
    for (const tab of ['home', 'learn', 'practice', 'progress'] as const) {
      const { container, unmount } = studentShell('class6', tab);
      const levels = Array.from(
        container.querySelectorAll('h1,h2,h3,h4')
      ).map((h) => Number(h.tagName[1]));
      // No heading level may be skipped by more than one step.
      for (let i = 1; i < levels.length; i++) {
        expect(levels[i] - levels[i - 1]).toBeLessThanOrEqual(1);
      }
      unmount();
    }
  });

  it('the teacher class selector is labelled', () => {
    render(
      <TeacherShell
        {...teacherProps}
        classrooms={[{ id: 'a', name: 'Class 6 Blue' }]}
        selectedClassroomId="a"
        onSelectClassroom={noop}
      >
        <div />
      </TeacherShell>
    );
    const select = screen.getByRole('combobox');
    expect(select.className).toMatch(TARGET_OK);
    expect(screen.getByText(/^Class:$/)).toBeTruthy();
  });
});
