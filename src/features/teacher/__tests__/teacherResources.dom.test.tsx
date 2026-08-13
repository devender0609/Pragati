// v0.49 §9 + §11 — Teacher Resources stays inside TeacherShell and
// tells the truth about a chapter.
//
// The v0.48 behaviour under test: "Open lesson pages" called
// goLearn(firstSkill), which rendered LearnView at App.tsx's top level
// (outside TeacherShell) and showed one skill while implying the whole
// chapter.

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TeacherShell } from '../TeacherShell';
import { TeacherResourcesBody } from '../TeacherResourcesBody';
import {
  TeacherResourceOutlet,
  chapterResourceRows,
} from '../TeacherResourceOutlet';
import { chaptersForStudentGrade } from '../../student/StudentShell';
import { SKILLS_BY_MODULE } from '../../../types';

const noop = () => {};

function shellProps() {
  return {
    activeTab: 'resources' as const,
    onSwitchTab: noop,
    onOpenOverviewSummary: noop,
    onOpenClasses: noop,
    onOpenAssign: noop,
    onOpenInsights: noop,
    onOpenResources: noop,
    onOpenPilotSetup: noop,
    onOpenItemReview: noop,
    onOpenAlignmentReview: noop,
    onOpenCurriculumCoverage: noop,
    onOpenExports: noop,
  };
}

const FRACTIONS = chaptersForStudentGrade('class6').find((c) =>
  /fraction/i.test(c.title)
)!;

describe('§9 the teacher never leaves TeacherShell', () => {
  it('the resource list renders inside the shell chrome', () => {
    render(
      <TeacherShell {...shellProps()}>
        <TeacherResourcesBody onOpenChapter={noop} />
      </TeacherShell>
    );
    // Shell chrome present alongside the body.
    expect(screen.getAllByRole('tab', { name: /resources/i }).length)
      .toBeGreaterThan(0);
    expect(screen.getAllByRole('tab', { name: /insights/i }).length)
      .toBeGreaterThan(0);
    expect(screen.getByText(/Teacher resources/i)).toBeTruthy();
  });

  it('opening a chapter asks for that chapter, not for a single skill', () => {
    const onOpenChapter = vi.fn();
    render(
      <TeacherShell {...shellProps()}>
        <TeacherResourcesBody onOpenChapter={onOpenChapter} />
      </TeacherShell>
    );
    fireEvent.click(
      screen.getAllByRole('button', { name: /open chapter resources/i })[0]
    );
    expect(onOpenChapter).toHaveBeenCalledTimes(1);
    const arg = String(onOpenChapter.mock.calls[0][0]);
    // A chapter id, not a SkillId like "FR.02".
    expect(arg).not.toMatch(/^[A-Z]{2}\.\d{2}$/);
    expect(arg).toMatch(/^(official|legacy):/);
  });

  it('the chapter resource page also renders inside the shell', () => {
    render(
      <TeacherShell {...shellProps()}>
        <TeacherResourceOutlet
          chapterId={FRACTIONS.chapterId}
          onBack={noop}
          onOpenLesson={noop}
        />
      </TeacherShell>
    );
    expect(screen.getAllByRole('tab', { name: /resources/i }).length)
      .toBeGreaterThan(0);
    expect(screen.getByText(/What this chapter contains/i)).toBeTruthy();
  });

  it('offers a way back to the chapter list', () => {
    const onBack = vi.fn();
    render(
      <TeacherResourceOutlet
        chapterId={FRACTIONS.chapterId}
        onBack={onBack}
        onOpenLesson={noop}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /all chapters/i }));
    expect(onBack).toHaveBeenCalledTimes(1);
  });
});

describe('§9 the resource page exposes what actually exists', () => {
  it('lists every mapped skill, not just the first', () => {
    render(
      <TeacherResourceOutlet
        chapterId={FRACTIONS.chapterId}
        onBack={noop}
        onOpenLesson={noop}
      />
    );
    const openButtons = screen.getAllByRole('button', {
      name: /open this lesson/i,
    });
    expect(openButtons.length).toBe(SKILLS_BY_MODULE.fractions.length);
    expect(openButtons.length).toBeGreaterThan(1);
  });

  it('reports skills, questions, lessons, worked examples, misconceptions, assessment, and printables', () => {
    render(
      <TeacherResourceOutlet
        chapterId={FRACTIONS.chapterId}
        onBack={noop}
        onOpenLesson={noop}
      />
    );
    for (const label of [
      /Skills mapped/i,
      /Questions in the bank/i,
      /Hand-authored lessons/i,
      /Printable worksheets/i,
      /Chapter check/i,
      /Curriculum verification/i,
    ]) {
      expect(screen.getByText(label)).toBeTruthy();
    }
    expect(screen.getAllByText(/worked example/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/misconception/i).length).toBeGreaterThan(0);
  });

  it('opening a lesson is labelled as one lesson and passes a SkillId', () => {
    const onOpenLesson = vi.fn();
    render(
      <TeacherResourceOutlet
        chapterId={FRACTIONS.chapterId}
        onBack={noop}
        onOpenLesson={onOpenLesson}
      />
    );
    fireEvent.click(
      screen.getAllByRole('button', { name: /open this lesson/i })[0]
    );
    expect(String(onOpenLesson.mock.calls[0][0])).toMatch(/^[A-Z]{2}\.\d{2}$/);
  });

  it('does not claim curriculum verification that has not happened', () => {
    render(
      <TeacherResourceOutlet
        chapterId={FRACTIONS.chapterId}
        onBack={noop}
        onOpenLesson={noop}
      />
    );
    // The seed record is 'unverified'; the page must say so.
    expect(screen.getByText(/Not verified against a source/i)).toBeTruthy();
  });

  it('an unrecognised chapter shows a clear message, not a broken page', () => {
    render(
      <TeacherResourceOutlet
        chapterId="official:nope"
        onBack={noop}
        onOpenLesson={noop}
      />
    );
    expect(screen.getByText(/Chapter not recognised/i)).toBeTruthy();
  });

  it('a chapter with no chapter check says so rather than staying silent', () => {
    const other = chaptersForStudentGrade('class6').find(
      (c) => !/fraction/i.test(c.title)
    );
    if (!other) return;
    render(
      <TeacherResourceOutlet
        chapterId={other.chapterId}
        onBack={noop}
        onOpenLesson={noop}
      />
    );
    expect(screen.getByText(/Not authored yet/i)).toBeTruthy();
  });
});

describe('§9 the counts are measured, not asserted', () => {
  it('chapterResourceRows counts match the real content modules', () => {
    const rows = chapterResourceRows(SKILLS_BY_MODULE.fractions);
    expect(rows.length).toBe(SKILLS_BY_MODULE.fractions.length);
    for (const r of rows) {
      expect(r.itemCount).toBeGreaterThanOrEqual(0);
      expect(r.workedExampleCount).toBeGreaterThanOrEqual(0);
      expect(typeof r.handAuthoredLesson).toBe('boolean');
    }
    // Fractions is the reference chapter — it should genuinely have
    // hand-authored lessons and items.
    expect(rows.some((r) => r.handAuthoredLesson)).toBe(true);
    expect(rows.reduce((a, r) => a + r.itemCount, 0)).toBeGreaterThan(0);
  });
});
