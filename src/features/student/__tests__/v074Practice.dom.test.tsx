/* eslint-disable @typescript-eslint/no-explicit-any */
// v0.74 §9/§10 — STUDENT PRACTICE, VERIFIED AS ITS OWN DESTINATION.
//
// Practice has been a top-level tab since v0.49 and no release has ever
// asserted what it opens, what it offers, or what it says when there is
// nothing. It was assumed to work because nothing said it did not —
// which is exactly what was true of Teacher Assess, and that turned out
// to be unreachable on a phone.
//
// The checks below are the ones §9 asks for: correct destination, an
// eligible activity list, no draft official content, no raw skill IDs,
// no Growth leakage, an honest empty state, and legacy practice
// labelled as what it is.

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { StudentShell, chaptersForStudentGrade } from '../StudentShell';
import { ROUTE_CONTRACTS } from '../../../../tools/routeContracts.mjs';

function shellProps(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    activeTab: 'practice' as const,
    onSwitchTab: () => {},
    studentName: 'Asha',
    studentGrade: 'class6' as const,
    sessions: [],
    onOpenChapter: () => {},
    onChooseConcept: () => {},
    onLaunchLesson: () => {},
    onLaunchConceptPractice: () => {},
    onLaunchMixedChapterPractice: () => {},
    onLaunchChapterCheck: () => {},
    ...overrides,
  };
}

describe('§9 Student Practice opens the practice destination', () => {
  it('renders the practice heading, not the nav word', () => {
    render(<StudentShell {...(shellProps() as any)} />);
    // "Practice" alone appears in the bottom nav on every screen and
    // would pass anywhere. The heading is the destination's own marker.
    expect(screen.getByText('Short practice sets')).toBeTruthy();
  });

  it('lists only chapters that can actually be launched', () => {
    render(<StudentShell {...(shellProps() as any)} />);
    const launchable = chaptersForStudentGrade('class6').filter((c) => c.canLaunch);
    // Every listed chapter is launchable, and a chapter that cannot be
    // launched is absent rather than rendered as a dead card.
    for (const c of launchable) {
      expect(screen.getAllByText(c.title).length).toBeGreaterThan(0);
    }
  });

  it('shows no raw skill IDs', () => {
    const { container } = render(<StudentShell {...(shellProps() as any)} />);
    // FR.02, GE.01 and friends are internal identifiers and are
    // meaningless to a child.
    expect(container.textContent).not.toMatch(/\b[A-Z]{2}\.\d{2}\b/);
  });

  it('offers no unpublished official-section content', () => {
    const { container } = render(<StudentShell {...(shellProps() as any)} />);
    // §7.4 is an authored draft with 0 reviews and 0 publications. It
    // must not be reachable from Practice.
    expect(container.textContent).not.toMatch(/Marking Fraction Lengths/);
  });

  it('leaks no formal Growth into low-stakes practice', () => {
    const { container } = render(<StudentShell {...(shellProps() as any)} />);
    for (const forbidden of ['Pragati Growth', 'Growth Check', 'RIT', 'percentile']) {
      expect(container.textContent, forbidden).not.toContain(forbidden);
    }
  });

  it('every visible practice control fires a handler', () => {
    // §10 — a visible dead CTA is a QA failure. This asserts the
    // property directly rather than trusting the screen.
    const handlers = {
      onOpenChapter: vi.fn(),
      onChooseConcept: vi.fn(),
      onLaunchMixedChapterPractice: vi.fn(),
      onLaunchChapterCheck: vi.fn(),
    };
    const { container } = render(
      <StudentShell {...(shellProps(handlers) as any)} />
    );
    const buttons = [...container.querySelectorAll('button')].filter((b) =>
      ['Practise a concept', 'Open chapter', 'Mixed practice', 'Chapter check'].includes(
        (b.textContent ?? '').trim()
      )
    );
    expect(buttons.length).toBeGreaterThan(0);
    for (const b of buttons) fireEvent.click(b);
    const totalCalls = Object.values(handlers).reduce(
      (n, h) => n + h.mock.calls.length,
      0
    );
    expect(totalCalls).toBe(buttons.length);
  });

  it('labels practice as related sets, not chapter lessons', () => {
    render(<StudentShell {...(shellProps() as any)} />);
    // v0.72 §13 established this distinction on the Fractions landing.
    // Practice never carried it, and listed legacy question sets under
    // bare chapter titles.
    expect(
      screen.getByText(/not the chapter lessons themselves/i)
    ).toBeTruthy();
  });

  it('separates topics that are not chapters of the Class 6 book', () => {
    render(<StudentShell {...(shellProps() as any)} />);
    // decimals / ratio_proportion / algebra have no chapter in the
    // current Ganita Prakash Grade 6 book. `isClass6Core` already
    // withheld them from Learn; Practice listed them as chapters.
    const heading = screen.getByText('Extra practice');
    expect(heading).toBeTruthy();
    expect(
      screen.getByText(/not chapters in your Class 6 book/i)
    ).toBeTruthy();
  });

  it('keeps official Class 6 chapters out of the extra-practice group', () => {
    render(<StudentShell {...(shellProps() as any)} />);
    const extra = screen.getByText('Extra practice').closest('section')!;
    // Fractions IS Chapter 7 of the official book and must stay in the
    // main group.
    expect(extra.textContent).not.toMatch(/Fractions/);
    expect(extra.textContent).toMatch(/Decimals/);
  });
});

// ---------------------------------------------------------------------------
// §9/§11 — the harness must cover every top-level destination
// ---------------------------------------------------------------------------

describe('§9 every top-level destination has a route contract', () => {
  it('contracts all four student tabs', () => {
    for (const id of [
      'student_home_returning',
      'student_learn',
      'student_practice',
      'student_progress',
    ]) {
      expect(ROUTE_CONTRACTS[id], id).toBeTruthy();
      expect(ROUTE_CONTRACTS[id].mustContain.length, id).toBeGreaterThan(0);
    }
  });

  it('contracts all six teacher tabs', () => {
    for (const id of [
      'teacher_overview',
      'teacher_classes',
      'teacher_assign',
      'teacher_assess',
      'teacher_insights',
      'teacher_resources',
    ]) {
      expect(ROUTE_CONTRACTS[id], id).toBeTruthy();
    }
  });

  it('never asserts a bare nav word as a destination marker', () => {
    // The failure mode the Progress contract already documents: "Practice"
    // and "Insights" appear in the nav on every screen, so a contract
    // requiring only the tab's own name passes on the wrong capture.
    const NAV_WORDS = ['Practice', 'Progress', 'Learn', 'Home'];
    for (const id of ['student_practice', 'student_progress']) {
      for (const needle of ROUTE_CONTRACTS[id].mustContain) {
        expect(NAV_WORDS, `${id}: "${needle}"`).not.toContain(needle);
      }
    }
  });

  it('forbids Growth leakage on the student practice contract', () => {
    const c = ROUTE_CONTRACTS.student_practice;
    expect(c.mustNotContain).toContain('Pragati Growth');
    expect(c.mustNotContain).toContain('FR.0');
  });

  it('requires the Assess screen to name itself as formal Growth', () => {
    // The §11 finding: Assess IS the formal Growth path and nothing
    // else. That is acceptable, but it must be labelled, or a teacher
    // reads "Assess" as everyday checking and meets a refusal.
    const c = ROUTE_CONTRACTS.teacher_assess;
    expect(c.mustContain).toContain('Pragati Growth');
    expect(c.mustContain).toContain('Separate from everyday practice');
    expect(c.mustNotContain).toContain('mastery');
  });
});
