import pup from 'puppeteer';
import { seedStudentForBrowserQa, clickByText } from './studentFixture.mjs';

const b = await pup.launch({ args: ['--no-sandbox', '--disable-dev-shm-usage'] });
const p = await b.newPage();
const open = async (idx) => {
  await seedStudentForBrowserQa(p);
  await clickByText(p, 'Relations and Functions');
  await p.evaluate((n) => {
    const r = [...document.querySelectorAll('[data-artifact-id]')][n];
    (r?.querySelector('button,a,[role=button]') || r)?.click();
  }, idx);
  await new Promise((r) => setTimeout(r, 600));
};
const NAMES = ['cartesian', 'relations', 'functions', 'real-functions', 'algebra', 'composition'];

// ---- viewports -----------------------------------------------------------
console.log('== VIEWPORTS ==');
for (const [w, h, label] of [[1280, 900, '1280'], [834, 1112, '834'], [360, 740, '360']]) {
  await p.setViewport({ width: w, height: h });
  let worst = 0, clipped = 0, overWide = 0;
  for (let i = 0; i < 6; i += 1) {
    await open(i);
    for (const stage of ['See it', 'Worked examples', 'Try it']) {
      await clickByText(p, stage, 260);
      const m = await p.evaluate(() => {
        const de = document.documentElement;
        const vw = de.clientWidth;
        const over = [...document.querySelectorAll('svg,table,pre,code')]
          .filter((e) => e.getBoundingClientRect().width > vw + 1).length;
        const clip = [...document.querySelectorAll('h1,h2,h3,p,li,td,th,button')]
          .filter((e) => e.scrollWidth > e.clientWidth + 2 && getComputedStyle(e).overflow === 'hidden').length;
        return { ov: de.scrollWidth - de.clientWidth, over, clip };
      });
      worst = Math.max(worst, m.ov); overWide += m.over; clipped += m.clip;
    }
  }
  console.log(`  ${label}px  page overflow ${worst}px | elements wider than viewport ${overWide} | clipped text nodes ${clipped}`);
}

// ---- graph fidelity + accessibility on the standard-functions lesson -----
await p.setViewport({ width: 1280, height: 900 });
await open(3);
await clickByText(p, 'See it');
const g = await p.evaluate(() => {
  const svgs = [...document.querySelectorAll('svg')];
  return {
    svgTotal: svgs.length,
    named: svgs.filter((s) => s.getAttribute('aria-label') || s.querySelector('title')).length,
    decorative: svgs.filter((s) => s.getAttribute('aria-hidden') === 'true').length,
    alts: svgs.map((s) => (s.getAttribute('aria-label') || s.querySelector('title')?.textContent || '').trim())
      .filter(Boolean),
    // Count drawn path/polyline pieces per figure as a proxy for branch count.
    pieces: svgs.map((s) => s.querySelectorAll('path,polyline,line').length),
  };
});
console.log('== GRAPHS / ALT TEXT ==');
console.log(`  svgs ${g.svgTotal} | named ${g.named} | decorative ${g.decorative} | drawn pieces per figure ${JSON.stringify(g.pieces)}`);
for (const a of g.alts) {
  const colourOnly = /\b(red|blue|green|colour|color|orange|purple)\b/i.test(a);
  const names = /(signum|greatest integer|modulus|reciprocal|one over x)/i.test(a);
  const behaviour = /(separate|pieces|branches|steps|jump|no value|undefined|not defined)/i.test(a);
  console.log(`  [${a.length} chars] names-fn=${names} describes-behaviour=${behaviour} colour-dependent=${colourOnly}`);
  console.log(`     "${a.slice(0, 150)}"`);
}

// ---- structural accessibility --------------------------------------------
const a11y = await p.evaluate(() => {
  const stageBtns = [...document.querySelectorAll('button,[role=button]')]
    .filter((e) => /learn the idea|see it|worked examples|try it|think deeper/i.test(e.innerText || ''));
  return {
    stageControls: stageBtns.length,
    stageAreButtons: stageBtns.every((e) => e.tagName === 'BUTTON'),
    focusable: stageBtns.every((e) => e.tabIndex >= 0 && !e.disabled),
    tables: document.querySelectorAll('table').length,
    tablesWithHeaders: [...document.querySelectorAll('table')].filter((t) => t.querySelector('th')).length,
    h1: document.querySelectorAll('h1').length,
    headingOrder: [...document.querySelectorAll('h1,h2,h3')].map((e) => e.tagName).slice(0, 8),
    imgsWithoutAlt: [...document.querySelectorAll('img')].filter((i) => !i.hasAttribute('alt')).length,
  };
});
console.log('== ACCESSIBILITY (structural) ==');
console.log(' ', JSON.stringify(a11y));

// ---- persistence ----------------------------------------------------------
await open(0);
for (const s of ['See it', 'Worked examples', 'Try it', 'Think deeper']) await clickByText(p, s, 250);
await clickByText(p, 'Finish');
await new Promise((r) => setTimeout(r, 400));
await p.goto('http://localhost:4173/', { waitUntil: 'networkidle2' });
await clickByText(p, 'Learn');
const after = await p.evaluate(() => (document.body.innerText.match(/\d+ of \d+ done/g) || []).slice(0, 3));
console.log('== PERSISTENCE ==');
console.log('  after finishing one lesson and reloading:', JSON.stringify(after));
await b.close();
