// v0.64 §3/§4/§18 — what a Class 6 student is allowed to see.

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { OfficialChapterLanding } from '../../features/student/OfficialChapterLanding';
import { Class6ChapterList } from '../../features/student/Class6Learn';
import { StudentShell } from '../../features/student/StudentShell';
import { chaptersForStudentGrade } from '../../features/student/StudentShell';

const noop = () => {};

/** Internal content identifiers. None may appear as student copy. */
const SKILL_CODE = /\b(FR|GB|DE|RP|AL|FM|LA|NP)\.\d{2}\b/;

function bodyText(): string {
  return document.body.textContent ?? '';
}

describe('§4 no internal skill codes on Class 6 student screens', () => {
  it('official chapter landing shows section titles, not codes', () => {
    render(
      <OfficialChapterLanding
        officialChapterId="ncert_gp_c6_ch07_fractions"
        studentId="stu"
        onBack={noop}
        onOpenSection={noop}
      />
    );
    expect(bodyText()).not.toMatch(SKILL_CODE);
    // And it DOES show the book's own wording.
    expect(
      screen.getByText(/Marking Fraction Lengths on the Number Line/)
    ).toBeTruthy();
  });

  it('chapter list shows no codes', () => {
    render(<Class6ChapterList onOpenChapter={noop} />);
    expect(bodyText()).not.toMatch(SKILL_CODE);
  });

  it('every Class 6 chapter interior is free of skill codes', () => {
    for (const row of chaptersForStudentGrade('class6')) {
      const { unmount } = render(
        <StudentShell
          activeTab="learn"
          onSwitchTab={noop}
          openChapterId={row.chapterId}
          onOpenChapter={noop}
          studentGrade="class6"
          studentName="Ada"
          studentId="stu"
          onLaunchLesson={noop}
          onLaunchConceptPractice={noop}
          onLaunchMixedChapterPractice={noop}
          onLaunchChapterCheck={noop}
        />
      );
      const text = bodyText();
      expect(text, `${row.title} exposes a skill code`).not.toMatch(SKILL_CODE);
      unmount();
    }
  });
});

describe('§3 no pseudo-mastery language in the official pilot', () => {
  const BANNED = [
    /skills strong/i,
    /\bmastered\b/i,
    /\bproficient\b/i,
    /\bmastery\b/i,
  ];

  it('official chapter landing makes no mastery claim', () => {
    render(
      <OfficialChapterLanding
        officialChapterId="ncert_gp_c6_ch07_fractions"
        studentId="stu"
        onBack={noop}
        onOpenSection={noop}
      />
    );
    for (const re of BANNED) expect(bodyText()).not.toMatch(re);
  });

  it('every Class 6 chapter interior avoids mastery wording', () => {
    for (const row of chaptersForStudentGrade('class6')) {
      const { unmount } = render(
        <StudentShell
          activeTab="learn"
          onSwitchTab={noop}
          openChapterId={row.chapterId}
          onOpenChapter={noop}
          studentGrade="class6"
          studentName="Ada"
          studentId="stu"
          onLaunchLesson={noop}
          onLaunchConceptPractice={noop}
          onLaunchMixedChapterPractice={noop}
          onLaunchChapterCheck={noop}
        />
      );
      const text = bodyText();
      for (const re of BANNED) {
        expect(text, `${row.title} uses ${re}`).not.toMatch(re);
      }
      unmount();
    }
  });

  it('uses factual activity states instead', () => {
    render(
      <OfficialChapterLanding
        officialChapterId="ncert_gp_c6_ch07_fractions"
        studentId="stu"
        onBack={noop}
        onOpenSection={noop}
      />
    );
    // "9 parts · 4 you can work on now" — counts of real things.
    expect(bodyText()).toMatch(/parts/i);
  });
});

describe('§5/§18 official chapters use the official interior', () => {
  it('renders official section titles, not module skill rows', () => {
    const rows = chaptersForStudentGrade('class6');
    const fractions = rows.find((r) => /fractions/i.test(r.title))!;
    render(
      <StudentShell
        activeTab="learn"
        onSwitchTab={noop}
        openChapterId={fractions.chapterId}
        onOpenChapter={noop}
        studentGrade="class6"
        studentName="Ada"
        studentId="stu"
        onLaunchLesson={noop}
        onLaunchConceptPractice={noop}
        onLaunchMixedChapterPractice={noop}
        onLaunchChapterCheck={noop}
      />
    );
    const text = bodyText();
    // Official section wording from the book.
    expect(text).toMatch(/Measuring Using Fractional Units/);
    expect(text).toMatch(/A Pinch of History/);
    // Legacy landing signature must be gone.
    expect(text).not.toMatch(/skills strong/i);
  });

  it('renders honestly for an official chapter with no content', () => {
    // Chapter 1 Patterns has nothing. The component must still render
    // the official structure rather than a not-found.
    render(
      <OfficialChapterLanding
        officialChapterId="ncert_gp_c6_ch01_patterns"
        studentId="stu"
        onBack={noop}
        onOpenSection={noop}
      />
    );
    const text = bodyText();
    // v0.69 §37 — the empty state was a grey dashed box reading "There
    // is nothing to work on in this chapter yet". It now carries the
    // chapter's own motif and says the same thing in fewer words. What
    // must not change is that it is HONEST and that the official
    // structure is still listed.
    expect(text).toMatch(/Not ready yet/i);
    expect(text).toMatch(/still being written/i);
    expect(text).toMatch(/Patterns in Numbers/);
    expect(text).not.toMatch(/not recognised/i);
  });

  it('keeps the student inside the shell when a chapter opens', () => {
    const rows = chaptersForStudentGrade('class6');
    const fractions = rows.find((r) => /fractions/i.test(r.title))!;
    render(
      <StudentShell
        activeTab="learn"
        onSwitchTab={noop}
        openChapterId={fractions.chapterId}
        onOpenChapter={noop}
        studentGrade="class6"
        studentName="Ada"
        studentId="stu"
        onLaunchLesson={noop}
        onLaunchConceptPractice={noop}
        onLaunchMixedChapterPractice={noop}
        onLaunchChapterCheck={noop}
      />
    );
    // v0.64 §12 — the four tabs remain reachable.
    for (const tab of ['Home', 'Learn', 'Practice', 'Progress']) {
      expect(screen.getAllByRole('tab', { name: tab }).length).toBeGreaterThan(0);
    }
  });
});
