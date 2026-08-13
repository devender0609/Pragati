// v0.49 §10 — chapter-card interaction tests.
//
// v0.48 asserted only that the catalogue rendered. These tests select
// each card, verify the exact chapter ID that was requested, render the
// resulting detail view, and assert the outcome is either a real
// chapter experience or a truthful unavailable state — never an
// accidental generic "not found".
//
// Representative grades: 1, 6, 8, 10, 12.

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { StudentShell, chaptersForStudentGrade } from '../StudentShell';
import { resolveChapter } from '../../../curriculum/chapterResolver';
import type { Grade } from '../../../types';

const GRADES: Grade[] = ['class1', 'class6', 'class8', 'class10', 'class12'];

const noop = () => {};

function renderLearn(grade: Grade, openChapterId: string | null = null) {
  const onOpenChapter = vi.fn();
  render(
    <StudentShell
      activeTab="learn"
      onSwitchTab={noop}
      openChapterId={openChapterId}
      onOpenChapter={onOpenChapter}
      studentGrade={grade}
      studentName="Ada"
      studentId="stu-ada"
      onLaunchLesson={noop}
      onLaunchConceptPractice={noop}
      onLaunchMixedChapterPractice={noop}
      onLaunchChapterCheck={noop}
    />
  );
  return { onOpenChapter };
}

describe.each(GRADES)('§10 chapter cards — %s', (grade) => {
  const rows = chaptersForStudentGrade(grade);

  it('renders at least one chapter card', () => {
    renderLearn(grade);
    // Every row's title must be on screen.
    expect(rows.length).toBeGreaterThan(0);
    for (const row of rows) {
      expect(screen.getAllByText(row.title).length).toBeGreaterThan(0);
    }
  });

  it('every card requests a chapter ID that actually resolves', () => {
    for (const row of rows) {
      const resolved = resolveChapter(row.chapterId);
      expect(resolved).not.toBeNull();
      expect(resolved!.chapterId).toBe(row.chapterId);
      // And it belongs to the grade whose catalogue it appeared in.
      expect(resolved!.grade).toBe(grade);
    }
  });

  it('selecting each card passes that exact chapter ID', () => {
    const { onOpenChapter } = renderLearn(grade);
    const buttons = screen.getAllByRole('button');
    let matched = 0;
    for (const row of rows) {
      const btn = buttons.find((b) =>
        (b.textContent ?? '').includes(row.title)
      );
      if (!btn) continue;
      onOpenChapter.mockClear();
      fireEvent.click(btn);
      expect(onOpenChapter).toHaveBeenCalledWith(row.chapterId);
      matched += 1;
    }
    // Guard against the test silently matching nothing.
    expect(matched).toBe(rows.length);
  });

  it('each chapter detail renders a valid experience OR a truthful unavailable state — never a generic not-found', () => {
    for (const row of rows) {
      const { unmount } = render(
        <StudentShell
          activeTab="learn"
          onSwitchTab={noop}
          openChapterId={row.chapterId}
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
      const text = document.body.textContent ?? '';

      // The accidental-failure signature: the resolver returned null
      // and we fell through to "this chapter link is not recognised".
      expect(text).not.toMatch(/link is not recognised/i);
      // Never a raw error or blank body.
      expect(text.trim().length).toBeGreaterThan(0);

      if (row.canLaunch) {
        // A launchable chapter shows the real chapter experience.
        expect(text).toMatch(/Learning journey|What you will learn/i);
      } else {
        // An unlaunchable chapter must SAY it is not ready, and say why.
        expect(text).toMatch(
          /not ready|no content|not yet|not available|coming/i
        );
      }
      unmount();
    }
  });

  it('a chapter from another grade is refused rather than rendered', () => {
    const otherGrade: Grade = grade === 'class6' ? 'class8' : 'class6';
    const foreign = chaptersForStudentGrade(otherGrade)[0];
    if (!foreign) return;
    render(
      <StudentShell
        activeTab="learn"
        onSwitchTab={noop}
        openChapterId={foreign.chapterId}
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
    expect(screen.getByText(/not for your class/i)).toBeTruthy();
  });
});

describe('§10 unrecognised chapter IDs', () => {
  it('an unknown ID shows the truthful unrecognised page, not a crash', () => {
    render(
      <StudentShell
        activeTab="learn"
        onSwitchTab={noop}
        openChapterId="official:this_does_not_exist"
        onOpenChapter={noop}
        studentGrade="class6"
        studentName="Ada"
        studentId="stu-ada"
        onLaunchLesson={noop}
        onLaunchConceptPractice={noop}
        onLaunchMixedChapterPractice={noop}
        onLaunchChapterCheck={noop}
      />
    );
    expect(screen.getByText(/not recognised/i)).toBeTruthy();
  });
});

describe('§10 chapter check is only offered where a blueprint exists', () => {
  it('Class 6 Fractions offers a chapter check', () => {
    const fractions = chaptersForStudentGrade('class6').find((c) =>
      /fraction/i.test(c.title)
    );
    expect(fractions).toBeTruthy();
    render(
      <StudentShell
        activeTab="learn"
        onSwitchTab={noop}
        openChapterId={fractions!.chapterId}
        onOpenChapter={noop}
        studentGrade="class6"
        studentName="Ada"
        studentId="stu-ada"
        onLaunchLesson={noop}
        onLaunchConceptPractice={noop}
        onLaunchMixedChapterPractice={noop}
        onLaunchChapterCheck={noop}
      />
    );
    expect(screen.getByText(/No hints/i)).toBeTruthy();
  });

  it('a launchable chapter with no blueprint says the check is not ready', () => {
    const other = chaptersForStudentGrade('class6').find(
      (c) => c.canLaunch && !/fraction/i.test(c.title)
    );
    if (!other) return; // nothing to assert on this content set
    render(
      <StudentShell
        activeTab="learn"
        onSwitchTab={noop}
        openChapterId={other.chapterId}
        onOpenChapter={noop}
        studentGrade="class6"
        studentName="Ada"
        studentId="stu-ada"
        onLaunchLesson={noop}
        onLaunchConceptPractice={noop}
        onLaunchMixedChapterPractice={noop}
        onLaunchChapterCheck={noop}
      />
    );
    expect(screen.getByText(/Not ready for this chapter yet/i)).toBeTruthy();
  });
});
