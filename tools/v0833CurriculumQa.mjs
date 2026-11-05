// ===========================================================================
// v0.83.2 — 12-CLASS LIVE CURRICULUM QA, STUDENT AND TEACHER.
//
// WHY THIS EXISTS
//
// v0.83.1 passed every model test and shipped a Student screen that
// showed six legacy Pragati modules where Class 3's book has fourteen
// chapters. A test that asks the model what it knows cannot catch that.
// This harness drives the real UI and compares what is on the screen
// with the canonical expected records, by title and by order.
//
// It does not accept "the page loaded" as a result. A class passes only
// if the rendered chapter list matches the book, unavailable chapters
// are visible AND non-launchable, and nothing leaks an internal id.
//
// Output: qa-results/v0832-curriculum-qa.json, one row per
// grade x viewport x surface.
// ===========================================================================

import puppeteer from 'puppeteer';
import fs from 'fs';

const BASE = process.env.PRAGATI_URL ?? 'http://127.0.0.1:4173/';
const WIDTHS = [390, 768, 1440];
const OUT = 'qa-results';
const FILE = 'v0833-curriculum-qa.json';
const wait = (m) => new Promise((r) => setTimeout(r, m));

// The canonical expectation, read from the generated master map rather
// than typed here, so the harness cannot drift from the evidence.
// Expected records come from the app's canonical registry (see
// tools/emitQaExpectations.mjs), so Class 6's accepted registry and the
// derived classes are described the same way.
const expectedFor = (n) => EXPECTED[`class${n}`].chapters;
// v0.83.3 §1/§6 — THERE IS NO EXEMPT CLASS ANY MORE.
//
// v0.83.2 compared curriculum records for [1,2,3,4,5,7,8] only and
// recorded null for Class 6 and Classes 9-12, which still counted as
// PASS. That was not "all twelve classes verified", and this file said
// so in its own JSON. Every class is now compared by title and order,
// including Class 6 (whose chapters come from the accepted registry and
// some of which DO have content) and Classes 9-12 (whose NCERT textbook
// chapters became the browsing hierarchy in v0.83.3).
const DERIVED = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

// Expected availability is read from the app's own content registry via
// the QA fixture the app exposes, not assumed to be "all unavailable".
const EXPECTED = JSON.parse(fs.readFileSync('qa-results/expected-curriculum.json', 'utf8'));

const rows = [];
const ID_LEAK = /ncert_[a-z0-9_]+|cbse_[a-z0-9_]+|official:[a-z0-9_]+|fingerprint|artifactVersion/i;

function record(o) {
  rows.push(o);
  const flag = o.result === 'PASS' ? ' ' : '!';
  console.log(
    `${flag} ${o.surface.padEnd(7)} class${String(o.grade).padEnd(2)} @${o.viewport}  ` +
      `expected ${o.expectedCount ?? '—'} rendered ${o.renderedCount ?? '—'}  ` +
      `${o.result}${o.notes.length ? '  — ' + o.notes.join('; ') : ''}`
  );
}

const visibleButtons = (page) =>
  page.evaluate(() =>
    [...document.querySelectorAll('button')]
      .filter((b) => b.offsetParent !== null)
      .map((b) => (b.textContent || '').trim())
  );

async function clickByText(page, label, { exact = true } = {}) {
  return page.evaluate(
    (t, ex) => {
      const vis = [...document.querySelectorAll('button')].filter((b) => b.offsetParent !== null);
      const b = vis.find((x) => {
        const s = (x.textContent || '').trim();
        return ex ? s === t : s.includes(t);
      });
      if (b) b.click();
      return Boolean(b);
    },
    label,
    exact
  );
}

async function overflow(page) {
  return page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2
  );
}

async function pageText(page) {
  return page.evaluate(() => document.body.innerText);
}

// ---------------------------------------------------------------------------
// STUDENT
// ---------------------------------------------------------------------------

async function studentPass(browser, width) {
  for (let n = 1; n <= 12; n++) {
    const page = await browser.newPage();
    await page.setViewport({ width, height: 900 });
    const notes = [];
    await page.goto(BASE, { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => localStorage.clear());
    await page.evaluate(
      (g) =>
        localStorage.setItem(
          'pragati.students.v1',
          JSON.stringify([
            {
              id: 'stu_qa',
              name: 'QA',
              grade: `Class ${g}`,
              gradeId: `class${g}`,
              curriculumId: 'cbse',
              createdAt: Date.now() - 8.64e7,
            },
          ])
        ),
      n
    );
    await page.goto(BASE, { waitUntil: 'networkidle0' });
    await wait(700);
    // The first-run tour can appear after the first paint, so dismissal
    // is attempted, Learn is opened, then dismissal is attempted again —
    // Class 6 showed a four-step tour over the Learn tab otherwise.
    for (const l of ['Skip', 'Not now', 'Close', 'Got it']) await clickByText(page, l);
    let wentToLearn = await clickByText(page, 'Learn');
    await wait(600);
    for (const l of ['Skip', 'Not now', 'Close', 'Got it']) await clickByText(page, l);
    await wait(300);
    wentToLearn = (await clickByText(page, 'Learn')) || wentToLearn;
    await wait(600);
    if (!wentToLearn) notes.push('could not reach Learn');

    // Expand the collapsed "More chapters" list so unavailable records
    // are actually in the DOM, not merely promised.
    await page.evaluate(() => {
      for (const d of document.querySelectorAll('details')) d.open = true;
    });
    await wait(200);

    const text = await pageText(page);
    const expected = expectedFor(n);
    const derived = DERIVED.includes(n);

    // What the screen shows, in DOM order.
    // Titles are read from the elements that ARE chapter titles, in DOM
    // order — not searched for in the page text, which matched a legacy
    // card called "Fractions, Geometry & Data" against the chapter
    // "Fractions" and reported both a phantom launch and a false
    // ordering failure.
    // Each rendered chapter title, with whether it sits inside something
    // clickable. Class 6's Learn view repeats the chapter a student is
    // working in as a hero above the list, so that first occurrence is
    // dropped before the order is compared — the list itself must still
    // be in the book's order, and every title must appear.
    const rendered = await page.evaluate(() =>
      [...document.querySelectorAll('[data-chapter-title="official"]')].map((e) => ({
        title: (e.textContent || '').trim(),
        available: e.getAttribute('data-chapter-available') === 'true',
      }))
    );
    const expectedTitles = expected.map((r) => r.title);
    const renderedTitles = [...new Set(rendered.map((r) => r.title))];
    const renderedCount = renderedTitles.length;
    // Every official chapter must be on the page...
    const titleMatch =
      renderedTitles.length === expectedTitles.length &&
      expectedTitles.every((t) => renderedTitles.includes(t));
    // ...and the LIST must run in the book's order. Class 6 lifts the
    // chapter in progress into a hero above the list, so that chapter is
    // removed from both sides before the order is compared rather than
    // being counted as out of order.
    const heroTitle = rendered.length > 1 && rendered[0].title !== expectedTitles[0] ? rendered[0].title : null;
    const listOrder = rendered.slice(heroTitle ? 1 : 0).map((r) => r.title);
    const expectedOrder = expectedTitles.filter((t) => t !== heroTitle);
    const orderMatch =
      listOrder.length === expectedOrder.length &&
      listOrder.every((t, i) => t === expectedOrder[i]);

    // No unavailable record may be launchable: every chapter of these
    // grades has no content, so no button may carry a chapter title.
    // A chapter is launchable if its title sits inside something the
    // student can click. That is the same question for Class 6's card
    // grid and for the generic list.
    const launchable = [...new Set(rendered.filter((r) => r.available).map((r) => r.title))];
    // Class 6 has authored content, so "nothing may launch" is wrong for
    // it. The expectation is per chapter, from the registry.
    const expectedLaunchable = expected.filter((r) => r.available).map((r) => r.title);
    const unexpected = launchable.filter((t) => !expectedLaunchable.includes(t));
    const missingLaunch = expectedLaunchable.filter((t) => !launchable.includes(t));
    const launchGuardMatch = unexpected.length === 0 && missingLaunch.length === 0;
    if (unexpected.length) notes.push(`launchable with no content: ${unexpected.join(' | ')}`);
    if (missingLaunch.length) notes.push(`expected launchable but not offered: ${missingLaunch.join(' | ')}`);

    // Class 9 must read as partial wherever its chapters are shown.
    const partialOk = n !== 9 || /Part I|not been established/i.test(text);
    if (!partialOk) notes.push('Class 9 does not state that its structure is partial');

    // Part II must stay distinguishable.
    const partOk =
      n === 7 || n === 8 ? text.includes('Part I · Chapter 1') && text.includes('Part II · Chapter 1') : true;
    if (!partOk) notes.push('part labels missing for a two-part book');

    // Legacy practice must say what it is.
    const legacyLabelled = derived ? !/\bskills · \d+ questions/.test(text) || text.includes('not a chapter of your book') : true;
    if (!legacyLabelled) notes.push('legacy module not labelled as extra practice');

    // "Ready to learn" is only false if it is attached to an OFFICIAL
    // chapter that has no content. Legacy practice with real questions
    // may legitimately be offered.
    const falseContinue = await page.evaluate(() =>
      [...document.querySelectorAll('[data-chapter-title="official"]')].some((e) => {
        const card = e.closest('button, li, article, div');
        return card ? /Ready to learn|Continue where you left off/.test(card.textContent || '') : false;
      })
    );
    if (falseContinue) notes.push('false Continue / Ready to learn on an official chapter');

    const leak = ID_LEAK.test(text);
    if (leak) notes.push(`internal id on screen: ${(text.match(ID_LEAK) || [])[0]}`);

    const over = await overflow(page);
    if (over) notes.push('horizontal overflow');

    if (!orderMatch) notes.push(`order: rendered [${listOrder.join(' | ')}]`);
    if (derived && !titleMatch)
      notes.push(`rendered [${renderedTitles.join(' | ')}] vs expected [${expectedTitles.join(' | ')}]`);

    record({
      surface: 'student',
      grade: n,
      viewport: width,
      expectedCount: derived ? expected.length : null,
      renderedCount: derived ? renderedCount : null,
      titleMatch,
      orderMatch,
      availabilityMatch: !falseContinue,
      launchGuardMatch,
      bookPartMatch: partOk,
      partialStructureStatus:
        n === 9 ? 'PART_I_ONLY — full textbook denominator UNKNOWN' : 'complete series published',
      expectedTitles: expectedTitles,
      renderedTitles,
      overflow: over,
      notes,
      result:
        notes.length === 0 && titleMatch === true && launchGuardMatch === true
          ? 'PASS'
          : 'FAIL',
    });
    await page.close();
  }
}

// ---------------------------------------------------------------------------
// TEACHER
// ---------------------------------------------------------------------------

async function teacherPass(browser, width) {
  const page = await browser.newPage();
  await page.setViewport({ width, height: 900 });
  await page.goto(BASE, { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => localStorage.clear());
  await page.evaluate(() =>
    localStorage.setItem(
      'pragati.students.v1',
      JSON.stringify([
        { id: 'stu_qa', name: 'QA', grade: 'Class 6', gradeId: 'class6', curriculumId: 'cbse', createdAt: Date.now() - 8.64e7 },
      ])
    )
  );
  await page.goto(BASE, { waitUntil: 'networkidle0' });
  await wait(700);
  for (const l of ['Skip', 'Not now', 'Close', 'Got it']) await clickByText(page, l);

  // Into teacher mode, then Resources. Both must work at 390 too — the
  // phone bottom bar carries Resources, so no hidden-DOM shortcut is
  // used or needed here.
  const toggled = (await clickByText(page, 'Student mode')) || (await clickByText(page, 'Teacher mode'));
  await wait(900);
  // The header control's text node also carries the brand and tab
  // labels, so an exact match never hits it. This was the whole of the
  // v0.83.1 390px "failure": a harness defect, at every width.
  const dash = await clickByText(page, 'Teacher dashboard', { exact: false });
  await wait(900);
  for (const l of ['Skip', 'Not now', 'Close', 'Got it', 'Maybe later']) await clickByText(page, l);
  const res =
    (await clickByText(page, 'Resources')) || (await clickByText(page, 'Resources', { exact: false }));
  await wait(900);

  if (!toggled || !dash || !res) {
    const seen = await visibleButtons(page);
    record({
      surface: 'teacher', grade: 0, viewport: width,
      expectedCount: null, renderedCount: null, titleMatch: null, orderMatch: null,
      availabilityMatch: null, launchGuardMatch: null, overflow: null,
      notes: [`navigation failed (mode=${toggled} dash=${dash} resources=${res}); visible buttons: ${seen.slice(0, 25).join(' | ')}`],
      result: 'FAIL',
    });
    await page.close();
    return;
  }

  for (let n = 1; n <= 12; n++) {
    const notes = [];
    const picked = await clickByText(page, `Class ${n}`);
    if (!picked) notes.push('class picker button not found');
    await wait(400);
    const text = await pageText(page);
    const expected = expectedFor(n);
    const derived = DERIVED.includes(n);
    // Same rule as Student: read the elements that ARE chapter titles.
    const renderedTitles = await page.evaluate(() =>
      [...document.querySelectorAll('[data-chapter-title="official"]')].map((e) =>
        (e.textContent || '').trim()
      )
    );
    const expectedTitles = expected.map((r) => r.title);
    const renderedCount = renderedTitles.length;
    const orderMatch = derived
      ? renderedTitles.length === expectedTitles.length &&
        renderedTitles.every((t, i) => t === expectedTitles[i])
      : null;

    // No content anywhere in these grades, so every chapter card must
    // carry the non-launching state and no "Open chapter resources".
    const openButtons = await page.evaluate(() =>
      [...document.querySelectorAll('button')]
        .filter((b) => b.offsetParent !== null)
        .filter((b) => (b.textContent || '').includes('Open chapter resources')).length
    );
    const notAvail = (text.match(/Resources not available yet/g) || []).length;
    const expectedOpen = expected.filter((r) => r.hasTeacherResource).length;
    const expectedNotAvail = expected.length - expectedOpen;
    if (openButtons !== expectedOpen)
      notes.push(`${openButtons} "Open chapter resources" buttons, expected ${expectedOpen}`);
    if (notAvail < expectedNotAvail)
      notes.push(`only ${notAvail} of ${expectedNotAvail} chapters say "Resources not available yet"`);
    if (derived && !orderMatch)
      notes.push(`rendered [${renderedTitles.join(' | ')}] vs expected [${expectedTitles.join(' | ')}]`);
    if ((n === 7 || n === 8) && !(text.includes('Part I · Chapter 1') && text.includes('Part II · Chapter 1')))
      notes.push('part labels missing for a two-part book');
    if (n === 9 && !/Part I|not been established/i.test(text)) notes.push('Class 9 does not read as partial');
    if (ID_LEAK.test(text)) notes.push(`internal id on screen: ${(text.match(ID_LEAK) || [])[0]}`);
    const over = await overflow(page);
    if (over) notes.push('horizontal overflow');

    record({
      surface: 'teacher',
      grade: n,
      viewport: width,
      expectedCount: derived ? expected.length : null,
      renderedCount: derived ? renderedCount : null,
      titleMatch: orderMatch,
      orderMatch,
      availabilityMatch: notAvail >= expectedNotAvail,
      launchGuardMatch: openButtons === expectedOpen,
      bookPartMatch:
        n === 7 || n === 8
          ? text.includes('Part I · Chapter 1') && text.includes('Part II · Chapter 1')
          : true,
      partialStructureStatus:
        n === 9 ? 'PART_I_ONLY — full textbook denominator UNKNOWN' : 'complete series published',
      expectedTitles,
      renderedTitles,
      overflow: over,
      notes,
      result:
        notes.length === 0 && orderMatch === true && openButtons === expectedOpen
          ? 'PASS'
          : 'FAIL',
    });
  }
  await page.close();
}

// ---------------------------------------------------------------------------

const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
for (const w of WIDTHS) {
  await studentPass(browser, w);
  await teacherPass(browser, w);
}
await browser.close();

fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(`${OUT}/${FILE}`, JSON.stringify({ generated: 'v0.83.2', base: BASE, rows }, null, 2));
const failed = rows.filter((r) => r.result !== 'PASS');
console.log(`\nrows ${rows.length}  pass ${rows.length - failed.length}  fail ${failed.length}`);
process.exit(failed.length ? 1 : 0);
