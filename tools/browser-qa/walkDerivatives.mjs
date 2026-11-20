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
await p.evaluate(() => [...document.querySelectorAll('button')].find((e) => /^Chapter 12(?!\d)/.test((e.textContent || '').trim()))?.click());
await new Promise((r) => setTimeout(r, 700));
const rows = await p.evaluate(() => [...document.querySelectorAll('[data-artifact-id]')].map((e) => e.getAttribute('data-artifact-id')));
console.log('CHAPTER 12 rows:', rows.length);
const targets = rows.filter((r) => /first_principles|algebra_of_derivatives/.test(r));
let stages = 0, finishes = 0; const leaks = [];
for (const id of targets) {
  await p.evaluate((a) => document.querySelector(`[data-artifact-id="${a}"]`)?.click(), id);
  await new Promise((r) => setTimeout(r, 600));
  let st = 0; let text = '';
  const found = {};
  for (const s of STAGES) {
    if (await clickByText(p, s, 280)) st += 1;
    const t = await p.evaluate(() => document.body.innerText);
    text += t;
    const m = t.match(RAW); if (m) leaks.push(`${id}@${s}: ${JSON.stringify(m[0])}`);
    if (s === 'See it') {
      Object.assign(found, await p.evaluate(() => {
        const proof = document.querySelector('[data-visual-kind="proof_layout"]');
        const table = document.querySelector('[data-visual-kind="limit_table"]');
        const pt = proof ? proof.textContent || '' : '';
        return {
          proofParts: ['Claim', 'Base case', 'Induction hypothesis', 'Inductive step', 'Conclusion'].filter((h) => pt.includes(h)),
          quotientTable: Boolean(table),
          // the table must not carry a row for h = 0
          zeroRow: table ? [...table.querySelectorAll('tr')].some((r) => r.querySelector('td')?.textContent?.trim() === '0') : null,
        };
      }));
    }
  }
  stages += st;
  if (await clickByText(p, 'Finish', 400)) finishes += 1;
  const short = id.replace('ncert_kemh1_s', '').replace('_lesson', '');
  const checks = {
    differenceQuotient: /difference quotient/i.test(text),
    hApproachesZero: /approaches 0|h → 0|as h approaches/i.test(text),
    noSubstitutionAtZero: !/set h = 0|put h = 0|substitut\w+ h = 0/i.test(text) && /no value at h = 0|undefined|has no value/i.test(text),
    pointVsFunction: /f′\(3\)|derivative at a point/i.test(text) && /f′\(x\)|as a function/i.test(text),
    sumRule: /sum/i.test(text), productRule: /product rule|two terms/i.test(text),
    quotientRule: /quotient rule|denominator/i.test(text),
    polynomial: /polynomial/i.test(text), trigonometric: /trigonometric/i.test(text),
    radians: /radian/i.test(text), domainRestriction: /not zero|excluded|no value where/i.test(text),
    chainRuleTaught: /chain rule|outer function|inner function/i.test(text),
  };
  console.log(`  ${short}: ${st}/5 stages`);
  console.log(`      ${JSON.stringify(found)}`);
  console.log(`      ${JSON.stringify(checks)}`);
  await p.evaluate(() => [...document.querySelectorAll('button')].find((e) => /^(Back|All chapters|Chapter 12)/.test((e.textContent || '').trim()))?.click());
  await new Promise((r) => setTimeout(r, 450));
}
console.log(`WALK: ${targets.length}/2 lessons | ${stages}/10 stages | Finish ${finishes}/2`);
console.log('RAW LEAKS:', leaks.length, leaks.slice(0, 2).join(' ;; '));
console.log('CONSOLE errors=' + errs.length, 'warnings=' + warns.length);
await b.close();
