import pup from 'puppeteer';
import { seedStudentForBrowserQa, clickByText } from './studentFixture.mjs';
const STAGES = ['Learn the idea', 'See it', 'Worked examples', 'Try it', 'Think deeper'];
const RAW = /:\s*(?:true|false|null|undefined|NaN|Infinity)\b|\[object [A-Z]|\{"[a-z]+":|contentArtifactId/;
const errs = [], warns = [];
const b = await pup.launch({ args: ['--no-sandbox', '--disable-dev-shm-usage'] });
const p = await b.newPage();
p.on('console', (m) => { const t = m.text().slice(0, 80); if (m.type() === 'error') errs.push(t); else if (m.type() === 'warning') warns.push(t); });
p.on('pageerror', (e) => errs.push('UNCAUGHT: ' + String(e.message).slice(0, 80)));
await p.setViewport({ width: 1280, height: 900 });
const seed = await seedStudentForBrowserQa(p);
console.log('ACTIVE:', seed.confirmedBy);
const header = await p.evaluate(() => (document.body.innerText.match(/\d+ chapters from your textbook[^\n]*/) || [''])[0]);
console.log('HEADER:', JSON.stringify(header));
console.log('EIGHTH CHAPTER SHOWN:', /^8 chapters/.test(header));
// The prerequisite must be reachable, and ordered before Chapter 7's slot.
const nav = await p.evaluate(() => {
  const txt = document.body.innerText;
  return { prerequisiteVisible: /prerequisite/i.test(txt), fakeNcert: /NCERT/i.test(txt) };
});
console.log('NAV:', JSON.stringify(nav));
// Reach it the way a student does, through the catalogue, rather than by a
// constructed URL — the route shape is the product's business, not mine.
const opened = await p.evaluate(() => {
  const row = document.querySelector('[data-artifact-id="cbse_fo4_induction_lesson"]');
  row?.click();
  return Boolean(row);
});
console.log('OPENED FROM CATALOGUE:', opened);
await new Promise((r) => setTimeout(r, 700));
let st = 0; const leaks = []; let headings = [];
for (const s of STAGES) {
  if (await clickByText(p, s, 300)) st += 1;
  const m = (await p.evaluate(() => document.body.innerText)).match(RAW);
  if (m) leaks.push(`@${s}: ${JSON.stringify(m[0])}`);
  if (s === 'See it') {
    // Captured WHILE the figure's stage is shown; after the loop the stage
    // has moved on and the figure is no longer in the document.
    headings = await p.evaluate(() => {
      const fig = document.querySelector('figure[aria-label], [role=group][aria-label]');
      const t = fig ? fig.textContent || '' : '';
      return ['Claim', 'Base case', 'Induction hypothesis', 'Inductive step', 'Conclusion']
        .filter((h) => t.includes(h));
    });
  }
}
const fin = await clickByText(p, 'Finish');
const ov = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
console.log(`WALK: ${st}/5 stages | Finish ${fin} | overflow ${ov}px`);
console.log('PROOF HEADINGS RENDERED:', JSON.stringify(headings));
console.log('NO FAKE NCERT ON LESSON:', !(await p.evaluate(() => /NCERT|Chapter \d/.test(document.body.innerText))));
console.log('RENDERED PROSE LEAKS:', leaks.length, leaks.join(' ;; '));
console.log('CONSOLE errors=' + errs.length, 'warnings=' + warns.length);
await b.close();
