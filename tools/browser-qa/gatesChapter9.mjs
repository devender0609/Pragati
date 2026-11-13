import pup from 'puppeteer';
import { seedStudentForBrowserQa, clickByText } from './studentFixture.mjs';
const b = await pup.launch({ args: ['--no-sandbox', '--disable-dev-shm-usage'] });
const p = await b.newPage();
const open = async (idx) => {
  await seedStudentForBrowserQa(p);
  await clickByText(p, 'Straight Lines');
  await p.evaluate((n) => { const r = [...document.querySelectorAll('[data-artifact-id]')][n]; (r?.querySelector('button,a,[role=button]') || r)?.click(); }, idx);
  await new Promise((r) => setTimeout(r, 550));
};
console.log('== VIEWPORTS (6 lessons x 3 stages each) ==');
for (const [w, h, label] of [[1280, 900, '1280'], [834, 1112, '834'], [360, 740, '360']]) {
  await p.setViewport({ width: w, height: h });
  let worst = 0, overWide = 0, clipped = 0, overlap = 0;
  for (let i = 0; i < 6; i += 1) {
    await open(i);
    for (const stage of ['See it', 'Worked examples', 'Try it']) {
      await clickByText(p, stage, 240);
      const m = await p.evaluate(() => {
        const de = document.documentElement, vw = de.clientWidth;
        const wide = [...document.querySelectorAll('svg,table,pre,code')].filter((e) => e.getBoundingClientRect().width > vw + 1).length;
        const clip = [...document.querySelectorAll('h1,h2,h3,p,li,td,th,text')].filter((e) => e.scrollWidth > e.clientWidth + 2 && getComputedStyle(e).overflow === 'hidden').length;
        const btns = [...document.querySelectorAll('button')].map((e) => e.getBoundingClientRect()).filter((r) => r.width > 0);
        let ol = 0;
        for (let a = 0; a < btns.length; a += 1) for (let c = a + 1; c < btns.length; c += 1) {
          const A = btns[a], B = btns[c];
          if (A.left < B.right - 1 && B.left < A.right - 1 && A.top < B.bottom - 1 && B.top < A.bottom - 1) ol += 1;
        }
        return { ov: de.scrollWidth - de.clientWidth, wide, clip, ol };
      });
      worst = Math.max(worst, m.ov); overWide += m.wide; clipped += m.clip; overlap = Math.max(overlap, m.ol);
    }
  }
  console.log(`  ${label}px  overflow ${worst}px | wider-than-viewport ${overWide} | clipped ${clipped} | control overlaps ${overlap}`);
}
console.log('== VISUAL PRESENCE + ACCESSIBILITY ==');
await p.setViewport({ width: 1280, height: 900 });
for (const [idx, name] of [[0, 'slope'], [1, 'angle-between'], [5, 'distance']]) {
  await open(idx); await clickByText(p, 'See it');
  const g = await p.evaluate(() => {
    const svgs = [...document.querySelectorAll('svg')];
    const named = svgs.filter((s) => (s.getAttribute('aria-label') || '').length > 60);
    return {
      total: svgs.length, named: named.length,
      decorative: svgs.filter((s) => s.getAttribute('aria-hidden') === 'true').length,
      alts: named.map((s) => s.getAttribute('aria-label')),
      strokes: named.map((s) => s.querySelectorAll('line,polyline').length),
      points: named.map((s) => s.querySelectorAll('circle').length),
    };
  });
  console.log(`  ${name}: svgs ${g.total} | mathematical figures ${g.named} | decorative ${g.decorative} | strokes ${JSON.stringify(g.strokes)} | marked points ${JSON.stringify(g.points)}`);
  for (const a of g.alts) console.log(`     [${a.length}] colour=${/\b(red|blue|green|colour|color)\b/i.test(a)} equation=${/= 0|x =|y =|slope/i.test(a)} :: "${a.slice(0, 110)}"`);
}
const a11y = await p.evaluate(() => {
  const stage = [...document.querySelectorAll('button,[role=button]')].filter((e) => /learn the idea|see it|worked examples|try it|think deeper/i.test(e.innerText || ''));
  return {
    stageControls: stage.length, allButtons: stage.every((e) => e.tagName === 'BUTTON'),
    focusable: stage.every((e) => e.tabIndex >= 0 && !e.disabled),
    tables: document.querySelectorAll('table').length,
    tablesWithHeaders: [...document.querySelectorAll('table')].filter((t) => t.querySelector('th')).length,
    imgsNoAlt: [...document.querySelectorAll('img')].filter((i) => !i.hasAttribute('alt')).length,
  };
});
console.log('  structural:', JSON.stringify(a11y));
console.log('== PERSISTENCE ==');
await open(0);
for (const s of ['See it', 'Worked examples', 'Try it', 'Think deeper']) await clickByText(p, s, 220);
await clickByText(p, 'Finish');
await new Promise((r) => setTimeout(r, 400));
await p.goto('http://localhost:4173/', { waitUntil: 'networkidle2' });
await clickByText(p, 'Learn');
console.log('  after finish + reload:', JSON.stringify(await p.evaluate(() => (document.body.innerText.match(/\d+ of \d+ done/g) || []).slice(0, 2))));
await clickByText(p, 'Straight Lines');
console.log('  chapter 9:', JSON.stringify(await p.evaluate(() => (document.body.innerText.match(/\d+ of \d+ done/g) || []).slice(0, 1))));
await b.close();
