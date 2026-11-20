/**
 * v0.84.0-c11.51 checkpoint 101C — the three special sums.
 *
 * The oracle NEVER calls `specialSum`. It walks the terms as BigInt, the
 * way a student would, so agreement between the two is evidence rather
 * than a tautology.
 */
import { describe, expect, it } from 'vitest';
import {
  type SpecialSumKind, exactSumOf, exactTermOf, isSum, specialSum,
  specialSumFigure, specialSumSeries, summandOf, sumOf, validateSpecialSum,
  writeClosedForm, writeExpanded,
} from '../sequences';

const KINDS: SpecialSumKind[] = ['natural', 'squares', 'cubes'];
const val = (k: SpecialSumKind, n: number): bigint => {
  const r = specialSum(k, n);
  if (!isSum(r)) throw new Error(r.reason);
  return r.value;
};

describe('the closed forms, against an independent oracle', () => {
  it('agrees with explicit BigInt summation for every kind, n = 1..20', () => {
    for (const kind of KINDS) {
      for (let n = 1; n <= 20; n += 1) {
        const closed = specialSum(kind, n);
        const walked = exactSumOf(specialSumSeries(kind, n), exactTermOf(kind));
        expect(isSum(closed) && isSum(walked), `${kind} n=${n}`).toBe(true);
        expect((closed as { value: bigint }).value, `${kind} n=${n}`)
          .toBe((walked as { value: bigint }).value);
      }
    }
  });

  it('gives the documented totals', () => {
    expect([val('natural', 10), val('squares', 10), val('cubes', 10)])
      .toEqual([55n, 385n, 3025n]);
  });

  it('gives 1 for all three at n = 1', () => {
    // Catches an implementation that assumes the formulas must differ.
    expect(KINDS.map((k) => val(k, 1))).toEqual([1n, 1n, 1n]);
  });
});

describe('the identities that must hold exactly', () => {
  it('has the cube sum equal the SQUARE of the natural sum', () => {
    for (const n of [1, 2, 5, 10, 37, 100]) {
      expect(val('cubes', n), `n=${n}`).toBe(val('natural', n) ** 2n);
    }
  });

  it('is NOT the square of the sum of squares', () => {
    // The characteristic misconception, asserted as a difference.
    for (const n of [5, 10]) expect(val('cubes', n)).not.toBe(val('squares', n) ** 2n);
  });

  it('satisfies 2 x the natural sum = n(n + 1)', () => {
    for (let n = 1; n <= 50; n += 1) {
      expect(2n * val('natural', n), `n=${n}`).toBe(BigInt(n) * BigInt(n + 1));
    }
  });

  it('divides n(n + 1)(2n + 1) by 6 without remainder', () => {
    for (let n = 1; n <= 50; n += 1) {
      const b = BigInt(n);
      expect((b * (b + 1n) * (2n * b + 1n)) % 6n, `n=${n}`).toBe(0n);
    }
  });
});

describe('exactness beyond Number', () => {
  it('keeps a large cube sum exact', () => {
    const big = val('cubes', 10_000_000);
    expect(big).toBe(val('natural', 10_000_000) ** 2n);
    // 28 digits: far past Number.MAX_SAFE_INTEGER, so this cannot have
    // round-tripped through a float.
    expect(big.toString()).toHaveLength(28);
    expect(big > BigInt(Number.MAX_SAFE_INTEGER)).toBe(true);
  });

  it('keeps a square sum exact where Number division would be at risk', () => {
    const n = 100_000;
    const b = BigInt(n);
    expect(val('squares', n)).toBe((b * (b + 1n) * (2n * b + 1n)) / 6n);
  });
});

describe('the domain is the positive whole numbers', () => {
  it('refuses every n outside it, with a reason', () => {
    for (const n of [0, -1, -7, 2.5, 0.1, NaN, Infinity, -Infinity]) {
      const r = specialSum('squares', n);
      expect(isSum(r), `n=${n}`).toBe(false);
      expect((r as { reason: string }).reason.length, `n=${n}`).toBeGreaterThan(10);
    }
  });

  it('refuses a lower bound other than 1, because this model is "the first n"', () => {
    const shifted = { ...specialSumSeries('natural', 5), from: 0 };
    const r = exactSumOf(shifted, exactTermOf('natural'));
    expect(isSum(r)).toBe(false);
    expect((r as { reason: string }).reason).toMatch(/lower bound must be 1/);
  });
});

describe('the special_sum figure', () => {
  const fig = (k: SpecialSumKind, n: number, alt: string) =>
    specialSumFigure(`f_${k}`, k, n, 'caption', alt);
  const goodCube = fig('cubes', 5,
    'The sum from k = 1 to 5 of k cubed, written out, whose closed form is the square of the natural-number sum, giving 225.');

  it('accepts a figure whose parts all derive from the model', () => {
    expect(validateSpecialSum(fig('squares', 5,
      'The sum from k = 1 to 5 of k squared is 1 + 4 + 9 + 16 + 25, closed form 5(5 + 1)(2 x 5 + 1)/6, total 55.'))).toEqual([]);
    expect(validateSpecialSum(goodCube)).toEqual([]);
  });

  it('refuses a result that drifts from the closed form', () => {
    expect(validateSpecialSum({ ...goodCube, result: '226' }))
      .toContainEqual(expect.stringContaining('but the closed form gives 225'));
  });

  it('refuses an expansion that drifts from the sigma it claims', () => {
    expect(validateSpecialSum({ ...goodCube, expanded: '1 + 8 + 27' }))
      .toContainEqual(expect.stringContaining('do not match the sigma'));
  });

  it('refuses a summand belonging to a different kind', () => {
    expect(validateSpecialSum({ ...goodCube, summand: 'k' }).length).toBeGreaterThan(0);
  });

  it('refuses a cube description that hides the square-of-the-sum distinction', () => {
    // A screen reader cannot see superscript position, so the words must
    // carry it. "Square formula" is exactly the ambiguity being refused.
    expect(validateSpecialSum({ ...goodCube, altText: 'The sum of k cubed by the square formula is 225.' }))
      .toContainEqual(expect.stringContaining('square of the natural-number sum'));
  });

  it('refuses a figure with no description at all', () => {
    expect(validateSpecialSum({ ...goodCube, altText: '  ' }))
      .toContainEqual('altText is required');
  });

  it('derives sigma, expansion, closed form and total from one object', () => {
    const f = specialSumFigure('f', 'squares', 5, 'c', goodCube.altText.replace('cubed', 'squared')
      + ' square of the natural-number sum');
    expect(f.sigma).toBe('the sum from k = 1 to 5 of k²');
    expect(f.summand).toBe(summandOf('squares'));
    expect(f.expanded).toBe(writeExpanded(specialSumSeries('squares', 5)));
    expect(f.closedForm).toBe(writeClosedForm('squares', 5));
    expect(f.result).toBe('55');
    // The Number path agrees at this size, which is why it stays fine for
    // the older lessons; the BigInt path is what survives large n.
    expect(String(sumOf(specialSumSeries('squares', 5)))).toBe(f.result);
  });

  it('refuses to draw a sum that does not exist', () => {
    expect(() => specialSumFigure('f', 'natural', 0, 'c', 'a')).toThrow(/at least one term/);
  });
});

describe('the authored FO-8 figures', () => {
  it('carry the cube identity in the data itself', async () => {
    const m = await import('../sequencesClass11Sections');
    expect(m.V_NATURAL.result).toBe('21');
    expect(m.V_SQUARES.result).toBe('91');
    expect(m.V_CUBES.result).toBe('441');
    // 441 = 21², demonstrated by the authored values, not only in a test.
    expect(BigInt(m.V_CUBES.result)).toBe(BigInt(m.V_NATURAL.result) ** 2n);
    for (const f of [m.V_NATURAL, m.V_SQUARES, m.V_CUBES]) {
      expect(validateSpecialSum(f), f.id).toEqual([]);
    }
  });
});
