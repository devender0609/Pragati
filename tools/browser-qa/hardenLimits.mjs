// v0.84.0-c11.16 checkpoint 85B — delivery hardening for Chapter 10.
// A browser survives only a handful of seed-and-navigate cycles, so each
// batch gets its own. That is harness plumbing, not a product finding.
import pup from 'puppeteer';
import { seedStudentForBrowserQa, clickByText } from './studentFixture.mjs';
import { measureBottomClearance, MIN_GAP } from './bottomClearance.mjs';

const LESSONS = [
  [0, 'LIM-01 rate of change'], [1, 'LIM-02 intuitive limit'],
  [2, 'LIM-03 polynomial rational'], [3, 'LIM-04 trig exp log'],

];
const BATCHES = [LESSONS.slice(0, 2), LESSONS.slice(2)];
const width = Number(process.argv[2] || 1280);
const errs = [], warns = [];
let worstGap = Infinity, fails = 0, maxOv = 0, wide = 0, clipped = 0, overlaps = 0, navPass = 0;

const openLesson = async (p, idx) => {
  await seedStudentForBrowserQa(p);
  await clickByText(p, 'Limits and Derivatives');
  await p.evaluate((n) => {
    const r = [...document.querySelectorAll('[data-artifact-id]')][n];
    (r?.querySelector('button,a,[role=button]') || r)?.click();
  }, idx);
  await new Promise((r) => setTimeout(r, 520));
};

for (const batch of BATCHES) {
  const b = await pup.launch({ args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const p = await b.newPage();
  p.on('console', (m) => { const t = m.text().slice(0, 80); if (m.type() === 'error') errs.push(t); else if (m.type() === 'warning') warns.push(t); });
  p.on('pageerror', (e) => errs.push('UNCAUGHT: ' + String(e.message).slice(0, 80)));
  await p.setViewport({ width, height: width === 360 ? 740 : 900 });
  for (const [idx, label] of batch) {
    try {
      await openLesson(p, idx);
      for (const stage of ['See it', 'Worked examples', 'Try it']) {
        await clickByText(p, stage, 260);
        const m = await p.evaluate(() => {
          const de = document.documentElement, vw = de.clientWidth, vh = de.clientHeight;
          const vis = (e) => {
            const r = e.getBoundingClientRect(), cs = getComputedStyle(e);
            return r.width > 0 && r.height > 0 && cs.display !== 'none'
              && cs.visibility !== 'hidden' && cs.opacity !== '0' && e.offsetParent !== null;
          };
          // Stage controls only, visible, on screen together.
          //
          // Checkpoint 84C settled what counts here. The bottom nav is
          // FIXED, so at an arbitrary scroll position a mid-document control
          // legitimately passes beneath it; the reader scrolls on. Counting
          // that as an overlap is what produced the false 84B finding.
          // Whether the LAST control can be brought clear is the real gate,
          // and measureBottomClearance answers it at scroll end.
          //
          // So control-against-nav is reported separately from
          // control-against-control, which would be a genuine layout defect.
          const nav = document.querySelector('nav.fixed');
          const ctrls = [...document.querySelectorAll('button')].filter((e) => {
            if (!vis(e)) return false;
            const r = e.getBoundingClientRect();
            return r.bottom > 0 && r.top < vh && r.right > 0 && r.left < vw;
          });
          let ol = 0, navPass = 0;
          for (let a = 0; a < ctrls.length; a += 1) for (let c = a + 1; c < ctrls.length; c += 1) {
            if (ctrls[a].contains(ctrls[c]) || ctrls[c].contains(ctrls[a])) continue;
            const A = ctrls[a].getBoundingClientRect(), B = ctrls[c].getBoundingClientRect();
            if (A.left < B.right - 1 && B.left < A.right - 1 && A.top < B.bottom - 1 && B.top < A.bottom - 1) {
              if (nav && (nav.contains(ctrls[a]) || nav.contains(ctrls[c]))) navPass += 1; else ol += 1;
            }
          }
          return {
            ov: de.scrollWidth - de.clientWidth,
            wide: [...document.querySelectorAll('svg,table,pre,code')].filter((e) => e.getBoundingClientRect().width > vw + 1).length,
            // A clipped equation or label: overflowing its own box with overflow hidden.
            clip: [...document.querySelectorAll('h1,h2,h3,p,li,td,th,figcaption')]
              .filter((e) => e.scrollWidth > e.clientWidth + 2 && getComputedStyle(e).overflow === 'hidden').length,
            overlaps: ol, navPass,
          };
        });
        maxOv = Math.max(maxOv, m.ov); wide += m.wide; clipped += m.clip; overlaps += m.overlaps; navPass += m.navPass;
      }
      const c = await measureBottomClearance(p);
      if (c.navShown) { worstGap = Math.min(worstGap, c.gap); if (!c.pass) { fails += 1; console.log(`    FAIL ${label}: gap ${c.gap}px`); } }
    } catch (e) { console.log(`    ERROR ${label}: ${String(e.message).slice(0, 60)}`); fails += 1; }
  }
  await b.close();
}
const gap = worstGap === Infinity ? 'nav hidden at this width' : `worst bottom-clearance gap ${worstGap}px (min ${MIN_GAP})`;
console.log(`${width}px: ${LESSONS.length} lessons x 3 stages | overflow ${maxOv}px | wider-than-viewport ${wide} | clipped ${clipped} | control-vs-control overlaps ${overlaps} | ${gap} | failures ${fails}`);
console.log(`  controls passing under the fixed nav mid-scroll: ${navPass} — expected for a floating bar, and not an overlap; the clearance gate above is the real check`);
console.log(`  console errors=${errs.length} warnings=${warns.length}`);
if (errs.length) console.log('   ', JSON.stringify(errs.slice(0, 3)));
if (warns.length) console.log('   ', JSON.stringify(warns.slice(0, 3)));
