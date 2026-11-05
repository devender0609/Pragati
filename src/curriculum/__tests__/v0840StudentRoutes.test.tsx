// ===========================================================================
// v0.84.0 checkpoint 35 — THE WALKTHROUGH CHECKPOINT 34 DID NOT RUN.
//
// Checkpoint 34 authored 38 Class 9 lessons and said plainly that no student
// journey had been driven. This is that gate, closed: every authored lesson
// is rendered through the real `LearnSectionView` — the same component the
// product uses — and every one of the five stages is clicked and inspected.
//
// It is not a registry check. A lesson whose id exists but whose Try it tab
// renders nothing fails here.
// ===========================================================================

import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { LearnSectionView } from '../../features/learn/LearnSectionView';
import { learnContentFor, STUDENT_LESSON_STAGES } from '../../features/learn/learnSectionContent';
import { AUTHORED_CHAPTERS, authoredSectionsForChapter, allAuthoredSections } from '../authoredSections';
import type { AuthoredSection } from '../authoredSection';

const CLASS_9_CHAPTERS = [
  'ncert_iemh1_ch01',
  'ncert_iemh2_ch10',
  'ncert_iemh2_ch14',
  'ncert_iemh1_ch02',
  'ncert_iemh1_ch04',
  'ncert_iemh1_ch05',
  'ncert_iemh2_ch12',
  'ncert_iemh2_ch13',
].filter((id) => authoredSectionsForChapter(id).length > 0);

const class9Lessons = (): AuthoredSection[] =>
  CLASS_9_CHAPTERS.flatMap((id) => authoredSectionsForChapter(id));

/** Open a lesson and walk it stage by stage, returning each stage's text. */
function walkLesson(section: AuthoredSection): Record<string, string> {
  const { container, unmount } = render(
    <LearnSectionView content={learnContentFor(section)} visualsById={section.visualsById} />
  );
  const seen: Record<string, string> = {};
  for (const label of STUDENT_LESSON_STAGES) {
    // The stage bar renders twice — once in the reading column and once in
    // the contextual column at desktop width. Both drive the same state;
    // the first is the one a narrow viewport shows.
    const tab = screen.getAllByRole('button', { name: new RegExp(label, 'i') })[0];
    fireEvent.click(tab);
    seen[label] = container.textContent ?? '';
  }
  unmount();
  return seen;
}

describe('§B every authored Class 9 lesson survives the real student journey', () => {
  it('renders all five stages with content for every lesson', () => {
    expect(class9Lessons().length).toBeGreaterThan(37);
    for (const s of class9Lessons()) {
      const seen = walkLesson(s);
      const where = s.contentArtifactId;
      // Learn the idea must carry the goal and the explanation.
      expect(seen['Learn the idea'], where).toContain(s.learningGoal.slice(0, 40));
      expect(seen['Learn the idea'], where).toContain(s.explanation[0].slice(0, 40));
      // Worked examples must carry a prompt and a reasoning string.
      expect(seen['Worked examples'], where).toContain(s.workedExamples[0].prompt.slice(0, 40));
      expect(seen['Worked examples'], where).toContain(
        s.workedExamples[0].steps[0].reasoning.slice(0, 40)
      );
      // Try it must carry a guided prompt.
      expect(seen['Try it'], where).toContain(s.guidedPractice[0].prompt.slice(0, 40));
      // Think deeper must carry the reasoning task, not a repeat of an example.
      expect(seen['Think deeper'], where).toContain(
        s.reasoningApplication[0].prompt.slice(0, 40)
      );
      cleanup();
    }
  });

  it('shows a rendered figure wherever the lesson declares one', () => {
    for (const s of class9Lessons()) {
      if (s.visuals.length === 0) continue;
      const { container, unmount } = render(
        <LearnSectionView content={learnContentFor(s)} visualsById={s.visualsById} />
      );
      fireEvent.click(screen.getAllByRole('button', { name: /See it/i })[0]);
      const all = Array.from(container.querySelectorAll('svg'));
      const figures = all.filter((n) => n.getAttribute('role') === 'img');
      expect(figures.length, `${s.contentArtifactId} declares a visual but renders none`).toBeGreaterThan(0);
      // Every figure must carry a description that states the mathematics.
      for (const svg of figures) {
        const label = svg.getAttribute('aria-label') ?? '';
        expect(label.length, `${s.contentArtifactId} figure has no accessible name`).toBeGreaterThan(40);
      }
      // And every other drawing on the page must be hidden from assistive
      // technology, or a screen reader announces an unnamed graphic.
      for (const svg of all.filter((n) => n.getAttribute('role') !== 'img')) {
        expect(
          svg.getAttribute('aria-hidden'),
          `${s.contentArtifactId}: a decorative icon is exposed unnamed`
        ).toBe('true');
      }
      unmount();
      cleanup();
    }
  });

  it('renders a data display and its table wherever a lesson declares one', () => {
    // v0.84.0 checkpoint 37 — a chart that does not reach the page is not a
    // display, and a chart without its table is not accessible.
    let seen = 0;
    for (const s of class9Lessons()) {
      if ((s.dataDisplays ?? []).length === 0) continue;
      seen += 1;
      const { container, unmount } = render(
        <LearnSectionView content={learnContentFor(s)} visualsById={s.visualsById} />
      );
      fireEvent.click(screen.getAllByRole('button', { name: /See it/i })[0]);
      const charts = Array.from(container.querySelectorAll('svg')).filter(
        (n) => n.getAttribute('role') === 'img'
      );
      expect(charts.length, `${s.contentArtifactId} declares displays but renders none`).toBe(
        (s.dataDisplays ?? []).length
      );
      // Each display is accompanied by a real table carrying its figures.
      const tables = container.querySelectorAll('table');
      expect(tables.length, `${s.contentArtifactId} has no data table`).toBe(
        (s.dataDisplays ?? []).length
      );
      // Bars are drawn, and their count matches categories times series.
      const data = Object.values(s.dataSets ?? {})[0]!;
      const expectedBars = data.categories.length * data.series.length * (s.dataDisplays ?? []).length;
      expect(container.querySelectorAll('rect').length).toBe(expectedBars);
      unmount();
      cleanup();
    }
    expect(seen, 'the data chapter should contribute lessons with displays').toBeGreaterThan(1);
  });

  it('leaks no internal id or reviewer language into any stage', () => {
    for (const s of class9Lessons()) {
      const seen = walkLesson(s);
      for (const [stage, text] of Object.entries(seen)) {
        const where = `${s.contentArtifactId} / ${stage}`;
        expect(text, where).not.toMatch(/ncert_iemh|pragati_iu_|pragati_srcseg/);
        expect(text, where).not.toMatch(/authored_draft|READY_FOR_AUTHORING|reviewer preview/i);
        expect(text, where).not.toMatch(/checkpoint|decompositionStatus|contentArtifactId/i);
      }
      cleanup();
    }
  });

  it('reaches hints and rationales rather than hiding them behind nothing', () => {
    for (const s of class9Lessons()) {
      const { container, unmount } = render(
        <LearnSectionView content={learnContentFor(s)} visualsById={s.visualsById} />
      );
      fireEvent.click(screen.getAllByRole('button', { name: /Try it/i })[0]);
      const text = container.textContent ?? '';
      // The hint for the first guided item must be reachable from this stage,
      // either shown or behind a control the student can press.
      const hint = s.guidedPractice[0].hint.slice(0, 30);
      if (!text.includes(hint)) {
        const reveal = container.querySelectorAll('button');
        for (const b of Array.from(reveal)) fireEvent.click(b);
        expect(container.textContent ?? '', `${s.contentArtifactId} hint unreachable`).toContain(hint);
      }
      unmount();
      cleanup();
    }
  });

  it('keeps every lesson in exactly one chapter, in the book order', () => {
    const seen = new Set<string>();
    for (const chapter of AUTHORED_CHAPTERS) {
      const sections = chapter.sections();
      for (const s of sections) {
        expect(seen.has(s.contentArtifactId), `${s.contentArtifactId} appears twice`).toBe(false);
        seen.add(s.contentArtifactId);
        expect(s.source.officialChapterId, s.contentArtifactId).toBe(chapter.officialChapterId);
      }
      // Lessons are listed in non-decreasing source page order. A `cbse_only`
      // lesson has no textbook page to be ordered by — FO-3 is prescribed by
      // CBSE and has no section in the current book — so it is placed by
      // instructional sequence instead and excluded from this check rather
      // than given a page it does not have.
      const pages = sections
        .filter((s) => s.source.sourceKind !== 'cbse_only')
        .map((s) => s.source.startPage);
      expect([...pages].sort((a, b) => a - b), chapter.officialChapterId).toEqual(pages);
    }
    expect(seen.size).toBe(allAuthoredSections().length);
  });

  it('exposes the stage bar as real controls a keyboard can reach', () => {
    const s = class9Lessons()[0];
    render(<LearnSectionView content={learnContentFor(s)} visualsById={s.visualsById} />);
    for (const label of STUDENT_LESSON_STAGES) {
      const tabs = screen.getAllByRole('button', { name: new RegExp(label, 'i') });
      const tab = tabs[0];
      // A button is focusable and operable by keyboard by default; a div
      // styled as a tab is not, which is the failure this guards.
      expect(tab.tagName.toLowerCase(), label).toBe('button');
      expect(tab.getAttribute('disabled'), label).toBeNull();
    }
    cleanup();
  });
});
