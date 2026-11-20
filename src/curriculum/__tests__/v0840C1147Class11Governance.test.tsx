/**
 * v0.84.0-c11.47 checkpoint 99E — the two governance debts, closed, with
 * GENERAL rules rather than lists of the units that happened to be wrong.
 *
 * This suite was lost with the 99/99B/99C working trees and is rebuilt
 * here. Every expectation is derived from canonical data or from the live
 * catalogue; none is copied from the handoff.
 */
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import fs from 'node:fs';
import path from 'node:path';
import { allAuthoredSections } from '../authoredSections';
import { authoredLearnCatalogueForGrade } from '../authoredLearnCatalogue';
import { __setAuthoredLearnPreviewForTests } from '../authoredLearnAccess';
import {
  type CanonicalUnit, isClass11Artifact, reconcileCoverage, unitCoverageKeys,
} from '../class11Coverage';

const UNITS: CanonicalUnit[] = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../../../class11-source/CLASS11_DECOMPOSITION.json'), 'utf8')
);
const arts = () => allAuthoredSections().filter(isClass11Artifact);
const withPreview = <T,>(fn: () => T): T => {
  __setAuthoredLearnPreviewForTests(true);
  try { return fn(); } finally { __setAuthoredLearnPreviewForTests(null); }
};

describe('GD-2 — a CBSE-only unit may not claim an NCERT chapter', () => {
  it('holds as a general rule over every authored artifact', () => {
    const offenders = arts()
      .filter((s) => (s.source as { sourceKind?: string }).sourceKind === 'cbse_only')
      .filter((s) => /ncert_kemh1_ch\d/.test(s.source.officialChapterId))
      .map((s) => s.contentArtifactId);
    expect(offenders).toEqual([]);
  });

  it('leaves scope fragments owning their real chapter', () => {
    // A fragment of §4.5 DOES belong to Chapter 4. The rule above removes
    // false ownership without stripping true ownership.
    const frags = arts().filter((s) => (s.source as { scopeFragmentId?: string }).scopeFragmentId);
    expect(frags.length).toBeGreaterThan(0);
    for (const f of frags) expect(f.source.officialChapterId, f.contentArtifactId).toMatch(/ncert_kemh1_ch\d/);
  });

  it('invents no section or page for a chapter-less CBSE lesson', () => {
    for (const s of arts().filter((x) => (x.source as { sourceKind?: string }).sourceKind === 'cbse_only')) {
      expect(s.source.officialSectionId, s.contentArtifactId).toBe('');
      expect(s.source.sectionNumber, s.contentArtifactId).toBe('');
      expect(s.source.startPage, s.contentArtifactId).toBe(0);
      expect((s.source as { cbseEntryId?: string }).cbseEntryId).toBeTruthy();
    }
  });

  it('never reads ownership off the route id', () => {
    // Historic ids still begin ncert_kemh1_ by design: they are routes and
    // progress keys. Ownership lives in the metadata.
    const historic = arts().filter((s) => /^ncert_kemh1_fo/.test(s.contentArtifactId));
    expect(historic.length).toBeGreaterThan(0);
    for (const s of historic) {
      if ((s.source as { sourceKind?: string }).sourceKind === 'cbse_only') {
        expect(s.source.officialChapterId).toMatch(/^cbse_fo/);
      }
    }
  });

  it('keeps every corrected lesson reachable exactly once', () => withPreview(() => {
    const cat = authoredLearnCatalogueForGrade('class11');
    const ids = cat.lessons.map((l) => l.contentArtifactId);
    expect(ids.length).toBe(new Set(ids).size);
    const chapterless = arts()
      .filter((s) => (s.source as { sourceKind?: string }).sourceKind === 'cbse_only')
      .map((s) => s.contentArtifactId);
    for (const id of chapterless) expect(ids.filter((x) => x === id), id).toHaveLength(1);
  }));

  it('reconciles the catalogue buckets against the total', () => withPreview(() => {
    const c = authoredLearnCatalogueForGrade('class11');
    expect(c.chapterOwnedCount).toBe(82);
    expect(c.prerequisiteLessons).toHaveLength(1);
    expect(c.requiredCoreLessons).toHaveLength(7);
    expect(c.lessonCount).toBe(90);
    expect(c.chapterOwnedCount + c.prerequisiteLessons.length + c.requiredCoreLessons.length)
      .toBe(c.lessonCount);
    expect([2, 3, 4].map((n) => c.chapters.find((x) => x.number === n)!.lessonCount))
      .toEqual([5, 7, 6]);
  }));
});

describe('GD-1 — official syllabus content is not optional', () => {
  it('leaves no formative syllabus unit at OPTIONAL_ENRICHMENT', () => {
    expect(UNITS.filter((u) => u.instructionalStatus === 'OPTIONAL_ENRICHMENT')).toEqual([]);
  });

  it('gives REQUIRED_PREREQUISITE only where a required dependent exists', () => {
    const byId = new Map(UNITS.map((u) => [u.unitId, u]));
    for (const u of UNITS.filter((x) => x.instructionalStatus === 'REQUIRED_PREREQUISITE')) {
      const deps = UNITS.filter((v) => v.prerequisites.includes(u.unitId));
      expect(deps.length, `${u.unitId} has no dependents`).toBeGreaterThan(0);
      expect(deps.some((d) => byId.get(d.unitId)!.instructionalStatus.startsWith('REQUIRED'))).toBe(true);
    }
    // ...and the converse: a formative required-core unit with required
    // dependents would be mislabelled.
    const miscast = UNITS.filter((u) => u.instructionalStatus === 'REQUIRED_CORE'
      && u.assessmentStatus === 'FORMATIVE_ONLY'
      && UNITS.some((v) => v.prerequisites.includes(u.unitId)));
    expect(miscast.map((u) => u.unitId)).toEqual([]);
  });

  it('changed instructional status only — never assessment or eligibility', () => {
    expect(UNITS.filter((u) => u.assessmentStatus === 'SUMMATIVE_CORE')).toHaveLength(80);
    expect(UNITS.filter((u) => u.assessmentStatus === 'FORMATIVE_ONLY')).toHaveLength(13);
    expect(UNITS.filter((u) => u.summativeEligible === true)).toHaveLength(80);
    for (const u of UNITS.filter((x) => x.assessmentStatus === 'FORMATIVE_ONLY')) {
      expect(u.summativeEligible, u.unitId).toBe(false);
    }
  });

  it('keeps 93 units with no human-check reopened', () => {
    expect(UNITS).toHaveLength(93);
    expect(UNITS.filter((u) => u.status === 'NEEDS_HUMAN_CHECK')).toEqual([]);
  });
});

describe('coverage, reconciled through the real mechanism', () => {
  it('extracts a key for EVERY canonical source shape, never a blank', () => {
    const kinds = new Set(UNITS.map((u) => u.source.kind));
    expect([...kinds].sort()).toEqual(['CBSE_ONLY', 'NCERT_SECTION', 'NCERT_SUBSECTION', 'SCOPE_FRAGMENT']);
    for (const u of UNITS) {
      const keys = unitCoverageKeys(u);
      expect(keys.length, u.unitId).toBeGreaterThan(0);
      for (const k of keys) expect(k.trim(), `${u.unitId} blank key`).not.toBe('');
    }
    for (const kind of kinds) {
      const sample = UNITS.find((u) => u.source.kind === kind)!;
      expect(unitCoverageKeys(sample).every((k) => k.trim()), kind).toBe(true);
    }
  });

  it('REFUSES an unrecognised source shape rather than returning blank', () => {
    // A silent blank is indistinguishable from a real gap — that is what
    // made 34 covered units look uncovered in the first audit pass.
    expect(() => unitCoverageKeys({ unitId: 'X', source: { kind: 'MADE_UP' } } as never))
      .toThrow(/unrecognised source kind/);
  });

  it('covers all 93, with the empty queue derived not hardcoded', () => {
    const c = reconcileCoverage(UNITS, arts());
    expect(c.units).toBe(93);
    // v0.84.0-c11.48 checkpoint 100B — FO-10 authored, so coverage rose by
    // one canonical unit and it left the missing list.
    expect(c.covered).toBe(93);
    // v0.84.0-c11.56 checkpoint 102C — FO-11 authored; nothing remains
    // uncovered for the current canonical 93-unit scope.
    expect([...c.uncovered].sort()).toEqual([]);
    expect(c.orphans).toEqual([]);
  });

  it('explains 90 artifacts covering 93 units by SHARED SOURCE KEYS', () => {
    // Units decompose finer than the sections lessons are authored against.
    // NOT artifacts carrying several unit ids — no such field exists.
    const c = reconcileCoverage(UNITS, arts());
    expect(arts()).toHaveLength(90);
    const surplus = c.sharedKeys.reduce((n, k) => n + k.unitIds.length - 1, 0);
    expect(c.covered - surplus).toBe(c.sharedKeys.length + (c.covered - surplus - c.sharedKeys.length));
    expect(surplus).toBeGreaterThan(0);
    const seven2 = c.sharedKeys.find((k) => k.key === '7.2');
    expect(seven2?.unitIds).toContain('C11-BIN-FO7');
  });

  it('derives the required denominator and the authoring queue', () => {
    const required = UNITS.filter((u) => u.instructionalStatus.startsWith('REQUIRED'));
    const c = reconcileCoverage(UNITS, arts());
    expect(required).toHaveLength(93);
    const missing = required.filter((u) => c.uncovered.includes(u.unitId)).map((u) => u.unitId);
    expect(required.length - missing.length).toBe(93);
    expect(UNITS.filter((u) => u.assessmentStatus === 'SUMMATIVE_CORE'
      && c.uncovered.includes(u.unitId))).toEqual([]);
    const formative = UNITS.filter((u) => u.assessmentStatus === 'FORMATIVE_ONLY');
    expect(formative.filter((u) => !c.uncovered.includes(u.unitId))).toHaveLength(13);
    // Every missing unit is independently authorable.
    for (const id of c.uncovered) {
      const u = UNITS.find((x) => x.unitId === id)!;
      for (const p of u.prerequisites) expect(c.uncovered, `${id} <- ${p}`).not.toContain(p);
    }
  });
});

describe('the student-facing summary', () => {
  it('pluralises every count it prints', () => withPreview(() => {
    const cat = authoredLearnCatalogueForGrade('class11');
    // Regression for "4 more required lesson": both clauses were written
    // when each count was always 1, and GD-2 made one of them 4.
    render(
      <p>{`${cat.chapters.length} chapters from your textbook · ${cat.chapterOwnedCount} lessons${
        cat.prerequisiteLessons.length > 0
          ? ` · ${cat.prerequisiteLessons.length} prerequisite ${
            cat.prerequisiteLessons.length === 1 ? 'lesson' : 'lessons'} outside the textbook`
          : ''
      }${
        cat.requiredCoreLessons.length > 0
          ? ` · ${cat.requiredCoreLessons.length} more required ${
            cat.requiredCoreLessons.length === 1 ? 'lesson' : 'lessons'} outside the textbook`
          : ''
      }`}</p>
    );
    const text = screen.getByText(/chapters from your textbook/).textContent ?? '';
    expect(text).toContain('7 more required lessons outside the textbook');
    expect(text).toContain('1 prerequisite lesson outside the textbook');
    expect(text).not.toMatch(/\b([02-9]|\d\d+) (prerequisite|more required) lesson\b/);
  }));
});
