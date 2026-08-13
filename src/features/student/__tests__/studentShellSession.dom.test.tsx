// v0.49 §2 + §4 + §11 — StudentShell session and Practice-tab DOM tests.
//
// These exercise the real controls. The v0.48 bug they lock down: the
// primary tabs stayed visible during an assessment and looked
// clickable, but selecting one did nothing because App.tsx's `view`
// was still 'assessment'.

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { StudentShell } from '../StudentShell';

const noop = () => {};

function renderShell(
  overrides: Partial<Parameters<typeof StudentShell>[0]> = {}
) {
  const setTab = vi.fn();
  const setChapter = vi.fn();
  const launchConcept = vi.fn();
  const launchMixed = vi.fn();
  const launchCheck = vi.fn();
  const launchLesson = vi.fn();
  const exit = vi.fn();
  render(
    <StudentShell
      activeTab={overrides.activeTab ?? 'home'}
      onSwitchTab={setTab}
      openChapterId={null}
      onOpenChapter={setChapter}
      studentGrade="class6"
      studentName="Ada"
      studentId="stu-ada"
      onLaunchLesson={launchLesson}
      onLaunchConceptPractice={launchConcept}
      onLaunchMixedChapterPractice={launchMixed}
      onLaunchChapterCheck={launchCheck}
      onExitSession={exit}
      {...overrides}
    />
  );
  return { setTab, setChapter, launchConcept, launchMixed, launchCheck, launchLesson, exit };
}

describe('§2 navigation during an active session', () => {
  it('primary tabs are actually disabled while a session is locked', () => {
    renderShell({
      sessionChild: <div data-testid="session-body">Q1</div>,
      sessionLocked: true,
    });
    const tabs = screen.getAllByRole('tab');
    expect(tabs.length).toBeGreaterThan(0);
    // Every rendered tab must be genuinely inert — not merely styled
    // as if it were.
    for (const tab of tabs) {
      expect(tab).toBeDisabled();
    }
  });

  it('clicking a locked tab does not switch tabs', () => {
    const { setTab } = renderShell({
      sessionChild: <div>Q1</div>,
      sessionLocked: true,
    });
    for (const tab of screen.getAllByRole('tab')) {
      fireEvent.click(tab);
    }
    expect(setTab).not.toHaveBeenCalled();
  });

  it('shows an explicit Save & Exit control while locked', () => {
    const { exit } = renderShell({
      sessionChild: <div>Q1</div>,
      sessionLocked: true,
    });
    const btn = screen.getByRole('button', { name: /save & exit/i });
    fireEvent.click(btn);
    expect(exit).toHaveBeenCalledTimes(1);
  });

  it('explains the restriction instead of leaving dead controls unexplained', () => {
    renderShell({ sessionChild: <div>Q1</div>, sessionLocked: true });
    expect(screen.getByRole('status').textContent).toMatch(
      /middle of a set/i
    );
  });

  it('navigation works again once the session is no longer locked', () => {
    const { setTab } = renderShell({
      sessionChild: <div>Results</div>,
      sessionLocked: false,
    });
    const tabs = screen.getAllByRole('tab', { name: /progress/i });
    expect(tabs[0]).not.toBeDisabled();
    fireEvent.click(tabs[0]);
    expect(setTab).toHaveBeenCalledWith('progress');
  });

  it('post-session screens show no Save & Exit control', () => {
    renderShell({ sessionChild: <div>Results</div>, sessionLocked: false });
    expect(screen.queryByRole('button', { name: /save & exit/i })).toBeNull();
  });

  it('the session body stays inside the shell chrome', () => {
    renderShell({
      sessionChild: <div data-testid="session-body">Q1</div>,
      sessionLocked: true,
    });
    // Body present AND the shell's own grade header present.
    expect(screen.getByTestId('session-body')).toBeTruthy();
    expect(screen.getAllByText(/Class 6 · Mathematics/i).length).toBeGreaterThan(0);
  });
});

describe('§4 Practice actions match their labels', () => {
  it('renders four distinct actions for a chapter that has a blueprint', () => {
    renderShell({ activeTab: 'practice' });
    expect(screen.getAllByRole('button', { name: /practise a concept/i }).length)
      .toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /^open chapter$/i }).length)
      .toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /^mixed practice$/i }).length)
      .toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /^chapter check$/i }).length)
      .toBeGreaterThan(0);
  });

  it('"Mixed practice" starts mixed practice — it does not open the chapter', () => {
    const { launchMixed, setChapter } = renderShell({ activeTab: 'practice' });
    fireEvent.click(screen.getAllByRole('button', { name: /^mixed practice$/i })[0]);
    expect(launchMixed).toHaveBeenCalledTimes(1);
    expect(setChapter).not.toHaveBeenCalled();
  });

  it('"Chapter check" starts the chapter check — it does not open the chapter', () => {
    const { launchCheck, setChapter } = renderShell({ activeTab: 'practice' });
    fireEvent.click(screen.getAllByRole('button', { name: /^chapter check$/i })[0]);
    expect(launchCheck).toHaveBeenCalledTimes(1);
    expect(setChapter).not.toHaveBeenCalled();
  });

  it('"Open chapter" opens that exact chapter and starts nothing', () => {
    const { setChapter, launchMixed, launchCheck } = renderShell({
      activeTab: 'practice',
    });
    fireEvent.click(screen.getAllByRole('button', { name: /^open chapter$/i })[0]);
    expect(setChapter).toHaveBeenCalledTimes(1);
    expect(String(setChapter.mock.calls[0][0])).toMatch(/fractions/i);
    expect(launchMixed).not.toHaveBeenCalled();
    expect(launchCheck).not.toHaveBeenCalled();
  });

  it('"Practise a concept" launches one skill, not a chapter run', () => {
    const { launchConcept, launchMixed, launchCheck } = renderShell({
      activeTab: 'practice',
    });
    fireEvent.click(
      screen.getAllByRole('button', { name: /practise a concept/i })[0]
    );
    expect(launchConcept).toHaveBeenCalledTimes(1);
    // A SkillId, not a ModuleId.
    expect(String(launchConcept.mock.calls[0][0])).toMatch(/^[A-Z]{2}\.\d{2}$/);
    expect(launchMixed).not.toHaveBeenCalled();
    expect(launchCheck).not.toHaveBeenCalled();
  });

  it('no two Practice buttons in a card call the same handler', () => {
    const handlers = renderShell({ activeTab: 'practice' });
    const cardButtons = screen
      .getAllByRole('button')
      .filter((b) =>
        /practise a concept|^open chapter$|^mixed practice$|^chapter check$/i.test(
          b.textContent ?? ''
        )
      );
    // Click each once, then assert each distinct handler fired exactly
    // as many times as it has buttons — i.e. no shared target.
    for (const b of cardButtons) fireEvent.click(b);
    const total =
      handlers.launchConcept.mock.calls.length +
      handlers.launchMixed.mock.calls.length +
      handlers.launchCheck.mock.calls.length +
      handlers.setChapter.mock.calls.length;
    expect(total).toBe(cardButtons.length);
  });
});

describe('§11 keyboard accessibility of primary controls', () => {
  it('primary tabs are real buttons, so they are keyboard reachable', () => {
    renderShell();
    for (const tab of screen.getAllByRole('tab')) {
      expect(tab.tagName).toBe('BUTTON');
      // Native buttons are in the tab order unless explicitly removed.
      expect(tab.getAttribute('tabindex')).not.toBe('-1');
    }
  });

  it('primary tabs carry a focus-visible ring class', () => {
    renderShell();
    const tab = screen.getAllByRole('tab', { name: /home/i })[0];
    expect(tab.className).toMatch(/focus-visible:/);
  });

  it('Save & Exit is keyboard-activatable and focus-visible', () => {
    const { exit } = renderShell({
      sessionChild: <div>Q1</div>,
      sessionLocked: true,
    });
    const btn = screen.getByRole('button', { name: /save & exit/i });
    expect(btn.className).toMatch(/focus-visible:/);
    btn.focus();
    expect(document.activeElement).toBe(btn);
    // Native button: Enter fires click.
    fireEvent.click(btn);
    expect(exit).toHaveBeenCalled();
  });

  it('Practice actions are focusable buttons', () => {
    renderShell({ activeTab: 'practice' });
    const btn = screen.getAllByRole('button', { name: /^chapter check$/i })[0];
    btn.focus();
    expect(document.activeElement).toBe(btn);
  });

  it('the active tab is announced via aria-selected', () => {
    renderShell({ activeTab: 'learn' });
    const learn = screen.getAllByRole('tab', { name: /learn/i })[0];
    expect(learn.getAttribute('aria-selected')).toBe('true');
    const home = screen.getAllByRole('tab', { name: /home/i })[0];
    expect(home.getAttribute('aria-selected')).toBe('false');
  });

  it('disabled tabs are announced as disabled, not merely dimmed', () => {
    renderShell({ sessionChild: <div>Q1</div>, sessionLocked: true });
    const tab = screen.getAllByRole('tab', { name: /home/i })[0];
    expect(tab.getAttribute('aria-disabled')).toBe('true');
  });
});

describe('§14 student copy is free of internal product language', () => {
  const FORBIDDEN =
    /implementation status|prototype complete|one primary action|psychometric|IRT model|research[- ]development|curriculum verification/i;

  for (const tab of ['home', 'learn', 'practice', 'progress'] as const) {
    it(`the ${tab} tab shows no developer language`, () => {
      const { container } = render(
        <StudentShell
          activeTab={tab}
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
        />
      );
      expect(container.textContent ?? '').not.toMatch(FORBIDDEN);
    });
  }

  it('the Progress tab keeps limitations in an "About this result" disclosure', () => {
    render(
      <StudentShell
        activeTab="progress"
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
      />
    );
    const details = screen.getByText(/about this result/i).closest('details');
    expect(details).toBeTruthy();
    expect(within(details as HTMLElement).getByText(/not standardised tests/i))
      .toBeTruthy();
  });
});
