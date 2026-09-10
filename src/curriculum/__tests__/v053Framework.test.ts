// v0.53 §17 — framework evidence, crosswalk, and classroom context.

import { describe, it, expect } from 'vitest';
import {
  INSPECTED_SOURCES, inaccessibleSources, RATIONAL_NUMBER_CROSSWALK,
  crosswalkFor, nodesWithUncertainPlacement, mayClaimOfficialGradePlacement,
  CONSTRUCT_DECISIONS, decisionFor,
} from '../curriculumCrosswalk';
import { RATIONAL_NUMBER_STRAND } from '../rationalNumberStrand';
import {
  resolveClassroomContext, contextLabel, AGGREGATE_SENTINEL,
} from '../../features/teacher/classroomContext';

describe('§1 sources record what was and was not inspected', () => {
  it('records both accessible and inaccessible primary sources', () => {
    expect(INSPECTED_SOURCES.length).toBeGreaterThanOrEqual(4);
    expect(inaccessibleSources().length).toBeGreaterThan(0);
  });

  it('every inaccessible source names its exact blocker', () => {
    for (const s of inaccessibleSources()) {
      expect(s.inaccessibleReason).toBeTruthy();
      expect(s.supportsClaim).toMatch(/NOT INSPECTED/);
    }
  });

  it('distinguishes a size limit from an access block', () => {
    const parakh = INSPECTED_SOURCES.find((s) => s.organization.includes('PARAKH'))!;
    expect(parakh.accessible).toBe(false);
    expect(parakh.inaccessibleReason).toMatch(/SIZE limit, not an access block/);
    const ncf = INSPECTED_SOURCES.find((s) => s.title.includes('National Curriculum Framework'))!;
    expect(ncf.inaccessibleReason).toMatch(/robots/i);
  });

  it('every accessible source carries a locator and a date', () => {
    for (const s of INSPECTED_SOURCES.filter((x) => x.accessible)) {
      expect(s.location.length).toBeGreaterThan(0);
      expect(s.dateInspected).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(s.url).toMatch(/^https:\/\//);
    }
  });
});

describe('§6 every progression node has an evidence classification', () => {
  it('covers every node in the strand', () => {
    expect(RATIONAL_NUMBER_CROSSWALK.length).toBe(RATIONAL_NUMBER_STRAND.length);
    for (const c of RATIONAL_NUMBER_STRAND) {
      expect(crosswalkFor(c.id)).not.toBeNull();
    }
  });

  it('separates the dependency claim from the placement claim', () => {
    for (const row of RATIONAL_NUMBER_CROSSWALK) {
      expect(row.dependencyEvidence).toBeTruthy();
      expect(row.placementEvidence).toBeTruthy();
      expect(row.proposedAssessmentEvidence.length).toBeGreaterThan(0);
    }
  });

  it('only primary-source placement may be claimed as official', () => {
    for (const row of RATIONAL_NUMBER_CROSSWALK) {
      const claim = mayClaimOfficialGradePlacement(row);
      expect(claim).toBe(row.placementEvidence === 'primary_source_supported');
    }
    // Exactly one node currently qualifies, and it is the secondary-stage
    // one, because that is the only syllabus read in full.
    const claimable = RATIONAL_NUMBER_CROSSWALK.filter(mayClaimOfficialGradePlacement);
    expect(claimable.map((r) => r.pragatiCompetencyId)).toEqual(['RAT.ALGPROP']);
  });

  it('reports which nodes have uncertain placement rather than hiding them', () => {
    const uncertain = nodesWithUncertainPlacement();
    expect(uncertain.length).toBeGreaterThan(0);
    for (const r of uncertain) expect(r.expertReviewRequired).toBe(true);
  });

  it('mathematically inferred ordering is allowed and is not a curriculum claim', () => {
    const inferred = RATIONAL_NUMBER_CROSSWALK.filter(
      (r) => r.dependencyEvidence === 'mathematically_inferred'
    );
    expect(inferred.length).toBeGreaterThan(0);
    // None of them thereby claims official placement.
    for (const r of inferred) {
      if (!mayClaimOfficialGradePlacement(r)) continue;
      expect(r.placementEvidence).toBe('primary_source_supported');
    }
  });

  it('every node still requires expert review', () => {
    for (const r of RATIONAL_NUMBER_CROSSWALK) {
      expect(r.expertReviewRequired).toBe(true);
    }
  });
});

describe('§4 Computational Thinking is classified with evidence', () => {
  it('is an item-level process tag, NOT a Mathematics reporting domain', () => {
    const d = decisionFor('Computational Thinking')!;
    expect(d.classification).toBe('item_level_process_tag');
    expect(d.classification).not.toBe('content_domain');
  });

  it('cites the cross-cutting statement from the primary source', () => {
    const d = decisionFor('Computational Thinking')!;
    expect(d.evidence.join(' ')).toMatch(/cross-cutting theme/i);
    expect(d.evidence.length).toBeGreaterThanOrEqual(3);
  });

  it('every construct decision carries a rationale and evidence', () => {
    for (const d of CONSTRUCT_DECISIONS) {
      expect(d.rationale.length).toBeGreaterThan(40);
      expect(d.evidence.length).toBeGreaterThan(0);
    }
  });

  it('Rational Number separation is labelled a Pragati design choice, not curriculum', () => {
    const d = decisionFor('Fractions & Rational Number Reasoning')!;
    expect(d.rationale).toMatch(/PRAGATI MEASUREMENT-DESIGN DISTINCTION, NOT AN OFFICIAL CURRICULUM DISTINCTION/);
    expect(d.rationale).toMatch(/never be described as curriculum alignment/i);
  });
});

describe('§10 teacher classroom context never defaults to aggregate', () => {
  const one = [{ id: 'a', name: 'Class 6 Blue' }];
  const many = [...one, { id: 'b', name: 'Class 6 Green' }];

  it('auto-selects when there is exactly one classroom', () => {
    const r = resolveClassroomContext({ classrooms: one });
    expect(r.selectedClassroomId).toBe('a');
    expect(r.isExplicitAggregate).toBe(false);
    expect(r.reason).toBe('single_classroom_auto');
  });

  it('asks rather than aggregating when there are several', () => {
    const r = resolveClassroomContext({ classrooms: many });
    expect(r.selectedClassroomId).toBeNull();
    expect(r.mustChoose).toBe(true);
    expect(r.isExplicitAggregate).toBe(false);
    expect(contextLabel(r, many)).toBe('Choose a class');
  });

  it('restores a valid stored selection', () => {
    const r = resolveClassroomContext({ classrooms: many, storedSelection: 'b' });
    expect(r.selectedClassroomId).toBe('b');
    expect(r.reason).toBe('restored_recent');
    expect(contextLabel(r, many)).toBe('Class 6 Green');
  });

  it('ignores a stored classroom that no longer exists', () => {
    const r = resolveClassroomContext({ classrooms: many, storedSelection: 'gone' });
    expect(r.mustChoose).toBe(true);
  });

  it('honours aggregate only when it was explicitly chosen', () => {
    const r = resolveClassroomContext({
      classrooms: many, storedSelection: AGGREGATE_SENTINEL,
    });
    expect(r.isExplicitAggregate).toBe(true);
    expect(r.reason).toBe('explicit_aggregate');
    expect(contextLabel(r, many)).toMatch(/aggregate/i);
  });

  it('shows an empty state when there are no classrooms', () => {
    const r = resolveClassroomContext({ classrooms: [] });
    expect(r.reason).toBe('no_classrooms');
    expect(r.mustChoose).toBe(false);
    expect(contextLabel(r, [])).toBe('No classes yet');
  });

  it('a single classroom is never overridden into aggregate by default', () => {
    // The exact v0.52 defect.
    const r = resolveClassroomContext({ classrooms: one, storedSelection: null });
    expect(r.isExplicitAggregate).toBe(false);
    expect(r.selectedClassroomId).not.toBeNull();
  });
});
