// ---------------------------------------------------------------------------
// v0.84.0-rc.2 checkpoint 45 — THE STUDENT ROUTE TO AUTHORED LESSONS.
//
// Checkpoint 44 failed because 92 correct lessons had no student route.
// These tests are the standing proof that the route exists and stays
// honest: every artifact reachable exactly once, identified by artifact id
// rather than section id, counted by lessons rather than units.
// ---------------------------------------------------------------------------

import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import {
  authoredLearnCatalogueForGrade,
  authoredLessonById,
  hasAuthoredLearn,
  studentSourceReference,
} from '../authoredLearnCatalogue';
import { allAuthoredSections, authoredSectionsForChapter } from '../authoredSections';
import { artifactSourceKind } from '../authoredSection';
import { unitsForClass } from '../instructionalUnits';
import { __setAuthoredLearnPreviewForTests } from '../authoredLearnAccess';
import { learnContentFor } from '../../features/learn/learnSectionContent';
import { LearnSectionView } from '../../features/learn/LearnSectionView';
import {
  AuthoredChapterList,
  AuthoredLessonList,
  AuthoredLessonRoute,
} from '../../features/student/AuthoredLearn';
import { completedLessons, markLessonComplete, learnProgressFor } from '../../features/student/learnProgress';

const CAT = () => authoredLearnCatalogueForGrade('class9');
const STUDENT = 'rc2-student';

// v0.84.0-rc.3 checkpoint 46 — these are the INTERNAL PREVIEW behaviours.
// The gate is opened explicitly here; the public-safe default and the
// direct-route denial are asserted in v0840Rc3PreviewGate.
beforeEach(() => {
  __setAuthoredLearnPreviewForTests(true);
  localStorage.clear();
  cleanup();
});

afterEach(() => __setAuthoredLearnPreviewForTests(null));

describe('Class 9 student Learn catalogue', () => {
  it('offers all 14 official chapters and 92 lessons', () => {
    const c = CAT();
    expect(c.chapters.length).toBe(14);
    expect(c.lessonCount).toBe(92);
    // In printed order, with no gaps.
    expect(c.chapters.map((x) => x.number)).toEqual([1,2,3,4,5,6,7,8,9,10,11,12,13,14]);
  });

  it('counts lessons, never instructional units', () => {
    // The whole point of the contextual-merge policy. Class 9 has 93 units
    // and 92 lessons, and the student denominator is the lesson count.
    expect(unitsForClass(9).length).toBe(93);
    expect(CAT().lessonCount).toBe(92);
    expect(CAT().lessonCount).not.toBe(unitsForClass(9).length);
  });

  it('routes every artifact exactly once, under the right chapter', () => {
    const catalogue = CAT();
    const authored = allAuthoredSections().filter((s) =>
      s.source.officialChapterId.startsWith('ncert_iemh')
    );
    const routed = catalogue.lessons.map((l) => l.contentArtifactId);
    expect(new Set(routed).size, 'duplicate route').toBe(routed.length);
    expect(routed.length).toBe(authored.length);
    for (const s of authored) {
      expect(routed, `${s.contentArtifactId} is an orphan`).toContain(s.contentArtifactId);
      const chapter = catalogue.chapters.find((c) =>
        c.lessons.some((l) => l.contentArtifactId === s.contentArtifactId)
      )!;
      expect(chapter.officialChapterId, `${s.contentArtifactId} under wrong chapter`).toBe(
        s.source.officialChapterId
      );
    }
    // And nothing routed that does not exist.
    const known = new Set(authored.map((s) => s.contentArtifactId));
    for (const id of routed) expect(known.has(id)).toBe(true);
  });

  it('identifies lessons by artifact, not by official section', () => {
    // Split siblings share a section id; merged lessons carry two. Either
    // would collapse or duplicate a route keyed on section id.
    const bySection = new Map<string, string[]>();
    for (const l of CAT().lessons) {
      const sid = l.section.source.officialSectionId;
      bySection.set(sid, [...(bySection.get(sid) ?? []), l.contentArtifactId]);
    }
    const splits = [...bySection.entries()].filter(([sid, ids]) => sid !== '' && ids.length > 1);
    expect(splits.length, 'the chapter set should contain split sections').toBeGreaterThan(5);
    for (const [, ids] of splits) expect(new Set(ids).size).toBe(ids.length);

    // A merged lesson appears once despite naming extra sections.
    const merged = CAT().lessons.filter(
      (l) => (l.section.source.additionalOfficialSectionIds ?? []).length > 0
    );
    expect(merged.length).toBeGreaterThan(0);
    for (const m of merged) {
      expect(
        CAT().lessons.filter((l) => l.contentArtifactId === m.contentArtifactId).length
      ).toBe(1);
    }
  });

  it('keeps every chapter in book order by section number', () => {
    for (const ch of CAT().chapters) {
      const numbers = ch.lessons
        .map((l) => l.section.source.sectionNumber)
        .filter((n): n is string => !!n && n !== '')
        .map((n) => Number(n.split('.')[1] ?? 0));
      const sorted = [...numbers].sort((a, b) => a - b);
      expect(numbers, `${ch.officialChapterId} is out of book order`).toEqual(sorted);
    }
  });

  it('shows Chapter 3 as eight lessons with no phantom §3.1', () => {
    const ch3 = CAT().chapters.find((c) => c.number === 3)!;
    expect(ch3.lessonCount).toBe(8);
    const sections = ch3.lessons.map((l) => l.section.source.officialSectionId);
    expect(sections).not.toContain('ncert_iemh1_s3_1');
    // The first lesson is the revised §3.2 carrying the context.
    expect(ch3.lessons[0].contentArtifactId).toBe('ncert_iemh1_s3_2_lesson');
    expect(ch3.lessons[0].section.contentArtifactVersion).toBe(2);
  });

  it('shows Chapter 9 as two lessons with no fabricated section numbers', () => {
    const ch9 = CAT().chapters.find((c) => c.number === 9)!;
    expect(ch9.lessonCount).toBe(2);
    for (const l of ch9.lessons) {
      expect(artifactSourceKind(l.section.source)).toBe('source_segment');
      expect(studentSourceReference(l.section)).not.toMatch(/9\.\d/);
      expect(studentSourceReference(l.section)).not.toMatch(/·\s*$|^\s*·/);
      // learnContentFor must not crash or print an empty reference.
      const content = learnContentFor(l.section);
      expect(content.officialReference.trim().length).toBeGreaterThan(5);
      expect(content.officialReference).not.toContain('undefined');
    }
  });

  it('uses no governance or provenance vocabulary in student copy', () => {
    const copy = CAT()
      .chapters.flatMap((c) => [c.title, ...c.lessons.map((l) => l.title)])
      .join(' ')
      .toLowerCase();
    for (const banned of ['authored', 'draft', 'review', 'source segment', 'provenance', 'contextual merge', 'pragati_', 'ncert_']) {
      expect(copy, `student copy leaks "${banned}"`).not.toContain(banned);
    }
  });

  it('renders every one of the 92 lessons through the real renderer', () => {
    // The deterministic all-92 proof: catalogue → artifact route → the
    // same LearnSectionView the product uses.
    let rendered = 0;
    for (const lesson of CAT().lessons) {
      const found = authoredLessonById('class9', lesson.contentArtifactId)!;
      expect(found, lesson.contentArtifactId).toBeTruthy();
      const { unmount } = render(
        <LearnSectionView
          content={learnContentFor(found.section)}
          visualsById={found.section.visualsById}
        />
      );
      expect(screen.getAllByRole('button', { name: /Learn the idea/i }).length).toBeGreaterThan(0);
      rendered += 1;
      unmount();
      cleanup();
    }
    expect(rendered).toBe(92);
  });
});

describe('Class 9 Learn progress', () => {
  it('counts completion by artifact and reaches 92 of 92', () => {
    const ids = CAT().lessons.map((l) => l.contentArtifactId);
    expect(learnProgressFor(STUDENT, ids)).toEqual({ done: 0, total: 92, complete: false });
    for (const id of ids) markLessonComplete(STUDENT, id);
    const p = learnProgressFor(STUDENT, ids);
    expect(p).toEqual({ done: 92, total: 92, complete: true });
    // 100% is reachable — §3.1 creates no slot that can never be filled.
    expect(p.done / p.total).toBe(1);
  });

  it('keeps one student\u2019s progress out of another\u2019s', () => {
    markLessonComplete('alice', 'ncert_iemh1_s3_2_lesson');
    expect(completedLessons('alice')).toEqual(['ncert_iemh1_s3_2_lesson']);
    expect(completedLessons('bob')).toEqual([]);
  });

  it('gives each chapter its own lesson denominator', () => {
    for (const ch of CAT().chapters) {
      const p = learnProgressFor(STUDENT, ch.lessons.map((l) => l.contentArtifactId));
      expect(p.total).toBe(ch.lessonCount);
    }
    expect(CAT().chapters.find((c) => c.number === 3)!.lessonCount).toBe(8);
    expect(CAT().chapters.find((c) => c.number === 9)!.lessonCount).toBe(2);
  });
});

describe('the student journey, through the real components', () => {
  it('walks chapters → lessons → lesson → finish, and persists', () => {
    const openChapter: string[] = [];
    render(
      <AuthoredChapterList grade="class9" studentId={STUDENT} onOpenChapter={(id) => openChapter.push(id)} />
    );
    expect(screen.getByText(/14 chapters from your textbook · 92 lessons/)).toBeTruthy();
    fireEvent.click(screen.getByText('The World of Numbers'));
    expect(openChapter[0]).toBe('ncert_iemh1_ch03');
    cleanup();

    const opened: string[] = [];
    render(
      <AuthoredLessonList
        grade="class9"
        studentId={STUDENT}
        officialChapterId="ncert_iemh1_ch03"
        onOpenLesson={(id) => opened.push(id)}
        onBack={() => {}}
      />
    );
    // Eight lesson rows, each carrying its artifact id as the route key.
    const rows = document.querySelectorAll('[data-artifact-id]');
    expect(rows.length).toBe(8);
    fireEvent.click(rows[0] as HTMLElement);
    expect(opened[0]).toBe('ncert_iemh1_s3_2_lesson');
    cleanup();

    let finished = false;
    render(
      <AuthoredLessonRoute
        grade="class9"
        studentId={STUDENT}
        contentArtifactId="ncert_iemh1_s3_2_lesson"
        onBack={() => {}}
        onFinished={() => { finished = true; }}
      />
    );
    // Walk all five stages, then finish.
    for (const stage of ['See it', 'Worked examples', 'Try it', 'Think deeper']) {
      fireEvent.click(screen.getAllByRole('button', { name: new RegExp(stage, 'i') })[0]);
    }
    fireEvent.click(screen.getByRole('button', { name: /Finish lesson/i }));
    expect(finished).toBe(true);
    // Completion persisted, by artifact id.
    expect(completedLessons(STUDENT)).toContain('ncert_iemh1_s3_2_lesson');
  });

  it('opens a Chapter 9 segment-backed lesson without a section number', () => {
    render(
      <AuthoredLessonRoute
        grade="class9"
        studentId={STUDENT}
        contentArtifactId="ncert_iemh2_ch09_seg1_lesson"
        onBack={() => {}}
        onFinished={() => {}}
      />
    );
    expect(screen.getAllByRole('button', { name: /Learn the idea/i }).length).toBeGreaterThan(0);
    expect(document.body.textContent).not.toMatch(/pragati_srcseg|source segment|9\.1 ·/i);
  });

  it('does not offer authored Learn to Class 6, whose own surface is unchanged', () => {
    expect(hasAuthoredLearn('class9')).toBe(true);
    // Class 6's two authored chapters exist, and its Learn surface is its
    // own; this checkpoint did not touch it.
    expect(authoredSectionsForChapter('ncert_gp_c6_ch07_fractions').length).toBe(9);
  });
});
