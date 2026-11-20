/**
 * v0.84.0-c11.35 checkpoint 93H — the representation contract.
 *
 * The permanent guard for a failure class that cost three checkpoints: a
 * lesson declares a first-class representation and ships with no visual.
 * Enforcement reads the DECLARED family, never prose, because prose
 * inference over-fires on older lessons that mention a table in passing.
 */
import { describe, expect, it } from 'vitest';
import type { AuthoredSection } from '../authoredSection';
import {
  checkRepresentationContract, contractProblems, declaredFamilies, inferredFamilies,
} from '../representationContract';
import { AUTHORED_CHAPTERS } from '../authoredSections';
import { C11_STA_SECTIONS } from '../statisticsClass11Sections';

const fake = (families: string[], kinds: string[]): AuthoredSection =>
  ({ contentArtifactId: 'test', representationFamilies: families, visuals: kinds.map((type) => ({ type })) } as unknown as AuthoredSection);

describe('the guard rejects a declared representation that never reaches the student', () => {
  it('rejects an unrelated visual family', () => {
    expect(contractProblems(fake(['table:deviation'], ['venn'])))
      .toEqual(['test declares table:deviation but consumes venn']);
  });

  it('rejects no visual at all — the original failure', () => {
    expect(contractProblems(fake(['table:deviation'], [])))
      .toEqual(['test declares table:deviation but consumes no visual at all']);
  });

  it('rejects a near-miss: a grouped table for a method comparison', () => {
    expect(contractProblems(fake(['table:method_comparison'], ['grouped_table']))).toHaveLength(1);
  });

  it('rejects the historical failures, each in its own family', () => {
    // These stand in for Venn, the graphs, ProofLayout and the partial sums.
    expect(contractProblems(fake(['venn'], []))).toHaveLength(1);
    expect(contractProblems(fake(['graph:function'], []))).toHaveLength(1);
    expect(contractProblems(fake(['proof'], []))).toHaveLength(1);
    expect(contractProblems(fake(['sequence:indexed'], ['grouped_table']))).toHaveLength(1);
  });

  it('passes a compatible visual, and accepts more than one kind per family', () => {
    expect(contractProblems(fake(['table:deviation'], ['deviation_table']))).toEqual([]);
    // Compatibility, not string equality: both put the same mathematics up.
    expect(contractProblems(fake(['table:deviation'], ['grouped_table']))).toEqual([]);
    expect(contractProblems(fake(['proof'], ['proof_layout']))).toEqual([]);
    expect(contractProblems(fake(['sequence:indexed'], ['indexed_sequence']))).toEqual([]);
  });

  it('reports which families were checked and what was found', () => {
    const r = checkRepresentationContract(fake(['table:grouped'], ['deviation_table']));
    expect(r).toEqual([{ family: 'table:grouped', satisfied: false, found: ['deviation_table'] }]);
  });
});

describe('enforcement reads declarations, not prose', () => {
  it('declares nothing for a lesson with no structured field', () => {
    expect(declaredFamilies({ representations: ['A table of observations'] } as unknown as AuthoredSection)).toEqual([]);
  });

  it('keeps prose reading as a DIAGNOSTIC only', () => {
    const s = { representations: ['A deviation table with the chosen centre'] } as unknown as AuthoredSection;
    expect(inferredFamilies(s)).toContain('table:deviation');
    // ...but it is not what the gate uses.
    expect(contractProblems(s)).toEqual([]);
  });
});

describe('the authored corpus', () => {
  const all = AUTHORED_CHAPTERS.flatMap((c) => c.sections());

  it('has every explicit declaration satisfied', () => {
    const declaring = all.filter((s) => declaredFamilies(s).length);
    expect(declaring.length).toBeGreaterThanOrEqual(7);
    expect(all.flatMap((s) => contractProblems(s))).toEqual([]);
  });

  it('declares a family for all seven Statistics lessons', () => {
    for (const s of C11_STA_SECTIONS) {
      expect(declaredFamilies(s).length, s.contentArtifactId).toBeGreaterThan(0);
      expect(contractProblems(s), s.contentArtifactId).toEqual([]);
    }
  });

  it('matches each Statistics lesson to its own mathematics, not one shared kind', () => {
    const byId = (frag: string) => declaredFamilies(C11_STA_SECTIONS.find((s) => s.contentArtifactId.includes(frag))!);
    expect(byId('md_median')).toContain('table:deviation');
    expect(byId('grouped_variance')).toContain('table:grouped');
    expect(byId('shortcut')).toContain('table:method_comparison');
    // Not all seven consume the same visual kind.
    const kinds = new Set(C11_STA_SECTIONS.flatMap((s) => s.visuals.map((v) => (v as { type: string }).type)));
    expect(kinds.size).toBeGreaterThan(1);
  });
});
