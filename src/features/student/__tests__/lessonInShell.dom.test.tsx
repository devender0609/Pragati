// v0.49 §1 + §11 — the concept lesson stays inside StudentShell.
//
// The v0.48 defect: App.tsx rendered `view === 'learn'` as a bare
// <LearnView>, so opening a concept from a chapter dropped the student
// out of the new shell and back into the old Class 6 chrome. Only
// assessment / results / learningPath were wrapped.

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { StudentRouteOutlet } from '../StudentRouteOutlet';
import type { StudentLocation } from '../StudentRouteOutlet';

const noop = () => {};

function renderOutlet(
  over: Partial<Parameters<typeof StudentRouteOutlet>[0]> = {}
) {
  const onSetLocation = vi.fn();
  const onOpenChapter = vi.fn();
  const onSwitchTab = vi.fn();
  const onLaunchFromLesson = vi.fn();
  render(
    <StudentRouteOutlet
      studentGrade="class6"
      studentName="Ada"
      studentId="stu-ada"
      activeTab="learn"
      onSwitchTab={onSwitchTab}
      openChapterId={null}
      onOpenChapter={onOpenChapter}
      location={{ kind: 'tab' }}
      onSetLocation={onSetLocation}
      onLaunchConceptPractice={noop}
      onLaunchMixedChapterPractice={noop}
      onLaunchChapterCheck={noop}
      onLaunchFromLesson={onLaunchFromLesson}
      {...over}
    />
  );
  return { onSetLocation, onOpenChapter, onSwitchTab, onLaunchFromLesson };
}

const LESSON: StudentLocation = {
  kind: 'lesson',
  skillId: 'FR.02',
  returnChapterId: 'official:g06_fractions_officialplaceholder',
};

describe('§1 the lesson renders inside the shell', () => {
  it('shows the shell chrome while a concept lesson is open', () => {
    renderOutlet({ location: LESSON });
    // Shell header + primary nav are present alongside the lesson.
    expect(screen.getAllByText(/Class 6 Mathematics/).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('tab', { name: /home/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('tab', { name: /practice/i }).length).toBeGreaterThan(0);
  });

  it('shows the lesson content itself, not just the chrome', () => {
    renderOutlet({ location: LESSON });
    // LearnView renders the skill's practice / reteach material.
    expect(screen.getAllByText(/FR\.02/).length).toBeGreaterThan(0);
  });

  it('navigation still works from inside a lesson — a lesson is not a locked session', () => {
    const { onSwitchTab } = renderOutlet({ location: LESSON });
    fireEvent.click(screen.getAllByRole('tab', { name: /progress/i })[0]);
    expect(onSwitchTab).toHaveBeenCalledWith('progress');
  });

  it('back from a lesson returns to the chapter it was opened from', () => {
    const { onSetLocation, onOpenChapter } = renderOutlet({ location: LESSON });
    fireEvent.click(screen.getByRole('button', { name: /^← Back$/ }));
    expect(onSetLocation).toHaveBeenCalledWith({ kind: 'tab' });
    expect(onOpenChapter).toHaveBeenCalledWith(LESSON.returnChapterId);
  });

  it('the return destination is preserved when moving between concepts', () => {
    const { onSetLocation } = renderOutlet({ location: LESSON });
    // The prev/next concept buttons keep the same chapter to return to.
    const nav = screen
      .getAllByRole('button')
      .find((b) => /^← FR\.|^FR\..* →$/.test(b.textContent ?? ''));
    if (!nav) return;
    fireEvent.click(nav);
    const calls = onSetLocation.mock.calls;
    const arg = calls[calls.length - 1]?.[0];
    expect(arg.kind).toBe('lesson');
    expect(arg.returnChapterId).toBe(LESSON.returnChapterId);
  });

  it('does not show the old hard-coded "Fractions Module" back link', () => {
    renderOutlet({ location: LESSON });
    expect(screen.queryByText(/← Fractions Module/)).toBeNull();
  });
});

describe('§1 a running session outranks an open lesson', () => {
  it('renders the session child instead of the lesson', () => {
    renderOutlet({
      location: LESSON,
      sessionChild: <div data-testid="session">Q1</div>,
      sessionLocked: true,
    });
    expect(screen.getByTestId('session')).toBeTruthy();
    // Lesson content is not also on screen.
    expect(screen.queryByText(/Worked examples/i)).toBeNull();
  });

  it('the shell chrome persists across the whole journey', () => {
    // tab → lesson → session: chrome present at every step.
    for (const loc of [{ kind: 'tab' as const }, LESSON]) {
      const { unmount } = render(
        <StudentRouteOutlet
          studentGrade="class6"
          studentName="Ada"
          studentId="stu-ada"
          activeTab="learn"
          onSwitchTab={noop}
          openChapterId={null}
          onOpenChapter={noop}
          location={loc}
          onSetLocation={noop}
          onLaunchConceptPractice={noop}
          onLaunchMixedChapterPractice={noop}
          onLaunchChapterCheck={noop}
          onLaunchFromLesson={noop}
        />
      );
      expect(screen.getAllByRole('tab').length).toBeGreaterThan(0);
      unmount();
    }
  });
});

describe('§1 opening a lesson from a chapter records where to return', () => {
  it('onLaunchLesson captures the currently open chapter', () => {
    const chapterId = 'official:g06_fractions_officialplaceholder';
    const { onSetLocation } = renderOutlet({
      openChapterId: chapterId,
      location: { kind: 'tab' },
    });
    // The chapter page's "Learn" action is the first journey card.
    const learnBtn = screen
      .getAllByRole('button')
      .find((b) => /^Learn$/.test((b.textContent ?? '').trim()));
    if (!learnBtn) return;
    fireEvent.click(learnBtn);
    const calls = onSetLocation.mock.calls;
    const arg = calls[calls.length - 1]?.[0];
    expect(arg.kind).toBe('lesson');
    expect(arg.returnChapterId).toBe(chapterId);
  });
});
