// v0.49 §10 — chapter-card interaction tests.
//
// v0.48 asserted only that the catalogue rendered. These tests select
// each card, verify the exact chapter ID that was requested, render the
// resulting detail view, and assert the outcome is either a real
// chapter experience or a truthful unavailable state — never an
// accidental generic "not found".
//
// Representative grades: 1, 6, 8, 10, 12.

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { StudentShell, chaptersForStudentGrade } from '../StudentShell';
import { resolveChapter } from '../../../curriculum/chapterResolver';
import type { Grade } from '../../../types';

const GRADES: Grade[] = ['class1', 'class6', 'class8', 'class10', 'class12'];

const noop = () => {};

function renderLearn(grade: Grade, openChapterId: string | null = null) {
  const onOpenChapter = vi.fn();
  const rendered = render(
    <StudentShell
      activeTab="learn"
      onSwitchTab={noop}
      openChapterId={openChapterId}
      onOpenChapter={onOpenChapter}
      studentGrade={grade}
      studentName="Ada"
      studentId="stu-ada"
      onLaunchLesson={noop}
      onLaunchConceptPractice={noop}
      onLaunchMixedChapterPractice={noop}
      onLaunchChapterCheck={noop}
    />
  );
  return { onOpenChapter, ...rendered };
}

describe.each(GRADES)('§10 chapter cards — %s', (grade) => {
  const rows = chaptersForStudentGrade(grade);

  it('renders at least one chapter card', () => {
    renderLearn(grade);
    // Every row's title must be on screen.
    expect(rows.length).toBeGreaterThan(0);
    for (const row of rows) {
      expect(screen.getAllByText(row.title).length).toBeGreaterThan(0);
    }
  });

  it('every card requests a chapter ID that actually resolves', () => {
    for (const row of rows) {
      const resolved = resolveChapter(row.chapterId);
      expect(resolved).not.toBeNull();
      expect(resolved!.chapterId).toBe(row.chapterId);
      // And it belongs to the grade whose catalogue it appeared in.
      expect(resolved!.grade).toBe(grade);
    }
  });

  it('selecting each AVAILABLE card passes that exact chapter ID', () => {
    // v0.55 §13 — unavailable chapters now live in a collapsed
    // "More chapters" list and are deliberately not clickable cards.
    const launchable = rows.filter((r) => r.canLaunch);
    const { onOpenChapter } = renderLearn(grade);
    const buttons = screen.getAllByRole('button');
    let matched = 0;
    for (const row of launchable) {
      const btn = buttons.find((b) =>
        (b.textContent ?? '').includes(row.title)
      );
      if (!btn) continue;
      onOpenChapter.mockClear();
      fireEvent.click(btn);
      expect(onOpenChapter).toHaveBeenCalledWith(row.chapterId);
      matched += 1;
    }
    expect(matched).toBe(launchable.length);
  });

  it('unavailable chapters are separated, listed, and say only "Coming soon"', () => {
    const unavailable = rows.filter((r) => !r.canLaunch);
    const { container } = renderLearn(grade);
    if (unavailable.length === 0) return;
    // Collapsed section, not equal-weight cards.
    const details = container.querySelector('details');
    expect(details).toBeTruthy();
    expect(details!.textContent).toMatch(/More chapters/);
    expect(details!.textContent).toMatch(/Coming soon/);
    // No governance vocabulary reaches the student.
    expect(details!.textContent ?? '').not.toMatch(
      /prototype|unverified|source|review|readiness|blueprint/i
    );
  });

  it('each chapter detail renders a valid experience OR a truthful unavailable state — never a generic not-found', () => {
    for (const row of rows) {
      const { unmount } = render(
        <StudentShell
          activeTab="learn"
          onSwitchTab={noop}
          openChapterId={row.chapterId}
          onOpenChapter={noop}
          studentGrade={grade}
          studentName="Ada"
          studentId="stu-ada"
          onLaunchLesson={noop}
          onLaunchConceptPractice={noop}
          onLaunchMixedChapterPractice={noop}
          onLaunchChapterCheck={noop}
        />
      );
      const text = document.body.textContent ?? '';

      // The accidental-failure signature: the resolver returned null
      // and we fell through to "this chapter link is not recognised".
      expect(text).not.toMatch(/link is not recognised/i);
      // Never a raw error or blank body.
      expect(text.trim().length).toBeGreaterThan(0);

      if (row.canLaunch) {
        // A launchable chapter shows the real chapter experience.
        //
        // v0.64 §5 — the ASSERTION's intent is unchanged (a launchable
        // chapter must render a real experience, never a not-found).
        // Only the accepted wording widened: official chapters now
        // render OfficialChapterLanding, which describes the book's
        // parts, while non-official chapters still render the legacy
        // module page. Both are valid experiences.
        // v0.64 §4 — a third valid outcome was added: `canLaunch`
        // reflects CONTENT inventory, but a displaced legacy module
        // (decimals / ratio / algebra) now renders a curriculum-based
        // refusal instead. Having items is no longer sufficient reason
        // to show a Class 6 child a chapter.
        expect(text).toMatch(
          // v0.70 §7/§19 — the chapter journey now states its progress
          // as "N parts · M open" and its empty state as "Not ready
          // yet". Both are truthful renderings of the official chapter;
          // what this test defends is that a generic not-found never
          // appears in place of one.
          // v0.71 §8 — availability is now stated in words rather than
          // as dots that resemble completion: "9 parts in this chapter.
          // 4 related practice activities are available now."
          /Learning journey|What you will learn|you can work on now|parts in this chapter|Not ready yet|nothing to work on in this chapter yet|not part of Class 6/i
        );
      } else {
        // An unlaunchable chapter must SAY it is not ready, and say why.
        expect(text).toMatch(
          /not ready|no content|not yet|not available|coming/i
        );
      }
      unmount();
    }
  });

  it('a chapter from another grade is refused rather than rendered', () => {
    const otherGrade: Grade = grade === 'class6' ? 'class8' : 'class6';
    const foreign = chaptersForStudentGrade(otherGrade)[0];
    if (!foreign) return;
    render(
      <StudentShell
        activeTab="learn"
        onSwitchTab={noop}
        openChapterId={foreign.chapterId}
        onOpenChapter={noop}
        studentGrade={grade}
        studentName="Ada"
        studentId="stu-ada"
        onLaunchLesson={noop}
        onLaunchConceptPractice={noop}
        onLaunchMixedChapterPractice={noop}
        onLaunchChapterCheck={noop}
      />
    );
    expect(screen.getByText(/not for your class/i)).toBeTruthy();
  });
});

describe('§10 unrecognised chapter IDs', () => {
  it('an unknown ID shows the truthful unrecognised page, not a crash', () => {
    render(
      <StudentShell
        activeTab="learn"
        onSwitchTab={noop}
        openChapterId="official:this_does_not_exist"
        onOpenChapter={noop}
        studentGrade="class6"
        studentName="Ada"
        studentId="stu-ada"
        onLaunchLesson={noop}
        onLaunchConceptPractice={noop}
        onLaunchMixedChapterPractice={noop}
        onLaunchChapterCheck={noop}
      />
    );
    expect(screen.getByText(/not recognised/i)).toBeTruthy();
  });
});

describe('§10 chapter check is only offered where a blueprint exists', () => {
  // v0.64 §7 — THIS TEST WAS INVERTED, AND THE BEHAVIOUR IT ASSERTED
  // WAS WRONG.
  //
  // It required official Class 6 Fractions to offer a chapter-wide
  // "chapter check". Pragati covers 4 of the chapter's 9 official
  // sections, so a check presented as covering the chapter would test a
  // student on less than half of it under a whole-chapter label. §7 is
  // explicit: a chapter-wide mixed practice set cannot automatically
  // mean practice for the complete official chapter.
  //
  // This is a deliberate REMOVAL of a student-facing action, not an
  // oversight. Reinstating it needs a product decision about honest
  // labelling (e.g. "practice across the parts we cover"), recorded in
  // V0.64_REPORT.md.
  it('official Class 6 Fractions does NOT offer a whole-chapter check', () => {
    const rows = chaptersForStudentGrade('class6');
    const fractions = rows.find((r) => /fractions/i.test(r.title));
    expect(fractions).toBeTruthy();
    render(
      <StudentShell
        activeTab="learn"
        onSwitchTab={noop}
        openChapterId={fractions!.chapterId}
        onOpenChapter={noop}
        studentGrade="class6"
        studentName="Ada"
        studentId="stu-ada"
        onLaunchLesson={noop}
        onLaunchConceptPractice={noop}
        onLaunchMixedChapterPractice={noop}
        onLaunchChapterCheck={noop}
      />
    );
    const text = document.body.textContent ?? '';
    expect(text).not.toMatch(/No hints/i);
    // It DOES show the official section structure instead.
    expect(text).toMatch(/parts/i);
  });

  // v0.64 §5 — same reason as above. Every Class 6 chapter is now
  // official, so none renders the legacy page that carried the
  // "Not ready for this chapter yet" copy. The guard is preserved in
  // its meaningful form: an official chapter never advertises an action
  // it cannot deliver.
  it('a launchable official chapter advertises no undeliverable action', () => {
    const other = chaptersForStudentGrade('class6').find(
      (c) => c.canLaunch && !/fraction/i.test(c.title)
    );
    if (!other) return; // nothing to assert on this content set
    render(
      <StudentShell
        activeTab="learn"
        onSwitchTab={noop}
        openChapterId={other.chapterId}
        onOpenChapter={noop}
        studentGrade="class6"
        studentName="Ada"
        studentId="stu-ada"
        onLaunchLesson={noop}
        onLaunchConceptPractice={noop}
        onLaunchMixedChapterPractice={noop}
        onLaunchChapterCheck={noop}
      />
    );
    const text = document.body.textContent ?? '';
    expect(text).not.toMatch(/No hints/i);
    expect(text).not.toMatch(/skills strong/i);
  });
});
