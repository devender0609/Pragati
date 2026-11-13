// v0.79 §11/§17 — TEACHER ROUTE INTEGRITY.
//
// Two defects these pin, both found by reading the routing rather than
// the screens:
//
//   §11  Classes and Assign left the shell entirely. Selecting either
//        set a top-level view, so the teacher lost the rail, the class
//        scope and the navigation, and landed on a page whose only exit
//        was a "Back to teacher home" link. Two of six destinations
//        were a different product.
//
//   §17  the phone bottom bar carries four of six tabs and the wider
//        navigation only appears at `md`. On a 390px phone Assess and
//        Insights had NO route. That is a functional defect, and it
//        survived because nobody probed the phone for the tabs missing
//        from it.

import { describe, it, expect } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { TeacherShell } from '../TeacherShell';

const noop = () => {};

function shell(active: 'overview' | 'assess' | 'insights' = 'overview') {
  const switched: string[] = [];
  const utils = render(
    <TeacherShell
      activeTab={active}
      onSwitchTab={(t) => switched.push(t)}
      onOpenOverviewSummary={noop}
      onOpenClasses={noop}
      onOpenAssign={noop}
      onOpenInsights={noop}
      onOpenResources={noop}
      onOpenPilotSetup={noop}
      onOpenItemReview={noop}
      onOpenAlignmentReview={noop}
      onOpenCurriculumCoverage={noop}
      onOpenExports={noop}
      classrooms={[]}
      selectedClassroomId={null}
      onSelectClassroom={noop}
    >
      <div>body</div>
    </TeacherShell>
  );
  return { ...utils, switched };
}

describe('§17 every teacher destination is reachable on a phone', () => {
  it('offers Assess and Insights from Overview, where the bottom bar cannot', () => {
    const { container, switched } = shell('overview');
    // The bottom bar renders four tabs; the phone-only row renders the
    // other two. Select from that row specifically, since "Assess" also
    // appears in the desktop rail in the same DOM.
    const row = container.querySelector('.md\\:hidden');
    const buttons = [...(row?.querySelectorAll('button') ?? [])];
    const names = buttons.map((b) => b.textContent?.trim());
    expect(names).toContain('Assess');
    expect(names).toContain('Insights');
    for (const b of buttons) fireEvent.click(b);
    expect(switched).toContain('assess');
    expect(switched).toContain('insights');
  });

  it('names all six destinations somewhere in the shell', () => {
    const { container } = shell('overview');
    for (const label of [
      'Overview',
      'Classes',
      'Assign',
      'Assess',
      'Insights',
      'Resources',
    ]) {
      expect(container.textContent, label).toContain(label);
    }
  });
});

describe('§5 teacher carries the Pragati brand at professional density', () => {
  it('drops the all-caps tracked eyebrow from the chrome', () => {
    const { container } = shell();
    // Scoped to the chrome deliberately. Other teacher bodies still
    // carry tracked labels — ReadinessMatrix and the completeness view
    // among them — and those are Admin-adjacent surfaces this release
    // did not reach. Asserting the whole tree would either fail
    // truthfully or tempt a sweeping find-and-replace across screens
    // nobody has looked at.
    const chrome = [...container.querySelectorAll('div')].find((d) =>
      (d.textContent ?? '').includes('Teacher · Mathematics')
    );
    expect(chrome).toBeTruthy();
    expect(chrome?.className).not.toMatch(/uppercase/);
    const heading = chrome?.querySelector('.font-display');
    expect(heading?.textContent).toContain('Teacher · Mathematics');
  });
});
