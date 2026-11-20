import pup from 'puppeteer';
import { seedStudentForBrowserQa, clickByText } from './studentFixture.mjs';
const STAGES = ['Learn the idea', 'See it', 'Worked examples', 'Try it', 'Think deeper'];
const RAW = /:\s*(?:true|false|null|undefined|NaN|Infinity)\b|\[object [A-Z]|\{"[a-z]+":|ncert_kemh1_s\d|contentArtifactId/;
const errs = [], warns = [];
const b = await pup.launch({ args: ['--no-sandbox', '--disable-dev-shm-usage'] });
const p = await b.newPage();
p.on('console', (m) => { const t = m.text().slice(0, 80); if (m.type() === 'error') errs.push(t); else if (m.type() === 'warning') warns.push(t); });
p.on('pageerror', (e) => errs.push('UNCAUGHT: ' + String(e.message).slice(0, 80)));
await p.setViewport({ width: 1280, height: 900 });
const seed = await seedStudentForBrowserQa(p);
console.log('ACTIVE:', seed.confirmedBy);
console.log('TOTAL:', await p.evaluate(() => (document.body.innerText.match(/\d+ chapters[^\n]*/) || [''])[0]));
console.log('CATALOGUE:', JSON.stringify(await p.evaluate(() => [...document.body.innerText.matchAll(/CHAPTER (\d+)\s*\n([^\n]+)\s*\n(\d+) lessons/g)].map((m) => [+m[1], +m[3]]))));
await clickByText(p, 'Limits and Derivatives');
const ids = await p.evaluate(() => [...document.querySelectorAll('[data-artifact-id]')].map((e) => e.getAttribute('data-artifact-id')));
console.log('CH12 ROWS:', ids.length, '| unique', new Set(ids).size);
let walked = 0, maxOv = 0; const leaks = [];
for (let i = 0; i < ids.length; i += 1) {
  await seedStudentForBrowserQa(p); await clickByText(p, 'Limits and Derivatives');
  await p.evaluate((n) => { const r = [...document.querySelectorAll('[data-artifact-id]')][n]; (r?.querySelector('button,a,[role=button]') || r)?.click(); }, i);
  await new Promise((r) => setTimeout(r, 550));
  let st = 0, figs = 0, tables = 0;
  for (const s of STAGES) {
    if (await clickByText(p, s, 280)) st += 1;
    const m = (await p.evaluate(() => document.body.innerText)).match(RAW);
    if (m) leaks.push(`${ids[i]} @${s}: ${JSON.stringify(m[0])}`);
    if (s === 'See it') {
      const g = await p.evaluate(() => ({
        f: [...document.querySelectorAll('svg')].filter((x) => (x.getAttribute('aria-label') || '').length > 80).length,
        t: document.querySelectorAll('figure table, [role=group] table').length,
      }));
      figs = g.f; tables = g.t;
    }
  }
  const fin = await clickByText(p, 'Finish');
  const ov = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  maxOv = Math.max(maxOv, ov);
  if (st === 5 && fin) walked += 1;
  console.log(`  ${String(ids[i]).replace('ncert_kemh1_', '').padEnd(36)} ${st}/5 fin ${fin} ov ${ov}px | figures ${figs} tables ${tables}`);
}
console.log('WALKED:', walked + '/' + ids.length, '| max overflow', maxOv + 'px');
console.log('RENDERED PROSE LEAKS:', leaks.length, leaks.slice(0, 3).join(' ;; '));
console.log('CONSOLE errors=' + errs.length, 'warnings=' + warns.length);
await b.close();
