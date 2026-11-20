// ===========================================================================
// v0.84.0-c11.35 checkpoint 93G — THE REPRESENTATION CONTRACT.
//
// The permanent fix for a failure class that has now cost three
// checkpoints: a lesson declares a first-class representation — a Venn
// diagram, a function graph, a proof layout, an indexed sequence, a
// deviation table — and ships with no visual at all. Every instance was
// caught by a browser, late, or by a person noticing. None was caught by a
// test.
//
// This is not Statistics-specific. It maps a declared representation
// FAMILY to the visual kinds that can satisfy it, and asserts that a
// lesson requiring one actually consumes a compatible visual.
//
// Compatibility, not string equality: a frequency-table requirement is
// satisfied by a grouped table OR a deviation table, because both put the
// same mathematics in front of the student.
// ===========================================================================

import type { AuthoredSection } from './authoredSection';

/** The families a lesson can require. Small by design. */
export type RepresentationFamily =
  | 'table:data' | 'table:deviation' | 'table:grouped' | 'table:method_comparison'
  | 'venn' | 'graph:function' | 'proof' | 'sequence:indexed'
  // v0.84.0-c11.39 checkpoint 96 — inequality regions.
  | 'region:number_line' | 'region:half_plane'
  // v0.84.0-c11.42 checkpoint 97 — one family covers axes, points and
  // distance figures: all three are the same kind of coordinate diagram,
  // and compatibility is the rule rather than string equality.
  | 'coordinate:3d'
  // v0.84.0-c11.51 checkpoint 101C — a finite special sum shown as sigma
  // notation beside its expansion, closed form and exact total. One family
  // identity, declared here and in the lesson type; not two aliases.
  | 'series:sigma'
  // v0.84.0-c11.55 checkpoint 102B — a composite derivative in layers.
  | 'derivative:notation';

/**
 * Which visual kinds satisfy each family. More than one kind may satisfy a
 * family where the mathematics is genuinely the same.
 */
const SATISFIED_BY: Record<RepresentationFamily, string[]> = {
  'table:data': ['deviation_table', 'grouped_table'],
  'table:deviation': ['deviation_table', 'grouped_table'],
  'table:grouped': ['grouped_table'],
  'table:method_comparison': ['method_comparison'],
  venn: ['venn'],
  'graph:function': ['function_graph', 'real_function_graph', 'circular_graph', 'limit_table'],
  proof: ['proof_layout'],
  'sequence:indexed': ['indexed_sequence'],
  'region:number_line': ['number_line_region'],
  'region:half_plane': ['half_plane_region'],
  'coordinate:3d': ['coordinate_3d'],
  // v0.84.0-c11.51 checkpoint 101C — sigma notation shown beside its
  // expansion, closed form and exact total.
  'series:sigma': ['special_sum'],
  'derivative:notation': ['chain_rule'],
};

/**
 * The declared requirement, read from prose only where no structured field
 * exists yet. This is the smallest mapping that avoids free-text matching
 * at the point of judgement: the phrase is normalised ONCE, here, and
 * every check downstream works on the family.
 */
/**
 * What a lesson requires. ONLY the structured field is enforced.
 *
 * The prose fallback below is diagnostic, not a gate: running it over the
 * whole corpus flags 23 older lessons whose representation sentences
 * mention a table or a proof incidentally, which is the free-text
 * over-matching the contract is supposed to avoid. Enforcement therefore
 * reads the declared field, and lessons adopt it as they are revisited.
 */
export function declaredFamilies(section: AuthoredSection): RepresentationFamily[] {
  return (section as { representationFamilies?: RepresentationFamily[] }).representationFamilies ?? [];
}

/** The prose reading, kept for diagnosing which lessons should declare. */
export function inferredFamilies(section: AuthoredSection): RepresentationFamily[] {
  const explicit = declaredFamilies(section);
  if (explicit.length) return explicit;
  const text = ((section as { representations?: string[] }).representations ?? []).join(' ').toLowerCase();
  const out: RepresentationFamily[] = [];
  if (/venn/.test(text)) out.push('venn');
  if (/graph/.test(text)) out.push('graph:function');
  if (/proof/.test(text)) out.push('proof');
  if (/partial sum|indexed sequence/.test(text)) out.push('sequence:indexed');
  if (/step-deviation table|deviation table|table of observations/.test(text)) out.push('table:deviation');
  else if (/grouped table/.test(text)) out.push('table:grouped');
  else if (/\btable\b/.test(text)) out.push('table:data');
  return out;
}

export type ContractResult = { family: RepresentationFamily; satisfied: boolean; found: string[] };

export function checkRepresentationContract(section: AuthoredSection): ContractResult[] {
  const kinds = (section.visuals ?? []).map((v) => (v as { type: string }).type);
  return declaredFamilies(section).map((family) => ({
    family,
    satisfied: kinds.some((k) => SATISFIED_BY[family].includes(k)),
    found: kinds,
  }));
}

/** One line per unmet requirement, naming what was declared and what shipped. */
export function contractProblems(section: AuthoredSection): string[] {
  return checkRepresentationContract(section)
    .filter((r) => !r.satisfied)
    .map((r) => `${section.contentArtifactId} declares ${r.family} but consumes ${r.found.length ? r.found.join(', ') : 'no visual at all'}`);
}
