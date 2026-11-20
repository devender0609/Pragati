// v0.78.1 §4/§17 — WHAT THE POPULATED STATE EXPOSED.
//
// Every Teacher screenshot in v0.78 was an empty state, and an empty
// table cannot show a bad column. With eight students and six sessions
// seeded, the roster printed "Latest band: Foundational" and "Latest
// est. 0.0 / 10" eight times down the page — a proficiency
// classification and a measurement on a 0-10 scale, from a product
// whose own footer says it produces no calibrated score.
//
// These tests keep both out of the normal Teacher product. The model
// keeps `computeBand` and `finalAbility`; Admin and Research may read
// them, because there the research framing is the point.

import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { TeacherStudentList } from '../TeacherStudentList';

const UNSUPPORTED = /latest band|latest est\.|foundational|proficien|mastery|ability/i;

describe('§4 the roster makes no ability or proficiency claim', () => {
  it('has no band or estimate column', () => {
    const { container } = render(
      <TeacherStudentList
        onOpenStudent={() => {}}
        onStart={() => {}}
        onOpenClassDashboard={() => {}}
      />
    );
    expect(container.textContent).not.toMatch(UNSUPPORTED);
  });

  it('offers counted facts instead, once there are students', () => {
    // With an empty roster the table is not rendered at all — the empty
    // state is. Seed one student so the columns exist to be checked.
    localStorage.setItem(
      'pragati.students.v1',
      JSON.stringify([
        {
          id: 'stu_t1',
          name: 'Test Student',
          grade: 'Class 6',
          gradeId: 'class6',
          curriculumId: 'cbse',
          createdAt: Date.now(),
        },
      ])
    );
    const { container } = render(
      <TeacherStudentList
        onOpenStudent={() => {}}
        onStart={() => {}}
        onOpenClassDashboard={() => {}}
      />
    );
    expect(container.textContent).toMatch(/Questions answered/i);
    expect(container.textContent).not.toMatch(UNSUPPORTED);
    localStorage.clear();
  });
});

import { TEACHER_STATUS_LABEL, DERIVED_STATUS_LABEL } from '../../../curriculum/inventory';

describe('§12 Teacher never reads build-pipeline vocabulary', () => {
  const BUILD_WORDS = /prototype|shell only|pilot-ready|assessment prototype/i;

  it('maps every status to something a teacher can act on', () => {
    for (const [state, label] of Object.entries(TEACHER_STATUS_LABEL)) {
      expect(label, state).not.toMatch(BUILD_WORDS);
      expect(
        ['Not available yet', 'Practice available', 'Lesson in review', 'Lesson available'],
        state
      ).toContain(label);
    }
  });

  it('leaves the build vocabulary intact for Admin', () => {
    // The pipeline wording is not wrong, it is addressed to someone
    // else. Admin and Research still need it.
    expect(DERIVED_STATUS_LABEL.prototype_ready_review).toMatch(/prototype/i);
    expect(DERIVED_STATUS_LABEL.shell).toMatch(/shell/i);
  });

  it('never says "Ready to learn" from a build state', () => {
    // The pre-v0.78 teacher map said "Ready to learn" for four separate
    // build states, which is the availability defect in another file.
    for (const label of Object.values(TEACHER_STATUS_LABEL)) {
      expect(label).not.toMatch(/ready to learn/i);
    }
  });
});

import { TeacherInsightsBody } from '../TeacherInsightsBody';

describe('§11 the Insights safeguard survives the arrival of data', () => {
  const SAFEGUARD = /no mastery or ability score/i;

  const seedActivity = () => {
    localStorage.setItem(
      'pragati.students.v1',
      JSON.stringify([
        { id: 's1', name: 'A', grade: 'Class 6', gradeId: 'class6', createdAt: 1 },
      ])
    );
    localStorage.setItem(
      'pragati.sessions.v1',
      JSON.stringify([
        {
          id: 'x1',
          studentId: 's1',
          studentSnapshot: { name: 'A', grade: 'Class 6' },
          window: 'baseline',
          skillId: 'FR.02',
          startedAt: 1,
          completedAt: 2,
          finalAbility: 0,
          responses: [
            {
              itemId: 'FR.02-01',
              chosenIndex: 1,
              correct: false,
              timeMs: 1000,
              difficultyAtAttempt: 1,
              abilityBefore: 0,
              abilityAfter: 0,
              misconceptionTriggered: 'visual_misread',
            },
          ],
        },
      ])
    );
  };

  it('shows it when there is no activity', () => {
    localStorage.clear();
    const { container } = render(<TeacherInsightsBody onOpenAssign={() => {}} />);
    expect(container.textContent).toMatch(SAFEGUARD);
  });

  it('still shows it once activity exists', () => {
    // It used to render only in the empty branch, so it disappeared
    // exactly when a teacher starts reading numbers and is most likely
    // to over-read them.
    localStorage.clear();
    seedActivity();
    const { container } = render(<TeacherInsightsBody onOpenAssign={() => {}} />);
    expect(container.textContent).toMatch(SAFEGUARD);
    localStorage.clear();
  });

  it('shows no raw misconception or skill codes with data present', () => {
    localStorage.clear();
    seedActivity();
    const { container } = render(<TeacherInsightsBody onOpenAssign={() => {}} />);
    expect(container.textContent).not.toMatch(/visual_misread|counts_shaded_only/);
    expect(container.textContent).not.toMatch(/weakest skills/i);
    localStorage.clear();
  });
});
