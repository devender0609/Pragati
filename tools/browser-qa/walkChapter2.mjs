import pup from 'puppeteer';
import { seedStudentForBrowserQa, clickByText } from './studentFixture.mjs';

const STAGES = ['Learn the idea', 'See it', 'Worked examples', 'Try it', 'Think deeper'];
const errs = [], warns = [];
const b = await pup.launch({ args: ['--no-sandbox', '--disable-dev-shm-usage'] });
const p = await b.newPage();
p.on('console', (m) => {
  const t = m.text().slice(0, 100);
  if (m.type() === 'error') errs.push(t);
  else if (m.type() === 'warning') warns.push(t);
});
p.on('pageerror', (e) => errs.push('UNCAUGHT: ' + String(e.message).slice(0, 100)));

await p.setViewport({ width: 1280, height: 900 });
const seed = await seedStudentForBrowserQa(p);
console.log('ACTIVE GRADE:', seed.confirmedBy);

// --- routing assertions, read from the rendered catalogue -----------------
const cat = await p.evaluate(() => {
  const t = document.body.innerText;
  const chapters = [...t.matchAll(/CHAPTER (\d+)\s*\n([^\n]+)\s*\n(\d+) lessons/g)]
    .map((m) => ({ number: Number(m[1]), title: m[2].trim(), lessons: Number(m[3]) }));
  const total = (t.match(/(\d+) lessons/) || [])[0];
  return { chapters, totalLine: (t.match(/3 chapters[^\n]*/) || [''])[0] };
});
console.log('CATALOGUE:', JSON.stringify(cat.chapters), '|', cat.totalLine);

await clickByText(p, 'Relations and Functions');
const lessons = await p.evaluate(() =>
  [...document.querySelectorAll('[data-artifact-id]')].map((e) => e.getAttribute('data-artifact-id')));
console.log('CH2 ROWS:', lessons.length, '| unique:', new Set(lessons).size);
console.log('CH2 IDS:', JSON.stringify(lessons));
const foreign = lessons.filter((i) => !/kemh1/.test(i || ''));
console.log('NON-CLASS-11 ROWS:', foreign.length);

// --- walk all six ----------------------------------------------------------
let walked = 0, maxOv = 0;
for (let i = 0; i < lessons.length; i += 1) {
  await seedStudentForBrowserQa(p);
  await clickByText(p, 'Relations and Functions');
  await p.evaluate((n) => {
    const r = [...document.querySelectorAll('[data-artifact-id]')][n];
    (r?.querySelector('button,a,[role=button]') || r)?.click();
  }, i);
  await new Promise((r) => setTimeout(r, 600));
  let stages = 0;
  for (const s of STAGES) {
    const hit = await p.evaluate((label) => {
      const el = [...document.querySelectorAll('button,[role=button]')]
        .find((e) => (e.innerText || '').trim().toLowerCase().includes(label.toLowerCase()));
      if (!el) return false;
      el.click();
      return true;
    }, s);
    if (hit) stages += 1;
    await new Promise((r) => setTimeout(r, 300));
  }
  const fin = await clickByText(p, 'Finish');
  const ov = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  maxOv = Math.max(maxOv, ov);
  const title = await p.evaluate(() => (document.querySelector('h1,h2')?.textContent || '').slice(0, 38));
  if (stages === 5 && fin) walked += 1;
  console.log(`  ${String(lessons[i]).replace('ncert_kemh1_', '').padEnd(36)} stages ${stages}/5 finish ${fin} ov ${ov}px  ${title}`);
}
console.log('WALKED:', walked + '/' + lessons.length, '| max overflow', maxOv + 'px');
console.log('CONSOLE errors=' + errs.length, 'warnings=' + warns.length);
if (errs.length) console.log('  ERRORS:', JSON.stringify(errs.slice(0, 4)));
if (warns.length) console.log('  WARNINGS:', JSON.stringify(warns.slice(0, 4)));
await b.close();
