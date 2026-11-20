// v0.70 §1/§22 — ROUTE-VERIFIED VISUAL QA.
//
// Every capture proves which screen it is before it is saved. A route
// whose contract fails produces a FAILURE, not a file — see
// routeContracts.mjs for why v0.69's harness could not be trusted.

import puppeteer from 'puppeteer';
import fs from 'fs';
import { ROUTE_CONTRACTS, checkContract } from './routeContracts.mjs';

const BASE = process.env.PRAGATI_URL ?? 'http://127.0.0.1:4173/';
const OUT = process.env.PRAGATI_SHOTS ?? 'screenshots-v073';
const WIDTHS = [390, 768, 1440];

fs.mkdirSync(OUT, { recursive: true });

const results = [];
const wait = (m) => new Promise((r) => setTimeout(r, m));

const RETURNING_STUDENT = [
  { id: 'stu_demo_1', name: 'Asha', grade: 'Class 6', gradeId: 'class6', curriculumId: 'cbse', createdAt: Date.now() - 8.64e7 },
];

async function visibleText(p) {
  return p.evaluate(() => document.body.innerText);
}

/**
 * Capture, but only if the contract holds.
 *
 * Also measures what DOM checks can measure — overflow, tap targets,
 * console errors — because those remain worth having. They just are not
 * evidence of WHICH screen was captured, which was v0.69's error.
 */
async function capture(p, routeId, width, consoleErrors) {
  const contract = ROUTE_CONTRACTS[routeId];
  if (!contract) throw new Error(`no contract for route '${routeId}'`);
  const text = await visibleText(p);
  const failures = checkContract(contract, text);

  if (failures.length > 0) {
    results.push({
      route: routeId, width, status: 'FAILED', failures,
      note: 'No screenshot saved. A mislabelled capture is worse than a missing one.',
    });
    return false;
  }

  const overflow = await p.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2
  );
  const undersized = await p.evaluate(() => {
    const out = [];
    for (const el of document.querySelectorAll('button,a[href],select,input,textarea,[role="radio"]')) {
      const tiny = el.tagName === 'INPUT' && (el.type === 'radio' || el.type === 'checkbox');
      const t = tiny ? el.closest('label') ?? el : el;
      const r = t.getBoundingClientRect();
      if (r.width > 0 && r.height > 0 && r.height < 44) {
        out.push(`${el.tagName}:${(t.textContent || '').trim().slice(0, 24)}:${Math.round(r.height)}`);
      }
    }
    return out;
  });

  const file = `${routeId}-${width}.png`;
  await p.screenshot({ path: `${OUT}/${file}`, fullPage: true });
  results.push({
    route: routeId, width, status: 'OK', file,
    overflow, undersized, consoleErrors: [...consoleErrors],
  });
  return true;
}

function driver(p) {
  return {
    /** Click the first element whose trimmed text contains `t`. */
    async click(t, sel = 'button') {
      const ok = await p.evaluate((t, sel) => {
        const e = [...document.querySelectorAll(sel)].find((x) => x.textContent.trim().includes(t));
        if (e) { e.scrollIntoView({ block: 'center' }); e.click(); return true; }
        return false;
      }, t, sel);
      await wait(500);
      return ok;
    },
    /** Click the LAST exact-text match — the bottom nav duplicates labels. */
    async tab(t) {
      const ok = await p.evaluate((t) => {
        const els = [...document.querySelectorAll('button')].filter((x) => x.textContent.trim() === t);
        const e = els[els.length - 1];
        if (e) { e.click(); return true; }
        return false;
      }, t);
      await wait(700);
      return ok;
    },
    async dismissOnboarding() {
      for (let i = 0; i < 8; i++) if (!(await this.click('Skip'))) break;
      await wait(200);
    },
  };
}

const browser = await puppeteer.launch({
  headless: 'new',
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});

for (const width of WIDTHS) {
  const consoleErrors = [];
  const p = await browser.newPage();
  p.on('pageerror', (e) => consoleErrors.push(`pageerror: ${String(e).slice(0, 140)}`));
  p.on('console', (m) => {
    if (m.type() === 'error' && !m.text().includes('404')) {
      consoleErrors.push(m.text().slice(0, 140));
    }
  });
  await p.setViewport({ width, height: 900 });
  const d = driver(p);

  // ---- FIRST RUN: no student record at all -------------------------
  await p.goto(BASE, { waitUntil: 'domcontentloaded' });
  await p.evaluate(() => localStorage.clear());
  await p.goto(BASE, { waitUntil: 'networkidle0' });
  await wait(600);
  await d.dismissOnboarding();
  await capture(p, 'student_first_run', width, consoleErrors);

  // ---- RETURNING STUDENT -------------------------------------------
  await p.evaluate((s) => localStorage.setItem('pragati.students.v1', JSON.stringify(s)), RETURNING_STUDENT);
  await p.goto(BASE, { waitUntil: 'networkidle0' });
  await wait(700);
  await d.dismissOnboarding();
  await capture(p, 'student_home_returning', width, consoleErrors);

  await d.tab('Learn');
  await capture(p, 'student_learn', width, consoleErrors);

  // Fractions chapter. Match the tile that carries the chapter label, so
  // a wider layout also showing the word "Fractions" elsewhere cannot
  // capture the click.
  // v0.76 — the featured chapter on Learn is now a hero band rather than
  // a tile in the grid, so no button carries the string "Chapter 7". The
  // hero's action is the affordance; the tile match is kept for the
  // other nine chapters and for older layouts.
  await p.evaluate(() => {
    const btns = [...document.querySelectorAll('button')];
    const b =
      btns.find((x) => /Chapter 7/.test(x.textContent || '')) ??
      btns.find((x) => (x.textContent || '').includes('Open this chapter')) ??
      btns.find((x) => (x.textContent || '').includes('Fractions'));
    if (b) { b.scrollIntoView({ block: 'center' }); b.click(); }
  });
  await wait(600);
  await capture(p, 'student_fractions', width, consoleErrors);

  // v0.71 §9 — the lesson a student can actually open now comes from
  // the RELATED PRACTICE section, not from the official journey. The
  // journey is the textbook sequence and every part of it is Coming
  // soon, which is the truth this release restored.
  await d.click('Fractions as parts of a whole');
  await capture(p, 'student_lesson', width, consoleErrors);

  // The coming-soon state.
  //
  // Two facts the harness learned the hard way. (1) After the v0.70 §27
  // truthfulness fix no chapter is both tappable and empty — that
  // combination WAS the defect — so the honest capture is the Learn
  // tab's coming-soon group, where a student now meets unavailable
  // content. (2) A lesson is an APP-LEVEL view with no bottom nav, so
  // `tab()` finds nothing from inside one; reloading returns to a known
  // state far more reliably than clicking back through unknown depth.
  await p.goto(BASE, { waitUntil: 'networkidle0' });
  await wait(700);
  await d.dismissOnboarding();
  await d.tab('Learn');
  await capture(p, 'student_coming_soon', width, consoleErrors);

  // v0.74 §9 — Practice, captured as its own top-level destination.
  // It has been in the bottom nav since v0.49 and no release has ever
  // proved which screen it opens.
  await d.tab('Practice');
  await capture(p, 'student_practice', width, consoleErrors);

  await d.tab('Progress');
  await capture(p, 'student_progress', width, consoleErrors);
  await d.tab('Home');

  // ---- TEACHER -----------------------------------------------------
  // The header toggle names the CURRENT mode, and switching it changes
  // the chrome without navigating. v0.69 clicked "Switch to teacher
  // mode" — a first-run-only button — so every teacher capture silently
  // stayed in student mode.
  await d.tab('Home');
  await d.click('Student mode');
  await wait(1000);
  await d.click('Teacher dashboard');
  await wait(900);
  await d.dismissOnboarding();
  await capture(p, 'teacher_overview', width, consoleErrors);

  // Once inside a sub-view the teacher nav is gone, so the header's
  // "Teacher dashboard" button is the reliable way back.
  for (const [label, route] of [
    ['Classes', 'teacher_classes'],
    ['Assign', 'teacher_assign'],
    // v0.74 §11 — Assess as its own workflow. Note it is NOT in the
    // phone nav (v0.71 §17 cut six tabs to four), so at 390 it must be
    // reached from the desktop header or Overview; the click helper
    // below falls back accordingly.
    ['Assess', 'teacher_assess'],
    ['Insights', 'teacher_insights'],
    ['Resources', 'teacher_resources'],
  ]) {
    await p.evaluate((t) => {
      const e = [...document.querySelectorAll('button')].find((x) => x.textContent.trim() === t);
      e && e.click();
    }, label);
    await wait(800);
    await capture(p, route, width, consoleErrors);
    await d.click('Teacher dashboard');
    await wait(700);
  }

  // ---- ADMIN -------------------------------------------------------
  await d.click('Teacher dashboard');
  await wait(700);
  await d.click('Admin & Research');
  await wait(900);
  await capture(p, 'admin_home', width, consoleErrors);
  await d.click('Curriculum');
  await wait(900);
  await capture(p, 'admin_curriculum', width, consoleErrors);
  await capture(p, 'admin_verification', width, consoleErrors);
  await d.click('Open the Chapter 7 draft review');
  await wait(900);
  await capture(p, 'admin_chapter_quality', width, consoleErrors);

  // The §7.4 lesson renderer lives HERE, because the content is
  // unpublished. Capturing it under a student filename would be exactly
  // the mislabelling this harness exists to stop.
  await p.evaluate(() => {
    const b = [...document.querySelectorAll('button')].find((x) =>
      (x.textContent || '').trim().startsWith('7.4')
    );
    if (b) { b.scrollIntoView({ block: 'center' }); b.click(); }
  });
  await wait(900);
  // v0.71 §12 — the lesson opens on "Learn the idea"; each stage is a
  // separate capture, because each is now a separate screen.
  await capture(p, 'admin_lesson_74', width, consoleErrors);
  await d.click('Worked examples');
  await wait(500);
  for (let i = 0; i < 8; i++) if (!(await d.click('Next step'))) break;
  await capture(p, 'admin_lesson_examples', width, consoleErrors);
  await d.click('Think deeper');
  await wait(500);
  await capture(p, 'admin_lesson_deeper', width, consoleErrors);
  await capture(p, 'admin_practice_interaction', width, consoleErrors);
  // Answer a practice item wrongly.
  //
  // v0.70 clicked the first `[role="radio"]` — a selector only the
  // area-model format uses, and §7.4 has no area-model item, so NOTHING
  // was ever clicked. The capture passed anyway because its contract
  // required the lowercase word "answer", which some other block on the
  // then-single-page lesson happened to supply. A contract that passes
  // for the wrong reason is exactly the failure this harness exists to
  // stop, and it took staging the lesson to expose it.
  //
  // Now: click a genuine incorrect option in the practice section, and
  // verify feedback actually appeared before capturing.
  const answered = await p.evaluate(() => {
    // Click ONE KNOWN DISTRACTOR by its text, not "whatever the first
    // radiogroup offers".
    //
    // The previous attempt walked the groups and took the last labelled
    // option of the first one with more than one. §7.4 renders six
    // groups of four different formats, so which item that landed on
    // depended on render order — and a strip or numeric item yields the
    // NEUTRAL heading, not the diagnosed one. The capture then failed
    // for a reason that had nothing to do with the app.
    //
    // This option states its own reasoning ("because 1/4 is less than
    // 1"), which is what makes its misconception safely inferable, so it
    // deterministically produces the DIAGNOSED feedback this capture is
    // meant to show.
    const target = [...document.querySelectorAll('button')].find((b) =>
      (b.textContent || '').includes('It cannot be shown')
    );
    if (!target) return false;
    target.scrollIntoView({ block: 'center' });
    target.click();
    return true;
  });
  await wait(700);
  if (!answered) {
    results.push({
      route: 'admin_feedback_incorrect', width, status: 'FAILED',
      failures: ['no practice option could be answered on this screen'],
    });
  } else {
    await capture(p, 'admin_feedback_incorrect', width, consoleErrors);
  }

  await p.close();
}

await browser.close();

const failed = results.filter((r) => r.status === 'FAILED');
const ok = results.filter((r) => r.status === 'OK');
fs.writeFileSync(`${OUT}/route-verification.json`, JSON.stringify(results, null, 2));

console.log(`captured ${ok.length}, refused ${failed.length}`);
for (const f of failed) console.log(`  FAILED ${f.route}@${f.width}: ${f.failures.join('; ')}`);
const problems = ok.filter((r) => r.overflow || r.undersized.length || r.consoleErrors.length);
for (const r of problems) {
  console.log(`  DOM ${r.route}@${r.width}: overflow=${r.overflow} tap=${r.undersized.slice(0, 3).join(',')} err=${r.consoleErrors.slice(0, 2).join(',')}`);
}
process.exit(failed.length > 0 ? 1 : 0);
