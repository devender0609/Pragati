// ---------------------------------------------------------------------------
// v0.84.0-rc.3 checkpoint 46 — THE PREVIEW GATE, BOTH WAYS.
//
// Checkpoint 45 described this boundary in a comment and in a function
// nothing called. A public build would have served 92 unreviewed lessons to
// any Class 9 student.
//
// These tests exist so that cannot recur, and they assert the OFF case as
// hard as the ON case — a gate only tested open is not a gate.
// ---------------------------------------------------------------------------

import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import {
  authoredLearnPreviewEnabled,
  mayDeliverAuthoredLesson,
  __setAuthoredLearnPreviewForTests,
  previewFlagValueEnables,
  AUTHORED_LEARN_PREVIEW_FLAG,
} from '../authoredLearnAccess';
import {
  authoredLearnCatalogueForGrade,
  authoredLessonById,
  hasAuthoredLearn,
} from '../authoredLearnCatalogue';
import { allAuthoredSections } from '../authoredSections';
import { AuthoredChapterList, AuthoredLessonList, AuthoredLessonRoute } from '../../features/student/AuthoredLearn';

const CLASS9 = () =>
  allAuthoredSections().filter((s) => s.source.officialChapterId.startsWith('ncert_iemh'));

afterEach(() => {
  __setAuthoredLearnPreviewForTests(null);
  cleanup();
});
beforeEach(() => localStorage.clear());

describe('preview mode OFF — the public-safe default', () => {
  beforeEach(() => __setAuthoredLearnPreviewForTests(false));

  it('is the default when the flag is absent', () => {
    // The real environment in this suite has no flag set.
    __setAuthoredLearnPreviewForTests(null);
    expect(authoredLearnPreviewEnabled()).toBe(false);
  });

  it('refuses to deliver any of the 92 unreviewed artifacts', () => {
    const artifacts = CLASS9();
    expect(artifacts.length).toBe(92);
    for (const s of artifacts) {
      expect(s.reviewStatus).toBe('authored_draft');
      expect(mayDeliverAuthoredLesson(s), s.contentArtifactId).toBe(false);
    }
  });

  it('empties the catalogue, so no chapter or lesson route exists', () => {
    const c = authoredLearnCatalogueForGrade('class9');
    expect(c.chapters.length).toBe(0);
    expect(c.lessonCount).toBe(0);
    expect(hasAuthoredLearn('class9')).toBe(false);
  });

  it('denies a direct artifact route — all 92 of them', () => {
    // Hiding buttons is not protection. A caller naming an artifact id
    // directly must get nothing back.
    for (const s of CLASS9()) {
      expect(authoredLessonById('class9', s.contentArtifactId), s.contentArtifactId).toBeNull();
    }
  });

  it('renders nothing when a lesson component is called directly', () => {
    const { container } = render(
      <AuthoredLessonRoute
        grade="class9"
        studentId="s1"
        contentArtifactId="ncert_iemh1_s3_2_lesson"
        onBack={() => {}}
        onFinished={() => {}}
      />
    );
    expect(container.textContent).toBe('');
    expect(container.querySelector('[data-lesson-route]')).toBeNull();
    cleanup();
    const list = render(
      <AuthoredLessonList
        grade="class9"
        studentId="s1"
        officialChapterId="ncert_iemh1_ch03"
        onOpenLesson={() => {}}
        onBack={() => {}}
      />
    );
    expect(list.container.textContent).toBe('');
  });

  it('shows no internal-preview notice', () => {
    render(<AuthoredChapterList grade="class9" studentId="s1" onOpenChapter={() => {}} />);
    expect(screen.queryByText(/Internal preview/i)).toBeNull();
  });
});

describe('preview mode ON — the internal RC build', () => {
  beforeEach(() => __setAuthoredLearnPreviewForTests(true));

  it('restores the full checkpoint-45 catalogue', () => {
    const c = authoredLearnCatalogueForGrade('class9');
    expect(c.chapters.length).toBe(14);
    expect(c.lessonCount).toBe(92);
    expect(c.chapters.find((x) => x.number === 3)!.lessonCount).toBe(8);
    expect(c.chapters.find((x) => x.number === 9)!.lessonCount).toBe(2);
    expect(hasAuthoredLearn('class9')).toBe(true);
  });

  it('routes every one of the 92 artifacts', () => {
    for (const s of CLASS9()) {
      expect(authoredLessonById('class9', s.contentArtifactId), s.contentArtifactId).toBeTruthy();
    }
  });

  it('tells a tester the content is unreviewed, once', () => {
    render(<AuthoredChapterList grade="class9" studentId="s1" onOpenChapter={() => {}} />);
    expect(screen.getByText(/Internal preview — unreviewed learning content/i)).toBeTruthy();
  });

  it('changes no lifecycle state to achieve any of this', () => {
    for (const s of CLASS9()) expect(s.reviewStatus).toBe('authored_draft');
  });
});

describe('the flag itself', () => {
  it('opens only for the exact string "true"', () => {
    // An empty value, a typo or a truthy-looking string must not open a
    // gate protecting unreviewed content.
    expect(AUTHORED_LEARN_PREVIEW_FLAG).toBe('VITE_ENABLE_AUTHORED_LEARN_PREVIEW');
    for (const value of [undefined, null, '', '0', 'false', 'TRUE', 'True', 'yes', '1', 1, true]) {
      expect(previewFlagValueEnables(value), String(value)).toBe(false);
    }
    expect(previewFlagValueEnables('true')).toBe(true);
  });
});
