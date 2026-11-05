// ---------------------------------------------------------------------------
// v0.84.0-c11.13b checkpoint 84B — NO RUNTIME VALUE REACHES A STUDENT.
//
// Three checkpoints have now leaked an implementation value into lesson prose:
// a `null` at 81, and ten booleans at 84 plus one survivor found here. Each
// time the leak was a model call interpolated into a template string with no
// formatter between it and the reader.
//
// So this guard works on the SOURCE rather than on the rendered text. Scanning
// rendered prose for the word "true" cannot distinguish a leaked boolean from
// the ordinary English of "and that remains true", which is a sentence a
// lesson is entitled to contain. Scanning for a predicate interpolated bare
// catches exactly the defect and nothing else.
// ---------------------------------------------------------------------------

import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const CURRICULUM = path.join(__dirname, '..');

/**
 * The Class 11 lesson modules whose prose a student reads.
 *
 * v0.84.0-c11.15 checkpoint 85 — discovered rather than listed. A hardcoded
 * list silently stops covering the newest chapter, which is the same shape of
 * omission that let the Venn renderer go five checkpoints unnoticed. The
 * count is asserted below, so a chapter cannot be added without the guard
 * seeing it.
 */
const LESSON_MODULES = fs.readdirSync(CURRICULUM)
  .filter((f) => /Class11Sections\.ts$/.test(f))
  .sort();

/**
 * Predicates and partial functions whose raw result must never be written
 * straight into prose. Each either returns a boolean or can return null.
 */
const UNFORMATTED = [
  'sameLine', 'areParallel', 'arePerpendicular', 'pointIsOn', 'slopeMatchesInclination',
  'inclinationIsExact', 'setsEqual', 'isSubset', 'isProperSubset', 'isMember',
  'tuplesEqual', 'productsEqual', 'isManyToOne', 'rangeIsProperSubsetOfCodomain',
  'compositionsAgree', 'complexEqual', 'isZero', 'polarRoundTrips', 'rootsAreConjugates',
  'writtenRootsArePair', 'onUnitCircle', 'pythagoreanHolds', 'periodHolds',
  'deMorganUnionHolds', 'deMorganIntersectionHolds', 'countingRelationHolds',
  'solutionFamilyChecks', 'inDomain', 'evaluate',
  'isCoterminal', 'sameAngle', 'onUnitCircle', 'polarRoundTrips', 'rootsAreConjugates',
];

const read = (f: string) => fs.readFileSync(path.join(CURRICULUM, f), 'utf8');

describe('no unformatted model value reaches lesson prose', () => {
  it('interpolates no bare predicate into a template string', () => {
    const offences: string[] = [];
    for (const file of LESSON_MODULES) {
      const src = read(file);
      for (const name of UNFORMATTED) {
        // `${name(...)}` with nothing wrapping it. A call nested inside
        // another call — confirms(sameLine(...), 'yes', 'no') — does not match,
        // because the interpolation then opens with the wrapper's name.
        // A leading `!` is still bare: `${!agrees(...)}` renders "true".
        const bare = new RegExp(`\\$\\{\\s*!?\\s*${name}\\s*\\(`, 'g');
        for (const m of src.matchAll(bare)) {
          const at = src.slice(Math.max(0, m.index - 60), m.index + 80).replace(/\n/g, ' ');
          offences.push(`${file}: ${name} interpolated bare — ...${at}...`);
        }
      }
    }
    expect(offences, offences.join('\n')).toEqual([]);
  });

  it('renders no literal boolean, null or NaN in any authored string', async () => {
    // The rendered check, kept narrow: a value leak shows up attached to a
    // colon or as a standalone token, not inside ordinary sentences.
    const { allAuthoredSections } = await import('../authoredSections');
    // Every Class 11 lesson a student can read, including the CBSE-only
    // prerequisite, which has no textbook chapter but plenty of prose.
    const class11 = allAuthoredSections().filter(
      (s) => s.source.officialChapterId.startsWith('ncert_kemh')
        || s.source.officialChapterId.startsWith('cbse_c11')
    );
    expect(class11.length).toBe(52);
    const leaks: string[] = [];
    for (const s of class11) {
      // Only the strings a student reads. Serialising the whole artifact
      // would scan its own JSON structure, which is not prose.
      const text = [
        s.learningGoal, s.summary, ...s.explanation,
        ...s.vocabulary.map((v) => `${v.term} ${v.meaning}`),
        ...s.workedExamples.flatMap((w) => [w.prompt, w.answer,
          ...w.steps.map((x) => `${x.text} ${x.reasoning}`)]),
        ...s.guidedPractice.map((g) => `${g.prompt} ${g.hint} ${g.answer} ${g.rationale}`),
        ...s.independentPractice.map((q) => `${q.prompt} ${q.answer} ${q.rationale}`),
        ...s.reasoningApplication.map((r) => `${r.prompt} ${r.expectedReasoning}`),
      ].join(' \n ');
      for (const pattern of [
        /:\s*(?:true|false|null|undefined|NaN|Infinity)\b/,
        /\bis\s(?:NaN|Infinity)\b/,
        /\[object [A-Z]/,
        /\{"[a-z]+":/,
      ]) {
        const m = text.match(pattern);
        if (m) leaks.push(`${s.contentArtifactId}: ${m[0]}`);
      }
    }
    expect(leaks, leaks.join('\n')).toEqual([]);
  });

  it('leaks no internal identifier into rendered prose', async () => {
    const { allAuthoredSections } = await import('../authoredSections');
    const class11 = allAuthoredSections()
      .filter((s) => s.source.officialChapterId.startsWith('ncert_kemh'));
    for (const s of class11) {
      const prose = [
        ...s.explanation, s.summary, s.learningGoal,
        ...s.workedExamples.flatMap((w) => [w.prompt, w.answer]),
      ].join(' ');
      expect(prose, s.contentArtifactId).not.toMatch(/ncert_kemh1_s\d|contentArtifactId|L_[A-Z]{2,}/);
    }
  });
});

describe('the guard covers every authored Class 11 chapter', () => {
  it('discovers one lesson module per registered chapter', () => {
    // Sets, Relations, Trigonometry, Complex Numbers, Straight Lines, Conics.
    expect(LESSON_MODULES).toHaveLength(8);
    expect(LESSON_MODULES).toContain('conicClass11Sections.ts');
    // v0.84.0-c11.17 — Chapter 12 discovered automatically, not listed.
    expect(LESSON_MODULES).toContain('limitsClass11Sections.ts');
    // v0.84.0-c11.19 — the CBSE-only prerequisite is scanned too.
    expect(LESSON_MODULES).toContain('inductionClass11Sections.ts');
  });
});
