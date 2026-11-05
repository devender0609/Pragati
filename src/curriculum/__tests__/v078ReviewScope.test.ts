// v0.78 §14 — THE OVERDUE ONE.
//
// v0.77.2 added second-person paraphrases of the Fractions
// misconceptions so a student sees "You might count just the shaded
// pieces and write 3" instead of the teacher-facing "Why students do
// this / How to fix it". That wording is presentation copy Pragati
// wrote and no educator has read.
//
// Flagging it for review has slipped for three releases because it is
// small. It is not small in kind: it is student-facing text about how a
// child is getting something wrong, shipped unreviewed. This test also
// EMITS the packages when asked, so the flag cannot be present in the
// generator and absent from the files on disk.
//
// Regenerate:  PRAGATI_EMIT_DOCS=1 npx vitest run v078ReviewScope

import { FRACTIONS_CHAPTER_ID } from '../authoredSections';
import { describe, it, expect } from 'vitest';
import { writeFileSync, readFileSync, existsSync } from 'node:fs';
import {
  sectionsNeedingPackages,
  sectionPackageMarkdown,
} from '../sectionReviewPackages';
import { chapterReviewReadiness } from '../reviewReadiness';

const OUT = 'PRAGATI_CHAPTER_7_REVIEW_PACKAGES';
const fileFor = (id: string) => {
  const n = id.split('_s').pop()!.replace('_', '.');
  return new URL(`../../../${OUT}/SECTION_${n.replace('.', '_')}_FOR_REVIEWER.md`, import.meta.url);
};

// §7.4's package is frozen and is never regenerated.
const ids = sectionsNeedingPackages(FRACTIONS_CHAPTER_ID);

if (process.env.PRAGATI_EMIT_DOCS) {
  for (const id of ids) writeFileSync(fileFor(id), sectionPackageMarkdown(id));
}

describe('§14 the misconception paraphrases are in review scope', () => {
  it('the generator flags them as unreviewed presentation copy', () => {
    expect(ids.length).toBeGreaterThan(0);
    for (const id of ids) {
      const md = sectionPackageMarkdown(id);
      expect(md, id).toMatch(/has\s+not been reviewed by any educator/i);
      expect(md, id).toMatch(/watch out for/i);
    }
  });

  it('does not claim they are approved', () => {
    for (const id of ids) {
      const md = sectionPackageMarkdown(id);
      expect(md, id).not.toMatch(/paraphrases (are|have been) (approved|reviewed)/i);
    }
  });

  it('the packages on disk carry the flag, not just the generator', () => {
    for (const id of ids) {
      const f = fileFor(id);
      expect(existsSync(f), String(f)).toBe(true);
      expect(readFileSync(f, 'utf8'), String(f)).toMatch(
        /has\s+not been reviewed by any educator/i
      );
    }
  });
});

describe('§15 the review counts stay honest', () => {
  it('is still 9 complete drafts, 9 review-ready, none sent', () => {
    const rows = chapterReviewReadiness();
    expect(rows.filter((r) => r.state !== 'not_a_complete_draft').length).toBe(9);
    expect(rows.filter((r) => r.state === 'review_ready').length).toBe(9);
    expect(rows.filter((r) => r.state === 'review_sent').length).toBe(0);
    expect(rows.filter((r) => r.state === 'review_received').length).toBe(0);
  });
});
