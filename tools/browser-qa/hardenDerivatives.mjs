// v0.84.0-c11.27 checkpoint 90D — delivery hardening for Chapter 12 §12.5.
//
// The coefficient rows and the proof are checked for what they CONTAIN, not
// for how they are drawn: the rows must still read out of the combination
// model, and the proof must still show all five parts.
// A fresh browser per lesson: a session survives only a few seed-and-navigate
// cycles, which is harness plumbing, not a product finding.
import pup from 'puppeteer';
import { seedStudentForBrowserQa, clickByText } from './studentFixture.mjs';
import { measureBottomClearance, MIN_GAP } from './bottomClearance.mjs';

const STAGES = ['Learn the idea', 'See it', 'Worked examples', 'Try it', 'Think deeper'];
const width = Number(process.argv[2] || 1280);
const errs = [], warns = [];

const launch = async () => {
  const b = await pup.launch({ args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const p = await b.newPage();
  p.on('console', (m) => { const t = m.text().slice(0, 90); if (m.type() === 'error') errs.push(t); else if (m.type() === 'warning') warns.push(t); });
  p.on('pageerror', (e) => errs.push('UNCAUGHT: ' + String(e.message).slice(0, 90)));
  await p.setViewport({ width, height: width === 360 ? 740 : 900 });
  return { b, p };
};

/**
 * Layout facts. A deliberate overflow-x container is NOT a page-overflow
 * defect, so the two are measured and reported separately.
 */
const layout = (p) => p.evaluate(() => {
  const de = document.documentElement, vw = de.clientWidth, vh = de.clientHeight;
  const vis = (e) => {
    const r = e.getBoundingClientRect(), cs = getComputedStyle(e);
    return r.width > 0 && r.height > 0 && cs.display !== 'none' && cs.visibility !== 'hidden' && e.offsetParent !== null;
  };
  const scrollers = [...document.querySelectorAll('*')].filter((e) => {
    if (!vis(e)) return false;
    const cs = getComputedStyle(e);
    return (cs.overflowX === 'auto' || cs.overflowX === 'scroll') && e.scrollWidth > e.clientWidth + 1;
  });
  const insideScroller = (e) => scrollers.some((s) => s.contains(e));
  const nav = document.querySelector('nav.fixed');
  const ctrls = [...document.querySelectorAll('button')].filter((e) => {
    if (!vis(e)) return false;
    const r = e.getBoundingClientRect();
    return r.bottom > 0 && r.top < vh && r.right > 0 && r.left < vw;
  });
  let ol = 0;
  for (let a = 0; a < ctrls.length; a += 1) for (let c = a + 1; c < ctrls.length; c += 1) {
    if (ctrls[a].contains(ctrls[c]) || ctrls[c].contains(ctrls[a])) continue;
    if (nav && (nav.contains(ctrls[a]) || nav.contains(ctrls[c]))) continue;
    const A = ctrls[a].getBoundingClientRect(), B = ctrls[c].getBoundingClientRect();
    if (A.left < B.right - 1 && B.left < A.right - 1 && A.top < B.bottom - 1 && B.top < A.bottom - 1) ol += 1;
  }
  return {
    pageOverflow: de.scrollWidth - de.clientWidth,
    localScrollers: scrollers.length,
    // Wide things OUTSIDE a scroller are the real defect.
    wideUncontained: [...document.querySelectorAll('svg,table,pre,code,figure')]
      .filter((e) => vis(e) && e.getBoundingClientRect().width > vw + 1 && !insideScroller(e)).length,
    clipped: [...document.querySelectorAll('h1,h2,h3,h4,p,li,td,th,figcaption,span')]
      .filter((e) => vis(e) && e.scrollWidth > e.clientWidth + 2
        && getComputedStyle(e).overflow === 'hidden' && !insideScroller(e)).length,
    overlaps: ol,
  };
});

const { b: b0, p: p0 } = await launch();
await seedStudentForBrowserQa(p0);
await p0.evaluate(() => [...document.querySelectorAll('button')]
  .find((e) => /^Chapter 12(?!\d)/.test((e.textContent || '').trim()))?.click());
await new Promise((r) => setTimeout(r, 700));
const rows = await p0.evaluate(() => [...document.querySelectorAll('[data-artifact-id]')].map((e) => e.getAttribute('data-artifact-id')));
const fi = rows.findIndex((r) => r.includes('factorial')), pi = rows.findIndex((r) => r.includes('s6_3_permutations'));
const cat = await layout(p0);
console.log(`CATALOGUE @${width}px: rows ${rows.length} | PNC-02 before PNC-03 ${fi < pi} | pageOverflow ${cat.pageOverflow}px | clipped ${cat.clipped} | overlaps ${cat.overlaps}`);
await b0.close();

for (const id of rows.filter((r) => /first_principles|algebra_of_derivatives/.test(r))) {
  const { b, p } = await launch();
  await seedStudentForBrowserQa(p);
  await p.evaluate(() => [...document.querySelectorAll('button')]
    .find((e) => /^Chapter 12(?!\d)/.test((e.textContent || '').trim()))?.click());
  await new Promise((r) => setTimeout(r, 600));
  await p.evaluate((a) => document.querySelector(`[data-artifact-id="${a}"]`)?.click(), id);
  await new Promise((r) => setTimeout(r, 550));
  let worst = { pageOverflow: 0, wideUncontained: 0, clipped: 0, overlaps: 0, localScrollers: 0 };
  let exact = null, figure = null;
  for (const s of STAGES) {
    await clickByText(p, s, 280);
    const l = await layout(p);
    worst = {
      pageOverflow: Math.max(worst.pageOverflow, l.pageOverflow),
      wideUncontained: worst.wideUncontained + l.wideUncontained,
      clipped: worst.clipped + l.clipped,
      overlaps: worst.overlaps + l.overlaps,
      localScrollers: Math.max(worst.localScrollers, l.localScrollers),
    };
    // Exact-integer presentation, read while the stage is actually mounted.
    const e = await p.evaluate(() => {
      const t = document.body.innerText;
      const big = t.match(/\b\d{7,}\b/g) || [];
      return {
        biggest: big.sort((a, c) => c.length - a.length)[0] || null,
        sci: /\d+(\.\d+)?e[+-]\d+/i.test(t),
        bigintSuffix: /\b\d+n\b/.test(t),
        quoted: /"\d{5,}"/.test(t),
        rounded: /\b\d+\.\d+e/i.test(t),
      };
    });
    if (e.biggest && (!exact || e.biggest.length > exact.biggest.length)) exact = e;
    if (s === 'See it') {
      figure = await p.evaluate(() => {
        const proof = document.querySelector('[data-visual-kind="proof_layout"]');
        const table = document.querySelector('[data-visual-kind="limit_table"]');
        const graph = document.querySelector('[data-visual-kind="secant_graph"]');
        const pt = proof ? proof.textContent || '' : '';
        const alt = (proof?.querySelector('[aria-label]')?.getAttribute('aria-label') || '')
          + ' ' + (table?.querySelector('[aria-label]')?.getAttribute('aria-label') || table?.getAttribute('aria-label') || '')
          + ' ' + (graph?.querySelector('[aria-label]')?.getAttribute('aria-label') || graph?.getAttribute('aria-label') || '');
        return {
          proofParts: ['Claim', 'Base case', 'Induction hypothesis', 'Inductive step', 'Conclusion'].filter((h) => pt.includes(h)),
          proofHeadings: proof ? proof.querySelectorAll('h1,h2,h3,h4,h5').length : 0,
          quotientTable: Boolean(table),
          // The table must carry no row for h = 0.
          rowAtZero: table ? [...table.querySelectorAll('tr')].some((r) => r.querySelector('td')?.textContent?.trim() === '0') : null,
          secantGraph: Boolean(graph),
          // The description must carry the mathematics, not a label.
          altMentionsApproach: /approach|closer|settle|towards/i.test(alt),
          altMentionsNoValue: /no value|undefined|absent/i.test(alt),
          altColourDependent: /\b(red|blue|green|colour|color)\b/i.test(alt),
          altLen: alt.trim().length,
        };
      });
    }
  }
  const prose = await p.evaluate(() => {
    const t = document.body.innerText;
    return {
      differenceQuotient: /difference quotient/i.test(t),
      hApproachesZero: /approaches 0|as h approaches/i.test(t),
      saysNoValueAtZero: /no value at h = 0|has no value|not a number/i.test(t),
      substitutesAtZero: /set h = 0|put h = 0|substitute h = 0/i.test(t),
      pointVsFunction: /derivative at a point/i.test(t) && /as a function/i.test(t),
      productTwoTerms: /two terms|product rule/i.test(t),
      quotientDenominatorSquare: /\)²|denominator/i.test(t),
      domainRestriction: /not zero|excluded|no value where|except 0/i.test(t),
      polynomial: /polynomial/i.test(t),
      trigonometric: /trigonometric/i.test(t),
      radians: /radian/i.test(t),
      degreesAsValid: /degrees? (are|is) (fine|valid|acceptable)/i.test(t),
      chainRuleTaught: /chain rule|outer function|inner function/i.test(t),
    };
  });
  const clear = await measureBottomClearance(p);
  const short = id.replace('ncert_kemh1_s', '').replace('_lesson', '');
  console.log(`  ${short.padEnd(24)} pageOverflow ${worst.pageOverflow}px | wideUncontained ${worst.wideUncontained} | clipped ${worst.clipped} | overlaps ${worst.overlaps} | localScrollers ${worst.localScrollers}`);
  if (exact) console.log(`      largest integer shown ${exact.biggest} (${exact.biggest.length} digits) | sci ${exact.sci} | n-suffix ${exact.bigintSuffix} | quoted ${exact.quoted}`);
  if (figure) console.log(`      figures: ${JSON.stringify(figure)}`);
  console.log(`      prose: ${JSON.stringify(prose)}`);
  if (clear.navShown) console.log(`      bottom clearance ${clear.gap}px (min ${MIN_GAP}) pass ${clear.pass}`);
  await b.close();
}
console.log(`CONSOLE errors=${errs.length} warnings=${warns.length}`);
if (errs.length) console.log('   ', JSON.stringify(errs.slice(0, 3)));
