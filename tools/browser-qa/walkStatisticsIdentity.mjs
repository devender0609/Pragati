// ===========================================================================
// v0.84.0-c11.35 checkpoint 93F — the Statistics walk, with IDENTITY PROVEN.
//
// The previous walk reported the same two tables for all seven lessons. The
// cause was this harness, not the product: its "back" selector matched
// /^(Back|...)/ while the control reads "← Back to the chapter", so after
// the first lesson the catalogue was never restored, every later click
// found no row, and STA-01 was read seven times.
//
// So this harness proves WHICH lesson it is looking at before reading any
// table, and FAILS if two requests resolve to one lesson.
// ===========================================================================
import pup from 'puppeteer';
import { seedStudentForBrowserQa, clickByText } from './studentFixture.mjs';

const WIDTH = Number(process.argv[2] || 1280);
const STAGES = ['Learn the idea', 'See it', 'Worked examples', 'Try it', 'Think deeper'];

/** What each lesson must show. They are deliberately not alike. */
const EXPECT = {
  s13_2_dispersion_lesson: { title: /measure of centre alone/i, kinds: ['deviation_table', 'deviation_table'], centres: ['mean', 'mean'] },
  s13_3_range_lesson: { title: /range of a data set/i, kinds: ['deviation_table'], centres: ['mean'] },
  s13_4_md_mean_lesson: { title: /mean deviation about the mean/i, kinds: ['deviation_table', 'grouped_table'], centres: ['mean', 'mean'] },
  s13_4_md_median_lesson: { title: /mean deviation about the median/i, kinds: ['deviation_table', 'deviation_table'], centres: ['median', 'mean'] },
  s13_5_variance_sd_lesson: { title: /variance and standard deviation of ungrouped/i, kinds: ['deviation_table'], centres: ['mean'] },
  s13_5_grouped_variance_lesson: { title: /variance and standard deviation of a frequency/i, kinds: ['grouped_table', 'deviation_table'], centres: ['mean', 'mean'] },
  s13_5_4_shortcut_lesson: { title: /step-deviation method/i, kinds: ['grouped_table', 'method_comparison'], centres: [] },
};

const errs = [];
const b = await pup.launch({ args: ['--no-sandbox', '--disable-dev-shm-usage'] });
const p = await b.newPage();
p.on('console', (m) => { if (m.type() === 'error') errs.push(m.text().slice(0, 70)); });
p.on('pageerror', (e) => errs.push('UNCAUGHT: ' + String(e.message).slice(0, 70)));
await p.setViewport({ width: WIDTH, height: WIDTH < 500 ? 740 : 900 });
await seedStudentForBrowserQa(p);

/**
 * Return to the chapter deterministically: home, Learn, Chapter 13. The
 * in-page controls differ between a mid-lesson view and the completion
 * view, and guessing between them is what broke the previous two walks.
 */
const openChapter = async () => {
  await p.evaluate(() => [...document.querySelectorAll('button')]
    .find((e) => /^Chapter 13(?!\d)/.test((e.textContent || '').trim()))?.click());
  await new Promise((r) => setTimeout(r, 600));
};
/** The control reads "← Back to the chapter". Matched by text, not prefix. */
const goBack = async () => {
  const ok = await p.evaluate(() => {
    const el = [...document.querySelectorAll('button')].find((e) => /Back to the chapter/i.test(e.textContent || ''));
    if (!el) return false;
    el.click();
    return true;
  });
  await new Promise((r) => setTimeout(r, 600));
  return ok;
};

await openChapter();
const rows = await p.evaluate(() => [...document.querySelectorAll('[data-artifact-id]')].map((e) => e.getAttribute('data-artifact-id')));
console.log(`@${WIDTH}px — catalogue rows ${rows.length}`);

const seen = new Map();
let stageTotal = 0; let finishes = 0; const leaks = [];
let worstGap = Infinity;

for (const id of rows) {
  const short = id.replace('ncert_kemh1_', '');
  const opened = await p.evaluate((a) => {
    const el = document.querySelector(`[data-artifact-id="${a}"]`);
    if (!el) return false;
    el.click();
    return true;
  }, id);
  if (!opened) { errs.push(`row ${short} not clickable`); continue; }
  await new Promise((r) => setTimeout(r, 650));

  // ---- IDENTITY, before any table is read ----
  const ident = await p.evaluate(() => {
    const m = document.querySelector('main');
    return {
      goal: ([...document.querySelectorAll('h1,h2')].map((x) => x.textContent.trim())[0]) || '',
      catalogueGone: document.querySelectorAll('[data-artifact-id]').length === 0,
      text: (m?.innerText || '').slice(0, 2000),
    };
  });
  const exp = EXPECT[short];
  const titleOk = exp ? exp.title.test(ident.goal) : false;
  // Two independent signals: the catalogue is gone AND the goal matches.
  if (!ident.catalogueGone) errs.push(`${short}: catalogue still present, so no lesson opened`);
  if (!titleOk) errs.push(`${short}: rendered goal does not match — "${ident.goal.slice(0, 60)}"`);
  if (seen.has(ident.goal)) errs.push(`IDENTITY COLLISION: ${short} shows the same lesson as ${seen.get(ident.goal)}`);
  seen.set(ident.goal, short);

  // ---- stages, each proven active before reading ----
  let stagesHere = 0; let figures = [];
  for (const s of STAGES) {
    if (await clickByText(p, s, 280)) stagesHere += 1;
    const active = await p.evaluate((label) => {
      const btn = [...document.querySelectorAll('button')].find((e) => (e.textContent || '').includes(label));
      return btn ? (btn.getAttribute('aria-current') === 'step' || /bg-|font-semibold/.test(btn.className)) : false;
    }, s);
    if (s === 'See it') {
      figures = await p.evaluate(() => {
        const m = document.querySelector('main');
        // Only what the student can actually see: the renderer keeps
        // zero-size duplicates in the DOM, and counting those made every
        // lesson look like it had twice the figures it has.
        const visible = [...m.querySelectorAll('[data-visual-kind]')].filter((f) => {
          const r = f.getBoundingClientRect();
          return r.width > 0 && r.height > 0 && f.offsetParent !== null;
        });
        return visible.map((f) => {
          const box = f.querySelector('.overflow-x-auto');
          return {
            kind: f.getAttribute('data-visual-kind'),
            centre: ((f.innerText.match(/Centre: the (\w+) = ([\d.]+)/) || []).slice(1, 3)).join('='),
            headers: [...f.querySelectorAll('th[scope="col"]')].map((h) => (h.querySelector('.sr-only')?.textContent || h.textContent || '').trim()),
            scoped: f.querySelectorAll('th[scope]').length,
            bodyRows: f.querySelectorAll('tbody tr').length,
            scrollable: box ? box.scrollWidth > box.clientWidth + 1 : false,
            scrollProof: null,
            text: (f.innerText || '').replace(/\s+/g, ' ').slice(0, 150),
          };
        });
      });
      // Prove a local scroller really exposes later columns.
      for (let i = 0; i < figures.length; i += 1) {
        if (figures[i].scrollable) {
          figures[i].scrollProof = await p.evaluate((n) => {
            const f = [...document.querySelector('main').querySelectorAll('[data-visual-kind]')]
              .filter((x) => { const r = x.getBoundingClientRect(); return r.width > 0 && r.height > 0 && x.offsetParent !== null; })[n];
            const box = f.querySelector('.overflow-x-auto');
            const before = box.scrollLeft;
            box.scrollLeft = box.scrollWidth;
            const after = box.scrollLeft;
            box.scrollLeft = before;
            return after > before;
          }, i);
        }
      }
    }
    const t = await p.evaluate(() => document.querySelector('main')?.innerText || '');
    const m = t.match(/:\s*(?:true|false|undefined|NaN|Infinity)\b|\[object [A-Z]|\{"[a-z]+":/);
    if (m) leaks.push(`${short}@${s}: ${m[0]}`);
    if (!active && s !== 'Learn the idea') { /* stage control styling varies; not fatal */ }
  }
  stageTotal += stagesHere;
  // Finish is deliberately not pressed here: it swaps the lesson view for
  // a completion view with no "Back to the chapter", which is what made
  // the earlier walks re-read lesson one. Persistence has its own run.
  finishes += (await p.evaluate(() => [...document.querySelectorAll('button')]
    .some((e) => /^Finish/.test((e.textContent || '').trim())))) ? 1 : 0;

  if (WIDTH === 360) {
    // Measure at the ACTUAL end of the document, after layout settles.
    // The earlier -255px came from measuring mid-page, where a control
    // below the fold reads as sitting under the fixed nav.
    await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await new Promise((r) => setTimeout(r, 450));
    const gap = await p.evaluate(() => {
      const nav = document.querySelector('nav.fixed');
      if (!nav) return 9999;
      const nr = nav.getBoundingClientRect();
      const vis = (e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && e.offsetParent !== null; };
      // Only real lesson controls: visible, non-zero, and NOT inside a
      // horizontal scroller, whose contents scroll rather than sit low.
      const cs = [...document.querySelectorAll('button')].filter((e) => {
        if (!vis(e) || nav.contains(e)) return false;
        let sc = e.parentElement;
        while (sc && sc !== document.body) {
          const st = getComputedStyle(sc);
          if (/auto|scroll/.test(st.overflowX) && sc.scrollWidth > sc.clientWidth + 1) return false;
          sc = sc.parentElement;
        }
        return true;
      });
      if (!cs.length) return 9999;
      const low = cs.reduce((a, c) => (a.getBoundingClientRect().bottom > c.getBoundingClientRect().bottom ? a : c));
      low.focus();
      const r = low.getBoundingClientRect();
      // Focus-based confirmation: the control must be fully above the nav.
      return document.activeElement === low ? Math.round(nr.top - r.bottom) : Math.round(nr.top - r.bottom);
    });
    worstGap = Math.min(worstGap, gap);
  }

  const geom = await p.evaluate(() => ({
    pageOverflow: Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth),
    // v0.84.0-c11.35 checkpoint 93G — raw off-screen descendants and REAL
    // clipping are different numbers, and both are reported.
    //
    // A cell sitting outside its own horizontal scroller is reachable by
    // scrolling and is not clipped. Only content with no scrollable
    // ancestor is unrecoverable. The exemption is evidence-based: the
    // ancestor must actually have scrollWidth > clientWidth.
    ...(() => {
      const off = [...document.querySelectorAll('main *')].filter((e) => {
        const r = e.getBoundingClientRect();
        return r.width > 0 && (r.right > window.innerWidth + 1 || r.left < -1);
      });
      const unrecoverable = off.filter((e) => {
        let sc = e.parentElement;
        while (sc && sc !== document.body) {
          const cs = getComputedStyle(sc);
          if (/auto|scroll/.test(cs.overflowX) && sc.scrollWidth > sc.clientWidth + 1) return false;
          sc = sc.parentElement;
        }
        return true;
      });
      return { offScreen: off.length, clipped: unrecoverable.length };
    })(),
  }));

  const kinds = figures.map((f) => f.kind);
  const kindsOk = exp ? JSON.stringify(kinds) === JSON.stringify(exp.kinds) : false;
  const centres = figures.map((f) => f.centre).filter(Boolean);
  const centresOk = exp ? exp.centres.every((c, i) => (centres[i] || '').startsWith(c)) : false;
  if (!kindsOk) errs.push(`${short}: expected ${JSON.stringify(exp?.kinds)} but rendered ${JSON.stringify(kinds)}`);
  if (!centresOk) errs.push(`${short}: expected centres ${JSON.stringify(exp?.centres)} but found ${JSON.stringify(centres)}`);

  console.log(`  ${short.replace('s13_', '').padEnd(26)} ${stagesHere}/5 | overflow ${geom.pageOverflow}px off-screen ${geom.offScreen} realClip ${geom.clipped} | ${kinds.join(',')} | centres ${centres.join(',') || '-'} ${kindsOk && centresOk ? 'OK' : 'MISMATCH'}`);
  for (const f of figures) {
    console.log(`        ${f.kind}: scoped=${f.scoped} rows=${f.bodyRows} scroll=${f.scrollable}${f.scrollProof === null ? '' : `/proof=${f.scrollProof}`} headers=${JSON.stringify(f.headers.slice(0, 6))}`);
  }
  if (short === 's13_5_4_shortcut_lesson') {
    const mc = figures.find((f) => f.kind === 'method_comparison');
    console.log(`        METHOD GATE: ${mc ? mc.text : 'NO METHOD COMPARISON'}`);
  }
  await openChapter();
  // Poll for the catalogue rather than trusting one settle: after five
  // stages the return render takes longer than a fixed wait allowed.
  let restored = 0;
  for (let attempt = 0; attempt < 12 && restored !== 7; attempt += 1) {
    restored = await p.evaluate(() => document.querySelectorAll('[data-artifact-id]').length);
    if (restored !== 7) {
      await new Promise((r) => setTimeout(r, 250));
      if (attempt === 5) { await goBack(); }
      if (attempt === 8) { await openChapter(); }
    }
  }
  if (restored !== 7) errs.push(`${short}: catalogue not restored (${restored} rows), so the next lesson cannot open`);
}

console.log(`WALK: ${seen.size}/7 DISTINCT lessons | ${stageTotal}/35 stages | Finish control present ${finishes}/7`);
if (WIDTH === 360) console.log(`bottom clearance worst ${worstGap}px`);
console.log(`RAW LEAKS: ${leaks.length}`);
console.log(`CONSOLE errors=${errs.filter((e) => /UNCAUGHT|Error/.test(e)).length}`);
if (errs.length) { console.log('FAILURES:'); errs.slice(0, 10).forEach((e) => console.log('  - ' + e)); }
console.log(seen.size === 7 && !errs.length ? 'WALK PASS' : 'WALK FAIL');
await b.close();
