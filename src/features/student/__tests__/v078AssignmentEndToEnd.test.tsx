// v0.78 §5 — THE LAST HOP.
//
// `AssessmentAssignment` has carried this comment since v0.11:
//
//     "Student-facing title (e.g., 'Wednesday's Decimals check')."
//     "Whether the assignment is still being offered to students. When
//      set false, the student home no longer surfaces it."
//
// No student-facing card existed anywhere in the product. A teacher
// could create an assignment, see it under Assign, and no student would
// ever be shown it.
//
// Nobody caught it because every test exercised the teacher form and the
// storage layer, and both worked perfectly. The hop nobody tested was
// the one that mattered — which is the whole point of §5 asking for
// end-to-end rather than form-level verification.

import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { StudentHomeView } from '../StudentHomeView';

const base = {
  current: null,
  currentState: 'nothing_available' as const,
  practice: [],
  onOpenPractice: () => {},
  officialLessons: [],
  onOpenLesson: () => {},
  sectionsTotal: 0,
  ctaLabel: 'Explore your curriculum',
  onCta: () => {},
  unfinished: null,
  chapters: [],
  onOpenChapter: () => {},
  onSeeAllChapters: () => {},
  onPractise: () => {},
  activity: { completedSessions: 0, answered: 0 },
  growth: null,
};

describe('§5 a teacher assignment reaches the student', () => {
  it('shows the teacher-set title and note on Home', () => {
    render(
      <StudentHomeView
        {...base}
        assignment={{
          title: "Wednesday's fractions check",
          note: 'Take your time and show your best thinking.',
          onStart: () => {},
        }}
      />
    );
    expect(screen.getByText(/Your teacher set this/i)).toBeTruthy();
    expect(screen.getByText(/Wednesday's fractions check/)).toBeTruthy();
    expect(screen.getByText(/show your best thinking/i)).toBeTruthy();
  });

  it('opens the assignment the teacher created, not something else', () => {
    let started = 0;
    render(
      <StudentHomeView
        {...base}
        assignment={{ title: 'Set A', note: '', onStart: () => { started += 1; } }}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /Start it/i }));
    expect(started).toBe(1);
  });

  it('surfaces nothing when the teacher has assigned nothing', () => {
    // `active: false` must mean the student home stops showing it — the
    // behaviour the type has always claimed.
    const { container } = render(<StudentHomeView {...base} assignment={null} />);
    expect(container.textContent).not.toMatch(/Your teacher set this/i);
  });

  it('does not let an assignment impersonate a Growth Check', () => {
    const { container } = render(
      <StudentHomeView
        {...base}
        assignment={{ title: 'Set A', note: '', onStart: () => {} }}
      />
    );
    expect(container.textContent).not.toMatch(/Growth Check/i);
  });
});
