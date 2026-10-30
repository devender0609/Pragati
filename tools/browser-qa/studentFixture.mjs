// ===========================================================================
// v0.84.0-c11.11 checkpoint 82 — REUSABLE CLASS-11 BROWSER QA FIXTURE.
//
// WHY THIS EXISTS
//
// Three checkpoints in a row ended with the browser gate unrun because each
// one wrote its own ad hoc seeding script, and each got the student contract
// slightly wrong in a way that failed SILENTLY — the app simply fell back to
// Class 6 and the harness walked a welcome screen while reporting stages.
//
// WHAT THE PRODUCT ACTUALLY REQUIRES (read from source, not assumed)
//
//   pragati.students.v1   Student[]. App.tsx resolves the active student as
//                         the selected one or `students[0]`, and Learn only
//                         opens when `normalizeGrade(active.grade)` is
//                         truthy. THIS is the grade authority.
//   pragati.app_mode.v1   AppMode. Must be student mode.
//   pragati.onboarding.v1 { completed: true } so the 4-step wizard does not
//                         stand between the harness and the app.
//
// `pragati.selected_grade.v1` is NOT the authority. It belongs to the legacy
// Class 6 dashboard and the assessment picker. Seeding it does nothing for
// authored Learn, and a regression test asserts exactly that.
//
// THE RULE THAT WAS BROKEN BEFORE
//
// localStorage cannot be touched before the page has a real origin — doing so
// on about:blank throws SecurityError. So: navigate FIRST, seed, then reload
// so React re-initialises from storage. State already read into a hook will
// not notice an out-of-band write.
// ===========================================================================

export const STORAGE_KEYS = {
  students: 'pragati.students.v1',
  appMode: 'pragati.app_mode.v1',
  onboarding: 'pragati.onboarding.v1',
  sessions: 'pragati.sessions.v1',
  /** Deliberately listed so its NON-role is documented, not used. */
  legacySelectedGrade: 'pragati.selected_grade.v1',
};

/** A canonical Class 11 student in the real persisted schema. */
export function class11Student(overrides = {}) {
  return {
    id: 'browser-qa-class11',
    name: 'QA Student',
    grade: 'class11',
    createdAt: 1_700_000_000_000,
    ...overrides,
  };
}

/**
 * Seed a student and enter the product as them.
 *
 * Fails loudly rather than letting the run continue in the wrong grade,
 * which is the specific failure mode that cost three checkpoints.
 */
export async function seedStudentForBrowserQa(page, {
  origin = 'http://localhost:4173/',
  student = class11Student(),
  expectGradeLabel = /CLASS 11/i,
} = {}) {
  // 1. Establish the origin. Nothing may touch storage before this.
  await page.goto(origin, { waitUntil: 'networkidle2' });

  // 2 and 3. Clear only the fixture state this harness owns, then seed.
  const seeded = await page.evaluate((keys, rec) => {
    try {
      for (const k of [keys.students, keys.sessions, keys.appMode, keys.onboarding]) {
        localStorage.removeItem(k);
      }
      localStorage.setItem(keys.students, JSON.stringify([rec]));
      localStorage.setItem(keys.appMode, JSON.stringify('student'));
      localStorage.setItem(keys.onboarding, JSON.stringify({ completed: true, completedAt: Date.now() }));
      return { ok: true };
    } catch (e) {
      return { ok: false, error: String(e && e.message) };
    }
  }, STORAGE_KEYS, student);
  if (!seeded.ok) throw new Error(`fixture could not write storage: ${seeded.error}`);

  // 4 and 5. Reload so the app initialises from the seeded record.
  await page.goto(origin, { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 500));

  // 6. Enter Learn by the real student route.
  await clickByText(page, 'Learn');
  await new Promise((r) => setTimeout(r, 500));

  // The post-seed assertion: a PRODUCT-VISIBLE consequence, not a storage read.
  const text = await page.evaluate(() => document.body.innerText);
  if (/CLASS 6 MATHEMATICS/i.test(text) && !expectGradeLabel.test(text)) {
    throw new Error(
      'fixture landed in Class 6: the seeded student did not become the active student. ' +
      'Check the Student schema and normalizeGrade before trusting any later result.'
    );
  }
  if (!expectGradeLabel.test(text)) {
    throw new Error(
      `fixture could not confirm the expected grade in the rendered product. Saw: ${text.slice(0, 160).replace(/\n/g, ' | ')}`
    );
  }
  return { student, confirmedBy: (text.match(/CLASS \d+ MATHEMATICS/i) || [''])[0] };
}

/** Click the first visible control whose text matches, exactly then loosely. */
export async function clickByText(page, label, settle = 420) {
  const ok = await page.evaluate((txt) => {
    const nodes = [...document.querySelectorAll('button,a,[role=button]')].filter((e) => {
      const r = e.getBoundingClientRect();
      return r.width > 0 && r.height > 0;
    });
    const el = nodes.find((e) => (e.innerText || '').trim() === txt)
      || nodes.find((e) => (e.innerText || '').trim().toLowerCase().includes(txt.toLowerCase()));
    if (!el) return false;
    el.click();
    return true;
  }, label);
  await new Promise((r) => setTimeout(r, settle));
  return ok;
}
