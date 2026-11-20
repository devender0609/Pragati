// ---------------------------------------------------------------------------
// v0.84.0-review.2 checkpoint 49 — THE AI PRE-REVIEW RECOMPUTATION.
//
// This is QA, not review. It is Claude checking Claude-authored material, and
// it does not substitute for a person.
//
// What it does do is refuse to take any authored number on trust. Every
// complete "<expression> = <value>" claim in all 92 lessons is evaluated;
// every dataset total and normalised share is recomputed; every gcd the
// algorithms chapter states is recomputed. Kept as a test so a future edit
// that breaks a computation fails here rather than reaching a student.
// ---------------------------------------------------------------------------

import { describe, expect, it } from 'vitest';
import { allAuthoredSections } from '../authoredSections';
import { artifactSourceKind } from '../authoredSection';
import { categoryTotals, normalisedValues } from '../dataDisplaySpecification';
import { gcd } from '../algorithmAudit';

const C9 = allAuthoredSections().filter((s) => s.source.officialChapterId.startsWith('ncert_iemh'));

/**
 * Evaluate an arithmetic expression in Pragati's prose conventions.
 *
 * The first version of this harness matched FRAGMENTS of longer expressions
 * and produced 31 false blockers — every one of which was correct
 * mathematics ("4 + 5 + 6 = 15" read as "5 + 6 = 15"). It only earns its
 * place by evaluating complete expressions.
 */
export function evalExpr(raw: string): number | null {
  const e = raw
    .replace(/\u2212|\u2013|\u2014/g, '-')
    .replace(/\u00d7|\btimes\b/g, '*')
    .replace(/\u00f7|\bdivided by\b/g, '/')
    .replace(/\bplus\b/g, '+')
    .replace(/\bminus\b/g, '-')
    .replace(/\bsquared\b/g, '**2')
    .replace(/\bcubed\b/g, '**3')
    .replace(/[,\s]+/g, ' ')
    .trim();
  if (!/^[-+*/(). \d]+(\*\*\d)?[-+*/(). \d]*$/.test(e.replace(/\*\*\d/g, ''))) return null;
  if (!/\d/.test(e)) return null;
  try {
    const v = Function(`"use strict";return (${e})`)() as unknown;
    return typeof v === 'number' && Number.isFinite(v) ? v : null;
  } catch {
    return null;
  }
}

const EQUALITY =
  /(?:^|[:,;\u2014(]|\bis\b|\bare\b|\bgives\b|\bbecomes\b)\s*((?:\d[\d.]*|\()(?:\s*(?:[-+*/]|\u00d7|\u00f7|\u2212|times|plus|minus|divided by|squared|cubed)\s*(?:\d[\d.]*|\(|\)))+\s*\)?)\s*(?:=|\bis\b)\s*(-?\d[\d.]*)(?![\d.]|\s*[/+*\u00d7\u00f7]|\s*-\s*\d)/gi;

function lessonText(s: (typeof C9)[number]): Array<[string, string]> {
  return [
    ['explanation', s.explanation.join(' ')],
    ['summary', s.summary],
    ...s.workedExamples.map((w): [string, string] => [
      `worked ${w.id}`,
      [w.prompt, ...w.steps.map((x) => `${x.text} ${x.reasoning}`), w.answer].join(' '),
    ]),
    ...s.guidedPractice.map((g): [string, string] => [`guided ${g.id}`, `${g.prompt} ${g.answer} ${g.rationale}`]),
    ...s.independentPractice.map((p): [string, string] => [`independent ${p.id}`, `${p.prompt} ${p.answer} ${p.rationale}`]),
  ];
}

describe('AI pre-review: recomputation across all 92 Class 9 lessons', () => {
  it('reviews every artifact, not a sample', () => {
    expect(C9.length).toBe(92);
  });

  it('evaluates every stated computation and finds none false', () => {
    const failures: string[] = [];
    let evaluated = 0;
    for (const s of C9) {
      for (const [where, text] of lessonText(s)) {
        for (const m of text.matchAll(EQUALITY)) {
          const lhs = evalExpr(m[1]);
          const rhs = Number(m[2]);
          if (lhs === null || !Number.isFinite(rhs)) continue;
          evaluated += 1;
          const tol = Math.max(1e-6, Math.abs(rhs) * 2e-3);
          if (Math.abs(lhs - rhs) > tol) {
            failures.push(`${s.contentArtifactId} ${where}: "${m[1].trim()} = ${m[2]}" is ${lhs}`);
          }
        }
      }
    }
    // The harness must actually be testing something.
    expect(evaluated).toBeGreaterThan(40);
    expect(failures).toEqual([]);
  });

  it('recomputes every dataset total and normalised share', () => {
    const failures: string[] = [];
    let datasets = 0;
    for (const s of C9) {
      for (const [, data] of Object.entries(s.dataSets ?? {})) {
        datasets += 1;
        const totals = categoryTotals(data);
        const norm = normalisedValues(data);
        data.categories.forEach((cat, ci) => {
          const share = norm.reduce((t, row) => t + row[ci], 0);
          if (Math.abs(share - 100) > 1e-9) failures.push(`${s.contentArtifactId} ${cat}: shares total ${share}`);
          const raw = data.series.reduce((t, ser) => t + (ser.values[ci] ?? 0), 0);
          if (raw !== totals[ci]) failures.push(`${s.contentArtifactId} ${cat}: total disagrees with its series`);
        });
      }
    }
    expect(datasets).toBeGreaterThan(0);
    expect(failures).toEqual([]);
  });

  it('recomputes every gcd the algorithms chapter states', () => {
    const failures: string[] = [];
    let claims = 0;
    for (const s of C9.filter((x) => x.source.officialChapterId === 'ncert_iemh2_ch11')) {
      const text = lessonText(s).map(([, t]) => t).join(' ');
      for (const m of text.matchAll(/gcd\s*\(?\s*(\d+)\s*(?:,|and)\s*(\d+)\s*\)?\s*(?:=|is)\s*(\d+)/gi)) {
        claims += 1;
        const [a, b, r] = [Number(m[1]), Number(m[2]), Number(m[3])];
        if (gcd(a, b) !== r) failures.push(`${s.contentArtifactId}: ${m[0]} but gcd is ${gcd(a, b)}`);
      }
    }
    expect(claims).toBeGreaterThan(0);
    expect(failures).toEqual([]);
  });

  it('finds no probability outside [0,1] asserted as a result', () => {
    const failures: string[] = [];
    for (const s of C9.filter((x) => x.source.officialChapterId === 'ncert_iemh1_ch07')) {
      const text = lessonText(s).map(([, t]) => t).join(' ');
      for (const m of text.matchAll(/probability[^.]{0,60}?\bis\s+(\d+)\s*\/\s*(\d+)/gi)) {
        const [n, d] = [Number(m[1]), Number(m[2])];
        if (d === 0 || n > d) failures.push(`${s.contentArtifactId}: ${m[0]}`);
      }
    }
    expect(failures).toEqual([]);
  });

  it('finds no figure referencing a point that does not exist', () => {
    const failures: string[] = [];
    for (const s of C9) {
      for (const v of s.visuals ?? []) {
        const g = v as unknown as { points?: Array<{ id: string }>; segments?: Array<{ from: string; to: string }> };
        const ids = new Set((g.points ?? []).map((p) => p.id));
        for (const seg of g.segments ?? []) {
          if (!ids.has(seg.from) || !ids.has(seg.to)) failures.push(`${s.contentArtifactId}: dangling segment`);
        }
      }
    }
    expect(failures).toEqual([]);
  });

  it('finds no practice item without an answer, rationale or hint', () => {
    const failures: string[] = [];
    for (const s of C9) {
      for (const p of s.independentPractice) {
        if (!p.answer.trim()) failures.push(`${s.contentArtifactId} ${p.id}: no answer`);
        if (!p.rationale.trim()) failures.push(`${s.contentArtifactId} ${p.id}: no rationale`);
      }
      for (const g of s.guidedPractice) {
        if (!g.hint.trim()) failures.push(`${s.contentArtifactId} ${g.id}: no hint`);
        if (!g.rationale.trim()) failures.push(`${s.contentArtifactId} ${g.id}: no rationale`);
      }
    }
    expect(failures).toEqual([]);
  });

  it('finds no segment-backed lesson printing a fabricated section number', () => {
    const segmentBacked = C9.filter((s) => artifactSourceKind(s.source) === 'source_segment');
    expect(segmentBacked.length).toBe(2);
    for (const s of segmentBacked) {
      expect([...s.explanation, s.summary].join(' ')).not.toMatch(/\u00a79\.\d/);
    }
  });

  it('records the 15 accepted vocabulary findings, so they cannot drift unnoticed', () => {
    // MINOR, consciously accepted: each lesson defines a term it then teaches
    // under a synonym. The correction is NOT unambiguous — remove the entry,
    // or rewrite the prose — so it is a decision for a human reviewer, not a
    // silent edit. The count is pinned so a regression is visible.
    const unused: string[] = [];
    for (const s of C9) {
      const whole = [
        ...s.explanation, s.summary, s.nextStep,
        ...s.workedExamples.flatMap((w) => [w.prompt, w.answer, ...w.steps.map((x) => `${x.text} ${x.reasoning}`)]),
        ...s.guidedPractice.flatMap((g) => [g.prompt, g.answer, g.rationale, g.hint]),
        ...s.independentPractice.flatMap((p) => [p.prompt, p.answer, p.rationale]),
        ...s.reasoningApplication.flatMap((r) => [r.prompt, r.expectedReasoning ?? '']),
      ].join(' ').toLowerCase();
      for (const v of s.vocabulary ?? []) {
        const t = v.term.toLowerCase();
        const head = t.split(' ').slice(-1)[0];
        if (!whole.includes(t) && !whole.includes(head)) unused.push(`${s.contentArtifactId}:${v.term}`);
      }
    }
    expect(unused.length).toBe(15);
  });
});
