// v0.83.3 §5/§6 — the expectation the browser QA compares against, taken
// from the app's own canonical registries rather than typed by hand.
import { writeFileSync, mkdirSync } from 'fs';
const s = await import('../src/features/student/StudentShell.tsx');
const c6 = await import('../src/curriculum/studentChapterModel.ts');

// Class 6's Learn view is a different component with a different
// question: `availability === 'available'` means the LESSON can be
// opened, while `canLaunch` on the generic row means practice exists.
// The expectation must use the one the screen uses, or QA compares the
// screen against a rule it never applied.
const c6Availability = new Map(
  c6.class6ChapterCards().map((c) => [c.title, c.availability === 'available'])
);
const out = {};
for (let n = 1; n <= 12; n++) {
  const g = `class${n}`;
  const rows = s.chaptersForStudentGrade(g).filter((r) => r.official);
  out[g] = {
    chapters: rows.map((r) => ({
      id: r.chapterId,
      title: r.title,
      bookPart: r.bookPart ?? null,
      available:
        g === 'class6'
          ? c6Availability.get(r.title) === true
          : r.canLaunch === true,
      hasTeacherResource: r.inventory.status !== 'no_content',
    })),
  };
}
mkdirSync('qa-results', { recursive: true });
writeFileSync('qa-results/expected-curriculum.json', JSON.stringify(out, null, 2));
console.log(Object.entries(out).map(([k, v]) => `${k}:${v.chapters.length}`).join(' '));
