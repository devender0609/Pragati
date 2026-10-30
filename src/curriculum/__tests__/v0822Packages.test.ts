// v0.82.2 §16/§17 — CHAPTER-SCOPED PACKAGE EMISSION AND ITS GUARDS.
//
// Running with PRAGATI_EMIT_DOCS=1 writes the packages; running without
// it verifies what is on disk. So the reviewer-facing files cannot be
// claimed to exist without existing, which is §15's whole point: if the
// system says "review ready", a reviewer must be able to open a file.

import { describe, it, expect } from 'vitest';
import { writeFileSync, mkdirSync, readFileSync, existsSync } from 'node:fs';
import {
  sectionsNeedingPackages,
  sectionPackageMarkdown,
  sectionReviewRecord,
  sectionReviewCode,
  sectionFingerprint,
} from '../sectionReviewPackages';
import {
  FRACTIONS_CHAPTER_ID,
  NUMBER_PLAY_CHAPTER_ID,
} from '../authoredSections';

const CHAPTERS = [
  { id: FRACTIONS_CHAPTER_ID, out: 'PRAGATI_CHAPTER_7_REVIEW_PACKAGES' },
  { id: NUMBER_PLAY_CHAPTER_ID, out: 'PRAGATI_CHAPTER_3_REVIEW_PACKAGES' },
];

const url = (rel: string) => new URL(`../../../${rel}`, import.meta.url);
const fileFor = (id: string) =>
  `SECTION_${id.split('_s').pop()!.replace('_', '_')}_FOR_REVIEWER.md`;

if (process.env.PRAGATI_EMIT_DOCS) {
  for (const ch of CHAPTERS) {
    const ids = sectionsNeedingPackages(ch.id);
    if (ids.length === 0) continue;
    mkdirSync(url(ch.out), { recursive: true });
    const index = ids.map((id) => {
      writeFileSync(url(`${ch.out}/${fileFor(id)}`), sectionPackageMarkdown(id));
      const rec = sectionReviewRecord(id);
      return {
        section: id,
        file: fileFor(id),
        code: sectionReviewCode(id),
        artifactVersion: rec.contentArtifactVersion,
        fingerprint: sectionFingerprint(id),
      };
    });
    writeFileSync(
      url(`${ch.out}/index.json`),
      JSON.stringify({ chapter: ch.id, generated: 'v0.82.2', packages: index }, null, 2)
    );
  }
}

describe('§16 Chapter 3 has real reviewer-facing files', () => {
  it('emits one package per eligible Number Play section', () => {
    const ids = sectionsNeedingPackages(NUMBER_PLAY_CHAPTER_ID);
    expect(ids.length).toBe(3);
    for (const id of ids) {
      const f = url(`PRAGATI_CHAPTER_3_REVIEW_PACKAGES/${fileFor(id)}`);
      expect(existsSync(f), String(f)).toBe(true);
    }
  });

  it('keeps the two chapters in separate folders', () => {
    // A Number Play file in the Fractions folder would be found by a
    // reviewer who was told they were reading Chapter 7.
    for (const id of sectionsNeedingPackages(NUMBER_PLAY_CHAPTER_ID)) {
      expect(
        existsSync(url(`PRAGATI_CHAPTER_7_REVIEW_PACKAGES/${fileFor(id)}`)),
        id
      ).toBe(false);
    }
  });
});

describe('§10-§12 no Fractions prose leaks into a Number Play package', () => {
  const np = () =>
    sectionsNeedingPackages(NUMBER_PLAY_CHAPTER_ID).map((id) =>
      readFileSync(url(`PRAGATI_CHAPTER_3_REVIEW_PACKAGES/${fileFor(id)}`), 'utf8')
    );

  it('names its own chapter', () => {
    for (const md of np()) {
      expect(md).toMatch(/Chapter 3, Number Play/);
      expect(md).not.toMatch(/Class 6 fractions chapter/i);
    }
  });

  it('does not carry the Fractions shaded-pieces review note', () => {
    // That obligation is about v0.77.2 paraphrases in Fractions
    // lessons. Number Play has none, so asking about it would send a
    // reviewer looking for text that does not exist.
    for (const md of np()) {
      expect(md).not.toMatch(/count just the shaded pieces/i);
    }
  });

  it('surfaces each section’s real enrichment instead', () => {
    const [s31, s32, s33] = np();
    expect(s31).toMatch(/plants of stated heights/i);
    expect(s32).toMatch(/tie case/i);
    expect(s33).toMatch(/86,000/);
  });

  it('special-cases no section as "the first reviewer"', () => {
    for (const md of np()) expect(md).not.toMatch(/the first reviewer/i);
  });
});

describe('§13 packages carry the real artifact version', () => {
  it('reports §3.1 at version 2, because it was replaced', () => {
    expect(sectionReviewRecord('ncert_gp_c6_s3_1').contentArtifactVersion).toBe(2);
    expect(sectionReviewRecord('ncert_gp_c6_s3_2').contentArtifactVersion).toBe(1);
  });

  it('keeps Fractions sections at their own version', () => {
    for (const id of sectionsNeedingPackages(FRACTIONS_CHAPTER_ID)) {
      expect(sectionReviewRecord(id).contentArtifactVersion).toBe(1);
    }
  });
});

describe('§8 alignment gates packaging', () => {
  it('packages only sections that are complete AND aligned', () => {
    // Both gates, not one. A structurally complete but misaligned
    // section wastes the scarcest thing in the project: an educator's
    // afternoon.
    const ids = sectionsNeedingPackages(NUMBER_PLAY_CHAPTER_ID);
    expect(ids).toEqual([
      'ncert_gp_c6_s3_1',
      'ncert_gp_c6_s3_2',
      'ncert_gp_c6_s3_3',
    ]);
  });

  it('never regenerates the frozen §7.4 package', () => {
    expect(sectionsNeedingPackages()).not.toContain('ncert_gp_c6_s7_4');
  });
});
