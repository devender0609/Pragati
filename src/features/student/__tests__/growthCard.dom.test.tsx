// v0.58 §9 + §21 — the student Growth Check card.

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { StudentShell } from '../StudentShell';

const noop = () => {};

function renderHome(over: Partial<Parameters<typeof StudentShell>[0]> = {}) {
  const onStartGrowthCheck = vi.fn();
  const r = render(
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
      onStartGrowthCheck={onStartGrowthCheck}
      {...over}
    />
  );
  return { onStartGrowthCheck, ...r };
}

describe('§9 the Growth Check card appears only when assigned', () => {
  it('is ABSENT with no assignment — the production state', () => {
    const { container } = renderHome({ growthAssignment: null });
    expect(container.textContent ?? '').not.toMatch(/Growth Check/i);
  });

  it('is absent when the prop is omitted entirely', () => {
    const { container } = renderHome();
    expect(container.textContent ?? '').not.toMatch(/Growth Check/i);
  });

  it('appears when a live assignment exists', () => {
    renderHome({ growthAssignment: { assignmentId: 'a1' } });
    expect(screen.getByText(/Your Math Growth Check is ready/i)).toBeTruthy();
  });

  it('starts the flow', () => {
    const { onStartGrowthCheck } = renderHome({
      growthAssignment: { assignmentId: 'a1' },
    });
    fireEvent.click(screen.getByRole('button', { name: /^start$/i }));
    expect(onStartGrowthCheck).toHaveBeenCalledTimes(1);
  });

  it('adds NO permanent navigation tab', () => {
    renderHome({ growthAssignment: { assignmentId: 'a1' } });
    const tabs = screen.getAllByRole('tab').map((t) => (t.textContent ?? '').trim());
    // Still exactly the four student tabs.
    expect(tabs.some((t) => /growth/i.test(t))).toBe(false);
  });

  it('uses child-friendly wording, not assessment jargon', () => {
    const { container } = renderHome({ growthAssignment: { assignmentId: 'a1' } });
    const text = container.textContent ?? '';
    expect(text).toMatch(/not a test you can fail/i);
    expect(text).not.toMatch(/field test|blueprint|calibrat|psychometric|eligib/i);
  });

  it('stays inside the shell chrome', () => {
    renderHome({ growthAssignment: { assignmentId: 'a1' } });
    expect(screen.getAllByRole('tab').length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Class 6 Mathematics/i).length).toBeGreaterThan(0);
  });
});
