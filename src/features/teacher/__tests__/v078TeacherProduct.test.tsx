// v0.78 §16/§17/§18 — TEACHER LANGUAGE AND CURRICULUM TRUTH.
//
// The Teacher product inherited vocabulary from the research prototype
// it grew out of. Some of it is fine, some belongs in Admin, and some
// makes measurement claims Pragati cannot support. These tests pin the
// third category out of normal Teacher.

import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { TEACHER_PRIMARY_DESCRIPTION } from '../../../design/navigation';
import { TeacherStudentList } from '../TeacherStudentList';
import { TeacherResourcesBody } from '../TeacherResourcesBody';
import { officialCurriculumForGrade } from '../../../curriculum/officialCurriculum';

const UNSUPPORTED =
  /class-level growth|weak concepts?|mastery|proficienc|ability scale|calibrated score|readiness score/i;

describe('§17 navigation copy describes what the screens do', () => {
  it('makes no growth, mastery or diagnosis claim', () => {
    for (const [dest, text] of Object.entries(TEACHER_PRIMARY_DESCRIPTION)) {
      expect(text, dest).not.toMatch(UNSUPPORTED);
    }
  });

  it('describes Insights by its observable evidence', () => {
    // It used to read "Class-level growth, weak concepts, and
    // misconceptions" — three claims, none of which Pragati computes.
    expect(TEACHER_PRIMARY_DESCRIPTION.insights).toMatch(/activity|worked on/i);
  });
});

describe('§16 normal Teacher screens carry no unsupported claims', () => {
  it('the roster does not promise growth history', () => {
    const { container } = render(
      <TeacherStudentList
        onOpenStudent={() => {}}
        onStart={() => {}}
        onOpenClassDashboard={() => {}}
      />
    );
    expect(container.textContent).not.toMatch(UNSUPPORTED);
  });
});

describe('§21 Resources respects the reconciled verification depth', () => {
  it('shows Class 6 at textbook depth', () => {
    const { container } = render(<TeacherResourcesBody onOpenChapter={() => {}} />);
    const c = officialCurriculumForGrade('class6')!;
    expect(c.topLevel).toBe('chapter');
    expect(container.textContent).toMatch(/chapters/i);
    expect(container.textContent).toMatch(/sections/i);
  });

  it('never invents a textbook chapter count for a syllabus-only class', () => {
    // Class 10's syllabus prints no chapter-name column. Its topic
    // titles resemble NCERT chapter names, and resembling is not
    // evidence — so no unit may carry chapter records.
    const c = officialCurriculumForGrade('class10')!;
    expect(c.topLevel).toBe('unit');
    for (const u of c.units) {
      expect(u.chaptersEstablished, u.title).toBe(false);
      expect(u.chapters.length, u.title).toBe(0);
    }
  });
});
