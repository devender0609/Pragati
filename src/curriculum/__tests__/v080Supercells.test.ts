// v0.80 §A/§B — THE NUMBER GRID, AND §3.2 SUPERCELLS.
//
// v0.79 could not author §3.2: a supercell is a cell larger than every
// one of its NEIGHBOURS, and adjacency cannot be stated in a number
// line, a strip or an area model.
//
// The spec deliberately does not store which cells are supercells. It
// stores the numbers and the neighbour rule, and `supercellsFor()`
// derives the rest — so a caption and a grid cannot drift apart, which
// is the failure the fraction-strip schema was rewritten in v0.61 to
// eliminate.

import { describe, it, expect } from 'vitest';
import {
  supercellsFor,
  validateVisual,
  type NumberGridSpec,
} from '../visualSpecification';
import { SECTION_3_2 } from '../numberPlaySections';
import { validateAuthoredSection } from '../sectionValidators';
import { sectionsForChapter } from '../officialSections';

const grid = (
  rows: number[][],
  neighbourhood: NumberGridSpec['neighbourhood'] = 'horizontal',
  assertsSupercellsAt?: Array<[number, number]>
): NumberGridSpec => ({
  type: 'number_grid',
  purpose: 'reveal_structure',
  status: 'concept_specific',
  neighbourhood,
  rows: rows.map((r) => r.map((value) => ({ value }))),
  assertsSupercellsAt,
  caption: 'c',
  altText: 'a',
});

describe('§A the supercell rule is computed, never declared', () => {
  it('requires strictly greater than EVERY neighbour', () => {
    expect(supercellsFor(grid([[626, 4188, 5353, 2126, 1552, 1555]]))).toEqual([
      [0, 2],
      [0, 5],
    ]);
  });

  it('gives no supercell on a tie', () => {
    // Equal is not larger. This is the case an author is likeliest to
    // get wrong by eye, which is why it is computed.
    expect(supercellsFor(grid([[340, 910, 910, 275]]))).toEqual([]);
  });

  it('lets an end cell qualify — fewer neighbours, same rule', () => {
    expect(supercellsFor(grid([[9, 4]]))).toEqual([[0, 0]]);
  });

  it('never returns two adjacent supercells', () => {
    // Each would have to be larger than the other.
    const found = supercellsFor(grid([[2, 6, 1, 5, 3, 4]]));
    for (let i = 1; i < found.length; i += 1) {
      expect(found[i][1] - found[i - 1][1]).toBeGreaterThan(1);
    }
  });

  it('changes answer when the neighbour rule changes', () => {
    const rows = [
      [210, 640, 155],
      [480, 905, 320],
      [175, 260, 118],
    ];
    const orth = supercellsFor(grid(rows, 'orthogonal'));
    const horiz = supercellsFor(grid(rows, 'horizontal'));
    expect(orth).toEqual([[1, 1]]);
    // Row-wise, each row has its own peak — a different answer from the
    // same numbers, which is exactly why the rule must be declared.
    expect(horiz.length).toBeGreaterThan(orth.length);
  });
});

describe('§A validation catches a caption that disagrees with the grid', () => {
  it('rejects a wrong supercell claim', () => {
    const bad = grid([[340, 910, 910, 275]], 'horizontal', [[0, 1]]);
    expect(validateVisual(bad).join(' ')).toMatch(/do not match the grid/);
  });

  it('accepts a correct one', () => {
    expect(validateVisual(grid([[9, 4]], 'horizontal', [[0, 0]]))).toEqual([]);
  });

  it('rejects a ragged grid', () => {
    const ragged: NumberGridSpec = {
      ...grid([[1, 2]]),
      rows: [[{ value: 1 }, { value: 2 }], [{ value: 3 }]],
    };
    expect(validateVisual(ragged).join(' ')).toMatch(/expected 2/);
  });
});

describe('§B §3.2 is authored against the verified source', () => {
  it('matches the registry identity exactly', () => {
    const reg = sectionsForChapter('ncert_gp_c6_ch03_number_play').find(
      (s) => s.officialSectionId === 'ncert_gp_c6_s3_2'
    )!;
    expect(SECTION_3_2.source.exactTitle).toBe(reg.exactTitle);
    expect(SECTION_3_2.source.startPage).toBe(reg.startPage);
  });

  it('passes the authored-section validator, visuals included', () => {
    expect(validateAuthoredSection(SECTION_3_2)).toEqual([]);
  });

  it('teaches the tie case explicitly', () => {
    const prose = SECTION_3_2.explanation.join(' ').toLowerCase();
    expect(prose).toMatch(/equal/);
    expect(SECTION_3_2.misconceptionIds).toContain('tie_counts_as_larger');
  });

  it('declares the neighbour rule on every grid it shows', () => {
    for (const v of SECTION_3_2.visuals) {
      expect(v.type).toBe('number_grid');
      expect((v as NumberGridSpec).neighbourhood).toBeTruthy();
    }
  });

  it('introduces nothing owned by a later section', () => {
    const prose = SECTION_3_2.explanation.join(' ').toLowerCase();
    expect(prose).not.toMatch(/number line|place value|digit sum/);
  });

  it('stays an unreviewed draft', () => {
    expect(SECTION_3_2.reviewStatus).toBe('authored_draft');
  });
});
