// v0.78 §9/§10/§12/§15 — ASSIGN SEMANTICS.
//
// The old screen offered one undifferentiated thing called an
// "assessment". These tests pin the four kinds apart, and pin the one
// that must never appear.

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AssignmentsView } from '../../../components/AssignmentsView';
import { officialChapterLearnState } from '../../../curriculum/eligibilityPolicy';
import { class6ChapterCards } from '../../../curriculum/studentChapterModel';

const view = () =>
  render(
    <AssignmentsView
      onBack={() => {}}
      onCreate={() => {}}
      onEdit={() => {}}
      onChanged={() => {}}
    />
  );

describe('§9 Assign is about learning, not the old assessment prototype', () => {
  it('no longer calls the screen or its output an assessment card', () => {
    const { container } = view();
    expect(container.textContent).toMatch(/Assign learning/);
    expect(container.textContent).not.toMatch(/Assign assessments/);
    expect(container.textContent).not.toMatch(/assessment cards/i);
  });

  it('offers the three assignable kinds separately', () => {
    view();
    expect(screen.getByText('Official lesson')).toBeTruthy();
    expect(screen.getByText('Related practice')).toBeTruthy();
    expect(screen.getByText('Instructional check')).toBeTruthy();
  });
});

describe('§12 Growth stays separate and stays frozen', () => {
  it('names Growth only to say it is not assigned here', () => {
    const { container } = view();
    expect(screen.getByText('Pragati Growth')).toBeTruthy();
    // v0.78 §12 — the statement moved into the group heading when the
    // four kinds were regrouped by availability. Same claim, said once
    // where it applies to the whole group.
    expect(container.textContent).toMatch(/not assigned from here/i);
    expect(container.textContent).toMatch(/separate, governed product/i);
    // An instructional check must never inherit Growth's claims.
    expect(container.textContent).not.toMatch(/mastery|ability scale|norm-referenced/i);
  });
});

describe('§10 eligibility comes from the canonical policy', () => {
  it('offers no official lesson while none is student-eligible', () => {
    // Nine Fractions drafts exist and none is reviewed, so there is
    // nothing official to assign. The screen must say so rather than
    // fabricate one to look populated.
    const anyOfficial = class6ChapterCards().some(
      (c) => officialChapterLearnState(c.officialChapterId) === 'official_learn_available'
    );
    expect(anyOfficial).toBe(false);
    const { container } = view();
    expect(container.textContent).toMatch(/none available/);
  });

  it('never presents related legacy practice as the chapter lesson', () => {
    const { container } = view();
    expect(container.textContent).toMatch(/never as the chapter's lesson/i);
  });

  it('says which chapters are being prepared, from the same policy', () => {
    const preparing = class6ChapterCards().filter(
      (c) => officialChapterLearnState(c.officialChapterId) === 'official_lessons_preparing'
    );
    const { container } = view();
    if (preparing.length > 0) {
      expect(container.textContent).toMatch(/being\s+prepared/i);
    }
  });
});
