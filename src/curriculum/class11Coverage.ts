// ===========================================================================
// v0.84.0-c11.46r checkpoint 99R — CANONICAL UNIT ↔ AUTHORED ARTIFACT COVERAGE.
//
// Canonical units decompose FINER than the source sections lessons are
// authored against: §7.2 carries BIN-01, BIN-02, BIN-03 and BIN-FO7. So 87
// artifacts cover 90 units, and the relationship is many units to one
// source key — NOT one artifact carrying several unit ids. An earlier
// hypothesis claimed the latter; the data has no such field.
//
// Every canonical source shape is handled EXPLICITLY. The checkpoint-98
// audit's first pass read only `section` and `cbseEntry`, so the 22
// subsection units and 9 scope-fragment units produced blank keys and 34
// units looked uncovered. A silent blank is indistinguishable from a real
// gap, so an unknown shape throws instead.
// ===========================================================================

import type { AuthoredSection } from './authoredSection';

export type CanonicalSource =
  | { kind: 'NCERT_SECTION'; section: string }
  | { kind: 'NCERT_SUBSECTION'; subsection: string }
  | { kind: 'SCOPE_FRAGMENT'; fragmentId: string; parentSection: string }
  | { kind: 'CBSE_ONLY'; cbseEntry: string; ncertChapterOwner: null };

export type CanonicalUnit = {
  unitId: string; title: string; assessmentStatus: string; instructionalStatus: string;
  summativeEligible?: boolean; prerequisites: string[]; status?: string;
  source: CanonicalSource & Record<string, unknown>;
};

/**
 * Every identifier a unit may legitimately be reached by. A subsection is
 * taught by the lesson owning its parent section, so both are returned; a
 * scope fragment is reachable by its own id and by its parent.
 */
export function unitCoverageKeys(u: CanonicalUnit): string[] {
  const s = u.source;
  switch (s.kind) {
    case 'NCERT_SECTION':
      return [s.section];
    case 'NCERT_SUBSECTION':
      return [s.subsection, s.subsection.split('.').slice(0, 2).join('.')];
    case 'SCOPE_FRAGMENT':
      return [s.fragmentId, s.parentSection];
    case 'CBSE_ONLY':
      return [s.cbseEntry];
    default: {
      // No fall-through guess: an unknown shape is a defect, not a blank.
      const bad = s as { kind?: string };
      throw new Error(`"${u.unitId}" has an unrecognised source kind "${bad.kind}"`);
    }
  }
}

/** Every identifier an authored artifact answers to. */
export function artifactCoverageKeys(a: AuthoredSection): string[] {
  const s = a.source as Record<string, unknown>;
  const keys: string[] = [];
  for (const field of ['sectionNumber', 'cbseEntryId', 'scopeFragmentId', 'officialSubsectionNumber']) {
    const v = s[field];
    if (typeof v === 'string' && v.trim()) keys.push(v);
  }
  return keys;
}

export const isClass11Artifact = (a: AuthoredSection): boolean =>
  /kemh1|_c11_|cbse_fo/.test(a.source.officialChapterId);

export type Coverage = {
  units: number; covered: number; uncovered: string[];
  byUnit: Map<string, string[]>;
  sharedKeys: Array<{ key: string; unitIds: string[] }>;
  orphans: string[];
};

export function reconcileCoverage(units: CanonicalUnit[], artifacts: AuthoredSection[]): Coverage {
  const keyToArtifacts = new Map<string, string[]>();
  for (const a of artifacts) {
    for (const k of artifactCoverageKeys(a)) {
      if (!keyToArtifacts.has(k)) keyToArtifacts.set(k, []);
      keyToArtifacts.get(k)!.push(a.contentArtifactId);
    }
  }
  const byUnit = new Map<string, string[]>();
  const uncovered: string[] = [];
  const keyUnits = new Map<string, string[]>();
  for (const u of units) {
    const hit = unitCoverageKeys(u).find((k) => keyToArtifacts.has(k));
    if (hit) {
      byUnit.set(u.unitId, keyToArtifacts.get(hit)!);
      if (!keyUnits.has(hit)) keyUnits.set(hit, []);
      keyUnits.get(hit)!.push(u.unitId);
    } else {
      uncovered.push(u.unitId);
    }
  }
  // An artifact is orphaned only if NO canonical unit reconciles to it.
  const claimed = new Set([...byUnit.values()].flat());
  const orphans = artifacts.filter((a) => !claimed.has(a.contentArtifactId))
    .map((a) => a.contentArtifactId);
  return {
    units: units.length, covered: byUnit.size, uncovered, byUnit,
    sharedKeys: [...keyUnits.entries()].filter(([, v]) => v.length > 1)
      .map(([key, unitIds]) => ({ key, unitIds })),
    orphans,
  };
}
