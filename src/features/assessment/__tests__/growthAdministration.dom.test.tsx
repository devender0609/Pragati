// v0.51 §7 + §12(testing) — Growth administration workflow.

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  GrowthAssignPanel, GrowthCheckCard, GrowthInstructions, GrowthComplete,
  PILOT_TEST_LENGTH,
} from '../GrowthAdministration';
import type { GrowthAssignment } from '../growthSession';

const noop = () => {};
const assignment: GrowthAssignment = {
  id: 'a1', classroomId: 'room-a', assessmentId: 'pragati_growth_mathematics',
  window: 'mid_year', opensAt: 0, closesAt: 9e15,
  accommodationsByStudentId: {}, createdAt: 0,
};

describe('§7 the teacher workflow refuses to assign an unrunnable test', () => {
  it('explains that no Growth items exist', () => {
    render(
      <GrowthAssignPanel
        classrooms={[{ id: 'room-a', name: 'Class 6 Blue' }]}
        selectedClassroomId="room-a"
        onSelectClassroom={noop}
        onAssign={noop}
      />
    );
    expect(screen.getByText(/cannot be assigned yet/i)).toBeTruthy();
    expect(screen.getByText(/no authored Growth item bank/i)).toBeTruthy();
  });

  it('disables the assign action while the bank is empty', () => {
    render(
      <GrowthAssignPanel
        classrooms={[{ id: 'room-a', name: 'Class 6 Blue' }]}
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
        classrooms={[{ id: 'room-a', name: 'Class 6 Blue' }]}
        selectedClassroomId={null}
        onSelectClassroom={noop}
        onAssign={noop}
      />
    );
    expect(screen.getByText(/1\. Class/)).toBeTruthy();
    expect(screen.getByText(/2\. Testing window/)).toBeTruthy();
    expect(screen.getByText(/3\. Accommodations/)).toBeTruthy();
  });

  it('states the pilot length from the specification, not the old 10-item assumption', () => {
    render(
      <GrowthAssignPanel classrooms={[]} selectedClassroomId={null}
        onSelectClassroom={noop} onAssign={noop} />
    );
    expect(PILOT_TEST_LENGTH).toBeGreaterThan(10);
    expect(screen.getByText(new RegExp(`${PILOT_TEST_LENGTH} questions`))).toBeTruthy();
  });

  it('explains why accommodations are recorded', () => {
    render(
      <GrowthAssignPanel classrooms={[]} selectedClassroomId={null}
        onSelectClassroom={noop} onAssign={noop} />
    );
    expect(screen.getByText(/may not be directly comparable/i)).toBeTruthy();
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
