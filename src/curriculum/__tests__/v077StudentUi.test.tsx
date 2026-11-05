// v0.77 §3/§11/§19 — RENDER-LEVEL CONTRACTS FOR THE INTEGRATED STUDENT UI.
//
// The policy tests in v077AvailabilityPolicy.test.ts prove the rule.
// These prove the SCREENS obey it, which is the part that failed last
// time: the policy was fixed once and a stale claim survived in a
// component that decided its own wording.

import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Class6ChapterList } from '../../features/student/Class6Learn';
import { LearnView } from '../../components/LearnView';

describe('§3 no student surface promotes legacy content to an official lesson', () => {
  it('never says "Ready to learn" for Fractions on Learn', () => {
    render(<Class6ChapterList onOpenChapter={() => {}} />);
    expect(screen.queryByText(/Ready to learn/i)).toBeNull();
    expect(screen.queryByText(/Start official lesson/i)).toBeNull();
  });

  it('tells the student plainly that chapter lessons are being prepared', () => {
    render(<Class6ChapterList onOpenChapter={() => {}} />);
    expect(
      screen.getByText(/Chapter lessons are being prepared/i)
    ).toBeTruthy();
  });
});

describe('§11 no internal identifiers reach the student lesson', () => {
  const noop = () => {};

  it('hides the skill code and system wording from a student', () => {
    const { container } = render(
      <LearnView
        skill="FR.02"
        onBack={noop}
        onStartAssessment={noop}
        onOpenLesson={noop}
        studentId="stu_test"
      />
    );
    const text = container.textContent ?? '';
    expect(text).not.toMatch(/FR\.0\d/);
    expect(text).not.toMatch(/Reteach/i);
  });

  it('still shows both to a teacher previewing the same artifact', () => {
    // The artifact identity is unchanged; only presentation differs, and
    // the teacher has to ask for the technical view explicitly.
    const { container } = render(
      <LearnView
        skill="FR.02"
        onBack={noop}
        onStartAssessment={noop}
        onOpenLesson={noop}
        audience="teacher"
      />
    );
    const text = container.textContent ?? '';
    expect(text).toMatch(/FR\.02/);
    expect(text).toMatch(/Reteach/i);
  });
});

describe('§8 the student lesson is staged, not one long page', () => {
  it('shows one stage at a time and offers every stage directly', () => {
    render(
      <LearnView
        skill="FR.02"
        onBack={() => {}}
        onStartAssessment={() => {}}
        onOpenLesson={() => {}}
        studentId="stu_test"
      />
    );
    const rail = screen.getByRole('navigation', { name: /lesson stages/i });
    // Every stage reachable from every stage — not a next-only wizard.
    expect(rail.querySelectorAll('button').length).toBe(5);
    // Stage one is showing; the later stages' CONTENT is not on the page.
    // Their names are — that is the rail, and it is what makes every
    // stage reachable, so the assertion has to look past it at the
    // content those stages carry.
    expect(screen.queryByText(/Each row names the mistake/i)).toBeNull();
    expect(
      screen.queryByText(/Work through these before opening a full assessment/i)
    ).toBeNull();
  });
});

describe('§13/§14 the Try-it stage is a sequence, not a worksheet', () => {
  // The hero's action also reads "Go to Try it", so the rail is selected
  // explicitly rather than by a name match that now hits two controls.
  const stageButton = (name: string) => {
    const rail = screen.getByRole('navigation', { name: /lesson stages/i });
    const b = [...rail.querySelectorAll('button')].find((x) =>
      (x.textContent ?? '').includes(name)
    );
    if (!b) throw new Error(`no stage button ${name}`);
    return b;
  };

  const lesson = () =>
    render(
      <LearnView
        skill="FR.02"
        onBack={() => {}}
        onStartAssessment={() => {}}
        onOpenLesson={() => {}}
        studentId="stu_test"
      />
    );

  it('shows one question at a time and advances', () => {
    lesson();
    fireEvent.click(stageButton('Try it'));
    expect(screen.getByText(/Question 1 of/i)).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: /Next question/i }));
    expect(screen.getByText(/Question 2 of/i)).toBeTruthy();
  });

  it('clears the previous selection when the next question arrives', () => {
    lesson();
    fireEvent.click(stageButton('Try it'));
    // Commit an answer, then advance; no feedback may survive the move.
    // The options are the bordered choice buttons — selecting by leading
    // digit also matched the numbered stage rail, which silently changed
    // stage instead of answering.
    const option = document.querySelector('button.border-2');
    expect(option).toBeTruthy();
    fireEvent.click(option as HTMLElement);
    fireEvent.click(screen.getByRole('button', { name: /Next question/i }));
    expect(screen.queryByText(/That is right/i)).toBeNull();
    expect(screen.queryByText(/Not this one/i)).toBeNull();
  });

  it('counts questions worked, never a score', () => {
    lesson();
    fireEvent.click(stageButton('Try it'));
    // §13 — progression is factual. Nothing on this stage may read as
    // mastery, accuracy or a percentage.
    const text = document.body.textContent ?? '';
    expect(text).not.toMatch(/mastery|streak|\d+%|XP\b/i);
  });
});

describe('§1-§4 the student lesson carries no adult-facing seams', () => {
  const student = () =>
    render(
      <LearnView
        skill="FR.02"
        onBack={() => {}}
        onStartAssessment={() => {}}
        onOpenLesson={() => {}}
        studentId="stu_test"
      />
    );
  const teacher = () =>
    render(
      <LearnView
        skill="FR.02"
        onBack={() => {}}
        onStartAssessment={() => {}}
        onOpenLesson={() => {}}
        audience="teacher"
      />
    );

  it('does not call ordinary practice an assessment', () => {
    const { container } = student();
    expect(container.textContent).not.toMatch(/Mixed assessment/i);
    // Pragati Growth is a governed instrument; a lesson page must not
    // borrow its vocabulary for the adaptive item picker. v0.77.2 went
    // further: the hero no longer opens a second practice door at all,
    // it points at the stage that already teaches.
    expect(container.textContent).toMatch(/Go to Try it/i);
    expect(container.textContent).not.toMatch(/assessment/i);
  });

  it('has no teacher or parent notes and no review disclaimer', () => {
    const { container } = student();
    expect(container.textContent).not.toMatch(/Notes for a teacher or parent/i);
    expect(container.textContent).not.toMatch(/prototype draft/i);
  });

  it('still shows all of it to a teacher, because for them it is the point', () => {
    const { container } = teacher();
    expect(container.textContent).toMatch(/Notes for a teacher or parent/i);
    expect(container.textContent).toMatch(/prototype draft/i);
    expect(container.textContent).toMatch(/Mixed assessment/i);
  });
});

describe('§5/§6 the standard five-stage model', () => {
  it('ends on Think deeper and gives no stage to Common mistakes', () => {
    render(
      <LearnView
        skill="FR.02"
        onBack={() => {}}
        onStartAssessment={() => {}}
        onOpenLesson={() => {}}
        studentId="stu_test"
      />
    );
    const rail = screen.getByRole('navigation', { name: /lesson stages/i });
    const names = [...rail.querySelectorAll('button')].map((b) =>
      (b.textContent ?? '').replace(/^\d/, '').trim()
    );
    expect(names).toEqual([
      'Learn the idea',
      'See it',
      'Worked examples',
      'Try it',
      'Think deeper',
    ]);
  });

  it('keeps the authored misconceptions, beside the worked examples', () => {
    render(
      <LearnView
        skill="FR.02"
        onBack={() => {}}
        onStartAssessment={() => {}}
        onOpenLesson={() => {}}
        studentId="stu_test"
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /Worked examples/i }));
    expect(screen.getByText(/Watch out for/i)).toBeTruthy();
    // Nothing authored was dropped when the stage went away — but the
    // student gets the student reading of it, not the teacher's.
    expect(screen.getAllByText(/Try this:/i).length).toBe(3);
    expect(screen.queryByText(/Why students do this/i)).toBeNull();
    expect(screen.queryByText(/How to fix it/i)).toBeNull();
  });
});
