// v0.71 §12/§13/§14 — the lesson restaging, the worked-example
// hierarchy, and the pedagogy audit.

import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LearnSectionView } from '../../features/learn/LearnSectionView';
import { authoredSectionById } from '../fractionsChapter';
import { misconceptionsForSection } from '../fractionsMisconceptions';
import {
  PEDAGOGY_FINDINGS,
  pedagogyAuditSummary,
  findingsForSection,
} from '../pedagogyAudit';
import { computeContentFingerprint } from '../contentArtifact';
import { fractionsChapterSections } from '../fractionsChapter';

/**
 * Render a real authored section through the real renderer.
 *
 * §7.6 rather than §7.4: it has the most explanation paragraphs in the
 * chapter and three worked examples, so it exercises the staging
 * without depending on the frozen artifact.
 */
function renderLesson() {
  const section = authoredSectionById('ncert_gp_c6_s7_6')!;
  const content = {
    officialReference: `${section.source.sectionNumber} · ${section.source.exactTitle}`,
    learningGoal: section.learningGoal,
    prerequisiteCheck: section.priorKnowledgeCheck,
    explanation: section.explanation,
    visuals: section.visuals,
    workedExamples: section.workedExamples,
    misconceptions: misconceptionsForSection(
      section.source.officialSectionId
    ).map((m) => ({ id: m.id, misconception: m.description, studentFeedback: m.feedback })),
    guidedPractice: section.guidedPractice,
    independentPractice: section.independentPractice,
    reasoningApplication: section.reasoningApplication,
    summary: section.summary,
    nextStep: section.teacher.quickChecks[0] ?? section.summary,
  };
  const visualsById = Object.fromEntries(
    section.visuals.map((v, i) => [`V${i}`, v])
  );
  return {
    content,
    ...render(<LearnSectionView content={content} visualsById={visualsById} />),
  };
}

describe('§12 the lesson is staged, not one long document', () => {
  it('offers five stages and opens on the first', () => {
    renderLesson();
    for (const label of [
      'Learn the idea',
      'See it',
      'Worked examples',
      'Try it',
      'Think deeper',
    ]) {
      expect(screen.getAllByText(label).length, label).toBeGreaterThan(0);
    }
  });

  it('does not render every part of the lesson at once', () => {
    // The v0.70 capture of this exact lesson was 8,703px tall at 390px.
    const { container, content } = renderLesson();
    const text = container.textContent ?? '';
    // The idea is on screen...
    expect(text).toContain(content.explanation[0].slice(0, 30));
    // ...and the summary, four stages away, is not.
    expect(text).not.toContain(content.summary.slice(0, 30));
  });

  it('reaches every stage without hiding anything permanently', () => {
    const { container, content } = renderLesson();
    fireEvent.click(screen.getAllByText('Think deeper')[0]);
    expect(container.textContent).toContain(content.summary.slice(0, 30));
    // And back again — stages are navigation, not a one-way wizard.
    fireEvent.click(screen.getAllByText('Learn the idea')[0]);
    expect(container.textContent).toContain(content.explanation[0].slice(0, 30));
  });

  it('needs one control per stage, not one per block', () => {
    // §12 — "Do NOT require 25 taps." Four advances cross the lesson.
    const { container, content } = renderLesson();
    let taps = 0;
    while (taps < 10) {
      const next = [...container.querySelectorAll('button')].find((b) =>
        /^(See it|Worked examples|Try it|Think deeper)/.test(b.textContent ?? '')
      );
      if (!next) break;
      fireEvent.click(next);
      taps += 1;
      if ((container.textContent ?? '').includes(content.summary.slice(0, 30))) break;
    }
    expect(taps).toBeLessThanOrEqual(4);
    expect(container.textContent).toContain(content.summary.slice(0, 30));
  });

  it('puts common mistakes beside the idea, not after the examples', () => {
    // §14 — they used to sit after five worked examples and before
    // practice: too late to shape reading, too early to answer a
    // mistake actually made.
    const { container } = renderLesson();
    expect(container.textContent).toContain('Watch out for');
  });
});

describe('§13 worked examples show mathematical structure', () => {
  it('separates the move from its justification', () => {
    const { container } = renderLesson();
    fireEvent.click(screen.getAllByText('Worked examples')[0]);
    const text = container.textContent ?? '';
    expect(text).toContain('Worked example 1');
    // Each step's reasoning is explicitly labelled as the justification
    // rather than being a second paragraph of the same weight.
    expect(text).toMatch(/Why/);
  });

  it('keeps progressive disclosure', () => {
    const { container } = renderLesson();
    fireEvent.click(screen.getAllByText('Worked examples')[0]);
    // Reading a finished solution is not following one, so the answer
    // is not on screen until the steps have been walked.
    expect(container.textContent).toContain('Next step');
  });

  it('reveals the answer only at the end', () => {
    const { container } = renderLesson();
    fireEvent.click(screen.getAllByText('Worked examples')[0]);
    const before = (container.textContent ?? '').includes('Answer');
    for (let i = 0; i < 8; i++) {
      const b = [...container.querySelectorAll('button')].find((x) =>
        (x.textContent ?? '').startsWith('Next step')
      );
      if (!b) break;
      fireEvent.click(b);
    }
    expect(container.textContent).toContain('Answer');
    expect(before).toBe(false);
  });
});

describe('§14 the pedagogy audit exists and is honest about itself', () => {
  it('records a finding, a disposition and an action for each entry', () => {
    expect(PEDAGOGY_FINDINGS.length).toBeGreaterThanOrEqual(8);
    for (const f of PEDAGOGY_FINDINGS) {
      expect(f.finding.length, f.sectionNumber).toBeGreaterThan(60);
      expect(f.action.length, f.sectionNumber).toBeGreaterThan(30);
    }
  });

  it('covers all five things §14 asks about', () => {
    const kinds = new Set(PEDAGOGY_FINDINGS.map((f) => f.kind));
    for (const k of [
      'prose_could_be_visual',
      'no_check_after_concept',
      'example_does_two_jobs',
      'practice_arrives_late',
      'feedback_too_generic',
    ] as const) {
      expect(kinds.has(k), k).toBe(true);
    }
  });

  it('did not add content to fix pedagogy', () => {
    // §14 — "do not add volume". Every addressed finding was fixed by
    // moving or restaging what already existed.
    const s = pedagogyAuditSummary();
    expect(s.addressed).toBeGreaterThan(0);
    for (const f of PEDAGOGY_FINDINGS) {
      if (f.disposition !== 'addressed_by_presentation') continue;
      expect(f.action).not.toMatch(/added a new|wrote a new|authored/i);
    }
  });

  it('states that it is not educator review', () => {
    expect(pedagogyAuditSummary().disclaimer).toMatch(/not educator review/i);
  });

  it('leaves §7.4 alone, because it is the frozen review anchor', () => {
    const f = findingsForSection('7.4').find((x) => x.sectionNumber === '7.4')!;
    expect(f.disposition).toBe('considered_and_kept');
    expect(computeContentFingerprint()).toBe('a1a3ff57');
  });
});

describe('§21 the restaging changed no content', () => {
  it('leaves the fingerprint and all nine drafts untouched', () => {
    expect(computeContentFingerprint()).toBe('a1a3ff57');
    const sections = fractionsChapterSections();
    expect(sections).toHaveLength(9);
    for (const s of sections) expect(s.reviewStatus).toBe('authored_draft');
  });
});
