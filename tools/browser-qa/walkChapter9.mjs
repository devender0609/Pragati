import pup from 'puppeteer';
import { seedStudentForBrowserQa, clickByText } from './studentFixture.mjs';

const STAGES = ['Learn the idea', 'See it', 'Worked examples', 'Try it', 'Think deeper'];
// A leaked value sits in a VALUE position — after a colon, or as a bare
// token with no sentence around it. Matching the word anywhere would flag
// ordinary English such as "that is true of point-slope form", which a
// lesson is entitled to say. Same lesson the source guard taught.
const RAW = /:\s*(?:true|false|null|undefined|NaN|Infinity)\b|\bis\s(?:NaN|Infinity)\b|\[object [A-Z]|\{"[a-z]+":|ncert_kemh1_s\d|contentArtifactId/;
const errs = [], warns = [];
const b = await pup.launch({ args: ['--no-sandbox', '--disable-dev-shm-usage'] });
const p = await b.newPage();
p.on('console', (m) => { const t = m.text().slice(0, 90); if (m.type() === 'error') errs.push(t); else if (m.type() === 'warning') warns.push(t); });
p.on('pageerror', (e) => errs.push('UNCAUGHT: ' + String(e.message).slice(0, 90)));

await p.setViewport({ width: 1280, height: 900 });
const seed = await seedStudentForBrowserQa(p);
console.log('ACTIVE:', seed.confirmedBy);
const cat = await p.evaluate(() => [...document.body.innerText.matchAll(/CHAPTER (\d+)\s*\n([^\n]+)\s*\n(\d+) lessons/g)].map((m) => ({ n: +m[1], t: m[2].trim(), l: +m[3] })));
console.log('CATALOGUE:', JSON.stringify(cat));
console.log('TOTAL LINE:', (await p.evaluate(() => (document.body.innerText.match(/\d+ chapters[^\n]*/) || [''])[0])));

await clickByText(p, 'Straight Lines');
const ids = await p.evaluate(() => [...document.querySelectorAll('[data-artifact-id]')].map((e) => e.getAttribute('data-artifact-id')));
console.log('CH9 ROWS:', ids.length, '| unique:', new Set(ids).size, '| order:', JSON.stringify(ids.map((i) => String(i).replace('ncert_kemh1_', ''))));

let walked = 0, maxOv = 0;
const proseLeaks = [];
for (let i = 0; i < ids.length; i += 1) {
  await seedStudentForBrowserQa(p);
  await clickByText(p, 'Straight Lines');
  await p.evaluate((n) => { const r = [...document.querySelectorAll('[data-artifact-id]')][n]; (r?.querySelector('button,a,[role=button]') || r)?.click(); }, i);
  await new Promise((r) => setTimeout(r, 600));
  let st = 0;
  for (const s of STAGES) {
    if (await clickByText(p, s, 300)) st += 1;
    // Inspect the rendered prose of every stage, which is the gate that matters.
    const txt = await p.evaluate(() => document.body.innerText);
    const m = txt.match(RAW);
    if (m) proseLeaks.push(`${ids[i]} @${s}: ${JSON.stringify(m[0])}`);
  }
  const fin = await clickByText(p, 'Finish');
  const ov = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  maxOv = Math.max(maxOv, ov);
  if (st === 5 && fin) walked += 1;
  console.log(`  ${String(ids[i]).replace('ncert_kemh1_', '').padEnd(34)} stages ${st}/5 finish ${fin} ov ${ov}px`);
}
console.log('WALKED:', walked + '/' + ids.length, '| max overflow', maxOv + 'px');
console.log('RENDERED PROSE LEAKS:', proseLeaks.length);
for (const l of proseLeaks.slice(0, 6)) console.log('   ', l);
console.log('CONSOLE errors=' + errs.length, 'warnings=' + warns.length);
if (errs.length) console.log('   ', JSON.stringify(errs.slice(0, 3)));
if (warns.length) console.log('   ', JSON.stringify(warns.slice(0, 3)));
await b.close();
