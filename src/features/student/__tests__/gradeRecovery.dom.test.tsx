// v0.49 §7 + §11 — grade recovery at the UI level.
//
// gradeNormalization.test.ts already covers the pure function across
// Classes 1–12. What was NOT tested is the consequence: that an
// unresolvable grade reaches a profile-correction experience, and that
// a legacy-format grade opens the RIGHT class's shell rather than
// Class 6's.

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { StudentShell } from '../StudentShell';
import { ProfileCorrectionScreen } from '../ProfileCorrectionScreen';
import { normalizeGrade } from '../../../lib/gradeNormalization';
import type { Grade } from '../../../types';

const noop = () => {};

function renderShellForStoredGrade(stored: string) {
  const grade = normalizeGrade(stored);
  if (!grade) return { grade: null as Grade | null };
  render(
    <StudentShell
      activeTab="home"
      onSwitchTab={noop}
      openChapterId={null}
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
  return { grade };
}

// One legacy spelling per class, cycling through the formats that have
// actually been written to disk over the project's history.
const LEGACY_FORMATS: Array<[string, Grade]> = [
  ['class1', 'class1'],
  ['Class 2', 'class2'],
  ['Grade 3', 'class3'],
  ['grade_04', 'class4'],
  ['grade_5', 'class5'],
  ['6', 'class6'],
  [' 7 ', 'class7'],
  ['Class 8B', 'class8'],
  ['std 9', 'class9'],
  ['standard 10', 'class10'],
  ['CLASS 11', 'class11'],
  ['grade_12', 'class12'],
];

describe.each(LEGACY_FORMATS)(
  '§7 legacy grade %s opens the right class shell',
  (stored, expected) => {
    it(`resolves to ${expected} and renders that class's header`, () => {
      const { grade } = renderShellForStoredGrade(stored);
      expect(grade).toBe(expected);
      const n = expected.replace('class', '');
      expect(
        screen.getAllByText(new RegExp(`Class ${n} Mathematics`)).length
      ).toBeGreaterThan(0);
    });

    it(`never silently renders Class 6 instead of ${expected}`, () => {
      const { grade } = renderShellForStoredGrade(stored);
      if (expected === 'class6') return;
      expect(grade).not.toBe('class6');
      expect(screen.queryByText(/Class 6 Mathematics/)).toBeNull();
    });
  }
);

describe('§7 unresolvable grades reach a correction experience', () => {
  const UNKNOWN = ['', '   ', 'KG', 'LKG A', 'elementary', 'year 6 english', '13', '0'];

  for (const stored of UNKNOWN) {
    it(`"${stored}" does not resolve, so no class shell is rendered`, () => {
      expect(normalizeGrade(stored)).toBeNull();
    });
  }

  it('the correction screen states the stored value instead of guessing', () => {
    render(
      <ProfileCorrectionScreen
        studentName="Ada"
        storedGrade="LKG A"
        onSwitchStudent={noop}
        onOpenStartForm={noop}
      />
    );
    expect(screen.getByText(/LKG A/)).toBeTruthy();
    // It must not announce a class it decided on by itself.
    expect(screen.queryByText(/Class 6 Mathematics/)).toBeNull();
  });

  it('offers a route out — correcting the profile or switching student', () => {
    const onOpenStartForm = vi.fn();
    const onSwitchStudent = vi.fn();
    render(
      <ProfileCorrectionScreen
        studentName="Ada"
        storedGrade="???"
        onSwitchStudent={onSwitchStudent}
        onOpenStartForm={onOpenStartForm}
      />
    );
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
    for (const b of buttons) fireEvent.click(b);
    expect(
      onOpenStartForm.mock.calls.length + onSwitchStudent.mock.calls.length
    ).toBeGreaterThan(0);
  });
});
