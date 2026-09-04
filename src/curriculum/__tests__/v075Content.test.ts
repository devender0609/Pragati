// v0.75 §21/§22/§36 — REVIEW PACKAGES AND §7.9 COMPLETION.

import { describe, it, expect } from 'vitest';
import {
  sectionsNeedingPackages, sectionReviewRecords,
  questionsForSection, sectionFingerprint,
  sectionPackageMarkdown, ALREADY_PACKAGED,
} from '../sectionReviewPackages';
import { computeContentFingerprint } from '../contentArtifact';
import { authoredSectionById, fractionsChapterSections } from '../fractionsChapter';
import { assessSection } from '../instructionalCompleteness';
import { chapterReviewReadiness } from '../reviewReadiness';
import { readFileSync, existsSync } from 'node:fs';

const url = (p: string) => new URL(`../../../${p}`, import.meta.url);

describe('§21 packages are section-scoped, not Package B clones', () => {
  it('builds one for every complete draft except the frozen §7.4', () => {
    expect(sectionsNeedingPackages()).toHaveLength(8);
    expect(sectionsNeedingPackages()).not.toContain(ALREADY_PACKAGED);
  });

  it('gives each package its own artifact and fingerprint', () => {
    const recs = sectionReviewRecords();
    const fps = new Set(recs.map((r) => sectionFingerprint(r.contentArtifactId!.replace('_lesson', ''))));
    expect(fps.size).toBe(recs.length);
    for (const r of recs) {
      expect(r.contentArtifactId).toMatch(/^ncert_gp_c6_s7_\d_lesson$/);
      expect(r.packageVersion).toBe('v0.75');
      // Computed at import time, never stored — a stored hash goes stale
      // silently and the importer would accept a response about a lesson
      // that had changed.
      expect(typeof r.expectedFingerprint).toBe('function');
    }
  });

  it('asks only about components the section actually has', () => {
    // The whole point of §21. §7.9 has no visual, no interactive item
    // and no documented misconception, all by recorded waiver, so it is
    // not asked about them. A fixed 37-question clone would have invited
    // a fabricated answer.
    const q79 = questionsForSection('ncert_gp_c6_s7_9').map((q) => q.id);
    expect(q79).not.toContain('V1');
    expect(q79).not.toContain('P1');
    expect(q79).not.toContain('C1');

    const q71 = questionsForSection('ncert_gp_c6_s7_1').map((q) => q.id);
    expect(q71).toContain('V1');
    expect(q71).toContain('P1');
    expect(q79.length).toBeLessThan(q71.length);
  });

  it('stays far shorter than 37 questions per section', () => {
    for (const id of sectionsNeedingPackages()) {
      const n = questionsForSection(id).length;
      expect(n).toBeGreaterThan(8);
      expect(n).toBeLessThanOrEqual(20);
    }
  });

  it('gives every question a stated reason for being asked', () => {
    for (const q of questionsForSection('ncert_gp_c6_s7_1')) {
      expect(q.appliesBecause.length).toBeGreaterThan(10);
    }
  });

  it('tells the reviewer what was deliberately left out', () => {
    const md = sectionPackageMarkdown('ncert_gp_c6_s7_9');
    expect(md).toMatch(/Not included, on purpose/);
    expect(md).toMatch(/not\*{0,2} asked about these/i);
    // And the fingerprint contract is stated in the reviewer's own words.
    expect(md).toMatch(/rejected\s+rather than silently accepted/);
  });

  it('ships the generated packages on disk', () => {
    expect(existsSync(url('PRAGATI_CHAPTER_7_REVIEW_PACKAGES/index.json'))).toBe(true);
    const idx = JSON.parse(readFileSync(url('PRAGATI_CHAPTER_7_REVIEW_PACKAGES/index.json'), 'utf8'));
    expect(idx.packages).toHaveLength(8);
    for (const p of idx.packages) {
      expect(existsSync(url(`PRAGATI_CHAPTER_7_REVIEW_PACKAGES/${p.file}`))).toBe(true);
    }
  });

  it('leaves the §7.4 frozen identity untouched', () => {
    expect(computeContentFingerprint()).toBe('a1a3ff57');
    // §7.4 must not acquire a generated code alongside its frozen one.
    expect(sectionsNeedingPackages()).not.toContain('ncert_gp_c6_s7_4');
  });
});

describe('§22 §7.9 is a complete draft, without bolted-on interaction', () => {
  it('now passes the completeness gate', () => {
    const a = assessSection(authoredSectionById('ncert_gp_c6_s7_9')!);
    expect(a.level).toBe('complete_instructional_draft');
    expect(a.gaps).toEqual([]);
  });

  it('makes all nine Fractions sections complete drafts', () => {
    const levels = fractionsChapterSections().map((s) => assessSection(s).level);
    expect(levels.filter((l) => l === 'complete_instructional_draft')).toHaveLength(9);
  });

  it('keeps every waiver it had', () => {
    // §22 — respect the existing waivers. Completing the counts must not
    // become an excuse to add a quiz about dates to a history section.
    const a = assessSection(authoredSectionById('ncert_gp_c6_s7_9')!);
    expect(a.visualRequirement.required).toBe(false);
    expect(a.interactionRequirement.required).toBe(false);
    expect(a.misconceptionRequirement.required).toBe(false);
    const s = authoredSectionById('ncert_gp_c6_s7_9')!;
    expect(s.visuals).toEqual([]);
    expect(s.interactivePractice).toEqual([]);
  });

  it('added history reasoning, not arithmetic padding', () => {
    const s = authoredSectionById('ncert_gp_c6_s7_9')!;
    const we2 = s.workedExamples.find((w) => w.id === 's79.we2')!;
    expect(we2).toBeTruthy();
    expect(we2.steps.length).toBeGreaterThanOrEqual(3);
    for (const st of we2.steps) expect(st.reasoning.length).toBeGreaterThan(15);
    // The section teaches how to read a claim about the past.
    expect(we2.prompt).toMatch(/invented fractions/i);
    const i3 = s.independentPractice.find((x) => x.id === 's79.i3')!;
    expect(i3.rationale.length).toBeGreaterThan(30);
  });
});

describe('§20/§22 nothing is reviewed or published', () => {
  it('has every section awaiting a person, none reviewed', () => {
    const states = chapterReviewReadiness().map((r) => r.state);
    expect(states.every((s) => s === 'review_ready')).toBe(true);
    expect(states.filter((s) => s === 'review_received')).toHaveLength(0);
    expect(states.filter((s) => s === 'review_adjudicated')).toHaveLength(0);
  });

  it('ships a handoff that does not claim to have sent anything', () => {
    const md = readFileSync(url('REVIEW_HANDOFF/SEND_THIS.md'), 'utf8');
    expect(md).toMatch(/Status: NOT SENT/);
    expect(md).toMatch(/Do not mark this done because it was sent/i);
    // Two reviewers, two packages, deliberately not merged.
    expect(md).toMatch(/Grade 6 mathematics educator/);
    expect(md).toMatch(/Curriculum reviewer/);
  });
});
