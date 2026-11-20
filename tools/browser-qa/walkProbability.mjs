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
await p.evaluate(() => [...document.querySelectorAll('button')].find((e) => /^Chapter 14(?!\d)/.test((e.textContent || '').trim()))?.click());
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
  const c = {
    sampleSpaceSet: /S = \{/.test(text),
    eventAsSubset: /subset of the sample space/i.test(text),
    notAndOr: /complement|intersection|union/i.test(text),
    inclusiveOr: /at least one|inclusive/i.test(text),
    exhaustive: /exhaustive/i.test(text),
    mutuallyExclusive: /mutually exclusive/i.test(text),
    axioms: /total(ling)? (exactly )?1|negative/i.test(text),
    equallyLikelyDerived: /1\/n|forced|equally likely/i.test(text),
    overlapSubtraction: /counted twice|overlap/i.test(text),
    exactFraction: /\d\/\d/.test(text),
    decimalProbability: /0\.1666|0\.8333|0\.333333/.test(text),
    internalLabels: /FORMATIVE_ONLY|SUMMATIVE_CORE|REQUIRED_PREREQUISITE|summativeEligible/.test(text),
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
