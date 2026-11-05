// v0.75 §15/§19/§36 — TEACHER COMPOSITION AND CONTROL HONESTY.

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { TeacherOverviewBody } from '../TeacherShell';
import { TeacherWorkspace } from '../TeacherWorkspace';
import { LAYOUT } from '../../../design/tokens';
import type { OverviewAnalytics } from '../overviewAnalytics';

const EMPTY = {
  isEmpty: true, completedSessionCount: 0, activeStudentCount: 0,
  flagged: [], difficultSkills: [],
} as unknown as OverviewAnalytics;

describe('§15 a control means what its label says', () => {
  it('routes "View curriculum" to curriculum, not to the roster', () => {
    const onOpenCurriculum = vi.fn();
    const onOpenClasses = vi.fn();
    render(
      <TeacherOverviewBody
        analytics={EMPTY} scopeLabel="Class 6A" activeAssignmentTitle={null}
        onOpenAssign={() => {}} onOpenClasses={onOpenClasses}
        onOpenCurriculum={onOpenCurriculum}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: 'View curriculum' }));
    expect(onOpenCurriculum).toHaveBeenCalledTimes(1);
    // The v0.74 behaviour, explicitly asserted as gone.
    expect(onOpenClasses).not.toHaveBeenCalled();
  });

  it('falls back rather than rendering a control that does nothing', () => {
    const onOpenClasses = vi.fn();
    render(
      <TeacherOverviewBody
        analytics={EMPTY} scopeLabel="Class 6A" activeAssignmentTitle={null}
        onOpenAssign={() => {}} onOpenClasses={onOpenClasses}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: 'View curriculum' }));
    expect(onOpenClasses).toHaveBeenCalledTimes(1);
  });
});

describe('§19 the teacher desktop is a workspace, not a centred column', () => {
  const items = [
    { id: 'overview' as const, label: 'Overview', icon: <span /> },
    { id: 'assign' as const, label: 'Assign', icon: <span /> },
  ];

  it('declares a two-column desktop grid', () => {
    // The composition is declared once in LAYOUT so six screens cannot
    // each pick their own max-width and reproduce the centred column.
    expect(LAYOUT.workspace).toMatch(/lg:grid-cols-\[14rem_minmax\(0,1fr\)\]/);
    expect(LAYOUT.workspace).toMatch(/max-w-\[90rem\]/);
  });

  it('renders a persistent navigation rail', () => {
    const { container } = render(
      <TeacherWorkspace items={items} active="overview" onSelect={() => {}}>
        <p>work</p>
      </TeacherWorkspace>
    );
    const rail = container.querySelector('nav[aria-label="Teacher sections"]')!;
    expect(rail).toBeTruthy();
    expect(within(rail as HTMLElement).getByRole('button', { name: /Overview/ })).toBeTruthy();
  });

  it('marks the active destination for assistive tech, not by colour alone', () => {
    render(
      <TeacherWorkspace items={items} active="assign" onSelect={() => {}}>
        <p>work</p>
      </TeacherWorkspace>
    );
    const active = screen.getByRole('button', { name: /Assign/ });
    expect(active.getAttribute('aria-current')).toBe('page');
    expect(
      screen.getByRole('button', { name: /Overview/ }).getAttribute('aria-current')
    ).toBeNull();
  });

  it('gives every rail control a 44px target', () => {
    const { container } = render(
      <TeacherWorkspace items={items} active="overview" onSelect={() => {}}>
        <p>work</p>
      </TeacherWorkspace>
    );
    const rail = container.querySelector('nav[aria-label="Teacher sections"]')!;
    for (const b of rail.querySelectorAll('button')) {
      expect(b.className).toMatch(/min-h-\[44px\]/);
    }
  });

  it('omits the context column rather than inventing one to fill space', () => {
    const { container } = render(
      <TeacherWorkspace items={items} active="overview" onSelect={() => {}}>
        <p>work</p>
      </TeacherWorkspace>
    );
    expect(container.querySelector('.xl\\:grid-cols-\\[minmax\\(0\\,1fr\\)_18rem\\]')).toBeNull();
  });

  it('places context beside the work when there is real context', () => {
    const { container } = render(
      <TeacherWorkspace
        items={items} active="overview" onSelect={() => {}}
        context={<p>curriculum context</p>}
      >
        <p>work</p>
      </TeacherWorkspace>
    );
    expect(screen.getByText('curriculum context')).toBeTruthy();
    expect(container.querySelector('[class*="18rem"]')).toBeTruthy();
  });
});
