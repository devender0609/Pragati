// v0.82.6 — A GENERIC HEADING MUST NOT HIDE A CHAPTER-SPECIFIC NUMBER.
//
// The Admin panel said "Authoring plan" and showed 9 review-ready. That
// number was right for Chapter 7 and wrong as a claim about Pragati,
// which has 12. Nothing was miscounted — the scope was simply unstated,
// so a correct figure read as a false one.

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { render } from '@testing-library/react';
import { ContentPlanPanel } from '../ContentPlanPanel';

// DOM-environment tests do not get a file: URL from import.meta, so
// read from the repository root.
const src = () =>
  readFileSync(`${process.cwd()}/src/features/admin/ContentPlanPanel.tsx`, 'utf8');

describe('the authoring plan names its scope', () => {
  it('says which chapter it describes', () => {
    const { container } = render(<ContentPlanPanel />);
    expect(container.textContent).toMatch(/Chapter 7, Fractions/);
  });

  it('does not use the deprecated product-ambiguous summary', () => {
    // `reviewReadinessSummary()` is Fractions-only but its name reads as
    // global. A component calling it cannot show the reader its scope.
    expect(src()).not.toMatch(/reviewReadinessSummary\(\)/);
    expect(src()).toMatch(/reviewReadinessSummaryForChapter\(FRACTIONS_CHAPTER_ID\)/);
  });
});


import {
  planSummary,
  planSummaryForChapter,
  planForChapter,
} from '../../../curriculum/contentPlan';
import { FRACTIONS_CHAPTER_ID } from '../../../curriculum/authoredSections';

describe('v0.82.7 every planning figure on the panel is Chapter 7', () => {
  // v0.82.6's test proved the heading named Chapter 7 and the deprecated
  // readiness call was gone. It said nothing about the six planning
  // metrics beneath the heading, which were still product-wide — a true
  // set of numbers made misleading by the scope printed above them.

  it('calls the chapter-scoped summary, never the product-wide one', () => {
    expect(src()).not.toMatch(/\bplanSummary\(\)/);
    expect(src()).toMatch(/planSummaryForChapter\(\s*FRACTIONS_CHAPTER_ID/);
  });

  it('derives the chapter summary from planForChapter alone', () => {
    const plans = planForChapter(FRACTIONS_CHAPTER_ID);
    const s = planSummaryForChapter(FRACTIONS_CHAPTER_ID, 'Chapter 7, Fractions');
    expect(s.records).toBe(plans.length);
    expect(s.plannable).toBe(plans.filter((p) => p.outcome === 'planned').length);
    expect(s.requiresDeeperStructure).toBe(
      plans.filter((p) => p.outcome === 'requires_deeper_curriculum_structure').length
    );
    expect(s.headline).toMatch(/in Chapter 7, Fractions/);
  });

  it('differs from the product-wide summary, which is why scope matters', () => {
    // If these were equal the mixed scope would have been harmless. They
    // are not, and the panel was showing the larger number.
    expect(planSummary().records).toBeGreaterThan(
      planSummaryForChapter(FRACTIONS_CHAPTER_ID, 'x').records
    );
  });

  it('leaves the product-wide summary unchanged in meaning', () => {
    expect(planSummary().headline).toMatch(/^\d+ verified official records need work\./);
  });
});

describe('v0.82.7 the authoring-standard sentence does not undersell Chapter 3', () => {
  it('attributes the standard to Chapter 7 without implying Chapter 3 was unaudited', () => {
    expect(src()).not.toMatch(/audited one body of content/);
    expect(src()).toMatch(/derived from the\s+fully audited Class 6 Chapter 7 Fractions set/);
    expect(src()).toMatch(/Number Play, has since been source-aligned/);
  });
});
