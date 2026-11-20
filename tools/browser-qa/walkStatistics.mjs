import pup from 'puppeteer';
import { seedStudentForBrowserQa, clickByText } from './studentFixture.mjs';
const STAGES = ['Learn the idea', 'See it', 'Worked examples', 'Try it', 'Think deeper'];
const RAW = /:\s*(?:true|false|null|undefined|NaN|Infinity)\b|\[object [A-Z]|\{"[a-z]+":|contentArtifactId|\d+e\+\d/;
const errs = [], warns = [];
const b = await pup.launch({ args: ['--no-sandbox', '--disable-dev-shm-usage'] });
const p = await b.newPage();
p.on('console', (m) => { const t = m.text().slice(0, 80); if (m.type() === 'error') errs.push(t); else if (m.type() === 'warning') warns.push(t); });
p.on('pageerror', (e) => errs.push('UNCAUGHT: ' + String(e.message).slice(0, 80)));
await p.setViewport({ width: 1280, height: 900 });
await seedStudentForBrowserQa(p);
console.log('HEADER:', JSON.stringify(await p.evaluate(() => (document.body.innerText.match(/\d+ chapters from your textbook[^\n]*/) || [''])[0])));
await p.evaluate(() => [...document.querySelectorAll('button')].find((e) => /^Chapter 13(?!\d)/.test((e.textContent || '').trim()))?.click());
await new Promise((r) => setTimeout(r, 700));
const rows = await p.evaluate(() => [...document.querySelectorAll('[data-artifact-id]')].map((e) => e.getAttribute('data-artifact-id')));
console.log('CHAPTER 8 rows:', rows.length);
let stages = 0, finishes = 0; const leaks = [];
for (const id of rows) {
  await p.evaluate((a) => document.querySelector(`[data-artifact-id="${a}"]`)?.click(), id);
  await new Promise((r) => setTimeout(r, 560));
  let st = 0, text = '', table = null;
  for (const s of STAGES) {
    if (await clickByText(p, s, 270)) st += 1;
    const t = await p.evaluate(() => document.body.innerText);
    text += t;
    const m = t.match(RAW); if (m) leaks.push(`${id}@${s}: ${JSON.stringify(m[0])}`);
    if (s === 'See it' && table === null) {
      table = await p.evaluate(() => {
        const el = document.querySelector('[data-visual-kind="limit_table"]');
        if (!el) return null;
        const cells = [...el.querySelectorAll('td')].map((d) => d.textContent.trim());
        return { cells: cells.length, firstFew: cells.slice(0, 8) };
      });
    }
  }
  stages += st;
  if (await clickByText(p, 'Finish', 380)) finishes += 1;
  const short = id.replace('ncert_kemh1_s', '').replace('_lesson', '');
  if (/13_5_4_shortcut/.test(id)) {
    const nums = [...new Set((text.match(/\b\d+(?:\.\d+)?\b/g) || []))];
    const has49 = /\b49\b/.test(text);
    console.log(`      shortcut lesson: variance 49 visible = ${has49} | numbers seen: ${nums.slice(0, 14).join(' ')}`);
  }
  const c = {
    sameCentreDifferentSpread: /both have mean|same mean|mean 5/i.test(text),
    maxMinRange: /largest|smallest/i.test(text) && /range/i.test(text),
    rangeLimitation: /only two observations|ignore|extremes/i.test(text),
    centreIsMean: /mean/i.test(text),
    centreIsMedian: /median/i.test(text),
    absoluteDeviation: /absolute deviation|absolute value/i.test(text),
    frequencyWeighted: /frequenc/i.test(text),
    squaredDeviation: /squared deviation|square/i.test(text),
    varianceAndSd: /variance/i.test(text) && /standard deviation/i.test(text),
    discreteAndContinuous: /discrete frequency/i.test(text) && /continuous frequency/i.test(text),
    stepDeviation: /step deviation/i.test(text),
    directResultShown: /direct method/i.test(text),
    bothAgree: /matching the direct|the same number|they agree|the two agree/i.test(text),
    nMinusOne: /n\s*[-−]\s*1/.test(text),
  };
  const on = Object.entries(c).filter(([, v]) => v).map(([k]) => k);
  console.log(`  ${short.padEnd(28)} ${st}/5 | ${on.join(',')}`);
  if (table) console.log(`      partial-sum table: ${JSON.stringify(table)}`);
  await p.evaluate(() => [...document.querySelectorAll('button')].find((e) => /^(Back|All chapters|Chapter 8)/.test((e.textContent || '').trim()))?.click());
  await new Promise((r) => setTimeout(r, 430));
}
console.log(`WALK: ${rows.length}/7 lessons | ${stages}/35 stages | Finish ${finishes}/7`);
console.log('RAW LEAKS:', leaks.length, leaks.slice(0, 2).join(' ;; '));
console.log('CONSOLE errors=' + errs.length, 'warnings=' + warns.length);
await b.close();
