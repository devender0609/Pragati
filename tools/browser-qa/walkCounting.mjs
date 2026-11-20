import pup from 'puppeteer';
import { seedStudentForBrowserQa, clickByText } from './studentFixture.mjs';
const STAGES = ['Learn the idea', 'See it', 'Worked examples', 'Try it', 'Think deeper'];
const RAW = /:\s*(?:true|false|null|undefined|NaN|Infinity)\b|\[object [A-Z]|\{"[a-z]+":|contentArtifactId|\d e\+|\d+e\+\d/;
const errs = [], warns = [];
const b = await pup.launch({ args: ['--no-sandbox', '--disable-dev-shm-usage'] });
const p = await b.newPage();
p.on('console', (m) => { const t = m.text().slice(0, 80); if (m.type() === 'error') errs.push(t); else if (m.type() === 'warning') warns.push(t); });
p.on('pageerror', (e) => errs.push('UNCAUGHT: ' + String(e.message).slice(0, 80)));
await p.setViewport({ width: 1280, height: 900 });
await seedStudentForBrowserQa(p);
const header = await p.evaluate(() => (document.body.innerText.match(/\d+ chapters from your textbook[^\n]*/) || [''])[0]);
console.log('HEADER:', JSON.stringify(header));
// Open Chapter 6 from the catalogue, the way a student does.
const opened = await p.evaluate(() => {
  const btn = [...document.querySelectorAll('button')].find((e) => /^Chapter 6(?!\d)/.test((e.textContent || '').trim()));
  btn?.click(); return Boolean(btn);
});
await new Promise((r) => setTimeout(r, 700));
const rows = await p.evaluate(() => [...document.querySelectorAll('[data-artifact-id]')].map((e) => e.getAttribute('data-artifact-id')));
console.log('CHAPTER 6 OPENED:', opened, '| rows', rows.length);
console.log('ORDER:', JSON.stringify(rows.map((r) => r.replace('ncert_kemh1_s', '').replace('_lesson', ''))));
const fi = rows.findIndex((r) => r.includes('factorial')), pi = rows.findIndex((r) => r.includes('s6_3_permutations'));
console.log('PNC-02 BEFORE PNC-03 IN THE PRODUCT:', fi >= 0 && pi >= 0 && fi < pi, `(factorial@${fi}, permutations@${pi})`);
let totalStages = 0, finishes = 0; const leaks = [], figures = {};
for (const id of rows) {
  await p.evaluate((a) => document.querySelector(`[data-artifact-id="${a}"]`)?.click(), id);
  await new Promise((r) => setTimeout(r, 550));
  let st = 0;
  for (const s of STAGES) {
    if (await clickByText(p, s, 260)) st += 1;
    const txt = await p.evaluate(() => document.body.innerText);
    const m = txt.match(RAW);
    if (m) leaks.push(`${id}@${s}: ${JSON.stringify(m[0])}`);
    if (s === 'See it') {
      const f = await p.evaluate(() => {
        const svgs = [...document.querySelectorAll('svg[role=img][aria-label]')].filter((e) => (e.getAttribute('aria-label') || '').length > 80);
        const arr = document.querySelector('figure[aria-label], [role=group][aria-label]');
        return {
          trees: svgs.length,
          branches: svgs.reduce((n, e) => n + e.querySelectorAll('line').length, 0),
          arrangement: arr && /distinct arrangements/.test(arr.textContent || '') ? [...arr.querySelectorAll('li')].length : 0,
        };
      });
      figures[id.replace('ncert_kemh1_s', '').replace('_lesson', '')] = f;
    }
  }
  totalStages += st;
  if (await clickByText(p, 'Finish', 400)) finishes += 1;
  await new Promise((r) => setTimeout(r, 400));
  await p.evaluate(() => {
    const back = [...document.querySelectorAll('button')].find((e) => /^(Back|All chapters|Chapter 6)/.test((e.textContent || '').trim()));
    back?.click();
  });
  await new Promise((r) => setTimeout(r, 450));
}
console.log(`WALK: ${totalStages}/${rows.length * 5} stages | Finish ${finishes}/${rows.length}`);
console.log('FIGURES:', JSON.stringify(figures));
const notation = await p.evaluate(() => {
  const t = document.body.innerText;
  return { nPr: /nPr/.test(t), nCr: /nCr/.test(t), factorial: /n!|\d!/.test(t) };
});
console.log('NOTATION somewhere in chapter:', JSON.stringify(notation));
console.log('RAW LEAKS:', leaks.length, leaks.slice(0, 2).join(' ;; '));
console.log('CONSOLE errors=' + errs.length, 'warnings=' + warns.length);
if (errs.length) console.log('  ', JSON.stringify(errs.slice(0, 3)));
await b.close();
