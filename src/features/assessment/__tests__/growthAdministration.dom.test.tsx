// v0.51 §7 + §12(testing) — Growth administration workflow.

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  GrowthAssignPanel, GrowthCheckCard, GrowthInstructions, GrowthComplete,
  PILOT_TEST_LENGTH,
} from '../GrowthAdministration';
import type { FormalAssignmentStudentView } from '../formalAssignmentStore';

const noop = () => {};
// v0.61 §3 — the student card takes the DERIVED formal view. The legacy
// GrowthAssignment record is no longer reachable from formal UI.
const assignment: FormalAssignmentStudentView = { assignmentId: 'a1' };

describe('§7 the teacher workflow refuses to assign an unrunnable test', () => {
  it('explains unavailability in teacher language, not diagnostics', () => {
    const { container } = render(
      <GrowthAssignPanel
        classrooms={[{ id: 'room-a', name: 'Class 6 Blue', grade: 'class6' }]}
        selectedClassroomId="room-a"
        onSelectClassroom={noop}
        onAssign={noop}
      />
    );
    expect(screen.getByText(/isn't ready to assign yet/i)).toBeTruthy();
    // Reassures that the rest of the product still works.
    expect(screen.getByText(/Learn and Practice are unaffected/i)).toBeTruthy();
    // v0.53 §12 — no file paths or developer diagnostics by default.
    const text = container.textContent ?? '';
    expect(text).not.toMatch(/docs\/|\.md\b|specificationId|item bank yet/i);
  });

  it('offers an expandable explanation rather than front-loading detail', () => {
    render(
      <GrowthAssignPanel
        classrooms={[{ id: 'room-a', name: 'Class 6 Blue', grade: 'class6' }]}
        selectedClassroomId="room-a"
        onSelectClassroom={noop}
        onAssign={noop}
      />
    );
    const summary = screen.getByText(/Why isn't Growth ready\?/i);
    expect(summary.closest('details')).toBeTruthy();
  });

  it('states what is done and what remains', () => {
    render(
      <GrowthAssignPanel
        classrooms={[{ id: 'room-a', name: 'Class 6 Blue', grade: 'class6' }]}
        selectedClassroomId="room-a"
        onSelectClassroom={noop}
        onAssign={noop}
      />
    );
    expect(screen.getByText(/^Done$/i)).toBeTruthy();
    expect(screen.getByText(/Still to come/i)).toBeTruthy();
  });

  it('disables the assign action while the bank is empty', () => {
    render(
      <GrowthAssignPanel
        classrooms={[{ id: 'room-a', name: 'Class 6 Blue', grade: 'class6' }]}
        selectedClassroomId="room-a"
        onSelectClassroom={noop}
        onAssign={vi.fn()}
      />
    );
    expect(screen.getByRole('button', { name: /assign to class/i })).toBeDisabled();
  });

  it('offers class, window, and accommodation steps in order', () => {
    render(
      <GrowthAssignPanel
        classrooms={[{ id: 'room-a', name: 'Class 6 Blue', grade: 'class6' }]}
        selectedClassroomId={null}
        onSelectClassroom={noop}
        onAssign={noop}
      />
    );
    expect(screen.getByText(/1\. Class/)).toBeTruthy();
    expect(screen.getByText(/2\. Testing window/)).toBeTruthy();
    expect(screen.getByText(/3\. Access and support/)).toBeTruthy();
  });

  it('states the pilot length from the specification, not the old 10-item assumption', () => {
    render(
      <GrowthAssignPanel classrooms={[]} selectedClassroomId={null}
        onSelectClassroom={noop} onAssign={noop} />
    );
    expect(PILOT_TEST_LENGTH).toBeGreaterThan(10);
    expect(screen.getByText(new RegExp(`${PILOT_TEST_LENGTH} questions`))).toBeTruthy();
  });

  it('uses the canonical support model without a blanket comparability claim', () => {
    const { container } = render(
      <GrowthAssignPanel classrooms={[]} selectedClassroomId={null}
        onSelectClassroom={noop} onAssign={noop} />
    );
    // v0.57 §8 — the v0.56 blanket claim is gone.
    expect(container.textContent ?? '').not.toMatch(/may not be directly comparable/i);
    expect(screen.getByText(/Supports are recorded with the session/i)).toBeTruthy();
    // Categorised: a universal feature and a construct-altering
    // modification must read differently.
    expect(screen.getAllByText(/Available to everyone/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/May change what is measured/i).length).toBeGreaterThan(0);
  });
});

describe('§6 Growth appears on Home only when assigned', () => {
  it('renders nothing when there is no assignment', () => {
    const { container } = render(<GrowthCheckCard assignment={null} onBegin={noop} />);
    expect(container.textContent).toBe('');
  });

  it('renders the Growth Check card when assigned', () => {
    render(<GrowthCheckCard assignment={assignment} onBegin={noop} />);
    expect(screen.getByText(/Your Growth Check is ready/i)).toBeTruthy();
  });

  it('uses child-friendly framing, not assessment jargon', () => {
    const { container } = render(<GrowthCheckCard assignment={assignment} onBegin={noop} />);
    const text = container.textContent ?? '';
    expect(text).not.toMatch(/adaptive|diagnostic|blueprint|psychometric|calibrat|interim/i);
    expect(text).toMatch(/not a test you can fail/i);
  });

  it('starts the workflow', () => {
    const onBegin = vi.fn();
    render(<GrowthCheckCard assignment={assignment} onBegin={onBegin} />);
    fireEvent.click(screen.getByRole('button', { name: /start/i }));
    expect(onBegin).toHaveBeenCalledTimes(1);
  });
});

describe('§6 instructions set the right expectations', () => {
  it('warns there are no hints and no answers', () => {
    render(
      <GrowthInstructions studentName="Ada" itemCount={35} onBegin={noop} onBack={noop} />
    );
    expect(screen.getByText(/no hints this time/i)).toBeTruthy();
    expect(screen.getByText(/will not see the answers/i)).toBeTruthy();
  });

  it('normalises difficulty rather than implying failure', () => {
    render(
      <GrowthInstructions studentName="Ada" itemCount={35} onBegin={noop} onBack={noop} />
    );
    expect(screen.getByText(/That is normal/i)).toBeTruthy();
  });

  it('allows backing out before the lock takes effect', () => {
    const onBack = vi.fn();
    render(
      <GrowthInstructions studentName="Ada" itemCount={35} onBegin={noop} onBack={onBack} />
    );
    fireEvent.click(screen.getByRole('button', { name: /not now/i }));
    expect(onBack).toHaveBeenCalled();
  });
});

describe('§19 the completion screen reports no score', () => {
  it('states only how many questions were answered', () => {
    const { container } = render(
      <GrowthComplete studentName="Ada" itemsAnswered={35} onDone={noop} />
    );
    const text = container.textContent ?? '';
    expect(text).toMatch(/answered 35 questions/i);
    for (const claim of ['percentile', 'score', 'level', 'rank', 'ability', 'mastery']) {
      expect(text.toLowerCase()).not.toContain(claim);
    }
  });
});
