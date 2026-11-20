// v0.49 §14 + §3 — what a student sees during a session.
//
// Two things this locks down, both found by the visual review rather
// than by the DOM suite:
//   - authoring metadata ("Difficulty (seed): 2/10", the raw skill
//     code, the cognitive-demand tag) must not appear mid-question;
//   - the hint control must be absent in a chapter check and present
//     in practice.

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Assessment } from '../AssessmentView';
import { ITEMS } from '../../../data/items';

const item = ITEMS.find((i) => i.skillId === 'FR.02' && i.kind === 'mcq')!;

function renderAssessment(
  over: Partial<Parameters<typeof Assessment>[0]> = {}
) {
  const onSubmit = vi.fn();
  render(
    <Assessment
      item={item}
      selected={null}
      onSelect={vi.fn()}
      numericInput=""
      onNumericChange={vi.fn()}
      onSubmit={onSubmit}
      submitting={false}
      progress={1}
      total={10}
      studentName="Ada"
      window="practice"
      skillMode="mixed_fractions"
      {...over}
    />
  );
  return { onSubmit };
}

describe('§14 no authoring metadata during a student session', () => {
  for (const purpose of ['practice', 'chapter_check', 'concept_practice'] as const) {
    it(`hides seed difficulty in ${purpose}`, () => {
      renderAssessment({ purpose });
      expect(screen.queryByText(/Difficulty \(seed\)/i)).toBeNull();
    });

    it(`hides the raw skill code chip in ${purpose}`, () => {
      const { container } = render(
        <Assessment
          item={item}
          selected={null}
          onSelect={vi.fn()}
          numericInput=""
          onNumericChange={vi.fn()}
          onSubmit={vi.fn()}
          submitting={false}
          progress={1}
          total={10}
          studentName="Ada"
          window="practice"
          skillMode="mixed_fractions"
          purpose={purpose}
        />
      );
      // The SkillChip in the header still names the mode; what must be
      // gone is the bare item-level code chip.
      const chips = Array.from(
        container.querySelectorAll('.rounded-full')
      ).map((e) => (e.textContent ?? '').trim());
      expect(chips).not.toContain('FR.02');
    });
  }

  it('still shows the metadata in the teacher preview (no purpose set)', () => {
    renderAssessment({});
    expect(screen.getByText(/Difficulty \(seed\)/i)).toBeTruthy();
  });
});

describe('§3 hints follow the session purpose', () => {
  it('a chapter check offers no hint control at all', () => {
    renderAssessment({ purpose: 'chapter_check', showHint: false });
    expect(screen.queryByRole('button', { name: /need a hint/i })).toBeNull();
  });

  it('practice offers a hint that reveals instructional text on demand', () => {
    renderAssessment({ purpose: 'practice', showHint: true });
    const btn = screen.getByRole('button', { name: /need a hint/i });
    // Hidden until asked for.
    expect(screen.queryByText(/^Hint$/)).toBeNull();
    fireEvent.click(btn);
    expect(screen.getByText(/^Hint$/)).toBeTruthy();
  });

  it('labels the session by purpose so a check is never mistaken for practice', () => {
    renderAssessment({ purpose: 'chapter_check' });
    expect(screen.getAllByText(/Chapter check/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/No hints this time/i)).toBeTruthy();
  });
});
