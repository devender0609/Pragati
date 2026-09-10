// v0.68 §12/§13/§23 — the reviewer preview renders all nine parts, the
// quality summary, and draft notes that cannot authorise anything.

import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';

/** The chapter title appears in both the quality table and the walk
 *  list. Only the walk list entry is a button, so target that. */
function openPart(title: string) {
  const button = screen
    .getAllByText(title)
    .map((el) => el.closest('button'))
    .find((b): b is HTMLButtonElement => b !== null);
  if (!button) throw new Error(`no clickable entry for '${title}'`);
  fireEvent.click(button);
}
import { ChapterReviewPreview } from '../ChapterReviewPreview';
import { ChapterQualitySummary } from '../ChapterQualitySummary';
import { CurriculumCompletenessForTeachers } from '../../teacher/CurriculumCompletenessForTeachers';
import {
  addReviewNote,
  exportReviewNotes,
  reviewNotesFor,
  allReviewNotes,
} from '../reviewNotes';
import { fractionsChapterSections } from '../../../curriculum/fractionsChapter';

beforeEach(() => {
  globalThis.localStorage?.clear();
});

describe('§12 reviewer preview', () => {
  it('lists all nine official parts', () => {
    render(<ChapterReviewPreview onBack={() => {}} />);
    for (const s of fractionsChapterSections()) {
      expect(screen.getAllByText(s.source.exactTitle).length).toBeGreaterThan(0);
    }
  });

  it('opens a part and shows its authoring decisions', () => {
    render(<ChapterReviewPreview onBack={() => {}} />);
    openPart('Fractional Units and Equal Shares');
    expect(screen.getByText('Authoring decisions (for review)')).toBeTruthy();
    expect(screen.getByText(/Concept boundary/)).toBeTruthy();
    expect(screen.getByText('Reviewer notes (draft)')).toBeTruthy();
  });

  it('records a draft note and keeps it clearly non-authoritative', () => {
    render(<ChapterReviewPreview onBack={() => {}} />);
    openPart('Comparing Fractions');
    const box = screen.getByLabelText('Note');
    fireEvent.change(box, { target: { value: 'Check the landmark task wording.' } });
    fireEvent.click(screen.getByText('Add note'));

    const notes = reviewNotesFor('ncert_gp_c6_s7_7');
    expect(notes).toHaveLength(1);
    expect(notes[0].status).toBe('internal_draft_note');
  });

  it('exports notes with a header disclaiming review authority', () => {
    addReviewNote('ncert_gp_c6_s7_1', 'mathematical', 'Example note.');
    const out = exportReviewNotes();
    expect(out).toMatch(/NOT educator-review evidence/);
    expect(out).toMatch(/do not authorise publication/);
    expect(allReviewNotes()).toHaveLength(1);
  });
});

describe('§13 chapter quality summary', () => {
  it('shows counts for every part and no score', () => {
    const { container } = render(<ChapterQualitySummary />);
    expect(screen.getByText(/quality summary/i)).toBeTruthy();
    expect(screen.getByText(/No quality score is calculated/i)).toBeTruthy();
    expect(container.textContent).not.toMatch(/\b\d{1,3}%\s*(complete|quality)/i);
  });

  it('identifies §7.4 as a frozen projected artifact for reviewers only', () => {
    render(<ChapterQualitySummary />);
    expect(screen.getByText(/frozen_v1_projected/)).toBeTruthy();
    expect(screen.getByText(/S74-v1-A1A3FF/)).toBeTruthy();
    expect(screen.getByText(/a1a3ff57/)).toBeTruthy();
  });
});

describe('Classes 1-12 §F teacher coverage table', () => {
  it('shows all twelve classes', () => {
    render(<CurriculumCompletenessForTeachers />);
    for (let n = 1; n <= 12; n++) {
      expect(screen.getAllByText(`Class ${n}`).length).toBeGreaterThan(0);
    }
  });

  it('renders an unknown denominator as the word, never as zero', () => {
    render(<CurriculumCompletenessForTeachers />);
    const row = screen.getAllByText('Class 3')[0].closest('tr')!;
    expect(within(row).getAllByText('Unknown').length).toBeGreaterThan(0);
  });

  it('shows a verified grade with no Pragati content as a real gap', () => {
    render(<CurriculumCompletenessForTeachers />);
    const row = screen.getAllByText('Class 10')[0].closest('tr')!;
    // 7 official units, 7 not yet available — the chapters do not vanish.
    expect(within(row).getAllByText('7').length).toBeGreaterThanOrEqual(2);
  });

  it('states no percentage anywhere', () => {
    const { container } = render(<CurriculumCompletenessForTeachers />);
    expect(container.textContent).not.toMatch(/\d%/);
  });
});
