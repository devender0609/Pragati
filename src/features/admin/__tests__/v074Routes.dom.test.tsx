// v0.74 §9/§11/§12 — THE ROUTES NOBODY HAD VERIFIED.
//
// Two top-level destinations shipped for several releases without a
// single test or capture proving what they open:
//
//   Student Practice — in the bottom nav on every screen since v0.49.
//   Teacher Assess   — in the desktop header since v0.52.
//
// The second turned out to be worse than untested. v0.71 §17 cut the
// phone nav from six tabs to four and left a comment saying "Nothing is
// removed — Assess and Insights are reachable from the Overview". They
// were not: `TeacherOverviewBody` had no route to either, and the
// header nav is `hidden` below `md`, so at 390px the Assess button
// measured 0x0. Two teacher workflows were unreachable on a phone,
// behind a comment asserting the opposite.

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { TeacherOverviewBody } from '../../teacher/TeacherShell';
import { ContentPlanPanel } from '../ContentPlanPanel';
import { StructureVerificationPanel } from '../StructureVerificationPanel';
import { CoverageMatrixPanel } from '../CoverageMatrixPanel';
import type { OverviewAnalytics } from '../../teacher/overviewAnalytics';

const EMPTY_ANALYTICS: OverviewAnalytics = {
  isEmpty: true,
  completedSessionCount: 0,
  activeStudentCount: 0,
  flagged: [],
  difficultSkills: [],
} as unknown as OverviewAnalytics;

describe('§11/§12 Teacher Assess and Insights are reachable', () => {
  function renderOverview(extra: Record<string, unknown> = {}) {
    const onOpenAssess = vi.fn();
    const onOpenInsights = vi.fn();
    render(
      <TeacherOverviewBody
        analytics={EMPTY_ANALYTICS}
        scopeLabel="Class 6A"
        activeAssignmentTitle={null}
        onOpenAssign={() => {}}
        onOpenClasses={() => {}}
        onOpenAssess={onOpenAssess}
        onOpenInsights={onOpenInsights}
        {...extra}
      />
    );
    return { onOpenAssess, onOpenInsights };
  }

  it('offers a route to Assess from the Overview', () => {
    const { onOpenAssess } = renderOverview();
    const tools = screen.getByText('More teacher tools').closest('section')!;
    fireEvent.click(within(tools).getByRole('button', { name: 'Assess' }));
    expect(onOpenAssess).toHaveBeenCalledTimes(1);
  });

  it('offers a route to Insights from the Overview', () => {
    const { onOpenInsights } = renderOverview();
    const tools = screen.getByText('More teacher tools').closest('section')!;
    fireEvent.click(within(tools).getByRole('button', { name: 'Insights' }));
    expect(onOpenInsights).toHaveBeenCalledTimes(1);
  });

  it('omits the control rather than rendering a dead one', () => {
    // §12 — no visible teacher action may silently do nothing. A caller
    // that supplies no handler must get no button, not a button that
    // does nothing when tapped.
    render(
      <TeacherOverviewBody
        analytics={EMPTY_ANALYTICS}
        scopeLabel="Class 6A"
        activeAssignmentTitle={null}
        onOpenAssign={() => {}}
        onOpenClasses={() => {}}
      />
    );
    expect(screen.queryByText('More teacher tools')).toBeNull();
  });

  it('gives the Overview onboarding actions real handlers', () => {
    const onOpenAssign = vi.fn();
    const onOpenClasses = vi.fn();
    render(
      <TeacherOverviewBody
        analytics={EMPTY_ANALYTICS}
        scopeLabel="Class 6A"
        activeAssignmentTitle={null}
        onOpenAssign={onOpenAssign}
        onOpenClasses={onOpenClasses}
      />
    );
    // Both labels appear more than once on the onboarding Overview
    // (a tile and a card). Clicking the first is the honest test: what
    // matters is that a visible control fires a handler.
    fireEvent.click(screen.getAllByRole('button', { name: 'Open Classes' })[0]);
    fireEvent.click(
      screen.getAllByRole('button', { name: 'Create assignment' })[0]
    );
    expect(onOpenClasses).toHaveBeenCalled();
    expect(onOpenAssign).toHaveBeenCalled();
  });
});

describe('§1/§7 the admin plan panel states both halves of "blocked"', () => {
  it('separates people-blocked from engineering-blocked', () => {
    render(<ContentPlanPanel />);
    expect(screen.getByText('Blocked on people, not engineering')).toBeTruthy();
    // The half v0.73 omitted, which was seven of the eight.
    expect(screen.getByText('Blocked on engineering, not people')).toBeTruthy();
    // v0.75 §21/§22 — the engineering half emptied: 1/7 became 9/0.
    // Both headings stay, because the panel's job is to show BOTH
    // halves of "blocked" even when one of them is zero.
    expect(screen.getByText(/^9 complete drafts$/)).toBeTruthy();
    expect(screen.getByText(/^0 complete drafts$/)).toBeTruthy();
  });

  it('names the Fractions shape as an observation, not a target', () => {
    render(<ContentPlanPanel />);
    expect(screen.getByText('Observed Middle Stage Fractions shape')).toBeTruthy();
    expect(screen.getByText(/evidence, not doctrine/i)).toBeTruthy();
  });

  it('shows four stages as production standard pending', () => {
    render(<ContentPlanPanel />);
    // Scope to the stage list: the explanatory paragraph above it uses
    // the same phrase, and counting both would make this pass for the
    // wrong reason.
    const list = screen
      .getByText('Authoring standard by stage')
      .closest('div')!
      .querySelector('ul')!;
    expect(
      within(list).getAllByText('production standard pending')
    ).toHaveLength(4);
    expect(within(list).getAllByText('audited standard')).toHaveLength(1);
  });

  it('never presents one conflated authoring number', () => {
    render(<ContentPlanPanel />);
    expect(screen.getByText('Authoring items')).toBeTruthy();
    expect(screen.getByText('Design decisions')).toBeTruthy();
    expect(screen.queryByText('483')).toBeNull();
  });
});

describe('§20 the structure-verification blocker cannot be missed', () => {
  it('names all seven grades on the surface that reports the backlog', () => {
    render(<StructureVerificationPanel />);
    expect(screen.getByText(/7 of 12/)).toBeTruthy();
    expect(
      screen.getByText('Class 1 · Class 2 · Class 3 · Class 4 · Class 5 · Class 7 · Class 8')
    ).toBeTruthy();
  });

  it('says the unknown count is unknown, never zero', () => {
    render(<StructureVerificationPanel />);
    expect(screen.getByText(/Unknown/)).toBeTruthy();
    expect(screen.getByText(/not because they are complete/i)).toBeTruthy();
  });

  it('gives each grade a template and a human action', () => {
    render(<StructureVerificationPanel />);
    fireEvent.click(screen.getByRole('button', { name: /Show what each grade needs/ }));
    expect(screen.getAllByText('PERSON')).toHaveLength(7);
    expect(
      screen.getAllByText(/curriculum-verification\/grade\d+_/).length
    ).toBe(7);
  });
});

describe('§5 the in-app coverage panel matches the document', () => {
  it('derives its backlog sentence instead of hard-coding one', () => {
    render(<CoverageMatrixPanel />);
    // The same derived sentence the markdown carries, so the app and
    // the document cannot disagree about how many records hold nothing.
    expect(
      screen.getByText(/80 hold no instructional content at all/)
    ).toBeTruthy();
    expect(screen.getByText(/0 are reviewed and 0 are published/)).toBeTruthy();
  });

  it('carries the unknown-curriculum caveat beside the total', () => {
    render(<CoverageMatrixPanel />);
    expect(screen.getByText(/contribute nothing to this figure/)).toBeTruthy();
  });

  it('no longer says all 89 records need review', () => {
    render(<CoverageMatrixPanel />);
    // 24 are syllabus units with nothing for an educator to read.
    const dt = screen.getByText('Will need review');
    expect(dt.nextElementSibling!.textContent).toBe('65');
  });
});
