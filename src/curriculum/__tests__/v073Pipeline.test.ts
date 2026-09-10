// v0.73 — the authoring pipeline plans work; it never authors content.
//
// v0.74 NOTE: four assertions in this file encoded behaviour v0.74
// corrects, and are updated here rather than deleted. Each change is
// marked `v0.74:` with the reason. Everything else is untouched and
// still passes, which is the point of keeping the file.

import { describe, it, expect } from 'vitest';
import {
  contentPlan,
  planSummary,
  planForChapter,
  planForGrade,
  observedMiddleStageFractionsShape,
  assertNoContentGenerated,
} from '../contentPlan';
import { authoringStandardForStage } from '../productionStage';
import { COMPLETE_DRAFT_MINIMUM } from '../instructionalCompleteness';
import { coverageBacklog } from '../coverageMatrix';
import { fractionsChapterSections } from '../fractionsChapter';
import { computeContentFingerprint } from '../contentArtifact';

describe('the pipeline plans, and plans only', () => {
  it('generates no content', () => {
    // The standing guarantee. If a future change makes the planner emit
    // prose, item stems or answers, this names the offending field.
    expect(assertNoContentGenerated()).toEqual([]);
  });

  it('describes quantities and shapes, never sentences a student could read', () => {
    for (const p of contentPlan()) {
      for (const w of p.work) {
        expect(w.description.length).toBeLessThan(90);
        // No question marks: a work item is a specification, not an item.
        expect(w.description).not.toContain('?');
      }
    }
  });

  it('covers exactly the backlog, no more and no less', () => {
    expect(contentPlan()).toHaveLength(coverageBacklog().length);
  });
});

describe('the target shape comes from the audited chapter', () => {
  it('derives the observed shape from the live sections', () => {
    // v0.74: renamed from `auditedChapterShape`. The measurement is
    // identical; the NAME now says which stage and chapter it describes,
    // because the old name is what let it become a universal target.
    const observed = observedMiddleStageFractionsShape();
    const rows = fractionsChapterSections();
    // A median, so one long section cannot raise the bar for every
    // future one and §7.9 cannot lower it.
    expect(observed.workedExamples).toBeGreaterThan(0);
    expect(observed.workedExamples).toBeLessThanOrEqual(
      Math.max(...rows.map((r) => r.workedExamples.length))
    );
  });

  it('never targets less than the completeness gate requires', () => {
    // v0.74: was `targetSectionShape()`, a single global target applied
    // to Classes 6-12 alike. The floor assertion is still right, but it
    // holds for the MIDDLE STAGE standard specifically — no other stage
    // has one to assert about.
    const std = authoringStandardForStage('MIDDLE');
    if (std.kind !== 'audited_standard') throw new Error('MIDDLE must have a standard');
    const t = std.shape;
    expect(t.explanationParagraphs).toBeGreaterThanOrEqual(
      COMPLETE_DRAFT_MINIMUM.explanationParagraphs
    );
    expect(t.workedExamples).toBeGreaterThanOrEqual(COMPLETE_DRAFT_MINIMUM.workedExamples);
    expect(t.independentPractice).toBeGreaterThanOrEqual(
      COMPLETE_DRAFT_MINIMUM.independentPractice
    );
  });
});

describe('the plan tells the truth about who is blocked', () => {
  it('reports ONE complete draft genuinely blocked on an educator', () => {
    // v0.74 §7: was `toBe(8)`. Eight sections need no authoring, which
    // is true and unchanged. But seven of them have no review package —
    // no frozen candidate, no pinned build, and a Package B question set
    // written about §7.4's number line — so no educator could have
    // started on them. "Blocked on people, not engineering" was false
    // for seven of the eight, in a release headline.
    // v0.75 §21/§22: 1 -> 9, and the engineering queue emptied. The
    // v0.74 point stands and is now asserted the other way round —
    // "blocked on a person" must be TRUE only when it is operationally
    // true, and it now is for all nine.
    const s = planSummary();
    expect(s.blockedOnEducatorReviewOnly).toBe(9);
    expect(s.reviewPackagesToPrepare).toBe(0);
  });

  it('marks the review-ready section as review-only, with no authoring work', () => {
    // v0.75 §21: 1 -> 9. §7.4 is still among them and still frozen.
    const blocked = planForChapter('ncert_gp_c6_ch07_fractions').filter(
      (p) => p.blockedOnHumanOnly
    );
    expect(blocked).toHaveLength(9);
    expect(blocked.map((p) => p.officialSectionId)).toContain('ncert_gp_c6_s7_4');
    const s74 = blocked.find((p) => p.officialSectionId === 'ncert_gp_c6_s7_4')!;
    const advanceable = s74.work.filter(
      (w) => w.applicability !== 'not_required_with_reason'
    );
    expect(advanceable.every((w) => w.requiresHuman)).toBe(true);
    expect(advanceable.map((w) => w.kind)).toEqual(['educator_review']);
  });

  it('still shows §7.9 as below the Middle Stage target', () => {
    // v0.75 §22 — §7.9 now PASSES the completeness gate (2 worked
    // examples, 2 guided, 3 independent) but sits below the observed
    // Fractions median (3/3/5), so the plan still lists enrichment.
    //
    // Those are two different bars and both matter. What changed is
    // that enrichment above the gate no longer counts as blocking:
    // reporting §7.9 as engineering-blocked would repeat the v0.73
    // error in the opposite direction, attributing to engineering a
    // wait that is really on a reviewer.
    const s79 = planForChapter('ncert_gp_c6_ch07_fractions').find(
      (p) => p.officialSectionId === 'ncert_gp_c6_s7_9'
    )!;
    expect(s79.work.some((w) => w.kind === 'author_worked_examples')).toBe(true);
    expect(s79.blockedOnHumanOnly).toBe(true);
    expect(s79.reviewReadiness).toBe('review_ready');
  });

  it('generates no work for a waived requirement', () => {
    // §7.9 is deliberately non-interactive and has no visual; planning
    // one would be bolting a quiz about dates onto a discussion.
    //
    // v0.74 §3: the waiver is now RECORDED rather than producing
    // nothing at all. Silently omitting it is how v0.73 lost three
    // whole components from its own target shape. The test therefore
    // asserts what it always meant — no WORK is generated — while
    // allowing the waiver to appear with its reason.
    const s79 = planForChapter('ncert_gp_c6_ch07_fractions').find(
      (p) => p.officialSectionId === 'ncert_gp_c6_s7_9'
    )!;
    const demanded = s79.work.filter((w) => w.applicability === 'required');
    expect(demanded.some((w) => w.kind === 'specify_visual')).toBe(false);
    expect(demanded.some((w) => w.kind === 'author_interactive_practice')).toBe(false);

    const waived = s79.work.filter(
      (w) => w.applicability === 'not_required_with_reason'
    );
    expect(waived.map((w) => w.kind).sort()).toEqual([
      'author_interactive_practice',
      'document_misconception',
      'specify_visual',
    ]);
    for (const w of waived) expect(w.reason).toBeTruthy();
  });

  it('puts every PLANNABLE record on the review list, because none is reviewed', () => {
    // v0.74 §2: was every record. A Class 10 syllabus unit with no
    // sections has nothing for an educator to read; its next action is
    // somebody opening the textbook, and listing it as review work
    // misdescribed 24 records.
    for (const p of contentPlan()) {
      if (p.outcome !== 'planned') continue;
      expect(p.work.some((w) => w.kind === 'educator_review')).toBe(true);
    }
  });

  it('plans only for verified grades', () => {
    const grades = new Set(contentPlan().map((p) => p.grade));
    expect([...grades].sort()).toEqual([
      'class10', 'class11', 'class12', 'class6', 'class9',
    ]);
    for (const g of ['class1', 'class3', 'class7'] as const) {
      expect(planForGrade(g), g).toEqual([]);
    }
  });
});

describe('the pipeline changed no content', () => {
  it('leaves the fingerprint and all nine drafts untouched', () => {
    expect(computeContentFingerprint()).toBe('a1a3ff57');
    const sections = fractionsChapterSections();
    expect(sections).toHaveLength(9);
    for (const s of sections) expect(s.reviewStatus).toBe('authored_draft');
  });
});
