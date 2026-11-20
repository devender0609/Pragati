import pup from 'puppeteer';
import { seedStudentForBrowserQa, clickByText, class11Student } from './studentFixture.mjs';
import { measureBottomClearance, MIN_GAP } from './bottomClearance.mjs';

const errs = [], warns = [];
const b = await pup.launch({ args: ['--no-sandbox', '--disable-dev-shm-usage'] });
const p = await b.newPage();
p.on('console', (m) => { const t = m.text().slice(0, 80); if (m.type() === 'error') errs.push(t); else if (m.type() === 'warning') warns.push(t); });
p.on('pageerror', (e) => errs.push('UNCAUGHT: ' + String(e.message).slice(0, 80)));

const openLesson = async (grade, chapter, idx) => {
  await seedStudentForBrowserQa(p, {
    student: { ...class11Student(), grade },
    expectGradeLabel: new RegExp(grade.replace('class', 'Class '), 'i'),
  });
  await clickByText(p, chapter);
  return p.evaluate((n) => {
    const r = [...document.querySelectorAll('[data-artifact-id]')][n];
    (r?.querySelector('button,a,[role=button]') || r)?.click();
    return r?.getAttribute('data-artifact-id');
  }, idx);
};

const CASES = [
  ['class11', 'Sets', 7, 'Ch1 Venn-heavy'],
  ['class11', 'Sets', 11, 'Ch1 FO1 counting'],
  ['class11', 'Relations', 3, 'Ch2 standard functions'],
  ['class11', 'Relations', 4, 'Ch2 function algebra'],
  ['class11', 'Trigonometric', 4, 'Ch3 graphs'],
  ['class11', 'Trigonometric', 5, 'Ch3 identities'],
  ['class11', 'Complex', 4, 'Ch4 Argand'],
  ['class11', 'Complex', 6, 'Ch4 complex quadratics'],
  ['class11', 'Straight Lines', 0, 'Ch9 slope'],
  ['class11', 'Straight Lines', 1, 'Ch9 angle between'],
  ['class11', 'Straight Lines', 4, 'Ch9 FO9'],
  ['class11', 'Straight Lines', 5, 'Ch9 distance'],
];

for (const width of [1280, 834, 360]) {
  await p.setViewport({ width, height: width === 360 ? 740 : 900 });
  let worstGap = 1e9, fails = 0, overflow = 0, overWide = 0, clipped = 0;
  for (const [grade, chapter, idx, label] of CASES) {
    try {
      await openLesson(grade, chapter, idx);
      await new Promise((r) => setTimeout(r, 450));
      await clickByText(p, 'Worked examples', 260);
      const m = await measureBottomClearance(p);
      const layout = await p.evaluate(() => {
        const de = document.documentElement, vw = de.clientWidth;
        return {
          ov: de.scrollWidth - de.clientWidth,
          wide: [...document.querySelectorAll('svg,table,pre,code')].filter((e) => e.getBoundingClientRect().width > vw + 1).length,
          clip: [...document.querySelectorAll('h1,h2,h3,p,li,td,th')].filter((e) => e.scrollWidth > e.clientWidth + 2 && getComputedStyle(e).overflow === 'hidden').length,
        };
      });
      overflow = Math.max(overflow, layout.ov); overWide += layout.wide; clipped += layout.clip;
      if (m.navShown) { worstGap = Math.min(worstGap, m.gap); if (!m.pass) { fails += 1; console.log(`    FAIL ${label}: gap ${m.gap}px`); } }
    } catch (e) { console.log(`    ERROR ${label}: ${String(e.message).slice(0, 70)}`); fails += 1; }
  }
  const gapText = worstGap === 1e9 ? 'nav hidden at this width' : `worst gap ${worstGap}px`;
  console.log(`  ${width}px: overflow ${overflow}px | wider-than-viewport ${overWide} | clipped ${clipped} | ${gapText} | failures ${fails}`);
}
console.log(`CONSOLE errors=${errs.length} warnings=${warns.length}`);
if (errs.length) console.log('   ', JSON.stringify(errs.slice(0, 3)));
await b.close();
